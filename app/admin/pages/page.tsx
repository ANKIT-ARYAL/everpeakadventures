import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Folder, FolderTree, FilePlus2, FileStack } from "lucide-react";
import { auth } from "@/auth";
import { SITEMAP_SECTIONS, sectionChildren } from "@/lib/sitemap";
import { SectionCard } from "../components/site-map";
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";

export const dynamic = 'force-dynamic';

export default async function AdminPagesPage() {
  const session = await auth();
  const isSuperAdmin = !!session?.user?.isSuperAdmin;
  const permissions = session?.user?.permissions ?? [];
  const can = (perm: string) => isSuperAdmin || permissions.includes(perm);

  const [pages, categories] = await Promise.all([
    prisma.contentPage.findMany({ orderBy: { order: 'asc' }, include: { category: true } }),
    prisma.pageCategory.findMany({ orderBy: [{ parentId: 'asc' }, { order: 'asc' }] }),
  ]);

  const roots = categories.filter((c) => !c.parentId);
  const childrenByParent = new Map<string, typeof categories>();
  for (const c of categories) {
    if (c.parentId) {
      const list = childrenByParent.get(c.parentId) || [];
      list.push(c);
      childrenByParent.set(c.parentId, list);
    }
  }

  const pagesByCategory = new Map<string, typeof pages>();
  const uncategorized: typeof pages = [];
  for (const p of pages) {
    if (p.categoryId) {
      const list = pagesByCategory.get(p.categoryId) || [];
      list.push(p);
      pagesByCategory.set(p.categoryId, list);
    } else {
      uncategorized.push(p);
    }
  }

  const renderPage = (p: any) => (
    <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:pl-16 pr-4 py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
        <div className="min-w-0">
          <div className="font-semibold text-[#112233] truncate">{p.title}</div>
          <div className="text-xs text-gray-400">/{p.slug}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <ToggleShow model="pages" resource="pages" id={p.id} published={p.published} />
        <ViewButton href={`/pages/${p.slug}`} />
        <EditButton href={`/admin/pages/${p.id}/edit`} />
        <DeleteButton id={p.id} model="pages" title={p.title} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto text-sm">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#112233] uppercase tracking-wide flex items-center gap-3">
            <FileStack className="w-6 h-6 text-indigo-500" /> All Pages
          </h1>
          <p className="text-gray-500 mt-1">
            Every page on the website in one place. Choose a section below to open its pages.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/pages/categories" className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-bold flex items-center gap-2">
            <FolderTree className="w-4 h-4" /> Categories
          </Link>
          <AddNewButton href="/admin/pages/new" label="Add New Page" />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 px-1">Website Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SITEMAP_SECTIONS.filter((s) =>
            sectionChildren(s).some((l) => can(l.perm))
          ).map((section) => (
            <SectionCard
              key={section.key}
              section={section}
              count={sectionChildren(section).filter((l) => can(l.perm)).length}
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 px-1">Custom Pages</h2>
        <div className="space-y-4">
          {roots.length === 0 && categories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 text-center text-gray-400 font-medium">
              <p>No categories yet. Start by creating a main category, then add pages inside it.</p>
              <Link href="/admin/pages/categories/new" className="inline-flex items-center gap-2 mt-3 text-indigo-600 font-bold">
                <Folder className="w-4 h-4" /> Create first category
              </Link>
            </div>
          ) : null}

          {roots.map((root) => (
            <div key={root.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-[#f8f9fa] border-b border-gray-200">
                <div className="flex items-center gap-3 min-w-0">
                  <FolderTree className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div className="font-bold text-[#112233] truncate">{root.name}</div>
                </div>
                <Link href="/admin/pages/new" className="text-indigo-600 font-bold text-xs px-2 py-1.5 rounded hover:bg-indigo-50 flex items-center gap-1 shrink-0">
                  <FilePlus2 className="w-3.5 h-3.5" /> Add Page
                </Link>
              </div>

              {(childrenByParent.get(root.id) || []).map((child) => (
                <div key={child.id}>
                  <div className="flex items-center gap-3 pl-10 pr-4 py-2.5 bg-indigo-50/40 border-b border-gray-100">
                    <Folder className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="font-semibold text-[#112233]">{child.name}</span>
                    <span className="text-xs text-gray-400">({(pagesByCategory.get(child.id) || []).length} pages)</span>
                  </div>
                  {(pagesByCategory.get(child.id) || []).map(renderPage)}
                </div>
              ))}

              {(pagesByCategory.get(root.id) || []).map(renderPage)}
            </div>
          ))}

          {uncategorized.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-[#f8f9fa] border-b border-gray-200">
                <div className="font-bold text-[#112233]">Uncategorized Pages</div>
                <span className="text-xs text-gray-400">({uncategorized.length})</span>
              </div>
              {uncategorized.map(renderPage)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}