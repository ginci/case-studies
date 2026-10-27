import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * OrderTracker — Dado Foods concept demo.
 * Pick a city, step an order from placed to delivered.
 * Menu items, prices and timings are SAMPLE data for the demo.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
const CITIES = {
    Enugu: { eta: 35, area: "[Independence Layout]" },
    Lagos: { eta: 45, area: "[Lekki Phase 1]" },
}
const ITEMS = [
    { name: "[Signature dish]", qty: 1, price: 4500 },
    { name: "[Side]", qty: 2, price: 1200 },
    { name: "[Drink]", qty: 1, price: 800 },
]
const STEPS = [
    { key: "Placed", note: "We've got your order." },
    { key: "Preparing", note: "The kitchen is on it." },
    { key: "On the way", note: "Your rider has picked it up." },
    { key: "Delivered", note: "Enjoy your meal." },
]
const naira = (n) => "₦" + n.toLocaleString("en-NG")

export default function OrderTracker(props) {
    const { accent, font } = props
    const [city, setCity] = React.useState("Enugu")
    const [step, setStep] = React.useState(0)
    const c = CITIES[city]
    const subtotal = ITEMS.reduce((a, x) => a + x.qty * x.price, 0)
    const remaining = Math.max(0, Math.round(c.eta * (1 - step / (STEPS.length - 1))))
    const label = { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#737373" }
    const done = step === STEPS.length - 1

    return (
        <div style={{ width: "100%", maxWidth: 400, margin: "0 auto", fontFamily: font, color: "#0A0A0A", border: "1px solid #E5E5E5", borderRadius: 16, overflow: "hidden", background: "#FFF" }}>
            <div role="tablist" aria-label="City" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid #E5E5E5" }}>
                {Object.keys(CITIES).map((k) => (
                    <button key={k} role="tab" aria-selected={k === city} onClick={() => { setCity(k); setStep(0) }}
                        style={{ background: "none", border: "none", padding: "14px 0", fontFamily: "inherit", fontSize: 14, cursor: "pointer", fontWeight: k === city ? 600 : 400, color: k === city ? "#0A0A0A" : "#737373", borderBottom: `2px solid ${k === city ? accent : "transparent"}` }}>{k}</button>
                ))}
            </div>

            <div style={{ padding: 22 }}>
                <div style={label}>Delivering to {city} · {c.area}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
                    <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>{done ? "Delivered" : `${remaining} min`}</div>
                    {!done && <div style={{ fontSize: 13, color: "#737373" }}>estimated</div>}
                </div>
                <div style={{ fontSize: 14, color: "#404040", marginTop: 2 }}>{STEPS[step].note}</div>

                <ol style={{ listStyle: "none", padding: 0, margin: "20px 0 0", display: "grid", gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: 6 }}>
                    {STEPS.map((s, i) => (
                        <li key={s.key}>
                            <div style={{ height: 4, borderRadius: 4, background: i <= step ? accent : "#EDEDED", transition: "background .25s" }} />
                            <div style={{ fontSize: 11, marginTop: 8, color: i <= step ? "#0A0A0A" : "#A3A3A3", fontWeight: i === step ? 600 : 400 }}>{s.key}</div>
                        </li>
                    ))}
                </ol>

                <div style={{ marginTop: 22, borderRadius: 10, background: "#FAFAFA", padding: "6px 14px" }}>
                    {ITEMS.map((x) => (
                        <div key={x.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: "1px solid #EDEDED" }}>
                            <span>{x.qty}× {x.name}</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{naira(x.qty * x.price)}</span>
                        </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 6px", fontSize: 14, fontWeight: 600 }}>
                        <span>Total</span><span style={{ fontVariantNumeric: "tabular-nums" }}>{naira(subtotal)}</span>
                    </div>
                </div>

                <button onClick={() => setStep(done ? 0 : step + 1)}
                    style={{ width: "100%", height: 46, marginTop: 18, borderRadius: 8, border: "none", background: done ? "#0A0A0A" : accent, color: "#FFF", fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
                    {done ? "Order again" : `Advance to “${STEPS[step + 1].key}”`}
                </button>
            </div>
            <div style={{ ...label, fontSize: 9, textAlign: "center", padding: "0 0 14px" }}>Concept demo · sample data</div>
        </div>
    )
}

OrderTracker.defaultProps = { accent: "#E4572E", font: '"Geist", "Helvetica Neue", Arial, sans-serif' }

addPropertyControls(OrderTracker, {
    accent: { type: ControlType.Color, defaultValue: "#E4572E" },
    font: { type: ControlType.String, title: "Font stack", defaultValue: '"Geist", "Helvetica Neue", Arial, sans-serif' },
})
