import { neon } from "@neondatabase/serverless";
export type { Lead, LeadStatus } from "./constants";
export { LEAD_STATUSES, COMPANY_SIZES } from "./constants";

function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export interface LeadFilters {
  search?: string;
  status?: string;
  size?: string;
  from?: string;
  to?: string;
}

export function buildLeadsQuery(filters: LeadFilters): {
  query: string;
  params: (string | number)[];
} {
  const conditions: string[] = [];
  const params: (string | number)[] = [];
  let p = 1;

  if (filters.search) {
    conditions.push(`(name ILIKE $${p} OR company ILIKE $${p} OR email ILIKE $${p})`);
    params.push(`%${filters.search}%`);
    p++;
  }
  if (filters.status) {
    conditions.push(`status = $${p++}`);
    params.push(filters.status);
  }
  if (filters.size) {
    conditions.push(`size = $${p++}`);
    params.push(filters.size);
  }
  if (filters.from) {
    conditions.push(`created_at >= $${p++}`);
    params.push(filters.from);
  }
  if (filters.to) {
    conditions.push(`created_at < ($${p++}::date + interval '1 day')`);
    params.push(filters.to);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  return {
    query: `SELECT * FROM leads ${where} ORDER BY created_at DESC`,
    params,
  };
}

export async function dbQuery(query: string, params: (string | number)[] = []) {
  return getDb()(query, params);
}
