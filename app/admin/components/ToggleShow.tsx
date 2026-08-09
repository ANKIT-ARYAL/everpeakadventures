"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAdminPerms } from "../AdminPermsContext";
import { hasPerm } from "@/lib/permissions";

interface ToggleShowProps {
  /** Toggle API model key, e.g. "treks" or "hero-content" */
  model: string;
  /** Permission resource, e.g. "treks" or "hero-content" */
  resource: string;
  /** Row id, or "__single__" for single-instance sections */
  id: string;
  published: boolean;
}

export default function ToggleShow({ model, resource, id, published }: ToggleShowProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { isSuperAdmin, permissions } = useAdminPerms();

  if (!isSuperAdmin && !hasPerm(permissions, resource, "edit")) {
    return null;
  }

  const handleToggle = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/toggle", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, id, published: !published }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={busy}
      title={published ? "Hide from frontend" : "Show on frontend"}
      aria-label={published ? "Hide from frontend" : "Show on frontend"}
      className={`inline-flex items-center gap-1 px-2 py-1.5 rounded transition-colors ${published ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"} disabled:opacity-50`}
    >
      {published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      <span className={`hidden md:inline text-xs font-medium ${published ? "" : ""}`}>
        {published ? "Hide" : "Show"}
      </span>
    </button>
  );
}