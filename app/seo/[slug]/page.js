import { notFound } from "next/navigation";
import { seoKeywords } from "../../../data/seoKeywords";

const slugTitle = (slug) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

function buildPageData(slug) {
  const titleText = slugTitle(slug);

  const emailPages = {
    "rewrite-email": {
      title: "Rewrite Email | Document Structurer AI",
      description:
        "Rewrite messy emails into professional messages with AI. Improve tone, clarity, and structure in seconds.",
      heading: "Rewrite Emails with AI Instantly",
      intro:
        "Document Structurer AI helps rewrite rough email drafts into clean, professional messages that are easier to send with confidence.",
      benefits: [
        "Rewrites messy emails instantly",
        "Improves tone and clarity",
        "Makes emails more professional",
        "Saves time on manual rewriting",
      ],
    },
    "professional-email-generator": {
      title: "Professional Email Generator | Document Structurer AI",
      description:
        "Generate professional emails for work, clients, and formal communication using AI.",
      heading: "Professional Email Generator",
      intro:
        "Create cleaner and more professional emails faster with AI. Ideal for work emails, client communication, and formal requests.",
      benefits: [
        "Generates professional email wording",
        "Improves structure and readability",
        "Useful for business and client emails",
        "Helps you write faster with less effort",
      ],
    },
    "fix-email-mistakes": {
      title: "Fix Email Mistakes | Document Structurer AI",
      description:
        "Fix grammar, tone, and clarity mistakes in emails with AI before you send them.",
      heading: "Fix Email Mistakes with AI",
      intro:
        "Improve weak, unclear, or rushed emails by fixing tone, grammar, and wording automatically.",
      benefits: [
        "Fixes grammar and clarity issues",
        "Makes emails easier to understand",
        "Improves professionalism",
        "Reduces mistakes before sending",
      ],
    },
    "improve-email-tone": {
      title: "Improve Email Tone | Document Structurer AI",
      description:
        "Improve email tone with AI and make your messages sound more professional and polite.",
      heading: "Improve Email Tone with AI",
      intro:
        "Adjust the tone of your emails so they sound more respectful, polished, and professional.",
      benefits: [
        "Makes emails sound more polite",
        "Improves confidence and professionalism",
        "Useful for work and client communication",
        "Helps avoid awkward or blunt wording",
      ],
    },
    "ai-email-assistant": {
      title: "AI Email Assistant | Document Structurer AI",
      description:
        "Use an AI email assistant to rewrite and improve emails faster directly from your workflow.",
      heading: "AI Email Assistant for Faster Replies",
      intro:
        "Document Structurer AI acts like an email assistant by turning rough drafts into clear and professional messages in seconds.",
      benefits: [
        "Speeds up email writing",
        "Improves messy drafts instantly",
        "Helps with client and business emails",
        "Makes replies more professional",
      ],
    },
  };

  if (emailPages[slug]) {
    return emailPages[slug];
  }

  return {
    title: `${titleText} | Document Structurer AI`,
    description: `Use Document Structurer AI for ${titleText.toLowerCase()}. Turn messy notes into structured summaries, reports and action items.`,
    heading: titleText,
    intro: `Document Structurer AI helps with ${titleText.toLowerCase()} by turning rough notes into structured summaries, key points and action items.`,
    benefits: [
      `Improves ${titleText.toLowerCase()}`,
      "Turns messy notes into clearer structure",
      "Creates summaries and action items",
      "Saves time after meetings and calls",
    ],
  };
}

