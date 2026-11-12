import {
    forwardRef,
    useEffect,
    useRef,
    useState,
    type ComponentType,
} from "react"
import { createPortal } from "react-dom"

// Ginci site behaviour: theme toggle, hover effects, tablet/phone layout,
// CMS-driven accents and the project preview that follows the cursor.
// Layers are targeted by their Framer layer names (data-framer-name).
// Rename a layer in Framer and its rule here stops applying.
//
// CMS hooks (hidden 1×1 layers whose fill is bound to a CMS field):
//   "Accent swatch"       in each "Row / …" (Home) and in the case-study "Header"
//   "Next accent swatch"  in the case-study "Next project (…)" block
//   "Preview swatch"      in each "Row / …" (bound to the Preview image)

const KEY = "ginci-theme"
const ARROW_LIGHT =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23F4F3EE' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14'/%3E%3Cpath d='m13 6 6 6-6 6'/%3E%3C/svg%3E\")"
const ARROW_DARK =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='%23121211' stroke-width='1.75' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5 12h14'/%3E%3Cpath d='m13 6 6 6-6 6'/%3E%3C/svg%3E\")"
const N = (name: string) => `[data-framer-name="${name}"]`
const S = (prefix: string) => `[data-framer-name^="${prefix}"]`
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)"
const ROW = S("Row / ")
const NEXT = S("Next project (")
const LIGHT = `html[data-ginci-theme="light"]`

