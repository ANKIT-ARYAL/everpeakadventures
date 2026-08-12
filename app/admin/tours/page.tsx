import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Search } from "lucide-react";
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import TourSearch from "./TourSearch";

export const dynamic = "force-dynamic";

export default async function AdminToursPage() {
  const tours = await prisma.tour.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <div className="w-full max-w-[1200px] mx-auto px-3 sm:px-4 lg:px-6 space-y-4 sm:space-y-6 pb-10 text-xs min-w-0 overflow-x-hidden">

      {/* Header */}
      <div className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-[#112233] oswald uppercase tracking-wide leading-tight break-words">
              Tour Packages
            </h1>

            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
              {tours.length} items
            </span>
          </div>

          <p className="text-gray-500 mt-1 leading-relaxed">
            Manage, add, and organize your tour itineraries.
          </p>
        </div>

        <div className="w-full lg:w-auto shrink-0">
          <AddNewButton
            href="/admin/tours/new"
            label="Add New Tour"
          />
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">

  <span className="font-bold text-gray-700 whitespace-nowrap">
    All ({tours.length})
  </span>
      <TourSearch />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
        <table className="w-full text-left border-collapse table-fixed">
          <colgroup>
            <col className="w-[5%]" />
            <col className="w-[34%]" />
            <col className="w-[23%]" />
            <col className="w-[16%]" />
            <col className="w-[22%]" />
          </colgroup>

          <thead>
            <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
              <th className="py-3 px-3 text-center">
                #
              </th>

              <th className="py-3 px-3">
                Title
              </th>

              <th className="py-3 px-3">
                Destination
              </th>

              <th className="py-3 px-3">
                Duration
              </th>

              <th className="py-3 px-3">
                Best Time
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {tours.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-12 text-center text-gray-400 font-medium"
                >
                  No tour packages found.
                </td>
              </tr>
            ) : (
              tours.map((tour, index) => (
                <tr
  key={tour.id}
  data-tour={[
    tour.title,
    tour.slug,
    tour.destination,
    tour.duration,
    tour.bestTime,
  ]
    .filter(Boolean)
    .join(" ")}
  className="hover:bg-[#fcfcfc] transition-colors group"
>
                  {/* Index */}
                  <td className="py-3 px-3 text-center text-gray-400 font-medium align-top whitespace-nowrap">
                    {index + 1}
                  </td>

                  {/* Title */}
                  <td className="py-3 px-3 align-top min-w-0">
                    <div className="min-w-0 max-w-[320px]">
                      <Link
                        href={`/admin/tours/${tour.id}/edit`}
                        className="font-bold text-[#112233] hover:text-[#2271b1] block break-words"
                        title={tour.title}
                      >
                        {tour.title}
                      </Link>

                      <span
                        className="block text-[10px] text-gray-400 font-normal mt-1 truncate"
                        title={tour.slug ?? undefined}
                      >
                        Slug: {tour.slug || "no slug"}
                      </span>

                      {/* Desktop Actions */}
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <ToggleShow
                          model="tours"
                          resource="tours"
                          id={tour.id}
                          published={tour.published}
                        />

                        <EditButton
                          href={`/admin/tours/${tour.id}/edit`}
                        />

                        {tour.slug && (
                          <ViewButton
                            href={`/tour/${tour.slug}`}
                          />
                        )}

                        <DeleteButton
                          id={tour.id}
                          model="tours"
                          title={tour.title}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Destination */}
                  <td className="py-3 px-3 align-top min-w-0">
                    <span className="font-semibold uppercase tracking-wider text-[#2271b1] break-words">
                      {tour.destination || "N/A"}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="py-3 px-3 text-gray-600 font-medium align-top break-words">
                    {tour.duration || "N/A"}
                  </td>

                  {/* Best Time */}
                  <td className="py-3 px-3 text-gray-600 align-top break-words">
                    {tour.bestTime || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 min-w-0">
        {tours.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 px-4 text-center text-gray-400 font-medium">
            No tour packages found.
          </div>
        ) : (
          tours.map((tour, index) => (
            <div
  key={tour.id}
  data-tour={[
    tour.title,
    tour.slug,
    tour.destination,
    tour.duration,
    tour.bestTime,
  ]
    .filter(Boolean)
    .join(" ")}
  className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-4 min-w-0 overflow-hidden"
>
              {/* Card Header */}
              <div className="min-w-0">
                <Link
                  href={`/admin/tours/${tour.id}/edit`}
                  className="font-bold text-[#112233] hover:text-[#2271b1] block text-sm sm:text-base leading-tight break-words"
                >
                  {tour.title}
                </Link>

                <span
                  className="block text-[10px] text-gray-400 font-normal truncate mt-1"
                  title={tour.slug ?? undefined}
                >
                  #{index + 1} · Slug: {tour.slug || "no slug"}
                </span>
              </div>

              {/* Tour Information */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-[11px]">

                {/* Destination */}
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Destination
                  </span>

                  <span className="font-semibold uppercase tracking-wider text-[#2271b1] break-words">
                    {tour.destination || "N/A"}
                  </span>
                </div>

                {/* Duration */}
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Duration
                  </span>

                  <span className="text-gray-600 font-medium break-words">
                    {tour.duration || "N/A"}
                  </span>
                </div>

                {/* Best Time */}
                <div className="min-w-0 col-span-2">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Best Time
                  </span>

                  <span className="text-gray-600 break-words">
                    {tour.bestTime || "N/A"}
                  </span>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                <ToggleShow
                  model="tours"
                  resource="tours"
                  id={tour.id}
                  published={tour.published}
                />

                <EditButton
                  href={`/admin/tours/${tour.id}/edit`}
                />

                {tour.slug && (
                  <ViewButton
                    href={`/tour/${tour.slug}`}
                  />
                )}

                <DeleteButton
                  id={tour.id}
                  model="tours"
                  title={tour.title}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}