import React, { useState, useRef, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────
// CONSTANTS & DATA
// ─────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "11Jalanubi!";

const DEFAULT_LINKS = [
  { id: 1, label: "More about MINDS MYG", url: "https://canva.link/whatismindsmyg", emoji: "🌐" },
  { id: 2, label: "Instagram", url: "https://instagram.com/mindsmyg", emoji: "📸" },
  { id: 3, label: "Volunteer Sign-Up", url: "https://www.tinyurl.com/mindsvolreg", emoji: "🙋" },
  { id: 4, label: "Trainee Sign-up", url: "https://www.tinyurl.com/mindsstepreg", emoji: "💕" },
  { id: 5, label: "Programme Ideas", url: "https://canva.link/qaycqpl3ctflgdf", emoji: "🏠" },
  { id: 6, label: "Incident Reporting Form", url: "https://forms.office.com/Pages/ResponsePage.aspx?id=7XQ5ALlMskmFb6ViXot-iF5XuQffQhxGrfBaBFcUTdxUOUVQWTdVMjdZOFM0N0xLTE1NTldKVjRKMyQlQCN0PWcu", emoji: "👍" },
  { id: 7, label: "Finance Infographic", url: "https://canva.link/jzdvp6f3vvobcxt", emoji: "💰" },
];

const ACTIVITY_TYPES = [
  { id: "craft", label: "Craft", icon: "🎨" },
  { id: "numeracy", label: "Numeracy", icon: "🔢" },
  { id: "physical", label: "Physical Activity", icon: "🏃" },
  { id: "horticulture", label: "Horticulture", icon: "🌱" },
  { id: "music", label: "Music", icon: "🎵" },
  { id: "cooking", label: "Cooking / Baking", icon: "🍳" },
  { id: "literacy", label: "Literacy", icon: "📖" },
  { id: "sensory", label: "Sensory Play", icon: "✋" },
  { id: "social", label: "Social Skills", icon: "🤝" },
  { id: "drama", label: "Drama / Role Play", icon: "🎭" },
];

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
function generateId() { return Math.random().toString(36).slice(2, 9); }

// ─────────────────────────────────────────────────────────
// FINANCE CHECKER
// ─────────────────────────────────────────────────────────
function FinanceChecker() {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("budget");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [result, setResult] = useState(null);

  function check() {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setResult({ error: "Please enter a valid amount." }); return; }
    let steps = [];
    let category = "";
    if (amt < 500) {
      category = "Claims (<$500)";
      steps = [
        "✅ Pay out of pocket using Cash, Debit, or NETS (strictly NO credit card).",
        "📋 Fill in the Claim Form and attach ALL receipts to the same form.",
        "📁 Submit the completed claim form into the claim form submissions folder.",
        "⚠️ Each person can claim a maximum of $500 per month.",
        paymentMethod === "credit" ? "🚨 ALERT: Credit card payments are NOT allowed — this claim may be rejected!" : "",
      ].filter(Boolean);
    } else if (amt <= 3000) {
      category = source === "budget" ? "Invoices ($500–$3000)" : "Invoices from Donations ($500–$3000)";
      steps = [
        "🧾 Ask vendor for an invoice with 30-day credit.",
        "📝 Bill to: MINDSG LTD, 11 Jalan Ubi, Block 3 #01-21 (Level 2), Singapore 409074.",
        "📄 Ask vendor to fill in an Account Opening Form.",
        "📁 Submit the invoice + Account Opening Form in the invoice submission folder.",
        "💰 Payment to vendor: by 15th if submitted before 2nd, or by 30th if submitted before 17th.",
        source === "donation" ? "📧 Email donation@minds.org.sg to inform of designation to MINDS MYG." : "",
      ].filter(Boolean);
    } else {
      category = source === "budget" ? "Quotations (>$3000)" : "Quotations from Donations (>$3000)";
      steps = [
        "⏰ Start at least 3 months before the event/purchase.",
        "✉️ MINDS staff must get approval from CSS Director or Finance Director + CEO.",
        "📋 MINDS staff issues an Invitation to Quote (ITQ) — other vendors can bid.",
        "🤝 Share quotations with project team, who selects the chosen vendor.",
        "🛒 Project proceeds with purchase from chosen vendor.",
        "🧾 Ask for invoice with 30-day credit, then follow Invoice steps.",
        "⚠️ If only 1 vendor available (no 3 quotes), MINDS staff need an extra week for Direct Contracting approval.",
        source === "donation" ? "🚫 Donation funds: do NOT make payment yet — MINDS staff must first get Finance Director + CEO approval." : "",
      ].filter(Boolean);
    }
    setResult({ category, steps, amount: amt });
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, marginBottom: 20, border: "1px solid var(--border)" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "var(--accent)" }}>Finance Rules Checker</h3>
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>PURCHASE AMOUNT (SGD)</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid var(--border)", marginBottom: 16, boxSizing: "border-box" }} />
        
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>FUNDING SOURCE</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[["budget","Budget"],["donation","Donations"]].map(([v,l]) => (
            <button key={v} onClick={() => setSource(v)} style={{ flex: 1, padding: 10, borderRadius: 10, border: `2px solid ${source===v?"var(--accent)":"var(--border)"}`, background: source===v ? "var(--accent)" : "white", color: source===v ? "#fff" : "var(--text)", cursor: "pointer" }}>{l}</button>
          ))}
        </div>

        <button onClick={check} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: "var(--accent)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Check Finance Rules →</button>
      </div>

      {result && (
        <div style={{ background: "white", borderRadius: 16, padding: 24, border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ background: "var(--accent)", color: "#fff", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>{result.category}</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>S${result.amount.toFixed(2)}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {result.steps.map((s, i) => (
              <div key={i} style={{ padding: "10px 14px", background: "var(--bg)", borderRadius: 10, fontSize: 14 }}>{s}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AOR FORM
// ─────────────────────────────────────────────────────────
function AORForm() {
  const [data, setData] = useState({ date: "", purpose: "", cost: "", dept: "CSS-MYG" });
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", background: "white", padding: 28, borderRadius: 16, border: "1px solid var(--border)" }}>
      <h3 style={{ color: "var(--accent)" }}>Approval of Requirement (AOR)</h3>
      <div style={{ display: "grid", gap: 15 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 5 }}>PURPOSE OF REQUEST</label>
          <textarea value={data.purpose} onChange={e => setData({...data, purpose: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--border)", minHeight: 80 }} placeholder="Explain why these items are needed..." />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 5 }}>ESTIMATED TOTAL COST (SGD)</label>
          <input type="number" value={data.cost} onChange={e => setData({...data, cost: e.target.value})} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--border)" }} placeholder="0.00" />
        </div>
        <button style={{ padding: 14, background: "var(--accent)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Generate AOR Document</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LESSON PLANNER
// ─────────────────────────────────────────────────────────
function LessonPlanner() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  
  const toggleType = (id) => {
    setSelectedTypes(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", background: "white", padding: 28, borderRadius: 16, border: "1px solid var(--border)" }}>
      <h3 style={{ color: "var(--accent)" }}>Lesson Planner</h3>
      <p style={{ fontSize: 14, color: "var(--muted)" }}>Select activity focus areas for your session:</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
        {ACTIVITY_TYPES.map(type => (
          <button key={type.id} onClick={() => toggleType(type.id)} style={{ padding: 12, borderRadius: 12, border: `2px solid ${selectedTypes.includes(type.id)?"var(--accent)":"var(--border)"}`, background: selectedTypes.includes(type.id)?"var(--accent-soft)":"white", cursor: "pointer", textAlign: "left" }}>
            <span style={{ fontSize: 20, display: "block" }}>{type.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{type.label}</span>
          </button>
        ))}
      </div>
      <button style={{ width: "100%", padding: 14, background: "var(--accent)", color: "white", border: "none", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Generate Lesson Plan with AI</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("links");

  const cssVars = {
    "--bg": "#f0fdf4", "--card": "#ffffff", "--border": "#d1fae5",
    "--text": "#111827", "--muted": "#6b7280", "--accent": "#059669",
    "--accent-soft": "#d1fae5",
  };

  return (
    <div style={{ ...cssVars, minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "DM Sans, sans-serif" }}>
      <header style={{ background: "var(--accent)", color: "#fff", padding: "30px 20px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>MINDS MYG Portal</h1>
      </header>
      
      <nav style={{ display: "flex", justifyContent: "center", gap: 10, padding: "20px", flexWrap: "wrap" }}>
        {["links", "finance", "aor", "lesson"].map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)} 
            style={{ 
              padding: "10px 20px", borderRadius: 25, 
              border: `2px solid var(--accent)`,
              background: activeTab === t ? "var(--accent)" : "white",
              color: activeTab === t ? "white" : "var(--accent)",
              fontWeight: 700, cursor: "pointer", transition: "0.2s"
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </nav>

      <main style={{ padding: "0 20px 40px" }}>
        {activeTab === "links" && (
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column", gap: 10 }}>
            {DEFAULT_LINKS.map(link => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer" style={{ display: "block", padding: 16, background: "white", borderRadius: 12, border: "1px solid var(--border)", textDecoration: "none", color: "var(--text)", textAlign: "center", fontWeight: 600 }}>
                {link.emoji} {link.label}
              </a>
            ))}
          </div>
        )}
        {activeTab === "finance" && <FinanceChecker />}
        {activeTab === "aor" && <AORForm />}
        {activeTab === "lesson" && <LessonPlanner />}
      </main>
    </div>
  );
}
