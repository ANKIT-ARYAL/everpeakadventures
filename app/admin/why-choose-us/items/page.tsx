/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../../components/AddNewButton";
import EditButton from "../../components/EditButton";
import DeleteButton from "../../components/DeleteButton";
import ToggleShow from "../../components/ToggleShow";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";
import AdminPageLayout from "../../components/AdminPageLayout";

export const dynamic = 'force-dynamic';

export default async function AdminWhyChooseUsItemsPage() {
  const items = await prisma.whyChooseUsItem.findMany({
    orderBy: { order: 'asc' },
  });

  const tableRows = items.map((item, index) => [
    <span key="index" className="text-gray-400 font-medium whitespace-nowrap">
      {index + 1}
    </span>,
    <div key="title" className="min-w-0">
      <Link href={`/admin/why-choose-us/items/${item.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block break-words">
        {item.title}
      </Link>
    </div>,
    <span key="desc" className="text-gray-600 font-medium block max-w-md line-clamp-2 break-words">
      {item.desc}
    </span>,
    <span key="icon" className="font-semibold uppercase tracking-wider text-[#24a0ed] whitespace-nowrap">
      {item.iconName}
    </span>,
    <span key="order" className="font-bold text-gray-700 whitespace-nowrap">
      {item.order}
    </span>,
    <div key="actions" className="flex items-center justify-end gap-2 whitespace-nowrap">
      <ToggleShow model="why-choose-us-items" resource="why-choose-us" id={item.id} published={item.published} />
      <EditButton href={`/admin/why-choose-us/items/${item.id}/edit`} />
      <DeleteButton id={item.id} model="why-choose-us-items" title={item.title} />
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="Why Choose Us Items"
      description="Manage the icon list items displayed in the Why Choose Us section."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {items.length} items
          </span>
          <AddNewButton href="/admin/why-choose-us/items/new" label="Add New Item" />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10 min-w-0">

        {/* Filter / Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({items.length})
          </span>
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        <ResponsiveTable
          headers={['#', 'Title', 'Desc', 'Icon Name', 'Order', 'Actions']}
          rows={tableRows}
          data={items}
          emptyText="No items found."
          columnClassNames={['w-16 text-center whitespace-nowrap', 'w-[220px]', 'w-[350px]', 'w-32 whitespace-nowrap', 'w-24 text-center whitespace-nowrap', 'text-right whitespace-nowrap']}
          mobileCards={(_row, item, index) => (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/why-choose-us/items/${item.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] min-w-0 flex-1 block text-lg sm:text-xl leading-tight break-words">
                  <span>#{index + 1} · {item.title}</span>
                </Link>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-xs shrink-0">Order: {item.order}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-4 text-xs">
                <div className="min-w-0 sm:col-span-2">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Description</span>
                  <span className="text-gray-600 font-medium line-clamp-3 break-words">{item.desc}</span>
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Icon Name</span>
                  <span className="font-semibold uppercase tracking-wider text-[#24a0ed]">{item.iconName}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                <ToggleShow model="why-choose-us-items" resource="why-choose-us" id={item.id} published={item.published} />
                <EditButton href={`/admin/why-choose-us/items/${item.id}/edit`} />
                <DeleteButton id={item.id} model="why-choose-us-items" title={item.title} />
              </div>
            </div>
          )}
        />

      </div>
    </AdminPageLayout>
  );
}