/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import TourSearch from "./TourSearch";
import AdminPageLayout from "../components/AdminPageLayout";

export const dynamic = "force-dynamic";

export default async function AdminToursPage() {
  const tours = await prisma.tour.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <AdminPageLayout
      title="Tour Packages"
      description="Manage, add, and organize your tour itineraries."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {tours.length} items
          </span>
          <AddNewButton
            href="/admin/tours/new"
            label="Add New Tour"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10 min-w-0">

        {/* Search */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({tours.length})
          </span>
          <TourSearch />
        </div>

        {/* Desktop Table (Only shows on 1280px+ to prevent squishing) */}
        <div className="hidden xl:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-0">
          <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
            <colgroup>
              <col className="w-[5%] min-w-[40px]" />
              <col className="w-[7%] min-w-[50px]" />
              <col className="w-[30%] min-w-[220px]" />
              <col className="w-[20%] min-w-[140px]" />
              <col className="w-[16%] min-w-[100px]" />
              <col className="w-[22%] min-w-[140px]" />
            </colgroup>

            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-xs">
                <th className="py-3 px-3 text-center whitespace-nowrap">#</th>
                <th className="py-3 px-3 whitespace-nowrap">Image</th>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3 whitespace-nowrap">Destination</th>
                <th className="py-3 px-3 whitespace-nowrap">Duration</th>
                <th className="py-3 px-3 whitespace-nowrap">Best Time</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No tour packages found.
                  </td>
                </tr>
              ) : (
                tours.map((tour, index) => (
                  <tr
                    key={tour.id}
                    data-tour={[tour.title, tour.slug, tour.destination, tour.duration, tour.bestTime].filter(Boolean).join(" ")}
                    className="hover:bg-[#fcfcfc] transition-colors group align-middle"
                  >
                    {/* Index */}
                    <td className="py-3 px-3 text-center text-gray-400 font-medium whitespace-nowrap break-normal">
                      {index + 1}
                    </td>

                    {/* Image Thumbnail */}
                    <td className="py-3 px-3">
                      <img
                        src={
                          tour.heroImage ||
                          'https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png'
                        }
                        alt={tour.title}
                        className={`w-10 h-10 ${!tour.heroImage ? 'object-contain p-2 bg-white' : 'object-cover'} rounded-lg border border-gray-200 shadow-sm`}
                      />
                    </td>

                    {/* Title */}
                    <td className="py-3 px-3 min-w-0">
                      <div className="min-w-0">
                        <Link
                          href={`/admin/tours/${tour.id}/edit`}
                          className="font-bold text-[#112233] hover:text-[#2271b1] block break-words line-clamp-2"
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

                        <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                          <ToggleShow model="tours" resource="tours" id={tour.id} published={tour.published} />
                          <EditButton href={`/admin/tours/${tour.id}/edit`} />
                          {tour.slug && <ViewButton href={`/tour/${tour.slug}`} />}
                          <DeleteButton id={tour.id} model="tours" title={tour.title} />
                        </div>
                      </div>
                    </td>

                    {/* Destination */}
                    <td className="py-3 px-3 min-w-0">
                      <span className="font-semibold uppercase tracking-wider text-[#2271b1] break-words break-normal">
                        {tour.destination || "N/A"}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-3 text-gray-600 font-medium break-words break-normal">
                      {tour.duration || "N/A"}
                    </td>

                    {/* Best Time */}
                    <td className="py-3 px-3 text-gray-600 break-words break-normal">
                      {tour.bestTime || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Cards (Takes over on laptops & smaller to prevent horizontal scroll) */}
        <div className="xl:hidden space-y-3 min-w-0">
          {tours.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 px-4 text-center text-gray-400 font-medium">
              No tour packages found.
            </div>
          ) : (
            tours.map((tour, index) => (
              <div
                key={tour.id}
                data-tour={[tour.title, tour.slug, tour.destination, tour.duration, tour.bestTime].filter(Boolean).join(" ")}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden"
              >
                {/* Header Layout: Larger image on the right, vertically centered with text */}
                <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-4 min-w-0">
                  <img
                    src={
                      tour.heroImage ||
                      "https://ml978xhbpkuo.i.optimole.com/cb:t1g8.6c6/w:259/h:68/q:mauto/f:best/https://everpeakadventures.com/wp-content/uploads/2025/03/Untitled-design-123456-e1783511870519.png"
                    }
                    alt={tour.title}
                    className={`w-20 h-20 sm:w-24 sm:h-24 ${!tour.heroImage ? 'object-contain p-2 bg-white' : 'object-cover'} rounded-xl border border-gray-200 shadow-sm shrink-0`}
                  />

                  <div className="min-w-0 flex-1 w-full">
                    <Link
                      href={`/admin/tours/${tour.id}/edit`}
                      className="font-bold text-[#112233] hover:text-[#2271b1] block text-lg sm:text-xl leading-tight break-words"
                      title={tour.title}
                    >
                      {tour.title}
                    </Link>
                    <span
                      className="block text-xs text-gray-400 font-normal truncate mt-1"
                      title={tour.slug ?? undefined}
                    >
                      #{index + 1} · Slug: {tour.slug || "no slug"}
                    </span>

                    {/* Tour Information Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 mt-4 text-xs">
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Destination</span>
                        <span className="font-semibold uppercase tracking-wider text-[#2271b1] truncate block">{tour.destination || "N/A"}</span>
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Duration</span>
                        <span className="text-gray-600 font-medium truncate block">{tour.duration || "N/A"}</span>
                      </div>
                      <div className="min-w-0 col-span-2 sm:col-span-1">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Best Time</span>
                        <span className="text-gray-600 break-words">{tour.bestTime || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                  <ToggleShow model="tours" resource="tours" id={tour.id} published={tour.published} />
                  <EditButton href={`/admin/tours/${tour.id}/edit`} />
                  {tour.slug && <ViewButton href={`/tour/${tour.slug}`} />}
                  <DeleteButton id={tour.id} model="tours" title={tour.title} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}