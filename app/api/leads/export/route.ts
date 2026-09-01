import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbQuery, buildLeadsQuery } from "@/lib/db";
import { type Lead } from "@/lib/constants";

function escapeCsv(value: string | boolean | null | undefined): string {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const { query, params } = buildLeadsQuery({
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    size: searchParams.get("size") ?? undefined,
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
  });

  const leads = (await dbQuery(query, params)) as Lead[];
  const headers = ["ID", "Name", "Company", "Email", "Phone", "Company Size", "Message", "Marketing Consent", "Data Processing Consent", "Status", "Submitted At"];
  const rows = leads.map((l) => [
    l.id, escapeCsv(l.name), escapeCsv(l.company), escapeCsv(l.email), escapeCsv(l.phone),
    escapeCsv(l.size), escapeCsv(l.message), escapeCsv(l.consent_marketing),
    escapeCsv(l.consent_data), escapeCsv(l.status), new Date(l.created_at).toISOString(),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const filename = `trustfabric-leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
