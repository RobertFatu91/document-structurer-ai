"use client";

import { useState } from "react";

export default function IntegrationsPage() {
  const [notion, setNotion] = useState(false);
  const [gmail, setGmail] = useState(false);
  const [calendar, setCalendar] = useState(false);

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        fontFamily: "Arial",
        padding: "20px"
      }}
    >
      <h1 style={{ fontSize: "36px", marginBottom: "20px" }}>
        Integrations
      </h1>

      <p style={{ marginBottom: "30px", color: "#555" }}>
        Connect your tools to automate notes, emails and meetings.
      </p>

      {/* NOTION */}
      <div style={card}>
        <h3>Notion</h3>
        <p>Save structured notes directly to your Notion workspace.</p>

        <button
          onClick={() => setNotion(true)}
          style={button}
        >
          {notion ? "Connected" : "Connect Notion"}
        </button>
      </div>

      {/* GMAIL */}
      <div style={card}>
        <h3>Gmail</h3>
        <p>Summarize email threads and generate replies instantly.</p>

        <button
          onClick={() => setGmail(true)}
          style={button}
        >
          {gmail ? "Connected" : "Connect Gmail"}
        </button>
      </div>

      {/* CALENDAR */}
      <div style={card}>
        <h3>Calendar</h3>
        <p>Generate meeting summaries and follow ups automatically.</p>

        <button
          onClick={() => setCalendar(true)}
          style={button}
        >
          {calendar ? "Connected" : "Connect Calendar"}
        </button>
      </div>
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  marginBottom: "20px"
};

const button = {
  padding: "10px 16px",
  borderRadius: "6px",
  border: "none",
  background: "black",
  color: "white",
  cursor: "pointer",
  marginTop: "10px"
};