const CSS = `
/* ---------- Theme ----------
   Light = the whole page inverted once at the root (images flipped back).
   The root, not #main, so it also covers the preview, grain and rails. */
html { background: #121211; }
/* Slide-in reveals start off to the side: never let them cause sideways scroll. */
#main { overflow-x: clip; }
${LIGHT} { filter: invert(1) hue-rotate(180deg); background: #EDEDEE; }
${LIGHT} img, ${LIGHT} video, ${LIGHT} picture { filter: invert(1) hue-rotate(180deg); }
${N("Menu button")} { display: none !important; }
.g-pill-btn:hover { color: #F4F3EE !important; }
.g-pill-btn:focus-visible { outline: 2px solid #F4F3EE; outline-offset: 1px; }

/* ---------- Background shader (ShaderGradient) ---------- */
${N("Background shader")}, ${N("Background shader")} * { pointer-events: none !important; }
${N("Background shader")} { z-index: 0 !important; }
${N("Page content column")}, ${N("Case study page")} > :not(${N("Background shader")}) { position: relative; z-index: 1; }
${LIGHT} ${N("Background shader")} { mix-blend-mode: multiply !important; opacity: 0.5 !important; filter: invert(1) hue-rotate(180deg) blur(100px) !important; }

/* ---------- Case study: the full story stays folded until "Read the full story" ---------- */
${N("Case study page")} ${N("Body")} { overflow: hidden !important; max-height: 30000px; }
html:not([data-g-story]) ${N("Case study page")} ${N("Body")} {
  max-height: 0 !important; height: 0 !important; opacity: 0; padding-top: 0 !important; padding-bottom: 0 !important; visibility: hidden; pointer-events: none;
}
html[data-g-story] ${N("Case study page")} ${N("Body")} { height: auto !important; }
@media (prefers-reduced-motion: no-preference) {
  ${N("Case study page")} ${N("Body")} { transition: opacity 0.5s ease, max-height 0.8s ${EASE} !important; }
}
${N("Story toggle")} { position: relative !important; }
${N("Story toggle")} ${N("Dotted line")} { background: none !important; height: 0 !important; border-top: 1px dotted rgba(244, 243, 238, 0.36) !important; }
@media (min-width: 1200px) { ${N("Story toggle")} { margin-left: -120px !important; margin-right: -120px !important; width: calc(100% + 240px) !important; } }
@media (min-width: 810px) and (max-width: 1199px) { ${N("Story toggle")} { margin-left: -32px !important; margin-right: -32px !important; width: calc(100% + 64px) !important; } }
@media (max-width: 809px) { ${N("Story toggle")} { margin-left: -20px !important; margin-right: -20px !important; width: calc(100% + 40px) !important; } }
${S("CTA / Read the full story")} { background-color: #121211 !important; border: 1px solid rgba(244, 243, 238, 0.2) !important; }
${S("CTA / Read the full story")} * { color: #A3A29C !important; text-transform: uppercase !important; }
${S("CTA / Read the full story")}[aria-expanded="true"] svg { transform: rotate(180deg); }
@media (hover: hover) and (pointer: fine) {
  ${S("CTA / Read the full story")}:hover { background-color: #F4F3EE !important; border-color: #F4F3EE !important; }
  ${S("CTA / Read the full story")}:hover * { color: #121211 !important; }
  ${S("CTA / Read the full story")}:hover svg, ${S("CTA / Read the full story")}:hover svg * { stroke: #121211 !important; }
  ${S("CTA / Read the full story")}:hover svg { animation: g-drop 0.42s ${EASE}; }
  ${S("CTA / Read the full story")}[aria-expanded="true"]:hover svg { animation: g-rise 0.42s ${EASE}; }
}
/* Outcomes: the Stats list as a row of figures */
${N("Outcomes stats")} ul { list-style: none !important; padding: 0 !important; margin: 0 !important; display: grid !important; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; }
${N("Outcomes stats")} li { margin: 0 !important; padding-top: 14px; border-top: 1px solid rgba(244, 243, 238, 0.12); }
${N("Outcomes stats")} li { list-style: none !important; }
${N("Outcomes stats")} li::marker, ${N("Outcomes stats")} li::before { content: none !important; display: none !important; }
${N("Outcomes stats")} li > * { padding-left: 0 !important; margin-left: 0 !important; }
@media (max-width: 809px) { ${N("Outcomes stats")} ul { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 16px; } }
/* Images keep their proportions at every width and stop growing past the layout */
${N("Cover wrap")} { max-width: 1280px !important; margin-left: auto !important; margin-right: auto !important; }
${S("Cover (")} { height: auto !important; aspect-ratio: 1120 / 760; }
${N("Section image")} { height: auto !important; aspect-ratio: 880 / 460; }

/* ---------- About: collapsed until "More about me" ---------- */
${N("04 About")} { overflow: hidden !important; max-height: 2400px; }
html[data-g-about] ${N("04 About")} { height: auto !important; padding-top: 16px !important; }
html:not([data-g-about]) ${N("04 About")} {
  max-height: 0 !important; opacity: 0; padding-top: 0 !important; padding-bottom: 0 !important;
  border: 0 !important; pointer-events: none; visibility: hidden;
}
@media (prefers-reduced-motion: no-preference) {
  ${N("04 About")} { transition: max-height 0.6s ${EASE}, opacity 0.45s ease, padding 0.6s ${EASE}, visibility 0s linear 0s !important; }
  html:not([data-g-about]) ${N("04 About")} { transition: max-height 0.5s ${EASE}, opacity 0.25s ease, padding 0.5s ${EASE}, visibility 0s linear 0.5s !important; }
}
${N("About toggle")} { position: relative !important; }
${N("About toggle")} ${N("Dotted line")} { background: none !important; height: 0 !important; border-top: 1px dotted rgba(244, 243, 238, 0.36) !important; }
/* the ribbon runs to the screen edges: pull it out over the hero's side padding */
@media (min-width: 1200px) { ${N("About toggle")} { margin-left: -80px !important; margin-right: -80px !important; width: calc(100% + 160px) !important; } }
@media (min-width: 810px) and (max-width: 1199px) { ${N("About toggle")} { margin-left: -32px !important; margin-right: -32px !important; width: calc(100% + 64px) !important; } }
@media (max-width: 809px) { ${N("About toggle")} { margin-left: -20px !important; margin-right: -20px !important; width: calc(100% + 40px) !important; } }
${S("CTA / More about me")} {
  background-color: #121211 !important; border: 1px solid rgba(244, 243, 238, 0.18) !important; text-transform: uppercase;
}
${S("CTA / More about me")} * { color: #A3A29C !important; text-transform: uppercase !important; }
${S("CTA / More about me")} svg { overflow: hidden; }
${S("CTA / More about me")}[aria-expanded="true"] svg { transform: rotate(180deg); }
${S("CTA / More about me")}:focus-visible { outline: 2px solid #F4F3EE; outline-offset: 3px; }
@media (hover: hover) and (pointer: fine) {
  ${S("CTA / More about me")}:hover { background-color: #F4F3EE !important; border-color: #F4F3EE !important; }
  ${S("CTA / More about me")}:hover * { color: #121211 !important; }
  ${S("CTA / More about me")}:hover svg *, ${S("CTA / More about me")}:hover svg { stroke: #121211 !important; }
  ${S("CTA / More about me")}:hover svg { animation: g-drop 0.42s ${EASE}; }
  ${S("CTA / More about me")}[aria-expanded="true"]:hover svg { animation: g-rise 0.42s ${EASE}; }
}
@keyframes g-drop { from { transform: translateY(-110%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes g-rise { from { transform: rotate(180deg) translateY(-110%); opacity: 0; } to { transform: rotate(180deg) translateY(0); opacity: 1; } }
@media (prefers-reduced-motion: no-preference) {
  ${S("CTA / More about me")} { transition: background-color 0.25s ease, border-color 0.25s ease !important; }
  ${S("CTA / More about me")} * { transition: color 0.25s ease; }
}

/* ---------- Inline link chips (hero intro, About) ---------- */
${N("Lede")} a, ${S("Statement")} a, ${N("Lede")} a:hover, ${S("Statement")} a:hover {
  display: inline; padding: 0.04em 0.32em !important; margin: 0 0.04em !important; border-radius: 0.3em !important; text-decoration: none !important;
  background-color: rgba(244, 243, 238, 0.12); color: #F4F3EE !important; box-decoration-break: clone; -webkit-box-decoration-break: clone;
  transition: background-color 0.25s ease, color 0.25s ease;
}
${N("Lede")} a *, ${S("Statement")} a * { color: inherit !important; }
${N("Lede")} a[href*="tranzakt"], ${S("Statement")} a[href*="tranzakt"] { background-color: rgba(111, 208, 140, 0.16); }
${N("Lede")} a[href*="dado"] { background-color: rgba(232, 114, 31, 0.18); }
${S("Statement")} a[href*="contentscribe"] { background-color: rgba(140, 124, 240, 0.18); }
${S("Statement")} a[href*="contentscribe"]:hover, ${S("Statement")} a[href*="contentscribe"]:focus-visible { background-color: #8C7CF0; }
${N("Lede")} a:hover, ${S("Statement")} a:hover, ${N("Lede")} a:focus-visible, ${S("Statement")} a:focus-visible { background-color: #F4F3EE; color: #121211 !important; outline: none; }
${N("Lede")} a[href*="tranzakt"]:hover, ${N("Lede")} a[href*="tranzakt"]:focus-visible, ${S("Statement")} a[href*="tranzakt"]:hover { background-color: #6FD08C; }
${N("Lede")} a[href*="dado"]:hover, ${N("Lede")} a[href*="dado"]:focus-visible { background-color: #E8721F; }

${N("About toggle")} > * { position: relative; z-index: 1; }
${LIGHT} #g-menu > div:first-child { background: rgba(255,255,255,0.55) !important; }

@media (prefers-reduced-motion: no-preference) { html { transition: filter 0.3s ease; } }

/* ---------- Nav ---------- */
/* Nav sits darker than the page so it always reads as its own layer. */
${N("Nav (fixed)")} { z-index: 20 !important; }
html:not([data-g-scrolled]) ${N("Nav (fixed)")} { background: transparent !important; border-color: transparent !important; box-shadow: none !important; }

/* ---------- Work list: page background at rest, project surface on hover ---------- */
${N("03 Work (index)")} { background-color: #121211 !important; }
${ROW} {
  --g-accent: #F4F3EE; cursor: pointer; position: relative !important;
  background-color: transparent !important; border-radius: 14px;
  margin-left: -20px !important; margin-right: -20px !important;
  padding-left: 20px !important; padding-right: 20px !important;
  width: calc(100% + 40px) !important; box-sizing: border-box !important;
}
${ROW}::after {
  content: ""; position: absolute; left: 20px; right: 20px; bottom: 0; height: 1px;
  background: #2A2A27; pointer-events: none;
}

${ROW} ${N("Name")} * { color: #F4F3EE !important; }
${ROW} ${N("Arrow")} * { color: #85847E !important; }

${N("Accent swatch")}, ${N("Next accent swatch")}, ${N("Preview swatch")} { pointer-events: none !important; }

/* ---------- Contact: socials sit with the email, not the footer ---------- */
${N("Email underline")} { width: min(1170px, 100%) !important; transform-origin: left center; transform: scaleX(0); background-color: #F4F3EE !important; }
${N("05 Contact")}:has(${S("Email (")}:hover) ${N("Email underline")} { transform: scaleX(1); }
${S("Email (")} { cursor: pointer; }
${N("Socials")} a, ${N("Socials")} [data-framer-name] { cursor: pointer; }
${N("Socials")} *:hover { color: #F4F3EE !important; }

/* ---------- CTAs ---------- */
${S("CTA / Email")} { background-color: #F4F3EE !important; border-color: #F4F3EE !important; }
${S("CTA / Email")} * { color: #121211 !important; }
${S("CTA / Email")} { box-shadow: 0 0 0 0 rgba(244, 243, 238, 0.35); }
@media (prefers-reduced-motion: no-preference) {
  ${S("CTA / Email")} { animation: g-pulse-ring 4.5s ease-out infinite; transition: transform 0.25s ${EASE}; }
  ${S("CTA / Email")} svg { transform-origin: 50% 30%; animation: g-ring 4.5s ease-in-out infinite; }
  ${S("CTA / Email")}:hover { transform: scale(1.06); }
}
@keyframes g-ring { 0%, 76%, 100% { transform: rotate(0); } 80% { transform: rotate(-14deg); } 84% { transform: rotate(12deg); } 88% { transform: rotate(-8deg); } 92% { transform: rotate(5deg); } 96% { transform: rotate(0); } }
@keyframes g-pulse-ring { 0%, 70% { box-shadow: 0 0 0 0 rgba(244, 243, 238, 0.32); } 100% { box-shadow: 0 0 0 10px rgba(244, 243, 238, 0); } }

/* ---------- Case study: CMS accent, TOC, rich text ---------- */
${N("Header")} ${N("Title")}, ${N("Header")} ${N("Title")} * { white-space: normal !important; }
${N("Header")} ${N("Title")} { max-width: 100% !important; }
${N("Facts")} > * { min-width: 0 !important; }
${N("Facts")} > * > *, ${N("Facts")} > * > * * { white-space: normal !important; max-width: 100% !important; }
${N("Header")} ${N("Title")} * { font-size: min(128px, 10.5vw) !important; }
${N("Crumb title")} { cursor: pointer; }
${N("TOC marker")} { display: none !important; }
${S("TOC / ")} { position: relative !important; cursor: pointer; }
${S("TOC / ")}::before {
  content: ""; position: absolute; left: -14px; top: 50%; width: 2px; height: 14px; margin-top: -7px;
  border-radius: 2px; background: var(--g-page-accent, #F4F3EE); opacity: 0;
}
${S("TOC / ")}[data-g-current]::before { opacity: 1; }
${S("TOC / ")} ${N("TOC label")} * { color: #85847E !important; }
${S("TOC / ")}[data-g-current] ${N("TOC label")} *, ${S("TOC / ")}:hover ${N("TOC label")} * { color: #F4F3EE !important; }
${N("Section body")} strong, ${N("Section body")} b { color: #F4F3EE !important; font-weight: 600; }
${N("Section body")} ul, ${N("Section body")} ol { margin: 4px 0 0 !important; padding-left: 22px !important; }
${N("Section body")} li { margin-bottom: 6px; }
${N("Section body")} li::marker { color: var(--g-page-accent, #85847E); }
${N("Section image")} { border-radius: 16px; }

/* ---------- Next project: arrow fills with the next project's colour ---------- */
${NEXT} { position: relative !important; cursor: pointer; overflow: hidden; --g-next-accent: #F4F3EE; }
${NEXT}::after {
  content: ""; position: absolute; right: 40px; top: 50%;
  width: 88px; height: 88px; margin-top: -44px; border-radius: 999px;
  border: 1.5px solid rgba(244, 243, 238, 0.55);
  background: transparent ${ARROW_LIGHT} center / 32px no-repeat;
}

${NEXT} > :not(${N("Next accent swatch")}) { max-width: calc(100% - 160px) !important; }
${NEXT} ${N("Next title")}, ${NEXT} ${N("Next title")} * { white-space: normal !important; }

/* ---------- Case study: Process as a numbered timeline ---------- */
${N("Steps")} {
  position: relative !important; counter-reset: g-step; gap: 32px !important;
  padding-top: 56px !important; overflow: visible !important;
}
${N("Steps")}::before {
  content: ""; position: absolute; left: 0; right: 0; top: 15px; height: 1px;
  background: rgba(244, 243, 238, 0.2);
}
${N("Steps")} { align-items: stretch !important; }
${N("Steps")} > * {
  position: relative !important; counter-increment: g-step; overflow: visible !important;
  background: #2A2A27 !important; border: 1px solid rgba(244, 243, 238, 0.08) !important; border-radius: 14px !important;
  box-shadow: none !important; padding: 20px !important; gap: 8px !important; height: auto !important;
}
${N("Steps")} > *::after { display: none !important; }
${N("Steps")} > *::before {
  content: counter(g-step, decimal-leading-zero); position: absolute; left: 0; top: -56px;
  width: 30px; height: 30px; box-sizing: border-box; border-radius: 50%; display: grid; place-items: center;
  background: #20201E; border: 1px solid rgba(244, 243, 238, 0.3); color: #F4F3EE;
  font: 500 11px/1 "Geist Mono", ui-monospace, monospace;
}

/* ---------- About: let the photo gallery pop out of its frames ---------- */
${N("04 About")}, ${N("04 About")} > *, ${N("04 About")} > * > * { overflow: visible !important; }

/* ---------- Sections: surfaces, hairline, spacing ---------- */
${N("01 Hero")}, ${N("04 About")}, ${N("06 Footer")} { background-color: #121211 !important; }
${N("05 Contact")} { background-color: #161615 !important; }
${N("03 Work (index)")}, ${N("02 Portrait")}, ${N("04 About")}, ${N("05 Contact")} { border-top: 0 !important; }
${N("06 Footer")} { border-top: 1px solid rgba(244, 243, 238, 0.1) !important; }
@media (min-width: 1200px) {
  ${N("03 Work (index)")}, ${N("04 About")}, ${N("05 Contact")} { padding-top: 160px !important; padding-bottom: 160px !important; }
}

/* Light theme: the scrolled nav pill is pure white (black before the page-wide invert). */
html[data-ginci-theme="light"][data-g-scrolled] ${N("Nav (fixed)")} {
  background-color: #000 !important; border-color: rgba(244, 243, 238, 0.14) !important;
  box-shadow: 0 12px 40px rgba(255, 255, 255, 0.10) !important;
}

/* Light theme case studies: near-white page (dark before the invert) and stronger body text. */
${LIGHT} ${N("Case study page")}, ${LIGHT} ${N("Case study page")} ${N("Header")} { background-color: #0D0D0C !important; }
${LIGHT} ${N("Section body")} *:not(strong):not(b), ${LIGHT} ${N("Next line")} *, ${LIGHT} ${N("Locked body")} *,
${LIGHT} ${N("Section label")} *, ${LIGHT} ${S("TOC / ")} ${N("TOC label")} *, ${LIGHT} ${N("Facts")} * { color: #ABAAA4 !important; }
${LIGHT} ${N("Facts")} [data-framer-name$="value"] * { color: #F4F3EE !important; }

/* ---------- Footer: muted meta, one clear action ---------- */
${N("Now line")} > p::before {
  content: ""; display: inline-block; width: 6px; height: 6px; margin-right: 10px; border-radius: 50%;
  vertical-align: 1px; background: #F4F3EE; box-shadow: 0 0 8px 1px rgba(244, 243, 238, 0.55);
}
${S("Back to top")} {
  cursor: pointer; padding: 10px 18px !important; border: 1px solid rgba(244, 243, 238, 0.18);
  border-radius: 999px;
}
${S("Back to top")} * { color: #F4F3EE !important; }
${S("Back to top")}:hover, ${S("Back to top")}:focus-visible { background-color: #F4F3EE; outline: none; }
${S("Back to top")}:hover *, ${S("Back to top")}:focus-visible * { color: #121211 !important; }

/* ---------- Nav: becomes a floating pill once the page scrolls ---------- */
${N("Nav (fixed)")} {
  align-self: center !important; width: 100% !important; max-width: 100% !important;
  border: 1px solid transparent !important; box-sizing: border-box !important;
}
html[data-g-scrolled] ${N("Nav (fixed)")} {
  top: 14px !important; max-width: min(920px, calc(100% - 32px)) !important;
  border-radius: 999px !important; padding: 10px 10px 10px 24px !important;
  background-color: rgba(11, 11, 10, 0.92) !important; border-color: rgba(244, 243, 238, 0.12) !important;
  backdrop-filter: blur(14px) saturate(1.2); -webkit-backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

/* ---------- Motion (only when the visitor allows it) ---------- */
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
  ${ROW} { transition: background-color 0.35s ease; }
  ${ROW} ${N("Name")} *, ${ROW} ${N("Arrow")} * { transition: color 0.3s ease; }
  ${ROW} ${N("Arrow")} { transition: transform 0.4s ${EASE}; }

  ${N("Email underline")} { transition: transform 0.7s ${EASE}; }
  ${NEXT}::after { transition: background-color 0.35s ease, border-color 0.35s ease, transform 0.45s ${EASE}; }
  ${NEXT} ${N("Next title")} { transition: transform 0.6s ${EASE}; }
  ${NEXT} ${N("Next title")} * { transition: color 0.35s ease; }
  ${S("TOC / ")}::before { transition: opacity 0.3s ease; }
  ${S("Back to top")} { transition: background-color 0.3s ease; }
  ${S("Back to top")} * { transition: color 0.3s ease; }
  ${N("Nav (fixed)")} {
    transition: max-width 0.7s ${EASE}, top 0.7s ${EASE}, border-radius 0.7s ${EASE}, padding 0.7s ${EASE},
      background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.7s ease !important;
  }
  [data-g-rv] {
    opacity: 0 !important;
    transition: opacity 0.9s ${EASE}, transform 0.9s ${EASE} !important;
    transition-delay: var(--g-d, 0ms) !important;
  }
  [data-g-rv="u"] { transform: translate3d(0, 32px, 0) !important; }
  [data-g-rv="l"] { transform: translate3d(-56px, 0, 0) !important; }
  [data-g-rv="r"] { transform: translate3d(56px, 0, 0) !important; }
  [data-g-rv][data-g-in] { opacity: 1 !important; transform: none !important; }
}


/* ---------- Hover effects only where a real pointer hovers (no sticky hover after a tap on phones/tablets) ---------- */
${ROW}:focus-visible { background-color: color-mix(in srgb, var(--g-accent) 9%, #161615) !important; outline: none; }
@media (hover: hover) and (pointer: fine) {
${ROW}:hover {
  background-color: color-mix(in srgb, var(--g-accent) 9%, #161615) !important; outline: none;
}
${ROW}:hover::after { opacity: 0; }
${ROW}:hover ${N("Name")} *, ${ROW}:hover ${N("Arrow")} * { color: var(--g-accent, #F4F3EE) !important; }
${NEXT}:hover::after {
  background-color: var(--g-next-accent); border-color: var(--g-next-accent);
  background-image: ${ARROW_DARK}; transform: translateX(8px);
}
${NEXT}:hover ${N("Next title")} { transform: translateX(16px); }
${NEXT}:hover ${N("Next title")} * { color: var(--g-next-accent) !important; }
${ROW}:hover ${N("Arrow")} { transform: translateX(10px); }
}

/* ---------- Folders (Folders.tsx) ---------- */
/* Folder grid sizing lives in Folders.tsx (it measures itself). */
/* Folder pages (Writing, Resources, Photography, Other outlets) */
@media (max-width: 1199px) {
  ${N("Shelf header")} { padding: 120px 32px 40px !important; }
  ${N("Shelf list")} { padding: 0 32px 120px !important; }
}
@media (max-width: 809px) {
  ${N("Shelf header")} { padding: 64px 20px 32px !important; max-width: 100% !important; }
  ${N("Shelf title")} * { font-size: 40px !important; }
  ${N("Shelf description")} * { font-size: 17px !important; }
  ${N("Shelf list")} { padding: 0 20px 88px !important; grid-template-columns: 1fr !important; max-width: 100% !important; }
  ${N("Shelf list")} ${N("Shelf thumb")} { flex-shrink: 0; }
}


/* ---------- Tablet (810–1199) ---------- */
@media (max-width: 1199px) {
  ${N("Nav (fixed)")} { padding: 20px 32px !important; }
  ${N("01 Hero")} { padding: 72px 32px 96px !important; }
  ${N("Headline (lines rise in)")} * { font-size: 60px !important; }
  ${N("03 Work (index)")}, ${N("04 About")}, ${N("05 Contact")} { padding: 120px 32px !important; }
  ${ROW} ${N("Name")} * { font-size: 52px !important; }
  ${ROW} ${N("Meta")} { width: 220px !important; }
  ${N("04 About")} { flex-direction: column !important; gap: 32px !important; }
  ${N("04 About")} > * { width: 100% !important; }
  ${N("Statement (word reveal on scroll)")} * { font-size: 34px !important; }
  ${S("Email (")} * { font-size: 76px !important; }
  ${N("06 Footer")} { padding: 24px 32px !important; }
  ${N("Header")} { padding-left: 32px !important; padding-right: 32px !important; }
  ${N("Header")} p, ${N("Header")} h1, ${N("Header")} *, ${N("Facts")} * { white-space: normal !important; }
  ${N("Header")} > *, ${N("Header")} > * > * { max-width: 100% !important; }
  ${N("Facts")} { flex-wrap: wrap !important; padding-left: 32px !important; padding-right: 32px !important; row-gap: 24px !important; column-gap: 24px !important; }
  ${N("Facts")} > * { flex: 0 0 calc(50% - 12px) !important; min-width: 0 !important; }
  ${N("Cover wrap")} { padding-left: 32px !important; padding-right: 32px !important; }
  ${N("Body")} { padding-left: 32px !important; padding-right: 32px !important; }
  ${S("TOC")} { display: none !important; }
  ${N("Body")} > ${N("Main")} { flex: 1 1 100% !important; width: 100% !important; padding: 0 !important; }
  ${N("Main")} > * { width: 100% !important; }
  ${N("Main")} [data-framer-name], ${N("Main")} p, ${N("Main")} h1, ${N("Main")} h2, ${N("Main")} h3 { white-space: normal !important; max-width: 100% !important; }
  ${N("Section title")} * { font-size: 34px !important; }
  ${NEXT} { padding-left: 32px !important; padding-right: 32px !important; }
  ${NEXT} ${N("Next title")} * { font-size: 64px !important; }
  ${NEXT}::after { right: 32px; width: 72px; height: 72px; margin-top: -36px; background-size: 28px; }
}

/* ---------- Phone (up to 809) ---------- */
@media (max-width: 809px) {
  #main * { max-width: 100%; }
  ${N("Nav (fixed)")} { padding: 16px 20px !important; }
  ${N("Nav (fixed)")} ${N("Work")}, ${N("Nav (fixed)")} ${N("About")}, ${N("Nav (fixed)")} ${N("Contact")} { display: none !important; }
  ${N("Nav (fixed)")} ${S("CTA / Email")} { display: none !important; }
  ${N("Nav (fixed)")} ${N("Frame")} { gap: 12px !important; }
  html[data-g-scrolled] ${N("Nav (fixed)")} { top: 10px !important; max-width: calc(100% - 20px) !important; padding: 8px 8px 8px 16px !important; }
  ${N("01 Hero")} { padding: 48px 20px 72px !important; gap: 24px !important; }
  ${N("Headline (lines rise in)")} * { font-size: 40px !important; }
  ${N("01 Hero")} > ${N("Frame")} { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
  ${N("Lede")} { width: 100% !important; }
  ${N("Lede")} * { font-size: 17px !important; }
  ${N("03 Work (index)")}, ${N("04 About")}, ${N("05 Contact")} { padding: 88px 20px !important; }
  ${ROW} { padding-top: 22px !important; padding-bottom: 22px !important; gap: 14px !important;
    margin-left: -12px !important; margin-right: -12px !important; padding-left: 12px !important; padding-right: 12px !important; width: calc(100% + 24px) !important; }
  ${ROW}::after { left: 12px; right: 12px; }
  ${ROW} ${N("Name")} * { font-size: 30px !important; }
  ${ROW} ${N("Name")} { flex: 1 1 auto !important; min-width: 0 !important; }
  ${ROW} ${N("Meta")} { display: none !important; }
  ${ROW} ${N("Num")} { width: 24px !important; flex: 0 0 24px !important; }
  ${N("More work")} { padding-top: 32px !important; }
  ${N("Statement (word reveal on scroll)")} * { font-size: 26px !important; }
  ${S("Exp / ")} { flex-wrap: wrap !important; row-gap: 4px !important; }
  ${S("Exp / ")} > :first-child { width: 100% !important; flex: 0 0 100% !important; }
  ${S("Email (")} * { font-size: 30px !important; }
  ${N("05 Contact")} > :first-child, ${N("05 Contact")} > :first-child * { white-space: normal !important; width: 100% !important; }
  ${N("Socials")} { flex-wrap: wrap !important; row-gap: 12px !important; column-gap: 24px !important; }
  ${N("06 Footer")} { padding: 32px 20px 40px !important; flex-direction: column !important; align-items: flex-start !important; gap: 16px !important; }
  ${N("Header")} { padding: 48px 20px 40px !important; }
  ${N("Header")} > :first-child { flex-wrap: wrap !important; gap: 8px !important; }
  ${N("Header")} ${N("Lede")} * { font-size: 18px !important; }
  ${N("Facts")} { padding-left: 20px !important; padding-right: 20px !important; }
  ${N("Cover wrap")} { padding: 24px 20px !important; }
  ${N("Body")} { padding-left: 20px !important; padding-right: 20px !important; }
  ${N("Main")} { gap: 72px !important; }
  ${N("Section title")} * { font-size: 28px !important; }
  ${N("Section body")} * { font-size: 16px !important; }
  ${N("Steps")} { flex-direction: column !important; padding-top: 0 !important; padding-left: 52px !important; gap: 32px !important; }
  ${N("Steps")}::before { left: 15px; right: auto; top: 6px; bottom: 6px; width: 1px; height: auto; }
  ${N("Steps")} > * { width: 100% !important; min-width: 0 !important; }
  ${N("Steps")} > *::before { left: -52px; top: 16px; }
  ${NEXT} { padding: 64px 20px 64px !important; }
  ${NEXT} > :not(${N("Next accent swatch")}) { max-width: calc(100% - 76px) !important; }
  ${NEXT} ${N("Next title")} * { font-size: 36px !important; }
  ${NEXT}::after { top: 80px; margin-top: 0; right: 20px; width: 56px; height: 56px; background-size: 22px; }
  #g-grid b:nth-child(1), #g-grid b:nth-child(3) { display: none; }
  #g-grid b:nth-child(2) { left: 33.333%; }
  #g-grid b:nth-child(4) { left: 66.666%; }
}

/* ---------- Texture: grain + vertical grid lines that grow with scroll ---------- */
#g-grain {
  position: fixed; inset: 0; z-index: 40; pointer-events: none; opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.62' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 260px 260px;
}
/* Signature rails: four hairline tracks; lines 1 and 3 draw down from the top,
   2 and 4 draw up from the bottom, each led by a glowing point. Staggered. */
#g-grid { position: fixed; inset: 0; z-index: 15; pointer-events: none; --g-ink: 244, 243, 238; }
#g-grid b { position: absolute; top: 0; bottom: 0; width: 1px; background: rgba(var(--g-ink), 0.022); }
#g-grid b:nth-child(1) { left: 20%; }
#g-grid b:nth-child(2) { left: 40%; }
#g-grid b:nth-child(3) { left: 60%; }
#g-grid b:nth-child(4) { left: 80%; }
#g-grid i {
  position: absolute; left: 0; top: 0; width: 1px; height: 100%;
  transform-origin: top center; transform: scaleY(var(--g-p, 0));
  background: linear-gradient(to bottom, rgba(var(--g-ink), 0), rgba(var(--g-ink), 0.14));
}
#g-grid b:nth-child(even) i {
  transform-origin: bottom center;
  background: linear-gradient(to top, rgba(var(--g-ink), 0), rgba(var(--g-ink), 0.14));
}
#g-grid s {
  position: absolute; left: -2px; top: -2px; width: 5px; height: 5px; border-radius: 50%;
  background: rgba(var(--g-ink), 0.6);
  box-shadow: 0 0 6px 1px rgba(var(--g-ink), 0.4), 0 0 22px 5px rgba(var(--g-ink), 0.12);
  transform: translateY(var(--g-y, 0px)); opacity: var(--g-o, 0); transition: opacity 0.3s ease;
}
#g-grid u {
  position: absolute; left: -1px; width: 3px; height: 3px; border-radius: 50%;
  background: rgba(var(--g-ink), 0.22); top: -1px;
}
#g-grid b:nth-child(even) u { top: auto; bottom: -1px; }
@media (prefers-reduced-motion: no-preference) {
  #g-grid s { animation: g-pulse 2.8s ease-in-out infinite; }
  #g-grid b:nth-child(2) s { animation-delay: -0.7s; }
  #g-grid b:nth-child(3) s { animation-delay: -1.4s; }
  #g-grid b:nth-child(4) s { animation-delay: -2.1s; }
}
@keyframes g-pulse {
  0%, 100% { box-shadow: 0 0 6px 1px rgba(var(--g-ink), 0.4), 0 0 22px 5px rgba(var(--g-ink), 0.12); }
  50% { box-shadow: 0 0 9px 2px rgba(var(--g-ink), 0.55), 0 0 34px 9px rgba(var(--g-ink), 0.18); }
}
`

