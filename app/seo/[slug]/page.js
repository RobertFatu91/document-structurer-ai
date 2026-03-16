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
    intro: `Document Structurer AI helps with ${titleText.toLowerCase()} by turning rough, messy notes into structured summaries, key points and action items in seconds.`,
    benefits: [
      `Improves ${titleText.toLowerCase()}`,
      "Turns messy notes into clearer structure",
      "Creates summaries and action items",
      "Saves time after meetings, calls and planning"
    ]
  };
}

function buildFaqData(slug) {
  const titleText = slugToTitle(slug).toLowerCase();

  return [
    {
      question: `What is ${titleText}?`,
      answer: `${slugToTitle(slug)} is a use case for turning rough notes into a clearer structured format with summaries, key points and action items.`
    },
    {
      question: `How can AI help with ${titleText}?`,
      answer: `AI can organize messy notes, extract important information, create summaries and identify action items much faster than doing it manually.`
    },
    {
      question: `Can I turn ${titleText} into a report?`,
      answer: `Yes. Document Structurer AI can help convert rough notes into a structured report format that is easier to review and share.`
    },
    {
      question: `Who is this useful for?`,
      answer: `This is useful for founders, freelancers, consultants, contractors, managers and teams who need cleaner notes after meetings, calls or planning sessions.`
    }
  ];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  if (!seoKeywords.includes(slug)) {
    return {
      title: "Page Not Found"
    };
  }

  const page = buildPageData(slug);

  return {
    title: page.title,
    description: page.description
  };
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
        maxWidth: "850px",
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

      <h1 style={{ fontSize: "38px", marginBottom: "20px" }}>
        {page.heading}
      </h1>

      <p style={{ fontSize: "18px", lineHeight: "1.7", marginBottom: "24px" }}>
        {page.intro}
      </p>

      <h2 style={{ marginBottom: "12px" }}>What this tool helps with</h2>

      <ul style={{ lineHeight: "1.8", marginBottom: "28px" }}>
        {page.benefits.map((benefit, index) => (
          <li key={index}>{benefit}</li>
        ))}
      </ul>

      <h2 style={{ marginBottom: "12px" }}>How it works</h2>

      <p style={{ lineHeight: "1.7", marginBottom: "24px" }}>
        Paste your messy notes into Document Structurer AI and the tool will
        organize them into a clean structured output. Depending on your content,
        it can generate summaries, key points, action items and clearer report
        sections.
      </p>

      <h2 style={{ marginBottom: "12px" }}>Who it is for</h2>

      <p style={{ lineHeight: "1.7", marginBottom: "28px" }}>
        This tool is useful for founders, freelancers, consultants, contractors
        and anyone who deals with messy notes from meetings, brainstorming
        sessions or planning calls.
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
          fontWeight: "bold",
          marginBottom: "40px"
        }}
      >
        Try Document Structurer AI
      </a>

      <h2 style={{ marginBottom: "14px" }}>Frequently asked questions</h2>

      <div style={{ marginBottom: "40px" }}>
        {faqItems.map((item, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "12px",
              background: "#fafafa"
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: "8px", fontSize: "18px" }}>
              {item.question}
            </h3>
            <p style={{ margin: 0, lineHeight: "1.6", color: "#333" }}>
              {item.answer}
            </p>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: "14px" }}>Related pages</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "12px"
        }}
      >
        {relatedPages.map((relatedSlug) => (
          <a
            key={relatedSlug}
            href={`/seo/${relatedSlug}`}
            style={{
              textDecoration: "none",
              color: "black",
              border: "1px solid #ddd",
              padding: "14px",
              borderRadius: "8px",
              background: "#fafafa"
            }}
          >
            {slugToTitle(relatedSlug)}
          </a>
        ))}
      </div>
    </div>
  );
}
