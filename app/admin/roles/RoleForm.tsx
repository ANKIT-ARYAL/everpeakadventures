/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo, useState } from "react";
import { Save, X } from "lucide-react";
import { PERMISSION_RESOURCES, type PermAction } from "@/lib/permissions";

interface RoleFormProps {
  initial?: { id?: string; name: string; description: string | null; permissions: string[] };
  onClose: () => void;
  onSaved: () => void;
}

const ACTION_LABELS: Record<PermAction, string> = {
  view: "View",
  create: "Add",
  edit: "Edit",
  delete: "Delete",
};

export default function RoleForm({ initial, onClose, onSaved }: RoleFormProps) {
  const isEdit = !!initial?.id;
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [keys, setKeys] = useState<string[]>(initial?.permissions ?? []);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const groups = useMemo(() => {
    const map = new Map<string, typeof PERMISSION_RESOURCES>();
    for (const res of PERMISSION_RESOURCES) {
      if (!map.has(res.group)) map.set(res.group, []);
      map.get(res.group)!.push(res);
    }
    return Array.from(map.entries());
  }, []);

  const has = (key: string) => keys.includes(key);
  const setKey = (key: string, on: boolean) =>
    setKeys((prev) => (on ? (prev.includes(key) ? prev : [...prev, key]) : prev.filter((k) => k !== key)));
  const setResourceKeys = (resourceKey: string, actions: PermAction[], on: boolean) => {
    setKeys((prev) => {
      const target = actions.map((a) => `${resourceKey}:${a}`);
      const next = on ? Array.from(new Set([...prev, ...target])) : prev.filter((k) => !target.includes(k));
      return next;
    });
  };
  const isSectionFull = (resKey: string, actions: PermAction[]) => actions.every((a) => has(`${resKey}:${a}`));

  const handleSave = async () => {
    setError("");
    if (!name.trim()) {
      setError("Role name is required.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/roles${isEdit ? `/${initial.id}` : ""}`, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, permissions: keys }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save role");
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save role");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden my-auto border border-gray-100 flex flex-col max-h-[92vh] animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-black text-[#112233] oswald uppercase tracking-wide">
            {isEdit ? "Edit Role" : "Create Role"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-200/60 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm">
          {error && (
            <p className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2.5 font-semibold text-xs sm:text-sm">
              {error}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="role-name">
                Role Name *
              </label>
              <input
                id="role-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                placeholder="e.g. Content Editor"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="role-desc">
                Description
              </label>
              <input
                id="role-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                placeholder="Optional summary of this role"
              />
            </div>
          </div>

          <div className="bg-[#f8f9fa] border border-gray-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-3">
              <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs">
                Permissions
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setKeys(PERMISSION_RESOURCES.flatMap((r) => r.actions.map((a) => `${r.key}:${a}`)))}
                  className="font-bold text-[#24a0ed] hover:underline cursor-pointer"
                >
                  Select all
                </button>
                <span className="text-gray-300">·</span>
                <button
                  type="button"
                  onClick={() => setKeys([])}
                  className="font-bold text-gray-500 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {groups.map(([groupLabel, resources]) => (
                <div key={groupLabel}>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2">{groupLabel}</h4>
                  <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-sm">
                    {resources.map((res) => {
                      const full = isSectionFull(res.key, res.actions);
                      return (
                        <div key={res.key} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-gray-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2.5 font-bold text-[#112233] min-w-0 cursor-pointer text-sm">
                              <input
                                type="checkbox"
                                checked={full}
                                onChange={(e) => setResourceKeys(res.key, res.actions, e.target.checked)}
                                className="w-4 h-4 accent-[#2271b1] cursor-pointer"
                              />
                              <span className="truncate">{res.label}</span>
                            </label>
                            <span className="text-[10px] text-gray-400 bg-gray-100 rounded px-1.5 py-0.5 hidden sm:inline font-mono">
                              {res.key}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 pl-6 sm:pl-0">
                            {res.actions.map((action) => (
                              <label key={action} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer font-medium">
                                <input
                                  type="checkbox"
                                  checked={has(`${res.key}:${action}`)}
                                  onChange={(e) => setKey(`${res.key}:${action}`, e.target.checked)}
                                  className="w-3.5 h-3.5 accent-[#f59e0b] cursor-pointer"
                                />
                                {ACTION_LABELS[action]}
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 font-bold hover:bg-gray-50 text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={busy}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 uppercase tracking-wider disabled:opacity-60 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" /> {busy ? "Saving..." : (isEdit ? "Update Role" : "Create Role")}
          </button>
        </div>
      </div>
    </div>
  );
}