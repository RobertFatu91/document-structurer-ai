import { notFound } from "next/navigation";
import { seoPages } from "../../../data/seoPages";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = seoPages[slug];

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(seoPages).map((slug) => ({
    slug,
  }));
}

export default async function SeoPage({ params }) {
  const { slug } = await params;
  const page = seoPages[slug];

  if (!page) {
    notFound();
  }

  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
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
        }}
      >
        Try Document Structurer AI
      </a>
    </div>
  );
}