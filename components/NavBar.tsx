"use client";
import { signOut } from "next-auth/react";

export default function NavBar({ exportHref }: { exportHref: string }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="TrustFabric" className="h-8 w-auto" />
        <p className="text-xs text-gray-400 border-l border-gray-200 pl-3">Lead Management</p>
      </div>
      <div className="flex items-center gap-3">
        <a href={exportHref} className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">Export CSV</a>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Sign Out</button>
      </div>
    </header>
  );
}
