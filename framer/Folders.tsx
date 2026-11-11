import { useEffect, useRef, useState, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

// Folders: a row of folder icons. On hover the folder lifts and three cards
// fan out of its pocket (labelled cards, or photo prints). Click, tap or the
// shortcut key opens the folder's page. Hover motion only on mouse devices.

type Folder = {
    title: string
    meta: string
    shortcut: string
    link: string
    kind: "cards" | "photos"
    cards: string[]
    photos: { src?: string; alt?: string }[]
    captions: string[]
}

const SPRING = "cubic-bezier(.34,1.4,.64,1)"

// Rest and hover poses for the three cards (back → front).
const POSE = [
    { inset: 14, rest: "translateY(0) rotate(2deg) scale(.92)", hover: "translateY(-30px) rotate(7deg) scale(.95)", z: 1, o: 0.7 },
    { inset: 8, rest: "translateY(0) rotate(-1.5deg) scale(.96)", hover: "translateY(-22px) rotate(-5deg) scale(.98)", z: 2, o: 0.9 },
    { inset: 4, rest: "translateY(0) rotate(0deg) scale(1)", hover: "translateY(-14px) rotate(1.5deg) scale(1)", z: 3, o: 1 },
]

function useHover() {
    const [fine, setFine] = useState(false)
    useEffect(() => {
        if (typeof window === "undefined") return
        setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches)
    }, [])
    return fine
}

function FolderIcon({ f, open, accent, reduce }: { f: Folder; open: boolean; accent: string; reduce: boolean }) {
    const W = 168, H = 120
    const t = (d: number) => (reduce ? "none" : `transform ${d}s ${SPRING}`)
    return (
        <div aria-hidden="true" style={{ position: "relative", width: W, height: H, margin: "0 auto",
            transform: open && !reduce ? "translateY(-4px) scale(1.03)" : "none", transition: reduce ? "none" : "transform .3s ease-out" }}>
            {/* back plate + tab */}
            <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "#232321", border: "1px solid rgba(244,243,238,0.14)",
                overflow: "hidden", boxShadow: open ? "0 14px 30px rgba(0,0,0,.45)" : "none", transition: "box-shadow .3s ease" }}>
                <div style={{ position: "absolute", left: 0, top: 0, width: 64, height: 22, borderBottomRightRadius: 12,
                    background: "#1A1A18", borderRight: "1px solid rgba(244,243,238,0.14)", borderBottom: "1px solid rgba(244,243,238,0.14)" }} />
            </div>
            {/* cards */}
            <div style={{ position: "absolute", left: 16, right: 16, bottom: 28, height: 76 }}>
                {POSE.map((p, i) => {
                    const label = f.kind === "cards" ? f.cards[i] || "" : f.captions[i] || ""
                    const photo = f.kind === "photos" ? f.photos[i] : undefined
                    const common: CSSProperties = { position: "absolute", top: 0, left: p.inset, right: p.inset, height: 76, borderRadius: 5, zIndex: p.z,
                        opacity: p.o, transform: open ? p.hover : p.rest, transition: t(0.5), boxShadow: "0 2px 8px rgba(0,0,0,.35)" }
                    return f.kind === "photos" ? (
                        <div key={i} style={{ ...common, background: "#F4F3EE", padding: 4, display: "flex", flexDirection: "column", gap: 3 }}>
                            <div style={{ flex: 1, borderRadius: 3, overflow: "hidden",
                                background: photo?.src ? `center / cover no-repeat url("${photo.src}")` : "linear-gradient(135deg,#B9C4CC,#7E8C97)" }} />
                            <span style={{ font: "500 7px/1 'Geist Mono', monospace", letterSpacing: ".08em", textTransform: "uppercase", color: "#5C5C59",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                        </div>
                    ) : (
                        <div key={i} style={{ ...common, background: "#3A3A36", border: "1px solid rgba(244,243,238,0.1)", padding: "12px 12px",
                            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 6 }}>
                            <span style={{ font: "500 9px/1.2 'Geist Mono', monospace", letterSpacing: ".08em", textTransform: "uppercase", color: "#E7E6E1",
                                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
                            <span style={{ width: 6, height: 6, borderRadius: 9, background: accent, flex: "0 0 6px", marginTop: 1 }} />
                        </div>
                    )
                })}
            </div>
            {/* front pocket */}
            <div style={{ position: "absolute", left: -4, right: -4, bottom: 0, height: 74, borderRadius: "16px 16px 18px 18px",
                background: "linear-gradient(180deg,#3B3B37 0%,#2E2E2B 100%)", border: "1px solid rgba(244,243,238,0.16)", zIndex: 4,
                boxShadow: "inset 0 1px 0 rgba(244,243,238,0.08)" }} />
        </div>
    )
}

export default function Folders(props: { folders: Folder[]; accent: string; columns: number; style?: CSSProperties }) {
    const { folders = [], accent = "#E8501A" } = props
    const fine = useHover()
    const [hover, setHover] = useState(-1)
    const [reduce, setReduce] = useState(false)
    const grid = useRef<HTMLDivElement | null>(null)
    const [gridW, setGridW] = useState(0)
    useEffect(() => {
        const el = grid.current
        if (!el || typeof ResizeObserver === "undefined") return
        const ro = new ResizeObserver((e) => setGridW(e[0].contentRect.width))
        ro.observe(el)
        return () => ro.disconnect()
    }, [])
    useEffect(() => {
        if (typeof window === "undefined") return
        setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        const key = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return
            const t = e.target as HTMLElement | null
            if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return
            const f = folders.find((x) => x.shortcut && x.shortcut.toLowerCase() === e.key.toLowerCase())
            if (f && f.link) window.location.href = f.link
        }
        window.addEventListener("keydown", key)
        return () => window.removeEventListener("keydown", key)
    }, [folders])
    // Fit: shrink the folder so it never overflows its column (two per row on phones).
    const cols = props.columns || 2
    const gap = gridW && gridW < 520 ? 8 : 16
    const colW = gridW ? (gridW - gap * (cols - 1)) / cols : 9999
    const s = Math.max(0.5, Math.min(1, (colW - 20) / 176))
    const compact = s < 0.95
    return (
        <div ref={grid} className="g-folders" style={{ ...props.style, display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap, width: "100%", maxWidth: 760, margin: "0 auto" }}>
            {folders.map((f, i) => {
                const open = fine && hover === i
                return (
                    <a key={i} href={f.link} aria-label={`${f.title}, ${f.meta}`}
                        onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}
                        onFocus={() => setHover(i)} onBlur={() => setHover(-1)}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: compact ? 8 : 14, padding: compact ? "24px 6px 16px" : "40px 16px 26px", borderRadius: compact ? 16 : 20, minWidth: 0,
                            textDecoration: "none", color: "inherit", background: open ? "rgba(244,243,238,0.04)" : "transparent",
                            transition: "background-color .3s ease", outlineOffset: 2 }}>
                        <div style={{ zoom: s }}><FolderIcon f={f} open={open} accent={accent} reduce={reduce} /></div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, marginTop: 6 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ font: `500 ${compact ? 14 : 16}px/1.2 Outfit, sans-serif`, color: "#F4F3EE", whiteSpace: "nowrap" }}>{f.title}</span>
                                {fine && f.shortcut ? (
                                    <kbd style={{ font: "500 10px/1 'Geist Mono', monospace", color: "#85847E", border: "1px solid rgba(244,243,238,0.18)",
                                        borderRadius: 4, padding: "3px 5px", textTransform: "uppercase" }}>{f.shortcut}</kbd>
                                ) : null}
                            </div>
                            <span style={{ font: `400 ${compact ? 12.5 : 14}px/1.3 'Nunito Sans', sans-serif`, color: "#85847E", textAlign: "center" }}>{f.meta}</span>
                        </div>
                    </a>
                )
            })}
        </div>
    )
}

