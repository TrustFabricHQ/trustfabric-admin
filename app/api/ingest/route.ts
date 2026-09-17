import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";

// Secret token so only the marketing site can call this
const INGEST_SECRET = process.env.INGEST_SECRET;

export async function POST(req: NextRequest) {
  // Verify shared secret header
  const auth = req.headers.get("x-ingest-secret");
  if (!INGEST_SECRET || auth !== INGEST_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, company, email, phone, size, message, consentMarketing, consentData } = body;

  if (!name || !company || !email || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  await dbQuery(
    `INSERT INTO leads (name, company, email, phone, size, message, consent_marketing, consent_data)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [name, company, email, phone, size || null, message || null, !!consentMarketing, !!consentData]
  );

  return NextResponse.json({ ok: true });
}
