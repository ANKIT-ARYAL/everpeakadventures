"use client";

import React, { createContext, useContext } from "react";

export interface AdminPermsValue {
  isSuperAdmin: boolean;
  permissions: string[];
}

const AdminPermsContext = createContext<AdminPermsValue>({
  isSuperAdmin: false,
  permissions: [],
});

export function AdminPermsProvider({
  value,
  children,
}: {
  value: AdminPermsValue;
  children: React.ReactNode;
}) {
  return <AdminPermsContext.Provider value={value}>{children}</AdminPermsContext.Provider>;
}

export function useAdminPerms() {
  return useContext(AdminPermsContext);
}