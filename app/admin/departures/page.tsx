import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";

export const dynamic = 'force-dynamic';

export default async function AdminDeparturesPage() {
  const departures = await prisma.fixedDeparture.findMany({
    orderBy: { order: 'asc' },
  });

  const tableRows = departures.map((departure, index) => [
    <span key="n" className="text-gray-400 font-medium">{index + 1}</span>,
    <img
      key="img"
      src={departure.heroImage || 'https://via.placeholder.com/150'}
      alt={departure.title}
      className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
    />,
    <div key="title">
      <Link href={`/admin/departures/${departure.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed]">
        {departure.title}
      </Link>
      <span className="block text-[10px] text-gray-400 font-normal mt-0.5">{departure.durationDays}</span>
    </div>,
    <div key="dates" className="font-semibold text-gray-700">
      {departure.startDate}
      {departure.endDate && (
        <span className="block text-[10px] text-gray-400 font-normal mt-0.5">To: {departure.endDate}</span>
      )}
    </div>,
    <div key="status" className="flex flex-col items-center gap-1">
      <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
        departure.status === 'Guaranteed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
        departure.status === 'Filling Fast' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
        departure.status === 'Sold Out' ? 'bg-red-50 text-red-700 border border-red-200' :
        'bg-blue-50 text-blue-700 border border-blue-200'
      }`}>
        {departure.status}
      </span>
      <span className="text-[10px] text-gray-500 font-medium">{departure.seatsLeft} Seats Left</span>
    </div>,
    <div key="price" className="text-right">
      <div className="font-bold text-[#112233]">US$ {departure.price}</div>
      {departure.originalPrice && (
        <div className="text-[10px] text-gray-400 line-through">US$ {departure.originalPrice}</div>
      )}
    </div>,
    <div key="actions" className="flex items-center justify-end gap-2">
      <ToggleShow model="departures" resource="departures" id={departure.id} published={departure.published} />
      <EditButton href={`/admin/departures/${departure.id}/edit`} />
      <ViewButton href="/#departures" />
      <DeleteButton id={departure.id} model="departures" title={departure.title} />
    </div>,
  ]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Fixed Departures</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {departures.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Manage scheduled departure dates, seats, and pricing.</p>
        </div>

        <AddNewButton href="/admin/departures/new" label="Add New Departure" />
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-bold text-gray-700">All ({departures.length})</span>
        <div className="relative w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search departures..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64"
          />
        </div>
      </div>

      <ResponsiveTable
        headers={['#', 'Image', 'Trip Details', 'Dates', 'Status / Seats', 'Pricing', 'Actions']}
        rows={tableRows}
        data={departures}
        emptyText="No fixed departures found."
        columnClassNames={['w-12 text-center', 'w-16', undefined, undefined, 'text-center', 'text-right', 'text-right']}
        mobileCards={(_row, data, index) => {
          const d = data as (typeof departures)[number];
          return (
            <>
              <div className="flex items-start gap-3">
                <img
                  src={d.heroImage || 'https://via.placeholder.com/150'}
                  alt={d.title}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/departures/${d.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block truncate">
                    {d.title}
                  </Link>
                  <span className="block text-[10px] text-gray-400 font-normal truncate">#{index + 1} · {d.durationDays} · {d.seatsLeft} Seats Left</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-[11px]">
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Start Date</span>
                  <span className="font-semibold text-gray-700">{d.startDate}</span>
                  {d.endDate && <span className="block text-[10px] text-gray-400 font-normal">To: {d.endDate}</span>}
                </div>
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Price</span>
                  <span className="font-bold text-[#112233]">US$ {d.price}</span>
                  {d.originalPrice && <span className="block text-[10px] text-gray-400 line-through">US$ {d.originalPrice}</span>}
                </div>
                <div className="min-w-0 col-span-2">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    d.status === 'Guaranteed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    d.status === 'Filling Fast' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                    d.status === 'Sold Out' ? 'bg-red-50 text-red-700 border border-red-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                <ToggleShow model="departures" resource="departures" id={d.id} published={d.published} />
                <EditButton href={`/admin/departures/${d.id}/edit`} />
                <ViewButton href="/#departures" />
                <DeleteButton id={d.id} model="departures" title={d.title} />
              </div>
            </>
          );
        }}
      />

    </div>
  );
}