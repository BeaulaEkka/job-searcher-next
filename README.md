# Netherlands Job Searcher - Next.js

A human-in-the-loop job search app for the Netherlands. It matches your resume to suitable jobs, generates a tailored resume and cover letter, and tracks each application.

## What it does

- Paste your resume text and target search query.
- Search Netherlands jobs through Adzuna when API keys are provided.
- Fall back to sample Netherlands-style jobs so the app works immediately.
- Score jobs against your resume using skills, keywords, role title, language, and location signals.
- Generate truthful, ATS-friendly tailored resume and cover letter drafts with OpenAI.
- Track application status: draft, reviewed, applied, interview, offer, rejected.

## What it intentionally does not do

It does not automatically mass-submit applications on your behalf. Many job boards prohibit automated submissions, and low-quality mass applications can hurt your chances. This app prepares strong applications and opens the job URL for your final review and submission.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

```bash
OPENAI_API_KEY=your_openai_key
OPENAI_MODEL=gpt-4.1-mini
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
```

Adzuna keys are optional. Without them, the app uses sample jobs for testing.

## Recommended next upgrades

1. Add PDF/DOCX resume upload and parsing.
2. Add DOCX/PDF export for tailored resumes and cover letters.
3. Add Gmail draft creation for recruiter outreach.
4. Add more job APIs such as Indeed publisher integrations, LinkedIn manual import, company career pages, or ATS feeds.
5. Replace JSON file storage with Postgres and Prisma for production.
6. Add authentication so multiple users can safely use it.
7. Add a browser extension or bookmarklet to import jobs from any career page.

## Production notes

- Keep OpenAI and job-board API keys server-side only.
- Do not invent resume facts. The AI prompt explicitly prevents fake claims, but users must review drafts.
- Store personal resume/application data securely. Use encrypted storage for production.
- Check each job board's terms before adding automation.
