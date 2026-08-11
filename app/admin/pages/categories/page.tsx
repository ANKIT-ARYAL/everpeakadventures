import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderTree, Folder } from "lucide-react";
import AddNewButton from "../../components/AddNewButton";
import EditButton from "../../components/EditButton";
import DeleteButton from "../../components/DeleteButton";
import ToggleShow from "../../components/ToggleShow";

export const dynamic = 'force-dynamic';

export default async function AdminPageCategoriesPage() {
  const categories = await prisma.pageCategory.findMany({
    orderBy: [{ parentId: 'asc' }, { order: 'asc' }],
    include: { _count: { select: { pages: true, children: true } } },
  });

  const roots = categories.filter((c) => !c.parentId);
  const childrenByParent = new Map<string, typeof categories>();
  for (const c of categories) {
    if (c.parentId) {
      const list = childrenByParent.get(c.parentId) || [];
      list.push(c);
      childrenByParent.set(c.parentId, list);
    }
  }

  return (
    <div className="space-y-6 max-w-[1100px] mx-auto text-sm">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#112233] uppercase tracking-wide flex items-center gap-3">
            <FolderTree className="w-6 h-6 text-indigo-500" /> Page Categories
          </h1>
          <p className="text-gray-500 mt-1">Main categories contain sub-categories and pages inside them.</p>
        </div>
        <AddNewButton href="/admin/pages/categories/new" label="Add New Main Category" />
      </div>

      <div className="space-y-4">
        {roots.length === 0 && categories.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
            No categories yet. Create a main category to organize pages.
          </div>
        )}

        {roots.map((root) => (
          <div key={root.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#f8f9fa] border-b border-gray-200">
              <div className="flex items-center gap-3 min-w-0">
                <Folder className="w-5 h-5 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <div className="font-bold text-[#112233] truncate">{root.name}</div>
                  <div className="text-xs text-gray-400">{root.slug} · {root._count.pages} pages · {root._count.children} sub-categories</div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
                <Link href="/admin/pages/categories/new" className="text-indigo-600 font-bold text-xs px-2 py-1.5 rounded hover:bg-indigo-50">
                  + Sub Category / Page
                </Link>
                <Link href="/admin/pages/new" className="text-indigo-600 font-bold text-xs px-2 py-1.5 rounded hover:bg-indigo-50">
                  + Page
                </Link>
                <ToggleShow model="page-categories" resource="page-categories" id={root.id} published={root.published} />
                <EditButton href={`/admin/pages/categories/${root.id}/edit`} />
                <DeleteButton id={root.id} model="page-categories" title={root.name} />
              </div>
            </div>

            {(childrenByParent.get(root.id) || []).map((child) => (
              <div key={child.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pl-10 pr-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-4 h-px bg-gray-300 shrink-0" />
                  <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-[#112233] truncate">{child.name}</div>
                    <div className="text-xs text-gray-400">{child.slug} · {child._count.pages} pages</div>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
                  <Link href="/admin/pages/new" className="text-indigo-600 font-bold text-xs px-2 py-1.5 rounded hover:bg-indigo-50">
                    + Page
                  </Link>
                  <ToggleShow model="page-categories" resource="page-categories" id={child.id} published={child.published} />
                  <EditButton href={`/admin/pages/categories/${child.id}/edit`} />
                  <DeleteButton id={child.id} model="page-categories" title={child.name} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}