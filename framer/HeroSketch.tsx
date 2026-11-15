import { addPropertyControls, ControlType, RenderTarget } from "framer"
import type { CSSProperties } from "react"

// Sketch to screen: a card wireframe draws itself like a pen sketch, a cursor taps its button,
// and the sketch "becomes" UI (surface fills, button turns accent, lines settle). ~2.4s, plays once per visit.
// Reduced motion and the Framer canvas show the finished card. Pair with the headline's Start delay (= Duration).

type P = { size: number; ink: string; surface: string; accent: string; duration: number; delay: number; style?: CSSProperties }

// Slightly irregular, hand-drawn paths (viewBox 0 0 300 190)
const CARD = "M18 14 C 90 11, 210 12, 282 15 C 286 16, 288 19, 288 24 C 287 70, 287 120, 287 168 C 287 173, 284 176, 279 176 C 200 178, 100 177, 21 176 C 15 176, 12 173, 12 168 C 13 120, 12 70, 13 22 C 13 17, 15 14, 18 14 Z"
const BAR = "M13 40 C 100 41, 200 39, 287 40"
const DOTS = ["M26 27 a3 3 0 1 0 0.1 0", "M37 27 a3 3 0 1 0 0.1 0", "M48 27 a3 3 0 1 0 0.1 0"]
const AVATAR = "M50 78 C 50 68, 64 66, 66 76 C 68 87, 54 90, 50 82 C 49 80, 49 79, 50 78 Z"
const TITLE = "M80 70 C 120 69, 160 71, 196 70"
const LINE1 = "M80 86 C 140 87, 200 85, 252 86"
const LINE2 = "M50 110 C 130 111, 200 109, 250 110"
const LINE3 = "M50 124 C 110 125, 160 123, 206 124"
const BTN = "M182 146 C 210 145, 240 145, 262 146 C 268 146, 270 150, 270 154 C 270 158, 268 162, 262 162 C 240 163, 210 163, 182 162 C 176 162, 174 158, 174 154 C 174 150, 176 146, 182 146 Z"
const CURSOR = "M0 0 L0 17 L4.5 13 L7.5 20 L10.5 18.6 L7.6 12 L13.5 12 Z"

