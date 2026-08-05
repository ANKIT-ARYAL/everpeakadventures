"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid username or password.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-8">
        <div className="text-center mb-8">
          <span className="inline-block bg-[#f59e0b] text-[#112233] px-2 py-0.5 rounded text-[10px] font-bold tracking-widest mb-3">
            ADMIN
          </span>
          <h1 className="text-xl font-black text-[#112233] oswald uppercase tracking-tight">
            Ever Peak CMS
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to manage your website content
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full bg-[#f8faf9] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-[#112233] focus:outline-none focus:border-[#24a0ed]"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-[#f8faf9] border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-[#112233] focus:outline-none focus:border-[#24a0ed]"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f59e0b] hover:bg-[#e08e0a] text-[#112233] font-bold text-sm py-2.5 rounded-lg transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
