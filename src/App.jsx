import React, { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────
// CONSTANTS & DATA
// ─────────────────────────────────────────────────────────
const ADMIN_PASSWORD = "11Jalanubi!";

const DEFAULT_LINKS = [
  { id: 1, label: "More about MINDS MYG", url: "https://canva.link/whatismindsmyg", emoji: "🌐" },
  { id: 2, label: "Instagram", url: "https://instagram.com/mindsmyg", emoji: "📸" },
  { id: 3, label: "Volunteer Sign-Up", url: "https://www.tinyurl.com/mindsvolreg", emoji: "🙋" },
  { id: 4, label: "Trainee Sign-up", url: "https://www.tinyurl.com/mindsstepreg", emoji: "💕" },
  { id: 5, label: "Incident Reporting Form", url: "https://forms.office.com/r/example", emoji: "📋" },
  { id: 6, label: "Finance Infographic", url: "https://canva.link/jzdvp6f3vvobcxt", emoji: "💰" },
];

const CATEGORY_OPTIONS = [
  "Craft", "Numeracy", "Physical", "Horticulture", "Music", 
  "Cooking/Baking", "Literacy", "Sensory Play", "Social Skills", "Drama"
];

// ─────────────────────────────────────────────────────────
// LINKS VIEW
// ─────────────────────────────────────────────────────────
function LinksView({ links }) {
  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      {links.map(link => (
        <a key={link.id} href={link.url} target="_blank" rel="noreferrer" 
           style={{ display: "flex", alignItems: "center", padding: "16px", background: "var(--card)", marginBottom: "10px", borderRadius: "12px", border: "1px solid var(--border)", textDecoration: "none", color: "var(--text)", fontWeight: "500" }}>
          <span style={{ fontSize: "20px", marginRight: "12px" }}>{link.emoji}</span>
          {link.label}
        </a>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// FINANCE CHECKER
// ─────────────────────────────────────────────────────────
function FinanceChecker() {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [result, setResult] = useState(null);

  function check() {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) { setResult({ error: "Please enter a valid amount." }); return; }
    let steps = [];
    let category = "";
    let methodAdvice = "";

    if (amt < 500) {
      category = "Claims (<$500)";
      methodAdvice = "💳 PAYMENT: Cash, Debit, or NETS only.";
      steps = [
        "✅ Pay out of pocket using Cash, Debit, or NETS.",
        "🚨 STRICTLY NO credit card payments (Claims will be rejected).",
        "📋 Submit via Petty Cash Voucher or Claim Form.",
        paymentMethod === "credit" ? "🚨 ALERT: Credit Card detected—Claim will be REJECTED!" : "",
      ].filter(Boolean);
    } else if (amt <= 3000) {
      category = "Invoices ($500–$3000)";
      methodAdvice = "🧾 PAYMENT: Direct Invoicing to MINDS.";
      steps = [
        "📝 Billing: 11 Jalan Ubi, Block 3 #01-21, S(409074).",
        "📄 New vendors must complete an Account Opening Form.",
      ];
    } else {
      category = "Procurement (>$3000)";
      methodAdvice = "🏦 PAYMENT: Bank Transfer / Cheque.";
      steps = [
        "⏰ Start 3 months early. 3 quotes required.",
        "📋 Staff issues an Invitation to Quote (ITQ).",
      ];
    }
    setResult({ category, steps, amount: amt, methodAdvice });
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", background: "var(--card)", padding: 25, borderRadius: 16, border: "1px solid var(--border)" }}>
      <h3 style={{ color: "var(--accent)", marginTop: 0 }}>Finance Rules Checker</h3>
      <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount (SGD)" style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid var(--border)", marginBottom: 15 }} />
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        {["cash", "debit", "credit"].map(m => (
          <button key={m} onClick={() => setPaymentMethod(m)} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: paymentMethod === m ? "var(--accent-soft)" : "white", cursor: "pointer" }}>{m.toUpperCase()}</button>
        ))}
      </div>
      <button onClick={check} style={{ width: "100%", padding: 12, background: "var(--accent)", color: "white", border: "none", borderRadius: 10, fontWeight: "bold", cursor: "pointer" }}>Check Rules</button>
      {result && <div style={{ marginTop: 20, padding: 15, background: "var(--bg)", borderRadius: 10 }}><h4>{result.category}</h4><p>{result.methodAdvice}</p>{result.steps.map((s,i) => <p key={i} style={{fontSize:'13px'}}>• {s}</p>)}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AOR FORM
// ─────────────────────────────────────────────────────────
function AORForm() {
  const [items, setItems] = useState([{ id: 1, desc: "", cost: 0 }]);
  const total = items.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", background: "white", padding: 30, borderRadius: 12, border: "1px solid #ddd" }}>
      <h3 style={{ color: "var(--accent)" }}>Approval of Requirement (AOR)</h3>
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input placeholder="Purpose/Event Name" style={{ flex: 2, padding: "8px" }} />
        <input type="date" style={{ flex: 1, padding: "8px" }} />
      </div>
      {items.map((item, idx) => (
        <div key={item.id} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input style={{ flex: 3, padding: "8px" }} placeholder="Item description..." />
          <input type="number" style={{ flex: 1, padding: "8px" }} placeholder="$" onChange={(e) => {
            const newItems = [...items];
            newItems[idx].cost = e.target.value;
            setItems(newItems);
          }} />
        </div>
      ))}
      <button onClick={() => setItems([...items, { id: Date.now(), desc: "", cost: 0 }])} style={{ marginBottom: "20px" }}>+ Add Item</button>
      <div style={{ textAlign: "right", fontWeight: "bold", fontSize: "1.2rem", borderTop: "2px solid var(--accent)", paddingTop: "10px" }}>Total Est. Cost: ${total.toFixed(2)}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AI LESSON PLANNER
// ─────────────────────────────────────────────────────────
function LessonPlanner() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [config, setConfig] = useState({ selectedCategories: [], numActivities: 2, duration: 60 });

  const generateAIPlan = async () => {
    setLoading(false); // Logic to trigger your server-side Gemini function
    const prompt = `Create a ${config.duration} min session for MINDS MYG. 
      Activities: ${config.numActivities}. Categories: ${config.selectedCategories.join(", ")}. 
      For each activity, provide:
      1. Title.
      2. Level 1 (Mobility), Level 2 (General), Level 3 (Challenge).
      3. Three specific "Canva Image Prompts" (Step 1, Step 2, Step 3) for visual aids.
      Format: {"activities": [{"title": "", "l1": "", "l2": "", "l3": "", "canva_prompts": ["", "", ""]}]}`;
    
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Canva Prompt Copied!");
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", background: "var(--card)", padding: 25, borderRadius: 16 }}>
      {/* ... (config inputs from previous version) ... */}

      {plan && plan.map((act, i) => (
        <div key={i} style={{ background: "white", padding: 20, borderRadius: 12, marginBottom: 15, border: "1px solid var(--border)" }}>
          <h4 style={{ color: "var(--accent)", marginTop: 0 }}>{act.title}</h4>
          
          <div style={{ display: "grid", gap: 10, marginBottom: 15 }}>
            <div style={{ padding: 10, background: "#fdf2f2", borderRadius: 8, fontSize: 13 }}><strong>L1 (Mobility):</strong> {act.l1}</div>
            <div style={{ padding: 10, background: "#f0fdf4", borderRadius: 8, fontSize: 13 }}><strong>L2 (General):</strong> {act.l2}</div>
            <div style={{ padding: 10, background: "#eff6ff", borderRadius: 8, fontSize: 13 }}><strong>L3 (Challenge):</strong> {act.l3}</div>
          </div>

          {/* New: Canva Prompt Section */}
          <div style={{ background: "var(--bg)", padding: 12, borderRadius: 8, border: "1.5px dashed var(--accent)" }}>
            <p style={{ fontSize: 11, fontWeight: "bold", margin: "0 0 8px", color: "var(--accent)" }}>🎨 CANVA VISUAL STEPS</p>
            {act.canva_prompts.map((p, idx) => (
              <button 
                key={idx} 
                onClick={() => copyToClipboard(`Style: Doodle, Simple, High Contrast. Subject: ${p}`)}
                style={{ width: "100%", textAlign: "left", padding: "8px", background: "white", border: "1px solid #ddd", borderRadius: "6px", marginBottom: "5px", fontSize: "11px", cursor: "pointer" }}
              >
                📋 Copy Prompt for Step {idx + 1}
              </button>
            ))}
          </div>
        </div>
      ))}
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
    <div style={{ ...cssVars, minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "sans-serif" }}>
      <header style={{ background: "var(--accent)", color: "white", padding: "20px", textAlign: "center" }}>
        <h1 style={{ margin: 0 }}>MINDS MYG Operations</h1>
      </header>
      <nav style={{ display: "flex", justifyContent: "center", gap: 10, padding: 20, flexWrap: "wrap" }}>
        {["links", "finance", "aor", "lesson"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "8px 16px", borderRadius: "20px", border: "none", background: activeTab === tab ? "var(--accent)" : "white", color: activeTab === tab ? "white" : "black", fontWeight: "bold", cursor: "pointer" }}>{tab.toUpperCase()}</button>
        ))}
      </nav>
      <main style={{ padding: "0 20px 40px" }}>
        {activeTab === "links" && <LinksView links={DEFAULT_LINKS} />}
        {activeTab === "finance" && <FinanceChecker />}
        {activeTab === "aor" && <AORForm />}
        {activeTab === "lesson" && <LessonPlanner />}
      </main>
    </div>
  );
}
