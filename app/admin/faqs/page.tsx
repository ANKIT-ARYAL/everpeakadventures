import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import { stripHtml } from "@/lib/stripHtml";

export const dynamic = 'force-dynamic';

const relatedTypeLabels: Record<string, string> = {
  trek: 'Trek page',
  tour: 'Tour page',
  blog: 'Blog post',
};

export default async function AdminFaqsPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">FAQs</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {faqs.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Manage frequently asked questions and their display order.</p>
        </div>

        <AddNewButton href="/admin/faqs/new" label="Add New FAQ" />
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-bold text-gray-700">All ({faqs.length})</span>
        <div className="relative w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search FAQs..." 
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
                <th className="py-3 px-4">Question</th>
                <th className="py-3 px-4">Answer</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4">Show On Page</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {faqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No FAQs found.
                  </td>
                </tr>
              ) : (
                faqs.map((faq, index) => (
                  <tr key={faq.id} className="hover:bg-[#fcfcfc] transition-colors group">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                    
                    <td className="py-3 px-4 font-bold text-[#112233]">
                      <Link href={`/admin/faqs/${faq.id}/edit`} className="hover:text-[#24a0ed]">
                        {faq.question}
                      </Link>
                    </td>
                    
                    <td className="py-3 px-4 text-gray-600 font-medium max-w-md">
                      <span className="line-clamp-2">{stripHtml(faq.answer)}</span>
                    </td>
                    
                    <td className="py-3 px-4 text-center font-bold text-gray-700">
                      {faq.order}
                    </td>

                    <td className="py-3 px-4">
                      {faq.relatedType ? (
                        <a
                          href={faq.relatedType === 'trek'
                            ? `/trekking/${faq.relatedSlug}`
                            : faq.relatedType === 'tour'
                              ? `/tour/${faq.relatedSlug}`
                              : `/blog/${faq.relatedSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-[#24a0ed] hover:text-[#112233]"
                        >
                          {relatedTypeLabels[faq.relatedType] ?? faq.relatedType}
                        </a>
                      ) : (
                        <span className="text-gray-400 text-[11px]">—</span>
                      )}
                    </td>
                    
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ToggleShow model="faqs" resource="faqs" id={faq.id} published={faq.published} />
                        <EditButton href={`/admin/faqs/${faq.id}/edit`} />
                        <ViewButton href="/faq" />
                        <DeleteButton id={faq.id} model="faqs" title={faq.question} />
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
        {faqs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
            No FAQs found.
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div key={faq.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/faqs/${faq.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] min-w-0 flex-1 block">
                  <span className="block truncate">#{index + 1} · {faq.question}</span>
                </Link>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">#{faq.order}</span>
              </div>
              <p className="text-gray-600 font-medium mt-2 text-[11px] line-clamp-3">{stripHtml(faq.answer)}</p>
              <div className="flex items-center justify-between gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <div className="min-w-0">
                  {faq.relatedType ? (
                    <a
                      href={faq.relatedType === 'trek'
                        ? `/trekking/${faq.relatedSlug}`
                        : faq.relatedType === 'tour'
                          ? `/tour/${faq.relatedSlug}`
                          : `/blog/${faq.relatedSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#24a0ed] hover:text-[#112233]"
                    >
                      {relatedTypeLabels[faq.relatedType] ?? faq.relatedType}
                    </a>
                  ) : (
                    <span className="text-gray-400 text-[11px]">Not linked</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <ToggleShow model="faqs" resource="faqs" id={faq.id} published={faq.published} />
                  <EditButton href={`/admin/faqs/${faq.id}/edit`} />
                  <ViewButton href="/faq" />
                  <DeleteButton id={faq.id} model="faqs" title={faq.question} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
