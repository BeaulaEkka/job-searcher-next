import type { ResumeProfile } from "../types";

type RoleRule = {
  query: string;
  keywords: string[];
};

const roleRules: RoleRule[] = [
  {
    query: "frontend developer",
    keywords: ["frontend", "front-end", "react", "next.js", "vue", "nuxt", "javascript", "typescript", "tailwind"],
  },
  {
    query: "backend developer",
    keywords: ["backend", "back-end", "node.js", "express", "java", "spring", "php", "laravel", "python", "django"],
  },
  {
    query: "full stack developer",
    keywords: ["full stack", "full-stack", "react", "node.js", "mongodb", "mysql", "postgresql", "laravel"],
  },
  {
    query: "ux designer",
    keywords: ["ux", "ui", "figma", "adobe xd", "wireframe", "prototype", "user research"],
  },
  {
    query: "graphic designer",
    keywords: ["graphic design", "photoshop", "illustrator", "indesign", "branding", "print design"],
  },
  {
    query: "data analyst",
    keywords: ["data analyst", "excel", "sql", "power bi", "tableau", "python", "analytics", "dashboard"],
  },
  {
    query: "business analyst",
    keywords: ["business analyst", "requirements", "stakeholder", "process improvement", "user stories"],
  },
  {
    query: "project manager",
    keywords: ["project manager", "scrum", "agile", "planning", "delivery", "risk management"],
  },
  {
    query: "product manager",
    keywords: ["product manager", "roadmap", "product strategy", "user stories", "go to market"],
  },
  {
    query: "marketing manager",
    keywords: ["marketing", "seo", "campaigns", "social media", "content strategy", "google analytics"],
  },
  {
    query: "customer support specialist",
    keywords: ["customer support", "technical support", "helpdesk", "service desk", "zendesk"],
  },
  {
    query: "hr specialist",
    keywords: ["hr", "human resources", "recruitment", "onboarding", "payroll", "employee relations"],
  },
  {
    query: "payroll specialist",
    keywords: ["payroll", "salary", "hr operations", "workday", "adp", "sap successfactors"],
  },
  {
    query: "office manager",
    keywords: ["office manager", "administration", "calendar management", "travel coordination"],
  },
  {
    query: "sales representative",
    keywords: ["sales", "crm", "lead generation", "account management", "business development"],
  },
];

const stopWords = new Set([
  "and",
  "the",
  "with",
  "for",
  "from",
  "that",
  "this",
  "are",
  "you",
  "your",
  "into",
  "over",
  "under",
  "full",
  "stack",
  "work",
  "years",
  "experience",
  "education",
  "skills",
  "languages",
  "english",
  "dutch",
]);

export function inferSearchQueriesFromResume(resumeText: string, maxQueries = 5): string[] {
  const text = resumeText.toLowerCase();

  const scoredRoles = roleRules
    .map((role) => {
      const hits = role.keywords.filter((keyword) => text.includes(keyword));
      return {
        query: role.query,
        score: hits.length,
      };
    })
    .filter((role) => role.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((role) => role.query);

  const explicitTitles = extractLikelyTitles(resumeText);

  const merged = [...explicitTitles, ...scoredRoles];

  const unique = Array.from(new Set(merged));

  return unique.slice(0, maxQueries).length ? unique.slice(0, maxQueries) : ["jobs"];
}

function extractLikelyTitles(resumeText: string): string[] {
  const lines = resumeText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const titleKeywords = [
    "developer",
    "designer",
    "manager",
    "analyst",
    "consultant",
    "engineer",
    "specialist",
    "administrator",
    "coordinator",
    "assistant",
    "trainer",
    "coach",
    "support",
    "accountant",
    "recruiter",
    "marketer",
    "sales",
  ];

  return lines
    .slice(0, 25)
    .filter((line) => {
      const lower = line.toLowerCase();
      return (
        line.length <= 60 &&
        titleKeywords.some((keyword) => lower.includes(keyword)) &&
        !lower.includes("http") &&
        !lower.includes("@")
      );
    })
    .map((line) =>
      line
        .replace(/[|•]/g, " ")
        .replace(/\s+/g, " ")
        .toLowerCase()
    )
    .slice(0, 3);
}

export function buildResumeProfile(resumeText: string, locationPreference = "Netherlands"): ResumeProfile {
  const queries = inferSearchQueriesFromResume(resumeText, 5);

  return {
    rawText: resumeText,
    targetRoles: queries,
    locationPreference,
    languages: extractLanguages(resumeText),
    skills: extractSkills(resumeText),
  };
}

function extractLanguages(resumeText: string): string[] {
  const text = resumeText.toLowerCase();
  const languages = ["english", "dutch", "german", "french", "spanish", "hindi"];

  return languages
    .filter((language) => text.includes(language))
    .map((language) => language.charAt(0).toUpperCase() + language.slice(1));
}

function extractSkills(resumeText: string): string[] {
  const knownSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Vue",
    "Nuxt",
    "Node.js",
    "Python",
    "Java",
    "PHP",
    "Laravel",
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Power BI",
    "Tableau",
    "Excel",
    "Figma",
    "Photoshop",
    "Illustrator",
    "InDesign",
    "SEO",
    "Google Analytics",
    "Salesforce",
    "HubSpot",
    "Zendesk",
    "Workday",
    "ADP",
    "SAP",
    "Microsoft 365",
    "SharePoint",
    "Power Automate",
    "Agile",
    "Scrum",
  ];

  const text = resumeText.toLowerCase();

  return knownSkills.filter((skill) => text.includes(skill.toLowerCase()));
}