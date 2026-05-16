import OpenAI from "openai";

export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY. Add it to .env.local.");
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";
