import { notFound } from "next/navigation";

const clusterPages = {
  "meeting-notes-tools": {
    title: "Meeting Notes Tools | Document Structurer AI",
    description:
      "Explore AI tools for meeting notes, summaries, reports and action items.",
    heading: "Meeting Notes Tools",
    intro:
      "This cluster groups the most useful AI pages for meeting notes, meeting summaries, follow-up notes and meeting report generation.",
    keywords: [
      "ai-meeting-notes",
      "ai-meeting-notes-generator",
      "ai-meeting-notes-tool",
      "ai-meeting-notes-organizer",
      "ai-meeting-notes-summary",
      "ai-meeting-notes-summarizer",
      "ai-meeting-notes-report",
      "ai-meeting-notes-report-generator",
      "meeting-notes-generator",
      "meeting-notes-summary",
      "meeting-notes-summary-generator",
      "meeting-notes-organizer",
      "meeting-notes-to-report",
      "meeting-notes-to-summary",
      "meeting-notes-to-action-items",
      "meeting-notes-to-task-list",
      "meeting-notes-cleanup",
      "meeting-notes-formatter",
      "meeting-notes-converter",
      "meeting-summary-generator",
      "meeting-report-generator",
      "team-meeting-notes",
      "team-meeting-notes-organizer",
      "project-meeting-notes",
      "client-meeting-notes",
      "work-meeting-notes"
    ]
  },

  "messy-notes-tools": {
    title: "Messy Notes Tools | Document Structurer AI",
    description:
      "Explore AI tools to organize messy notes, rough notes and raw notes into cleaner structured outputs.",
    heading: "Messy Notes Tools",
    intro:
      "This cluster focuses on organizing messy notes, cleaning rough text and turning unstructured notes into clearer summaries and reports.",
    keywords: [
      "organize-messy-notes",
      "organize-messy-notes-ai",
      "messy-notes-organizer",
      "messy-notes-organizer-ai",
      "messy-notes-cleanup",
      "messy-notes-cleanup-tool",
      "messy-notes-cleaner",
      "messy-notes-summary",
      "messy-notes-summarizer",
      "messy-notes-report",
      "messy-notes-to-summary",
      "messy-notes-to-report",
      "messy-notes-to-action-items",
      "messy-notes-to-task-list",
      "messy-notes-to-clean-notes",
      "messy-notes-to-structured-text",
      "messy-notes-formatter",
      "messy-notes-structure",
      "messy-notes-analysis",
      "clean-messy-notes",
      "clean-up-messy-notes",
      "fix-messy-notes",
      "format-messy-notes",
      "structure-messy-notes",
      "organize-raw-notes",
      "raw-notes-organizer",
      "raw-notes-to-summary",
      "raw-notes-to-report",
      "raw-notes-cleanup",
      "rough-notes-organizer"
    ]
  },

  "notes-conversion-tools": {
    title: "Notes Conversion Tools | Document Structurer AI",
    description:
      "Explore AI tools to convert notes into reports, summaries, task lists, emails and action items.",
    heading: "Notes Conversion Tools",
    intro:
      "This cluster groups note conversion pages that help transform raw notes into summaries, reports, action items, emails and structured outputs.",
    keywords: [
      "convert-notes-to-report",
      "convert-notes-to-summary",
      "convert-notes-to-action-items",
      "convert-notes-to-task-list",
      "convert-notes-to-email",
      "convert-notes-to-document",
      "convert-notes-to-clean-format",
      "turn-notes-into-report",
      "turn-notes-into-summary",
      "turn-notes-into-action-items",
      "turn-notes-into-task-list",
      "turn-notes-into-email",
      "turn-notes-into-key-points",
      "notes-to-report",
      "notes-to-summary",
      "notes-to-action-items",
      "notes-to-task-list",
      "notes-to-email",
      "notes-to-document",
      "notes-to-follow-up",
      "notes-to-key-points",
      "notes-to-clean-format",
      "notes-to-structured-text",
      "notes-to-meeting-report",
      "notes-to-client-summary",
      "notes-to-next-steps",
      "notes-to-bullet-points",
      "summary-from-notes",
      "generate-summary-from-notes",
      "create-report-from-notes"
    ]
  }
};

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateStaticParams() {
  return Object.keys(clusterPages).map((slug) => ({
    slug
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const cluster = clusterPages[slug];

  if (!cluster) {
    return {
      title: "Page Not Found"
    };
  }

  return {
    title: cluster.title,
    description: cluster.description
  };
}

export default async function ClusterPage({ params }) {
  const { slug } = await params;
  const cluster = clusterPages[slug];

  if (!cluster) {
    notFound();
  }

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cluster.heading,
    description: cluster.description,
    url: `https://document-structurer-ai.vercel.app/clusters/${slug}`
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <h1 style={{ fontSize: "40px", marginBottom: "16px" }}>
        {cluster.heading}
      </h1>

      <p style={{ fontSize: "18px", lineHeight: "1.7", marginBottom: "24px" }}>
        {cluster.intro}
      </p>

      <h2 style={{ marginBottom: "14px" }}>Explore pages in this cluster</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "12px",
          marginBottom: "34px"
        }}
      >
        {cluster.keywords.map((keyword) => (
          <a
            key={keyword}
            href={`/seo/${keyword}`}
            style={{
              textDecoration: "none",
              color: "black",
              border: "1px solid #ddd",
              padding: "14px",
              borderRadius: "8px",
              background: "#fafafa"
            }}
          >
            {slugToTitle(keyword)}
          </a>
        ))}
      </div>

      <h2 style={{ marginBottom: "14px" }}>Why this cluster matters</h2>

      <p style={{ lineHeight: "1.7", marginBottom: "18px" }}>
        Cluster pages help Google understand that your site covers a full topic,
        not just isolated keywords. This strengthens the SEO of the linked pages
        and makes crawling easier.
      </p>

      <p style={{ lineHeight: "1.7", marginBottom: "28px" }}>
        Document Structurer AI is useful for founders, freelancers, consultants,
        teams and anyone who needs to turn messy notes into structured reports,
        summaries and action items.
      </p>

      <a
        href="/"
        style={{
          display: "inline-block",
          background: "black",
          color: "white",
          padding: "14px 22px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold"
        }}
      >
        Try Document Structurer AI
      </a>
    </div>
  );
}
