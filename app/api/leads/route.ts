import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbQuery, buildLeadsQuery } from "@/lib/db";

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

  const leads = await dbQuery(query, params);
  return NextResponse.json({ leads });
}
