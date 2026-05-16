import { BriefcaseBusiness } from "lucide-react";

export function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-brand p-2 text-white"><BriefcaseBusiness size={22} /></div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">NL Job Searcher</p>
          <h1 className="text-xl font-bold">Resume match and application builder</h1>
        </div>
      </div>
      <a className="btn-secondary" href="/applications">Applications</a>
    </header>
  );
}
