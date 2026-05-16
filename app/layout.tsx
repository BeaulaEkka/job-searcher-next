import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Netherlands Job Searcher",
  description: "Match your resume to Dutch jobs and generate tailored applications."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
