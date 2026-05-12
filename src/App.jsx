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
    setLoading(true);
    // WARNING: In production, use a backend proxy. This header is for dev testing.
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": "YOUR_API_KEY_HERE", 
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
          "dangerously-allow-browser": "true" 
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1500,
          system: "You are a Special Education expert for MINDS MYG Singapore. Output JSON only.",
          messages: [{
            role: "user",
            content: `Create a ${config.duration} min session for trainees with intellectual disabilities. Activities: ${config.numActivities}. Categories: ${config.selectedCategories.join(", ")}. For each activity, include a visual setup description and 3 levels: Level 1 (Mobility support), Level 2 (General), Level 3 (Challenge). Return JSON: {"activities": [{"title": "", "visual": "", "l1": "", "l2": "", "l3": ""}]}`
          }]
        })
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const parsed = JSON.parse(data.content[0].text);
      setPlan(parsed.activities);
    } catch (err) {
      console.error(err);
      alert("AI Error: Direct browser calls to Claude are often blocked by CORS. Ensure you are using a proxy or server-side script.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", background: "var(--card)", padding: 25, borderRadius: 16, border: "1px solid var(--border)" }}>
      <h3 style={{ color: "var(--accent)", marginTop: 0 }}>AI Lesson Generator</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {CATEGORY_OPTIONS.map(cat => (
          <button key={cat} onClick={() => {
            const next = config.selectedCategories.includes(cat) ? config.selectedCategories.filter(c => c !== cat) : [...config.selectedCategories, cat];
            setConfig({...config, selectedCategories: next});
          }} style={{ padding: "6px 12px", borderRadius: 20, border: "1px solid var(--border)", background: config.selectedCategories.includes(cat) ? "var(--accent)" : "white", color: config.selectedCategories.includes(cat) ? "white" : "black", cursor: "pointer" }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input type="number" value={config.numActivities} onChange={e => setConfig({...config, numActivities: e.target.value})} style={{ flex: 1, padding: 8 }} placeholder="Count" />
        <input type="number" value={config.duration} onChange={e => setConfig({...config, duration: e.target.value})} style={{ flex: 1, padding: 8 }} placeholder="Mins" />
      </div>
      <button onClick={generateAIPlan} disabled={loading || config.selectedCategories.length === 0} style={{ width: "100%", padding: 12, background: "var(--accent)", color: "white", border: "none", borderRadius: 10, cursor: "pointer" }}>{loading ? "Claude is thinking..." : "Generate AI Plan ✨"}</button>
      
      {plan && <div style={{ marginTop: 25 }}>
        {plan.map((act, i) => (
          <div key={i} style={{ background: "var(--bg)", padding: "15px", borderRadius: "10px", marginBottom: "15px" }}>
            <h4 style={{ color: "var(--accent)", margin: "0 0 10px" }}>{act.title}</h4>
            <p style={{ fontSize: "13px" }}><strong>Visuals:</strong> {act.visual}</p>
            <div style={{ fontSize: "12px", display: "grid", gap: "5px", marginTop: "10px" }}>
              <div style={{ padding: "8px", background: "#fee2e2", borderRadius: "5px" }}><strong>L1 (Mobility):</strong> {act.l1}</div>
              <div style={{ padding: "8px", background: "#dcfce7", borderRadius: "5px" }}><strong>L2 (General):</strong> {act.l2}</div>
              <div style={{ padding: "8px", background: "#dbeafe", borderRadius: "5px" }}><strong>L3 (Challenge):</strong> {act.l3}</div>
            </div>
          </div>
        ))}
      </div>}
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
