import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { CalendarDays, RefreshCw } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";
import { getAdminDepartures, tripOf } from "@/lib/departures";

export const dynamic = 'force-dynamic';

function fmtDate(d: Date | null | undefined) {
  if (!d) return '';
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function AdminDeparturesPage() {
  const departures = await getAdminDepartures();
  const tripCount = await prisma.trek.count();

  const tableRows = departures.map((departure) => {
    const trip = tripOf(departure);
    const title = trip?.title ?? '—';
    const image = trip?.heroImage ?? '';
    const duration = departure.tripType === 'trek' ? trip?.durationDays : trip?.duration;
    const tripHref = departure.tripType === 'trek' && trip?.slug ? `/trekking/${trip.slug}` : trip?.slug ? `/tour/${trip.slug}` : null;

    return [
      <img
        key="img"
        src={image || 'https://via.placeholder.com/150'}
        alt={title}
        className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
      />,
      <div key="title">
        <Link href={`/admin/departures/${departure.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed]">
          {title}
        </Link>
        <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
          {departure.tripType === 'trek' ? 'Trek' : 'Tour'}{duration ? ` · ${duration}` : ''}
        </span>
      </div>,
      <div key="dates" className="font-semibold text-gray-700">
        {fmtDate(departure.startDate)}
        {departure.endDate && (
          <span className="block text-[10px] text-gray-400 font-normal mt-0.5">To: {fmtDate(departure.endDate)}</span>
        )}
        {departure.recurring && (
          <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">
            <RefreshCw className="w-2.5 h-2.5" /> Every Year
          </span>
        )}
        {departure.price && (
          <span className="block text-[10px] text-emerald-600 font-bold mt-0.5">{departure.price}</span>
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
      <div key="actions" className="flex items-center justify-end gap-2">
        <ToggleShow model="departures" resource="departures" id={departure.id} published={departure.published} />
        <EditButton href={`/admin/departures/${departure.id}/edit`} />
        {tripHref && <ViewButton href={tripHref} />}
        <DeleteButton id={departure.id} model="departures" title={title} />
      </div>,
    ];
  });

  return (
    <div className="space-y-6 max-w-[1400px] xl:max-w-none mx-auto text-xs">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Fixed Departures</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {departures.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Each departure is a concrete date for a Trek or Tour. Recurring ones auto-roll forward for 2 years.</p>
        </div>
        <AddNewButton href="/admin/departures/new" label="Add New Departure" />
      </div>

      <ResponsiveTable
        headers={['', 'Trip', 'Dates', 'Status / Seats', 'Actions']}
        rows={tableRows}
        data={departures}
        emptyText={`No departures yet. Add one for a trek or tour (${tripCount} treks available).`}
        columnClassNames={['w-16', undefined, undefined, 'text-center', 'text-right']}
        mobileCards={(_row, departure) => {
          const trip = tripOf(departure);
          const title = trip?.title ?? '—';
          const image = trip?.heroImage ?? '';
          const duration = departure.tripType === 'trek' ? trip?.durationDays : trip?.duration;
          return (
            <>
              <div className="flex items-start gap-3">
                <img
                  src={image || 'https://via.placeholder.com/150'}
                  alt={title}
                  className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/departures/${departure.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block truncate">
                    {title}
                  </Link>
                  <span className="block text-[10px] text-gray-400 font-normal truncate">
                    {departure.tripType === 'trek' ? 'Trek' : 'Tour'}{duration ? ` · ${duration}` : ''} · {departure.seatsLeft} Seats Left
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-[11px]">
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Dates</span>
                  <span className="font-semibold text-gray-700">{fmtDate(departure.startDate)}</span>
                  {departure.endDate && <span className="block text-[10px] text-gray-400 font-normal">To: {fmtDate(departure.endDate)}</span>}
                </div>
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
                  <span className="font-bold text-[#112233]">{departure.status}</span>
                  {departure.recurring && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 border border-violet-200 rounded px-1.5 py-0.5">
                      <RefreshCw className="w-2.5 h-2.5" /> Every Year
                    </span>
                  )}
                  {departure.price && (
                    <span className="block text-[10px] text-emerald-600 font-bold mt-0.5">{departure.price}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <ToggleShow model="departures" resource="departures" id={departure.id} published={departure.published} />
                <EditButton href={`/admin/departures/${departure.id}/edit`} />
                <DeleteButton id={departure.id} model="departures" title={title} />
              </div>
            </>
          );
        }}
      />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-blue-800">
        <CalendarDays className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed">
          The frontend only shows departures in the next 2 years. Recurring departures (&quot;Every Year&quot;) automatically get a new
          dated instance created for each upcoming year, so you never have to re-enter them.
        </p>
      </div>
    </div>
  );
}
