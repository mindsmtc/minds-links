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

// ─────────────────────────────────────────────────────────
// FINANCE CHECKER COMPONENT
// ─────────────────────────────────────────────────────────
function FinanceChecker() {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("budget");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [result, setResult] = useState(null);

  const checkFinance = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;

    let category = "";
    let steps = [];

    if (amt < 500) {
      category = "Claims (< $500)";
      steps = [
        "✅ Use Cash, Debit, or NETS (strictly NO credit card).",
        "📋 Fill in the Claim Form and attach receipts.",
        "📁 Submit to the claim submissions folder.",
        paymentMethod === "credit" ? "⚠️ Warning: Credit card payments are NOT allowed for claims!" : ""
      ].filter(Boolean);
    } else if (amt <= 3000) {
      category = "Invoices ($500 - $3000)";
      steps = [
        "🧾 Ask vendor for an invoice with 30-day credit.",
        "📝 Bill to: MINDSG LTD, 11 Jalan Ubi, Block 3 #01-21, S409074.",
        "📄 Vendor must fill in Account Opening Form if new.",
        "📁 Submit to the invoice submission folder."
      ];
    } else {
      category = "Quotations (> $3000)";
      steps = [
        "⏰ Start 3 months before purchase.",
        "✉️ Staff must get approval from Directors/CEO.",
        "📋 Staff issues an Invitation to Quote (ITQ).",
        "🤝 Team selects vendor from at least 3 quotes."
      ];
    }
    setResult({ category, steps });
  };

  return (
    <div style={{ background: "white", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
      <h3 style={{ color: "var(--accent)" }}>Finance Rules Checker</h3>
      <input 
        type="number" 
        placeholder="Enter amount (SGD)" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10, borderRadius: 8, border: "1px solid #ccc" }}
      />
      <button onClick={checkFinance} style={{ width: "100%", padding: 10, background: "var(--accent)", color: "white", border: "none", borderRadius: 8 }}>Check Rules</button>
      {result && (
        <div style={{ marginTop: 20, padding: 15, background: "#f9fafb", borderRadius: 8 }}>
          <h4>{result.category}</h4>
          <ul style={{ paddingLeft: 20 }}>{result.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AOR FORM COMPONENT
// ─────────────────────────────────────────────────────────
function AORForm() {
  return (
    <div style={{ background: "white", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
      <h3 style={{ color: "var(--accent)" }}>Approval of Resources (AOR)</h3>
      <p>Please use this for any budget requests or resource allocation.</p>
      <button style={{ padding: "10px 20px", background: "var(--accent)", color: "white", border: "none", borderRadius: 8 }}>
        Open AOR Form
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LESSON PLANNER COMPONENT
// ─────────────────────────────────────────────────────────
function LessonPlanner() {
  return (
    <div style={{ background: "white", padding: 20, borderRadius: 12, border: "1px solid var(--border)" }}>
      <h3 style={{ color: "var(--accent)" }}>Lesson Planner</h3>
      <p>Module currently under development for MYG activities.</p>
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
  };

  return (
    <div style={{ ...cssVars, minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "sans-serif" }}>
      <header style={{ background: "var(--accent)", color: "#fff", padding: "20px 40px", textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>MINDS MYG Portal</h1>
      </header>
      
      <nav style={{ display: "flex", justifyContent: "center", gap: 10, padding: 20, flexWrap: "wrap" }}>
        {["links", "finance", "aor", "lesson"].map(t => (
          <button 
            key={t} 
            onClick={() => setActiveTab(t)} 
            style={{ 
              padding: "10px 20px", 
              borderRadius: 20, 
              border: "1px solid var(--accent)", 
              cursor: "pointer", 
              background: activeTab === t ? "var(--accent)" : "white", 
              color: activeTab === t ? "white" : "var(--accent)",
              fontWeight: "bold"
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </nav>

      <main style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
        {activeTab === "links" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DEFAULT_LINKS.map(link => (
              <a key={link.id} href={link.url} target="_blank" rel="noreferrer" style={{ display: "block", padding: 16, background: "white", borderRadius: 12, border: "1px solid var(--border)", textDecoration: "none", color: "var(--text)", textAlign: "center" }}>
                {link.emoji} {link.label}
              </a>
            ))}
          </div>
        )}
        {activeTab === "finance" && <FinanceChecker />}
        {activeTab === "aor" && <AORForm />}
        {activeTab === "lesson" && <LessonPlanner />}
      </main>

      <footer style={{ textAlign: "center", padding: 40, color: "var(--muted)", fontSize: 12 }}>
        MINDS MYG Portal • Supporting our community with care
      </footer>
    </div>
  );
}
