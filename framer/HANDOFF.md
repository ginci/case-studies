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
- In CMS: Cover, Preview, S06 (Treasury), S08 (KYC/KYB), S09 (merchant dashboard). S07 (checkout) from the Payment Gateway file.
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
- **MyGreenBlock is locked** (Gift, 2026-11-04): locked cards, sections emptied. The `[Confidential project]` placeholder was removed.
- **Content Scribe uses the "coming soon" card** as Preview and Cover. `mockups/cards.cjs` renders both card types.
- Tranzakt checkout: Payment Gateway UI Explorations 1.0 `2jRfbKXNAV3EqqBCFluTCX`, page V2 (web 6007:114030, mobile 6007:112659 and 6007:109291). Mockup in S07.

## Breakpoints (2026-11-07)
- Home and the Case study page now have real **Tablet (810)** and **Phone (390)** breakpoints, so the canvas shows what visitors get.
  Overrides set on them: section padding, type sizes (headline 60/40, row names 52/30, case title 88/44, section titles 34/28),
  hero/About/footer stacking, nav links hidden on phone, TOC hidden below desktop, facts in two columns, image heights, crumb stacked on phone.
- ThemeToggle.tsx still carries matching media-query rules (with !important) from before the breakpoints existed. They agree with the
  canvas today; if a canvas edit at tablet/phone doesn't show in Preview, a CSS rule is overriding it: remove that rule.
- **Case-study background lightened** to #20201E (nav, header, page), with #2A2A27 for the Next project block and the locked panel.
  Root frame renamed "Case study page" (ThemeToggle uses it for the nav colour).

## Publish-prep pass (2026-11-07)
- Hero: "Gift Njom — Senior Product Designer" / "I design fintech and B2B products people trust." / lede on six years across payments,
  treasury, delivery and supply chain. Section labels lost their numbers (Selected work, About, Contact). Contact: "Building something
  complex? Let's talk." Button: "More work on Dribbble ↗".