function ensureStyle() {
    if (typeof document === "undefined") return
    let s = document.getElementById("ginci-site-css")
    if (!s) {
        s = document.createElement("style")
        s.id = "ginci-site-css"
        document.head.appendChild(s)
    }
    if (s.textContent !== CSS) s.textContent = CSS
}

// ---------- Theme ----------
function readTheme() {
    try {
        return localStorage.getItem(KEY) === "light" ? "light" : "dark"
    } catch (e) {
        return "dark"
    }
}

function applyTheme(theme: string) {
    if (typeof document === "undefined") return
    document.documentElement.dataset.ginciTheme = theme
    window.dispatchEvent(new CustomEvent("ginci-theme", { detail: theme }))
}

function setTheme(theme: string) {
    applyTheme(theme)
    try {
        localStorage.setItem(KEY, theme)
    } catch (e) {}
}

const SUN = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
)
const MOON = (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
)

// Sun/moon segmented switch: a radio group, arrow keys move between the two.
function ThemePill({ style, forwardedRef }: { style?: any; forwardedRef?: any }) {
    const [theme, setT] = useState("dark")
    useEffect(() => {
        setT(document.documentElement.dataset.ginciTheme === "light" ? "light" : "dark")
        const on = (e: any) => setT(e.detail)
        window.addEventListener("ginci-theme", on)
        return () => window.removeEventListener("ginci-theme", on)
    }, [])
    const pick = (t: string) => { setTheme(t); setT(t) }
    const btn = (t: string, label: string, icon: any) => {
        const on = theme === t
        return (
            <button type="button" role="radio" aria-checked={on} aria-label={label} tabIndex={on ? 0 : -1}
                onClick={() => pick(t)}
                onKeyDown={(e) => {
                    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                        e.preventDefault(); const n = t === "light" ? "dark" : "light"; pick(n)
                        ;(e.currentTarget.parentElement?.querySelector(`[aria-label="${n === "light" ? "Light" : "Dark"}"]`) as HTMLElement)?.focus()
                    }
                }}
                className="g-pill-btn"
                style={{
                    width: 30, height: 30, padding: 0, display: "grid", placeItems: "center", borderRadius: 999, cursor: "pointer",
                    border: 0, background: on ? "#2E2E2B" : "transparent", color: on ? "#F4F3EE" : "#85847E",
                    boxShadow: on ? "0 1px 2px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(244,243,238,0.08)" : "none",
                    transition: "background-color 0.2s ease, color 0.2s ease",
                }}>
                {icon}
            </button>
        )
    }
    return (
        <div ref={forwardedRef} role="radiogroup" aria-label="Colour theme" data-framer-name="Theme toggle"
            style={{
                ...style, width: "auto", height: "auto", display: "flex", alignItems: "center", gap: 2, padding: 2,
                borderRadius: 999, border: "1px solid rgba(244,243,238,0.14)", background: "#121211", boxSizing: "border-box",
            }}>
            {btn("light", "Light", SUN)}
            {btn("dark", "Dark", MOON)}
        </div>
    )
}

