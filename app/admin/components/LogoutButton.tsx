"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
    >
      <LogOut className="w-4 h-4 text-rose-400" /> Sign Out
    </button>
  );
}
