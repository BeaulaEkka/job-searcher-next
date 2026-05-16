import { NextResponse } from "next/server";
import { z } from "zod";
import { sampleNetherlandsJobs, searchAdzunaJobs } from "../../../lib/jobSources";
import { ResumeProfile } from "../../../types";
import { rankJobs } from "../../../lib/match";

const defaultResume: ResumeProfile = {
  rawText: "",
  targetRoles: [],
  locationPreference: "Netherlands",
  languages: ["English"],
  skills: [],
};

const schema = z.object({
  resume: z.custom<ResumeProfile>(),
  query: z.string().min(2),
  location: z.string().default("Netherlands"),
  useSamples: z.boolean().optional(),
});

async function getRankedJobs({
  resume,
  query,
  location,
  useSamples = false,
}: {
  resume: ResumeProfile;
  query: string;
  location: string;
  useSamples?: boolean;
}) {
  const jobs = await searchAdzunaJobs(query, location);

  if (!jobs.length && useSamples) {
    return {
      source: "sample",
      jobs: rankJobs(resume, sampleNetherlandsJobs()),
    };
  }

  return {
    source: "adzuna",
    jobs: rankJobs(resume, jobs),
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query") || "payroll";
  const location = searchParams.get("location") || "Amsterdam";
  const useSamples = searchParams.get("samples") === "true";

  try {
    const result = await getRankedJobs({
      resume: defaultResume,
      query,
      location,
      useSamples,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Job search failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());

    const result = await getRankedJobs({
      resume: body.resume,
      query: body.query,
      location: body.location,
      useSamples: body.useSamples === true,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Job search failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}