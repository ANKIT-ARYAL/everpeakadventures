/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import TrekSearch from "./TrekSearch";
import AdminPageLayout from "../components/AdminPageLayout";
import AdminTable from "../components/AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminTreksPage() {
  const treks = await prisma.trek.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <AdminPageLayout
      title="Trekking Packages"
      description="Manage, add, and organize your trekking itineraries."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {treks.length} items
          </span>
          <AddNewButton
            href="/admin/treks/new"
            label="Add New Trek"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10">

        {/* =========================================================
            FILTER / SEARCH BAR
        ========================================================= */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({treks.length})
          </span>
          <TrekSearch />
        </div>

        {/* =========================================================
            DESKTOP TABLE (Shown on 1280px+ screens)
        ========================================================= */}
        <div className="hidden xl:block">
          <AdminTable>
            <colgroup>
              <col className="w-[5%] min-w-[40px]" />
              <col className="w-[7%] min-w-[50px]" />
              <col className="w-[25%] min-w-[200px]" />
              <col className="w-[14%] min-w-[100px]" />
              <col className="w-[10%] min-w-[80px]" />
              <col className="w-[11%] min-w-[80px]" />
              <col className="w-[13%] min-w-[100px]" />
              <col className="w-[15%] min-w-[120px]" />
            </colgroup>

            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3 px-3 text-center whitespace-nowrap">#</th>
                <th className="py-3 px-3 whitespace-nowrap">Image</th>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3 whitespace-nowrap">Region</th>
                <th className="py-3 px-3 whitespace-nowrap">Duration</th>
                <th className="py-3 px-3 whitespace-nowrap">Price</th>
                <th className="py-3 px-3 whitespace-nowrap">Activity</th>
                <th className="py-3 px-3 whitespace-nowrap">Best Season</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
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
                    data-trek={[
                      trek.title,
                      trek.slug,
                      trek.region,
                      trek.durationDays,
                      trek.price,
                      trek.discountedPrice,
                      trek.activity,
                      trek.bestSeason,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    className="hover:bg-[#fcfcfc] transition-colors group align-middle"
                  >
                    <td className="py-3 px-3 text-center text-gray-400 font-medium whitespace-nowrap">
                      {index + 1}
                    </td>

                    <td className="py-3 px-3">
                      <img
                        src={
                          trek.heroImage ||
                          'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png'
                        }
                        alt={trek.title}
                        className={`w-10 h-10 ${!trek.heroImage ? 'object-contain p-2 bg-white' : 'object-cover'} rounded-lg border border-gray-200 shadow-sm`}
                      />
                    </td>

                    <td className="py-3 px-3 min-w-0">
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

                      <div className="mt-2 flex items-center gap-1.5 whitespace-nowrap">
                        <ToggleShow
                          model="treks"
                          resource="treks"
                          id={trek.id}
                          published={trek.published}
                        />
                        <EditButton href={`/admin/treks/${trek.id}/edit`} />
                        {trek.slug && <ViewButton href={`/trekking/${trek.slug}`} />}
                        <DeleteButton id={trek.id} model="treks" title={trek.title} />
                      </div>
                    </td>

                    <td className="py-3 px-3 font-semibold uppercase tracking-wider text-[#2271b1] break-words">
                      {trek.region || "—"}
                    </td>

                    <td className="py-3 px-3 text-gray-600 font-medium break-words">
                      {trek.durationDays || "—"}
                    </td>

                    <td className="py-3 px-3 font-bold text-gray-700">
                      <span className="block break-words">
                        ${trek.discountedPrice ?? trek.price}
                      </span>
                      {trek.originalPrice && (
                        <span className="block text-[10px] text-gray-400 line-through font-normal">
                          ${trek.originalPrice}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-gray-600 break-words">
                      {trek.activity || "N/A"}
                    </td>

                    <td className="py-3 px-3 text-gray-600 break-words">
                      {trek.bestSeason || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </AdminTable>
        </div>

      {/* =========================================================
          MOBILE / TABLET CARDS (Shown on screens < 1280px)
      ========================================================= */}
      <div className="xl:hidden space-y-3 min-w-0">
        {treks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 px-4 text-center text-gray-400 font-medium">
            No trekking packages found.
          </div>
        ) : (
          treks.map((trek, index) => (
            <div
              key={trek.id}
              data-trek={[
                trek.title,
                trek.slug,
                trek.region,
                trek.durationDays,
                trek.price,
                trek.discountedPrice,
                trek.activity,
                trek.bestSeason,
              ]
                .filter(Boolean)
                .join(" ")}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden"
            >
              {/* Card Header with vertically centered large image on the right */}
              <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-4 min-w-0">
                <img
                  src={
                    trek.heroImage ||
                    "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"
                  }
                  alt={trek.title}
                  className={`w-20 h-20 sm:w-24 sm:h-24 ${!trek.heroImage ? 'object-contain p-2 bg-white' : 'object-cover'} rounded-xl border border-gray-200 shadow-sm shrink-0`}
                />

                <div className="min-w-0 flex-1 w-full">
                  <Link
                    href={`/admin/treks/${trek.id}/edit`}
                    className="font-bold text-[#112233] hover:text-[#2271b1] block text-lg sm:text-xl leading-tight break-words"
                    title={trek.title}
                  >
                    {trek.title}
                  </Link>

                  <span
                    className="block text-xs text-gray-400 font-normal truncate mt-1"
                    title={trek.slug ?? undefined}
                  >
                    #{index + 1} · Slug: {trek.slug || "no slug"}
                  </span>

                  {/* Trek Information Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mt-4 text-xs">
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Region</span>
                      <span className="font-semibold uppercase tracking-wider text-[#2271b1] truncate block" title={trek.region || undefined}>
                        {trek.region || "N/A"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Duration</span>
                      <span className="text-gray-600 font-medium truncate block">{trek.durationDays || "N/A"}</span>
                    </div>

                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</span>
                      <span className="font-bold text-gray-700">
                        ${trek.discountedPrice ?? trek.price}
                        {trek.originalPrice && (
                          <span className="block text-[10px] text-gray-400 line-through font-normal">${trek.originalPrice}</span>
                        )}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Activity</span>
                      <span className="text-gray-600 truncate block" title={trek.activity || undefined}>{trek.activity || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer / Actions */}
              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                <ToggleShow model="treks" resource="treks" id={trek.id} published={trek.published} />
                <EditButton href={`/admin/treks/${trek.id}/edit`} />
                {trek.slug && <ViewButton href={`/trekking/${trek.slug}`} />}
                <DeleteButton id={trek.id} model="treks" title={trek.title} />
              </div>

            </div>
          ))
        )}
      </div>
      </div>
    </AdminPageLayout>
  );
}