// Apply to the Theme toggle in the nav (on every page). Renders the sun/moon
// switch in its place and starts the site FX.
export function withThemeToggle(Component: any): ComponentType {
    return forwardRef((props: any, ref) => {
        useEffect(() => {
            ensureStyle()
            applyTheme(readTheme())
            setupFX()
            const t1 = setTimeout(setupFX, 700)
            const t2 = setTimeout(setupFX, 2000)
            return () => {
                clearTimeout(t1)
                clearTimeout(t2)
            }
        }, [])
        const { style } = props
        return <ThemePill forwardedRef={ref} style={{ position: style?.position, top: style?.top, left: style?.left, right: style?.right, bottom: style?.bottom, transform: style?.transform, flexShrink: 0 }} />
    })
}

// ---------- Case study: "Read the full story" ----------
// Apply to the "Read the full story" button. Unfolds the case study's Body.
export function withStoryToggle(Component: any): ComponentType {
    return forwardRef((props: any, ref) => {
        const local = useRef<HTMLElement | null>(null)
        const [open, setOpen] = useState(false)
        useEffect(() => {
            ensureStyle()
            document.documentElement.toggleAttribute("data-g-story", open)
            const el = local.current
            if (el) {
                const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
                let n = walker.nextNode()
                while (n) {
                    const v = n.nodeValue || ""
                    if (/read the full story|show less/i.test(v)) {
                        const to = open ? "Show less" : "Read the full story"
                        n.nodeValue = v === v.toUpperCase() ? to.toUpperCase() : to
                    }
                    n = walker.nextNode()
                }
            }
            if (open) {
                const body = document.querySelector('[data-framer-name="Body"]')
                body && body.querySelectorAll("[data-g-rv]").forEach((k) => k.setAttribute("data-g-in", ""))
            }
        }, [open])
        useEffect(() => () => document.documentElement.removeAttribute("data-g-story"), [])
        const setRef = (node: HTMLElement | null) => {
            local.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) (ref as any).current = node
        }
        return (
            <Component {...props} ref={setRef} role="button" tabIndex={0} aria-expanded={open}
                onClick={(e: any) => { e.preventDefault(); setOpen((o) => !o) }}
                onKeyDown={(e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o) } }}
                style={{ ...props.style, cursor: "pointer" }} />
        )
    })
}

