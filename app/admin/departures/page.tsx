import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";

export const dynamic = 'force-dynamic';

export default async function AdminDeparturesPage() {
  const departures = await prisma.fixedDeparture.findMany({
    orderBy: { order: 'asc' },
  });

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
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
        <span className="font-bold text-gray-700">All ({departures.length})</span>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search departures..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-64"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-16">Image</th>
                <th className="py-3 px-4">Trip Details</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4 text-center">Status / Seats</th>
                <th className="py-3 px-4 text-right">Pricing</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {departures.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                    No fixed departures found.
                  </td>
                </tr>
              ) : (
                departures.map((departure, index) => (
                  <tr key={departure.id} className="hover:bg-[#fcfcfc] transition-colors group">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                    
                    <td className="py-3 px-4">
                      <img 
                        src={departure.heroImage || 'https://via.placeholder.com/150'} 
                        alt={departure.title} 
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </td>
                    
                    <td className="py-3 px-4 font-bold text-[#112233]">
                      <Link href={`/admin/departures/${departure.id}/edit`} className="hover:text-[#24a0ed]">
                        {departure.title}
                      </Link>
                      <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
                        {departure.durationDays}
                      </span>
                    </td>
                    
                    <td className="py-3 px-4 font-semibold text-gray-700">
                      {departure.startDate}
                      {departure.endDate && (
                        <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
                          To: {departure.endDate}
                        </span>
                      )}
                    </td>
                    
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                        departure.status === 'Guaranteed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        departure.status === 'Filling Fast' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                        departure.status === 'Sold Out' ? 'bg-red-50 text-red-700 border border-red-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {departure.status}
                      </span>
                      <span className="block text-[10px] text-gray-500 font-medium mt-1">
                        {departure.seatsLeft} Seats Left
                      </span>
                    </td>
                    
                    <td className="py-3 px-4 text-right">
                      <div className="font-bold text-[#112233]">US$ {departure.price}</div>
                      {departure.originalPrice && (
                        <div className="text-[10px] text-gray-400 line-through">
                          US$ {departure.originalPrice}
                        </div>
                      )}
                    </td>
                    
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditButton href={`/admin/departures/${departure.id}/edit`} />
                        <DeleteButton id={departure.id} model="departures" title={departure.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}