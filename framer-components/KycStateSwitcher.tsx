import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * KycStateSwitcher — one verification module, three user types, every state.
 * Copy stays generic (never names a Tranzakt product). Failed documents get one clear message.
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
const TYPES = {
    Personal: ["BVN", "NIN", "Government-issued ID", "Proof of address"],
    Business: ["CAC registration number", "SCUML certificate", "Director BVN", "Proof of business address"],
    Government: ["[Agency registration detail]", "[Authorisation letter]", "Officer ID", "[Official address document]"],
}

const STATES = {
    "In review": { tone: "#B45309", bg: "#FEF3C7", title: "We're reviewing your details", body: "This usually takes [X business days]. You can keep exploring while we check." },
    "Action required": { tone: "#B45309", bg: "#FEF3C7", title: "One more thing to finish", body: "A required item is missing. Complete it to continue verification.", flag: 1 },
    "Failed submission": { tone: "#B91C1C", bg: "#FEE2E2", title: "We couldn't verify a document", body: "This document did not meet our criteria. Please upload a clear, valid copy.", flag: 2 },
    "Save & quit": { tone: "#404040", bg: "#F0F0F0", title: "Progress saved", body: "Pick up where you left off any time. Nothing you've entered is lost." },
    Success: { tone: "#047857", bg: "#D1FAE5", title: "You're verified", body: "Your account is verified. Your new limits apply right away." },
}

export default function KycStateSwitcher(props) {
    const { accent, font } = props
    const [type, setType] = React.useState("Business")
    const [state, setState] = React.useState("In review")
    const s = STATES[state]
    const fields = TYPES[type]
    const label = { fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "#737373" }

    const fieldStatus = (i) => {
        if (state === "Success") return "done"
        if (s.flag === i) return state === "Failed submission" ? "failed" : "missing"
        if (state === "Save & quit" && i >= 2) return "todo"
        return "done"
    }
    const pill = {
        done: ["Submitted", "#047857", "#ECFDF5"],
        failed: ["Re-upload", "#B91C1C", "#FEF2F2"],
        missing: ["Required", "#B45309", "#FFFBEB"],
        todo: ["Not started", "#737373", "#F5F5F5"],
    }

    return (
        <div style={{ width: "100%", fontFamily: font, color: "#0A0A0A", border: "1px solid #E5E5E5", borderRadius: 16, overflow: "hidden", background: "#FFF" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #E5E5E5", display: "grid", gap: 12 }}>
                <Tabs items={Object.keys(TYPES)} value={type} onChange={setType} label="User type" accent={accent} underline />
                <Tabs items={Object.keys(STATES)} value={state} onChange={setState} label="State" accent={accent} />
            </div>

            <div style={{ padding: 24, maxWidth: 520, margin: "0 auto" }}>
                <div style={label}>{type} verification</div>
                <div style={{ marginTop: 14, borderRadius: 10, background: s.bg, padding: "14px 16px", transition: "background .2s" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: s.tone }}>{s.title}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.5, color: "#404040", marginTop: 4 }}>{s.body}</div>
                </div>

                <div style={{ marginTop: 18 }}>
                    {fields.map((f, i) => {
                        const [txt, c, bg] = pill[fieldStatus(i)]
                        return (
                            <div key={f} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 0", borderBottom: "1px solid #F0F0F0", fontSize: 14 }}>
                                <span>{f}</span>
                                <span style={{ fontSize: 11, fontWeight: 500, color: c, background: bg, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap" }}>{txt}</span>
                            </div>
                        )
                    })}
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                    {state === "Failed submission" || state === "Action required" ? (
                        <Btn primary accent={accent}>{state === "Failed submission" ? "Upload again" : "Complete now"}</Btn>
                    ) : state === "Save & quit" ? (
                        <Btn primary accent={accent}>Continue verification</Btn>
                    ) : state === "Success" ? (
                        <Btn primary accent={accent}>Go to dashboard</Btn>
                    ) : (
                        <Btn accent={accent}>Back to dashboard</Btn>
                    )}
                    {state !== "Success" && state !== "Save & quit" && <Btn accent={accent} ghost>Save & quit</Btn>}
                </div>
            </div>
        </div>
    )
}

function Tabs({ items, value, onChange, label, accent, underline = false }) {
    return (
        <div role="tablist" aria-label={label} style={{ display: "flex", gap: underline ? 20 : 6, flexWrap: "wrap" }}>
            {items.map((x) => {
                const on = x === value
                return underline ? (
                    <button key={x} role="tab" aria-selected={on} onClick={() => onChange(x)}
                        style={{ background: "none", border: "none", padding: "6px 0", fontFamily: "inherit", fontSize: 14, fontWeight: on ? 600 : 400, color: on ? "#0A0A0A" : "#737373", borderBottom: `2px solid ${on ? accent : "transparent"}`, cursor: "pointer" }}>{x}</button>
                ) : (
                    <button key={x} role="tab" aria-selected={on} onClick={() => onChange(x)}
                        style={{ height: 28, padding: "0 12px", borderRadius: 999, fontFamily: "inherit", fontSize: 12, cursor: "pointer", border: `1px solid ${on ? "#0A0A0A" : "#E5E5E5"}`, background: on ? "#0A0A0A" : "#FFF", color: on ? "#FFF" : "#404040" }}>{x}</button>
                )
            })}
        </div>
    )
}

const Btn = ({ children, primary = false, ghost = false, accent }) => (
    <button style={{ height: 40, padding: "0 16px", borderRadius: 8, fontFamily: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer", border: `1px solid ${primary ? accent : ghost ? "transparent" : "#D4D4D4"}`, background: primary ? accent : "#FFF", color: primary ? "#FFF" : "#0A0A0A" }}>{children}</button>
)

KycStateSwitcher.defaultProps = { accent: "#059669", font: '"Geist", "Helvetica Neue", Arial, sans-serif' }

addPropertyControls(KycStateSwitcher, {
    accent: { type: ControlType.Color, defaultValue: "#059669" },
    font: { type: ControlType.String, title: "Font stack", defaultValue: '"Geist", "Helvetica Neue", Arial, sans-serif' },
})