// ---------- About: collapsed under the hero, opened by "More about me" ----------
// Apply to the "More about me" chip. Toggles the "04 About" section and swaps
// the chip's word More/Less.
export function withAboutToggle(Component: any): ComponentType {
    return forwardRef((props: any, ref) => {
        const local = useRef<HTMLElement | null>(null)
        const [open, setOpen] = useState(false)
        useEffect(() => {
            ensureStyle()
            document.documentElement.toggleAttribute("data-g-about", open)
            const el = local.current
            if (!el) return
            const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
            let n = walker.nextNode()
            while (n) {
                const v = n.nodeValue || ""
                if (/\b(more|less)\b/i.test(v))
                    n.nodeValue = v.replace(/\b(more|less)\b/i, (w) => {
                        const to = open ? "less" : "more"
                        return w === w.toUpperCase() ? to.toUpperCase() : w[0] === w[0].toUpperCase() ? to[0].toUpperCase() + to.slice(1) : to
                    }).replace(/[↓↑]/, open ? "↑" : "↓")
                n = walker.nextNode()
            }
            if (open) {
                const sec = document.querySelector('[data-framer-name="04 About"]')
                sec && sec.querySelectorAll("[data-g-rv]").forEach((k) => k.setAttribute("data-g-in", ""))
            }
        }, [open])
        const setRef = (node: HTMLElement | null) => {
            local.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) (ref as any).current = node
        }
        return (
            <Component {...props} ref={setRef} role="button" tabIndex={0} aria-expanded={open} aria-controls="about"
                onClick={(e: any) => { e.preventDefault(); setOpen((o) => !o) }}
                onKeyDown={(e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o) } }}
                style={{ ...props.style, cursor: "pointer" }} />
        )
    })
}

