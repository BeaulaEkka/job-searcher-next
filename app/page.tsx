"use client";
import { buildResumeProfile, inferSearchQueriesFromResume } from "../lib/resumeSearch";
import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { ScorePill } from "../components/ScorePill";
import { JobMatch } from "../types";



export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [query, setQuery] = useState("");
const [location, setLocation] = useState("Netherlands");
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(null);
  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const profile = useMemo(
  () => buildResumeProfile(resumeText, location),
  [resumeText, location]
);

  async function findJobs() {
  setLoading(true);
  setDraft(null);

  try {
    const queries = query.trim()
      ? [query.trim()]
      : inferSearchQueriesFromResume(resumeText, 4);

    const responses = await Promise.all(
      queries.map((searchQuery) =>
        fetch("/api/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resume: profile,
            query: searchQuery,
            location,
          }),
        }).then((res) => res.json())
      )
    );

    const allJobs = responses.flatMap((data) => data.jobs ?? []);

    const uniqueJobs = Array.from(
      new Map(allJobs.map((job) => [job.id, job])).values()
    );

    setJobs(uniqueJobs.sort((a, b) => b.score - a.score));
    setQuery("");
  } finally {
    setLoading(false);
  }
}

  async function generate(job: JobMatch) {
  setSelectedJob(job);
  setLoading(true);
  setDraft(null);

  try {
    const res = await fetch("/api/generate-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume: profile, job }),
    });

    const text = await res.text();

    if (!text) {
      throw new Error(
        `The generate-application API returned an empty response. Status: ${res.status}`
      );
    }

    const data = JSON.parse(text);

    if (!res.ok) {
      throw new Error(
  data.details || data.error || `Application generation failed. Status: ${res.status}`
);
    }

    setDraft(data);
 } catch (error) {
  console.error("Generate application failed:", error);

  const message =
    error instanceof Error ? error.message : "Unknown error occurred.";

  setDraft({
    tailoredResumeMarkdown: "Generation failed.",
    coverLetterMarkdown: message,
  });
} finally {
  setLoading(false);
}
}

  return (
    <main>
      <Header />
      <section className="mx-auto grid max-w-6xl gap-6 px-6 pb-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="card p-6">
          <div className="mb-5">
            <span className="badge">Human-in-the-loop</span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Find better jobs in the Netherlands and tailor every application.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Paste your resume, search jobs, review the score, then generate a tailored resume and cover letter. The app tracks applications but keeps you in control before submission.</p>
          </div>
          <label className="text-sm font-semibold">Your resume text</label>
          <textarea className="input mt-2 min-h-72" value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste your resume or LinkedIn profile text here..." />
          <label className="mt-4 block text-sm font-semibold">Search query</label>
          <input className="input mt-2" value={query} onChange={(e) => setQuery(e.target.value)} /><label className="mt-4 block text-sm font-semibold">Location</label>
<input
  className="input mt-2"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  placeholder="Amsterdam, Rotterdam, Utrecht, Netherlands..."
/>
          <button className="btn mt-4 w-full" disabled={loading || !resumeText.trim()} onClick={findJobs}>{loading ? "Working..." : "Match Netherlands jobs"}</button>
          <p className="mt-4 text-xs text-slate-500">Tip: Add Dutch language level, work authorization, target city, and strongest tools to improve matching.</p>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Matched jobs</h3>
              <span className="text-sm text-slate-500">{jobs.length} results</span>
            </div>
            <div className="mt-4 space-y-4">
              {jobs.map((job) => (
                <article key={job.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold">{job.title}</h4>
                      <p className="text-sm text-slate-600">{job.company} · {job.location}</p>
                    </div>
                    <ScorePill score={job.score} />
                  </div>
                  <p className="mt-3 line-clamp-3 text-sm text-slate-600">{job.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.keywordHits.slice(0, 6).map((hit) => <span className="rounded-full bg-slate-100 px-2 py-1 text-xs" key={hit}>{hit}</span>)}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="btn" onClick={() => generate(job)}>Generate application</button>
                    <a className="btn-secondary" href={job.url} target="_blank">Open job</a>
                  </div>
                </article>
              ))}
              {!jobs.length && <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-500">No matches yet. Paste your resume and run a search.</p>}
            </div>
          </div>

          {draft && selectedJob && (
            <div className="card p-6">
              <h3 className="text-xl font-bold">Draft for {selectedJob.company}</h3>
              <div className="mt-4 grid gap-4">
                <section>
                  <h4 className="font-semibold">Tailored resume</h4>
                  <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs text-white">{draft.tailoredResumeMarkdown}</pre>
                </section>
                <section>
                  <h4 className="font-semibold">Cover letter</h4>
                  <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 text-xs text-white">{draft.coverLetterMarkdown}</pre>
                </section>
                <a className="btn" href={selectedJob.url} target="_blank">Review and apply on job site</a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
