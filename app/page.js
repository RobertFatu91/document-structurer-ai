"use client";

import { useEffect, useMemo, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import jsPDF from "jspdf";

export default function Home() {
  const { data: session, status } = useSession();
  const [upgradeMessage, setUpgradeMessage] = useState("");

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("notes");
  const [savingToNotion, setSavingToNotion] = useState(false);
  const [detectedMode, setDetectedMode] = useState("");
  const detectMode = (text) => {
  const lower = text.toLowerCase();

  if (
    lower.includes("dear ") ||
    lower.includes("hi ") ||
    lower.includes("hello ") ||
    lower.includes("regards") ||
    lower.includes("kind regards") ||
    lower.includes("subject:")
  ) {
    return "email";
  }

  if (
    lower.includes("meeting") ||
    lower.includes("action items") ||
    lower.includes("attendees") ||
    lower.includes("agenda") ||
    lower.includes("minutes")
  ) {
    return "meeting";
  }

  return "notes";
};

  const [plan, setPlan] = useState("free");
  const [usageCount, setUsageCount] = useState(0);

  const syncPlanFromStripe = async () => {
  try {
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Plan sync failed");
    }

    if (data.plan) {
      setPlan(data.plan);

      if (data.plan !== "free") {
        setUsageCount(0);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

  useEffect(() => {
    if (session?.user?.email) {
      syncPlanFromStripe();
    }
  }, [session]);
  
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loadingEmails, setLoadingEmails] = useState(false);

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    const savedUsage = localStorage.getItem("usageCount");
    if (savedUsage) {
      setUsageCount(Number(savedUsage));
    }
  }, []);

  const selectedEmailDisplay = useMemo(() => {
    if (!selectedEmail) return "";

    return `EMAIL THREAD ANALYSIS

CONTEXT
You are analyzing an email conversation. Extract the most important information.

EMAIL DETAILS
From: ${selectedEmail.from}
Date: ${selectedEmail.date}
Subject: ${selectedEmail.subject}

CONTENT
${selectedEmail.body || selectedEmail.snippet || ""}

TASK
- Summarize clearly
- Extract key points
- Identify required actions
- Highlight urgency if any

OUTPUT FORMAT

SUMMARY
...

KEY POINTS
- ...

ACTION ITEMS
- ...
`;
  }, [selectedEmail]);

  const selectedEventDisplay = useMemo(() => {
    if (!selectedEvent) return "";

    return `MEETING ANALYSIS

CONTEXT
You are analyzing a meeting. Extract decisions and actions.

MEETING DETAILS
Title: ${selectedEvent.summary}
Start: ${selectedEvent.start}
End: ${selectedEvent.end}
Location: ${selectedEvent.location || "N/A"}

DESCRIPTION
${selectedEvent.description || "No description"}

TASK
- Summarize discussion
- Extract decisions
- Identify action items
- Highlight responsibilities

OUTPUT FORMAT

SUMMARY
...

KEY DECISIONS
- ...

ACTION ITEMS
- ...
`;
  }, [selectedEvent]);

  const handleUpgrade = async (selectedPlan) => {
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan: selectedPlan,
          email: session?.user?.email || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert(error.message || "Stripe checkout failed");
    }
  };


 

  const handleGenerate = async () => {
  if (!input.trim()) return;

  if (plan === "free" && usageCount >= 3) {
    setUpgradeMessage("Free limit reached. Upgrade now to keep generating client-ready documents instantly.");
    return;
  }

  if ((mode === "email" || mode === "meeting") && plan !== "ultra") {
    alert("Email and calendar analysis are available only on the ULTRA plan.");
    return;
  }

  try {
    setLoadingAI(true);
const effectiveMode = detectMode(input);
setDetectedMode(effectiveMode);
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: effectiveMode,
        content: input,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "AI failed");
    }

    setOutput(data.result);
    setUpgradeMessage("");

    if (plan === "free") {
      setUsageCount((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("usageCount", String(newCount));
        return newCount;
      });
    }
  } catch (error) {
    if (error.message?.toLowerCase().includes("limit")) {
      setUpgradeMessage("You have used all 3 free transformations. Upgrade to continue.");
    }

    console.error(error);
    alert(error.message || "AI failed");
  } finally {
    setLoadingAI(false);
  }
};

  const handleSummarizeSelectedEmail = async () => {
    if (!selectedEmail) return;

    if (plan !== "ultra") {
      alert("Email tools are available only on the ULTRA plan.");
      return;
    }

    try {
      setLoadingAI(true);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "email-summary",
          content: selectedEmail.body || selectedEmail.snippet || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI failed");
      }

      setMode("email");
      setInput(selectedEmail.body || selectedEmail.snippet || "");
      setOutput(data.result);
    } catch (error) {
      console.error(error);
      alert(error.message || "AI failed");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateReply = async () => {
    if (!selectedEmail) return;

    if (plan !== "ultra") {
      alert("Email tools are available only on the ULTRA plan.");
      return;
    }

    try {
      setLoadingAI(true);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "email-reply",
          content: selectedEmail.body || selectedEmail.snippet || "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI failed");
      }

      setMode("email");
      setInput(selectedEmail.body || selectedEmail.snippet || "");
      setOutput(data.result);
    } catch (error) {
      console.error(error);
      alert(error.message || "AI failed");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSummarizeSelectedEvent = async () => {
    if (!selectedEvent) return;

    if (plan !== "ultra") {
      alert("Calendar tools are available only on the ULTRA plan.");
      return;
    }

    try {
      setLoadingAI(true);

      const content = `MEETING TITLE
${selectedEvent.summary}

START
${selectedEvent.start}

END
${selectedEvent.end}

LOCATION
${selectedEvent.location || "No location"}

DESCRIPTION
${selectedEvent.description || "No description"}`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "meeting",
          content,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI failed");
      }

      setMode("meeting");
      setInput(content);
      setOutput(data.result);
    } catch (error) {
      console.error(error);
      alert(error.message || "AI failed");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    alert("Copied!");
  };

  const handleExportTxt = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-output.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportWord = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ai-output.doc";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
  if (!output) return;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const marginLeft = 15;
  const marginTop = 20;
  const lineHeight = 7;
  const maxWidth = 180;
  const pageHeight = doc.internal.pageSize.height;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);

  const lines = doc.splitTextToSize(output, maxWidth);

  let y = marginTop;

  lines.forEach((line) => {
    if (y > pageHeight - 20) {
      doc.addPage();
      y = marginTop;
    }

    doc.text(line, marginLeft, y);
    y += lineHeight;
  });

  doc.save("structured-document.pdf");
};

  const handleSaveToNotion = async () => {
    if (!output) return;

    try {
      setSavingToNotion(true);

      const res = await fetch("/api/notion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: output,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to save to Notion");
      }

      alert("Saved to Notion successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message || "Notion save failed");
    } finally {
      setSavingToNotion(false);
    }
  };

  const handleFetchEmails = async () => {
    if (plan !== "ultra") {
      alert("Gmail integration is available only on the ULTRA plan.");
      return;
    }

    try {
      setLoadingEmails(true);

      const res = await fetch("/api/gmail");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch emails");
      }

      setEmails(data.emails || []);

      if (data.emails?.length) {
        setSelectedEmail(data.emails[0]);
      } else {
        setSelectedEmail(null);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to fetch emails");
    } finally {
      setLoadingEmails(false);
    }
  };

  const handleFetchEvents = async () => {
    if (plan !== "ultra") {
      alert("Calendar integration is available only on the ULTRA plan.");
      return;
    }

    try {
      setLoadingEvents(true);

      const res = await fetch("/api/calendar");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch calendar events");
      }

      setEvents(data.events || []);

      if (data.events?.length) {
        setSelectedEvent(data.events[0]);
      } else {
        setSelectedEvent(null);
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to fetch calendar events");
    } finally {
      setLoadingEvents(false);
    }
  };

  const tabButton = (active) => ({
    padding: "10px 16px",
    borderRadius: "8px",
    border: active ? "1px solid black" : "1px solid #ddd",
    background: active ? "black" : "white",
    color: active ? "white" : "black",
    cursor: "pointer",
    fontWeight: "bold",
  });

  const actionButton = {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    background: "white",
    cursor: "pointer",
    fontWeight: "bold",
  };
   const linkCardStyle = {
  padding: "14px",
  border: "1px solid #eee",
  borderRadius: "10px",
  textDecoration: "none",
  color: "black",
  background: "#fff",
  transition: "0.2s",
  display: "block"
};

