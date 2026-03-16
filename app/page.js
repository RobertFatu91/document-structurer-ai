"use client";

import { useMemo, useState } from "react";
import { seoKeywords } from "../data/seoKeywords";
import jsPDF from "jspdf";
import { Document, Packer, Paragraph } from "docx";

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

    setOutput(structured.trim());
  };

  function copyToClipboard() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    alert("Copied to clipboard");
  }

  function downloadTXT() {
    if (!output) return;

    const fileBlob = new Blob([output], { type: "text/plain" });
    const element = document.createElement("a");
    element.href = URL.createObjectURL(fileBlob);
    element.download = "structured.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function downloadPDF() {
    if (!output) return;

    const doc = new jsPDF();
    const lines = doc.splitTextToSize(output, 180);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(lines, 15, 20);
    doc.save("structured-document.pdf");
  }

  async function downloadDocx() {
    if (!output) return;

    const lines = output.split("\n");

    const doc = new Document({
      sections: [
        {
          children: lines.map((line) => new Paragraph(line))
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    const element = document.createElement("a");
    element.href = URL.createObjectURL(blob);
    element.download = "structured-document.docx";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

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
        <div style={{ marginTop: "20px" }}>
          <h2 style={{ marginBottom: "12px" }}>Structured Output</h2>

          <pre
            style={{
              background: "#f5f5f5",
              padding: "16px",
              borderRadius: "6px",
              whiteSpace: "pre-wrap",
              marginBottom: "16px"
            }}
          >
            {output}
          </pre>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px"
            }}
          >
            <button
              onClick={copyToClipboard}
              style={actionButtonStyle}
            >
              Copy
            </button>

            <button
              onClick={downloadTXT}
              style={actionButtonStyle}
            >
              Download TXT
            </button>

            <button
              onClick={downloadPDF}
              style={actionButtonStyle}
            >
              Download PDF
            </button>

            <button
              onClick={downloadDocx}
              style={actionButtonStyle}
            >
              Download Word
            </button>
          </div>
        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        {!proMode ? (
          <button
            onClick={() => setProMode(true)}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#f2f2f2"
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

const actionButtonStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  background: "black",
  color: "white"
};