const DEFAULTS: Folder[] = [
    { title: "Resources", meta: "[X] kits", shortcut: "R", link: "/resources", kind: "cards", cards: ["[Kit name]", "[Template]", "[Checklist]"], photos: [], captions: [] },
    { title: "Writing", meta: "[X] articles", shortcut: "W", link: "/writing", kind: "cards", cards: ["[Publication]", "[Publication]", "[Publication]"], photos: [], captions: [] },
    { title: "Photography", meta: "[Camera]", shortcut: "P", link: "/photography", kind: "photos", cards: [], photos: [{}, {}, {}], captions: ["[Place]", "[Place]", "[Place]"] },
    { title: "Other outlets", meta: "3 outlets", shortcut: "O", link: "/outlets", kind: "cards", cards: ["GNC Merch", "GNC Scenes", "Ginci Designs"], photos: [], captions: [] },
]
Folders.defaultProps = { folders: DEFAULTS, accent: "#E8501A", columns: 2 }

addPropertyControls(Folders, {
    accent: { type: ControlType.Color, title: "Card dot" },
    columns: { type: ControlType.Number, title: "Columns", min: 1, max: 4, step: 1, displayStepper: true },
    folders: {
        type: ControlType.Array,
        title: "Folders",
        maxCount: 6,
        control: {
            type: ControlType.Object,
            controls: {
                title: { type: ControlType.String, title: "Title" },
                meta: { type: ControlType.String, title: "Count line" },
                shortcut: { type: ControlType.String, title: "Key" },
                link: { type: ControlType.Link, title: "Link" },
                kind: { type: ControlType.Enum, title: "Cards", options: ["cards", "photos"], optionTitles: ["Labels", "Photos"] },
                cards: { type: ControlType.Array, title: "Labels", maxCount: 3, control: { type: ControlType.String }, hidden: (p: any) => p.kind === "photos" },
                photos: { type: ControlType.Array, title: "Photos", maxCount: 3, control: { type: ControlType.ResponsiveImage }, hidden: (p: any) => p.kind !== "photos" },
                captions: { type: ControlType.Array, title: "Captions", maxCount: 3, control: { type: ControlType.String }, hidden: (p: any) => p.kind !== "photos" },
            },
        },
        defaultValue: DEFAULTS,
    },
})
