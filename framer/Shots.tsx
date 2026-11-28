import { useEffect, useRef, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

// Shots: a masonry grid of rounded containers, each holding a phone or browser mockup of a screen.
// Each shot takes a screenshot or a looping video (mp4/webm) and an optional link. Shots without media
// show an animated placeholder screen. Motion: tiles rise in on scroll, devices float gently, placeholders shimmer.
// Respects prefers-reduced-motion.

type Shot = { kind?: "phone" | "browser"; title?: string; image?: { src: string; alt?: string } | string; video?: string; link?: string }

const PLACEHOLDERS: Shot[] = [
    { kind: "phone", title: "Shot 01" },
    { kind: "phone", title: "Shot 02" },
    { kind: "browser", title: "Shot 03" },
    { kind: "browser", title: "Shot 04" },
    { kind: "phone", title: "Shot 05" },
    { kind: "browser", title: "Shot 06" },
]

const CSS = `
.g-shots { columns: 3; column-gap: 16px; width: 100%; }
@media (max-width: 1199px) { .g-shots { columns: 2; } }
@media (max-width: 809px) { .g-shots { columns: 1; } }
.g-shot { break-inside: avoid; margin: 0 0 16px; display: block; position: relative; border-radius: 32px; overflow: hidden; text-decoration: none;
  background: rgba(244,243,238,.035); border: 1px solid rgba(244,243,238,.06);
  opacity: 0; transform: translateY(24px); transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1), background-color .3s ease; }
.g-shot.g-in { opacity: 1; transform: none; }
.g-shot:hover { background: rgba(244,243,238,.06); }
.g-shot[data-kind="phone"] { aspect-ratio: 4 / 5; }
.g-shot[data-kind="browser"] { aspect-ratio: 4 / 3; }
.g-shot .g-dev { position: absolute; left: 50%; top: 53%; transform: translate(-50%, -50%); transition: transform .5s cubic-bezier(.2,.7,.2,1); }
.g-shot[data-kind="phone"] .g-dev { width: 38%; }
.g-shot[data-kind="browser"] .g-dev { width: 74%; }
.g-shot:hover .g-dev { transform: translate(-50%, -50%) scale(1.03); }
.g-float { animation: g-float 7s ease-in-out infinite; }
@keyframes g-float { 0%, 100% { translate: 0 0; } 50% { translate: 0 -8px; } }
.g-phone { position: relative; width: 100%; aspect-ratio: 390 / 844; border-radius: 36px; background: #0b0c0c; padding: 7px;
  box-shadow: 0 40px 80px -24px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.08), inset 0 0 0 1.5px #2b2d2c; }
.g-phone .g-scr { border-radius: 30px; }
.g-phone .g-island { position: absolute; top: 14px; left: 50%; transform: translateX(-50%); width: 30%; height: 18px; border-radius: 12px; background: #0b0c0c; z-index: 2; }
.g-browser { width: 100%; aspect-ratio: 16 / 10.5; border-radius: 12px; background: #F3F4F2; display: flex; flex-direction: column;
  box-shadow: 0 40px 80px -24px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.08); }
.g-bar { height: 22px; flex: 0 0 22px; display: flex; align-items: center; gap: 5px; padding: 0 10px; border-bottom: 1px solid rgba(17,19,18,.08); }
.g-bar i { width: 7px; height: 7px; border-radius: 50%; background: #D9DBD8; }
.g-bar b { margin: 0 auto; width: 36%; height: 11px; border-radius: 4px; background: #fff; border: 1px solid rgba(17,19,18,.08); }
.g-browser .g-scr { border-radius: 0 0 12px 12px; flex: 1; }
.g-scr { position: relative; overflow: hidden; background: #fff; height: 100%; }
.g-scr img, .g-scr video { display: block; width: 100%; height: 100%; object-fit: cover; object-position: top; }
.g-sk { position: absolute; inset: 0; padding: 14% 9% 0; display: flex; flex-direction: column; gap: 6%; }
.g-browser .g-sk { padding: 7% 8% 0; gap: 8%; }
.g-sk span { display: block; border-radius: 6px; background: linear-gradient(90deg, #ECEDEA 0%, #F6F7F4 40%, #ECEDEA 80%); background-size: 250% 100%; animation: g-shimmer 2.4s ease-in-out infinite; }
@keyframes g-shimmer { from { background-position: 100% 0; } to { background-position: -150% 0; } }
.g-label { position: absolute; left: 18px; top: 16px; font: 400 11px/1 "Geist Mono", ui-monospace, monospace; letter-spacing: .04em; color: #85847E; text-transform: uppercase; }
@media (prefers-reduced-motion: reduce) {
  .g-shot { opacity: 1; transform: none; transition: none; }
  .g-float, .g-sk span { animation: none; }
}
`

const Skeleton = ({ kind }: { kind: "phone" | "browser" }) =>
    kind === "phone" ? (
        <div className="g-sk">
            <span style={{ height: "4%", width: "45%" }} />
            <span style={{ height: "24%" }} />
            <span style={{ height: "4%", width: "70%" }} />
            <span style={{ height: "14%" }} />
            <span style={{ height: "14%" }} />
        </div>
    ) : (
        <div className="g-sk">
            <span style={{ height: "8%", width: "30%" }} />
            <span style={{ height: "14%", width: "62%" }} />
            <span style={{ height: "40%" }} />
        </div>
    )

function Screen({ shot, kind }: { shot: Shot; kind: "phone" | "browser" }) {
    const img = typeof shot.image === "string" ? shot.image : shot.image?.src
    if (shot.video) return <video src={shot.video} autoPlay muted loop playsInline poster={img} />
    if (img) return <img src={img} alt={(typeof shot.image === "object" && shot.image?.alt) || shot.title || ""} loading="lazy" />
    return <Skeleton kind={kind} />
}

export default function Shots(props: { shots?: Shot[]; style?: CSSProperties }) {
    const list = props.shots && props.shots.length ? props.shots : PLACEHOLDERS
    const root = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const el = root.current
        if (!el) return
        const tiles = Array.from(el.querySelectorAll<HTMLElement>(".g-shot"))
        if (!("IntersectionObserver" in window)) { tiles.forEach((t) => t.classList.add("g-in")); return }
        const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("g-in"); io.unobserve(e.target) } }), { rootMargin: "0px 0px -8% 0px" })
        tiles.forEach((t, i) => { t.style.transitionDelay = `${(i % 3) * 90}ms`; io.observe(t) })
        return () => io.disconnect()
    }, [list.length])
    return (
        <div ref={root} className="g-shots" style={{ ...props.style, height: "auto" }}>
            <style>{CSS}</style>
            {list.map((s, i) => {
                const kind = s.kind === "browser" ? "browser" : "phone"
                const placeholder = !s.video && !s.image
                const Tag: any = s.link ? "a" : "div"
                return (
                    <Tag key={i} className="g-shot" data-kind={kind} href={s.link || undefined} aria-label={s.title || undefined}>
                        {placeholder && <span className="g-label">{s.title || `Shot ${String(i + 1).padStart(2, "0")}`} · placeholder</span>}
                        <div className="g-dev"><div className="g-float" style={{ animationDelay: `${-i * 1.3}s` }}>
                            {kind === "phone" ? (
                                <div className="g-phone"><span className="g-island" /><div className="g-scr"><Screen shot={s} kind="phone" /></div></div>
                            ) : (
                                <div className="g-browser"><div className="g-bar"><i /><i /><i /><b /></div><div className="g-scr"><Screen shot={s} kind="browser" /></div></div>
                            )}
                        </div></div>
                    </Tag>
                )
            })}
        </div>
    )
}

Shots.defaultProps = { shots: [] }
addPropertyControls(Shots, {
    shots: {
        type: ControlType.Array,
        title: "Shots",
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                kind: { type: ControlType.Enum, title: "Device", options: ["phone", "browser"], optionTitles: ["Phone", "Browser"], defaultValue: "phone" },
                image: { type: ControlType.ResponsiveImage, title: "Screenshot" },
                video: { type: ControlType.File, title: "Video", allowedFileTypes: ["mp4", "webm"] },
                link: { type: ControlType.Link, title: "Link" },
            },
        },
    },
})