- **Portrait section** ("02 Portrait") between hero and Selected work: portrait tile + intro + "More about me ↓" (→ #about).
  **Needs Gift's photo:** select "Portrait (set Fill → Image to your photo)", set its fill to the photo, delete the "GN" monogram.
- About photo pill (AboutPill) **hidden**, not deleted (its gallery was empty and the resume had no file).
- Case studies: section labels and TOC unnumbered; a label is hidden when it equals its heading (Overview/Context/Scope/Process).
- Hover effects (row tint, colour change, Next project arrow) only on devices with a mouse; on phones/tablets a tap just opens the project.
- CMS text is no longer synced from content.mjs by default: Gift edits the CMS directly now (e.g. Title "Tranzakt"). Run `sync` only after
  pulling those edits into content.mjs, or it overwrites them.

## Polish pass (2026-11-08)
- Gift's canvas edits kept: hero/contact copy rewritten by Gift (3 typos fixed), kicker removed, portrait moved after Selected work,
  photo pill visible again, page wrapped in "Page content column".
- Projects: **MyGreenBlock set to draft** (hidden, kept). **"Mobile app" placeholder** added 4th (slug `mobile`, blue accent #5B8DEF,
  coming-soon cards). Next links: Content Scribe → Mobile app → Dado. These were written straight to the CMS; content.mjs does not
  have the mobile item yet, so don't run `sync` without adding it.
- Nav: #0B0B0A in dark (scrolled pill rgba(11,11,10,.92)); in light the scrolled pill is pure white.
- Section hairlines removed except above the footer.
- Vertical rails ~40% fainter and clipped to start 75% down the hero (or the case-study header), following scroll.
- Case study process steps are cards (#2A2A27, 14px radius); step text styles restored.
- Light theme case study: near-white page (#0D0D0C before invert) and darker body/label text for contrast.

## Mobile menu (2026-11-08)
- Phone nav: logo + hamburger ("Menu button", override `withMobileMenu`) on Home and the Case study page. The theme toggle and
  "Get in touch" are hidden on the Phone breakpoint; Tablet and Desktop keep the full nav.
- The sidebar is drawn by ThemeToggle.tsx (`MobileMenu`): Work / About / Contact, a Dark/Light switch, "Get in touch" (mailto) and the
  email. Closes on ✕, the dimmed backdrop, Escape, or choosing a link; locks page scroll and keeps keyboard focus inside while open.
  Edit the links or email in `MENU_LINKS` / `MENU_EMAIL` at the top of that block.
- The old "nav links" component (projects/notes/about/contact, from an earlier iteration) is unused; safe to delete.

## Folders, expandable About, theme pill (2026-11-11)
Inspired by lanrefadire.com (patterns recreated in our own code and visual language; none of his code, images or text).
- **Theme switch:** sun/moon segmented pill (radio group, arrow keys). Rendered by `withThemeToggle` in place of the "Theme toggle"
  layer, which still starts the site effects, so don't delete that layer.
- **Nav:** Work/About/Contact links hidden. Desktop/tablet: theme pill + "Get in touch". Phone: logo + pill (hamburger hidden;
  `withMobileMenu` code kept but unused).
- **Home order:** Hero → About (collapsed) → Selected work → "03 Shelf" (folders) → Contact → Footer. Portrait section deleted.
- **About:** collapsed until the hero's "More about me ↓" chip (centred on a dashed divider, override `withAboutToggle`) is clicked;
  the chip flips to "Less about me ↑". "Download CV" now sits inside About (no file linked yet).
- **Folders** (code component `Folders.tsx`): Resources, Writing, Photography, Other outlets. Edit titles, count lines, shortcut keys,
  links, card labels and photos in the Properties panel. Hover lifts the folder and fans out three cards (mouse only); shortcut keys
  R/W/P/O open the pages; tap opens on touch. 2×2 at every size (grid capped at 760px, centred). Folders.tsx measures its own width and scales the icons and labels to fit two per row, so it looks right on the canvas too. Keep the instance's Columns at 2.
- **Folder pages:** /writing, /resources, /photography (2-column photo grid), /outlets. Each lists items from the **Shelf** CMS
  collection filtered by its `Folder` field (Title, Meta, Link, Image, Order). 15 placeholder items. Escape returns home.
  These pages have one (desktop) breakpoint; phone/tablet spacing comes from ThemeToggle.tsx CSS.
- All mailto links now use hi@ginciDesign.com (the address shown in Contact).

## About ribbon (2026-11-11)
- The hero ends with an "About toggle" row: Dotted line · "MORE ABOUT ME ↓" button (override `withAboutToggle`) · Dotted line.
  The row runs to the screen edges (CSS pulls it over the hero's side padding: 80 / 32 / 20px).
- "04 About" (bio + Download CV) is collapsed on the canvas too (height 0, clip). To edit it on the canvas, set its height to
  Fit temporarily, then back to 0. On the site it opens when the button is clicked (label flips to LESS ABOUT ME ↑).
- Visible Home order: Hero → ribbon → Selected work → folders → Contact → Footer.

## Inline chips, hero intro, toggle on canvas (2026-11-11)
- Hero intro rewritten in the reference's structure (who → now → before → AI) with inline chips: Tranzakt and Dado Foods link
  to their case studies (green / orange tint, solid fill on hover). Link style preset "Inline chip" + CSS in ThemeToggle.tsx.
- About bio ends "…The full story, with dates and roles, is in my CV." "CV" is a chip; hover fills and shows ↓.
  **The CV link is a placeholder mailto (hi@ginciDesign.com, subject "CV request") until the PDF is uploaded**; then point the
  run's link at the file (any link ending .pdf gets the same ↓ hover). The Download CV button was removed.
- MORE ABOUT ME button: opening it smooth-scrolls the About section up to the middle of the screen (never scrolls up; instant with reduced motion). Hover fills white, label turns dark, arrow drops in from the top (rises when open).
- About opens with 16px above it.
- Theme toggle layers on all six pages rebuilt on the canvas as the sun/moon pill (Lucide icons) so the canvas matches the site.

## Shader, summary case study, go-live prep (2026-11-12)
- **Background shader** (Gift's ShaderGradient, layer renamed "Background shader", its own grain Off) now sits behind the
  content: pointer-events off, z-index 0, content column z-index 1. Light theme: multiply blend, 50% opacity, re-inverted so
  it keeps soft colour instead of washing out. A copy sits on the case-study page too.
- **Grain** lighter and wider: opacity .035, baseFrequency .62, 2 octaves, 260px tile. Reads as texture, not dots.
- **Inline chips**: Framer's link hover rule was zeroing padding and radius (the "shake"). Padding, margin and the 0.3em radius
  are pinned with !important on a and a:hover. CV chip has no arrow now; Content Scribe chip is violet.
  **CV still points to a mailto placeholder** until the PDF is uploaded; then set the run's link to the file.
- **Email**: every mailto opens ginciDesign@outlook.com; the displayed text stays hi@ginciDesign.com as a placeholder.
- **Nav CTA** is a calendar icon button (Lucide "Calendar") with a ring wiggle + pulse every 4.5s, reduced-motion safe.
  It opens email with subject "Book a call" until a booking link exists.
- "More work" (Dribbble) button removed.
- **Folders**: Coming soon (Folders `comingSoon` prop): no links, no shortcuts, a COMING SOON pill. /writing, /resources,
  /photography and /outlets are draft.
- **About bio** rewritten in the reference's tone, three paragraphs, Outfit 300. Bracketed facts still to fill:
  "[How you got into design, and when.]" and "[One line of recognition: awards, talks or features.]".
- **Case study is a summary now**: header (+ "Visit live site ↗" from the new Live link field), facts, cover, Outcomes
  (result + stats grid), a dotted "Read the full story" ribbon (withStoryToggle) and the full body folded beneath it, then Next.
  Page background matches home (#121211).
- **Images** scale by aspect ratio (cover 1120/760 capped at 1280px, section images 880/460) instead of fixed heights.
- Case page nav is Gift's new layer (old id CNkYL3GMJ is gone); CSS handles its transparency.

## About bio v2 + queued hero change (2026-11-12)
- About bio rewritten to be personal (who Gift is, experience, what drives them) and to name no projects, so it no longer
  repeats the hero or the work list. The CV chip is still the mailto placeholder. Recognition line dropped; add one later if wanted.
- ~~Queued: hero intro swaps the Dado Foods chip for 9mobile~~ Cancelled 2026-11-15, 9mobile is not used. Old note:
  "Before that I led the redesign of 9mobile ([what 9mobile is now, after the acquisition]): a full website redesign plus a
  content management system for the brand." Needs a 9mobile case study (CMS item) first so the chip has somewhere to link.

## Case page cleanup, type scale, light shader (2026-11-13)
- Hero headline: the duplicate offset layer is gone. One layer, thickened with `-webkit-text-stroke: 0.04em` (paint-order
  stroke fill), so it scales with the font and can't drift apart on phones. Wrapper is now a 100%-wide auto-height stack.
- **Type sizes live on the canvas only.** The old CSS font-size overrides (which forced e.g. the case title to ~126px and
  the phone headline to 40px) were removed. Scale (desktop / tablet / phone): hero headline 48/40/30, lede 18/18/16,
  work row name 32/28/22, contact line 24/22/18, email 128/76/32; case title 56/48/36, case lede 20/18/16, facts 18/18/16,
  outcome line 24/22/18, section titles 32/28/24, next title 56/48/32, TOC 14.
- Case header: "← Work" left and an underlined "Visit live site ↗" right on one row, 24px under the nav. Case label and read
  time removed. Title smaller (56px) with 120px above it. Facts are Client and Role only (Timeline and Platforms layers deleted).
- Outcomes: 2 columns on tablet, 1 per row on phone.
- Process (05) and "What I'd do next" (10) sections + their TOC rows deleted from the template.
- Tranzakt copy rewritten short: Overview (industry, role, goal) → Problem → Approach (4 steps) → Scope → four
  Problem / Solution / Result sections. Old long copy kept in archive/tranzakt-long-copy-2026-11-12.html.txt.
- Light theme shader: same treatment as dark (difference, 25%). The page inversion keeps the teal, so it shows on white.
- Hero padding now comes from the canvas on every breakpoint (tablet and phone CSS padding overrides removed, 2026-11-15).
- Hero intro is the same on all breakpoints (2026-11-15): Tranzakt → "payment solutions for Nigerian businesses", then Dado Foods. 9mobile is not used (Gift); its CMS item stays draft.

## Case template v3 (reference layout), Work page, headline (2026-11-15)
- **Case page layout:** header, cover, then two columns: a sticky sidebar (desktop) beside Facts → Outcomes →
  "Read the full story" → sections. Each section shows its **label as the heading** and its **title field as a one-paragraph
  summary**; the **body and image only appear after "Read the full story"** (button then says "Short version").
  Sidebar rows are named "TOC / NN" (the code needs that prefix) and highlight the section in view; the old Body fold used
  overflow:hidden, which is what broke the sticky sidebar.
- **CMS section convention (use this for every new case study):**
  S01 = The problem · S02 = Approach · S06–S09 = feature sections (with images) · S03 = Results (shown last) ·
  S04/S05/S10 unused (leave empty). For each: label = sidebar name, title = one-sentence summary, body = detail
  (Problem / Solution / Result for features). Empty title hides the section and its sidebar row.
- Facts are rows: Industry (the old Kicker field, renamed), Client, Role, Team. Empty fields hide their row.
- Tranzakt and Dado rewritten in this structure (old Dado copy in archive/). Tranzakt Team is empty until confirmed.
- **Work page** `/work`: header + the full project list (all published projects) + footer, with tablet/phone breakpoints.
  Home list is limited to 4 and has "View all projects →" beside the label. The case page "← Work" now goes to /work.
- Hero headline text effect: letter-by-letter (character tokenization, blur 6px → 0, 0.03s stagger) on all breakpoints.

## Hand-written headline (2026-11-15, updated)
- Now "Product designer. Vibe coder." One line on desktop/tablet; on phones it stays one line if the screen is wide
  enough (about 15.6em of the font size) and breaks into two lines otherwise (CSS container query). Speed 1 (~2.9s), start delay 0.1s.
  Replays on every visit to Home. Prop names on the instance are $control__size / $control__startDelay.
- Hero paragraph (Lede) uses the About statement's word reveal (opacity 0, y 10, blur 10) on mount, 0.04s per word,
  so its ~54 words finish (~2.5s) just before the headline (~2.9s). Set on all three breakpoints.
- The hero headline is now the **HandHeadline** code component (layer "Headline (hand-written)"). Every letter of
  Playwrite AR is traced as a pen stroke in reading order, then filled, about 3.3s in total (Speed 1.2, start delay 0.2s).
  Size per breakpoint: 48 / 40 / 30. Props: Size, Line height, Color, Weight (extra stroke), Speed, Start delay.
- The old rich-text headline layer is hidden on all breakpoints (kept for reference). Reduced motion and the Framer canvas
  show the finished text with no animation.
- Changing the words means regenerating the outlines: see tools/hand-headline/README.md.

## Work page tabs, back link, nav fix (2026-11-16)
- Work page: "← Home" back link 24px under the nav; a **WorkTabs** pill (Case studies / Playground) above the list.
  WorkTabs shows the layer named "Work list" or "Playground list" (html[data-g-tab]) and keeps the choice in the URL
  (#playground). Arrow keys switch tabs.
- **Playground** CMS collection (Title, Line, Image, Order) with 6 items: Dado customer/courier/vendor landing pages,
  Dado App Store screens, Menu as a Service templates, CreatorScribe landing page. The Playground list reuses the case
  list style; rows show the title and one line (hidden on phone), hover shows the image, rows have no link yet.
- Nav pill no longer sticks halfway: on at >80px, off at <16px (hysteresis) and `overflow-anchor: none`.

## Published 2026-11-16: case studies, Playground pages, light shaders, link styles
- **Live** at gincidesign.framer.website (versions 3b62c602c, then 28a1be64c).
- **Light-theme shaders:** every page with a shader (Home, Work, case study, Playground item) now has "Background shader (light)",
  a pale mint / peach / sky copy. The code shows only the one matching the theme and inverts the light one back, so its
  colours appear as picked (45% opacity). Edit its colours on the canvas.
- **Case studies in the CMS:** 9mobile (now published), NSIA, CreatorScribe (title renamed; slug still contentscribe) and
  Dado's new sections (Checkout and wallet, Menu as a Service). Order: Tranzakt, 9mobile, Dado, NSIA, CreatorScribe, Mobile app.
  Images are the 0.35-scale Figma exports upscaled; swap for sharp ones when Figma's rate limit allows
  (scratchpad hires.py retries).
- **Playground item page** `/playground/:Playground`: type, title, summary, audience, "Preview in Figma ↗", "Buy the template ↗"
  (hidden until the Template link field is filled), image. Rows on /work open it via the withPlaygroundLink override,
  which reads a hidden "Link slug" text (Framer wouldn't accept a field for a CMS link there).
- **Section headers** (Featured work, More from me, Contact, About, Work, Outcomes) are Outfit 500 22/20/18.
  **Link buttons** (View all projects, ← Home, ← Work, ← Playground, Preview/Buy) use the Back-to-top type, underlined.

## Fixes published 2026-11-16 (version 3177e0da8)
- **Stacking:** the canvas sets the content column's z-index to 0 inline, which let the shader (later in the DOM) paint over
  the content and nav. CSS now forces z-index 1 !important. Grid lines moved to z-index 0 (behind content and nav).
  The case page's own nav is excluded from that rule, so it stays sticky and becomes the floating pill like other pages.
- Light shader: canvas opacity is respected (no CSS override); CSS adds saturate(0.55) on top of the inversion.
- Case study page: grid lines at 20% opacity; footer added (copy of the Home footer).
- Back links (← Home, ← Work, ← Playground): 15px, underline only on hover. View all / Preview / Buy stay underlined.
- CMS: Mobile app placeholder set to draft (hidden). 9mobile is "9mobile (now T2)", client "9mobile (now T2), through
  Devstudio", live link https://www.t2mobile.com.ng. NSIA was already credited through Devstudio.

## Canvas is now the source of layout (2026-11-16, not yet published)
- 22 CSS rules that forced padding / gap / layout per breakpoint were removed from ThemeToggle.tsx. Their live values were
  measured on the published site and written into the canvas first (section paddings incl. desktop 160px top/bottom on
  Work/About/Contact, nav rest padding 20/32 tablet and 16/20 phone, footers, case Header / Cover wrap / Main / Next,
  phone hero frame and footer stacking). **Edit spacing on the canvas now; the code no longer overrides it.**
- Still in code on purpose (things the canvas can't express): nav pill on scroll, light theme inversion + shader swap,
  grain and grid overlays, chip hover, About and story folds, full-bleed dotted ribbons, sticky TOC, reveal-on-scroll,
  row hover bleed on phone, outcomes grid, link underline styles, and a safety z-index for content above shaders.
- Baseline metrics/screenshots for the before/after comparison are in the session scratchpad (cons/). Re-run the diff after
  the next publish.

## Hero: sketch to screen + wet-sand trail: REMOVED (2026-11-16)
- Both deleted at Gift's request (layers, Framer code files and repo files). Headline/paragraph start at 0.1s again.

## (historical) Hero: sketch to screen + wet-sand trail
- **HeroSketch** (layer "Hero sketch", absolute, centred, top 190 / 124 / 96): a card wireframe draws itself like a pen,
  a cursor taps its button, and it becomes UI (surface, green button, solid text bars). 2.4s. Props: Size (280/240/200),
  Ink, Surface, Button, Duration, Start delay. ("Size", not "width": Framer reserves width.)
- **Sequencing:** headline Start delay = 2.5s; hero paragraph text effect delay = 2.5s, so both start as the sketch finishes.
- **SandTrail** (layer "Sand trail", fills the hero behind the text): pointer presses a groove into damp sand (dark trench,
  faint ridge, wet sheen); slow strokes are wide, fast ones thin; settles in 2.6s. Mouse/trackpad only, off for reduced
  motion, idle when nothing moves. Props: Settles in, Groove width, Depth.

## Availability pill + Listening-to tab (2026-11-16, not yet published)
- **"Available for work"** pill (layer "Status", native frame) sits directly above the headline and fades in at 3.1s via its
  appear effect, after the headline finishes. The dot pulses (CSS, from 3.4s). Hero top padding reduced by 46px
  (514 / 354 / 274) so the headline stays where it was.
- **NowPlaying** (layer "Listening to (edge tab)" in the hero): fixed to the right edge on the live site (rendered into
  <body>), flat right side, rounded left, animated music bars; hover/focus/tap slides it out to show cover, "Listening to",
  track and artist; docks again on leave. Live data needs Last.fm (connect Spotify to Last.fm, then set "Last.fm user" and
  a read-only "Last.fm key"). Until then it shows the fallback Track/Artist/Cover/Link props, or "Nothing right now".
  Shows "Last played" when the latest Last.fm track isn't playing now. "From bottom" sets its height on screen.
- Case study page: footer moved below "Next project".

## Hover, headers, Playground fix, tab position (2026-11-16, not yet published)
- Listening-to tab now sits 40px below the nav's bottom edge (follows the nav as it turns into the pill). Prop "Below nav".
- Project list hover is one colour everywhere (Home, Work, Playground): white at 50% with dark text for contrast.
  The per-project accent hover is gone. Playground rows renamed "Row / Playground" so they share the list styles.
- Work page "Work" header and Home "Contact" header now match the other Home headers: Geist Mono 500, 16/15/14.
- **Playground tab blocker fixed:** the rows' Framer appear effect never fired when the tab switched (the list was hidden at
  load), so the rows stayed invisible. Appear effects removed from both Work-page lists. Rows sort by the Order field.

## Light shader palette + speed pass (2026-11-16, not yet published)
- Light shaders (all 4 pages) now lean blue: soft aqua rgb(198,234,232), pale periwinkle rgb(196,214,246),
  light cyan rgb(205,240,246). The peach (which read orange/murky once inverted) is gone.
- **Speed:**
  - All 8 shaders: lighting "Light" (3D) instead of "Env". Env made the library download three ~1.1MB HDR maps
    (city, dawn, lobby: 3.3MB of the 4.2MB each page transferred). Pixel density 2.3 → 1 (the shader is blurred 100px,
    so the extra pixels were wasted GPU work). Lazy load on, so the shader for the inactive theme (display:none) never starts.
  - Scroll handler (grid + sidebar) throttled to one update per animation frame (it measured layout on every scroll event).
  - Deleted the hidden old rich-text headline (it was the only Playwrite AR use); TOC labels moved off Inter to Nunito.
  - Baseline (live, before): ~4.2MB transferred per page, 33 to 42 requests; three HDR files were the largest assets.

## Status row + solid hover (2026-11-16, not yet published)
- Project row hover is now solid site white (#F4F3EE) with dark text.
- Listening-to (latest): folded it's a 28px round button with music bars always moving. Desktop: hover opens, leaving
  closes, clicking the track opens it. Touch: tap toggles, tapping elsewhere closes, and while open tapping the track opens it.
- Listening-to moved off the screen edge: it's now a pill beside the status pill in a "Status row" above the headline,
  same height and type (Geist Mono 12). Animated bars only when a track is live; label "Listening to" (live) or
  "Last played"; "Not playing right now" until Last.fm or a fallback track is set. Fades in at 3.25s, just after the
  status pill (3.1s). Clicking opens the track.

## Light shader = dark palette, subtle hover, Work spacing (2026-11-16, not yet published)
- NOW (latest): cyan-blue light palette aqua 190,236,232 / cyan 176,226,238 / icy blue 204,232,244 at 30%, no desaturate
  (periwinkle read purple). Orange option if wanted later: mint 207,235,221 / peach 246,216,196 / sky 215,230,245.
- Earlier revert: light shaders back to the pale blue palette (aqua 198,234,232 / periwinkle 196,214,246 /
  cyan 205,240,246) with the saturate(0.55) filter, opacity lowered from 0.6 to 0.3. (Superseded note follows.)
- (superseded) Light shaders now use the dark theme's palette (teal, navy, cyan) at 35% opacity; CSS only cancels the page inversion
  (no desaturate). A browser simulation of the filter chain gives soft teal / slate-blue tints with no orange.
  The earlier pale palette came out washed-out grey, and the warmth came from the shader's lighting on very pale colours.
- Row hover: rgba(244,243,238,0.05) everywhere, text keeps its colour (inverted to a soft grey in light mode).
- Light theme grid lines raised to 9% so they stay visible over the shader.
- Work page: back link 40px under the nav, then 200px to the "Work" header (tablet 32/140, phone 24/96).

## Published 2026-11-16 (versions 85981b859 → 39a30ffa8)
- Live: blue-cyan light shader at 30%, subtle row hover, Work page spacing, status row with the folding Listening-to button,
  Playground rows visible, speed pass.
- **Measured live after the speed pass:** ~0.85MB per page (was ~4.2MB), 30–33 requests (was 33–42), one shader canvas
  running (was two), JS heap roughly halved. (Headless test browsers render WebGL in software, so frame-rate numbers
  from them are not meaningful.)
- Listening-to unfolds to ~195px on hover live. Framer measures the folded 28px, so the component drops the incoming
  width and the CSS lets its wrapper grow.
- Last.fm connected (version 472dc1de5): username "ginci" and the read-only API key are set on the "Listening to" layer
  (key kept out of this repo; the shared secret is not used). Verified live: the pill showed the current Spotify track.

## Phone browser bars (2026-11-16, published f91988f25)
- iOS Safari showed white above the status bar and behind the bottom toolbar: Home's breakpoint frames had fill #ffffff.
  Now rgb(18,18,17) on all three. CSS sets html and body to #121211 (body transparent in light theme), and applyTheme()
  writes <meta name="theme-color"> = #121211 (dark) / #EDEDEE (light) so the browser chrome follows the theme.

## Phone polish (2026-11-16, published f91988f25, verified on an iPhone-size screen)
- Listening-to pill (published b0ec0bea1, verified on iPhone and Pixel sizes): folded is locked to 28px with !important, because ThemeToggle's phone rule `#main * { max-width: 100% }`
  outranked it and stretched the folded pill across the row on phones. Fixed 28px height; when it opens it measures the room to the right and never passes the 20px gutter
  (max 360px); the track name truncates with an ellipsis instead of pushing the pill off screen.
- Phone nav shows the mail button (36px) on every page; logo 60px wide on phones.
- Section headers back to Geist Mono 400 12px grey (rgb 133,132,126): Featured work, More from me, Contact, About, and the
  Work page "Work" label.
- "More about me" ribbon: full screen width at every size (100vw, centred), so the button is always centred; replaces the
  old per-breakpoint negative margins that no longer matched the hero padding.
- Phone spacing: 20px side gutter everywhere (hero, shelf), Work section top 64, Contact 72/72 with 48 gap, email 28px.

## Link buttons 12px (2026-11-16, published 713008f19, verified live)
- All link buttons are Geist Mono 12px: All projects, ← Home / ← Work / ← Playground (CSS no longer forces 15px),
  Visit live site, Preview in Figma, Buy the template. Back links still underline only on hover.

## Phone speed pass (2026-11-16, not yet published)
- Measured live on an emulated mid-range phone (slow 4G, 4x CPU): Home ~850KB, first paint ~1.0s, largest paint ~3.5s
  (mostly the hero intro animation), plus the WebGL shader running continuously.
- Phones (<=809px) now: no WebGL shader (hidden; with Lazy load on it never starts), replaced by a still CSS radial glow in
  the shader colours on the page frames; no grain overlay; no backdrop blur on the scrolled nav pill.
- Nunito Sans removed site-wide (4 canvas texts + Folders.tsx now use Nunito): two fewer font files (~75KB).
- Desktop and tablet unchanged.

## No-delay load (2026-11-16, published 9084cbe4f)
- A throttled refresh showed: headline at <1s, but the hero paragraph and ribbon only after ~6s, site CSS only after ~4s
  (it was injected by code after hydration, so pages first painted unstyled), 10 sections hidden by scroll-reveal,
  and the shader appearing last.
- **Site CSS now also lives in the page <head>** (Framer custom code, headEnd) together with a tiny theme bootstrap
  (applies the saved light/dark theme and theme-color before first paint). tools/headcode.mjs rebuilds it from
  ThemeToggle.tsx's CSS constant; **re-run it after every ThemeToggle change** (ensureStyle keeps the same id).
- Removed JS-gated reveals: hero paragraph text effect (now a 0.7s pure-CSS fade), project-row appear effects (Home),
  case cover appear effect, and the scroll-reveal script (setupReveal is a no-op).
- Still glow in the shader colours on every page frame, so the background is there at first paint; the WebGL shader fades in
  over it on desktop/tablet. Kept on purpose: the handwritten headline, and the Available / Listening pills' late entrance.

## Scroll starts at the top (2026-11-16, published c31673e9e, verified live)
- Framer restores scroll itself after hydration, so settleTop() holds scrollY at 0 for ~1.2s after each visit (stops as soon
  as the visitor scrolls, clicks or types); route changes are detected by polling location.pathname every 100ms.
- history.scrollRestoration = "manual" in the head bootstrap and in ThemeToggle; scroll to top on first load, on pageshow
  (back/forward cache), and on every route change (pushState/replaceState/popstate are watched), so refresh, back,
  the logo and returning from Work/case pages all start at the top. Links with a #hash still land on their section.

## Playground parked (2026-11-16, published 9084cbe4f)
- Work page shows case studies only: "Work tabs" (WorkTabs) and "Playground list" are hidden (visible=false), and a plain
  "Case studies" label sits above the list. All 6 Playground CMS items are drafts, so /playground/* pages aren't published.
- Nothing deleted: the collection, the /playground/:Playground page, WorkTabs and withPlaygroundLink remain.
- To restore later: un-draft items, set Work tabs + Playground list visible, remove the "Case studies" label.
- Gift's direction for the rethink: group the Playground by type (Websites, SaaS, Mobile apps) with each type opening its
  pieces; anything that belongs to a case study (e.g. the Dado landing pages) should live in that case study, not twice.

## Floating nav: minimal change — REVERTED at Gift's request (back to max 920px, top 14, padding 10/10/10/24; phone top 10)
- The scrolled pill now wraps the resting nav content plus 8px on every side, so logo and buttons stay put:
  desktop top 24 / width calc(100% - 224px), tablet top 12 / calc(100% - 48px), phone top 8 / calc(100% - 24px),
  padding 8px everywhere (was: max 920px wide, top 14, padding 10/10/10/24). Matches resting padding 32/120, 20/32, 16/20.

## Pill, ribbon, nav width (2026-11-16, published bce998a56, verified live)
- "Available" pill back to the original green: fill rgba(111,208,140,0.08), border rgba(111,208,140,0.28), text #F4F3EE.
  It inverts cleanly to a light-green pill with dark text in light mode (the grey version lost contrast there).
- "More about me" ribbon: Gift's fixed-width vector lines replaced by two "Dotted line" frames (width 1fr, CSS draws the
  dotted border) so they reach both screen edges at any width (checked at 1920px); the button never shrinks; phone
  padding 8/16/8/14 (arrow sits 17px from the edge).
- Floating nav pill: width = screen minus 16px each side on every device (calc(100vw - 32px)), not capped by the
  1200px content column.

## Phone grid + button (2026-11-16, not yet published)
- Phones now show all four grid lines with the same alternating motion as desktop (lines 1/3 draw down, 2/4 draw up).
  Previously lines 1 and 3 were hidden on phones, leaving two lines both moving up.
- "More about me" on phones: padding 8/20/8/16 (more room before the arrow).

## Phone hero fits the screen — REMOVED (Gift sets the phone hero on the canvas; CSS no longer overrides it)
- Phones: 01 Hero min-height calc(100svh - 70px) (nav ~70px), padding 24/24, content stacked from the bottom, so the
  "More about me" button sits 24px above the bottom edge (checked: iPhone 13, Pixel 7, iPhone 14 Pro Max). On very short
  screens (iPhone SE) the intro is taller than the screen, so the button falls just below the fold. This CSS overrides
  the phone canvas top padding (274px).

## Canvas vs live: what only the live site shows (2026-11-16)
- The Framer editor doesn't run ThemeToggle.tsx, so code-driven effects only appear on the published site (or in Framer's
  preview): edge-to-edge dotted lines (100vw), the floating nav pill, grid lines, grain, light theme, the phone CSS glow.
  Live check of the ribbon lines at 390 / 834 / 1280 / 1440 / 2560px: both lines reach the screen edges.

## Decisions log
- No design-system sections (Gift, 2026-11-02).
- Tranzakt: two user types (customers, merchants). Scope led by consolidated login, payment gateway, KYC/KYB updates, merchant dashboard updates. Deep dives: Treasury, Checkout, KYC/KYB (real copy from content/case-studies.json), Merchant dashboard (Merchant AI framing + placeholder for shipped updates). Website moved into Scope (Gift, 2026-11-04).
- Home starts with Tranzakt; the list ends with a link to Dribbble instead of Load more (Gift, 2026-11-04). Dribbble link removed (Gift, 2026-11-12).
- Folders ship as Coming soon; case studies ship as summaries with the full story folded (Gift, 2026-11-12).

## 16 Nov 2026: floating nav width
- Reverted the `width: calc(100vw - 32px)` attempt; it broke the floating-pill look.
- The pill keeps its original max-width animation, with a wider cap: `min(1200px, calc(100% - 32px))` (was 920px). On phones it's `calc(100% - 32px)` (was `100% - 20px`).
- Verified live: rounded 999px pill, inset 16px, top 14px (10px on phone) at 390, 834, 1440 and 1920px.
- If this ever needs undoing, the original values were 920px and, on phones, `100% - 20px`.

## 16 Nov 2026: "More about me" dotted lines built in the canvas
- The edge-to-edge dotted lines are now real canvas layers, not a CSS trick, so they show in the editor.
- Inside "About toggle" there are two absolute layers, "Dotted line (bleed left)" and "Dotted line (bleed right)". Each is 3000px wide and pinned 3000px outside the toggle's edges (bottom 13px; 14px on Phone). They grow with the screen and are clipped at the screen edge.
- All dotted lines use a canvas border: 1px dotted, top only, rgba(244,243,238,0.36).
- "Page content column" overflow is now Visible so the extensions can pass the 1200px column.
- Removed the CSS `width:100vw; margin-left:calc(50% - 50vw)` rule on About toggle.
- Phone CSS `#main * { max-width:100% }` now skips layers named "Dotted line (bleed…".
- Not published yet (waiting for "publish").

## 16 Nov 2026: case study button says "Read more"
- Canvas label changed from "READ THE FULL STORY" to "READ MORE" on Desktop, Tablet and Phone. The text layer is renamed "Read more". The button layer keeps its name "CTA / Read the full story" because the CSS targets it.
- withStoryToggle now swaps between "Read more" and "Short version" (open).
- On phones the label wrapped onto four lines and cut off the arrow, because of `#main * { max-width:100% }`. New CSS sizes the pill and its text to max-content with no wrapping, at every breakpoint.
- Not published yet.
- Update, same day: the "Dotted line (bleed …)" canvas layers were deleted in the editor before publishing, so the 100vw CSS rule on About toggle is back. Published and verified edge to edge at 390, 834, 1440 and 2560 with no horizontal scroll. "READ MORE" is live.

## 17 Nov 2026: "More about me" dotted lines back to content width
- Gift no longer wants edge-to-edge lines. The 100vw CSS rule on About toggle and the phone bleed exception are removed.
- "Page content column" overflow is set back to Clip.
- The lines now follow the canvas: they span the hero's content width (80px in on desktop, 40 on tablet, 20 on phone).
- Uploaded, not published yet.

## 17 Nov 2026: button labels never wrap
- On phones "Request access" (CTA / Email request, locked case study) wrapped onto three lines, again because of `#main * { max-width:100% }`.
- Replaced the one-off "Read more" fix with one rule. Every layer named "CTA / …" that has a text label is sized to max-content with nowrap at every breakpoint. Icon-only CTAs (CTA / Email me) are excluded via `:has(p)`, so they keep their size.
- To make a new button follow this, name it "CTA / Something".
- Uploaded, not published yet (still waiting for "publish", together with the dotted-line revert).

## 17 Nov 2026: high-resolution case study images (partly done)
- Exported from Figma at 2× with the Figma connector (download_assets, defaultScale 2), then composed in the Tranzakt style by `mockups/case-mocks.cjs`: browser windows on a branded backdrop, rendered at 2×. Address bars show product names, not invented URLs.
- **Replaced in the CMS:**
  - 9mobile: Cover + Preview (2240×1520), S06 website, S07 eShop, S08 CMS (1760×920).
  - NSIA: Cover + Preview (newer dashboard, `8918:67547`), S07 daily production (filled report, `6875:149979`; the old one was an empty table).
  - Previous image URLs: `mockups/cms-images-before-2026-11-17.json`.
- **Still the old low-res images:**
  - NSIA S09 reports (use `10168:90400`). NSIA S08 flow is already high resolution, so it's fine.
  - CreatorScribe Cover/Preview, S06–S08 (`492:22172`, `482:24227`, `482:25357`, `482:28441` in `vAfry4XNlu5JpVPhWa6J7i`).
  - Dado S08 checkout (pick single phone screens from `15479:56662` in `cRhK9EMb7YHnin0eUbJCbb`; the current image is a slide of tiny phones) and S09 MaaS (`3331:55288` in `qbmBAvzSsnH8mHj34N3UR8`).
- **Blocked by Figma's Starter-plan limits:**
  - REST image API: 429, Retry-After 257,844 s (about 20 Nov).
  - Figma connector: "tool call limit on the Starter plan".
- To finish: export the frames above at 2× into the scratchpad `fig/src` as `<name>-top.png`, add scenes to `case-mocks.cjs`, run it, then upload like `hiimg.mjs` does.
- Not published yet.

## 17 Nov 2026: Tranzakt repositioned around the Business Suite
- Gift: Tranzakt is B2B payments. The live core is the Business Suite (merchant dashboard, payment links, collections). Treasury isn't live.
- CMS rewritten:
  - index line, lede, result, stats
  - S01–S03
  - S06 is now "Business Suite"; S09 is "Treasury (not yet live)"
  - S07 Checkout and S08 Verification unchanged
- Images: S06 and S09 swapped. Cover and Preview re-rendered with the merchant dashboard (`mockups/mock.cjs` cover/preview scenes now use `merchant@1x.png`).
- Review notes: `drafts/tranzakt-rewrite-2026-11-17.md`. Previous field values: `drafts/tranzakt-cms-before-2026-11-17.json`.
- Not published yet.
- Update, same day: Gift asked to drop Treasury entirely. S09 label/title/body/image cleared and the Treasury line removed from the S02 scope. Published (fab5e7124). Live sidebar: The problem › Approach › Business Suite › Checkout › Verification › Results. No Treasury text on the page.

## 17 Nov 2026: one page margin, Shots tab, phone type scale (uploaded, not published)
**Margins.** Every page now lines up with the Home hero.
- Canvas: desktop sections on Work, Case study and Playground/Shots item pages use 80px side padding (was 120 on several). Page wrappers are 0.
- CSS (ThemeToggle, ≥1200px): sections inside "Page content column", "Case study page" and "Playground / Index" get `max(80px, (100% − 1200px)/2 + 80px)` side padding, which equals Home's 1200 column + 80 padding. Backgrounds stay full-bleed. The nav is skipped when it's the floating pill.
- Checked by injecting the rule live: content and logo start at 120/200/440px at 1280/1440/1920 on Home, Work and case studies.
- Tablet (32) and phone (20) already matched.

**Work tabs: Case studies / Shots.**
- `WorkTabs.tsx`: second tab is "Shots", hash `#shots` (`#playground` still works). It shows the "Shots list" layer and hides "Work list" plus the hover preview. "Playground list" stays hidden.
- New code component `Shots.tsx` (Framer file I4NQo6B), in the "Shots list" frame under the Work list:
  - masonry grid of rounded tiles (3 / 2 / 1 columns)
  - each tile is a phone or browser mockup; tiles rise in on scroll and devices float gently
  - placeholders shimmer; reduced-motion is respected
- Property panel → Shots: per item Title, Device (phone/browser), Screenshot, Video (mp4/webm, autoplay, muted, loop) and Link. With no items it shows 6 placeholders.
- On the Work page the "Case studies" label is hidden and the tabs are visible.

**Phone type scale (canvas phone breakpoints only).**

| Text | Size |
|---|---|
| Hand headline size | 28 → 24 |
| Case title | 36 → 30 |
| Next title | 32 → 26 |
| Work title | 28 → 24 |
| Contact email | 28 → 22 |
| Locked title | 24 → 21 |
| Arrows | 32 / 24 → 22 / 20 |
| Names | 20 → 18 |
| About statement | 20 → 18 |
| Section labels | 19 → 17 |
| Contact heading | 18 → 17 |
| Lede, outcomes label/result | 18 → 16 |
| Locked body | 17 → 16 |

## 17 Nov 2026: floating nav shrinks inward; all published (bc63eb5a3)
- On scroll the nav pill is narrower than the content:
  - desktop: `max-width: calc(min(100%, 1200px) - 192px)` (16px inside the 80px margins)
  - tablet: `calc(100% - 96px)` (16px inside 32)
  - phone: `calc(100% - 56px)` (8px inside 20)
  - Before, it was 1200px wide on desktop, which pushed it outside the content edges.
- Verified live:
  - pill edges at 216..1224 (1440), 456..1464 (1920), 48..786 (834), 28..362 (390), the same on Home, Work and case studies
  - text starts at 200/440/32/20 on every page
  - Shots tab: `#shots`, 6 tiles, Work list hidden
  - phone case title 30px

## 17 Nov 2026: hero photo hover, CV wording → experience (published 4cab576c4)
**Photo hover.** Hovering "Gift" in the hero lede shows a 200×250 halftone portrait card.
- It follows the cursor, sits above and to the right of it, is tilted −4°, and is smaller than the project preview.
- Touch: tap "Gift" to show it for about 2.6 s.
- Code: `setupPhotoHover()` + `drawHalftone()` in ThemeToggle (canvas, 45° dot grid, light dots on #121211).
- Photo source: the layer **"Hover photo (set fill to your photo)"** in "01 Hero" (CSS keeps it invisible). Set its Fill → Image to Gift's photo and republish.
- With no photo it draws a halftone silhouette. No photo of Gift exists in the repo, the Framer project or the conversation, so the silhouette is live for now.

**CV wording → experience:**
- The About chip was "…Dates and titles live in my CV." It's now "…Want the full picture? **Explore my experience**." The chip link is mailto `ginciDesign@outlook.com?subject=Your experience` (no experience page or PDF exists yet; point it there when one does).
- Socials "Read.cv ↗" → "Experience ↗". None of the socials have links yet.
- The earlier notes above about the "CV" chip / "Download CV" are superseded by this.

## 20 Nov 2026: phone hero puts "More about me" at the base of the first screen (uploaded, not published)
- Phone (≤809px) Home hero: `min-height: calc(100svh - 70px)` (falls back to 100vh), content justified to the bottom, padding 96 top / 68 bottom.
- The button ends 68px above the screen bottom on every phone, clear of the "Made in Framer" badge (about the bottom 57px). Use 20px if the badge is ever removed.
- Canvas phone hero set to match: padding 96/20/68/20, distribution End. Desktop and tablet unchanged.
- Tested by injecting the rule live: gap 68px on iPhone SE (568), iPhone 13 (664), 14 Pro Max (740) and Pixel 7 (839). Before, a fixed 160px top gave gaps from 23 to 294px.

## 20 Nov 2026: status/music pills were hidden on phone; published b8fbfb88c
- Cause: a "Content" frame (`jNJjtKXYa`, wrapping Status row + headline/lede in "01 Hero") was added on the canvas with a fixed 1040×229 size, overflow Clip and centred content.
  - On phone the pills sat above its clipped box, so they were invisible, and the lede was cut off.
  - Phone pills were also centred.
- Fix (all breakpoints): width 100%, height Fit, overflow Visible, alignment and distribution Start. Gap 24 kept.
- Verified live:
  - pills visible and left-aligned at 20px (phone) / 200px (desktop); the full lede shows
  - "More about me" sits 68px above the screen bottom on iPhone 13 and Pixel 7
  - on iPhone SE (568px tall) the hero content is taller than the screen, so the button lands just below the fold
- The status pill text is now "Creating" (changed on the canvas). Gift remembered it as "Available".

## 20 Nov 2026: hero headline is now "Product designer." (published f3fd84425)
- "Vibe coder." removed at Gift's request. HandHeadline regenerated with `tools/hand-headline/gen.cjs` lines `["Product designer.", "Product designer."]`: one line at every width, about 1.75 s write-on.
- Still says "Vibe coder": the site's SEO/share description "Designer. Builder. Vibe coder" (Framer Site Settings → General → Description; used for Google and link previews).
- Update, 20 Nov: canvas phone hero height set to 100vh (distribution End, padding 96/20/68/20), so the editor shows the content at the base of the screen like the live site. Live CSS overrides it with `height:auto` plus `min-height: calc(100svh - 70px)` so the 70px nav is accounted for. Uploaded, not published.

## 20 Nov 2026: hero gets location, focus and "Get in touch" (uploaded, not published)
- Added under the lede, in the hero's text stack (`BlF2lX0m3`), a "Hero footer" frame (gap 28):
  - "Hero meta" row (wraps, gap 48): LOCATION "Lagos, GMT+1" · FOCUS "AI · Fintech · Commerce". Labels Geist Mono 11/0.06em grey; values Outfit 16 light.
  - "CTA / Get in touch": solid light pill (#F4F3EE, text #121211, Outfit 15/500), link `mailto:ginciDesign@outlook.com?subject=Hello Gift`.
- Third focus "Commerce" chosen from the work: Dado marketplace and Menu as a Service, 9mobile eShop.
- Order is now: hero (… lede, meta, Get in touch) → "More about me" → work.
- Location set to Lagos everywhere except Dado's story: the About pill line ("Senior product designer · Lagos, Nigeria") and the footer clocks on Home and Work ("Now · Lagos … WAT"). The clock time is unchanged (WAT = GMT+1).
- Phone hero top padding 96 → 32 (canvas and CSS) so the taller hero still fits; content stays at the bottom of the screen.
- Gift's Framer comments can't be read through framer-api (no comments API or query type). Ask Gift to paste them.
- Next conversation: splitting the full case studies into smaller pieces of work.

## 20 Nov 2026: nav byline in the Logo component (uploaded, not published)
- From Gift's Framer comment (Framer comments can't be read via framer-api, so the instructions came through chat).
- The Logo component (`d0D1RTQxD`) now holds a "Byline" stack after the logo, in both variants, so it shows on every page. Variant 1 height is auto.
  - Geist Mono 10px.
  - The location line uses `withNowTime`: it shows live Lagos time where the text contains "00:00".
- Gift then edited it on the canvas to: "by" hidden; "by Gift Njom"; "Lagos, GMT+1" (no time placeholder, so no clock). Gift's version is kept.
- CSS: the byline folds away (opacity, max-width) while the nav is the floating pill and returns at the top.
- Phone logo instance was fixed at 60×28 with an aspect ratio; it's now Fit, so the byline isn't clipped.
- The nav mail button now shows a phone icon (Gift's edit).

## 20 Nov 2026: hero headline cycles Product designer. → Builder. → Vibe coder. (uploaded, not published)
- Gift: after writing, wait 1 s, write it backwards, then write the next text; loop. Gift said "byproduct"; it was read as "Vibe coder." (matches the site description "Designer. Builder. Vibe coder"). Change it in `gen.cjs` if wrong.
- `tools/hand-headline/build_cycle.cjs` generates the new `HandHeadline.tsx`. Controls: Size, Color, Weight, Speed, Hold (s), Start delay. Line height is gone: each phrase is a single line.
- Timings: writing takes 2.1 / 1.2 / 1.5 s; full loop is about 13 s. Tested in a browser: the phrases cycle and erasing goes from the last letter back.

## 20 Nov 2026: published b8dce7623
- Live and checked on desktop, iPhone 13 and iPhone SE:
  - the headline cycles Product designer. → Builder. → Vibe coder. (phone widths 224 / 107 / 143)
  - nav byline "by GIFT NJOM / Lagos, GMT+1" at the top of the page
  - "Get in touch →" opens `mailto:ginciDesign@outlook.com?subject=Hello Gift`
  - "More about me" sits 68px above the bottom on iPhone 13 and just below the fold on iPhone SE
- Gift's canvas edits kept: the "Hero meta" row (Location / Focus) was deleted (location now lives in the nav byline). The button layer was renamed "Get in touch", so it's no longer covered by the `CTA / …` no-wrap rule; rename it back to "CTA / Get in touch" to restore that.

## 20 Nov 2026: hero fills the first screen, smoother nav, byline moved to the hero (published bd111fd7c)
- "Get in touch" removed (Hero footer deleted).
- Home hero fills the screen below the nav at every size (canvas: height 100vh, distribution End; CSS: `height:auto; min-height: calc(100svh - var(--g-nav-h))`). "More about me" rests 24px above the bottom (68px on phone, clear of the Framer badge).
  - Canvas paddings: desktop 120/80/24/80, tablet 120/40/24/40, phone 32/20/68/20.
  - JS measures the resting nav into `--g-nav-h` and `--g-nav-pad`.
- Nav switch to and from the pill:
  - `margin-bottom: calc(var(--g-nav-pad) - 20px)` (phone −16) offsets the padding change, so the page no longer shifts. Verified: content y is constant through the switch at 1440, 1280, 834 and 390.
  - Radius 999 → 32 so it animates evenly; the blur fades (blur(0) at rest).
  - Everything uses 0.55s on the site EASE.
- Byline moved out of the nav: the Logo component's "Byline" is hidden (kept). A new absolute "Hero byline" sits right-aligned in the Status row ("by GIFT NJOM" / "Lagos, GMT+1", Geist Mono 11). The phone Status row is now 100% wide. The old fold-away CSS is removed.
- Gift wants to review this placement before anything more changes on the byline.

## 21 Nov 2026: byline under the logo, call/calendar icon swap, About size fix (uploaded, not published)
- Byline: Gift didn't like it in the hero, so the "Hero byline" was deleted.
  - The Logo component's "Byline" is visible again, pinned under the logo (absolute, left 0, bottom −15px), so the nav height doesn't change. It reads "ginci designs / by GIFT NJOM"; the location line is hidden.
  - It fades and lifts away (opacity + translateY, 0.45–0.55s) while the nav is the pill.
  - "Lagos, GMT+1" isn't shown anywhere now.
- Nav call button (Home, Work, Case study, Shots item; all breakpoints):
  - the first icon is named "Call icon" (Phone Call)
  - the "Book icon" (Calendar) is visible and pinned in the centre (12px, or 10px on the 36px phone button)
  - CSS `g-icon-a` / `g-icon-b`: the icons take turns every 8s with a fade + 30° turn; the ring shake stays
  - reduced motion shows the call icon only
  - Work, Case and Shots item pages had a mail icon, now Phone Call
  - folder pages (not live) unchanged
- About: the third paragraph ("Away from the screen…", Gift's edit with 4ourfits) had no font size stored, so it rendered at 16px. Its runs now set 26 (desktop) / 24 (tablet) / 18 (phone) to match.
- Hero headline size unchanged, at Gift's request.

## 21 Nov 2026: byline matches the logo width; published 5708f13d5
- Byline under the logo is now two lines: "by" (grey) / "GIFT NJOM" (light), Geist Mono 9px, letter-spacing 0.02em, so "GIFT NJOM" is 50px wide, the same as the logo. Pinned at bottom −26px, gap 1px.
- Nav overflow is visible (CSS for all pages, canvas on Home) so the phone nav doesn't clip the second line.
- The byline fade needed `!important` (Framer sets opacity inline).
- About statement paragraphs are forced to one size per breakpoint in CSS (26 / 24 / 18), because the phone/tablet run sizes didn't stick in Framer.
- Verified live:
  - logo 50.0 vs name 50.2 (desktop), 50.0 vs 50.0 (phone)
  - byline opacity 1 at the top, 0 when scrolled, 1 back at the top (desktop, tablet, phone)
  - call/calendar icons alternate
  - About paragraphs 26/26/26, 24/24/24, 18/18/18

## 21 Nov 2026: tighter headline → intro spacing (uploaded, not published)
- The Playwrite AR descenders go 583 units below the baseline, and the headline box reserved about 600 units (29px at 48px) for every phrase, even ones without descenders.
- `build_cycle.cjs` now keeps `bottom = 400`. Deeper tails (the "g" in "designer") hang below the box; the SVG overflow is visible.
- COPY stack gap (headline → lede) 16 → 8px on all breakpoints.

## 21 Nov 2026: new hero and About copy, AI glyphs, real photo in the hover (published 71b52d783)
- Headline cycles "Product designer." → "Fintech & AI." → "Idea to prototype."
  - Playwrite AR's cursive capitals look like "a" and "l", so `gen.cjs` swaps the glyphs for "AI" to the font's plain print capitals: A gid 5 (advance 877), I gid 11 (advance 394).
- Intro (all breakpoints): "I'm Gift, a senior product designer with six years shaping products people trust with their money. I design payments at Tranzakt and use AI to turn ideas into working prototypes, fast." The "Gift" run (hover target) and the Tranzakt chip are kept.
- About statement:
  1. "I make complex products feel simple. Six years in, I still design for the moment a confusing screen finally clicks."
  2. "Good design respects people's time: no manual, no support call. I ask sharp questions, prototype fast and keep only what earns its place."
  3. "Off screen, I style and shoot for 4ourfits, my fashion line. It keeps my eye honest: if it doesn't look right, it isn't done. ⏎ Want the full picture? [Take a look at my experience]."
- Photo hover: Gift's image is on "Hover photo (set fill to your photo)". The halftone source is now brightness 1.3 / contrast 1.25 so the face reads. Verified live.
- How code and canvas relate: see the chat summary, 21 Nov. Rule of thumb: canvas for layout, content and sizes; code only for behaviour (animation, hover, scroll state). Any code rule that sets layout should be moved back to the canvas.

## 21 Nov 2026: plain photo, nav button folds to icon, byline fade, smooth nav both ways, top blur (published a3409e0ba)
- Photo hover: the halftone is removed. The card shows Gift's image as uploaded (`<img>`, object-fit cover, 200×250, −4° tilt). With no photo nothing pops up.
- Nav "Get in touch" (Gift re-added the label):
  - At rest: label + call/calendar icon swap. The Book icon is pinned right 12 / top 10 over the Call icon; button gap 8.
  - Floating pill: the label folds (max-width 140 → 0, opacity) into the round 40px icon button; the icons keep swapping.
  - Phone: label hidden (36px icon button).
  - The selector is prefixed with `#main` to beat the CTA no-wrap rule.
- Byline (Gift moved it to the right of the logo): opacity fade only, 0.5s.
- Nav switch both ways: one curve `NAVEASE = cubic-bezier(0.45,0,0.2,1)`, 0.7s.
  - Two things made desktop snap: the pill width `calc(min(100%,1200px) - 192px)` can't be interpolated, so it's now `--g-pill-w` measured in JS; and the margin rule set the resting nav to `max-width: none`, now 100%.
  - Verified frame by frame: phone eases 334 → 390 over about 0.6s both ways. Desktop shows mid values (headless runs the shader in software, so its frames are sparse).
- Top blur: `#g-topblur` (fixed, 96px / 76px on phone, `backdrop-filter: blur(3px)`, mask fading down), placed next to the nav in the same stacking layer (z 19 under the nav's 20). It only appears while the nav floats.

## 21 Nov 2026: no delay on the nav's return, hero follows canvas height, twinkling constellations (uploaded, not published)
- Nav return delay had two causes: the nav only switched back within 16px of the top (hysteresis 16/80), and the curve started slowly. Now the thresholds are 32 (off) / 56 (on) and `NAVEASE = cubic-bezier(0.22,1,0.36,1)` (moves at once, soft landing), 0.6s.
- Hero: Gift set desktop/tablet height to 80.25vh in the canvas. The CSS that forced `min-height: 100svh − nav` now only applies on phones, so the canvas height rules desktop and tablet.
- "Dots" (constellation images Gift added top and bottom of Home, opacity 0.8): CSS adds `g-twinkle` (a light band drifting across via a mask, 14s), `g-breathe` (opacity .62–.9, 7s) and `g-drift` (−10px float, 26s). The second image runs out of step. Off for reduced motion.
- Published 8959b1ec6. Verified:
  - desktop hero is 80% of the screen (canvas 80.25vh); phone hero still fills the screen below the nav
  - both "Dots" run g-twinkle, g-breathe and g-drift, out of step
  - scrolling up step by step, the phone nav starts widening on the first frame after crossing the threshold and eases 334 → 390 with no stall (desktop headless frames too sparse to time)

## 21 Nov 2026: wider content (fluid margin) and one nav on every page (uploaded, not published)
- Desktop margin is now fluid: `--g-m: clamp(80px, 8.333vw, 160px)`, which gives 107 / 120 / 160px at 1280 / 1440 / 1920. Was 200px at 1440.
  - Applies to Home (its "Page content column" 1200 cap is lifted in CSS), Work, Case study and Shots item.
  - The pill width (`--g-pill-w`) is the content width minus 32.
  - Tested by injecting the rule live: text, logo and button edges match on all three pages; no horizontal scroll.
- Nav made identical to Home on Work, Case study and Shots item, on all breakpoints:
  - nav padding 32/80, overflow visible (byline isn't clipped)
  - button: auto width, padding 0 12, gap 8; label "Get in touch" (Outfit 500 16, Home's style); icons 16×20 with Book pinned right 12 / top 10
  - phone: 36px icon-only (label hidden, padding 0 10, Book right 10 / top 8)
- Published a4ca396fd. Verified on Home, Work and Tranzakt:
  - 1440: text at 120px; "Get in touch" button (133px) with the byline visible at rest; the pill sits 135..1305 (≈16px inside the content) and the button folds to the ~42px icon
  - phone: text at 20px, 36px icon button, byline visible, pill 28..362

## 21 Nov 2026: margin back to the original, less 16px a side (uploaded, not published)
- Gift found 120px too wide. `--g-m` is now `max(64px, calc((100vw - 1200px) / 2 + 64px))`: the original 1200 column with 80px padding, 16px narrower each side → 104 / 184 / 424px at 1280 / 1440 / 1920. The pill JS uses the same formula.
- Tablet and phone unchanged. Tested by injecting the rule live on Home, Work and Tranzakt: edges match, no horizontal scroll.

## 21 Nov 2026: layout draft "Home B" at /home-b (canvas only, not published)
- Cloned Home (`augiA20Il`) → page `JIUEvpsxe`, path `/home-b`, name "Home B (layout draft)". The real Home is untouched. The page frame is renamed back to "Home V2 / Index (dark)" so the site code styles it like Home.
- Layout ("Index"):
  - Hero split (`CMFDwKIb0`, horizontal, gap 80): left = Content (pills, headline, intro); right = "Hero index" (440px) with the Featured work header, the CMS Work list and the hover preview, moved out of "03 Work".
  - Rows compacted: padding 14, name 22, arrow 18, number 12.
  - "03 Work" is hidden; the hero is auto height (padding 160/80/24).
  - Then: More about me ribbon → About → Folders → Contact → Footer.
- Tablet/phone: split stacks vertically, index full width; hero padding 96/40 (tablet), 48/20 (phone).
- Screenshots: `mockups/out/home-b-desktop.png`, `mockups/out/home-b-phone.png`.
- To adopt it: swap the paths (Home → /home-a, Home B → /) or copy the layout into Home. To drop it: delete the page.

## 23 Nov 2026: layout polish batch + canvas-first cleanup (published 9d4915388, live)
- Desktop margin `--g-m = max(64px, (100vw − 1200px)/2 + 64px)` is live: text at 184px at 1440. Tablet/phone unchanged.
- Grid rails: `#g-grid` opacity 0.3 (case studies keep 0.2).
- Folders: `columns` is now "Max per row" (set to 4 on all breakpoints). All four sit in one row when each gets ≥180px, else two per row. The component measures its parent, not itself. 1440: 4 × 256px; phone: 2 × 171px.
- Contact (canvas): divider (0.3px top border) removed on all breakpoints. Email + socials sit lower: desktop padding 160/80/72, gap 120; tablet 120/32/56, gap 96; phone 72/20/40, gap 64.
- Phone footer (canvas): one row, © left, Back to top right; padding 24/20/72 so the Framer badge doesn't cover the button.
- About toggle: both "Dotted line" layers deleted; the button now sits left under the intro. Top padding 40 / 32 / 24.
- Removed CSS that repeated canvas settings (canvas now wins): About toggle dotted-line rules, section `border-top: 0` and footer border, phone hero padding, tablet About direction/gap/width, phone nav-link hiding, phone Lede width, phone Socials wrap/gaps. 177 → 167 `!important`.
- Still code-controlled on purpose: desktop side margin (`--g-m`, one value for all pages), About statement font sizes (Framer runs don't hold them), nav pill, grid, grain, theme, reveal, case-study tablet/phone layout.
- Publishing kit: `tools/kit/` (`node upload.mjs publish`). `publish()` updates the live domain directly.

## 23 Nov 2026: logo rework (published 92d42f42e, live)
- Artwork: the small "DESIGNS" now starts in the gap under the g's bar (x≈12.1 of 58), letters 10% bigger, right edge on the last i. Same 58×29 artboard. SVG: project files `logo-preview-2026-11-23/logo-new.svg`.
- New component "Logo mark" (`A898H4rvE`) shows both versions side by side: variant "New" (primary, 60.32×30.16) and "Original" (58×29). Both are SVG image fills (the API can't import SVG as vectors or clone vector sets).
- Nav Logo component (`d0D1RTQxD`): its "Container" frame is renamed "Logo art" and carries the new SVG as its fill, 4% bigger (60.32×30.16; Variant 2 84.5×42.25). The old vector inside is hidden, not deleted. To go back: clear the fill and show the vector again.
- Layers inside a component can be edited with setAttributes, but not used as a parent (addComponentInstance/setParent fail), so the nav can't hold a "Logo mark" instance via the API.
- CSS: `${LIGHT} [data-framer-name="Logo art"] img { filter: none }` so the image inverts with the page in light mode.
- Verified live: 60×30 at desktop and phone, dark and light themes, no old vector showing.
- 23 Nov (later): phone logo reduced to 48×24 via CSS (`@media (max-width: 809px) [data-framer-name="Logo art"]`); desktop/tablet stay 60×30. Published ebb8fe9cb, verified on iPhone 13 (dark + light).
