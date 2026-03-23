export default function ChromeExtensionPage() {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial",
        lineHeight: "1.7",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "700px",
          margin: "0 auto 40px auto",
        }}
      >
        <h1 style={{ marginBottom: "12px" }}>
          Chrome Extension for Gmail
        </h1>

        <p style={{ color: "#555", marginBottom: "12px" }}>
          Use Smart Reply directly inside Gmail and turn rough replies into clean, professional messages in seconds.
        </p>

        <p style={{ color: "#555", marginBottom: "20px" }}>
          Choose the tone you want: Professional, Polite, Friendly, or Concise.
        </p>

        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            background: "black",
            color: "white",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "600",
          }}
        >
          Back to Homepage
        </a>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            background: "#fff",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>What it does</h3>
          <p style={{ color: "#555" }}>
            Adds a Smart Reply button inside Gmail so you can generate ready-to-send replies without leaving your inbox.
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            background: "#fff",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Choose your tone</h3>
          <p style={{ color: "#555" }}>
            Generate replies in Professional, Polite, Friendly, or Concise tone based on the email you are answering.
          </p>
        </div>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            background: "#fff",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Who it is for</h3>
          <p style={{ color: "#555" }}>
            Ideal for client communication, work emails, follow-ups, support replies, and busy inbox workflows.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <h2 style={{ marginBottom: "12px" }}>How to use it</h2>

        <ol style={{ paddingLeft: "20px", marginBottom: "30px" }}>
          <li>Open Gmail</li>
          <li>Open an email you want to reply to</li>
          <li>Click Reply</li>
          <li>Click Smart Reply</li>
          <li>Choose your preferred tone</li>
          <li>Review the generated reply and send</li>
        </ol>

        <h2 style={{ marginBottom: "12px" }}>Why it is useful</h2>

        <ul style={{ paddingLeft: "20px", marginBottom: "30px" }}>
          <li>Saves time on repetitive email replies</li>
          <li>Improves tone and clarity instantly</li>
          <li>Helps you sound more professional</li>
          <li>Works directly inside Gmail</li>
        </ul>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            background: "#fafafa",
          }}
        >
          <h3 style={{ marginBottom: "10px" }}>Install status</h3>
          <p style={{ color: "#555", marginBottom: "14px" }}>
            The Chrome extension page is ready. If you have not published it in the Chrome Web Store yet, keep this page as the public information page for users.
          </p>

          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "12px 18px",
              background: "#2563EB",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Try the Web App
          </a>
        </div>
      </div>
    </div>
  );
}