export default function SuccessPage() {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "60px auto",
        padding: "20px",
        fontFamily: "Arial",
        textAlign: "center",
      }}
    >
      <h1>Payment successful</h1>
      <p>Your subscription is being activated.</p>
      <p>Please return to the app and refresh your plan.</p>

      <a
        href="/"
        style={{
          display: "inline-block",
          marginTop: "20px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Go back
      </a>
    </div>
  );
}

