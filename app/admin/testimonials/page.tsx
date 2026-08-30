/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search, Settings2 } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import { stripHtml } from "@/lib/stripHtml";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";
import AdminPageLayout from "../components/AdminPageLayout";

export const dynamic = 'force-dynamic';

export default async function AdminTestimonialsPage() {
  const reviews = await prisma.clientReview.findMany({
    orderBy: { order: 'asc' },
  });

  const tableRows = reviews.map((review, index) => [
    <span key="n" className="text-gray-400 font-medium whitespace-nowrap">{index + 1}</span>,
    <img
      key="img"
      src={review.avatar || 'https://via.placeholder.com/150'}
      alt={review.name}
      className="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm"
    />,
    <div key="name" className="min-w-0">
      <Link href={`/admin/testimonials/${review.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block break-words">
        {review.name}
      </Link>
    </div>,
    <span key="location" className="font-semibold uppercase tracking-wider text-[#24a0ed] break-words">{review.location}</span>,
    <span key="quote" className="text-gray-600 font-medium block max-w-md line-clamp-2 break-words">“{stripHtml(review.quote)}”</span>,
    <span key="order" className="font-bold text-gray-700 whitespace-nowrap">{review.order}</span>,
    <div key="actions" className="flex items-center justify-end gap-2 whitespace-nowrap">
      <ToggleShow model="testimonials" resource="testimonials" id={review.id} published={review.published} />
      <EditButton href={`/admin/testimonials/${review.id}/edit`} />
      <ViewButton href="/testimonials" />
      <DeleteButton id={review.id} model="testimonials" title={review.name} />
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="Testimonials"
      description="Manage client reviews, testimonials, and section headings."
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/testimonials/new"
            className="border border-gray-200 text-gray-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg hover:bg-gray-50 flex items-center gap-2 uppercase tracking-wider whitespace-nowrap"
          >
            <Settings2 className="w-4 h-4" /> Section Headings
          </Link>
          <AddNewButton href="/admin/testimonials/new" label="Add New Testimonial" />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10 min-w-0">

        {/* Filter / Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({reviews.length})
          </span>
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search testimonials..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        <ResponsiveTable
          headers={['#', 'Avatar', 'Name', 'Location', 'Quote', 'Order', 'Actions']}
          rows={tableRows}
          data={reviews}
          emptyText="No testimonials found."
          columnClassNames={['w-16 text-center whitespace-nowrap', 'w-16 whitespace-nowrap', 'w-[200px]', 'w-[180px]', 'w-[350px]', 'w-24 text-center whitespace-nowrap', 'text-right whitespace-nowrap']}
          mobileCards={(_row, data, index) => {
            const r = data as (typeof reviews)[number];
            return (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
                <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-4 min-w-0">
                  <img
                    src={r.avatar || 'https://via.placeholder.com/150'}
                    alt={r.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border border-gray-200 shadow-sm shrink-0"
                  />
                  <div className="min-w-0 flex-1 w-full">
                    <Link href={`/admin/testimonials/${r.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block text-lg sm:text-xl leading-tight break-words">
                      {r.name}
                    </Link>
                    <span className="block text-xs text-gray-400 font-normal truncate mt-1">
                      #{index + 1}
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-4 text-xs">
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</span>
                        <span className="font-semibold uppercase tracking-wider text-[#24a0ed] truncate block">{r.location}</span>
                      </div>
                      <div className="min-w-0 sm:col-span-2">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Quote</span>
                        <span className="text-gray-600 font-medium line-clamp-3 break-words">“{stripHtml(r.quote)}”</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                  <ToggleShow model="testimonials" resource="testimonials" id={r.id} published={r.published} />
                  <EditButton href={`/admin/testimonials/${r.id}/edit`} />
                  <ViewButton href="/testimonials" />
                  <DeleteButton id={r.id} model="testimonials" title={r.name} />
                </div>
              </div>
            );
          }}
        />

      </div>
    </AdminPageLayout>
  );
}