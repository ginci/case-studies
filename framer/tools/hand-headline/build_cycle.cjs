// Builds HandHeadline.tsx as a loop: write phrase → hold → un-write backwards → next phrase → …
const fs = require("fs")
const { upem, lines } = JSON.parse(fs.readFileSync("glyphs.json", "utf8"))
let ymin = 1e9, ymax = -1e9
for (const l of lines) for (const g of l.glyphs) { const n = g.d.match(/-?\d+(\.\d+)?/g).map(Number); for (let i = 1; i < n.length; i += 2) { ymin = Math.min(ymin, n[i] + g.y); ymax = Math.max(ymax, n[i] + g.y) } }
const pad = 20, top = ymax + pad, SIDE = 30
// Space kept below the baseline. Deeper descenders (the "g" tail) hang below the box, so the copy under the
// headline can sit close for every phrase. Was -ymin + pad (about 600 units).
const bottom = 400
const phrases = lines.map(l => {
  let t = 0, prevCl = -1
  const glyphs = l.glyphs.map(g => {
    if (prevCl >= 0 && /\s/.test(l.text.slice(prevCl + 1, g.cl))) t += 0.16
    prevCl = g.cl
    const size = Math.max(0.35, Math.min(1.2, g.adv / 450))
    const dur = +(0.36 + 0.22 * size).toFixed(3), del = +t.toFixed(3)
    t += 0.034 + 0.022 * size
    return { d: g.d, x: Math.round(g.x), y: Math.round(g.y), del, dur }
  })
  const total = Math.max(...glyphs.map(g => g.del + g.dur))
  return { text: l.text, w: l.width, total: +total.toFixed(3), glyphs }
})
console.log(phrases.map(p => `${p.text} ${p.total}s width ${((p.w + 2 * SIDE) / upem).toFixed(2)}em`).join(" | "))
const data = JSON.stringify({ upem, top, bottom, side: SIDE, phrases })
const label = phrases.map(p => p.text).join(" ")
const tsx = `import { addPropertyControls, ControlType, RenderTarget } from "framer"
import { useEffect, useState, type CSSProperties } from "react"

// Hand-written headline that cycles through phrases: each is traced letter by letter like a pen, held for a moment,
// then un-written backwards (last letter first) before the next phrase is written. Loops forever.
// Outlines come from Playwrite AR itself (shaped with HarfBuzz). Phrases: ${phrases.map(p => JSON.stringify(p.text)).join(", ")}.
// The Framer canvas and reduced motion show the first phrase, finished. To change the words, see tools/hand-headline/README.md.

type Glyph = { d: string; x: number; y: number; del: number; dur: number }
type Phrase = { text: string; w: number; total: number; glyphs: Glyph[] }
const DATA: { upem: number; top: number; bottom: number; side: number; phrases: Phrase[] } = ${data}

const LABEL = ${JSON.stringify(label)}
const ERASE = 0.55 // un-writing takes this share of the writing time

export default function HandHeadline(props: { fontSize: number; color: string; weight: number; speed: number; hold: number; delay: number; style?: CSSProperties }) {
    const { fontSize = 48, color = "rgb(252, 247, 217)", weight = 0.04, speed = 1, hold = 1, delay = 0.1 } = props
    const still = RenderTarget.current() === RenderTarget.canvas || RenderTarget.current() === RenderTarget.thumbnail
    const [reduce, setReduce] = useState(false)
    const [step, setStep] = useState<{ i: number; phase: "in" | "out"; n: number }>({ i: 0, phase: "in", n: 0 })
    const s = 1 / Math.max(0.1, speed)
    const k = fontSize / DATA.upem
    const h = DATA.top + DATA.bottom
    const P = DATA.phrases[step.i]
    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return
        const m = window.matchMedia("(prefers-reduced-motion: reduce)")
        setReduce(m.matches)
        const on = () => setReduce(m.matches)
        m.addEventListener?.("change", on)
        return () => m.removeEventListener?.("change", on)
    }, [])
    useEffect(() => {
        if (still || reduce || DATA.phrases.length < 2) return
        const first = step.n === 0 ? delay : 0
        const ms = step.phase === "in" ? (first + P.total * s + 0.5 + hold) * 1000 : (P.total * s * ERASE + 0.35) * 1000
        const t = setTimeout(() => setStep((c) => c.phase === "in" ? { i: c.i, phase: "out", n: c.n + 1 } : { i: (c.i + 1) % DATA.phrases.length, phase: "in", n: c.n + 1 }), ms)
        return () => clearTimeout(t)
    }, [step, still, reduce, s, hold, delay])
    const anim = !still && !reduce
    const first = step.n === 0 ? delay : 0
    return (
        <div role="heading" aria-level={1} aria-label={LABEL} className="g-hand" style={{ ...props.style, color, width: "100%", minHeight: h * k } as CSSProperties}>
            <style>{\`
.g-hand path { fill: currentColor; stroke: currentColor; stroke-linecap: butt; stroke-linejoin: round; stroke-dasharray: 1 1; }
.g-hand .g-in path { fill-opacity: 0; stroke-dashoffset: 1; animation: g-hand-draw var(--dur) cubic-bezier(.45,.05,.35,1) var(--del) forwards, g-hand-fill .5s ease var(--fdel) forwards; }
.g-hand .g-out path { fill-opacity: 1; stroke-dashoffset: 0; animation: g-hand-unfill .22s ease var(--rdel) forwards, g-hand-undraw var(--rdur) cubic-bezier(.45,.05,.35,1) var(--rdel2) forwards; }
@keyframes g-hand-draw { to { stroke-dashoffset: 0; } }
@keyframes g-hand-fill { to { fill-opacity: 1; } }
@keyframes g-hand-unfill { to { fill-opacity: 0; } }
@keyframes g-hand-undraw { to { stroke-dashoffset: 1; } }
\`}</style>
            <svg key={step.n} aria-hidden="true" className={anim ? (step.phase === "in" ? "g-in" : "g-out") : ""} viewBox={\`0 \${-DATA.top} \${P.w + 2 * DATA.side} \${h}\`}
                width={(P.w + 2 * DATA.side) * k} height={h * k} style={{ display: "block", maxWidth: "100%", height: "auto", overflow: "visible" }}>
                <g transform="scale(1,-1)" strokeWidth={weight * DATA.upem}>
                    {P.glyphs.map((g, j) => {
                        const rev = (P.total - (g.del + g.dur)) * s * ERASE
                        return (
                            <path key={j} d={g.d} transform={\`translate(\${g.x + DATA.side},\${g.y})\`} pathLength={1}
                                style={{ ["--del" as any]: \`\${(first + g.del * s).toFixed(3)}s\`, ["--dur" as any]: \`\${(g.dur * s).toFixed(3)}s\`,
                                    ["--fdel" as any]: \`\${(first + (g.del + g.dur * 0.7) * s).toFixed(3)}s\`,
                                    ["--rdel" as any]: \`\${rev.toFixed(3)}s\`, ["--rdel2" as any]: \`\${(rev + 0.08).toFixed(3)}s\`, ["--rdur" as any]: \`\${(g.dur * s * ERASE).toFixed(3)}s\` }} />
                        )
                    })}
                </g>
            </svg>
        </div>
    )
}

HandHeadline.defaultProps = { fontSize: 48, color: "rgb(252, 247, 217)", weight: 0.04, speed: 1, hold: 1, delay: 0.1 }

addPropertyControls(HandHeadline, {
    fontSize: { type: ControlType.Number, title: "Size", min: 16, max: 160, step: 1, unit: "px" },
    color: { type: ControlType.Color, title: "Color" },
    weight: { type: ControlType.Number, title: "Weight", min: 0, max: 0.1, step: 0.005, description: "Extra stroke, in em" },
    speed: { type: ControlType.Number, title: "Speed", min: 0.25, max: 3, step: 0.05, description: "Higher is faster." },
    hold: { type: ControlType.Number, title: "Hold", min: 0, max: 5, step: 0.1, unit: "s", description: "Pause on each finished phrase" },
    delay: { type: ControlType.Number, title: "Start delay", min: 0, max: 3, step: 0.1, unit: "s" },
})
`
fs.writeFileSync("HandHeadline.tsx", tsx); console.log("bytes", tsx.length)
