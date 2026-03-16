export const metadata = {
  title: "AI Meeting Notes Generator",
  description: "Turn messy meeting notes into structured reports with summaries, key points and action items using AI."
}

export default function Page() {
  return (
    <div style={{maxWidth:"800px", margin:"40px auto", padding:"20px"}}>
      <h1>AI Meeting Notes Generator</h1>

      <p>
      Meetings often produce messy notes that are hard to understand later.
      Our AI tool converts raw meeting notes into structured reports in seconds.
      </p>

      <h2>What this tool does</h2>

      <ul>
        <li>Summarizes messy meeting notes</li>
        <li>Extracts key points</li>
        <li>Creates action items</li>
        <li>Turns notes into structured reports</li>
      </ul>

      <h2>Try the tool</h2>

      <p>
      Paste your meeting notes and instantly generate a structured document.
      </p>

      <a href="/" style={{fontSize:"18px", fontWeight:"bold"}}>
        Open Document Structurer AI
      </a>
    </div>
  );
}