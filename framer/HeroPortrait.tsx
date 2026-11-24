import { useEffect, useRef, useState, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

// Gift's photo, melted into the hero background. At rest it is a faint duotone in the shader's colours with soft,
// feathered edges, so it reads as part of the gradient. Where the cursor goes, a soft circle reveals the real photo,
// following the pointer with a little lag. Touch screens: the reveal drifts slowly on its own.

const DEFAULT_IMG = "https://framerusercontent.com/images/WdZdO386BLTzVBtQgoYDpSSrZ2s.jpg"

export default function HeroPortrait(props: {
    image?: { src: string; alt?: string } | string
    radius: number
    rest: number
    position: string
    style?: CSSProperties
}) {
    const { radius = 220, rest = 0.3, position = "50% 30%" } = props
    const src = typeof props.image === "string" ? props.image : props.image?.src || DEFAULT_IMG
    const box = useRef<HTMLDivElement | null>(null)
    const [touch, setTouch] = useState(false)

    useEffect(() => {
        const el = box.current
        if (!el || typeof window === "undefined") return
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
        setTouch(!fine)
        let tx = 0, ty = 0, tr = 0, x = 0, y = 0, r = 0, raf = 0, started = false
        const set = () => {
            el.style.setProperty("--x", x.toFixed(1) + "px")
            el.style.setProperty("--y", y.toFixed(1) + "px")
            el.style.setProperty("--r", Math.max(0, r).toFixed(1) + "px")
        }
        const loop = () => {
            const k = reduce ? 1 : 0.12
            x += (tx - x) * k; y += (ty - y) * k; r += (tr - r) * (reduce ? 1 : 0.1)
            set()
            raf = Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(tr - r) > 0.4 ? requestAnimationFrame(loop) : 0
        }
        const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }
        const cleanups: (() => void)[] = []
        if (fine) {
            // Listen on the window: the hero text sits above the photo and would otherwise swallow the pointer.
            const move = (e: PointerEvent) => {
                const b = el.getBoundingClientRect()
                const pad = 60
                const inside = e.clientX > b.left - pad && e.clientX < b.right + pad && e.clientY > b.top - pad && e.clientY < b.bottom + pad
                tx = e.clientX - b.left; ty = e.clientY - b.top
                if (!started) { x = tx; y = ty; started = true }
                tr = inside ? radius : 0
                kick()
            }
            const leave = () => { tr = 0; kick() }
            window.addEventListener("pointermove", move, { passive: true })
            document.documentElement.addEventListener("pointerleave", leave)
            cleanups.push(() => { window.removeEventListener("pointermove", move); document.documentElement.removeEventListener("pointerleave", leave) })
        } else if (!reduce) {
            // Touch: a slow, wandering reveal so the photo still shows itself.
            let t0 = performance.now(), on = true
            const wander = (now: number) => {
                if (!on) return
                const b = el.getBoundingClientRect(), t = (now - t0) / 1000
                tx = b.width * (0.5 + 0.28 * Math.sin(t * 0.21)); ty = b.height * (0.45 + 0.25 * Math.sin(t * 0.17 + 1.3))
                tr = radius * (0.75 + 0.15 * Math.sin(t * 0.5))
                if (!started) { x = tx; y = ty; started = true }
                x += (tx - x) * 0.05; y += (ty - y) * 0.05; r += (tr - r) * 0.05
                set()
                requestAnimationFrame(wander)
            }
            requestAnimationFrame(wander)
            cleanups.push(() => { on = false })
        }
        set()
        return () => { cancelAnimationFrame(raf); cleanups.forEach((c) => c()) }
    }, [radius])

    const edge = "radial-gradient(closest-side at 54% 44%, #000 25%, rgba(0,0,0,0.5) 62%, transparent 100%)"
    const hole = "radial-gradient(circle var(--r, 0px) at var(--x, -999px) var(--y, -999px), #000 0%, rgba(0,0,0,0.85) 40%, transparent 100%)"
    const img: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: position, display: "block", pointerEvents: "none", userSelect: "none" }
    return (
        <div ref={box} aria-hidden="true" style={{ ...props.style, position: "relative", width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none" }}>
            {/* resting layer: duotone in the shader colours, feathered into the background */}
            <div style={{ position: "absolute", inset: 0, isolation: "isolate", opacity: rest, WebkitMaskImage: edge, maskImage: edge }}>
                <img src={src} alt="" style={{ ...img, filter: "grayscale(1) contrast(1.15) brightness(0.85)" }} />
                <div style={{ position: "absolute", inset: 0, mixBlendMode: "color",
                    background: "radial-gradient(80% 70% at 70% 30%, #00BFBC, #0B3F6E 60%, #002782)" }} />
                <div style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", background: "linear-gradient(to bottom, rgba(18,18,17,0) 35%, rgba(18,18,17,0.9))" }} />
            </div>
            {/* reveal layer: the real photo inside a soft circle that follows the cursor */}
            <div style={{ position: "absolute", inset: 0, WebkitMaskImage: `${hole}, ${edge}`, maskImage: `${hole}, ${edge}`,
                WebkitMaskComposite: "source-in", maskComposite: "intersect", opacity: touch ? 0.85 : 1 } as CSSProperties}>
                <img src={src} alt="" style={{ ...img, filter: "brightness(0.82) contrast(1.05)" }} />
                <div style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", background: "radial-gradient(80% 70% at 70% 30%, rgba(0,191,188,0.35), rgba(11,63,110,0.55) 70%)" }} />
            </div>
        </div>
    )
}

HeroPortrait.defaultProps = { radius: 220, rest: 0.3, position: "50% 30%" }

addPropertyControls(HeroPortrait, {
    image: { type: ControlType.ResponsiveImage, title: "Photo" },
    radius: { type: ControlType.Number, title: "Reveal size", min: 60, max: 400, step: 10, unit: "px" },
    rest: { type: ControlType.Number, title: "Resting opacity", min: 0, max: 1, step: 0.02 },
    position: { type: ControlType.String, title: "Focus (x y)" },
})
