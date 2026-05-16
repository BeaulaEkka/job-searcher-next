"use client";

import { useEffect, useState } from "react";


import { Header } from "../../components/Header";
import { ApplicationDraft } from "../../types";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationDraft[]>([]);

  async function load() {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data.applications ?? []);
  }

  async function updateStatus(id: string, status: ApplicationDraft["status"]) {
    const res = await fetch("/api/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    const data = await res.json();
    setApplications(data.applications ?? []);
  }

  useEffect(() => { load(); }, []);

  return (
    <main>
      <Header />
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="card p-6">
          <h2 className="text-2xl font-bold">Application tracker</h2>
          <p className="mt-2 text-sm text-slate-600">Update each application after you review and submit it manually.</p>
          <div className="mt-6 space-y-4">
            {applications.map((app) => (
              <article key={app.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Job ID: {app.jobId}</p>
                    <p className="text-sm text-slate-500">Created {new Date(app.createdAt).toLocaleString()}</p>
                  </div>
                  <select className="input max-w-48" value={app.status} onChange={(e) => updateStatus(app.id, e.target.value as ApplicationDraft["status"])}>
                    <option value="draft">Draft</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                {app.notes && <p className="mt-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">{app.notes}</p>}
              </article>
            ))}
            {!applications.length && <p className="rounded-2xl bg-slate-100 p-4 text-sm text-slate-500">No applications yet.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}
