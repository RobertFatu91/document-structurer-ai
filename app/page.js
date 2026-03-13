"use client"

import { useState } from "react"
import { Document, Packer, Paragraph } from "docx"

export default function Home() {
  const [text, setText] = useState("")
  const [result, setResult] = useState("")
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mode, setMode] = useState("meeting")

  async function transformText() {
    try {
      setLoading(true)
      setCopied(false)

      let response

      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("mode", mode)

        response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        })
      } else {
        response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ text, mode })
        })
      }

      const data = await response.json()
      setResult(data.result || data.error || "No result")
    } catch (error) {
      setResult("Error: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  async function copyResult() {
    if (!result) return
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadTxt() {
    if (!result) return

    const blob = new Blob([result], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "document-structured-result.txt"
    a.click()

    URL.revokeObjectURL(url)
  }

  async function downloadDocx() {
    if (!result) return

    const lines = result.split("\n")

    const doc = new Document({
      sections: [
        {
          children: lines.map((line) => new Paragraph(line))
        }
      ]
    })

    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "structured-document.docx"
    a.click()

    URL.revokeObjectURL(url)
  }

  function clearAll() {
    setText("")
    setResult("")
    setFile(null)
    setCopied(false)

    const input = document.getElementById("fileInput")
    if (input) input.value = ""
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f7fb",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 16,
          padding: 30,
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginBottom: 8, fontSize: 36 }}>Document Structurer AI</h1>
        <p style={{ color: "#555", marginBottom: 24 }}>
          Turn messy text or Word documents into structured meeting notes, tasks,
          summaries, or professional emails.
        </p>

        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
          Mode
        </label>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{
            padding: 12,
            marginBottom: 20,
            width: "100%",
            borderRadius: 10,
            border: "1px solid #ccc",
            fontSize: 15,
          }}
        >
          <option value="meeting">Meeting Notes</option>
          <option value="tasks">Task List</option>
          <option value="email">Professional Email</option>
          <option value="summary">Structured Summary</option>
        </select>

        <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
          Paste text
        </label>

        <textarea
          rows="10"
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 12,
            border: "1px solid #ccc",
            fontSize: 15,
            resize: "vertical",
          }}
          placeholder="Paste messy text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div style={{ marginTop: 20 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}>
            Or upload a Word file
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".docx"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && (
            <p style={{ marginTop: 8, color: "#444" }}>
              Selected file: <strong>{file.name}</strong>
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: 24,
          }}
        >
          <button
            onClick={transformText}
            disabled={loading}
            style={{
              padding: "12px 18px",
              cursor: "pointer",
              borderRadius: 10,
              border: "none",
              background: "#111827",
              color: "white",
              fontWeight: "bold",
            }}
          >
            {loading ? "Working..." : "Transform"}
          </button>

          <button
            onClick={copyResult}
            disabled={!result}
            style={{
              padding: "12px 18px",
              cursor: "pointer",
              borderRadius: 10,
              border: "1px solid #ccc",
              background: "#fff",
            }}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          <button
            onClick={downloadTxt}
            disabled={!result}
            style={{
              padding: "12px 18px",
              cursor: "pointer",
              borderRadius: 10,
              border: "1px solid #ccc",
              background: "#fff",
            }}
          >
            Download TXT
          </button>

          <button
            onClick={downloadDocx}
            disabled={!result}
            style={{
              padding: "12px 18px",
              cursor: "pointer",
              borderRadius: 10,
              border: "1px solid #ccc",
              background: "#fff",
            }}
          >
            Download Word
          </button>

          <button
            onClick={clearAll}
            style={{
              padding: "12px 18px",
              cursor: "pointer",
              borderRadius: 10,
              border: "1px solid #ef4444",
              background: "#fff5f5",
              color: "#b91c1c",
            }}
          >
            Clear
          </button>
        </div>

        <div
          style={{
            marginTop: 30,
            background: "#f9fafb",
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <h3 style={{ marginTop: 0 }}>Result</h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              margin: 0,
              fontFamily: "Arial, sans-serif",
              lineHeight: 1.6,
            }}
          >
            {result || "Your structured result will appear here."}
          </pre>
        </div>
      </div>
    </main>
  )
}