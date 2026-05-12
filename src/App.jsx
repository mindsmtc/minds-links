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
        <h3 style={{ margin: "0 0 20px", fontSize: 18, fontFamily: "serif", color: "var(--accent)" }}>Finance Rules Checker</h3>
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>PURCHASE AMOUNT (SGD)</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1.5px solid var(--border)", marginBottom: 16 }} />
        <button onClick={check} style={{ width: "100%", padding: "13px", borderRadius: 12, background: "var(--accent)", color: "#fff", fontWeight: 700 }}>Check Finance Rules →</button>
      </div>
      {result && <div style={{ background: "var(--card)", padding: 20, borderRadius: 16, border: "1px solid var(--border)" }}>
        <h4>{result.category}</h4>
        {result.steps.map((s, i) => <p key={i}>{s}</p>)}
      </div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LESSON PLANNER
// ─────────────────────────────────────────────────────────
function LessonPlanner() {
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", background: "var(--card)", padding: 28, borderRadius: 16, border: "1px solid var(--border)" }}>
      <h3 style={{ color: "var(--accent)" }}>Lesson Planner</h3>
      <p>Module coming soon.</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LINKS PAGE
// ─────────────────────────────────────────────────────────
function LinksPage({ links }) {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      {links.map(link => (
        <a key={link.id} href={link.url} target="_blank" rel="noreferrer" style={{ display: "block", padding: 16, background: "var(--card)", marginBottom: 8, borderRadius: 12, border: "1px solid var(--border)", textDecoration: "none", color: "var(--text)" }}>
          {link.emoji} {link.label}
        </a>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("links");
  const [links] = useState(DEFAULT_LINKS);

  const cssVars = {
    "--bg": "#f0fdf4", "--card": "#ffffff", "--border": "#d1fae5",
    "--text": "#111827", "--muted": "#6b7280", "--accent": "#059669",
  };

  return (
    <div style={{ ...cssVars, minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "sans-serif" }}>
      <header style={{ background: "var(--accent)", color: "#fff", padding: 20, textAlign: "center" }}>
        <h1>MINDS MYG</h1>
      </header>
      <nav style={{ display: "flex", justifyContent: "center", gap: 10, padding: 20 }}>
        {["links", "finance", "lesson"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid var(--border)", cursor: "pointer", background: activeTab === t ? "var(--accent)" : "white", color: activeTab === t ? "white" : "black" }}>
            {t.toUpperCase()}
          </button>
        ))}
      </nav>
      <main style={{ padding: 20 }}>
        {activeTab === "links" && <LinksPage links={links} />}
        {activeTab === "finance" && <FinanceChecker />}
        {activeTab === "lesson" && <LessonPlanner />}
      </main>
      <footer style={{ textAlign: "center", padding: "24px", color: "var(--muted)", fontSize: 12 }}>
        MINDS MYG Portal • Built with ❤️
      </footer>
    </div>
  );
}
