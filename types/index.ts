export type ResumeProfile = {
  rawText: string;
  targetRoles: string[];
  locationPreference: string;
  workAuthorization?: string;
  languages: string[];
  skills: string[];
  seniority?: string;
  summary?: string;
};

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
  salary?: string;
  postedAt?: string;
  remote?: boolean;
};

export type JobMatch = Job & {
  score: number;
  reasons: string[];
  gaps: string[];
  keywordHits: string[];
};

export type ApplicationDraft = {
  id: string;
  company: string;
  jobId: string;
  title: string;
  createdAt: string;
  status: "draft" | "reviewed" | "applied" | "rejected" | "interview" | "offer";
  tailoredResumeMarkdown: string;
  coverLetterMarkdown: string;
  outreachMessage?: string;
  notes?: string;
};
