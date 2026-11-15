const fs = require("fs")
const { upem, lines } = JSON.parse(fs.readFileSync("glyphs.json", "utf8"))
// lines[0] = whole headline on one line; lines[1..] = the same headline split in two (used when one line won't fit)
let ymin = 1e9, ymax = -1e9
for (const l of lines) for (const g of l.glyphs) { const n = g.d.match(/-?\d+(\.\d+)?/g).map(Number); for (let i = 1; i < n.length; i += 2) { ymin = Math.min(ymin, n[i] + g.y); ymax = Math.max(ymax, n[i] + g.y) } }
const pad = 20, top = ymax + pad, bottom = -ymin + pad, SIDE = 30
function timed(ls) {
  let t = 0
  const out = ls.map(l => {
    let prevCl = -1
    const glyphs = l.glyphs.map(g => {
      if (prevCl >= 0 && /\s/.test(l.text.slice(prevCl + 1, g.cl))) t += 0.16
      prevCl = g.cl
      const size = Math.max(0.35, Math.min(1.2, g.adv / 450))
      const dur = +(0.36 + 0.22 * size).toFixed(3), del = +t.toFixed(3)
      t += 0.034 + 0.022 * size
      return { d: g.d, x: Math.round(g.x), y: Math.round(g.y), del, dur }
    })
    t += 0.16
    return { w: l.width, glyphs }
  })
  return { total: t, lines: out }
}
const one = timed([lines[0]]), two = timed(lines.slice(1))
console.log("one-line seconds", one.total.toFixed(2), "two-line", two.total.toFixed(2), "one-line width (em)", (lines[0].width + 2 * SIDE) / upem)
const data = JSON.stringify({ upem, top, bottom, side: SIDE, one: one.lines, two: two.lines })
const label = lines[0].text
const tsx = `import { addPropertyControls, ControlType, RenderTarget } from "framer"
import type { CSSProperties } from "react"

// Hand-written headline: each letter of Playwrite AR is traced as a pen stroke, in reading order, then filled.
// Outlines come from the font itself (shaped with HarfBuzz), so it matches the typeface exactly.
// One line whenever it fits; on narrow screens it breaks into two lines (a CSS container query, no JS).
// The animation replays every time the page mounts (e.g. each visit to Home). Reduced motion and the
// Framer canvas show the finished text. Text: "${label}". To change it, see tools/hand-headline/README.md.

type Line = { w: number; glyphs: { d: string; x: number; y: number; del: number; dur: number }[] }
const DATA: { upem: number; top: number; bottom: number; side: number; one: Line[]; two: Line[] } = ${data}

const LABEL = ${JSON.stringify(label)}

function Lines({ lines, k, h, weight, delay, s, anim, cls, gap }: { lines: Line[]; k: number; h: number; weight: number; delay: number; s: number; anim: boolean; cls: string; gap: number }) {
    return (
        <div className={cls} style={{ flexDirection: "column", gap }}>
            {lines.map((l, i) => (
                <svg key={i} aria-hidden="true" className={anim ? "g-anim" : ""} viewBox={\`0 \${-DATA.top} \${l.w + 2 * DATA.side} \${h}\`}
                    width={(l.w + 2 * DATA.side) * k} height={h * k} style={{ display: "block", maxWidth: "100%", height: "auto", overflow: "visible" }}>
                    <g transform="scale(1,-1)" strokeWidth={weight * DATA.upem}>
                        {l.glyphs.map((g, j) => (
                            <path key={j} d={g.d} transform={\`translate(\${g.x + DATA.side},\${g.y})\`} pathLength={1}
                                style={{ ["--del" as any]: \`\${(delay + g.del * s).toFixed(3)}s\`, ["--dur" as any]: \`\${(g.dur * s).toFixed(3)}s\`,
                                    ["--fdel" as any]: \`\${(delay + (g.del + g.dur * 0.7) * s).toFixed(3)}s\` }} />
                        ))}
                    </g>
                </svg>
            ))}
        </div>
    )
}

export default function HandHeadline(props: { fontSize: number; lineHeight: number; color: string; weight: number; speed: number; delay: number; style?: CSSProperties }) {
    const { fontSize = 48, lineHeight = 1.5, color = "rgb(252, 247, 217)", weight = 0.04, speed = 1, delay = 0.1 } = props
    const still = RenderTarget.current() === RenderTarget.canvas || RenderTarget.current() === RenderTarget.thumbnail
    const k = fontSize / DATA.upem
    const h = DATA.top + DATA.bottom
    const gap = Math.max(0, fontSize * lineHeight - h * k)
    const s = 1 / Math.max(0.1, speed)
    const fit = Math.ceil((DATA.one[0].w + 2 * DATA.side) * k)
    return (
        <div role="heading" aria-level={1} aria-label={LABEL} className="g-hand" style={{ ...props.style, color, width: "100%", containerType: "inline-size" } as CSSProperties}>
            <style>{\`
.g-hand path { fill: currentColor; stroke: currentColor; stroke-linecap: butt; stroke-linejoin: round; stroke-dasharray: 1 1; }
.g-hand .g-anim path { fill-opacity: 0; stroke-dashoffset: 1; animation: g-hand-draw var(--dur) cubic-bezier(.45,.05,.35,1) var(--del) forwards, g-hand-fill .5s ease var(--fdel) forwards; }
@keyframes g-hand-draw { to { stroke-dashoffset: 0; } }
@keyframes g-hand-fill { to { fill-opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .g-hand .g-anim path { animation: none; fill-opacity: 1; stroke-dashoffset: 0; } }
.g-hand .g-one { display: flex; } .g-hand .g-two { display: none; }
@container (max-width: \${fit - 1}px) { .g-hand .g-one { display: none; } .g-hand .g-two { display: flex; } }
\`}</style>
            <Lines lines={DATA.one} cls="g-one" k={k} h={h} weight={weight} delay={delay} s={s} anim={!still} gap={gap} />
            <Lines lines={DATA.two} cls="g-two" k={k} h={h} weight={weight} delay={delay} s={s} anim={!still} gap={gap} />
        </div>
    )
}

HandHeadline.defaultProps = { fontSize: 48, lineHeight: 1.5, color: "rgb(252, 247, 217)", weight: 0.04, speed: 1, delay: 0.1 }

addPropertyControls(HandHeadline, {
    fontSize: { type: ControlType.Number, title: "Size", min: 16, max: 160, step: 1, unit: "px" },
    lineHeight: { type: ControlType.Number, title: "Line height", min: 1, max: 2.4, step: 0.05 },
    color: { type: ControlType.Color, title: "Color" },
    weight: { type: ControlType.Number, title: "Weight", min: 0, max: 0.1, step: 0.005, description: "Extra stroke, in em" },
    speed: { type: ControlType.Number, title: "Speed", min: 0.25, max: 3, step: 0.05, description: "1 = about ${one.total.toFixed(1)}s. Higher is faster." },
    delay: { type: ControlType.Number, title: "Start delay", min: 0, max: 3, step: 0.1, unit: "s" },
})
`
fs.writeFileSync("HandHeadline.tsx", tsx); console.log("bytes", tsx.length)
