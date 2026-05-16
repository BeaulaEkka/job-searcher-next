import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAI, model } from "../../../lib/openai";
import { readJson, writeJson } from "../../../lib/storage";
import type { ApplicationDraft } from "../../../types";

export const runtime = "nodejs";

const schema = z.object({
  resume: z.any(),
  job: z.any(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());

    if (!body.resume?.rawText) {
      return NextResponse.json(
        { error: "Missing resume text." },
        { status: 400 }
      );
    }

    if (!body.job?.title || !body.job?.description) {
      return NextResponse.json(
        { error: "Missing job title or description." },
        { status: 400 }
      );
    }

    const openai = getOpenAI();

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are an expert career coach for jobs in the Netherlands. Write honest, ATS-friendly resumes and cover letters. Do not invent experience. Return valid JSON only.",
        },
        {
          role: "user",
          content: `
Create a tailored resume and cover letter for this job.

Resume:
${body.resume.rawText}

Job title:
${body.job.title}

Company:
${body.job.company}

Location:
${body.job.location}

Job description:
${body.job.description}

Return JSON with exactly these keys:
{
  "tailoredResumeMarkdown": "...",
  "coverLetterMarkdown": "..."
}
`,
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "OpenAI returned an empty response." },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(content);

    const draft: ApplicationDraft = {
      id: crypto.randomUUID(),
      jobId: body.job.id ?? crypto.randomUUID(),
      company: body.job.company ?? "Unknown company",
      title: body.job.title,
      jobUrl: body.job.url ?? "",
      tailoredResumeMarkdown: parsed.tailoredResumeMarkdown ?? "",
      coverLetterMarkdown: parsed.coverLetterMarkdown ?? "",
      createdAt: new Date().toISOString(),
      status: "draft",
    };

    const existing = await readJson<ApplicationDraft[]>("applications.json", []);
    await writeJson("applications.json", [draft, ...existing]);

    return NextResponse.json(draft);
  } catch (error) {
    console.error("generate-application failed:", error);

    return NextResponse.json(
      {
        error: "Generate application failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}