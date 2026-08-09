import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";

export const dynamic = 'force-dynamic';

export default async function AdminToursPage() {
  const tours = await prisma.tour.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Tour Packages</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {tours.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Manage, add, and organize your tour itineraries.</p>
        </div>

        <AddNewButton href="/admin/tours/new" label="Add New Tour" />
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-bold text-gray-700">All ({tours.length})</span>
        <div className="relative w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search tours..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#2271b1] w-full sm:w-64"
          />
        </div>
      </div>

      {/* Data Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-16">Image</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Best Time</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tours.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-medium">
                    No tour packages found.
                  </td>
                </tr>
              ) : (
                tours.map((tour, index) => (
                  <tr key={tour.id} className="hover:bg-[#fcfcfc] transition-colors group">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                    <td className="py-3 px-4">
                      <img 
                        src={tour.heroImage} 
                        alt={tour.title} 
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </td>
                    <td className="py-3 px-4 font-bold text-[#112233]">
                      <Link href={`/admin/tours/${tour.id}/edit`} className="hover:text-[#2271b1]">
                        {tour.title}
                      </Link>
                      <span className="block text-[10px] text-gray-400 font-normal">Slug: {tour.slug}</span>
                    </td>
                    <td className="py-3 px-4 font-semibold uppercase tracking-wider text-[#2271b1]">
                      {tour.destination}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">{tour.duration}</td>
                    <td className="py-3 px-4 text-gray-600">{tour.bestTime}</td>
                    <td className="py-3 px-4 text-center font-bold text-gray-700">{tour.order}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Reusable Edit & Delete Action Buttons */}
                        <ToggleShow model="tours" resource="tours" id={tour.id} published={tour.published} />
                        <EditButton href={`/admin/tours/${tour.id}/edit`} />
                        {tour.slug && <ViewButton href={`/tour/${tour.slug}`} />}
                        <DeleteButton id={tour.id} model="tours" title={tour.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {tours.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
            No tour packages found.
          </div>
        ) : (
          tours.map((tour, index) => (
            <div key={tour.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <img
                  src={tour.heroImage || 'https://via.placeholder.com/150'}
                  alt={tour.title}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/tours/${tour.id}/edit`} className="font-bold text-[#112233] hover:text-[#2271b1] block truncate">
                    {tour.title}
                  </Link>
                  <span className="block text-[10px] text-gray-400 font-normal truncate">#{index + 1} · Slug: {tour.slug}</span>
                </div>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">#{tour.order}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-[11px]">
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Destination</span>
                  <span className="font-semibold uppercase tracking-wider text-[#2271b1] truncate block">{tour.destination}</span>
                </div>
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Duration</span>
                  <span className="text-gray-600 font-medium">{tour.duration}</span>
                </div>
                <div className="min-w-0 col-span-2">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Best Time</span>
                  <span className="text-gray-600">{tour.bestTime}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
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
  );
}