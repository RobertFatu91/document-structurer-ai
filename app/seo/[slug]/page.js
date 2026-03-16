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

  const relatedPages = seoKeywords
    .filter((item) => item !== slug)
    .slice(0, 6);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.heading,
    description: page.description,
    url: `https://document-structurer-ai.vercel.app/seo/${slug}`
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
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