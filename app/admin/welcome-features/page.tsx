import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import { stripHtml } from "@/lib/stripHtml";

export const dynamic = 'force-dynamic';

export default async function AdminWelcomeFeaturesPage() {
  const features = await prisma.welcomeFeature.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-[1400px] xl:max-w-none mx-auto text-xs">

      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Welcome Features</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {features.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Manage the feature highlights displayed in the Welcome section.</p>
        </div>

        <AddNewButton href="/admin/welcome-features/new" label="Add New Feature" />
      </div>

      {/* Data Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {features.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    No welcome features found.
                  </td>
                </tr>
              ) : (
                features.map((feature, index) => (
                  <tr key={feature.id} className="hover:bg-[#fcfcfc] transition-colors group">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>

                    <td className="py-3 px-4 font-bold text-[#112233]">
                      <Link href={`/admin/welcome-features/${feature.id}/edit`} className="hover:text-[#24a0ed]">
                        {feature.title}
                      </Link>
                    </td>

                    <td className="py-3 px-4 text-gray-600 font-medium max-w-md">
                      {stripHtml(feature.description)}
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-gray-700">
                      {feature.order}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ToggleShow model="welcome-features" resource="welcome-features" id={feature.id} published={feature.published} />
                        <EditButton href={`/admin/welcome-features/${feature.id}/edit`} />
                        <ViewButton href="/" />
                        <DeleteButton id={feature.id} model="welcome-features" title={feature.title} />
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
        {features.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
            No welcome features found.
          </div>
        ) : (
          features.map((feature, index) => (
            <div key={feature.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/welcome-features/${feature.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] min-w-0 flex-1 block">
                  <span className="block truncate">#{index + 1} · {feature.title}</span>
                </Link>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">#{feature.order}</span>
              </div>
              <p className="text-gray-600 font-medium mt-2 text-[11px] line-clamp-3">{stripHtml(feature.description)}</p>
              <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <ToggleShow model="welcome-features" resource="welcome-features" id={feature.id} published={feature.published} />
                <EditButton href={`/admin/welcome-features/${feature.id}/edit`} />
                <ViewButton href="/" />
                <DeleteButton id={feature.id} model="welcome-features" title={feature.title} />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
