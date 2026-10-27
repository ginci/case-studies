import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * ExplainRecommendExecute — Merchant AI interaction model, one collections moment.
 * The AI explains, recommends, and executes only after the merchant confirms.
 * All figures are SAMPLE data for the demo.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
const INVOICES = [
    { who: "[Customer A]", amt: 180000, days: 14 },
    { who: "[Customer B]", amt: 95000, days: 9 },
    { who: "[Customer C]", amt: 62500, days: 21 },
]
const naira = (n) => "₦" + n.toLocaleString("en-NG")

export default function ExplainRecommendExecute(props) {
    const { accent, font } = props
    const [step, setStep] = React.useState(0)
    const [picked, setPicked] = React.useState(INVOICES.map(() => true))
    const total = INVOICES.reduce((a, x) => a + x.amt, 0)
    const chosen = INVOICES.filter((_, i) => picked[i])
    const steps = ["Explain", "Recommend", "Execute"]
    const label = { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#737373" }

    return (
        <div style={{ width: "100%", fontFamily: font, color: "#0A0A0A", border: "1px solid #E5E5E5", borderRadius: 16, overflow: "hidden", background: "#FFF" }}>
            <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderBottom: "1px solid #E5E5E5" }}>
                {steps.map((s, i) => (
                    <li key={s}>
                        <button onClick={() => i <= step && setStep(i)} aria-current={i === step ? "step" : undefined}
                            style={{ width: "100%", background: "none", border: "none", padding: "14px 8px", fontFamily: "inherit", cursor: i <= step ? "pointer" : "default", borderBottom: `2px solid ${i === step ? accent : "transparent"}`, color: i <= step ? "#0A0A0A" : "#A3A3A3", fontSize: 13, fontWeight: i === step ? 600 : 400 }}>
                            <span style={{ fontVariantNumeric: "tabular-nums", marginRight: 6, color: i <= step ? accent : "#A3A3A3" }}>0{i + 1}</span>{s}
                        </button>
                    </li>
                ))}
            </ol>

            <div style={{ padding: 24, minHeight: 260 }}>
                {step === 0 && (
                    <>
                        <div style={label}>What's happening</div>
                        <p style={{ fontSize: 18, lineHeight: 1.45, margin: "10px 0 0", letterSpacing: "-0.01em" }}>
                            <b>{naira(total)}</b> is overdue across <b>3 invoices</b>. Two are past 14 days, which is when collection rates usually start to fall.
                        </p>
                        <div style={{ marginTop: 18 }}>
                            {INVOICES.map((x) => (
                                <div key={x.who} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F0F0F0", fontSize: 14 }}>
                                    <span>{x.who}</span>
                                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{naira(x.amt)} <span style={{ color: x.days >= 14 ? "#B91C1C" : "#737373", marginLeft: 8 }}>{x.days}d</span></span>
                                </div>
                            ))}
                        </div>
                        <Primary accent={accent} onClick={() => setStep(1)}>What should I do?</Primary>
                    </>
                )}
                {step === 1 && (
                    <>
                        <div style={label}>Recommended</div>
                        <p style={{ fontSize: 18, lineHeight: 1.45, margin: "10px 0 0", letterSpacing: "-0.01em" }}>
                            Send a payment reminder with a pay link to each customer now. You choose who gets one.
                        </p>
                        <div style={{ marginTop: 18 }}>
                            {INVOICES.map((x, i) => (
                                <label key={x.who} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #F0F0F0", fontSize: 14, cursor: "pointer" }}>
                                    <input type="checkbox" checked={picked[i]} onChange={() => setPicked(picked.map((p, j) => (j === i ? !p : p)))} style={{ accentColor: accent, width: 16, height: 16 }} />
                                    <span style={{ flex: 1 }}>{x.who}</span>
                                    <span style={{ fontVariantNumeric: "tabular-nums" }}>{naira(x.amt)}</span>
                                </label>
                            ))}
                        </div>
                        <Primary accent={accent} disabled={!chosen.length} onClick={() => setStep(2)}>
                            Send {chosen.length} reminder{chosen.length === 1 ? "" : "s"}
                        </Primary>
                    </>
                )}
                {step === 2 && (
                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                        <div style={{ width: 44, height: 44, borderRadius: 44, background: accent, color: "#FFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 20 }} aria-hidden>✓</div>
                        <p style={{ fontSize: 18, margin: "16px 0 4px", fontWeight: 600 }}>{chosen.length} reminder{chosen.length === 1 ? "" : "s"} sent</p>
                        <p style={{ fontSize: 14, color: "#737373", margin: 0 }}>
                            {naira(chosen.reduce((a, x) => a + x.amt, 0))} in play. You'll see it here when payments land.
                        </p>
                        <button onClick={() => { setStep(0); setPicked(INVOICES.map(() => true)) }} style={{ marginTop: 20, background: "none", border: "none", color: "#404040", fontFamily: "inherit", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}>Replay</button>
                    </div>
                )}
            </div>
            <div style={{ ...label, fontSize: 9, textAlign: "center", padding: "0 0 14px" }}>Sample data · demo only</div>
        </div>
    )
}

const Primary = ({ children, onClick, accent, disabled = false }) => (
    <button onClick={onClick} disabled={disabled} style={{ marginTop: 20, height: 44, padding: "0 18px", borderRadius: 8, border: "none", background: disabled ? "#E5E5E5" : accent, color: disabled ? "#A3A3A3" : "#FFF", fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: disabled ? "default" : "pointer" }}>{children}</button>
)

ExplainRecommendExecute.defaultProps = { accent: "#059669", font: '"Geist", "Helvetica Neue", Arial, sans-serif' }

addPropertyControls(ExplainRecommendExecute, {
    accent: { type: ControlType.Color, defaultValue: "#059669" },
    font: { type: ControlType.String, title: "Font stack", defaultValue: '"Geist", "Helvetica Neue", Arial, sans-serif' },
})
