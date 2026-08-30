/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ShieldCheck, Search } from "lucide-react";
import RoleForm from "./RoleForm";
import { useAdminPerms } from "../AdminPermsContext";
import { hasPerm } from "@/lib/permissions";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";
import AdminPageLayout from "../components/AdminPageLayout";


type RoleRow = {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
  _count: { users: number };
};

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loadError, setLoadError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RoleRow | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { isSuperAdmin, permissions } = useAdminPerms();
  const canCreate = isSuperAdmin || hasPerm(permissions, "roles", "create");
  const canEdit = isSuperAdmin || hasPerm(permissions, "roles", "edit");
  const canDelete = isSuperAdmin || hasPerm(permissions, "roles", "delete");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/roles");
      const data = await res.json();
      if (res.ok && data.success) setRoles(data.data);
      else setLoadError(data.error || "Failed to load roles");
    } catch {
      setLoadError("Failed to load roles");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (role: RoleRow) => {
    setEditing(role);
    setFormOpen(true);
  };

  const handleSaved = () => {
    setFormOpen(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (role: RoleRow) => {
    if (!confirm(`Delete role "${role.name}"?`)) return;
    const res = await fetch(`/api/admin/roles/${role.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Failed to delete role");
      return;
    }
    load();
  };

  const filteredRoles = roles.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q))
    );
  });

  const tableRows = filteredRoles.map((role) => [
    <span key="r" className="font-bold text-[#112233] flex items-center gap-2 break-words">
      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /> {role.name}
    </span>,
    <span key="d" className="text-gray-600 font-medium block max-w-xs break-words">{role.description || "—"}</span>,
    <span key="p" className="font-bold text-gray-700 whitespace-nowrap">{role.permissions.length}</span>,
    <span key="u" className="font-bold text-gray-700 whitespace-nowrap">{role._count.users}</span>,
    <div key="a" className="flex items-center justify-end gap-1.5 whitespace-nowrap">
      {canEdit && (
        <button type="button" onClick={() => openEdit(role)} title="Edit Role" className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
      )}
      {canDelete && (
        <button type="button" onClick={() => handleDelete(role)} title="Delete Role" className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="Roles"
      description="Roles define which admin sections and actions your users can access."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {roles.length} roles
          </span>
          {canCreate && (
            <button
              type="button"
              onClick={openCreate}
              className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 uppercase tracking-wider whitespace-nowrap transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Role
            </button>
          )}
        </div>
      }
    >
      <div className="space-y-6 pb-10 min-w-0">
        {formOpen && (
          <RoleForm
            initial={editing
              ? { id: editing.id, name: editing.name, description: editing.description, permissions: editing.permissions }
              : undefined}
            onClose={() => {
              setFormOpen(false);
              setEditing(null);
            }}
            onSaved={handleSaved}
          />
        )}

        {loadError && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 font-semibold text-sm">
            {loadError}
          </div>
        )}

        {/* Filter / Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({filteredRoles.length})
          </span>
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        <ResponsiveTable
          headers={['Role', 'Description', 'Permissions', 'Users', 'Actions']}
          rows={tableRows}
          data={filteredRoles}
          emptyText="No roles found."
          columnClassNames={['w-[220px]', 'w-[350px]', 'w-28 text-center whitespace-nowrap', 'w-24 text-center whitespace-nowrap', 'text-right whitespace-nowrap']}
          mobileCards={(_row, data) => {
            const role = data as RoleRow;
            return (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="font-bold text-[#112233] text-base sm:text-lg truncate">{role.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {canEdit && (
                      <button type="button" onClick={() => openEdit(role)} title="Edit" className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    {canDelete && (
                      <button type="button" onClick={() => handleDelete(role)} title="Delete" className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mt-2 text-xs sm:text-sm line-clamp-3 break-words">{role.description || "No description"}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-xs">
                  <span className="font-bold text-gray-500">{role.permissions.length} permissions</span>
                  <span className="font-bold text-gray-500">
                    {role._count.users} user{role._count.users === 1 ? "" : "s"}
                  </span>
                </div>
              </div>
            );
          }}
        />
      </div>
    </AdminPageLayout>
  );
}