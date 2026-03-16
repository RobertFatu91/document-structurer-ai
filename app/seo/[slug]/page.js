import { notFound } from "next/navigation";
import { seoKeywords } from "../../../data/seoKeywords";

function slugToTitle(slug) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildPageData(slug) {
  const titleText = slugToTitle(slug);

  return {
    title: `${titleText} | Document Structurer AI`,
    description: `Use Document Structurer AI for ${titleText.toLowerCase()}. Turn messy notes into structured summaries, reports and action items.`,
    heading: titleText,
    intro: `Document Structurer AI helps with ${titleText.toLowerCase()} by turning rough notes into structured summaries, key points and action items.`,
    benefits: [
      `Improves ${titleText.toLowerCase()}`,
      "Turns messy notes into clearer structure",
      "Creates summaries and action items",
      "Saves time after meetings and calls"
    ]
  };
}

function buildFaqData(slug) {
  const titleText = slugToTitle(slug).toLowerCase();

  return [
    {
      question: `What is ${titleText}?`,
      answer: `${slugToTitle(slug)} helps organize messy notes into summaries, key points and action items.`
    },
    {
      question: `How does AI organize notes?`,
      answer: `AI analyzes raw text, detects important information and structures it into clear sections and summaries.`
    },
    {
      question: `Can AI convert notes into reports?`,
      answer: `Yes. AI can convert messy notes into structured reports, summaries and follow-up tasks.`
    },
    {
      question: `Who can use this tool?`,
      answer: `Founders, freelancers, consultants, students and teams who want to organize notes quickly.`
    }
  ];
}

export async function generateStaticParams() {
  return seoKeywords.map((slug) => ({
    slug
  }));
}

export default async function SeoPage({ params }) {
  const { slug } = await params;

  if (!seoKeywords.includes(slug)) {
    notFound();
  }

  const page = buildPageData(slug);
  const faqItems = buildFaqData(slug);

  const relatedPages = seoKeywords
    .filter((item) => item !== slug)
    .slice(0, 6);

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.heading,
    description: page.description,
    url: `https://document-structurer-ai.vercel.app/seo/${slug}`
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h1 style={{ fontSize: "40px", marginBottom: "16px" }}>
        {page.heading}
      </h1>

      <p style={{ fontSize: "18px", lineHeight: "1.7", marginBottom: "24px" }}>
        {page.intro}
      </p>

      <h2>Benefits</h2>

      <ul style={{ lineHeight: "1.8", marginBottom: "30px" }}>
        {page.benefits.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      <a
        href="/"
        style={{
          display: "inline-block",
          background: "black",
          color: "white",
          padding: "14px 22px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          marginBottom: "40px"
        }}
      >
        Try Document Structurer AI
      </a>

      <h2 style={{ marginBottom: "16px" }}>
        Frequently Asked Questions
      </h2>

      {faqItems.map((item, i) => (
        <div
          key={i}
          style={{
            border: "1px solid #ddd",
            padding: "16px",
            borderRadius: "8px",
            marginBottom: "12px",
            background: "#fafafa"
          }}
        >
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </div>
      ))}

      <h2 style={{ marginTop: "40px" }}>
        Related Pages
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px",
          marginBottom: "40px"
        }}
      >
        {relatedPages.map((slug) => (
          <a
            key={slug}
            href={`/seo/${slug}`}
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              borderRadius: "8px",
              textDecoration: "none",
              color: "black",
              background: "#fafafa"
            }}
          >
            {slugToTitle(slug)}
          </a>
        ))}
      </div>

      <h2>
        Popular AI Note Tools
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px"
        }}
      >

        <a href="/seo/ai-meeting-notes">AI Meeting Notes</a>
        <a href="/seo/meeting-notes-summary">Meeting Notes Summary</a>
        <a href="/seo/meeting-notes-organizer">Meeting Notes Organizer</a>
        <a href="/seo/organize-messy-notes">Organize Messy Notes</a>
        <a href="/seo/notes-to-report">Notes To Report</a>
        <a href="/seo/notes-to-action-items">Notes To Action Items</a>
        <a href="/seo/call-notes-summary">Call Notes Summary</a>
        <a href="/seo/client-call-notes">Client Call Notes</a>
        <a href="/seo/project-notes-summary">Project Notes Summary</a>
        <a href="/seo/lecture-notes-organizer">Lecture Notes Organizer</a>
        <a href="/seo/ai-notes-organizer">AI Notes Organizer</a>
        <a href="/seo/notes-cleanup-tool">Notes Cleanup Tool</a>

      </div>

    </div>
  );
}
