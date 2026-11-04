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

## Tranzakt mockups (2026-11-04)
- Built from current Figma screens (Treasury `ra8HHfBAgq0D6OrDsoNU2Z`, Merchants `TzCgD5SXWEIjB1AseKxHt6`):
  Treasury dashboard 1244:10571 · KYB status hub 38670:424180 · merchant dashboard 37388:619580 · mobile KYB 37848:10076, 37824:10076.
- `mockups/mock.cjs` composes them (browser + phone on a Tranzakt-green backdrop) at 2× (preview 3×). Export screens with the Figma MCP
  `get_screenshot` into the same folder as `treasury@1x.png` etc., run `node mock.cjs`, then upload to the CMS.
- In CMS: Cover, Preview, S06 (Treasury), S08 (KYC/KYB), S09 (merchant dashboard). **S07 (checkout) has no image yet**: the checkout frames
  weren't found (Treasury "Payment Gateway" frames are hidden).
- **Fix in Figma:** the Treasury dashboard's "Net flow today" says +₦87.85B; 184,293,000 − 96,441,500 = **₦87.85M**. The mockups were
  corrected (B→M patched in the export); fix the source so future exports match.

## Copy (2026-11-04)
- Home rewritten for a senior product designer: kicker (title, 6+ years, Enugu), headline "I make complex financial and operational
  products feel calm.", scope-and-ownership lede, About keeps the Enugu story and adds how Gift leads, Contact "Have a complex product to
  untangle? Let's talk.", footer status "Designing at Tranzakt". About pill: "Senior product designer · Enugu, Nigeria".
- Tranzakt: role Senior Product Designer; Overview = challenge / my role / outcome; Context names the four products correctly
  (Tranzpay = **payroll**); Problem frames constraints; Treasury leads with the decision; KYC adds the status hub; merchant dashboard
  rewritten from the real first-run screen. Still open: Outcome numbers, process steps, checkout image.

## Outcomes, coming soon, locked projects (2026-11-04)
- **Outcome lines** describe what the design solved instead of numbers (Tranzakt, Dado). `Result` holds the one-liner; the Overview has
  "What the design solved". NSIA, Content Scribe and MyGreenBlock carry a bracketed prompt in the same style.
- **Locked projects:** CMS field `Locked` (on/off). A locked project shows the "Project locked" card on hover and, on its page, the
  "Locked panel" (Under NDA, Request access → email). Keep its sections empty: everything in the CMS is public in the page source, so the
  real case study is shared privately (password-protected page or PDF) after a request. Framer's page password works per page, not per CMS item.
- `[Confidential project]` (slug `confidential`) is a placeholder locked entry: rename it and fill Kicker/Index line.
- MyGreenBlock uses the "coming soon" card as Preview and Cover. `mockups/cards.cjs` renders both card types.

## Decisions log
- No design-system sections (Gift, 2026-11-02).
- Tranzakt: two user types (customers, merchants). Scope led by consolidated login, payment gateway, KYC/KYB updates, merchant dashboard updates. Deep dives: Treasury, Checkout, KYC/KYB (real copy from content/case-studies.json), Merchant dashboard (Merchant AI framing + placeholder for shipped updates). Website moved into Scope (Gift, 2026-11-04).
- Home starts with Tranzakt; the list ends with a link to Dribbble instead of Load more (Gift, 2026-11-04).
