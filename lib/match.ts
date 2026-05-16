import type { Job, JobMatch, ResumeProfile } from "@/types";

const stopWords = new Set([
  "and", "the", "for", "with", "you", "your", "are", "our", "this", "that", "from", "will", "have", "has", "het", "een", "van", "met", "voor", "wij", "jij", "de"
]);

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !stopWords.has(t));
}

export function scoreJob(resume: ResumeProfile, job: Job): JobMatch {
  const resumeTokens = new Set(tokens([resume.rawText, ...resume.skills, ...resume.targetRoles].join(" ")));
  const jobTokens = tokens(`${job.title} ${job.description}`);
  const uniqueJobTokens = [...new Set(jobTokens)];
  const hits = uniqueJobTokens.filter((t) => resumeTokens.has(t));
  const skillHits = resume.skills.filter((skill) => job.description.toLowerCase().includes(skill.toLowerCase()));
  const targetRoleBoost = resume.targetRoles.some((role) => job.title.toLowerCase().includes(role.toLowerCase())) ? 12 : 0;
  const nlBoost = /netherlands|nederland|amsterdam|rotterdam|utrecht|eindhoven|den haag|the hague/i.test(job.location) ? 8 : 0;
  const languageBoost = resume.languages.some((lang) => new RegExp(lang, "i").test(job.description)) ? 5 : 0;
  const base = Math.min(72, Math.round((hits.length / Math.max(uniqueJobTokens.length, 1)) * 100));
  const score = Math.min(100, base + skillHits.length * 3 + targetRoleBoost + nlBoost + languageBoost);

  const likelyNeedsDutch = /dutch|nederlands|vloeiend nederlands/i.test(job.description);
  const speaksDutch = resume.languages.some((l) => /dutch|nederlands/i.test(l));

  return {
    ...job,
    score,
    keywordHits: [...new Set([...hits.slice(0, 12), ...skillHits])],
    reasons: [
      skillHits.length ? `Matched skills: ${skillHits.slice(0, 5).join(", ")}` : "General resume/job keyword overlap found",
      targetRoleBoost ? "Job title matches one of your target roles" : "Role is adjacent to your target profile",
      nlBoost ? "Located in the Netherlands or mentions Dutch market" : "Location needs manual review"
    ],
    gaps: [
      likelyNeedsDutch && !speaksDutch ? "Job may require Dutch language proficiency" : "",
      score < 60 ? "Match score is below target; tailor carefully or skip" : ""
    ].filter(Boolean)
  };
}

export function rankJobs(resume: ResumeProfile, jobs: Job[]): JobMatch[] {
  return jobs.map((job) => scoreJob(resume, job)).sort((a, b) => b.score - a.score);
}
