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
  { id: 7, label: "Finance Infographic", url: "https://canva.link/jzdvp6f3vvobcxt", emoji: "💰" },
];

const CATEGORY_OPTIONS = [
  "Craft", "Numeracy", "Physical", "Horticulture", "Music", 
  "Cooking/Baking", "Literacy", "Sensory Play", "Social Skills", "Drama"
];

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
    let methodAdvice = "";

    if (amt < 500) {
      category = "Claims (<$500)";
      methodAdvice = "💳 PAYMENT: Cash, Debit, or NETS only.";
      steps = [
        "✅ Pay out of pocket using Cash, Debit, or NETS.",
        "🚨 STRICTLY NO credit card payments (Claims will be rejected).",
        "📋 Fill in the Claim Form and attach ALL receipts to the same form.",
        paymentMethod === "credit" ? "🚨 ALERT: Credit Card selected—Claim will be REJECTED!" : "",
      ].filter(Boolean);
    } else if (amt <= 3000) {
      category = "Invoices ($500–$3000)";
      methodAdvice = "🧾 PAYMENT: Vendor Bills MINDS (Direct Invoicing).";
      steps = [
        "📝 Billing: MINDSG LTD, 11 Jalan Ubi, Block 3 #01-21, S(409074).",
        "📄 New vendors must complete an Account Opening Form.",
        "💰 Payment cycles are on the 15th and 30th of each month.",
      ];
    } else {
      category = "Procurement (>$3000)";
      methodAdvice = "🏦 PAYMENT: Bank Transfer / Corporate Cheque.";
      steps = [
        "⏰ Start 3 months early. Requires 3 competitive quotes.",
        "✉️ Must be approved by CSS Director/CEO.",
        "📋 Staff issues an Invitation to Quote (ITQ).",
      ];
    }
    setResult({ category, steps, amount: amt, methodAdvice });
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", background: "var(--card)", padding: 25, borderRadius: 16, border: "1px solid var(--border)" }}>
      <h3 style={{ fontFamily: "Fraunces, serif", color: "var(--accent)", marginTop: 0 }}>Finance Rules Checker</h3>
      <input
        type="number" value={amount} onChange={e => setAmount(e.target.value)}
        placeholder="Enter amount (SGD)"
        style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid var(--border)", marginBottom: 15, boxSizing: "border-box" }}
      />
      <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        {["cash", "debit", "credit"].map(m => (
          <button key={m} onClick={() => setPaymentMethod(m)} style={{
            flex: 1, padding: 10, borderRadius: 8, border: "1px solid var(--border)",
            background: paymentMethod === m ? "var(--accent-soft)" : "white",
            color: paymentMethod === m ? "var(--accent)" : "inherit", cursor: "pointer", fontWeight: "bold"
          }}>{m.toUpperCase()}</button>
        ))}
      </div>
      <button onClick={check} className="btn" style={{ width: "100%", padding: 12, background: "var(--accent)", color: "white", border: "none", borderRadius: 10, fontWeight: "bold", cursor: "pointer" }}>Check Rules</button>
      
      {result && (
        <div style={{ marginTop: 20, padding: 15, background: "var(--bg)", borderRadius: 10 }}>
          <h4 style={{ margin: "0 0 10px", color: "var(--accent)" }}>{result.category}</h4>
          <p><strong>{result.methodAdvice}</strong></p>
          <ul style={{ paddingLeft: 20, fontSize: 14 }}>
            {result.steps.map((s, i) => <li key={i} style={{ marginBottom: 5 }}>{s}</li>)}
          </ul>
        </div>
      )}
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
      <h3 style={{ fontFamily: "Fraunces", color: "var(--accent)" }}>Approval of Requirement (AOR)</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--accent)" }}>
            <th style={{ textAlign: "left", padding: 10 }}>Item Description</th>
            <th style={{ textAlign: "right", padding: 10 }}>Est. Cost ($)</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td><input style={{ width: "90%", padding: 8, border: "none" }} placeholder="Activity/Item name..." /></td>
              <td><input type="number" style={{ width: "80px", padding: 8, textAlign: "right" }} onChange={(e) => {
                const newItems = [...items];
                newItems[idx].cost = e.target.value;
                setItems(newItems);
              }} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setItems([...items, { id: Date.now(), desc: "", cost: 0 }])} style={{ marginTop: 10, cursor: "pointer" }}>+ Add Line</button>
      <div style={{ textAlign: "right", marginTop: 20, fontWeight: "bold", fontSize: 18 }}>Total: ${total.toFixed(2)}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AI LESSON PLANNER (CLAUDE INTEGRATION)
