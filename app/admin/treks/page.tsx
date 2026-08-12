import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search } from "lucide-react";
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";

export const dynamic = "force-dynamic";

export default async function AdminTreksPage() {
  const treks = await prisma.trek.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 space-y-4 sm:space-y-6 pb-10 text-xs min-w-0">

      {/* =========================================================
          TOP HEADER BAR
      ========================================================= */}
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">

        <div className="min-w-0 flex-1">

          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap">

            <h1 className="text-xl sm:text-2xl font-black text-[#112233] oswald uppercase tracking-wide leading-tight break-words">
              Trekking Packages
            </h1>

            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
              {treks.length} items
            </span>

          </div>

          <p className="text-gray-500 mt-1 leading-relaxed break-words">
            Manage, add, and organize your trekking itineraries.
          </p>

        </div>

        <div className="w-full lg:w-auto shrink-0">
          <AddNewButton
            href="/admin/treks/new"
            label="Add New Trek"
          />
        </div>

      </div>

      {/* =========================================================
          FILTER / SEARCH BAR
      ========================================================= */}
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">

        <span className="font-bold text-gray-700 whitespace-nowrap">
          All ({treks.length})
        </span>

        <div className="relative w-full sm:w-64 lg:w-72 min-w-0">

          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

          <input
            type="text"
            placeholder="Search treks..."
            className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2271b1] w-full min-w-0 text-sm"
          />

        </div>

      </div>

      {/* =========================================================
          DESKTOP TABLE
          Hidden below lg because of the number of columns.
      ========================================================= */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 min-w-0 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px] text-left border-collapse table-fixed">

            <colgroup>
              <col className="w-[5%]" />
              <col className="w-[7%]" />
              <col className="w-[25%]" />
              <col className="w-[14%]" />
              <col className="w-[10%]" />
              <col className="w-[11%]" />
              <col className="w-[13%]" />
              <col className="w-[15%]" />
            </colgroup>

            {/* =================================================
                TABLE HEADER
            ================================================= */}
            <thead>

              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">

                <th className="py-3 px-3 text-center whitespace-nowrap">
                  #
                </th>

                <th className="py-3 px-3 whitespace-nowrap">
                  Image
                </th>

                <th className="py-3 px-3">
                  Title
                </th>

                <th className="py-3 px-3 whitespace-nowrap">
                  Region
                </th>

                <th className="py-3 px-3 whitespace-nowrap">
                  Duration
                </th>

                <th className="py-3 px-3 whitespace-nowrap">
                  Price
                </th>

                <th className="py-3 px-3 whitespace-nowrap">
                  Activity
                </th>

                <th className="py-3 px-3 whitespace-nowrap">
                  Best Season
                </th>

              </tr>

            </thead>

            {/* =================================================
                TABLE BODY
            ================================================= */}
            <tbody className="divide-y divide-gray-100">

              {treks.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="py-12 text-center text-gray-400 font-medium"
                  >
                    No trekking packages found.
                  </td>

                </tr>

              ) : (

                treks.map((trek, index) => (

                  <tr
                    key={trek.id}
                    className="hover:bg-[#fcfcfc] transition-colors group"
                  >

                    {/* =================================================
                        INDEX
                    ================================================= */}
                    <td className="py-3 px-3 text-center text-gray-400 font-medium align-top whitespace-nowrap">
                      {index + 1}
                    </td>

                    {/* =================================================
                        IMAGE
                    ================================================= */}
                    <td className="py-3 px-3 align-top">

                      <img
                        src={
                          trek.heroImage ||
                          "https://via.placeholder.com/150"
                        }
                        alt={trek.title}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />

                    </td>

                    {/* =================================================
                        TITLE + ACTIONS
                    ================================================= */}
                    <td className="py-3 px-3 align-top min-w-0">

                      <Link
                        href={`/admin/treks/${trek.id}/edit`}
                        className="font-bold text-[#112233] hover:text-[#2271b1] block line-clamp-2 break-words"
                        title={trek.title}
                      >
                        {trek.title}
                      </Link>

                      <span
                        className="block text-[10px] text-gray-400 font-normal mt-0.5 truncate"
                        title={trek.slug ?? undefined}
                      >
                        Slug: {trek.slug || "—"}
                      </span>

                      {/* Desktop Actions */}
                      <div className="mt-2 flex items-center gap-1.5 whitespace-nowrap">

                        <ToggleShow
                          model="treks"
                          resource="treks"
                          id={trek.id}
                          published={trek.published}
                        />

                        <EditButton
                          href={`/admin/treks/${trek.id}/edit`}
                        />

                        {trek.slug && (
                          <ViewButton
                            href={`/trekking/${trek.slug}`}
                          />
                        )}

                        <DeleteButton
                          id={trek.id}
                          model="treks"
                          title={trek.title}
                        />

                      </div>

                    </td>

                    {/* =================================================
                        REGION
                    ================================================= */}
                    <td className="py-3 px-3 align-top font-semibold uppercase tracking-wider text-[#2271b1] break-words">
                      {trek.region || "—"}
                    </td>

                    {/* =================================================
                        DURATION
                    ================================================= */}
                    <td className="py-3 px-3 align-top text-gray-600 font-medium break-words">
                      {trek.durationDays || "—"}
                    </td>

                    {/* =================================================
                        PRICE
                    ================================================= */}
                    <td className="py-3 px-3 align-top font-bold text-gray-700">

                      <span className="block break-words">
                        ${trek.discountedPrice ?? trek.price}
                      </span>

                      {trek.originalPrice && (
                        <span className="block text-[10px] text-gray-400 line-through font-normal">
                          ${trek.originalPrice}
                        </span>
                      )}

                    </td>

                    {/* =================================================
                        ACTIVITY
                    ================================================= */}
                    <td className="py-3 px-3 align-top text-gray-600 break-words">
                      {trek.activity || "N/A"}
                    </td>

                    {/* =================================================
                        BEST SEASON
                    ================================================= */}
                    <td className="py-3 px-3 align-top text-gray-600 break-words">
                      {trek.bestSeason || "N/A"}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =========================================================
          MOBILE / TABLET CARDS
      ========================================================= */}
      <div className="lg:hidden space-y-3 min-w-0">

        {treks.length === 0 ? (

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 px-4 text-center text-gray-400 font-medium">
            No trekking packages found.
          </div>

        ) : (

          treks.map((trek, index) => (

            <div
              key={trek.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 min-w-0 overflow-hidden"
            >

              {/* =================================================
                  CARD HEADER
              ================================================= */}
              <div className="flex items-start gap-3 min-w-0">

                <img
                  src={
                    trek.heroImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt={trek.title}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg border border-gray-200 shadow-sm shrink-0"
                />

                <div className="min-w-0 flex-1">

                  <Link
                    href={`/admin/treks/${trek.id}/edit`}
                    className="font-bold text-[#112233] hover:text-[#2271b1] block text-sm sm:text-base leading-tight break-words"
                    title={trek.title}
                  >
                    {trek.title}
                  </Link>

                  <span
                    className="block text-[10px] text-gray-400 font-normal truncate mt-1"
                    title={trek.slug ?? undefined}
                  >
                    #{index + 1} · Slug: {trek.slug || "no slug"}
                  </span>

                </div>

              </div>

              {/* =================================================
                  TREK INFORMATION
              ================================================= */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-[11px]">

                {/* Region */}
                <div className="min-w-0">

                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Region
                  </span>

                  <span
                    className="font-semibold uppercase tracking-wider text-[#2271b1] truncate block"
                    title={trek.region || undefined}
                  >
                    {trek.region || "N/A"}
                  </span>

                </div>

                {/* Duration */}
                <div className="min-w-0">

                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Duration
                  </span>

                  <span className="text-gray-600 font-medium truncate block">
                    {trek.durationDays || "N/A"}
                  </span>

                </div>

                {/* Price */}
                <div className="min-w-0">

                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Price
                  </span>

                  <span className="font-bold text-gray-700">

                    ${trek.discountedPrice ?? trek.price}

                    {trek.originalPrice && (
                      <span className="block text-[10px] text-gray-400 line-through font-normal">
                        ${trek.originalPrice}
                      </span>
                    )}

                  </span>

                </div>

                {/* Activity */}
                <div className="min-w-0">

                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Activity
                  </span>

                  <span
                    className="text-gray-600 truncate block"
                    title={trek.activity || undefined}
                  >
                    {trek.activity || "N/A"}
                  </span>

                </div>

                {/* Best Season */}
                <div className="min-w-0 col-span-2">

                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Best Season
                  </span>

                  <span className="text-gray-600 break-words">
                    {trek.bestSeason || "N/A"}
                  </span>

                </div>

              </div>

              {/* =================================================
                  MOBILE ACTIONS
              ================================================= */}
              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">

                <ToggleShow
                  model="treks"
                  resource="treks"
                  id={trek.id}
                  published={trek.published}
                />

                <EditButton
                  href={`/admin/treks/${trek.id}/edit`}
                />

                {trek.slug && (
                  <ViewButton
                    href={`/trekking/${trek.slug}`}
                  />
                )}

                <DeleteButton
                  id={trek.id}
                  model="treks"
                  title={trek.title}
                />

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}