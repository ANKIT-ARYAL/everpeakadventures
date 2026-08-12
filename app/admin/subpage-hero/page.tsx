import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import AddNewButton from "../components/AddNewButton";
import ViewButton from "../components/ViewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ToggleShow from "../components/ToggleShow";

export const dynamic = 'force-dynamic';

export default async function AdminSubpageHeroPage() {
  const heroes = await prisma.subpageHero.findMany({
    orderBy: { slug: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Subpage Heroes</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {heroes.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Manage hero banners displayed on subpages.</p>
        </div>

        <AddNewButton href="/admin/subpage-hero/new" label="Add New Hero" />
      </div>

      {/* Data Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Subtitle</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {heroes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-400 font-medium">
                    No subpage heroes found.
                  </td>
                </tr>
              ) : (
                heroes.map((hero) => (
                  <tr key={hero.id} className="hover:bg-[#fcfcfc] transition-colors group">
                    <td className="py-3 px-4 font-bold text-[#112233]">
                      <Link href={`/admin/subpage-hero/${hero.id}/edit`} className="hover:text-[#24a0ed]">
                        {hero.slug}
                      </Link>
                      <span className="block text-[10px] text-gray-400 font-normal mt-0.5">
                        ID: {hero.id}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-gray-700">
                      {hero.title}
                    </td>

                    <td className="py-3 px-4 text-gray-500 font-medium max-w-md">
                      <span className="line-clamp-2">{hero.subtitle || '—'}</span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ToggleShow model="subpage-heroes" resource="subpage-hero" id={hero.id} published={hero.published} />
                        <EditButton href={`/admin/subpage-hero/${hero.id}/edit`} />
                        <ViewButton href={`/${hero.slug}`} />
                        <DeleteButton id={hero.id} model="subpage-heroes" title={hero.slug} />
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
        {heroes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
            No subpage heroes found.
          </div>
        ) : (
          heroes.map((hero) => (
            <div key={hero.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <Link href={`/admin/subpage-hero/${hero.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block truncate">
                {hero.slug}
              </Link>
              <span className="block text-[10px] text-gray-400 font-normal truncate">ID: {hero.id}</span>
              <div className="mt-3 text-[11px]">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Title</span>
                <span className="font-semibold text-gray-700">{hero.title}</span>
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-2">Subtitle</span>
                <span className="text-gray-500 font-medium line-clamp-2">{hero.subtitle || '—'}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <ToggleShow model="subpage-heroes" resource="subpage-hero" id={hero.id} published={hero.published} />
                <EditButton href={`/admin/subpage-hero/${hero.id}/edit`} />
                <ViewButton href={`/${hero.slug}`} />
                <DeleteButton id={hero.id} model="subpage-heroes" title={hero.slug} />
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
