import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Company } from "@/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data } = await supabase
    .from("companies")
    .select("*")
    .order("updated_at", { ascending: false });

  const companies = (data ?? []) as Company[];

  const companyUrls = companies.map((company) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com"}/company/${company.slug}`,
    lastModified: new Date(company.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://hiringlens.com"}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...companyUrls,
  ];
}
