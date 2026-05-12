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
  const [status, setStatus] = useState("");
  const [plan, setPlan] = useState(null);
  const [config, setConfig] = useState({ 
    selectedCategories: [], 
    numActivities: 2, 
    duration: 60 
  });

  const generateAIPlan = async () => {
  if (config.selectedCategories.length === 0) {
    alert("Please select focus areas first.");
    return;
  }

  setLoading(true);
  setStatus("Asking Gemini to plan...");

  // 🚨 MUST be your Deployed Web App URL (ends in /exec)
  const scriptURL = "https://script.google.com/macros/s/AKfycby3I0pFWyoQ-nHs9gT2lU479mcRFmU1oo534UUe8QrS4ubb1BCjlZj-_x3RY8RQaxp4/exec"; 

  const promptText = `Create a ${config.duration} min session for MINDS MYG. 
    Activities: ${config.numActivities}. Categories: ${config.selectedCategories.join(", ")}. 
    Return JSON: {"activities": [{"title": "", "l1": "", "l2": "", "l3": "", "canva_prompts": ["", "", ""]}]}`;

  try {
    // We use a GET request because it's more stable for Google Apps Script redirects
    const finalURL = `${scriptURL}?prompt=${encodeURIComponent(promptText)}`;
    
    const response = await fetch(finalURL);
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const data = await response.json();
    
    if (data.activities) {
      setPlan(data.activities);
      setStatus("");
    } else {
      setStatus("AI returned an empty plan.");
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    setStatus("Connection Error. Check if the Script URL is correct and deployed as 'Anyone'.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", background: "white", padding: 25, borderRadius: 16, border: "1px solid #e2e8f0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h3 style={{ color: "var(--accent)", margin: 0 }}>AI Lesson Generator</h3>
        <a href="https://www.canva.com/magic-home" target="_blank" rel="noreferrer" style={{ fontSize: "11px", color: "var(--accent)", textDecoration: "none", border: "1px solid var(--accent)", padding: "5px 12px", borderRadius: "20px", fontWeight: "bold" }}>
          Open Canva Magic Media ↗
        </a>
      </div>

      {/* Inputs for Activities and Duration */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Number of Activities</label>
          <input 
            type="number" 
            value={config.numActivities} 
            onChange={(e) => setConfig({...config, numActivities: e.target.value})}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e0" }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: "12px", fontWeight: "bold", display: "block", marginBottom: "5px" }}>Total Duration (Mins)</label>
          <input 
            type="number" 
            value={config.duration} 
            onChange={(e) => setConfig({...config, duration: e.target.value})}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e0" }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 25 }}>
        <p style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "8px" }}>FOCUS AREAS:</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["Craft", "Numeracy", "Physical", "Horticulture", "Music", "Cooking", "Literacy", "Sensory", "Social", "Drama"].map(cat => (
            <button key={cat} onClick={() => {
              const next = config.selectedCategories.includes(cat) ? config.selectedCategories.filter(c => c !== cat) : [...config.selectedCategories, cat];
              setConfig({...config, selectedCategories: next});
            }} style={{ padding: "6px 14px", borderRadius: "20px", border: "1px solid #e2e8f0", background: config.selectedCategories.includes(cat) ? "var(--accent)" : "white", color: config.selectedCategories.includes(cat) ? "white" : "black", cursor: "pointer", fontSize: "12px" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <button onClick={generateAIPlan} disabled={loading} style={{ width: "100%", padding: "14px", background: "var(--accent)", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}>
        {loading ? "Thinking..." : "Generate Full Plan ✨"}
      </button>

      {status && <p style={{ textAlign: "center", fontSize: "12px", color: "var(--muted)", marginTop: "10px" }}>{status}</p>}

      {plan && plan.map((act, i) => (
        <div key={i} style={{ marginTop: 25, padding: 20, borderRadius: 12, border: "1px solid #edf2f7", background: "#f8fafc" }}>
          <h4 style={{ color: "var(--accent)", marginTop: 0 }}>{act.title}</h4>
          <div style={{ display: "grid", gap: 10, marginBottom: 15 }}>
            <div style={{ padding: "10px", background: "#fff5f5", borderRadius: "8px", fontSize: "13px", borderLeft: "4px solid #fc8181" }}><strong>L1 (Support):</strong> {act.l1}</div>
            <div style={{ padding: "10px", background: "#f0fff4", borderRadius: "8px", fontSize: "13px", borderLeft: "4px solid #68d391" }}><strong>L2 (General):</strong> {act.l2}</div>
            <div style={{ padding: "10px", background: "#ebf8ff", borderRadius: "8px", fontSize: "13px", borderLeft: "4px solid #63b3ed" }}><strong>L3 (Challenge):</strong> {act.l3}</div>
          </div>
          <div style={{ background: "white", padding: "12px", borderRadius: "8px", border: "1px dashed #cbd5e0" }}>
            <p style={{ fontSize: "10px", fontWeight: "bold", color: "#718096", margin: "0 0 8px" }}>CANVA STEP PROMPTS:</p>
            {act.canva_prompts.map((p, idx) => (
              <button key={idx} onClick={() => { navigator.clipboard.writeText(`Simple flat doodle, high contrast: ${p}`); alert("Copied!"); }} style={{ width: "100%", textAlign: "left", padding: "8px", background: "#f7fafc", border: "1px solid #edf2f7", borderRadius: "6px", marginBottom: "5px", fontSize: "11px", cursor: "pointer" }}>
                Step {idx + 1}: {p} 📋
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
