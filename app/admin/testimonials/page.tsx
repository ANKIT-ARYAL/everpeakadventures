import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search, Settings2 } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import { stripHtml } from "@/lib/stripHtml";

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const reviews = await prisma.clientReview.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Testimonials</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {reviews.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Manage client reviews, testimonials, and section headings.</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/testimonials/new"
            className="border border-gray-200 text-gray-700 font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-gray-50 flex items-center gap-2 uppercase tracking-wider"
          >
            <Settings2 className="w-4 h-4" /> Section Headings
          </Link>
          <AddNewButton href="/admin/testimonials/new" label="Add New Testimonial" />
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-bold text-gray-700">All ({reviews.length})</span>
        <div className="relative w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search testimonials..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64"
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
                <th className="py-3 px-4 w-16">Avatar</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Quote</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                    No testimonials found.
                  </td>
                </tr>
              ) : (
                reviews.map((review, index) => (
                  <tr key={review.id} className="hover:bg-[#fcfcfc] transition-colors group">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                    
                    <td className="py-3 px-4">
                      <img 
                        src={review.avatar || 'https://via.placeholder.com/150'} 
                        alt={review.name} 
                        className="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm"
                      />
                    </td>
                    
                    <td className="py-3 px-4 font-bold text-[#112233]">
                      <Link href={`/admin/testimonials/${review.id}/edit`} className="hover:text-[#24a0ed]">
                        {review.name}
                      </Link>
                    </td>
                    
                    <td className="py-3 px-4 font-semibold uppercase tracking-wider text-[#24a0ed]">
                      {review.location}
                    </td>
                    
                    <td className="py-3 px-4 text-gray-600 font-medium max-w-md">
                      <span className="line-clamp-2">“{stripHtml(review.quote)}”</span>
                    </td>
                    
                    <td className="py-3 px-4 text-center font-bold text-gray-700">
                      {review.order}
                    </td>
                    
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ToggleShow model="testimonials" resource="testimonials" id={review.id} published={review.published} />
                        <EditButton href={`/admin/testimonials/${review.id}/edit`} />
                        <ViewButton href="/testimonials" />
                        <DeleteButton id={review.id} model="testimonials" title={review.name} />
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
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
            No testimonials found.
          </div>
        ) : (
          reviews.map((review, index) => (
            <div key={review.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <img
                  src={review.avatar || 'https://via.placeholder.com/150'}
                  alt={review.name}
                  className="w-12 h-12 object-cover rounded-full border border-gray-200 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/testimonials/${review.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block truncate">
                    {review.name}
                  </Link>
                  <span className="block text-[10px] text-gray-400 font-normal">#{index + 1}</span>
                </div>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">#{review.order}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-[11px]">
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Location</span>
                  <span className="font-semibold uppercase tracking-wider text-[#24a0ed] truncate block">{review.location}</span>
                </div>
                <div className="min-w-0 col-span-2">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Quote</span>
                  <span className="text-gray-600 font-medium line-clamp-3">"{stripHtml(review.quote)}"</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <ToggleShow model="testimonials" resource="testimonials" id={review.id} published={review.published} />
                <EditButton href={`/admin/testimonials/${review.id}/edit`} />
                <ViewButton href="/testimonials" />
                <DeleteButton id={review.id} model="testimonials" title={review.name} />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
