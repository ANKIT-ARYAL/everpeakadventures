/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, UserCheck, UserX, KeyRound, Copy, Check, Search, X } from "lucide-react";
import { useAdminPerms } from "../AdminPermsContext";
import { hasPerm } from "@/lib/permissions";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";
import AdminPageLayout from "../components/AdminPageLayout";


type RoleRef = { id: string; name: string };
type UserRow = {
  id: string;
  username: string;
  email: string | null;
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
  email: string;
  name: string;
  roleId: string;
  active: boolean;
  password: string;
}

const EMPTY_FORM: FormState = { username: "", email: "", name: "", roleId: "", active: true, password: "" };

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
  const [searchQuery, setSearchQuery] = useState("");

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
      email: user.email ?? "",
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
            email: form.email || null,
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
            email: form.email || null,
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

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.username.toLowerCase().includes(q) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.name && u.name.toLowerCase().includes(q))
    );
  });

  const tableRows = filteredUsers.map((user) => [
    <span key="u" className="font-bold text-[#112233] break-words">{user.username}</span>,
    <span key="e" className="text-gray-600 break-all">{user.email || "—"}</span>,
    <span key="n" className="text-gray-600 font-medium break-words">{user.name || "—"}</span>,
    <span key="r" className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full text-xs uppercase tracking-wider whitespace-nowrap">
      {roleName(user.roleId)}
    </span>,
    <span
      key="s"
      className={`inline-flex items-center gap-1 font-bold text-xs uppercase tracking-wider px-2.5 py-1 rounded-full whitespace-nowrap ${
        user.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      {user.active ? "Active" : "Inactive"}
    </span>,
    <span key="l" className="text-gray-500 whitespace-nowrap text-xs">
      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Never"}
    </span>,
    <div key="a" className="flex items-center justify-end gap-1.5 whitespace-nowrap">
      {canEdit && (
        <>
          <button type="button" onClick={() => openEdit(user)} title="Edit User" className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button type="button" onClick={() => resetPassword(user)} title="Reset Password" className="p-1.5 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors">
            <KeyRound className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toggleActive(user)}
            title={user.active ? "Deactivate" : "Activate"}
            className={`p-1.5 rounded-lg transition-colors ${user.active ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
          >
            {user.active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
          </button>
        </>
      )}
      {canDelete && (
        <button type="button" onClick={() => handleDelete(user)} title="Delete User" className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="Users"
      description="Create admin accounts, assign roles, and control access."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {users.length} users
          </span>
          {canCreate && (
            <button
              type="button"
              onClick={openCreate}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 uppercase tracking-wider whitespace-nowrap transition-colors"
            >
              <Plus className="w-4 h-4" /> Add User
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-6 pb-10 min-w-0">
        {(formOpen || revealedPassword) && (
          <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto border border-gray-100 animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-[#112233] oswald uppercase tracking-wide">
                  {revealedPassword ? "Credentials" : isEdit ? "Edit User" : "Create User"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setFormOpen(false);
                    setRevealedPassword(null);
                  }}
                  className="w-8 h-8 rounded-lg bg-gray-200/60 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {revealedPassword && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                    <p className="font-bold text-emerald-800 mb-1 text-sm">User created successfully!</p>
                    <p className="text-emerald-700 text-xs mb-3">
                      Share these credentials once — the password is shown now only:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white border border-emerald-200 rounded-lg px-3 py-2 text-base font-black text-emerald-900 break-all">
                        {revealedPassword}
                      </code>
                      <button
                        type="button"
                        onClick={copyPassword}
                        className="p-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shrink-0"
                        title="Copy password"
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setRevealedPassword(null)}
                      className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg uppercase tracking-wider transition-colors"
                    >
                      Done
                    </button>
                  </div>
                )}

                {formOpen && !revealedPassword && (
                  <>
                    {formError && (
                      <p className="bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-2.5 font-semibold text-xs sm:text-sm">
                        {formError}
                      </p>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="user-username">
                        Username *
                      </label>
                      <input
                        id="user-username"
                        type="text"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                        placeholder="e.g. johndoe"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="user-email">
                        Email
                      </label>
                      <input
                        id="user-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                        placeholder="Required for password resets"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="user-name">
                        Display Name
                      </label>
                      <input
                        id="user-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                        placeholder="Optional"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="user-role">
                        Role *
                      </label>
                      <select
                        id="user-role"
                        value={form.roleId}
                        onChange={(e) => setForm({ ...form, roleId: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed] bg-white"
                      >
                        <option value="">Select a role…</option>
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                      {roles.length === 0 && (
                        <p className="text-xs text-amber-600 mt-1 font-semibold">
                          No roles yet — create a role first.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="user-password">
                        Password
                      </label>
                      <input
                        id="user-password"
                        type="text"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                        placeholder={isEdit ? "Leave blank to keep current" : "Leave blank to auto-generate"}
                      />
                    </div>

                    <label className="flex items-center gap-2.5 font-bold text-gray-700 text-sm cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={form.active}
                        onChange={(e) => setForm({ ...form, active: e.target.checked })}
                        className="w-4 h-4 accent-[#2271b1]"
                      />
                      Active (can sign in)
                    </label>
                  </>
                )}
              </div>

              {formOpen && !revealedPassword && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
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
                    {busy ? "Saving…" : isEdit ? "Save Changes" : "Create User"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {loadError && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 font-semibold text-sm">{loadError}</div>
        )}

        {/* Filter / Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({filteredUsers.length})
          </span>
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        <ResponsiveTable
          headers={['Username', 'Email', 'Name', 'Role', 'Status', 'Last Login', 'Actions']}
          rows={tableRows}
          data={filteredUsers}
          emptyText="No users found."
          columnClassNames={['w-[180px]', 'w-[220px]', 'w-[180px]', 'w-32 whitespace-nowrap', 'w-28 text-center whitespace-nowrap', 'w-32 whitespace-nowrap', 'text-right whitespace-nowrap']}
          mobileCards={(_row, data) => {
            const user = data as UserRow;
            return (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold text-[#112233] text-base sm:text-lg truncate">{user.username}</span>
                    <span className="block text-[#24a0ed] text-xs font-semibold truncate mt-0.5">{user.email || "No email"}</span>
                    <span className="block text-gray-500 text-xs truncate mt-0.5">{user.name || "No display name"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-xs">
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Role</span>
                    <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-full text-xs uppercase tracking-wider inline-block">
                      {roleName(user.roleId)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Status</span>
                    <span className={`font-bold text-xs uppercase tracking-wider px-2.5 py-1 rounded-full inline-block ${user.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                  {canEdit && (
                    <>
                      <button type="button" onClick={() => openEdit(user)} title="Edit" className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => resetPassword(user)} title="Reset Password" className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors">
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => toggleActive(user)} title={user.active ? "Deactivate" : "Activate"} className={`p-2 rounded-lg transition-colors ${user.active ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                        {user.active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </button>
                    </>
                  )}
                  {canDelete && (
                    <button type="button" onClick={() => handleDelete(user)} title="Delete" className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          }}
        />
      </div>
    </AdminPageLayout>
  );
}