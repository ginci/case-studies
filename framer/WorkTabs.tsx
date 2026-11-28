import { useEffect, useState, type CSSProperties } from "react"
import { addPropertyControls, ControlType } from "framer"

// Work page tabs: "Case studies" / "Shots". Shows the layer named "Work list" or "Shots list".
// The choice is kept in the URL hash (#shots) so the tab can be linked to and survives back/forward.
// The old "Playground list" stays hidden.

export default function WorkTabs(props: { first: string; second: string; style?: CSSProperties }) {
    const { first = "Case studies", second = "Shots" } = props
    const [tab, setTab] = useState<0 | 1>(0)
    useEffect(() => {
        const read = () => setTab(window.location.hash === "#shots" || window.location.hash === "#playground" ? 1 : 0)
        read()
        window.addEventListener("hashchange", read)
        return () => { window.removeEventListener("hashchange", read); document.documentElement.removeAttribute("data-g-tab") }
    }, [])
    useEffect(() => { document.documentElement.toggleAttribute("data-g-tab", tab === 1) }, [tab])
    const pick = (t: 0 | 1) => {
        setTab(t)
        history.replaceState(null, "", t === 1 ? "#shots" : window.location.pathname + window.location.search)
    }
    const btn = (t: 0 | 1, label: string) => (
        <button key={t} role="tab" aria-selected={tab === t} onClick={() => pick(t)}
            onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); pick(t === 0 ? 1 : 0) } }}
            tabIndex={tab === t ? 0 : -1} className="g-tab">{label}</button>
    )
    return (
        <div role="tablist" aria-label="Work" className="g-tabs" style={{ ...props.style }}>
            <style>{`
.g-tabs { display: inline-flex; gap: 4px; padding: 4px; border-radius: 999px; border: 1px solid rgba(244,243,238,.14); background: rgba(18,18,17,.6); }
.g-tab { all: unset; cursor: pointer; padding: 8px 16px; border-radius: 999px; font: 400 12px/1 "Geist Mono", ui-monospace, monospace; letter-spacing: .02em; color: #A3A29C; white-space: nowrap; transition: background-color .25s ease, color .25s ease; }
.g-tab:hover { color: #F4F3EE; }
.g-tab[aria-selected="true"] { background: #F4F3EE; color: #121211; }
.g-tab:focus-visible { outline: 2px solid #F4F3EE; outline-offset: 2px; }
html[data-g-tab] [data-framer-name="Work list"], html[data-g-tab] [data-framer-name^="Hover preview"], html:not([data-g-tab]) [data-framer-name="Shots list"], [data-framer-name="Playground list"] { display: none !important; }
html[data-g-tab] [data-framer-name="Shots list"] { animation: g-tab-in .45s ease both; }
@keyframes g-tab-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .g-tab { transition: none; } html[data-g-tab] [data-framer-name="Shots list"] { animation: none; } }
`}</style>
            {btn(0, first)}
            {btn(1, second)}
        </div>
    )
}

WorkTabs.defaultProps = { first: "Case studies", second: "Shots" }
addPropertyControls(WorkTabs, {
    first: { type: ControlType.String, title: "Tab 1" },
    second: { type: ControlType.String, title: "Tab 2" },
})
