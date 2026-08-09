import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";

export const dynamic = 'force-dynamic';

export default async function AdminLegalDocumentsPage() {
  const documents = await prisma.legalDocument.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Legal Documents</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {documents.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Manage licenses, certifications, and legal documents.</p>
        </div>

        <AddNewButton href="/admin/legal-documents/new" label="Add New Document" />
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-bold text-gray-700">All ({documents.length})</span>
        <div className="relative w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search documents..." 
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
                <th className="py-3 px-4 w-16">Image</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Document URL</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No legal documents found.
                  </td>
                </tr>
              ) : (
                documents.map((document, index) => (
                  <tr key={document.id} className="hover:bg-[#fcfcfc] transition-colors group">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                    
                    <td className="py-3 px-4">
                      <img 
                        src={document.image || 'https://via.placeholder.com/150'} 
                        alt={document.title} 
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </td>
                    
                    <td className="py-3 px-4 font-bold text-[#112233]">
                      <Link href={`/admin/legal-documents/${document.id}/edit`} className="hover:text-[#24a0ed]">
                        {document.title}
                      </Link>
                    </td>
                    
                    <td className="py-3 px-4 text-gray-500 font-medium max-w-[220px]">
                      <span className="block truncate">{document.documentUrl || '-'}</span>
                    </td>
                    
                    <td className="py-3 px-4 text-center font-bold text-gray-700">
                      {document.order}
                    </td>
                    
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {documents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
            No legal documents found.
          </div>
        ) : (
          documents.map((document, index) => (
            <div key={document.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start gap-3">
                <img
                  src={document.image || 'https://via.placeholder.com/150'}
                  alt={document.title}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/legal-documents/${document.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block truncate">
                    {document.title}
                  </Link>
                  <span className="block text-[10px] text-gray-400 font-normal">#{index + 1}</span>
                </div>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">#{document.order}</span>
              </div>
              <div className="mt-3 text-[11px] min-w-0">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Document URL</span>
                <span className="block text-gray-500 font-medium truncate">{document.documentUrl || '-'}</span>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
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
  );
}
