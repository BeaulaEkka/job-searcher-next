import { NextResponse } from "next/server";
import { z } from "zod";


import { readJson, writeJson } from "../../../lib/storage";
import { ApplicationDraft } from "../../../types";

export async function GET() {
  const applications = await readJson<ApplicationDraft[]>("applications.json", []);
  return NextResponse.json({ applications });
}

const patchSchema = z.object({ id: z.string(), status: z.enum(["draft", "reviewed", "applied", "rejected", "interview", "offer"]) });

export async function PATCH(req: Request) {
  const { id, status } = patchSchema.parse(await req.json());
  const applications = await readJson<ApplicationDraft[]>("applications.json", []);
  const next = applications.map((app) => app.id === id ? { ...app, status } : app);
  await writeJson("applications.json", next);
  return NextResponse.json({ applications: next });
}
