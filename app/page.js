"use client";

import { useState } from "react";
import { Document, Packer, Paragraph } from "docx";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("meeting");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function transform() {
    let count = localStorage.getItem("transformsCount");
    count = count ? parseInt(count) : 0;

    if (count >= 2) {
      alert("Free plan limit reached. Upgrade to Pro for unlimited transforms.");
      return;
    }

    try {
      setLoading(true);
      setCopied(false);

      let res;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("mode", mode);

        res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode }),
        });
      }

      const data = await res.json();
      setResult(data.result || data.error || "No result");

      count += 1;
      localStorage.setItem("transformsCount", count);
    } catch (error) {
      setResult("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  async function copyText() {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadTXT() {
    if (!result) return;

    const element = document.createElement("a");
    const fileBlob = new Blob([result], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = "structured.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  async function downloadDocx() {
    if (!result) return;

    const lines = result.split("\n");

    const doc = new Document({
      sections: [
        {
          children: lines.map((line) => new Paragraph(line)),
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "structured-document.docx";
    a.click();

    URL.revokeObjectURL(url);
  }

  function clearAll() {
    setText("");
    setResult("");
    setFile(null);
    setCopied(false);

    const input = document.getElementById("fileInput");
    if (input) input.value = "";
  }

  return (
    <div
      style={{
        maxWidth: "980px",
        margin: "auto",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: "42px", fontWeight: "700", marginBottom: "10px" }}>
        Turn messy notes into structured reports in seconds
      </h1>

      <p style={{ fontSize: "18px", color: "#555", marginBottom: "30px" }}>
        Perfect for freelancers, consultants and contractors who deal with messy
        meeting notes, client calls or raw ideas.
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
        <div
          style={{
            background: "#fff4f4",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #f1d0d0",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Before</h3>
          <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "Arial" }}>
{`meeting with client
need invoice
prepare contract
call supplier tomorrow`}
          </pre>
        </div>

        <div
          style={{
            background: "#f4fff6",
            padding: "20px",
            borderRadius: "12px",
            border: "1px solid #cfe8d4",
          }}
        >
          <h3 style={{ marginTop: 0 }}>After</h3>
          <pre style={{ whiteSpace: "pre-wrap", margin: 0, fontFamily: "Arial" }}>
{`Summary
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
        <option value="meeting">Meeting Notes</option>
        <option value="email">Professional Email</option>
        <option value="tasks">Task List</option>
        <option value="summary">Summary</option>
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

      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "10px" }}>Or upload a Word file</h2>
        <input
          id="fileInput"
          type="file"
          accept=".docx"
          onChange={(e) => setFile(e.target.files[0])}
        />
        {file && (
          <p style={{ marginTop: "10px", color: "#555" }}>
            Selected file: <strong>{file.name}</strong>
          </p>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          onClick={transform}
          disabled={loading}
          style={{
            background: "black",
            color: "white",
            padding: "10px 20px",
            border: "none",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          {loading ? "Working..." : "Transform"}
        </button>

        <button
          onClick={copyText}
          disabled={!result}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>

        <button
          onClick={downloadTXT}
          disabled={!result}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          Download TXT
        </button>

        <button
          onClick={downloadDocx}
          disabled={!result}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          Download Word
        </button>

        <button
          onClick={clearAll}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            borderRadius: "8px",
          }}
        >
          Clear
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
        <h2 style={{ marginTop: 0 }}>Pricing</h2>
        <p style={{ marginBottom: "10px" }}>
          <strong>Free:</strong> 2 transforms total
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Pro:</strong> £7 / month — unlimited transforms, exports and advanced use
        </p>
      </div>
    </div>
  );
}