export default function HeroSketch(props: P) {
    const { size = 280, ink = "rgba(244, 243, 238, 0.85)", surface = "rgba(244, 243, 238, 0.06)", accent = "#6FD08C", duration = 2.4, delay = 0.1 } = props
    const still = RenderTarget.current() === RenderTarget.canvas || RenderTarget.current() === RenderTarget.thumbnail
    const k = duration / 2.4
    const t = (s: number) => `${(delay + s * k).toFixed(2)}s`
    const d = (s: number) => `${(s * k).toFixed(2)}s`
    const draw = (start: number, len: number): CSSProperties => ({ ["--s" as any]: t(start), ["--d" as any]: d(len) })
    return (
        <div aria-hidden="true" style={{ ...props.style, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <div className={"g-sketch" + (still ? "" : " g-play")} style={{ width: size, maxWidth: "100%", color: ink }}>
            <style>{`
.g-sketch svg { display: block; width: 100%; height: auto; overflow: visible; }
.g-sketch .ink { fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 1 1; }
.g-sketch.g-play .ink { stroke-dashoffset: 1; animation: g-sk-draw var(--d) cubic-bezier(.5,.1,.3,1) var(--s) forwards; }
.g-sketch .surf { opacity: 1; }
.g-sketch.g-play .surf { opacity: 0; animation: g-sk-fade .6s ease var(--s) forwards; }
.g-sketch .btnfill { opacity: 1; transform-origin: 222px 154px; }
.g-sketch.g-play .btnfill { opacity: 0; transform: scale(.85); animation: g-sk-pop .35s cubic-bezier(.34,1.56,.64,1) var(--s) forwards; }
.g-sketch .label { opacity: 1; }
.g-sketch.g-play .label { opacity: 0; animation: g-sk-fade .3s ease var(--s) forwards; }
.g-sketch .cursor { opacity: 0; }
.g-sketch.g-play .cursor { animation: g-sk-cursor var(--d) cubic-bezier(.45,.05,.3,1) var(--s) forwards; }
@keyframes g-sk-draw { to { stroke-dashoffset: 0; } }
@keyframes g-sk-fade { to { opacity: 1; } }
@keyframes g-sk-pop { to { opacity: 1; transform: scale(1); } }
@keyframes g-sk-cursor {
  0% { opacity: 0; transform: translate(250px, 196px); }
  15% { opacity: 1; }
  70% { transform: translate(228px, 158px); }
  80% { transform: translate(228px, 158px) scale(.86); }
  90% { transform: translate(228px, 158px) scale(1); opacity: 1; }
  100% { transform: translate(236px, 170px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .g-sketch.g-play .ink { animation: none; stroke-dashoffset: 0; }
  .g-sketch.g-play .surf, .g-sketch.g-play .label, .g-sketch.g-play .btnfill { animation: none; opacity: 1; transform: none; }
  .g-sketch.g-play .cursor { animation: none; opacity: 0; }
}`}</style>
            <svg viewBox="0 0 300 190">
                <path className="surf" d={CARD} fill={surface} style={draw(1.55, 0.6)} />
                <path className="ink" d={CARD} pathLength={1} style={draw(0, 0.75)} />
                <path className="ink" d={BAR} pathLength={1} style={draw(0.55, 0.3)} />
                {DOTS.map((p, i) => <path key={i} className="ink" d={p} pathLength={1} style={draw(0.7 + i * 0.06, 0.15)} />)}
                <path className="ink" d={AVATAR} pathLength={1} style={draw(0.9, 0.25)} />
                <path className="ink" d={TITLE} pathLength={1} style={draw(1.05, 0.22)} />
                <path className="ink" d={LINE1} pathLength={1} style={draw(1.2, 0.25)} />
                <path className="ink" d={LINE2} pathLength={1} style={draw(1.32, 0.25)} />
                <path className="ink" d={LINE3} pathLength={1} style={draw(1.44, 0.2)} />
                <path className="btnfill" d={BTN} fill={accent} style={draw(1.98, 0.35)} />
                <path className="ink" d={BTN} pathLength={1} style={draw(1.5, 0.3)} />
                <path className="label" d="M196 154 L 250 154" stroke="#121211" strokeWidth={3} strokeLinecap="round" style={draw(2.1, 0.3)} />
                <g className="label" style={draw(2.12, 0.4)}>
                    <circle cx="58" cy="78" r="9" fill={accent} fillOpacity={0.85} />
                    <path d={TITLE} stroke="currentColor" strokeWidth={6} strokeLinecap="round" strokeOpacity={0.9} fill="none" />
                    <path d={LINE1} stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeOpacity={0.35} fill="none" />
                    <path d={LINE2} stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeOpacity={0.35} fill="none" />
                    <path d={LINE3} stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeOpacity={0.35} fill="none" />
                </g>
                <g className="cursor" style={draw(1.55, 0.85)}>
                    <path d={CURSOR} fill="#F4F3EE" stroke="#121211" strokeWidth={1.2} strokeLinejoin="round" />
                </g>
            </svg>
        </div>
        </div>
    )
}

HeroSketch.defaultProps = { size: 280, ink: "rgba(244, 243, 238, 0.85)", surface: "rgba(244, 243, 238, 0.06)", accent: "#6FD08C", duration: 2.4, delay: 0.1 }
addPropertyControls(HeroSketch, {
    size: { type: ControlType.Number, title: "Size", min: 120, max: 600, step: 4, unit: "px" },
    ink: { type: ControlType.Color, title: "Ink" },
    surface: { type: ControlType.Color, title: "Surface" },
    accent: { type: ControlType.Color, title: "Button" },
    duration: { type: ControlType.Number, title: "Duration", min: 1, max: 6, step: 0.1, unit: "s", description: "Set the headline's Start delay to this + delay." },
    delay: { type: ControlType.Number, title: "Start delay", min: 0, max: 3, step: 0.1, unit: "s" },
})
