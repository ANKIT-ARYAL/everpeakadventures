"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, UserCheck, UserX, KeyRound, Copy, Check } from "lucide-react";
import { useAdminPerms } from "../AdminPermsContext";
import { hasPerm } from "@/lib/permissions";

type RoleRef = { id: string; name: string };
type UserRow = {
  id: string;
  username: string;
  name: string | null;
  roleId: string;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  role: RoleRef;
};

interface FormState {
  id?: string;
  username: string;
  name: string;
  roleId: string;
  active: boolean;
  password: string;
}

const EMPTY_FORM: FormState = { username: "", name: "", roleId: "", active: true, password: "" };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleRef[]>([]);
  const [loadError, setLoadError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [isEdit, setIsEdit] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [revealedPassword, setRevealedPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { isSuperAdmin, permissions } = useAdminPerms();
  const canCreate = isSuperAdmin || hasPerm(permissions, "users", "create");
  const canEdit = isSuperAdmin || hasPerm(permissions, "users", "edit");
  const canDelete = isSuperAdmin || hasPerm(permissions, "users", "delete");

  const load = useCallback(async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/roles"),
      ]);
      const u = await usersRes.json();
      const r = await rolesRes.json();
      if (usersRes.ok && u.success) setUsers(u.data);
      else setLoadError(u.error || "Failed to load users");
      if (rolesRes.ok && r.success) setRoles(r.data);
    } catch {
      setLoadError("Failed to load users");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setIsEdit(false);
    setFormError("");
    setRevealedPassword(null);
    setFormOpen(true);
  };

  const openEdit = (user: UserRow) => {
    setForm({
      id: user.id,
      username: user.username,
      name: user.name ?? "",
      roleId: user.roleId,
      active: user.active,
      password: "",
    });
    setIsEdit(true);
    setFormError("");
    setRevealedPassword(null);
    setFormOpen(true);
  };

  const handleSave = async () => {
    setFormError("");
    setRevealedPassword(null);

    if (!form.username.trim()) {
      setFormError("Username is required.");
      return;
    }
    if (!form.roleId) {
      setFormError("Please choose a role.");
      return;
    }
    if (!isEdit && !form.password) {
      setFormError("Set a password, or leave blank to auto-generate one.");
      return;
    }

    setBusy(true);
    try {
      if (isEdit) {
        const res = await fetch(`/api/admin/users/${form.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            name: form.name,
            roleId: form.roleId,
            active: form.active,
            password: form.password || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to update user");
        setFormOpen(false);
        load();
      } else {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: form.username,
            name: form.name,
            roleId: form.roleId,
            active: form.active,
            password: form.password || undefined,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to create user");
        if (data.generatedPassword) {
          setRevealedPassword(data.generatedPassword);
        } else {
          setFormOpen(false);
        }
        load();
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async (user: UserRow) => {
    if (!confirm(`Reset password for "${user.username}"? A new password will be generated.`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetPassword: true }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Failed to reset password");
      return;
    }
    // The server regenerates internally; return a fresh password by calling generate? Simpler: prompt a new random.
    setRevealedPassword(data.generatedPassword ?? null);
    load();
  };

  const toggleActive = async (user: UserRow) => {
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !user.active }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Failed to update user");
      return;
    }
    load();
  };

  const handleDelete = async (user: UserRow) => {
    if (!confirm(`Delete user "${user.username}"?`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Failed to delete user");
      return;
    }
    load();
  };

  const copyPassword = async () => {
    if (!revealedPassword) return;
    try {
      await navigator.clipboard.writeText(revealedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const roleName = (roleId: string) => roles.find((r) => r.id === roleId)?.name ?? "—";

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      {(formOpen || revealedPassword) && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-xl w-full max-w-lg my-16 shadow-2xl">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-black text-[#112233] oswald uppercase tracking-wide">
                {revealedPassword ? "Credentials" : isEdit ? "Edit User" : "Create User"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setRevealedPassword(null);
                }}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {revealedPassword && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="font-bold text-emerald-800 mb-1">User created successfully!</p>
                  <p className="text-emerald-700 text-[11px] mb-3">
                    Share these credentials once — the password is shown now only:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-white border border-emerald-200 rounded-lg px-3 py-2 text-sm font-black text-emerald-900 break-all">
                      {revealedPassword}
                    </code>
                    <button
                      type="button"
                      onClick={copyPassword}
                      className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                      title="Copy password"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRevealedPassword(null)}
                    className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg uppercase tracking-wider"
                  >
                    Done
                  </button>
                </div>
              )}

              {formOpen && !revealedPassword && (
                <>
                  {formError && (
                    <p className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2 font-semibold">
                      {formError}
                    </p>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="user-username">
                      Username
                    </label>
                    <input
                      id="user-username"
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="user-name">
                      Display Name
                    </label>
                    <input
                      id="user-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                      placeholder="Optional"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="user-role">
                      Role
                    </label>
                    <select
                      id="user-role"
                      value={form.roleId}
                      onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed] bg-white"
                    >
                      <option value="">Select a role…</option>
                      {roles.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name}
                        </option>
                      ))}
                    </select>
                    {roles.length === 0 && (
                      <p className="text-[11px] text-amber-600 mt-1 font-semibold">
                        No roles yet — create a role first.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="user-password">
                      Password
                    </label>
                    <input
                      id="user-password"
                      type="text"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                      placeholder={isEdit ? "Leave blank to keep current" : "Leave blank to auto-generate"}
                    />
                  </div>

                  <label className="flex items-center gap-2 font-bold text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="accent-[#2271b1]"
                    />
                    Active (can sign in)
                  </label>
                </>
              )}
            </div>

            {formOpen && !revealedPassword && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={busy}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 uppercase tracking-wider disabled:opacity-60"
                >
                  {busy ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Users</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">{users.length} users</span>
          </div>
          <p className="text-gray-500 mt-1">Create admin accounts, assign roles, and control access.</p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={openCreate}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        )}
      </div>

      {loadError && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 font-semibold">{loadError}</div>
      )}

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No users yet.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#fcfcfc] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#112233]">{user.username}</td>
                    <td className="py-3 px-4 text-gray-600 font-medium">{user.name || "—"}</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                        {roleName(user.roleId)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          user.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {user.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never"}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canEdit && (
                          <>
                            <button type="button" onClick={() => openEdit(user)} title="Edit User" className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button type="button" onClick={() => resetPassword(user)} title="Reset Password" className="p-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-100">
                              <KeyRound className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleActive(user)}
                              title={user.active ? "Deactivate" : "Activate"}
                              className={`p-1.5 rounded hover:opacity-80 ${user.active ? "bg-gray-100 text-gray-600" : "bg-emerald-50 text-emerald-600"}`}
                            >
                              {user.active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                            </button>
                          </>
                        )}
                        {canDelete && (
                          <button type="button" onClick={() => handleDelete(user)} title="Delete User" className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {users.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
            No users yet.
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="block font-bold text-[#112233] truncate">{user.username}</span>
                  <span className="block text-gray-500 mt-0.5 text-[11px] truncate">{user.name || "No display name"}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {canEdit && (
                    <>
                      <button type="button" onClick={() => openEdit(user)} title="Edit" className="p-1.5 rounded bg-blue-50 text-blue-600">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => resetPassword(user)} title="Reset Password" className="p-1.5 rounded bg-amber-50 text-amber-600">
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => toggleActive(user)} title={user.active ? "Deactivate" : "Activate"} className={`p-1.5 rounded ${user.active ? "bg-gray-100 text-gray-600" : "bg-emerald-50 text-emerald-600"}`}>
                        {user.active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                      </button>
                    </>
                  )}
                  {canDelete && (
                    <button type="button" onClick={() => handleDelete(user)} title="Delete" className="p-1.5 rounded bg-red-50 text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[11px]">
                <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider">
                  {roleName(user.roleId)}
                </span>
                <span className={`font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${user.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                  {user.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}