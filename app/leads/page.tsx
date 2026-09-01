export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { dbQuery, buildLeadsQuery, type Lead } from "@/lib/db";
import FilterBar from "@/components/FilterBar";
import LeadsTable from "@/components/LeadsTable";
import NavBar from "@/components/NavBar";
import { Suspense } from "react";

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

function str(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

async function LeadsContent({ searchParams }: PageProps) {
  const { query, params } = buildLeadsQuery({
    search: str(searchParams.search),
    status: str(searchParams.status),
    size: str(searchParams.size),
    from: str(searchParams.from),
    to: str(searchParams.to),
  });
  const leads = (await dbQuery(query, params)) as Lead[];
  return <LeadsTable leads={leads} />;
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const exportQs = new URLSearchParams(
    Object.entries(searchParams).flatMap(([k, v]) => v == null ? [] : [[k, str(v) ?? ""]])
  ).toString();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar exportHref={`/api/leads/export${exportQs ? `?${exportQs}` : ""}`} />
      <main className="px-6 py-6 max-w-screen-xl mx-auto">
        <Suspense>
          <FilterBar />
        </Suspense>
        <Suspense fallback={<div className="text-center py-20 text-gray-400 text-sm">Loading leads…</div>}>
          <LeadsContent searchParams={searchParams} />
        </Suspense>
      </main>
    </div>
  );
}
