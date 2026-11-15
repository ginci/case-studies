import { useEffect, useRef, type CSSProperties } from "react"
import { addPropertyControls, ControlType, RenderTarget } from "framer"

// Wet-sand cursor trail. Fills its parent (place it as an absolute layer inside the hero, behind the text).
// The pointer presses a groove into "damp sand": a dark trench, a faint raised ridge on one side and a wet sheen
// down the middle. Slow strokes cut wide, fast strokes cut thin, and the sand settles back over `life` seconds.
// Runs only with a mouse/trackpad, never with reduced motion, and idles (no animation frames) when nothing is moving.

type Pt = { x: number; y: number; t: number; w: number }

export default function SandTrail(props: { life: number; maxWidth: number; depth: number; style?: CSSProperties }) {
    const { life = 2.6, maxWidth = 18, depth = 0.5 } = props
    const ref = useRef<HTMLCanvasElement | null>(null)
    useEffect(() => {
        const cv = ref.current
        if (!cv || typeof window === "undefined") return
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
        const ctx = cv.getContext("2d")
        if (!ctx) return
        let pts: Pt[] = [], raf = 0, dpr = 1
        const size = () => {
            dpr = Math.min(2, window.devicePixelRatio || 1)
            const r = cv.getBoundingClientRect()
            cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr)
        }
        size()
        const ro = new ResizeObserver(size); ro.observe(cv)
        const draw = () => {
            const now = performance.now() / 1000
            pts = pts.filter((p) => now - p.t < life)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.clearRect(0, 0, cv.width, cv.height)
            ctx.lineCap = "butt"; ctx.lineJoin = "round"
            // Draw in short continuous runs (not per segment) so overlapping caps don't bead the line.
            const RUN = 10
            let i = 1
            while (i < pts.length) {
                const run: Pt[] = [pts[i - 1]]
                while (i < pts.length && run.length <= RUN && pts[i].t - pts[i - 1].t <= 0.25) { run.push(pts[i]); i++ }
                if (run.length < 2) { i++; continue }
                const end = run[run.length - 1], k = Math.pow(1 - (now - end.t) / life, 1.6)
                const w = run.reduce((s, p) => s + p.w, 0) / run.length * (0.75 + 0.25 * k)
                const layer = (off: number, width: number, style: string) => {
                    ctx.beginPath()
                    run.forEach((p, j) => {
                        const q = run[Math.min(run.length - 1, j + 1)], o = run[Math.max(0, j - 1)]
                        const dx = q.x - o.x, dy = q.y - o.y, len = Math.hypot(dx, dy) || 1
                        const x = p.x - (dy / len) * off, y = p.y + (dx / len) * off
                        j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
                    })
                    ctx.lineWidth = width; ctx.strokeStyle = style; ctx.stroke()
                }
                layer(-w * 0.55, w * 0.45, `rgba(244,243,238,${(0.11 * k * depth * 2).toFixed(3)})`) // ridge
                layer(w * 0.15, w * 0.8, `rgba(0,0,0,${(0.55 * k * depth * 2).toFixed(3)})`) // groove
                layer(w * 0.05, w * 0.16, `rgba(190,215,210,${(0.08 * k * depth * 2).toFixed(3)})`) // wet sheen
                if (i < pts.length && pts[i].t - pts[i - 1].t > 0.25) i++
            }
            raf = pts.length ? requestAnimationFrame(draw) : 0
        }
        let last: Pt | null = null
        const move = (e: PointerEvent) => {
            if (e.pointerType && e.pointerType !== "mouse" && e.pointerType !== "pen") return
            const r = cv.getBoundingClientRect()
            const x = e.clientX - r.left, y = e.clientY - r.top
            if (x < 0 || y < 0 || x > r.width || y > r.height) { last = null; return }
            const t = performance.now() / 1000
            if (last && Math.hypot(x - last.x, y - last.y) < 2.5) return
            const speed = last ? Math.hypot(x - last.x, y - last.y) / Math.max(0.008, t - last.t) : 0
            const w = Math.max(5, Math.min(maxWidth, maxWidth - speed * 0.012))
            last = { x, y, t, w }
            pts.push(last)
            if (pts.length > 600) pts.shift()
            if (!raf) raf = requestAnimationFrame(draw)
        }
        window.addEventListener("pointermove", move, { passive: true })
        return () => { window.removeEventListener("pointermove", move); ro.disconnect(); cancelAnimationFrame(raf) }
    }, [life, maxWidth, depth])
    if (RenderTarget.current() === RenderTarget.canvas) return <div style={{ ...props.style, width: "100%", height: "100%" }} />
    return <canvas ref={ref} aria-hidden="true" style={{ ...props.style, width: "100%", height: "100%", display: "block", pointerEvents: "none" }} />
}

SandTrail.defaultProps = { life: 2.6, maxWidth: 18, depth: 0.5 }
addPropertyControls(SandTrail, {
    life: { type: ControlType.Number, title: "Settles in", min: 0.5, max: 8, step: 0.1, unit: "s" },
    maxWidth: { type: ControlType.Number, title: "Groove width", min: 4, max: 40, step: 1, unit: "px" },
    depth: { type: ControlType.Number, title: "Depth", min: 0.1, max: 1, step: 0.05 },
})