// ---------- Mobile menu (Phone breakpoint) ----------
// Apply to the "Menu button" layer in the nav. Opens a sidebar with the page
// links, the theme switch and the contact button. Rendered into <body>.
const MENU_LINKS = [
    { label: "Work", href: "/#work" },
    { label: "About", href: "/#about" },
    { label: "Contact", href: "/#contact" },
]
const MENU_EMAIL = "ginciDesign@outlook.com"

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [theme, setTheme] = useState("dark")
    const panel = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (!open) return
        setTheme(document.documentElement.dataset.ginciTheme === "light" ? "light" : "dark")
        const prev = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const key = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
            if (e.key === "Tab" && panel.current) {
                const f = Array.from(panel.current.querySelectorAll<HTMLElement>("a,button"))
                if (!f.length) return
                const first = f[0], last = f[f.length - 1]
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
            }
        }
        document.addEventListener("keydown", key)
        setTimeout(() => panel.current?.querySelector<HTMLElement>("button")?.focus(), 50)
        return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", key) }
    }, [open])
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ease = "cubic-bezier(0.16, 1, 0.3, 1)"
    const mono = "500 11px/1 'Geist Mono', ui-monospace, monospace"
    const setT = (t: string) => {
        applyTheme(t)
        try { localStorage.setItem(KEY, t) } catch (e) {}
        setTheme(t)
    }
    const pill = (active: boolean) => ({
        flex: 1, height: 40, borderRadius: 999, cursor: "pointer",
        border: "1px solid " + (active ? "#F4F3EE" : "rgba(244,243,238,0.16)"),
        background: active ? "#F4F3EE" : "transparent", color: active ? "#121211" : "#F4F3EE",
        font: "500 14px/1 Outfit, sans-serif",
    })
    return (
        <div id="g-menu" aria-hidden={!open} style={{ position: "fixed", inset: 0, zIndex: 60, pointerEvents: open ? "auto" : "none" }}>
            <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", opacity: open ? 1 : 0, transition: reduce ? "none" : "opacity 0.3s ease" }} />
            <div ref={panel} role="dialog" aria-modal="true" aria-label="Menu"
                style={{
                    position: "absolute", top: 0, right: 0, bottom: 0, width: "min(86vw, 360px)", boxSizing: "border-box",
                    background: "#0B0B0A", borderLeft: "1px solid rgba(244,243,238,0.1)", padding: "18px 24px 28px",
                    display: "flex", flexDirection: "column", color: "#F4F3EE",
                    transform: open ? "translateX(0)" : "translateX(100%)", transition: reduce ? "none" : `transform 0.45s ${ease}`,
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 44 }}>
                    <span style={{ font: mono, letterSpacing: "0.08em", textTransform: "uppercase", color: "#85847E" }}>Menu</span>
                    <button onClick={onClose} aria-label="Close menu"
                        style={{ width: 44, height: 44, borderRadius: 999, border: "1px solid rgba(244,243,238,0.16)", background: "transparent", color: "#F4F3EE", fontSize: 18, cursor: "pointer" }}>✕</button>
                </div>
                <nav style={{ display: "flex", flexDirection: "column", marginTop: 32 }}>
                    {MENU_LINKS.map((l) => (
                        <a key={l.href} href={l.href} onClick={onClose}
                            style={{ font: "500 34px/1.1 Outfit, sans-serif", letterSpacing: "-0.02em", color: "#F4F3EE", textDecoration: "none", padding: "14px 0", borderBottom: "1px solid rgba(244,243,238,0.08)" }}>
                            {l.label}
                        </a>
                    ))}
                </nav>
                <div style={{ marginTop: 32 }}>
                    <div style={{ font: mono, letterSpacing: "0.08em", textTransform: "uppercase", color: "#85847E", marginBottom: 12 }}>Theme</div>
                    <div role="group" aria-label="Theme" style={{ display: "flex", gap: 8 }}>
                        <button aria-pressed={theme === "dark"} onClick={() => setT("dark")} style={pill(theme === "dark")}>Dark</button>
                        <button aria-pressed={theme === "light"} onClick={() => setT("light")} style={pill(theme === "light")}>Light</button>
                    </div>
                </div>
                <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
                    <a href={`mailto:${MENU_EMAIL}`} onClick={onClose}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 52, borderRadius: 999, background: "#F4F3EE", color: "#121211", font: "500 16px/1 Outfit, sans-serif", textDecoration: "none" }}>
                        Get in touch
                    </a>
                    <span style={{ font: mono, color: "#85847E", textAlign: "center" }}>{MENU_EMAIL}</span>
                </div>
            </div>
        </div>
    )
}

