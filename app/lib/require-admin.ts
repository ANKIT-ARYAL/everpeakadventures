import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { hasPerm, type PermAction } from "@/lib/permissions";

function unauthorized() {
  return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}

function forbidden() {
  return NextResponse.json(
    { error: "Forbidden" },
    { status: 403, headers: { "Content-Type": "application/json" } }
  );
}

/**
 * Guard for admin API routes.
 *
 * - If `resource` is omitted, only requires a logged-in admin (legacy behavior).
 * - If `resource` is provided, requires the matching permission action
 *   (env super-admin bypasses all permission checks).
 */
export async function requireAdmin(
  resource?: string,
  action: PermAction = "view"
) {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  if (!resource) {
    return null;
  }

  if (session.user.isSuperAdmin) {
    return null;
  }

  if (hasPerm(session.user.permissions, resource, action)) {
    return null;
  }

  return forbidden();
}

export { unauthorized, forbidden };