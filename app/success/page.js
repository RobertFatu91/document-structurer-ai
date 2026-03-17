export default function SuccessPage() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Payment successful</h1>
      <p>Your subscription is being activated.</p>
      <p>Please go back to the app.</p>

      <a href="/" style={{
        display: "inline-block",
        marginTop: "20px",
        padding: "10px 20px",
        background: "black",
        color: "white",
        borderRadius: "8px",
        textDecoration: "none"
      }}>
        Go back
      </a>
    </div>
  )
}