import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";

export const dynamic = 'force-dynamic';

export default async function AdminTrustItemsPage() {
  const items = await prisma.trustItem.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-[1400px] xl:max-w-none mx-auto text-xs">
      
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Trust Items</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {items.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Manage trust badges, certifications, and partner highlights.</p>
        </div>

        <AddNewButton href="/admin/trust-items/new" label="Add New Item" />
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-bold text-gray-700">All ({items.length})</span>
        <div className="relative w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search trust items..." 
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
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Subtitle</th>
                <th className="py-3 px-4">Icon</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No trust items found.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-[#fcfcfc] transition-colors group">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                    
                    <td className="py-3 px-4 font-bold text-[#112233]">
                      <Link href={`/admin/trust-items/${item.id}/edit`} className="hover:text-[#24a0ed]">
                        {item.title}
                      </Link>
                    </td>
                    
                    <td className="py-3 px-4 text-gray-600 font-medium max-w-md">
                      <span className="line-clamp-2">{item.subtitle}</span>
                    </td>
                    
                    <td className="py-3 px-4 font-semibold uppercase tracking-wider text-[#24a0ed]">
                      {item.iconName}
                    </td>
                    
                    <td className="py-3 px-4 text-center font-bold text-gray-700">
                      {item.order}
                    </td>
                    
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ToggleShow model="trust-items" resource="trust-items" id={item.id} published={item.published} />
                        <EditButton href={`/admin/trust-items/${item.id}/edit`} />
                        <ViewButton href="/" />
                        <DeleteButton id={item.id} model="trust-items" title={item.title} />
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
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
            No trust items found.
          </div>
        ) : (
          items.map((item, index) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/trust-items/${item.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] min-w-0 flex-1 block">
                  <span className="block truncate">#{index + 1} · {item.title}</span>
                </Link>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">#{item.order}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-[11px]">
                <div className="min-w-0 col-span-2">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Subtitle</span>
                  <span className="text-gray-600 font-medium line-clamp-2">{item.subtitle}</span>
                </div>
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Icon</span>
                  <span className="font-semibold uppercase tracking-wider text-[#24a0ed]">{item.iconName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <ToggleShow model="trust-items" resource="trust-items" id={item.id} published={item.published} />
                <EditButton href={`/admin/trust-items/${item.id}/edit`} />
                <ViewButton href="/" />
                <DeleteButton id={item.id} model="trust-items" title={item.title} />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