export function withMobileMenu(Component: any): ComponentType {
    return forwardRef((props: any, ref) => {
        const [open, setOpen] = useState(false)
        const [mounted, setMounted] = useState(false)
        useEffect(() => { ensureStyle(); setMounted(true) }, [])
        return (
            <>
                <Component ref={ref} {...props} role="button" tabIndex={0} aria-label="Open menu" aria-expanded={open}
                    onClick={() => setOpen(true)}
                    onKeyDown={(e: any) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(true) } }}
                    style={{ ...props.style, cursor: "pointer" }} />
                {mounted ? createPortal(<MobileMenu open={open} onClose={() => setOpen(false)} />, document.body) : null}
            </>
        )
    })
}

// ---------- Project preview that follows the cursor (Home) ----------
// Apply to the "Hover preview" layer. Reads everything from the hovered row:
// its accent (Accent swatch), its name, and its Preview image (Preview swatch).
// Rows without a Preview image show a placeholder card in the project colour.
// Rendered into <body>, so it isn't clipped by the Work section.
type PreviewData = { color: string; label: string; src: string | null }

function rowData(row: Element): PreviewData {
    const color =
        getComputedStyle(row as HTMLElement).getPropertyValue("--g-accent").trim() ||
        "#F4F3EE"
    const name = row.querySelector('[data-framer-name="Name"]')
    const img = row.querySelector(
        '[data-framer-name="Preview swatch"] img'
    ) as HTMLImageElement | null
    return {
        color,
        label: (name && name.textContent ? name.textContent : "").trim(),
        src: img ? img.currentSrc || img.src : null,
    }
}

function PreviewPlaceholder({ color, label }: { color: string; label: string }) {
    const bar = (w: string) => (
        <div
            style={{
                height: 8,
                width: w,
                borderRadius: 4,
                background: "rgba(244,243,238,0.16)",
            }}
        />
    )
    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                background: color,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
            }}
        >
            <span
                style={{
                    position: "absolute",
                    left: 18,
                    top: 16,
                    font: "500 12px/1 'Geist Mono', ui-monospace, monospace",
                    color: "#121211",
                }}
            >
                {label}
            </span>
            <div
                style={{
                    width: "58%",
                    height: "76%",
                    background: "#121211",
                    borderRadius: "18px 18px 0 0",
                    padding: 16,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                <div
                    style={{
                        height: 10,
                        width: "42%",
                        borderRadius: 4,
                        background: "rgba(244,243,238,0.5)",
                    }}
                />
                <div style={{ height: 64, borderRadius: 10, background: color }} />
                {bar("86%")}
                {bar("64%")}
                {bar("74%")}
                {bar("52%")}
            </div>
        </div>
    )
}

export function withFollowPreview(Component: any): ComponentType {
    return forwardRef((props: any, ref) => {
        const [pos, setPos] = useState({ x: -1000, y: -1000 })
        const [on, setOn] = useState(false)
        const [data, setData] = useState<PreviewData | null>(null)
        const [reduce, setReduce] = useState(false)
        const [mounted, setMounted] = useState(false)

        useEffect(() => {
            ensureStyle()
            if (typeof window === "undefined") return
            setMounted(true)
            setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
            const fine = window.matchMedia("(hover: hover) and (pointer: fine)")
            if (!fine.matches) return
            let last = { x: -1, y: -1 }
            const check = (el: Element | null) => {
                const row = el && el.closest ? el.closest('[data-framer-name^="Row / "]') : null
                setOn(!!row)
                if (row) setData(rowData(row))
            }
            const move = (e: MouseEvent) => {
                last = { x: e.clientX, y: e.clientY }
                setPos(last)
                check(e.target as Element | null)
            }
            // Re-check on scroll, so a preview doesn't linger after its row scrolls away.
            const onScroll = () => {
                if (last.x < 0) return
                check(document.elementFromPoint(last.x, last.y))
            }
            window.addEventListener("mousemove", move, { passive: true })
            window.addEventListener("scroll", onScroll, { passive: true })
            return () => {
                window.removeEventListener("mousemove", move)
                window.removeEventListener("scroll", onScroll)
            }
        }, [])

        if (!mounted) return null
        const ease = "cubic-bezier(0.16, 1, 0.3, 1)"
        return createPortal(
            <div
                id="g-preview"
                aria-hidden="true"
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: 380,
                    height: 285,
                    zIndex: 50,
                    pointerEvents: "none",
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
                    opacity: on ? 1 : 0,
                    transform: `translate3d(${pos.x + 28}px, ${pos.y - 150}px, 0) rotate(-3deg) scale(${on ? 1 : 0.92})`,
                    transition: reduce
                        ? "opacity 0.2s ease"
                        : `opacity 0.25s ease, transform 0.45s ${ease}`,
                }}
            >
                {data ? (
                    <>
                        <PreviewPlaceholder color={data.color} label={data.label} />
                        {data.src ? (
                            <img
                                key={data.src}
                                src={data.src}
                                alt=""
                                onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                }}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        ) : null}
                    </>
                ) : null}
            </div>,
            document.body
        )
    })
}

// ---------- v3: grain, rails, floating nav, section reveal, CMS accents, TOC ----------
// Runs from the nav's Theme toggle on every page. Sections are found by
// layer name: any layer named like "03 Work (index)" or "04 Section"
// (two digits + space), except "01 Hero", which has its own Framer text effect.
const REVEAL_SKIP = ["Row / ", "Hover preview", "Email underline", "Hairline", "Accent swatch", "Next accent swatch"]
let gridUpdate: null | (() => void) = null
let tocUpdate: null | (() => void) = null
let revealIO: IntersectionObserver | null = null
let watcher: MutationObserver | null = null

function swatchColor(el: Element | null) {
    if (!el) return null
    const c = getComputedStyle(el as HTMLElement).backgroundColor
    return c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent" ? c : null
}

// Copy CMS colours from the hidden swatches into CSS variables.
function applyAccents() {
    document.querySelectorAll('[data-framer-name^="Row / "]').forEach((row) => {
        const c = swatchColor(row.querySelector('[data-framer-name="Accent swatch"]'))
        if (c) (row as HTMLElement).style.setProperty("--g-accent", c)
        row.setAttribute("tabindex", row.getAttribute("tabindex") || "0")
    })
    const page = swatchColor(
        document.querySelector('[data-framer-name="Header"] [data-framer-name="Accent swatch"]')
    )
    if (page) document.documentElement.style.setProperty("--g-page-accent", page)
    else document.documentElement.style.removeProperty("--g-page-accent")
    document.querySelectorAll('[data-framer-name^="Next project ("]').forEach((n) => {
        const c = swatchColor(n.querySelector('[data-framer-name="Next accent swatch"]'))
        if (c) (n as HTMLElement).style.setProperty("--g-next-accent", c)
    })
}

