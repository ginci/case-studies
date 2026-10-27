# Case studies — Ginci Designs

Interactive portfolio case studies built to move into Framer. First up: **Tranzakt Finance**.

Framer is the final host. This repo is where the content and interactive demos are written, versioned and previewed.

## What's here

| Path | What it is |
|---|---|
| `content/case-studies.json` | All case-study copy. The source of truth. One object per case study. |
| `content/case-studies.csv` | The same content, flattened for **Framer CMS → Import CSV**. Generated, don't hand-edit. |
| `framer-components/` | The interactive demos as Framer code components (React `.tsx`). |
| `preview/index.html` | A single-file preview of the full page. Open it in any browser. Generated. |
| `preview/src/` | Preview source (layout + styles). |
| `scripts/` | Build scripts. |

### The demos

- **ComponentExplorer**: design-system button with size / hierarchy / state / icon-slot toggles and live 8pt token readouts.
- **MiniCheckout**: payment gateway; fee appears only for the chosen method, copy button on USSD and Transfer only. *Sample fees.*
- **KycStateSwitcher**: Personal / Business / Government × In review, Action required, Failed, Save & quit, Success.
- **ExplainRecommendExecute**: Merchant AI collections moment in three steps. *Sample data.*
- **DeviceMockup**: laptop / phone / browser frame. Shows a labelled placeholder until you drop in a screenshot.

## Editing content

1. Edit `content/case-studies.json`.
2. Anything in `[square brackets]` is a placeholder and shows with a dashed underline. Replace it when you have the real thing.
3. Each section has `"status": "live"` or `"coming-soon"`. Coming-soon sections show the heading and summary only. Flip to `live` to reveal the full section and its demo.
4. Rebuild: `npm install` once, then `npm run build`. This regenerates the CSV and the preview.

## Moving to Framer

### 1. Demos → code components
1. In Framer: **Assets → Code → + → New code file**. Name it after the component (e.g. `MiniCheckout`).
2. Replace the starter code with the contents of the matching file in `framer-components/`. Save.
3. Drag it onto the canvas from **Assets → Code**. Adjust the accent colour, text and font from the right-hand panel.
4. Do `DeviceMockup` first. Its **Screenshot** control is where your Figma exports go.

Framer doesn't sync from GitHub, so when a component changes here, paste the new file contents over the old one.

### 2. Copy → CMS
1. In Framer: **CMS → + → New collection** ("Case Studies") → **Import CSV** → choose `content/case-studies.csv`.
2. Set field types on import: `Context`, `Problem`, `Scope`, `Section N Body`, `Section N Decisions`, `Next Steps` → **Formatted Text**. `Cover Image`, `Section N Image` → **Image** (then upload the real exports in Framer; the CSV paths are placeholders). Everything else → **Plain Text**.
3. Build the case-study page template once, bound to the collection. New case studies (Dado Foods, NSIA, MyGreenBlock) are new rows.
4. Use the `Section N Status` field with a conditional variant to show "Coming soon" sections.

### Fonts
The preview uses Instrument Serif (display), Geist (text), Geist Mono (labels) and Outfit (button labels, per the Tranzakt type rule). All are on Google Fonts and available in Framer.

## Adding the next case study
Add a new object to `content/case-studies.json` with the same shape, run `npm run build`, and re-import the CSV.
