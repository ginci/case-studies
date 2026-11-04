# Handoff: Ginci portfolio (updated 2026-11-04, evening)

Framer project: "Ginci Portfolio — Iteration 3" (My Team)
https://framer.com/projects/Ginci-Portfolio-Iteration-3--vQYX53a0u7he9Kdenr94-7S9HO

**The site is built and passes Framer's publish check. It has never been published.**
Next for Gift: write the case-study content in the CMS, send the social links, then publish.

## What's in this folder
| File | What it is |
|---|---|
| `content.mjs` | All CMS copy for the "Projects" collection. Brackets = missing facts. |
| `seed.mjs` | Talks to Framer. `check`, `dump`, `seed` (first time only), `sync` (update the CMS in place from content.mjs). Reads the key from `FRAMER_API_KEY`. Never publishes. |
| `ThemeToggle.tsx` | Copy of the Framer code file of the same name: site CSS, theme toggle, hover preview, CMS accents, TOC, reveal motion. Framer is the source of truth; paste over it there if you change this copy. |
| `package.json` | `npm i` installs `framer-api`. |

Editing content: either edit the CMS in Framer directly, **or** edit `content.mjs` and run `node seed.mjs sync`.
Don't mix the two: `sync` overwrites the CMS text fields with what's in content.mjs (it leaves images alone).

## How the site is put together now
- **CMS "Projects"** (5 items). Order on Home and the Next links: Tranzakt → NSIA → Content Scribe → MyGreenBlock → Dado → Tranzakt.
  - Fields: Title, Order, Index line, Accent, Case study label, Read time, Kicker, Lede, Result, Client, Role, Timeline, Team, Platforms, Stats, Cover, Preview, S01–S10 label/title/body, S06–S09 image, Step 1–4 label/title/line, Next project.
  - `label` = the short TOC name (e.g. "Treasury"); `title` = the section heading. An empty S-title hides that section and its TOC entry.
  - Not shown on the page yet: Kicker, Result, Team, Stats (kept for later).
- **Case-study page** `/work/:slug` (page "Case study"): header, facts, cover, TOC, 10 section slots, process timeline (section 05), images in 06–09, Next project. Page title/description come from Title/Lede.
- **Home Work list** is a CMS collection list ("Work list" → repeated "Row / Project"), numbered by item index, linking to each case study. "View more work on Dribbble ↗" button under it.
- **Accent colours** come from the CMS: hidden 1×1 layers "Accent swatch" / "Next accent swatch" / "Preview swatch" have their fill bound to Accent / Next project.Accent / Preview; ThemeToggle.tsx reads them. Don't delete those layers.
- **Hover preview** on Home uses each project's Preview image; projects without one show a card in their accent colour. Tranzakt and Dado have previews.
- Old hand-built `/dado` page: set to **draft** (kept for reference). `/dado-2` is an empty leftover: **delete it** in Framer (the API can't delete pages).

## Fixed this round
- **Theme toggle didn't work**: rewritten. Clicks are handled at the document level (doesn't depend on Framer passing the override's click through), the light theme inverts the root element (covers the preview, grain and rails too), keyboard works, choice persists.
- **Broken CSS**: a stray `}` swallowed the whole tablet block, and a stray `")}")}` leaked a phone-only rule (Next project arrow) to every width and dropped the row accent default. Rewritten as one clean stylesheet; old duplicated "restatement" blocks removed.
- **Phones had sideways scroll** before sections animated in (slide-in from the right). `#main` now clips horizontal overflow.
- **Work rows**: page background at rest; on hover the row shows a surface tinted with that project's accent. Work section now on the page background.
- **Socials** grouped with the email (Contact → "Email group"), no longer reading as footer links.
- **Links**: nothing linked anywhere before. Nav Work/About/Contact → section anchors, Email me + email → mailto, View work → #work, rows → case studies, crumb → #work.
- Site title/description were Framer's defaults ("My Framer Site"). Now "Gift Njom — Ginci Designs".

## Still open
1. **Social links** (LinkedIn, Dribbble, Behance, Read.cv) have no URLs. The "View more work" button points to dribbble.com until the profile URL is known.
2. **Content**: everything in [brackets] in the CMS; Content Scribe and MyGreenBlock are placeholders; NSIA mostly. Tranzakt needs a Cover image.
3. **Real-device check** after publishing: 390 / 834 / 1200, dark + light, Home + each case study. (Tested here in a local browser harness and Framer canvas renders; Framer can't render 390px without publishing.)
4. Accent colours for Content Scribe (#8C7CF0) and NSIA/Dado are placeholders until confirmed.
5. Framer plan limits found: no branching, no redirects.
6. Tickets queued: logo-hover switcher for Ginci Designs / GNC Merch / GNC Scenes; hero photo of Gift.

## Decisions log
- No design-system sections (Gift, 2026-11-02).
- Tranzakt: two user types (customers, merchants). Scope led by consolidated login, payment gateway, KYC/KYB updates, merchant dashboard updates. Deep dives: Treasury, Checkout, KYC/KYB (real copy from content/case-studies.json), Merchant dashboard (Merchant AI framing + placeholder for shipped updates). Website moved into Scope (Gift, 2026-11-04).
- Home starts with Tranzakt; the list ends with a link to Dribbble instead of Load more (Gift, 2026-11-04).
