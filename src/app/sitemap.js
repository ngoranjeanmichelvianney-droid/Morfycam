// app/sitemap.js
export default function sitemap() {
  const base = "https://morfycam.com";

  const pages = [
    { url: "", priorite: 1.0, frequence: "weekly" },
    { url: "/login", priorite: 0.5, frequence: "monthly" },
    { url: "/register", priorite: 0.8, frequence: "monthly" },
  ];

  return pages.map((page) => ({
    url: `${base}${page.url}`,
    lastModified: new Date(),
    changeFrequency: page.frequence,
    priority: page.priorite,
  }));
}