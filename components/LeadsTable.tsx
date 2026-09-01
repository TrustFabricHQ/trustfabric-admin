"use client";

import { useState, useTransition } from "react";
import { type Lead, type LeadStatus, LEAD_STATUSES } from "@/lib/constants";

const STATUS_COLORS: Record<LeadStatus, string> = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-yellow-100 text-yellow-800",
  Qualified: "bg-green-100 text-green-800",
  Closed: "bg-gray-100 text-gray-600",
};

function StatusCell({ lead }: { lead: Lead }) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [saving, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as LeadStatus;
    startTransition(async () => {
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) setStatus(next);
    });
  }

  return (
    <select value={status} onChange={handleChange} disabled={saving}
      className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 ${STATUS_COLORS[status]} ${saving ? "opacity-50" : ""}`}>
      {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

function Dot({ on, label }: { on: boolean; label: string }) {
  return <span title={label} className={`inline-block w-2.5 h-2.5 rounded-full ${on ? "bg-green-500" : "bg-gray-300"}`} />;
}

function truncate(s: string | null | undefined, n = 60): string {
  if (!s) return "—";
  return s.length > n ? s.slice(0, n) + "…" : s;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return <div className="bg-white border border-gray-200 rounded-xl py-20 text-center text-gray-400 text-sm">No leads found.</div>;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 text-xs text-gray-500">{leads.length} lead{leads.length !== 1 ? "s" : ""}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Message</th>
              <th className="px-4 py-3 text-center" title="Marketing communications consent">Mktg</th>
              <th className="px-4 py-3 text-center" title="Data processing consent (DPDP)">DPDP</th>
              <th className="px-4 py-3 text-left">Submitted</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{lead.name}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{lead.company}</td>
                <td className="px-4 py-3 text-gray-700">
                  <a href={`mailto:${lead.email}`} className="hover:text-blue-600">{lead.email}</a>
                </td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{lead.phone}</td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{lead.size ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500 max-w-xs"><span title={lead.message ?? undefined}>{truncate(lead.message)}</span></td>
                <td className="px-4 py-3 text-center"><Dot on={lead.consent_marketing} label={lead.consent_marketing ? "Agreed to marketing" : "No marketing consent"} /></td>
                <td className="px-4 py-3 text-center"><Dot on={lead.consent_data} label={lead.consent_data ? "Agreed to data processing" : "No data consent"} /></td>
                <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">{formatDate(lead.created_at)}</td>
                <td className="px-4 py-3"><StatusCell lead={lead} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-400 flex gap-4">
        <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />Consented</span>
        <span><span className="inline-block w-2 h-2 rounded-full bg-gray-300 mr-1" />Not consented</span>
        <span className="mx-2 text-gray-300">|</span>
        <span><strong>Mktg</strong> = Marketing &nbsp;<strong>DPDP</strong> = Data processing</span>
      </div>
    </div>
  );
}
