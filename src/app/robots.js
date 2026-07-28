// app/robots.js
export default function robots() {
  const base = "https://morfycam.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/api"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}