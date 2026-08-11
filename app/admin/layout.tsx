import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { resolveResourceForPath, hasPerm } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";
import AdminShell from "./AdminShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/admin";

  const session = await auth();

  if (pathname === "/admin/login") {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex font-sans text-gray-800">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  if (!session?.user) {
    redirect(`/admin/login?callbackUrl=${encodeURIComponent(pathname)}`);
  }

  const user = session.user;
  const isSuperAdmin = !!user.isSuperAdmin;
  const permissions = user.permissions ?? [];
  const resource = resolveResourceForPath(pathname);

  if (resource && !isSuperAdmin && !hasPerm(permissions, resource, "view")) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex font-sans text-gray-800">
        <main className="flex-1 p-8">
          <div className="max-w-md mx-auto mt-16 bg-white rounded-xl border border-gray-200 p-8 text-center">
            <h1 className="text-lg font-bold text-[#112233] mb-2">No Access</h1>
            <p className="text-sm text-gray-500">
              Your role does not grant access to this section. Contact an administrator if you
              believe this is a mistake.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const site = await prisma.siteSettings.findFirst().catch(() => null);

  return (
    <AdminShell
      name={user.name ?? user.username ?? "admin"}
      username={user.username ?? user.email ?? "admin"}
      role={user.role ?? null}
      isSuperAdmin={isSuperAdmin}
      permissions={permissions}
      logoImage={site?.logoImage}
    >
      {children}
    </AdminShell>
  );
}