function buildFaqData(slug) {
  const titleText = slugTitle(slug).toLowerCase();

  const emailFaqs = {
    "rewrite-email": [
      {
        question: "What is an AI email rewriter?",
        answer:
          "An AI email rewriter improves rough drafts by making them clearer, more professional, and easier to send.",
      },
      {
        question: "Can AI rewrite informal emails professionally?",
        answer:
          "Yes, AI can turn casual or messy email drafts into more polished and professional messages.",
      },
      {
        question: "Who is this tool useful for?",
        answer:
          "It is useful for freelancers, business owners, employees, and anyone who sends work emails regularly.",
      },
      {
        question: "Does it save time?",
        answer:
          "Yes, it reduces the time spent manually rewriting and improving email drafts.",
      },
    ],
    "professional-email-generator": [
      {
        question: "What is a professional email generator?",
        answer:
          "A professional email generator helps create better email wording for work, client messages, and formal communication.",
      },
      {
        question: "Can it help with business emails?",
        answer:
          "Yes, it is especially useful for business emails, follow-ups, requests, and customer communication.",
      },
      {
        question: "Do I need writing skills to use it?",
        answer:
          "No, you can start with a rough message and let AI improve the wording and structure.",
      },
      {
        question: "Why use AI for professional emails?",
        answer:
          "AI helps you write faster, sound more polished, and reduce errors in important messages.",
      },
    ],
    "fix-email-mistakes": [
      {
        question: "What kinds of mistakes can AI fix in emails?",
        answer:
          "AI can improve grammar, clarity, wording, and tone in rushed or weak email drafts.",
      },
      {
        question: "Can AI make an email sound more professional?",
        answer:
          "Yes, it can rewrite unclear messages into more polished and professional emails.",
      },
      {
        question: "Is this useful for client communication?",
        answer:
          "Yes, it helps improve client emails and reduces the risk of sounding unclear or too casual.",
      },
      {
        question: "Can it save editing time?",
        answer:
          "Yes, it reduces the need to manually rewrite and proofread emails before sending.",
      },
    ],
    "improve-email-tone": [
      {
        question: "Why does email tone matter?",
        answer:
          "Tone affects how your message is received and can influence trust, clarity, and professionalism.",
      },
      {
        question: "Can AI make emails sound more polite?",
        answer:
          "Yes, AI can adjust tone so messages sound more respectful and polished.",
      },
      {
        question: "Is this useful for sensitive emails?",
        answer:
          "Yes, it is useful when you want to avoid sounding too blunt, aggressive, or awkward.",
      },
      {
        question: "Does it help with business communication?",
        answer:
          "Yes, it improves tone for work emails, client replies, and professional follow-ups.",
      },
    ],
    "ai-email-assistant": [
      {
        question: "What is an AI email assistant?",
        answer:
          "An AI email assistant helps rewrite rough drafts into cleaner and more professional emails.",
      },
      {
        question: "How does it help save time?",
        answer:
          "It reduces the time spent rewriting and improving emails manually.",
      },
      {
        question: "Who should use an AI email assistant?",
        answer:
          "It is useful for professionals, freelancers, contractors, founders, and small business owners.",
      },
      {
        question: "Can it improve email quality?",
        answer:
          "Yes, it helps improve structure, tone, clarity, and readability.",
      },
    ],
  };

  if (emailFaqs[slug]) {
    return emailFaqs[slug];
  }

  return [
    {
      question: `What is ${titleText}?`,
      answer: `${slugTitle(slug)} helps organize messy notes into summaries, key points and action items.`,
    },
    {
      question: "How does AI organize notes?",
      answer:
        "AI analyzes raw text, detects important information and structures it into clear sections and summaries.",
    },
    {
      question: "Can AI convert notes into reports?",
      answer:
        "Yes, AI can convert messy notes into structured reports, summaries and follow-up tasks.",
    },
    {
      question: "Who can use this tool?",
      answer:
        "Founders, freelancers, consultants, students and teams who want to organize notes quickly.",
    },
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
            {slugTitle(slug)}
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
        <a href="/seo/rewrite-email">Rewrite Email</a>
<a href="/seo/professional-email-generator">Professional Email Generator</a>
<a href="/seo/fix-email-mistakes">Fix Email Mistakes</a>
<a href="/seo/improve-email-tone">Improve Email Tone</a>
<a href="/seo/ai-email-assistant">AI Email Assistant</a>

      </div>

    </div>
  );
}
