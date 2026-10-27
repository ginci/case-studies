import * as React from "react"
import { createRoot } from "react-dom/client"
import studies from "../../content/case-studies.json"
import DeviceMockup from "../../framer-components/DeviceMockup"
import MiniCheckout from "../../framer-components/MiniCheckout"
import ComponentExplorer from "../../framer-components/ComponentExplorer"
import KycStateSwitcher from "../../framer-components/KycStateSwitcher"
import ExplainRecommendExecute from "../../framer-components/ExplainRecommendExecute"

const DEMOS: Record<string, any> = { MiniCheckout, ComponentExplorer, KycStateSwitcher, ExplainRecommendExecute }
const FONT = '"Geist", "Helvetica Neue", Arial, sans-serif'

// Renders [bracketed] text as a visible placeholder.
function T({ children }: { children: string }) {
    const parts = String(children).split(/(\[[^\]]+\])/g)
    return <>{parts.map((p, i) => (p.startsWith("[") ? <span key={i} className="ph">{p}</span> : p))}</>
}

function Study({ s }: { s: any }) {
    const accent = s.accent
    return (
        <article style={{ ["--accent" as any]: accent }}>
            <header className="topbar wrap">
                <a href="#" className="mono"><T>{"← [Ginci Designs]"}</T></a>
                <span className="mono">Case study 01</span>
            </header>

            <section className="hero wrap">
                <div className="mono eyebrow">{s.category}</div>
                <h1 className="display">{s.title}</h1>
                <p className="outcome">{s.outcomeLine}</p>
                <p className="result"><T>{s.outcomeResult}</T></p>
                <dl className="meta">
                    {[["Role", s.role], ["Timeline", s.timeline], ["Team", s.team], ["Client", s.client]].map(([k, v]) => (
                        <div key={k}><dt className="mono">{k}</dt><dd><T>{v}</T></dd></div>
                    ))}
                </dl>
            </section>

            <figure className="cover wrap-wide">
                <DeviceMockup device="laptop" label="[Cover — Tranzakt treasury dashboard]" accent={accent} font={FONT} />
            </figure>

            <section className="stats wrap">
                {s.stats.map((x: any) => (
                    <div key={x.label}><div className="display stat">{x.value}</div><div className="mono">{x.label}</div></div>
                ))}
            </section>

            <section className="prose wrap">
                <Block label="Context"><p>{s.context}</p></Block>
                <Block label="The problem"><p>{s.problem}</p></Block>
                <Block label="Scope">
                    <ol className="scope">{s.scope.map((x: string, i: number) => <li key={x}><span className="mono">{String(i + 1).padStart(2, "0")}</span>{x}</li>)}</ol>
                </Block>
            </section>

            {s.sections.map((x: any) => {
                const Demo = DEMOS[x.demo]
                const live = x.status === "live"
                return (
                    <section key={x.id} className={"chapter" + (live ? "" : " soon")}>
                        <div className="wrap">
                            <div className="mono eyebrow">{x.eyebrow}{!live && <span className="badge">Coming soon</span>}</div>
                            <h2 className="display h2">{x.heading}</h2>
                            <p className="lede">{x.summary}</p>
                            {live && (
                                <>
                                    <p className="body">{x.body}</p>
                                    <ul className="decisions">{x.decisions.map((d: string) => <li key={d}>{d}</li>)}</ul>
                                </>
                            )}
                        </div>
                        {live && (
                            <div className="wrap-wide demo-row">
                                <div className="demo">
                                    <div className="mono demo-label">Try it</div>
                                    {Demo && <Demo accent={accent} font={FONT} />}
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
                    <ul className="decisions">{s.nextSteps.map((d: string) => <li key={d}>{d}</li>)}</ul>
                </Block>
            </section>

            <footer className="next wrap">
                <div className="mono">Next case study</div>
                <a href="#" className="display h2"><T>{s.nextCaseStudy}</T> →</a>
            </footer>
        </article>
    )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
    return <div className="block"><div className="mono">{label}</div><div>{children}</div></div>
}

createRoot(document.getElementById("root")!).render(<Study s={(studies as any[])[0]} />)
