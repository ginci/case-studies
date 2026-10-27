import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * MiniCheckout — Tranzakt payment gateway demo.
 * Base amount until a method is chosen; then the fee for that method only, behind an info tooltip.
 * Copy button beside the amount on USSD and Transfer only.
 * Fees below are SAMPLE values for the demo, not Tranzakt's real pricing.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
const METHODS = [
    { id: "card", name: "Card", fee: (a) => Math.min(a * 0.015, 2000), copy: false },
    { id: "transfer", name: "Transfer", fee: () => 50, copy: true },
    { id: "ussd", name: "USSD", fee: () => 100, copy: true },
    { id: "bank", name: "Bank", fee: (a) => Math.min(a * 0.01, 1500), copy: false },
]

const naira = (n) => "₦" + n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function MiniCheckout(props) {
    const { amount, merchant, accent, font } = props
    const [method, setMethod] = React.useState(null)
    const [tip, setTip] = React.useState(false)
    const [copied, setCopied] = React.useState(false)

    const m = METHODS.find((x) => x.id === method)
    const fee = m ? Math.round(m.fee(amount) * 100) / 100 : 0
    const total = amount + fee

    const choose = (id) => { setMethod(id); setTip(false); setCopied(false) }
    const copy = () => {
        try { navigator.clipboard?.writeText(total.toFixed(2)) } catch (e) {}
        setCopied(true)
        setTimeout(() => setCopied(false), 1400)
    }

    const label = { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#737373" }

    return (
        <div style={{ width: "100%", maxWidth: 380, margin: "0 auto", fontFamily: font, color: "#0A0A0A", background: "#FFF", border: "1px solid #E5E5E5", borderRadius: 16, padding: 24, boxSizing: "border-box" }}>
            <div style={label}>Pay {merchant}</div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, position: "relative" }}>
                <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{naira(total)}</div>
                {m && (
                    <button aria-label="Amount breakdown" aria-expanded={tip} onClick={() => setTip(!tip)} style={iconBtn}>i</button>
                )}
                {m?.copy && (
                    <button aria-label="Copy amount" onClick={copy} style={{ ...iconBtn, width: "auto", padding: "0 10px", fontSize: 11, borderRadius: 999, color: copied ? accent : "#404040", borderColor: copied ? accent : "#E5E5E5" }}>
                        {copied ? "Copied" : "Copy"}
                    </button>
                )}
                {tip && m && (
                    <div role="tooltip" style={{ position: "absolute", top: "100%", left: 0, marginTop: 8, background: "#0A0A0A", color: "#FFF", borderRadius: 10, padding: "12px 14px", fontSize: 13, minWidth: 220, zIndex: 5, boxShadow: "0 12px 30px -10px rgba(0,0,0,0.4)" }}>
                        <Row k="Amount" v={naira(amount)} />
                        <Row k={`${m.name} fee`} v={naira(fee)} />
                        <div style={{ height: 1, background: "#333", margin: "8px 0" }} />
                        <Row k="You pay" v={naira(total)} bold />
                    </div>
                )}
            </div>
            <div style={{ fontSize: 13, color: "#737373", marginTop: 4 }}>
                {m ? `Includes ${m.name.toLowerCase()} fee` : "Choose how you'd like to pay"}
            </div>

            <div role="radiogroup" aria-label="Payment method" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginTop: 20 }}>
                {METHODS.map((x) => {
                    const on = x.id === method
                    return (
                        <button key={x.id} role="radio" aria-checked={on} onClick={() => choose(x.id)}
                            style={{ height: 40, borderRadius: 8, border: `1px solid ${on ? accent : "#E5E5E5"}`, background: on ? accent : "#FFF", color: on ? "#FFF" : "#0A0A0A", fontFamily: font, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "background .15s, border-color .15s" }}>
                            {x.name}
                        </button>
                    )
                })}
            </div>

            <div style={{ marginTop: 20, minHeight: 112 }}>
                {!m && <Hint text="The fee appears only once you pick a method, and only for that method." />}
                {m?.id === "card" && <Fields items={["Card number", "MM / YY", "CVV"]} />}
                {m?.id === "transfer" && <Detail rows={[["Bank", "[Partner bank]"], ["Account number", "0123456789"], ["Account name", `${merchant} / Tranzakt`]]} />}
                {m?.id === "ussd" && <Detail rows={[["Your bank", "[Select bank]"], ["Dial", "*XXX*000*" + Math.round(total) + "#"]]} />}
                {m?.id === "bank" && <Fields items={["Select your bank", "Account number"]} />}
            </div>

            <button disabled={!m} style={{ width: "100%", height: 48, marginTop: 8, borderRadius: 8, border: "none", background: m ? "#0A0A0A" : "#E5E5E5", color: m ? "#FFF" : "#A3A3A3", fontFamily: font, fontSize: 15, fontWeight: 500, cursor: m ? "pointer" : "default" }}>
                {m ? `Pay ${naira(total)}` : "Pay"}
            </button>
            <div style={{ ...label, textAlign: "center", marginTop: 14, fontSize: 9 }}>Sample fees · demo only</div>
        </div>
    )
}

const iconBtn = { width: 24, height: 24, borderRadius: 24, border: "1px solid #E5E5E5", background: "#FFF", color: "#404040", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }

const Row = ({ k, v, bold = false }) => (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "2px 0", fontWeight: bold ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>
        <span style={{ color: bold ? "#FFF" : "#A3A3A3" }}>{k}</span><span>{v}</span>
    </div>
)
const Hint = ({ text }) => <div style={{ fontSize: 13, color: "#737373", lineHeight: 1.5, padding: 14, border: "1px dashed #D4D4D4", borderRadius: 8 }}>{text}</div>
const Fields = ({ items }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((t) => <div key={t} style={{ height: 40, borderRadius: 8, border: "1px solid #E5E5E5", display: "flex", alignItems: "center", padding: "0 12px", fontSize: 13, color: "#A3A3A3" }}>{t}</div>)}
    </div>
)
const Detail = ({ rows }) => (
    <div style={{ borderRadius: 8, background: "#FAFAFA", padding: "6px 14px" }}>
        {rows.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "8px 0", fontSize: 13, borderBottom: "1px solid #EDEDED" }}>
                <span style={{ color: "#737373" }}>{k}</span><span style={{ fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{v}</span>
            </div>
        ))}
    </div>
)

MiniCheckout.defaultProps = { amount: 25000, merchant: "[Merchant name]", accent: "#059669", font: '"Geist", "Helvetica Neue", Arial, sans-serif' }

addPropertyControls(MiniCheckout, {
    amount: { type: ControlType.Number, defaultValue: 25000, min: 100, step: 100, displayStepper: true },
    merchant: { type: ControlType.String, defaultValue: "[Merchant name]" },
    accent: { type: ControlType.Color, defaultValue: "#059669" },
    font: { type: ControlType.String, title: "Font stack", defaultValue: '"Geist", "Helvetica Neue", Arial, sans-serif' },
})
