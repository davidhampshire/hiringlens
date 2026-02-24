import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/submit", "/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
