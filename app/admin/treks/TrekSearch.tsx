"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function TrekSearch() {
  const [query, setQuery] = useState("");

  const handleSearch = (value: string) => {
    setQuery(value);

    const search = value.trim().toLowerCase();

    document.querySelectorAll<HTMLElement>("[data-trek]").forEach((element) => {
      const text = element.dataset.trek?.toLowerCase() || "";

      element.style.display =
        !search || text.includes(search) ? "" : "none";
    });
  };

  return (
    <div className="relative w-full sm:w-64 lg:w-72 min-w-0">
      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search treks..."
        className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2271b1] w-full min-w-0 text-sm"
      />
    </div>
  );
}