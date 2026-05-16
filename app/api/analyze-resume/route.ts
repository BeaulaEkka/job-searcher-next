import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAI, model } from "@/lib/openai";

const schema = z.object({ resumeText: z.string().min(50) });

export async function POST(req: Request) {
  const { resumeText } = schema.parse(await req.json());
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      { role: "system", content: "Extract a structured job-search profile from the resume. Return concise JSON only." },
      { role: "user", content: `Resume:\n${resumeText}\n\nJSON keys: summary, targetRoles, skills, seniority, languages, industries, strengths, risksForNetherlandsJobs.` }
    ]
  });
  return NextResponse.json({ profile: completion.choices[0]?.message?.content ?? "{}" });
}
