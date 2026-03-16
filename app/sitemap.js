import { seoPages } from "../data/seoPages";

export default function sitemap() {
  const baseUrl = "https://document-structurer-ai.vercel.app";

  const mainPages = [
    {
      url: baseUrl,
      lastModified: new Date()
    }
  ];

  const seoEntries = Object.keys(seoPages).map((slug) => ({
    url: `${baseUrl}/seo/${slug}`,
    lastModified: new Date()
  }));

  return [...mainPages, ...seoEntries];
}