const linkCardText = {
  fontSize: "13px",
  color: "#666",
  marginTop: "4px"
};

  const cardStyle = (active) => ({
    border: active ? "1px solid black" : "1px solid #e5e5e5",
    borderRadius: "10px",
    padding: "12px",
    background: active ? "#f7f7f7" : "white",
    cursor: "pointer",
  });

  return (
    <div
      style={{
        maxWidth: "1300px",
        margin: "40px auto",
        fontFamily: "Arial",
        padding: "20px",
      }}
    >
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {status === "loading" ? (
            <div>Checking login...</div>
          ) : session ? (
            <>
              <div style={{ fontWeight: "bold" }}>
                Connected as {session.user?.email}
              </div>
              <button
                onClick={() => signOut()}
                style={{
                  padding: "12px 20px",
                  background: "#111",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              style={{
                padding: "12px 20px",
                background: "#4285F4",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Connect Google
            </button>
          )}
        </div>



      


      </div>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
  <button
    onClick={handleFetchEmails}
    disabled={plan !== "ultra"}
    style={{
      padding: "12px 20px",
      background: plan === "ultra" ? "#4285F4" : "#ccc",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: plan === "ultra" ? "pointer" : "not-allowed",
      fontWeight: "bold",
    }}
  >
    {loadingEmails ? "Fetching Emails..." : "Fetch Emails"}
  </button>

  <button
    onClick={handleFetchEvents}
    disabled={plan !== "ultra"}
    style={{
      padding: "12px 20px",
      background: plan === "ultra" ? "#0f766e" : "#ccc",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: plan === "ultra" ? "pointer" : "not-allowed",
      fontWeight: "bold",
    }}
  >
    {loadingEvents ? "Fetching Meetings..." : "Fetch Meetings"}
  </button>
</div>

{plan !== "ultra" && (
  <div style={{ color: "#666", marginTop: "8px" }}>
    Gmail and Calendar are available on ULTRA only
  </div>
)}

<div
  style={{
    marginBottom: "20px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  }}
>
  <div style={{ fontWeight: "bold", fontSize: "18px" }}>
    Current Plan: {plan.toUpperCase()}
  </div>

  {plan === "free" && (
    <div style={{ color: "#666" }}>
      3 free transformations total
    </div>
  )}

  {plan === "free" && (
    <div style={{ color: "#555" }}>
      Free uses left: {Math.max(0, 3 - usageCount)}
    </div>
  )}

  {plan === "pro" && (
    <div style={{ color: "green", fontWeight: "bold" }}>
      PRO access active
    </div>
  )}

  {plan === "ultra" && (
    <div style={{ color: "green", fontWeight: "bold" }}>
      ULTRA access active
    </div>
  )}

  <button
    onClick={syncPlanFromStripe}
    style={{
      padding: "10px 14px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      background: "white",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Refresh Plan
  </button>
</div>

<div style={{
  textAlign: "center",
  maxWidth: "700px",
  margin: "0 auto",
  marginBottom: "20px"
}}>

  <h1>AI Assistant for Notes, Emails and Client Documents</h1>

  <p>
    Turn messy notes, rough emails and client information into clean, structured output in seconds.
  </p>

  <p>
    Use this tool when you want to save time, sound more professional, and stop wasting energy rewriting the same things manually.
  </p>

  <ul style={{
    textAlign: "left",
    display: "inline-block",
    marginTop: "10px"
  }}>
    <li>Rewrite messy emails into professional replies</li>
    <li>Turn rough notes into summaries and action items</li>
    <li>Organize client details into cleaner structured text</li>
    <li>Get usable output in one click instead of prompting AI manually</li>
  </ul>

</div>

<div style={{
  textAlign: "center",
  maxWidth: "700px",
  margin: "0 auto",
  marginBottom: "30px"
}}>

  <h2 style={{ marginBottom: "10px" }}>
    Use it directly inside Gmail
  </h2>

  <p style={{ color: "#555", marginBottom: "12px" }}>
    Install the Chrome extension and get a Make professional button inside Gmail.
  </p>

  <p style={{ color: "#555", marginBottom: "16px" }}>
    Turn rough replies into clean, professional messages instantly without leaving your inbox.
  </p>

  <a
    href="/chrome-extension"
    style={{
      display: "inline-block",
      padding: "12px 20px",
      background: "black",
      color: "white",
      borderRadius: "8px",
      textDecoration: "none",
      fontWeight: "600"
    }}
  >
    Get Chrome Extension
  </a>

</div>

<div style={{ marginBottom: "20px" }}>
  <a

    style={{
      display: "inline-block",
      padding: "12px 24px",
      background: "#2563EB",
      color: "#fff",
      borderRadius: "10px",
      fontWeight: "600",
      
    }}
  >
    Try it with 3 free transformations
  </a>
</div>

<div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
  <button onClick={() => setMode("notes")} style={tabButton(mode === "notes")}>
    Notes
  </button>

  <button onClick={() => setMode("email")} style={tabButton(mode === "email")}>
    Email Thread
  </button>

  <button onClick={() => setMode("meeting")} style={tabButton(mode === "meeting")}>
    Meeting Summary
  </button>
</div>

{upgradeMessage && (
  <div
    style={{
      marginBottom: "16px",
      padding: "16px",
      background: "#fff4e5",
      color: "#8a4b00",
      border: "1px solid #f5c27a",
      borderRadius: "8px",
      fontWeight: "500",
    }}
  >
    <div style={{ marginBottom: "10px" }}>
      {upgradeMessage}
    </div>

    <button
      onClick={() => handleUpgrade("pro")}
      style={{
        padding: "10px 16px",
        background: "black",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Upgrade Now
    </button>
  </div>
)}


<textarea
  placeholder={
    mode === "email"
      ? "Paste your email thread here..."
      : mode === "meeting"
      ? "Paste your meeting notes here..."
      : "Paste messy notes here..."
  }
  value={input}
  onChange={(e) => setInput(e.target.value)}
  style={{
    width: "100%",
    height: "180px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "16px",
  }}
/>

<div
  id="tool"
  style={{
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "20px",
    alignItems: "center",
  }}
>
  <button
    onClick={handleGenerate}
    style={{
      padding: "12px 20px",
      background: "black",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    {loadingAI ? "Working..." : "Generate"}
  </button>

  <button onClick={handleCopy} style={actionButton} disabled={!output}>
    Copy
  </button>

  <button
    onClick={handleSaveToNotion}
    style={actionButton}
    disabled={!output || savingToNotion}
  >
    {savingToNotion ? "Saving..." : "Notion"}
  </button>

  <button onClick={handleExportWord} style={actionButton} disabled={!output}>
    Word
  </button>

  <button onClick={handleExportPDF} style={actionButton} disabled={!output}>
    PDF
  </button>

  
</div>

<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "40px",
  marginTop: "30px",
  marginBottom: "30px"
}}>

  {/* 🔵 SEO PAGES */}
  <div>
    <h3 style={{ marginBottom: "12px" }}>Popular AI Tools</h3>

    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      <a href="/seo/rewrite-email" style={linkCardStyle}>
        <strong>Rewrite Email</strong>
        <div style={linkCardText}>Fix messy emails instantly using AI</div>
      </a>

      <a href="/seo/professional-email-generator" style={linkCardStyle}>
        <strong>Professional Email Generator</strong>
        <div style={linkCardText}>Generate work emails in seconds</div>
      </a>

      <a href="/seo/fix-email-mistakes" style={linkCardStyle}>
        <strong>Fix Email Mistakes</strong>
        <div style={linkCardText}>Correct grammar and tone instantly</div>
      </a>

      <a href="/seo/improve-email-tone" style={linkCardStyle}>
        <strong>Improve Email Tone</strong>
        <div style={linkCardText}>Make emails more professional</div>
      </a>

      <a href="/seo/ai-email-assistant" style={linkCardStyle}>
        <strong>AI Email Assistant</strong>
        <div style={linkCardText}>Smart assistant for writing emails</div>
      </a>

    </div>
  </div>

  {/* 🟢 BLOG PAGES */}
  <div>
    <h3 style={{ marginBottom: "12px" }}>Latest Guides</h3>

    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      <a href="/blog/how-to-write-professional-emails" style={linkCardStyle}>
        <strong>How to Write Professional Emails</strong>
        <div style={linkCardText}>Step by step guide for better emails</div>
      </a>

      <a href="/blog/fix-email-mistakes-guide" style={linkCardStyle}>
        <strong>Fix Email Mistakes Guide</strong>
        <div style={linkCardText}>Common errors and how to fix them</div>
      </a>

      <a href="/blog/improve-email-tone-guide" style={linkCardStyle}>
        <strong>Improve Email Tone</strong>
        <div style={linkCardText}>Make your emails sound confident</div>
      </a>

      <a href="/blog/ai-email-assistant-guide" style={linkCardStyle}>
        <strong>AI Email Assistant Guide</strong>
        <div style={linkCardText}>Use AI to write emails faster</div>
      </a>

      <a href="/blog/email-writing-tips" style={linkCardStyle}>
        <strong>Email Writing Tips</strong>
        <div style={linkCardText}>Write better emails instantly</div>
      </a>

    </div>
  </div>

</div>



{detectedMode && (
  <div
    style={{
      marginBottom: "10px",
      color: "#555",
      fontSize: "14px",
    }}
  >
    Detected mode: {detectedMode}
  </div>
)}

{output && (
  <div
    style={{
      background: "#f8fafc",
      padding: "20px",
      borderRadius: "12px",
      border: "1px solid #e5e7eb",
      marginTop: "10px",
      marginBottom: "20px",
    }}
  >
    <div
      style={{
        fontWeight: "bold",
        marginBottom: "10px",
        color: "#111827",
      }}
    >
      Ready to send output
    </div>

    <div
      style={{
        whiteSpace: "pre-wrap",
        lineHeight: "1.7",
        color: "#374151",
      }}
    >
      {output}
    </div>
  </div>
)}

      <a
        href="/integrations"
        style={{
          display: "inline-block",
          marginBottom: "24px",
          color: "black",
          fontWeight: "bold",
          textDecoration: "none",
        }}
      >
        View features →
      </a>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            padding: "16px",
            minHeight: "420px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "12px" }}>Inbox</h2>

          {!emails.length ? (
            <div style={{ color: "#666" }}>
              No emails loaded yet. Click Fetch Emails.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {emails.map((email) => (
                <div
                  key={email.id}
                  style={cardStyle(selectedEmail?.id === email.id)}
                  onClick={() => {
                    setSelectedEmail(email);
                    setMode("email");
                    setInput(email.body || email.snippet || "");
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "6px" }}>
                    {email.subject}
                  </div>
                  <div style={{ fontSize: "13px", color: "#555", marginBottom: "6px" }}>
                    {email.from}
                  </div>
                  <div style={{ fontSize: "12px", color: "#777", marginBottom: "8px" }}>
                    {email.date}
                  </div>
                  <div style={{ fontSize: "13px", color: "#333" }}>
                    {email.snippet}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            padding: "16px",
            minHeight: "420px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "12px" }}>Calendar</h2>

          {!events.length ? (
            <div style={{ color: "#666" }}>
              No meetings loaded yet. Click Fetch Meetings.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {events.map((event) => (
                <div
                  key={event.id}
                  style={cardStyle(selectedEvent?.id === event.id)}
                  onClick={() => {
                    setSelectedEvent(event);
                    setMode("meeting");
                    setInput(
                      `MEETING TITLE
${event.summary}

START
${event.start}

END
${event.end}

LOCATION
${event.location || "No location"}

DESCRIPTION
${event.description || "No description"}`
                    );
                  }}
                >
                  <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "6px" }}>
                    {event.summary}
                  </div>
                  <div style={{ fontSize: "12px", color: "#777", marginBottom: "6px" }}>
                    {event.start}
                  </div>
                  <div style={{ fontSize: "13px", color: "#555" }}>
                    {event.location || "No location"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            padding: "16px",
            minHeight: "420px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "12px" }}>Selected Email</h2>

          {!selectedEmail ? (
            <div style={{ color: "#666" }}>
              Select an email from the inbox to view details.
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "10px", fontWeight: "bold", fontSize: "20px" }}>
                {selectedEmail.subject}
              </div>

              <div style={{ marginBottom: "6px", color: "#444" }}>
                <strong>From:</strong> {selectedEmail.from}
              </div>

              <div style={{ marginBottom: "14px", color: "#444" }}>
                <strong>Date:</strong> {selectedEmail.date}
              </div>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                  background: "#fafafa",
                  borderRadius: "10px",
                  padding: "14px",
                  minHeight: "220px",
                  marginBottom: "16px",
                }}
              >
                {selectedEmail.body || selectedEmail.snippet || "No content"}
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={handleSummarizeSelectedEmail}
                  style={{
                    padding: "12px 18px",
                    background: "black",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {loadingAI ? "Working..." : "Summarize Email"}
                </button>

                <button
                  onClick={handleGenerateReply}
                  style={{
                    padding: "12px 18px",
                    background: "#4285F4",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {loadingAI ? "Working..." : "Generate Reply"}
                </button>

                <button
                  onClick={() => {
                    setMode("email");
                    setInput(selectedEmailDisplay || "");
                  }}
                  style={actionButton}
                >
                  Load into Editor
                </button>
              </div>
            </>
          )}
        </div>

        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: "12px",
            padding: "16px",
            minHeight: "420px",
          }}
        >
          <h2 style={{ marginTop: 0, marginBottom: "12px" }}>Selected Meeting</h2>

          {!selectedEvent ? (
            <div style={{ color: "#666" }}>
              Select a meeting from calendar to view details.
            </div>
          ) : (
            <>
              <div style={{ marginBottom: "10px", fontWeight: "bold", fontSize: "20px" }}>
                {selectedEvent.summary}
              </div>

              <div style={{ marginBottom: "6px", color: "#444" }}>
                <strong>Start:</strong> {selectedEvent.start}
              </div>

              <div style={{ marginBottom: "6px", color: "#444" }}>
                <strong>End:</strong> {selectedEvent.end}
              </div>

              <div style={{ marginBottom: "6px", color: "#444" }}>
                <strong>Location:</strong> {selectedEvent.location || "No location"}
              </div>

              <div
                style={{
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.6",
                  background: "#fafafa",
                  borderRadius: "10px",
                  padding: "14px",
                  minHeight: "220px",
                  marginBottom: "16px",
                }}
              >
                {selectedEvent.description || "No description"}
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  onClick={handleSummarizeSelectedEvent}
                  style={{
                    padding: "12px 18px",
                    background: "#0f766e",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {loadingAI ? "Working..." : "Summarize Meeting"}
                </button>

                <button
                  onClick={() => {
                    setMode("meeting");
                    setInput(selectedEventDisplay || "");
                  }}
                  style={actionButton}
                >
                  Load into Editor
                </button>

                {selectedEvent.htmlLink ? (
                  <a
                    href={selectedEvent.htmlLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      ...actionButton,
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Open in Google Calendar
                  </a>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      

      <div
        style={{
          marginTop: "50px",
          padding: "20px",
          background: "#fafafa",
          borderRadius: "10px",
        }}
      >
           
      </div>

        <div
  style={{
    marginTop: "50px",
    padding: "20px",
    background: "#fafafa",
    borderRadius: "10px",
  }}
>
  {plan === "free" && (
    <>
      <h3 style={{ marginTop: 0 }}>Choose Your Plan</h3>

      <p style={{ color: "#555" }}>
        Upgrade to unlock more power and premium features.
      </p>

      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "16px",
            width: "280px",
            background: "white",
          }}
        >
          <h4 style={{ marginTop: 0 }}>PRO</h4>
          <p>Unlimited AI transformations</p>
          <p style={{ fontWeight: "bold" }}>£9.99/month</p>

          <button
            onClick={() => handleUpgrade("pro")}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "black",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Upgrade to PRO
          </button>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "16px",
            width: "280px",
            background: "white",
          }}
        >
          <h4 style={{ marginTop: 0 }}>ULTRA</h4>
          <p>Unlimited AI + Gmail + Calendar</p>
          <p style={{ fontWeight: "bold" }}>£19.99/month</p>

          <button
            onClick={() => handleUpgrade("ultra")}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              background: "#6b21a8",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Upgrade to ULTRA
          </button>
        </div>
      </div>
    </>
  )}

  {plan === "pro" && (
    <>
      <h3 style={{ marginTop: 0 }}>Upgrade to ULTRA</h3>

      <p style={{ color: "#555" }}>
        Unlock Gmail and Calendar integrations.
      </p>

      <button
        onClick={() => handleUpgrade("ultra")}
        style={{
          padding: "12px 20px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          background: "#6b21a8",
          color: "white",
          fontWeight: "bold",
        }}
      >
        Upgrade to ULTRA — £19.99/month
      </button>
    </>
  )}

  {plan === "ultra" && (
    <div style={{ color: "green", fontWeight: "bold", fontSize: "18px" }}>
      All premium features unlocked
    </div>
  )}
</div>

      <div
        style={{
          marginTop: "60px",
          padding: "20px",
          borderTop: "1px solid #ddd",
        }}
      >
        <h3>Support</h3>
        <p>If you have any questions or issues, feel free to reach out:</p>
        <p>
          Email: <a href="mailto:sales@adorrolimited.pro">sales@adorrolimited.pro</a>
        </p>
        <p style={{ fontSize: "14px", color: "#666" }}>
          We usually respond within 24 hours.
        </p>
      </div>
    </div>
  );
}

