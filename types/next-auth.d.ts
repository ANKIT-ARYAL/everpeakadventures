import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      username?: string;
      role?: string | null;
      roleId?: string | null;
      isSuperAdmin?: boolean;
      permissions?: string[];
    };
  }

  interface User {
    username?: string;
    role?: string | null;
    roleId?: string | null;
    isSuperAdmin?: boolean;
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    username?: string;
    role?: string | null;
    roleId?: string | null;
    isSuperAdmin?: boolean;
    permissions?: string[];
    authTime?: number;
  }
}