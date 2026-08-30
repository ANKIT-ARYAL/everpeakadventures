/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import DeleteButton from "../components/DeleteButton";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";
import AdminPageLayout from "../components/AdminPageLayout";

export const dynamic = 'force-dynamic';

export default async function AdminContactSubmissionsPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const tableRows = submissions.map((sub, index) => [
    <span key="index" className="text-gray-400 font-medium whitespace-nowrap">{index + 1}</span>,
    <div key="name" className="font-bold text-[#112233] break-words">
      {sub.firstName} {sub.lastName}
    </div>,
    <span key="email" className="text-[#24a0ed] font-semibold break-all">
      {sub.email}
    </span>,
    <span key="phone" className="text-gray-600 font-medium whitespace-nowrap">
      {sub.phone}
    </span>,
    <span key="method" className="font-semibold uppercase tracking-wider text-gray-700 whitespace-nowrap">
      {sub.contactMethod}
    </span>,
    <span key="time" className="text-gray-600 font-medium whitespace-nowrap">
      {sub.bestTime}
    </span>,
    <span key="msg" className="text-gray-600 font-medium block max-w-xs line-clamp-2 break-words">
      {sub.message}
    </span>,
    <span key="date" className="text-gray-500 font-medium whitespace-nowrap">
      {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
    </span>,
    <div key="actions" className="flex items-center justify-end gap-2 whitespace-nowrap">
      <DeleteButton id={sub.id} model="contact-submissions" title={`${sub.firstName} ${sub.lastName}`} />
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="Contact Submissions"
      description="Inquiries submitted via the contact form."
      actions={
        <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
          {submissions.length} items
        </span>
      }
    >
      <div className="flex flex-col gap-6 pb-10 min-w-0">
        <ResponsiveTable
          headers={['#', 'Name', 'Email', 'Phone', 'Contact Method', 'Best Time', 'Message', 'Submitted', 'Actions']}
          rows={tableRows}
          data={submissions}
          emptyText="No submissions found."
          columnClassNames={['w-16 text-center whitespace-nowrap', 'w-[180px]', 'w-[200px]', 'w-32 whitespace-nowrap', 'w-36 whitespace-nowrap', 'w-32 whitespace-nowrap', 'w-[250px]', 'w-32 whitespace-nowrap', 'text-right whitespace-nowrap']}
          mobileCards={(_row, sub, index) => (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="block font-bold text-[#112233] text-lg sm:text-xl truncate">
                    {sub.firstName} {sub.lastName}
                  </span>
                  <span className="block text-[#24a0ed] font-semibold text-sm truncate">{sub.email}</span>
                  <span className="block text-gray-400 mt-0.5 text-xs">#{index + 1} · Phone: {sub.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 mt-4 text-xs">
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Contact Method</span>
                  <span className="font-semibold uppercase tracking-wider text-gray-700 block">{sub.contactMethod}</span>
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Best Time</span>
                  <span className="text-gray-600 font-medium block">{sub.bestTime}</span>
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Message</span>
                  <span className="text-gray-600 line-clamp-3 break-words">{sub.message}</span>
                </div>
                <div className="min-w-0 sm:col-span-2">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Submitted</span>
                  <span className="text-gray-500 font-medium whitespace-nowrap">
                    {new Date(sub.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                <DeleteButton id={sub.id} model="contact-submissions" title={`${sub.firstName} ${sub.lastName}`} />
              </div>
            </div>
          )}
        />
      </div>
    </AdminPageLayout>
  );
}