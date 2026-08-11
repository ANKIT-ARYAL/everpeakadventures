import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AdminContactSubmissionsPage() {
  const submissions = await prisma.contactSubmission.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">

      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Contact Submissions</h1>
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
            {submissions.length} items
          </span>
        </div>
        <p className="text-gray-500 mt-1">Inquiries submitted via the contact form.</p>
      </div>

      {/* Data Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Contact Method</th>
                <th className="py-3 px-4">Best Time</th>
                <th className="py-3 px-4">Message</th>
                <th className="py-3 px-4">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 font-medium">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((submission, index) => (
                  <tr key={submission.id} className="hover:bg-[#fcfcfc] transition-colors">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>

                    <td className="py-3 px-4 font-bold text-[#112233]">
                      {submission.firstName} {submission.lastName}
                    </td>

                    <td className="py-3 px-4 text-[#24a0ed] font-semibold">
                      {submission.email}
                    </td>

                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {submission.phone}
                    </td>

                    <td className="py-3 px-4 font-semibold uppercase tracking-wider text-gray-700">
                      {submission.contactMethod}
                    </td>

                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {submission.bestTime}
                    </td>

                    <td className="py-3 px-4 text-gray-600 font-medium max-w-xs">
                      <span className="line-clamp-2">{submission.message}</span>
                    </td>

                    <td className="py-3 px-4 text-gray-500 font-medium whitespace-nowrap">
                      {new Date(submission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
        {submissions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
            No submissions found.
          </div>
        ) : (
          submissions.map((submission, index) => (
            <div key={submission.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <span className="block font-bold text-[#112233] truncate">
                    {submission.firstName} {submission.lastName}
                  </span>
                  <span className="block text-[#24a0ed] font-semibold text-sm truncate">{submission.email}</span>
                  <span className="block text-gray-500 mt-0.5 text-[11px] truncate">#{index + 1} · {submission.phone}</span>
                </div>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">#{index + 1}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 text-[11px]">
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Contact Method</span>
                  <span className="font-semibold uppercase tracking-wider text-gray-700 truncate block">{submission.contactMethod}</span>
                </div>
                <div className="min-w-0">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Best Time</span>
                  <span className="text-gray-600 font-medium">{submission.bestTime}</span>
                </div>
                <div className="min-w-0 col-span-2">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Message</span>
                  <span className="text-gray-600 line-clamp-2">{submission.message}</span>
                </div>
                <div className="min-w-0 col-span-2">
                  <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Submitted</span>
                  <span className="text-gray-500 font-medium whitespace-nowrap">
                    {new Date(submission.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