// Case study TOC: click to jump, and mark the section in view.
function setupTOC() {
    const items = Array.from(
        document.querySelectorAll<HTMLElement>('[data-framer-name^="TOC / "]')
    )
    if (!items.length) {
        tocUpdate = null
        return
    }
    const section = (nn: string) =>
        document.querySelector<HTMLElement>(
            `[data-framer-name="Main"] > [data-framer-name="${nn} Section"]`
        )
    items.forEach((it) => {
        if (it.hasAttribute("data-g-toc")) return
        it.setAttribute("data-g-toc", "")
        it.setAttribute("role", "link")
        it.setAttribute("tabindex", "0")
        const nn = (it.getAttribute("data-framer-name") || "").replace("TOC / ", "")
        const go = (e: Event) => {
            if (e instanceof KeyboardEvent && e.key !== "Enter") return
            const s = section(nn)
            if (!s) return
            e.preventDefault()
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
            window.scrollTo({
                top: s.getBoundingClientRect().top + window.scrollY - 110,
                behavior: reduce ? "auto" : "smooth",
            })
        }
        it.addEventListener("click", go)
        it.addEventListener("keydown", go)
    })
    tocUpdate = () => {
        const line = window.innerHeight * 0.35
        let current: HTMLElement | null = null
        items.forEach((it) => {
            const nn = (it.getAttribute("data-framer-name") || "").replace("TOC / ", "")
            const s = section(nn)
            if (s && s.getBoundingClientRect().top <= line) current = it
        })
        if (!current) current = items[0]
        items.forEach((it) => it.toggleAttribute("data-g-current", it === current))
    }
    tocUpdate()
}

function setupReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (typeof IntersectionObserver === "undefined") return
    if (!revealIO) {
        revealIO = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (!e.isIntersecting) return
                    ;(e.target as HTMLElement).setAttribute("data-g-in", "")
                    revealIO && revealIO.unobserve(e.target)
                })
            },
            { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }
        )
    }
    const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-framer-name]")
    ).filter((s) => {
        const n = s.getAttribute("data-framer-name") || ""
        return /^\d\d /.test(n) && !n.startsWith("01 Hero")
    })
    sections.forEach((sec, i) => {
        if (sec.hasAttribute("data-g-sec")) return
        sec.setAttribute("data-g-sec", "")
        Array.from(sec.children).forEach((child, j) => {
            const k = child as HTMLElement
            const name = k.getAttribute("data-framer-name") || ""
            if (REVEAL_SKIP.some((s) => name.startsWith(s))) return
            k.setAttribute("data-g-rv", j === 0 ? (i % 2 ? "r" : "l") : "u")
            k.style.setProperty("--g-d", Math.min(j, 6) * 80 + "ms")
            revealIO!.observe(k)
        })
    })
}

function setupFX() {
    if (typeof document === "undefined") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (!document.getElementById("g-grain")) {
        const g = document.createElement("div")
        g.id = "g-grain"
        g.setAttribute("aria-hidden", "true")
        document.body.appendChild(g)
    }
    let grid = document.getElementById("g-grid")
    if (!grid) {
        grid = document.createElement("div")
        grid.id = "g-grid"
        grid.setAttribute("aria-hidden", "true")
        document.body.appendChild(grid)
    }
    if (!grid.querySelector("b")) {
        grid.innerHTML = "<b><u></u><i></i><s></s></b>".repeat(4)
    }
    const rails = Array.from(grid.querySelectorAll("b")) as HTMLElement[]
    gridUpdate = () => {
        const vh = window.innerHeight
        const y = window.scrollY
        const max = document.documentElement.scrollHeight - vh
        const p = reduce || max <= 0 ? 1 : Math.min(1, Math.max(0, y / max))
        rails.forEach((b, i) => {
            const q = Math.min(1, Math.max(0, (p - i * 0.04) / 0.88))
            const down = i % 2 === 0
            b.style.setProperty("--g-p", q.toFixed(4))
            b.style.setProperty("--g-y", ((down ? q : 1 - q) * vh).toFixed(1) + "px")
            b.style.setProperty("--g-o", q > 0.002 ? "1" : "0")
        })
        const top = document.querySelector<HTMLElement>(
            '[data-framer-name="01 Hero"], [data-framer-name="Header"], [data-framer-name="Shelf header"]'
        )
        if (top) {
            const r = top.getBoundingClientRect()
            const start = Math.max(0, r.top + r.height * 0.75)
            grid!.style.clipPath = `inset(${start.toFixed(0)}px 0 0 0)`
        } else grid!.style.clipPath = ""
        document.documentElement.toggleAttribute("data-g-scrolled", y > 48)
    }

    const w = window as any
    if (!w.__gFX) {
        w.__gFX = true
        const onScroll = () => {
            gridUpdate && gridUpdate()
            tocUpdate && tocUpdate()
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        // Back to top (footer): a real button for mouse and keyboard.
        const toTop = (e: Event) => {
            const t = e.target as Element | null
            if (!t || !t.closest || !t.closest('[data-framer-name^="Back to top"]')) return
            if (e instanceof KeyboardEvent && e.key !== "Enter" && e.key !== " ") return
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
        }
        document.addEventListener("click", toTop)
        document.addEventListener("keydown", toTop)
        // Folder pages: Escape goes back home.
        document.addEventListener("keydown", (e) => {
            if (e.key !== "Escape" || document.getElementById("g-menu")?.getAttribute("aria-hidden") === "false") return
            if (document.querySelector('[data-framer-name="Shelf page"]')) window.location.href = "/"
        })
    }
    gridUpdate()
    document.querySelectorAll('[data-framer-name^="Back to top"]').forEach((el) => {
        el.setAttribute("role", "button")
        el.setAttribute("tabindex", "0")
    })

    applyAccents()
    setupTOC()
    setupReveal()

    // CMS lists and page changes add layers after first paint: re-run (debounced).
    if (!watcher && typeof MutationObserver !== "undefined") {
        let t: any = null
        watcher = new MutationObserver(() => {
            clearTimeout(t)
            t = setTimeout(() => {
                applyAccents()
                setupTOC()
                setupReveal()
                gridUpdate && gridUpdate()
            }, 120)
        })
        watcher.observe(document.body, { childList: true, subtree: true })
    }
}

// Apply to the footer's "Now" text layer. Any "--:--" (or a previous time)
// in its text is replaced with the live time in Enugu (WAT). Everything else
// in the line stays editable on the canvas.
export function withNowTime(Component: any): ComponentType {
    return forwardRef((props: any, ref) => {
        const local = useRef<HTMLElement | null>(null)
        useEffect(() => {
            if (typeof window === "undefined") return
            const fmt = new Intl.DateTimeFormat("en-GB", {
                timeZone: "Africa/Lagos",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            })
            const tick = () => {
                const el = local.current
                if (!el) return
                const now = fmt.format(new Date())
                const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
                let n = walker.nextNode()
                while (n) {
                    const v = n.nodeValue || ""
                    if (/--:--|\d{2}:\d{2}/.test(v))
                        n.nodeValue = v.replace(/--:--|\d{2}:\d{2}/, now)
                    n = walker.nextNode()
                }
            }
            tick()
            const id = setInterval(tick, 15000)
            return () => clearInterval(id)
        }, [])
        const setRef = (node: HTMLElement | null) => {
            local.current = node
            if (typeof ref === "function") ref(node)
            else if (ref) (ref as any).current = node
        }
        return <Component {...props} ref={setRef} />
    })
}
