import { useState, useRef, useEffect, useCallback } from "react";

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
  { id: "craft", label: "Craft", outline: "Focus on fine motor skills using recycled materials or seasonal themes." },
  { id: "numeracy", label: "Numeracy", outline: "Sorting objects by color/size and basic counting exercises up to 10." },
  { id: "physical", label: "Physical Activity", outline: "Low-impact exercises like balloon tossing, stretching, or seated yoga." },
  { id: "horticulture", label: "Horticulture", outline: "Sensory engagement with soil, seeds, and watering indoor plants." },
  { id: "music", label: "Music", outline: "Rhythm recognition using hand percussion and singing familiar songs." },
  { id: "cooking", label: "Cooking / Baking", outline: "Non-heat activities like sandwich making or decorating cupcakes." },
  { id: "literacy", label: "Literacy", outline: "Visual storytelling with picture cards and word-association games." },
  { id: "sensory", label: "Sensory Play", outline: "Engaging tactile senses with sand, slime, or textured fabrics." },
  { id: "social", label: "Social Skills", outline: "Role-playing turn-taking, greetings, and cooperative group games." },
  { id: "drama", label: "Drama / Role Play", outline: "Using props to act out daily scenarios like grocery shopping." },
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
    let methodAdvice = "";

    if (amt < 500) {
      category = "Claims (<$500)";
      methodAdvice = "💳 PAYMENT MODE: Cash, Debit, or NETS only.";
      steps = [
        "✅ Pay out of pocket using Cash, Debit, or NETS.",
        "🚨 STRICTLY NO credit card payments (Claims will be rejected).",
        "📋 Fill in the Claim Form and attach ALL receipts to the same form.",
        "📁 Submit the completed claim form into the submissions folder.",
        "⚠️ Max claim: $500 per person per month.",
        paymentMethod === "credit" ? "🚨 ALERT: You selected Credit Card—this payment is NOT allowed!" : "",
      ].filter(Boolean);
    } else if (amt <= 3000) {
      category = source === "budget" ? "Invoices ($500–$3000)" : "Invoices from Donations ($500–$3000)";
      methodAdvice = "🧾 PAYMENT MODE: Vendor Bills MINDS (30-day Credit).";
      steps = [
        "📝 Bill to: MINDSG LTD, 11 Jalan Ubi, Block 3 #01-21 (Level 2), Singapore 409074.",
        "📄 Ask vendor for an Account Opening Form if they are new.",
        "📁 Submit invoice + Account Opening Form in the invoice folder.",
        "💰 Payment: By 15th (if submitted by 2nd) or 30th (if submitted by 17th).",
        source === "donation" ? "📧 Inform donation@minds.org.sg of the designation to MYG." : "",
      ].filter(Boolean);
    } else {
      category = source === "budget" ? "Quotations (>$3000)" : "Quotations from Donations (>$3000)";
      methodAdvice = "🏦 PAYMENT MODE: Bank Transfer / Corporate Cheque.";
      steps = [
        "⏰ Start at least 3 months before the event.",
        "✉️ Staff must get CSS Director or Finance Director + CEO approval.",
        "📋 Staff issues an Invitation to Quote (ITQ) for vendor bidding.",
        "🤝 Project team selects the vendor based on the 3 quotes received.",
        "⚠️ If only 1 vendor exists, an extra week for 'Direct Contracting' approval is needed.",
      ].filter(Boolean);
    }
    setResult({ category, steps, amount: amt, methodAdvice });
  }

  return (
    <div style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, marginBottom: 20, border: "1px solid var(--border)" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 18, fontFamily: "Fraunces, serif", color: "var(--accent)" }}>Finance Rules Checker</h3>
        
        <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>PURCHASE AMOUNT (SGD)</label>
        <input
          type="number" value={amount} onChange={e => setAmount(e.target.value)}
          placeholder="0.00" min="0" step="0.01"
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 16, marginBottom: 16, boxSizing: "border-box" }}
        />

        <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>FUNDING SOURCE</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[["budget","MINDS MYG Budget"],["donation","Donations"]].map(([v,l]) => (
            <button key={v} onClick={() => setSource(v)} style={{
              flex: 1, padding: "10px 0", borderRadius: 10, border: `2px solid ${source===v?"var(--accent)":"var(--border)"}`,
              background: source===v ? "var(--accent)" : "var(--card)", color: source===v ? "#fff" : "var(--text)",
              cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all .2s"
            }}>{l}</button>
          ))}
        </div>

        <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--muted)" }}>PAYMENT METHOD</label>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          {[["cash","Cash"],["debit","Debit/NETS"],["credit","Credit Card ⚠️"]].map(([v,l]) => (
            <button key={v} onClick={() => setPaymentMethod(v)} style={{
              flex: 1, minWidth: 100, padding: "9px 0", borderRadius: 10,
              border: `2px solid ${paymentMethod===v?(v==="credit"?"#ef4444":"var(--accent)"):"var(--border)"}`,
              background: paymentMethod===v?(v==="credit"?"#ef444422":"var(--accent-soft)"):"var(--card)",
              color: paymentMethod===v?(v==="credit"?"#ef4444":"var(--accent)"):"var(--muted)",
              cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all .2s"
            }}>{l}</button>
          ))}
        </div>

        <button onClick={check} style={{
          width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
          background: "var(--accent)", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer",
          fontFamily: "Fraunces, serif", letterSpacing: ".3px"
        }}>Check Finance Rules →</button>
      </div>

      {result && (
        <div style={{ background: result.error ? "#fef2f2" : "var(--card)", borderRadius: 16, padding: 24, border: `1px solid ${result.error ? "#fecaca" : "var(--border)"}` }}>
          {result.error ? (
            <p style={{ color: "#ef4444", margin: 0, fontWeight: 600 }}>⚠️ {result.error}</p>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ background: "var(--accent)", color: "#fff", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>{result.category}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>S${result.amount.toFixed(2)}</span>
              </div>
              <p style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>{result.methodAdvice}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: s.includes("🚨") ? "#fef2f2" : "var(--bg)", borderRadius: 10, fontSize: 14, lineHeight: 1.5 }}>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AOR FORM
// ─────────────────────────────────────────────────────────
function AORForm() {
  const [data, setData] = useState({
    date: "", purpose: "", approver: "", dept: "CSS - MYG", budgeted: "Yes",
    items: [{ id: generateId(), item: "", cost: "", remarks: "" }],
  });

  const set = (field, val) => setData(p => ({...p, [field]: val}));
  const totalCost = data.items.reduce((s, i) => s + (parseFloat(i.cost)||0), 0);

  function addItem() {
    setData(p => ({ ...p, items: [...p.items, { id: generateId(), item: "", cost: "", remarks: "" }] }));
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", background: "var(--card)", padding: 28, borderRadius: 16, border: "1px solid var(--border)" }}>
      <h3 style={{ fontFamily: "Fraunces, serif", color: "var(--accent)", marginTop: 0 }}>Approval of Requirement (AOR)</h3>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15, marginBottom: 20 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>PURPOSE OF EXPENDITURE</label>
          <input value={data.purpose} onChange={e => set("purpose", e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>DEPARTMENT</label>
          <input value={data.dept} disabled style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--border)", background: "var(--border)", color: "var(--text)" }} />
        </div>
      </div>

      <table style={{ width: "100%", marginBottom: 15 }}>
        <thead>
          <tr style={{ textAlign: "left", fontSize: 12, color: "var(--muted)" }}>
            <th>Item / Activity</th>
            <th>Est. Cost ($)</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map(item => (
            <tr key={item.id}>
              <td><input style={{ width: "95%", padding: 8, marginBottom: 5 }} placeholder="Description" /></td>
              <td><input style={{ width: "100%", padding: 8, marginBottom: 5 }} type="number" onChange={(e) => {
                const newItems = data.items.map(i => i.id === item.id ? {...i, cost: e.target.value} : i);
                setData(p => ({...p, items: newItems}));
              }} /></td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem} style={{ background: "none", border: "1.5px dashed var(--border)", width: "100%", padding: 10, borderRadius: 8, cursor: "pointer", color: "var(--muted)" }}>+ Add Item</button>
      
      <div style={{ marginTop: 20, padding: 15, background: "var(--accent-soft)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700 }}>Total Estimated Cost:</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "var(--accent)" }}>${totalCost.toFixed(2)}</span>
      </div>

      <button onClick={() => window.print()} className="btn" style={{ width: "100%", marginTop: 15, padding: 12, background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Print AOR for Approval</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LESSON PLANNER
// ─────────────────────────────────────────────────────────
function LessonPlanner() {
  const [selectedType, setSelectedType] = useState("");

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", background: "var(--card)", padding: 28, borderRadius: 16, border: "1px solid var(--border)" }}>
      <h3 style={{ fontFamily: "Fraunces, serif", color: "var(--accent)", marginTop: 0 }}>Lesson Planner</h3>
      <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 20 }}>Select an activity type to see the session outline for trainees.</p>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 25 }}>
        {ACTIVITY_TYPES.map(type => (
          <button 
            key={type.id} 
            onClick={() => setSelectedType(type)}
            style={{
              padding: "15px 10px", borderRadius: 12, border: `2px solid ${selectedType.id === type.id ? "var(--accent)" : "var(--border)"}`,
              background: selectedType.id === type.id ? "var(--accent-soft)" : "var(--card)", cursor: "pointer", textAlign: "center"
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 5 }}>{type.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{type.label}</div>
          </button>
        ))}
      </div>

      {selectedType && (
        <div style={{ padding: 20, background: "var(--bg)", borderRadius: 12, borderLeft: "4px solid var(--accent)" }}>
          <h4 style={{ margin: "0 0 10px" }}>{selectedType.icon} {selectedType.label} Outline</h4>
          <p style={{ lineHeight: 1.6, fontSize: 14 }}>{selectedType.outline}</p>
          <div style={{ marginTop: 15, fontSize: 12, color: "var(--muted)" }}>
            <strong>Suggested Materials:</strong> Glue, scissors, safety paper, and visual aids.
          </div>
        </div>
      )}
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
        <a key={link.id} href={link.url} target="_blank" rel="noreferrer" style={{ display: "block", padding: 16, background: "var(--card)", marginBottom: 8, borderRadius: 12, border: "1px solid var(--border)", textDecoration: "none", color: "var(--text)", transition: "transform 0.1s" }}>
          <span style={{ marginRight: 10 }}>{link.emoji}</span> {link.label}
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
  const [dark] = useState(false);

  const cssVars = dark ? {
    "--bg": "#111827", "--card": "#1f2937", "--border": "#374151",
    "--text": "#f9fafb", "--muted": "#9ca3af", "--accent": "#10b981",
    "--accent-soft": "#064e3b",
  } : {
    "--bg": "#f0fdf4", "--card": "#ffffff", "--border": "#d1fae5",
    "--text": "#111827", "--muted": "#6b7280", "--accent": "#059669",
    "--accent-soft": "#d1fae5",
  };

  const navItems = [
    { id: "links", label: "Links" },
    { id: "finance", label: "Finance" },
    { id: "aor", label: "AOR Form" },
    { id: "lesson", label: "Lesson Planner" }
  ];

  return (
    <div style={{ ...cssVars, minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "DM Sans, sans-serif" }}>
      <header style={{ background: "var(--accent)", color: "#fff", padding: "30px 20px", textAlign: "center" }}>
        <h1 style={{ margin: 0, fontFamily: "Fraunces, serif" }}>MINDS MYG Operations</h1>
      </header>
      
      <nav style={{ display: "flex", justifyContent: "center", gap: 10, padding: "20px", flexWrap: "wrap" }}>
        {navItems.map(item => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)} 
            style={{ 
              padding: "10px 20px", borderRadius: 20, border: "none",
              background: activeTab === item.id ? "var(--accent)" : "var(--card)",
              color: activeTab === item.id ? "#fff" : "var(--text)",
              fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <main style={{ padding: "0 20px 40px" }}>
        {activeTab === "links" && <LinksPage links={links} />}
        {activeTab === "finance" && <FinanceChecker />}
        {activeTab === "aor" && <AORForm />}
        {activeTab === "lesson" && <LessonPlanner />}
      </main>
    </div>
  );
}
