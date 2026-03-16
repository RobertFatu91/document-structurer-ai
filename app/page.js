"use client";

import { useMemo, useState } from "react";
import { seoKeywords } from "../data/seoKeywords";

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [proMode, setProMode] = useState(false);

  const featuredSeoPages = useMemo(() => {
    return seoKeywords.slice(0, 12);
  }, []);

  const handleGenerate = () => {
    if (!input.trim()) return;

    const structured = `
SUMMARY
${input.slice(0, 120)}...

KEY POINTS
* Main topic identified
* Important information extracted
* Notes structured into sections

ACTION ITEMS
* Review summary
* Share with team
* Follow up on tasks
`;

    setOutput(structured);
  };

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Document Structurer AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "AI tool that turns messy notes into structured summaries, reports and action items.",
    url: "https://document-structurer-ai.vercel.app",
    offers: {
      "@type": "Offer",
      price: "7",
      priceCurrency: "GBP"
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        fontFamily: "Arial",
        padding: "20px"
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
        Document Structurer AI
      </h1>

      <p style={{ fontSize: "18px", marginBottom: "30px" }}>
        Turn messy notes into structured summaries, key points and action items instantly.
      </p>

      <textarea
        placeholder="Paste messy notes here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "100%",
          height: "160px",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "16px"
        }}
      />

      <button
        onClick={handleGenerate}
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          marginBottom: "20px"
        }}
      >
        Generate Structure
      </button>

      {output && (
        <pre
          style={{
            background: "#f5f5f5",
            padding: "16px",
            borderRadius: "6px",
            whiteSpace: "pre-wrap"
          }}
        >
          {output}
        </pre>
      )}

      <div style={{ marginTop: "40px" }}>
        {!proMode ? (
          <button
            onClick={() => setProMode(true)}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer"
            }}
          >
            Upgrade to Pro – £7/month
          </button>
        ) : (
          <div style={{ color: "green", fontWeight: "bold" }}>
            Pro mode active
          </div>
        )}
      </div>

      <div style={{ marginTop: "60px" }}>
        <h2 style={{ marginBottom: "16px" }}>Popular AI note tools</h2>

        <p style={{ marginBottom: "18px", lineHeight: "1.6", color: "#444" }}>
          Explore common use cases for turning messy notes into structured summaries,
          reports, follow-ups and action items.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px"
          }}
        >
          {featuredSeoPages.map((slug) => (
            <a
              key={slug}
              href={`/seo/${slug}`}
              style={{
                textDecoration: "none",
                color: "black",
                border: "1px solid #ddd",
                padding: "14px",
                borderRadius: "8px",
                background: "#fafafa"
              }}
            >
              {slugToTitle(slug)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}