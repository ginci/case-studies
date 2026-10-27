// Generates the Framer CMS CSV from content/case-studies.json.
// Run: node scripts/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const studies = JSON.parse(readFileSync(join(root, "content/case-studies.json"), "utf8"));

const MAX_STATS = 6;
const MAX_SECTIONS = 4;
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const ul = (items) => (items?.length ? `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "");

// One row per case study. Flat columns map 1:1 onto Framer CMS fields.
const rows = studies.map((s) => {
  const r = {
    Slug: s.slug,
    Status: s.status,
    Title: s.title,
    Client: s.client,
    Category: s.category,
    Role: s.role,
    Timeline: s.timeline,
    Team: s.team,
    Accent: s.accent,
    "Outcome Line": s.outcomeLine,
    "Outcome Result": s.outcomeResult,
    "Cover Image": s.coverImage,
    Context: `<p>${esc(s.context)}</p>`,
    Problem: `<p>${esc(s.problem)}</p>`,
    Scope: ul(s.scope),
  };
  for (let i = 0; i < MAX_STATS; i++) {
    r[`Stat ${i + 1} Value`] = s.stats?.[i]?.value ?? "";
    r[`Stat ${i + 1} Label`] = s.stats?.[i]?.label ?? "";
  }
  for (let i = 0; i < MAX_SECTIONS; i++) {
    const x = s.sections?.[i] ?? {};
    const n = `Section ${i + 1}`;
    r[`${n} Status`] = x.status ?? "";
    r[`${n} Eyebrow`] = x.eyebrow ?? "";
    r[`${n} Heading`] = x.heading ?? "";
    r[`${n} Summary`] = x.summary ?? "";
    r[`${n} Body`] = x.body ? `<p>${esc(x.body)}</p>` : "";
    r[`${n} Decisions`] = ul(x.decisions);
    r[`${n} Demo`] = x.demo ?? "";
    r[`${n} Image`] = x.image ?? "";
  }
  r["Next Steps"] = ul(s.nextSteps);
  r["Next Case Study"] = s.nextCaseStudy ?? "";
  return r;
});

const headers = Object.keys(rows[0]);
const cell = (v) => `"${String(v).replace(/"/g, '""')}"`;
const csv = [headers.map(cell).join(","), ...rows.map((r) => headers.map((h) => cell(r[h])).join(","))].join("\n");
writeFileSync(join(root, "content/case-studies.csv"), csv + "\n");

console.log(`Wrote ${rows.length} row(s), ${headers.length} columns.`);