// ─────────────────────────────────────────────────────────
function LessonPlanner() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [config, setConfig] = useState({
    selectedCategories: [],
    numActivities: 2,
    duration: 60
  });

  const generateAIPlan = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": "YOUR_CLAUDE_API_KEY", // REPLACE THIS
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
          "dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1500,
          system: "You are an expert Special Education teacher for MINDS MYG Singapore. Create inclusive activity plans.",
          messages: [{
            role: "user",
            content: `Create a ${config.duration} min session with ${config.numActivities} activities. Categories: ${config.selectedCategories.join(", ")}. 
            For each activity, provide:
            1. Description & Visual Setup.
            2. Level 1 (High Support/Mobility): Minimal motor skills needed.
            3. Level 2 (Standard): Guided group participation.
            4. Level 3 (Challenge): Higher independence.
            Return as a structured JSON array named 'activities'.`
          }]
        })
      });
      const data = await response.json();
      const parsed = JSON.parse(data.content[0].text);
      setPlan(parsed.activities);
    } catch (err) {
      alert("AI Generation failed. Check API Key or CORS settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", background: "var(--card)", padding: 25, borderRadius: 16 }}>
      <h3 style={{ fontFamily: "Fraunces", color: "var(--accent)" }}>AI-Powered Planner</h3>
      
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 13, fontWeight: "bold", color: "var(--muted)" }}>SELECT CATEGORIES:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CATEGORY_OPTIONS.map(cat => (
            <button key={cat} onClick={() => {
              const prev = config.selectedCategories;
              const next = prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat];
              setConfig({ ...config, selectedCategories: next });
            }} style={{
              padding: "6px 12px", borderRadius: 20, border: "1px solid var(--border)", cursor: "pointer",
              background: config.selectedCategories.includes(cat) ? "var(--accent)" : "white",
              color: config.selectedCategories.includes(cat) ? "white" : "black"
            }}>{cat}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12 }}>No. of Activities</label>
          <input type="number" value={config.numActivities} onChange={e => setConfig({...config, numActivities: e.target.value})} style={{ width: "100%", padding: 8 }} />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 12 }}>Total Duration (mins)</label>
          <input type="number" value={config.duration} onChange={e => setConfig({...config, duration: e.target.value})} style={{ width: "100%", padding: 8 }} />
        </div>
      </div>

      <button onClick={generateAIPlan} disabled={loading || config.selectedCategories.length === 0} style={{
        width: "100%", padding: 15, background: "var(--accent)", color: "white", border: "none", borderRadius: 10, fontWeight: "bold", cursor: "pointer"
      }}>
        {loading ? "Claude is generating..." : "Generate AI Lesson Plan ✨"}
      </button>

      {plan && (
        <div style={{ marginTop: 30 }}>
          {plan.map((act, i) => (
            <div key={i} style={{ background: "white", padding: 20, borderRadius: 12, marginBottom: 15, border: "1px solid var(--border)" }}>
              <h4 style={{ color: "var(--accent)", marginTop: 0 }}>{act.title}</h4>
              <p style={{ fontSize: 14 }}>{act.visual_setup}</p>
              <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                <div style={{ padding: 10, background: "#fdf2f2", borderRadius: 8, fontSize: 13 }}><strong>L1 (Support):</strong> {act.level1}</div>
                <div style={{ padding: 10, background: "#f0fdf4", borderRadius: 8, fontSize: 13 }}><strong>L2 (General):</strong> {act.level2}</div>
                <div style={{ padding: 10, background: "#eff6ff", borderRadius: 8, fontSize: 13 }}><strong>L3 (Challenge):</strong> {act.level3}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("finance");

  const cssVars = {
    "--bg": "#f0fdf4", "--card": "#ffffff", "--border": "#d1fae5",
    "--text": "#111827", "--muted": "#6b7280", "--accent": "#059669",
    "--accent-soft": "#d1fae5",
  };

  return (
    <div style={{ ...cssVars, minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "sans-serif" }}>
      <header style={{ background: "var(--accent)", color: "white", padding: "20px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontFamily: "Fraunces" }}>MINDS MYG Ops Portal</h1>
      </header>

      <nav style={{ display: "flex", justifyContent: "center", gap: 10, padding: 20 }}>
        {["finance", "aor", "lesson"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "10px 20px", borderRadius: 20, border: "none", cursor: "pointer",
            background: activeTab === tab ? "var(--accent)" : "white",
            color: activeTab === tab ? "white" : "black", fontWeight: "bold"
          }}>{tab.toUpperCase()}</button>
        ))}
      </nav>

      <main style={{ padding: 20 }}>
        {activeTab === "finance" && <FinanceChecker />}
        {activeTab === "aor" && <AORForm />}
        {activeTab === "lesson" && <LessonPlanner />}
      </main>
    </div>
  );
}
