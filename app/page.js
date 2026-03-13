"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("Meeting Notes");

  async function transform() {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mode }),
    });

    const data = await res.json();
    setResult(data.result);
  }

  function downloadTXT() {
    const element = document.createElement("a");
    const file = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "structured.txt";
    document.body.appendChild(element);
    element.click();
  }

  function copyText() {
    navigator.clipboard.writeText(result);
  }

  return (
    <div style={{ maxWidth: "980px", margin: "auto", padding: "40px", fontFamily: "Arial" }}>
      <h1 style={{ fontSize: "42px", fontWeight: "700", marginBottom: "10px" }}>
        Turn messy notes into structured reports in seconds
      </h1>

      <p style={{ fontSize: "18px", color: "#555", marginBottom: "30px" }}>
        Perfect for freelancers, consultants and contractors who deal with messy meeting notes, client calls or raw ideas.
      </p>

      <div style={{ display: "flex", gap: "25px", marginBottom: "40px", flexWrap: "wrap" }}>
        <div>⚡ Turn messy notes into structured reports</div>
        <div>📋 Extract action items automatically</div>
        <div>✉ Convert notes into professional emails</div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div style={{ background: "#fff4f4", padding: "20px", borderRadius: "12px", border: "1px solid #f1d0d0" }}>
          <h3 style={{ marginTop: 0 }}>Before</h3>
          <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "Arial" }}>
{`meeting with client
need invoice
prepare contract
call supplier tomorrow`}
          </pre>
        </div>

        <div style={{ background: "#f4fff6", padding: "20px", borderRadius: "12px", border: "1px solid #cfe8d4" }}>
          <h3 style={{ marginTop: 0 }}>After</h3>
          <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "Arial" }}>
{`Meeting Report

Summary
- Follow-up meeting with client regarding next steps.

Key Points
- Invoice needs to be prepared
- Contract needs to be prepared
- Supplier call is scheduled for tomorrow

Action Items
- Send invoice
- Prepare contract
- Call supplier tomorrow

Deadlines
- Supplier call tomorrow

Decisions
- None`}
          </pre>
        </div>
      </div>

      <h2 style={{ marginBottom: "10px" }}>Mode</h2>

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        style={{ padding: "10px", marginBottom: "20px", width: "100%", maxWidth: "320px" }}
      >
        <option>Meeting Notes</option>
        <option>Professional Email</option>
        <option>Task List</option>
        <option>Summary</option>
      </select>

      <h2>Paste text</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="meeting with client
need invoice
prepare contract
call supplier tomorrow"
        style={{
          width: "100%",
          height: "150px",
          padding: "10px",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      />

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={transform}
          style={{
            background: "black",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          Transform
        </button>

        <button
          onClick={copyText}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          Copy
        </button>

        <button
          onClick={downloadTXT}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          Download TXT
        </button>
      </div>

      <h2 style={{ marginTop: "40px" }}>Result</h2>

      <pre
        style={{
          background: "#f4f4f4",
          padding: "20px",
          whiteSpace: "pre-wrap",
          marginTop: "10px",
          borderRadius: "12px",
        }}
      >
        {result || "Your structured result will appear here."}
      </pre>

      <div style={{ marginTop: "50px", padding: "25px", background: "#f8f8f8", borderRadius: "12px" }}>
        <h2 style={{ marginTop: 0 }}>Coming soon</h2>
        <p style={{ marginBottom: 0 }}>
          Free plan with limited transforms and a Pro plan for unlimited usage, exports and advanced modes.
        </p>
      </div>
    </div>
  );
}