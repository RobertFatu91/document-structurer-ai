"use client";

import { useState } from "react";

export default function Home() {

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [proUser, setProUser] = useState(false);

  const handleTransform = async () => {

    if (!input.trim()) return;

    setLoading(true);

    const res = await fetch("/api/transform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: input })
    });

    const data = await res.json();

    setOutput(data.result || "Error generating output");

    setLoading(false);
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <main style={{ maxWidth: "900px", margin: "40px auto", padding: "20px", fontFamily: "Arial" }}>

      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>
        Document Structurer AI
      </h1>

      <p style={{ marginBottom: "20px" }}>
        Turn messy notes into structured documents instantly.
      </p>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste messy notes here..."
        style={{
          width: "100%",
          height: "150px",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          marginBottom: "16px"
        }}
      />

      <button
        onClick={handleTransform}
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer"
        }}
      >
        {loading ? "Processing..." : "Transform"}
      </button>

      {output && (
        <div style={{ marginTop: "30px" }}>

          <h2>Structured Output</h2>

          <pre
            style={{
              background: "#f4f4f4",
              padding: "16px",
              borderRadius: "8px",
              whiteSpace: "pre-wrap"
            }}
          >
            {output}
          </pre>

          <button
            onClick={copyOutput}
            style={{
              marginTop: "12px",
              padding: "10px 16px",
              borderRadius: "8px",
              border: "none",
              background: "#333",
              color: "white",
              cursor: "pointer"
            }}
          >
            Copy
          </button>

        </div>
      )}

      <div style={{ marginTop: "40px" }}>

        {!proUser ? (
          <button
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "black",
              color: "white"
            }}
          >
            Upgrade to Pro — £7/month
          </button>
        ) : (
          <div style={{ color: "green", fontWeight: "bold" }}>
            Pro mode active
          </div>
        )}

      </div>

      {/* SEO INTERNAL LINKS */}

      <div style={{ marginTop: "60px" }}>

        <h2 style={{ marginBottom: "20px" }}>
          Popular use cases
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px"
          }}
        >

          <a href="/seo/ai-meeting-notes" style={cardStyle}>
            AI Meeting Notes Generator
          </a>

          <a href="/seo/organize-messy-notes" style={cardStyle}>
            Organize Messy Notes
          </a>

          <a href="/seo/convert-notes-to-report" style={cardStyle}>
            Convert Notes to Report
          </a>

          <a href="/seo/ai-notes-organizer" style={cardStyle}>
            AI Notes Organizer
          </a>

          <a href="/seo/notes-to-action-items" style={cardStyle}>
            Turn Notes Into Action Items
          </a>

          <a href="/seo/meeting-report-generator" style={cardStyle}>
            AI Meeting Report Generator
          </a>

        </div>

      </div>

    </main>
  );
}

const cardStyle = {
  textDecoration: "none",
  color: "black",
  border: "1px solid #ddd",
  padding: "16px",
  borderRadius: "8px",
  background: "#fafafa"
};