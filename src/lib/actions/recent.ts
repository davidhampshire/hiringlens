"use server";

import { createClient } from "@/lib/supabase/server";

interface FetchParams {
  offset: number;
  limit: number;
  sortBy: "newest" | "oldest" | "highest" | "lowest";
  outcome?: string;
  industry?: string;
  seniority?: string;
  interviewType?: string;
  companyId?: string;
}

export async function fetchFilteredInterviews(params: FetchParams) {
  const supabase = await createClient();

  const { offset, limit, sortBy, outcome, industry, seniority, interviewType, companyId } = params;

  // Determine sort column and direction
  let orderColumn = "created_at";
  let ascending = false;

  if (sortBy === "oldest") {
    orderColumn = "created_at";
    ascending = true;
  } else if (sortBy === "highest" || sortBy === "lowest") {
    // We'll sort by avg rating — Supabase doesn't support computed columns in order,
    // so we fetch and sort client-side for rating sorts
    orderColumn = "created_at";
    ascending = false;
  }

  // Build query — select with or without company join
  let query = companyId
    ? supabase
        .from("interviews")
        .select("*", { count: "exact" })
        .eq("company_id", companyId)
        .eq("status", "approved")
    : supabase
        .from("interviews")
        .select("*, companies(name, slug, industry, logo_url, website_url)", { count: "exact" })
        .eq("status", "approved");

  // Apply filters
  if (outcome && outcome !== "all") {
    query = query.eq("outcome", outcome);
  }
  if (seniority && seniority !== "all") {
    query = query.eq("seniority", seniority);
  }
  if (interviewType && interviewType !== "all") {
    query = query.eq("interview_type", interviewType);
  }
  if (industry && industry !== "all" && !companyId) {
    // Resolve industry → company IDs first.
    // .eq("companies.industry", …) only filters the embedded relation object —
    // it does NOT exclude parent interview rows, so all interviews were returned.
    const { data: industryCompanies } = await supabase
      .from("companies")
      .select("id")
      .eq("industry", industry);
    const ids = (industryCompanies ?? []).map((c: { id: string }) => c.id);
    if (ids.length === 0) return { data: [], count: 0 };
    query = query.in("company_id", ids);
  }

  // For rating sorts, fetch all and sort client-side
  if (sortBy === "highest" || sortBy === "lowest") {
    query = query.order(orderColumn, { ascending });
    const { data, count } = await query;

    if (!data) return { data: [], count: 0 };

    // Sort by average rating
    const sorted = [...data].sort((a, b) => {
      const avgA =
        ((a as Record<string, number>).professionalism_rating +
          (a as Record<string, number>).communication_rating +
          (a as Record<string, number>).clarity_rating +
          (a as Record<string, number>).fairness_rating) /
        4;
      const avgB =
        ((b as Record<string, number>).professionalism_rating +
          (b as Record<string, number>).communication_rating +
          (b as Record<string, number>).clarity_rating +
          (b as Record<string, number>).fairness_rating) /
        4;
      return sortBy === "highest" ? avgB - avgA : avgA - avgB;
    });

    return {
      data: sorted.slice(offset, offset + limit),
      count: count ?? 0,
    };
  }

  // Standard paginated query
  query = query
    .order(orderColumn, { ascending })
    .range(offset, offset + limit - 1);

  const { data, count } = await query;

  return {
    data: data ?? [],
    count: count ?? 0,
  };
}
