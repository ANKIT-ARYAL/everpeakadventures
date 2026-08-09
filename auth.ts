import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const SESSION_MAX_AGE = 8 * 60 * 60;
const SESSION_ABSOLUTE_MAX_AGE = 24 * 60 * 60;
const SECURE_COOKIES = process.env.NODE_ENV === "production";
const COOKIE_PREFIX = SECURE_COOKIES ? "__Secure-" : "";

// Brute-force protection: max failed attempts for a given username within a window.
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const loginFailures = new Map<string, { count: number; firstAt: number }>();

function isLoginLocked(username: string): boolean {
  const entry = loginFailures.get(username);
  if (!entry) return false;
  if (Date.now() - entry.firstAt >= LOGIN_WINDOW_MS) {
    loginFailures.delete(username);
    return false;
  }
  return entry.count >= MAX_LOGIN_ATTEMPTS;
}

function recordLoginFailure(username: string) {
  const now = Date.now();
  const entry = loginFailures.get(username) || { count: 0, firstAt: now };
  if (now - entry.firstAt >= LOGIN_WINDOW_MS) {
    entry.count = 0;
    entry.firstAt = now;
  }
  entry.count += 1;
  loginFailures.set(username, entry);
}

function clearLoginFailures(username: string) {
  loginFailures.delete(username);
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: SECURE_COOKIES,
  path: "/",
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username as string | undefined;

        if (!username) return null;

        if (isLoginLocked(username)) {
          return null;
        }

        const password = credentials?.password as string | undefined;

        if (
          password &&
          username === process.env.ADMIN_USERNAME &&
          password === process.env.ADMIN_PASSWORD
        ) {
          clearLoginFailures(username);
          return { id: "1", name: username, email: username };
        }

        recordLoginFailure(username);
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  jwt: {
    maxAge: SESSION_MAX_AGE,
  },
  cookies: {
    sessionToken: {
      name: `${COOKIE_PREFIX}next-auth.session-token`,
      options: cookieOptions,
    },
    callbackUrl: {
      name: `${COOKIE_PREFIX}next-auth.callback-url`,
      options: cookieOptions,
    },
    csrfToken: {
      name: `${COOKIE_PREFIX}next-auth.csrf-token`,
      options: cookieOptions,
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.authTime = Math.floor(Date.now() / 1000);
        token.sub = user.id;
      }

      const authTime = token.authTime as number | undefined;
      if (authTime && Date.now() / 1000 - authTime > SESSION_ABSOLUTE_MAX_AGE) {
        throw new Error("Session expired");
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        name: (token.name as string | undefined) ?? "admin",
        email: (token.email as string | undefined) ?? "admin",
      };
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

export function auth() {
  return getServerSession(authOptions);
}
