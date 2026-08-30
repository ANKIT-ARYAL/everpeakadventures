/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import { stripHtml } from "@/lib/stripHtml";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";
import AdminPageLayout from "../components/AdminPageLayout";

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

  const tableRows = faqs.map((faq, index) => [
    <span key="n" className="text-gray-400 font-medium whitespace-nowrap">{index + 1}</span>,
    <div key="question" className="min-w-0">
      <Link href={`/admin/faqs/${faq.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block break-words">
        {faq.question}
      </Link>
    </div>,
    <span key="answer" className="text-gray-600 font-medium block max-w-md line-clamp-2 break-words">
      {stripHtml(faq.answer)}
    </span>,
    <span key="order" className="font-bold text-gray-700 whitespace-nowrap">{faq.order}</span>,
    <div key="related" className="whitespace-nowrap">
      {faq.relatedType ? (
        <a
          href={faq.relatedType === 'trek'
            ? `/trekking/${faq.relatedSlug}`
            : faq.relatedType === 'tour'
              ? `/tour/${faq.relatedSlug}`
              : `/blog/${faq.relatedSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#24a0ed] hover:text-[#112233]"
        >
          {relatedTypeLabels[faq.relatedType] ?? faq.relatedType}
        </a>
      ) : (
        <span className="text-gray-400 text-xs">—</span>
      )}
    </div>,
    <div key="actions" className="flex items-center justify-end gap-2 whitespace-nowrap">
      <ToggleShow model="faqs" resource="faqs" id={faq.id} published={faq.published} />
      <EditButton href={`/admin/faqs/${faq.id}/edit`} />
      <ViewButton href="/faq" />
      <DeleteButton id={faq.id} model="faqs" title={faq.question} />
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="FAQs"
      description="Manage frequently asked questions and their display order."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {faqs.length} items
          </span>
          <AddNewButton href="/admin/faqs/new" label="Add New FAQ" />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10 min-w-0">

        {/* Filter / Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({faqs.length})
          </span>
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search FAQs..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        <ResponsiveTable
          headers={['#', 'Question', 'Answer', 'Order', 'Show On Page', 'Actions']}
          rows={tableRows}
          data={faqs}
          emptyText="No FAQs found."
          columnClassNames={['w-16 text-center whitespace-nowrap', 'w-[250px]', 'w-[350px]', 'w-24 text-center whitespace-nowrap', 'w-36 whitespace-nowrap', 'text-right whitespace-nowrap']}
          mobileCards={(_row, faq, index) => (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/faqs/${faq.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] min-w-0 flex-1 block text-lg sm:text-xl leading-tight break-words">
                  <span>#{index + 1} · {faq.question}</span>
                </Link>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-xs shrink-0">Order: {faq.order}</span>
              </div>

              <div className="mt-3 text-xs sm:text-sm text-gray-600 font-medium line-clamp-3 break-words">
                {stripHtml(faq.answer)}
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100 text-xs">
                <div>
                  {faq.relatedType ? (
                    <a
                      href={faq.relatedType === 'trek'
                        ? `/trekking/${faq.relatedSlug}`
                        : faq.relatedType === 'tour'
                          ? `/tour/${faq.relatedSlug}`
                          : `/blog/${faq.relatedSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#24a0ed] hover:text-[#112233] truncate block"
                    >
                      {relatedTypeLabels[faq.relatedType] ?? faq.relatedType}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not linked</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <ToggleShow model="faqs" resource="faqs" id={faq.id} published={faq.published} />
                  <EditButton href={`/admin/faqs/${faq.id}/edit`} />
                  <ViewButton href="/faq" />
                  <DeleteButton id={faq.id} model="faqs" title={faq.question} />
                </div>
              </div>
            </div>
          )}
        />

      </div>
    </AdminPageLayout>
  );
}