import * as React from "react"
import { createRoot } from "react-dom/client"
import studies from "../../content/case-studies.json"
import DeviceMockup from "../../framer-components/DeviceMockup"
import MiniCheckout from "../../framer-components/MiniCheckout"
import ComponentExplorer from "../../framer-components/ComponentExplorer"
import KycStateSwitcher from "../../framer-components/KycStateSwitcher"
import ExplainRecommendExecute from "../../framer-components/ExplainRecommendExecute"
import TreasuryOverview from "../../framer-components/TreasuryOverview"
import OrderTracker from "../../framer-components/OrderTracker"
import SupplyChainFlow from "../../framer-components/SupplyChainFlow"

const DEMOS: Record<string, any> = { MiniCheckout, ComponentExplorer, KycStateSwitcher, ExplainRecommendExecute, TreasuryOverview, OrderTracker, SupplyChainFlow }
const FONT = '"Geist", "Helvetica Neue", Arial, sans-serif'

// Renders [bracketed] text as a visible placeholder.
function T({ children }: { children: string }) {
    const parts = String(children).split(/(\[[^\]]+\])/g)
    return <>{parts.map((p, i) => (p.startsWith("[") ? <span key={i} className="ph">{p}</span> : p))}</>
}

function Study({ s, n }: { s: any; n: number }) {
    const accent = s.accent
    return (
        <article style={{ ["--accent" as any]: accent }}>
            <header className="topbar wrap">
                <a href="#" className="mono"><T>{"← [Ginci Designs]"}</T></a>
                <nav className="mono switcher">{ALL.map((x: any, i: number) => <a key={x.slug} href={"#" + x.slug} aria-current={x.slug === s.slug ? "page" : undefined}>{String(i + 1).padStart(2, "0")} {x.title}</a>)}</nav>
            </header>

            <section className="hero wrap">
                <div className="mono eyebrow"><T>{s.category}</T></div>
                <h1 className="display">{s.title}</h1>
                <p className="outcome"><T>{s.outcomeLine}</T></p>
                <p className="result"><T>{s.outcomeResult}</T></p>
                <dl className="meta">
                    {[["Role", s.role], ["Timeline", s.timeline], ["Team", s.team], ["Client", s.client]].map(([k, v]) => (
                        <div key={k}><dt className="mono">{k}</dt><dd><T>{v}</T></dd></div>
                    ))}
                </dl>
            </section>

            <figure className="cover wrap-wide">
                <DeviceMockup device="laptop" label={`[Cover: ${s.title}, add Figma export]`} accent={accent} font={FONT} />
            </figure>

            <section className="stats wrap">
                {s.stats.map((x: any) => (
                    <div key={x.label}><div className="display stat">{x.value}</div><div className="mono">{x.label}</div></div>
                ))}
            </section>

            <section className="prose wrap">
                <Block label="Context"><p><T>{s.context}</T></p></Block>
                <Block label="The problem"><p><T>{s.problem}</T></p></Block>
                <Block label="Scope">
                    <ol className="scope">{s.scope.map((x: string, i: number) => <li key={x}><span className="mono">{String(i + 1).padStart(2, "0")}</span><T>{x}</T></li>)}</ol>
                </Block>
            </section>

            {s.sections.map((x: any) => {
                const Demo = DEMOS[x.demo]
                const live = x.status === "live"
                return (
                    <section key={x.id} className={"chapter" + (live ? "" : " soon")}>
                        <div className="wrap">
                            <div className="mono eyebrow">{x.eyebrow}{!live && <span className="badge">Coming soon</span>}</div>
                            <h2 className="display h2"><T>{x.heading}</T></h2>
                            <p className="lede"><T>{x.summary}</T></p>
                            {live && (
                                <>
                                    {x.body && <p className="body"><T>{x.body}</T></p>}
                                    {x.decisions?.length > 0 && <ul className="decisions">{x.decisions.map((d: string) => <li key={d}><T>{d}</T></li>)}</ul>}
                                </>
                            )}
                        </div>
                        {live && Demo && (
                            <div className="wrap-wide demo-row">
                                <div className="demo">
                                    <div className="mono demo-label">Try it</div>
                                    <Demo accent={accent} font={FONT} />
                                </div>
                                <figure className="shot">
                                    <DeviceMockup device={x.imageDevice} label={`[Screen — ${x.id.replace(/-/g, " ")} — add Figma export]`} accent={accent} font={FONT} />
                                </figure>
                            </div>
                        )}
                    </section>
                )
            })}

            <section className="prose wrap">
                <Block label="What I'd do next">
                    <ul className="decisions">{s.nextSteps.map((d: string) => <li key={d}><T>{d}</T></li>)}</ul>
                </Block>
            </section>

            <footer className="next wrap">
                <div className="mono">Next case study</div>
                <a href={s.nextSlug ? "#" + s.nextSlug : "#"} className="display h2"><T>{s.nextCaseStudy}</T> →</a>
            </footer>
        </article>
    )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
    return <div className="block"><div className="mono">{label}</div><div>{children}</div></div>
}

const ALL = studies as any[]
function App() {
    const pick = () => Math.max(0, ALL.findIndex((x) => "#" + x.slug === window.location.hash))
    const [i, setI] = React.useState(pick)
    React.useEffect(() => {
        const on = () => { setI(pick()); window.scrollTo(0, 0) }
        window.addEventListener("hashchange", on)
        return () => window.removeEventListener("hashchange", on)
    }, [])
    return <Study key={ALL[i].slug} s={ALL[i]} n={i + 1} />
}
createRoot(document.getElementById("root")!).render(<App />)
