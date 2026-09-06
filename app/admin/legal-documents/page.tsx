import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import AdminPageLayout from "../components/AdminPageLayout";
import AdminTable from "../components/AdminTable";

export const dynamic = 'force-dynamic';

export default async function AdminLegalDocumentsPage() {
  const documents = await prisma.legalDocument.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <AdminPageLayout
      title="Legal Documents"
      description="Manage licenses, certifications, and legal documents."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {documents.length} items
          </span>
          <AddNewButton href="/admin/legal-documents/new" label="Add New Document" />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10">
        
        {/* =========================================================
            FILTER / SEARCH BAR
        ========================================================= */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({documents.length})
          </span>
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        {/* =========================================================
            DESKTOP TABLE (Shown on 1280px+ screens)
        ========================================================= */}
        <div className="hidden xl:block">
          <AdminTable>
            <colgroup>
              <col className="w-[5%] min-w-[40px]" />
              <col className="w-[8%] min-w-[60px]" />
              <col className="w-[30%] min-w-[200px]" />
              <col className="w-[30%] min-w-[200px]" />
              <col className="w-[10%] min-w-[80px]" />
              <col className="w-[17%] min-w-[150px]" />
            </colgroup>

            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3 px-3 text-center whitespace-nowrap">#</th>
                <th className="py-3 px-3 whitespace-nowrap">Image</th>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3">Document URL</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">Order</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No legal documents found.
                  </td>
                </tr>
              ) : (
                documents.map((document, index) => (
                  <tr key={document.id} className="hover:bg-[#fcfcfc] transition-colors group align-middle">
                    <td className="py-3 px-3 text-center text-gray-400 font-medium whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3">
                      <img
                        src={document.image || 'https://via.placeholder.com/150'}
                        alt={document.title}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </td>
                    <td className="py-3 px-3 min-w-0">
                      <Link href={`/admin/legal-documents/${document.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block line-clamp-2 break-words">
                        {document.title}
                      </Link>
                    </td>
                    <td className="py-3 px-3 min-w-0">
                      <span className="text-gray-500 font-medium block truncate max-w-xs">{document.documentUrl || '-'}</span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-gray-700">
                      {document.order}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <ToggleShow model="legal-documents" resource="legal-documents" id={document.id} published={document.published} />
                        <EditButton href={`/admin/legal-documents/${document.id}/edit`} />
                        <ViewButton href="/legal-document" />
                        <DeleteButton id={document.id} model="legal-documents" title={document.title} />
                      </div>
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
          {documents.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 px-4 text-center text-gray-400 font-medium">
              No legal documents found.
            </div>
          ) : (
            documents.map((document, index) => (
              <div key={document.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
                <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-4 min-w-0">
                  <img
                    src={document.image || 'https://via.placeholder.com/150'}
                    alt={document.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-200 shadow-sm shrink-0"
                  />

                  <div className="min-w-0 flex-1 w-full">
                    <Link href={`/admin/legal-documents/${document.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block text-lg sm:text-xl leading-tight break-words" title={document.title}>
                      {document.title}
                    </Link>
                    
                    <span className="block text-xs text-gray-400 font-normal truncate mt-1">
                      #{index + 1} &middot; Order: {document.order}
                    </span>

                    <div className="mt-3 text-[11px] min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Document URL</span>
                      <span className="block text-gray-500 font-medium truncate">{document.documentUrl || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                  <ToggleShow model="legal-documents" resource="legal-documents" id={document.id} published={document.published} />
                  <EditButton href={`/admin/legal-documents/${document.id}/edit`} />
                  <ViewButton href="/legal-document" />
                  <DeleteButton id={document.id} model="legal-documents" title={document.title} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
}
