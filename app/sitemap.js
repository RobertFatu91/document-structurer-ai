import { seoKeywords } from "../data/seoKeywords";

const clusterSlugs = [
  "meeting-notes-tools",
  "messy-notes-tools",
  "notes-conversion-tools"
];

export default function sitemap() {
  const baseUrl = "https://document-structurer-ai.vercel.app";

  const seoUrls = seoKeywords.map((slug) => ({
    url: `${baseUrl}/seo/${slug}`,
    lastModified: new Date()
  }));

  const clusterUrls = clusterSlugs.map((slug) => ({
    url: `${baseUrl}/clusters/${slug}`,
    lastModified: new Date()
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    ...clusterUrls,
    ...seoUrls
  ];
}