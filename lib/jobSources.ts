import { Job } from "../types";


function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function searchAdzunaJobs(query: string, location = "Netherlands"): Promise<Job[]> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return [];

  const url = new URL("https://api.adzuna.com/v1/api/jobs/nl/search/1");
  url.searchParams.set("app_id", appId);
  url.searchParams.set("app_key", appKey);
  url.searchParams.set("what", query);
  url.searchParams.set("where", location);
  url.searchParams.set("results_per_page", "30");
  url.searchParams.set("content-type", "application/json");

  const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
  if (!res.ok) throw new Error(`Adzuna search failed: ${res.status}`);
  const data = await res.json();
  return (data.results ?? []).map((item: any): Job => ({
    id: `adzuna-${item.id}`,
    title: item.title ?? "Untitled role",
    company: item.company?.display_name ?? "Unknown company",
    location: item.location?.display_name ?? location,
    description: stripHtml(item.description ?? ""),
    url: item.redirect_url,
    source: "Adzuna",
    salary: item.salary_min && item.salary_max ? `€${Math.round(item.salary_min)} - €${Math.round(item.salary_max)}` : undefined,
    postedAt: item.created
  }));
}

export function sampleNetherlandsJobs(): Job[] {
  return [
    {
      id: "sample-1",
      title: "Payroll Automation Consultant",
      company: "Amsterdam Fintech Group",
      location: "Amsterdam, Netherlands",
      description: "Lead payroll automation, Microsoft 365 workflows, governance, stakeholder management, data validation, HR operations and compliance improvement projects. English required, Dutch preferred.",
      url: "https://example.com/payroll-automation-consultant",
      source: "Sample"
    },
    {
      id: "sample-2",
      title: "HR Systems Implementation Specialist",
      company: "Rotterdam PeopleOps",
      location: "Rotterdam, Netherlands",
      description: "Implement HR systems, payroll integrations, process automation, Power Automate, SharePoint, documentation, user training and change management.",
      url: "https://example.com/hr-systems-specialist",
      source: "Sample"
    },
    {
      id: "sample-3",
      title: "Operations Automation Analyst",
      company: "Utrecht SaaS Labs",
      location: "Utrecht, Netherlands",
      description: "Analyze operational workflows, build dashboards, automate repetitive tasks, design controls, coordinate with finance and HR teams, and improve reporting accuracy.",
      url: "https://example.com/operations-automation-analyst",
      source: "Sample"
    }
  ];
}
