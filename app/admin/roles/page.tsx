"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import RoleForm from "./RoleForm";
import { useAdminPerms } from "../AdminPermsContext";
import { hasPerm } from "@/lib/permissions";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";

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

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
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

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Roles</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">{roles.length} roles</span>
          </div>
          <p className="text-gray-500 mt-1">
            Roles define which admin sections and actions your users can access.
          </p>
        </div>
        {canCreate && (
          <button
            type="button"
            onClick={openCreate}
            className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm flex items-center gap-2 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Add Role
          </button>
        )}
      </div>

      {loadError && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 font-semibold">
          {loadError}
        </div>
      )}

      <ResponsiveTable
        headers={['Role', 'Description', 'Permissions', 'Users', 'Actions']}
        rows={roles.map((role) => [
          <span key="r" className="font-bold text-[#112233] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> {role.name}
          </span>,
          <span key="d" className="text-gray-600 font-medium block max-w-xs">{role.description || "—"}</span>,
          <span key="p" className="font-bold text-gray-700">{role.permissions.length}</span>,
          <span key="u" className="font-bold text-gray-700">{role._count.users}</span>,
          <div key="a" className="flex items-center justify-end gap-2">
            {canEdit && (
              <button type="button" onClick={() => openEdit(role)} title="Edit Role" className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {canDelete && (
              <button type="button" onClick={() => handleDelete(role)} title="Delete Role" className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>,
        ])}
        data={roles}
        emptyText="No roles created yet."
        columnClassNames={[undefined, undefined, 'text-center', 'text-center', 'text-right']}
        mobileCards={(_row, data) => {
          const role = data as RoleRow;
          return (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-bold text-[#112233] truncate block">{role.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {canEdit && (
                    <button type="button" onClick={() => openEdit(role)} title="Edit" className="p-1.5 rounded bg-blue-50 text-blue-600">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {canDelete && (
                    <button type="button" onClick={() => handleDelete(role)} title="Delete" className="p-1.5 rounded bg-red-50 text-red-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mt-1 text-[11px] line-clamp-2">{role.description || "No description"}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 text-[11px]">
                <span className="text-gray-500 font-bold">{role.permissions.length} permissions</span>
                <span className="text-gray-500">
                  {role._count.users} user{role._count.users === 1 ? "" : "s"}
                </span>
              </div>
            </>
          );
        }}
      />
    </div>
  );
}