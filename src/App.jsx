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
        <div style={{ background: result.error ? "#fef2f2" : "var(--card)", borderRadius: 16, padding: 24, border: `1px solid ${result.error ? "#fecaca" : "var(--border)"}`, animation: "fadeIn .3s" }}>
          {result.error ? (
            <p style={{ color: "#ef4444", margin: 0, fontWeight: 600 }}>⚠️ {result.error}</p>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ background: "var(--accent)", color: "#fff", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>{result.category}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "var(--accent)" }}>S${result.amount.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "10px 14px", background: s.startsWith("🚨") ? "#fef2f2" : "var(--bg)", borderRadius: 10, fontSize: 14, lineHeight: 1.5, border: s.startsWith("🚨") ? "1px solid #fecaca" : "none" }}>
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
// CLAIM FORM
// ─────────────────────────────────────────────────────────
function ClaimForm() {
  const [tab, setTab] = useState("form");
  const [claimType, setClaimType] = useState("claim");
  const [submitter, setSubmitter] = useState({ name: "", dept: "CSS - MYG", date: "", purpose: "", project: "", resource: "", budget: "", bankName: "", bankCode: "", accountName: "", accountNo: "", email: "" });
  const [items, setItems] = useState([{ id: generateId(), date: "", desc: "", project: "", resource: "", beforeGST: "", gst: "" }]);
  const [receipts, setReceipts] = useState([]);
  const fileRef = useRef();

  const totalBeforeGST = items.reduce((s, i) => s + (parseFloat(i.beforeGST) || 0), 0);
  const totalGST = items.reduce((s, i) => s + (parseFloat(i.gst) || 0), 0);
  const totalClaim = totalBeforeGST + totalGST;

  function addItem() {
    setItems(p => [...p, { id: generateId(), date: "", desc: "", project: "", resource: "", beforeGST: "", gst: "" }]);
  }

  function updateItem(id, field, val) {
    setItems(p => p.map(i => i.id === id ? { ...i, [field]: val } : i));
  }

  function removeItem(id) {
    setItems(p => p.filter(i => i.id !== id));
  }

  function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => {
        setReceipts(prev => [...prev, { id: generateId(), name: f.name, src: ev.target.result, type: f.type }]);
      };
      reader.readAsDataURL(f);
    });
  }

  function removeReceipt(id) {
    setReceipts(p => p.filter(r => r.id !== id));
  }

  const overLimit = totalClaim > 500 && claimType === "claim";

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {[["form","📝 Fill Form"],["receipts",`📷 Receipts (${receipts.length})`],["preview","👁 Preview"]].map(([v,l]) => (
          <button key={v} onClick={() => setTab(v)} style={{
            padding: "9px 18px", borderRadius: 10, border: `2px solid ${tab===v?"var(--accent)":"var(--border)"}`,
            background: tab===v ? "var(--accent)" : "var(--card)", color: tab===v ? "#fff" : "var(--text)",
            cursor: "pointer", fontWeight: 700, fontSize: 14
          }}>{l}</button>
        ))}
      </div>

      {tab === "form" && (
        <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, border: "1px solid var(--border)" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
            {[["claim","Claim Form (CAF)"],["petty","Petty Cash Voucher (PCV)"]].map(([v,l]) => (
              <button key={v} onClick={() => setClaimType(v)} style={{
                flex: 1, padding: "10px 0", borderRadius: 10, border: `2px solid ${claimType===v?"var(--accent)":"var(--border)"}`,
                background: claimType===v ? "var(--accent)" : "var(--card)", color: claimType===v ? "#fff" : "var(--text)",
                cursor: "pointer", fontWeight: 700, fontSize: 14
              }}>{l}</button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            {[
              ["Name / Submitted by", "name", "text"],
              ["Date", "date", "date"],
              ["Purpose", "purpose", "text"],
              ["Budget to utilise", "budget", "text"],
            ].map(([label, field, type]) => (
              <div key={field}>
                <label style={{ display: "block", marginBottom: 5, fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{label}</label>
                <input type={type} value={submitter[field]} onChange={e => setSubmitter(p => ({...p,[field]:e.target.value}))}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1.5px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, boxSizing: "border-box" }} />
              </div>
            ))}
            {claimType === "claim" && (
              <>
                {[["Bank Name & Branch","bankName"],["Bank Code & Branch Code","bankCode"],["Account Name","accountName"],["Account Number","accountNo"],["Email","email"]].map(([label, field]) => (
                  <div key={field}>
                    <label style={{ display: "block", marginBottom: 5, fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>{label}</label>
                    <input type="text" value={submitter[field]} onChange={e => setSubmitter(p => ({...p,[field]:e.target.value}))}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1.5px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 14, boxSizing: "border-box" }} />
                  </div>
                ))}
              </>
            )}
          </div>

          <h4 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Line Items</h4>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  {["Date","Description","Project","Resource","Before GST ($)","GST ($)","Total ($)",""].map(h => (
                    <th key={h} style={{ padding: "8px 10px", textAlign: "left", color: "var(--muted)", fontWeight: 700, whiteSpace: "nowrap", borderBottom: "2px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "6px 6px" }}><input type="date" value={item.date} onChange={e => updateItem(item.id,"date",e.target.value)} style={{ width: 120, padding: "6px 8px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 12 }} /></td>
                    <td style={{ padding: "6px 6px" }}><input type="text" value={item.desc} onChange={e => updateItem(item.id,"desc",e.target.value)} placeholder="Item description" style={{ width: 160, padding: "6px 8px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 12 }} /></td>
                    <td style={{ padding: "6px 6px" }}><input type="text" value={item.project} onChange={e => updateItem(item.id,"project",e.target.value)} style={{ width: 100, padding: "6px 8px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 12 }} /></td>
                    <td style={{ padding: "6px 6px" }}><input type="text" value={item.resource} onChange={e => updateItem(item.id,"resource",e.target.value)} style={{ width: 100, padding: "6px 8px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 12 }} /></td>
                    <td style={{ padding: "6px 6px" }}><input type="number" value={item.beforeGST} onChange={e => updateItem(item.id,"beforeGST",e.target.value)} placeholder="0.00" min="0" step="0.01" style={{ width: 90, padding: "6px 8px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 12 }} /></td>
                    <td style={{ padding: "6px 6px" }}><input type="number" value={item.gst} onChange={e => updateItem(item.id,"gst",e.target.value)} placeholder="0.00" min="0" step="0.01" style={{ width: 80, padding: "6px 8px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)", fontSize: 12 }} /></td>
                    <td style={{ padding: "6px 10px", fontWeight: 700, color: "var(--accent)" }}>
                      ${((parseFloat(item.beforeGST)||0) + (parseFloat(item.gst)||0)).toFixed(2)}
                    </td>
                    <td style={{ padding: "6px 6px" }}>
                      {items.length > 1 && <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16, padding: "2px 6px" }}>✕</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "var(--bg)", fontWeight: 700 }}>
                  <td colSpan={4} style={{ padding: "10px 10px", textAlign: "right", color: "var(--muted)", fontSize: 13 }}>TOTAL</td>
                  <td style={{ padding: "10px 10px", color: "var(--text)" }}>${totalBeforeGST.toFixed(2)}</td>
                  <td style={{ padding: "10px 10px", color: "var(--text)" }}>${totalGST.toFixed(2)}</td>
                  <td style={{ padding: "10px 10px", color: "var(--accent)", fontSize: 15 }}>${totalClaim.toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {overLimit && (
            <div style={{ marginTop: 14, padding: "12px 16px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca", fontSize: 14, color: "#ef4444" }}>
              ⚠️ Total exceeds $500 — claims above $500 require CEO's approval. Consider using an Invoice instead.
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button onClick={addItem} style={{ padding: "10px 20px", borderRadius: 10, border: "2px dashed var(--border)", background: "var(--bg)", color: "var(--muted)", cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
              + Add Line Item
            </button>
            <button onClick={() => setTab("receipts")} style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
              Next: Attach Receipts →
            </button>
          </div>
        </div>
      )}

      {tab === "receipts" && (
        <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, border: "1px solid var(--border)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontFamily: "Fraunces, serif", color: "var(--accent)" }}>Attach Receipts</h3>
          <div
            onClick={() => fileRef.current.click()}
            style={{ border: "2.5px dashed var(--border)", borderRadius: 14, padding: 40, textAlign: "center", cursor: "pointer", marginBottom: 20, transition: "border-color .2s" }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>📎</div>
            <p style={{ margin: 0, fontWeight: 600, color: "var(--muted)" }}>Click to upload receipt images or PDFs</p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--muted)" }}>JPG, PNG, PDF supported</p>
            <input ref={fileRef} type="file" multiple accept="image/*,application/pdf" style={{ display: "none" }} onChange={handleFileUpload} />
          </div>

          {receipts.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 14 }}>
              {receipts.map(r => (
                <div key={r.id} style={{ background: "var(--bg)", borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", position: "relative" }}>
                  {r.type.startsWith("image") ? (
                    <img src={r.src} alt={r.name} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>📄</div>
                  )}
                  <div style={{ padding: "8px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120 }}>{r.name}</span>
                    <button onClick={() => removeReceipt(r.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "2px 4px", fontSize: 14 }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "preview" && (
        <div style={{ background: "var(--card)", borderRadius: 16, padding: 28, border: "1px solid var(--border)", fontFamily: "monospace", fontSize: 13 }}>
          <div style={{ borderBottom: "3px solid var(--accent)", paddingBottom: 16, marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontFamily: "Fraunces, serif", fontSize: 22 }}>MINDSG LTD</h2>
            <p style={{ margin: "4px 0 0", fontWeight: 700, color: "var(--muted)" }}>{claimType === "petty" ? "PETTY CASH VOUCHER" : "CLAIM / CASH ADVANCE FORM"}</p>
          </div>
          <button onClick={() => window.print()} style={{ marginTop: 20, padding: "11px 24px", borderRadius: 10, border: "none", background: "var(--accent)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
            🖨️ Print / Save as PDF
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AOR FORM
// ─────────────────────────────────────────────────────────
function AORForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    date: "", purpose: "", approver: "", cost: "", dept: "", budgeted: "Yes",
    items: [{ id: generateId(), item: "", cost: "", remarks: "" }],
  });

  const set = (field, val) => setData(p => ({...p, [field]: val}));
  const totalCost = data.items.reduce((s, i) => s + (parseFloat(i.cost)||0), 0);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", background: "var(--card)", padding: 28, borderRadius: 16, border: "1px solid var(--border)" }}>
      <h3 style={{ fontFamily: "Fraunces, serif", color: "var(--accent)" }}>Approval of Requirement (AOR)</h3>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 700 }}>PURPOSE</label>
        <input value={data.purpose} onChange={e => set("purpose", e.target.value)} style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid var(--border)" }} />
      </div>
      {/* Shortened for brevity in this fix example */}
      <p>Estimate Total: ${totalCost.toFixed(2)}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// LESSON PLANNER
// ─────────────────────────────────────────────────────────
function LessonPlanner() {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState(null);

  async function generatePlan() {
    setGenerating(true);
    // Note: Calling APIs directly from client side is not recommended for production.
    setTimeout(() => {
      setPlan({ title: "Sample Plan", activities: [] });
      setGenerating(false);
    }, 1000);
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", background: "var(--card)", padding: 28, borderRadius: 16, border: "1px solid var(--border)" }}>
      <h3 style={{ fontFamily: "Fraunces, serif", color: "var(--accent)" }}>Lesson Planner</h3>
      <button onClick={generatePlan} style={{ background: "var(--accent)", color: "#fff", padding: "10px 20px", border: "none", borderRadius: 8 }}>
        {generating ? "Generating..." : "Generate Plan"}
      </button>
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
        <a key={link.id} href={link.url} style={{ display: "block", padding: 16, background: "var(--card)", marginBottom: 8, borderRadius: 12, border: "1px solid var(--border)", textDecoration: "none", color: "var(--text)" }}>
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
  const [links, setLinks] = useState(DEFAULT_LINKS);
  const [adminMode, setAdminMode] = useState(false);
  const [dark, setDark] = useState(false);

  const cssVars = dark ? {
    "--bg": "#111827", "--card": "#1f2937", "--border": "#374151",
    "--text": "#f9fafb", "--muted": "#9ca3af", "--accent": "#10b981",
    "--accent-soft": "#064e3b",
  } : {
    "--bg": "#f0fdf4", "--card": "#ffffff", "--border": "#d1fae5",
    "--text": "#111827", "--muted": "#6b7280", "--accent": "#059669",
    "--accent-soft": "#d1fae5",
  };

  return (
    <div style={{ ...cssVars, minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "DM Sans, sans-serif" }}>
      <header style={{ background: "var(--accent)", color: "#fff", padding: 20 }}>
        <h1>MINDS MYG</h1>
      </header>
      <nav style={{ display: "flex", gap: 10, padding: 20 }}>
        {["links", "finance", "aor", "lesson"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: 10 }}>{t.toUpperCase()}</button>
        ))}
      </nav>
      <main style={{ padding: 20 }}>
        {activeTab === "links" && <LinksPage links={links} />}
        {activeTab === "finance" && <FinanceChecker />}
        {activeTab === "aor" && <AORForm />}
        {activeTab === "lesson" && <LessonPlanner />}
      </main>
    </div>
  );
}