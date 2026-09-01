"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { LEAD_STATUSES, COMPANY_SIZES } from "@/lib/constants";

export default function FilterBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(key, value) : params.delete(key);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  }, [searchParams, router, pathname]);

  const clearAll = () => startTransition(() => router.push(pathname));
  const hasFilters = ["search", "status", "size", "from", "to"].some((k) => searchParams.has(k));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap gap-3 items-end">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
        <input type="text" placeholder="Name, company, or email…" defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => update("search", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
        <select value={searchParams.get("status") ?? ""} onChange={(e) => update("status", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Company Size</label>
        <select value={searchParams.get("size") ?? ""} onChange={(e) => update("size", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">All sizes</option>
          {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
        <input type="date" value={searchParams.get("from") ?? ""} onChange={(e) => update("from", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
        <input type="date" value={searchParams.get("to") ?? ""} onChange={(e) => update("to", e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      {hasFilters && (
        <button onClick={clearAll} className="text-sm text-gray-500 hover:text-gray-700 underline py-1.5">Clear all</button>
      )}
    </div>
  );
}
