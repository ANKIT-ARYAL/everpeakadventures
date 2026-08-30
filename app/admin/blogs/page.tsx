/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import AdminPageLayout from "../components/AdminPageLayout";
import AdminTable from "../components/AdminTable";
import BlogSearch from "./BlogSearch";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminBlogsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.toLowerCase() || "";

  const posts = await prisma.blogPost.findMany({
    orderBy: { order: "asc" },
  });

  const filteredPosts = posts.filter((post) => {
    if (!query) return true;
    return (
      post.title.toLowerCase().includes(query) ||
      post.slug.toLowerCase().includes(query) ||
      post.category.toLowerCase().includes(query)
    );
  });

  return (
    <AdminPageLayout
      title="Blog Posts"
      description="Manage articles, travel stories, SEO settings, and FAQs."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {filteredPosts.length} items
          </span>
          <AddNewButton
            href="/admin/blogs/new"
            label="Add New Post"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10">

        {/* =========================================================
            FILTER / SEARCH BAR
        ========================================================= */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({filteredPosts.length})
          </span>
          <BlogSearch placeholder="Search posts..." defaultValue={query} />
        </div>

        {/* =========================================================
            DESKTOP TABLE (Shown on 1280px+ screens)
        ========================================================= */}
        <div className="hidden xl:block">
          <AdminTable>
            <colgroup>
              <col className="w-[5%] min-w-[40px]" />
              <col className="w-[8%] min-w-[50px]" />
              <col className="w-[32%] min-w-[220px]" />
              <col className="w-[18%] min-w-[120px]" />
              <col className="w-[14%] min-w-[100px]" />
              <col className="w-[8%] min-w-[70px]" />
              <col className="w-[15%] min-w-[120px]" />
            </colgroup>

            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3 px-3 text-center whitespace-nowrap">#</th>
                <th className="py-3 px-3 whitespace-nowrap">Image</th>
                <th className="py-3 px-3">Title</th>
                <th className="py-3 px-3 whitespace-nowrap">Category</th>
                <th className="py-3 px-3 whitespace-nowrap">Date</th>
                <th className="py-3 px-3 whitespace-nowrap">Order</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-400 font-medium"
                  >
                    No blog posts found.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post, index) => (
                  <tr
                    key={post.id}
                    className="hover:bg-[#fcfcfc] transition-colors group align-middle"
                  >
                    <td className="py-3 px-3 text-center text-gray-400 font-medium whitespace-nowrap">
                      {index + 1}
                    </td>

                    <td className="py-3 px-3">
                      <img
                        src={
                          post.image ||
                          'https://via.placeholder.com/150'
                        }
                        alt={post.title}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                    </td>

                    <td className="py-3 px-3 min-w-0">
                      <Link
                        href={`/admin/blogs/${post.id}/edit`}
                        className="font-bold text-[#112233] hover:text-[#2271b1] block line-clamp-2 break-words"
                        title={post.title}
                      >
                        {post.title}
                      </Link>

                      <span
                        className="block text-[10px] text-gray-400 font-normal mt-0.5 truncate"
                        title={post.slug ?? undefined}
                      >
                        Slug: {post.slug || "—"}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-semibold uppercase tracking-wider text-[#2271b1] break-words">
                      {post.category || "—"}
                    </td>

                    <td className="py-3 px-3 text-gray-600 font-medium break-words">
                      {post.date || "—"}
                    </td>

                    <td className="py-3 px-3 font-bold text-gray-700 whitespace-nowrap">
                      {post.order}
                    </td>

                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <ToggleShow
                          model="blogs"
                          resource="blogs"
                          id={post.id}
                          published={post.published}
                        />
                        <EditButton href={`/admin/blogs/${post.id}/edit`} />
                        {post.slug && <ViewButton href={`/blog/${post.slug}`} />}
                        <DeleteButton id={post.id} model="blogs" title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </AdminTable>
        </div>

      {/* =========================================================
          MOBILE / TABLET CARDS (Shown on screens < 1280px)
      ========================================================= */}
      <div className="xl:hidden space-y-3 min-w-0">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 py-12 px-4 text-center text-gray-400 font-medium">
            No blog posts found.
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden"
            >
              {/* Card Header with vertically centered large image on the right */}
              <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-4 min-w-0">
                <img
                  src={
                    post.image ||
                    "https://via.placeholder.com/150"
                  }
                  alt={post.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-200 shadow-sm shrink-0"
                />

                <div className="min-w-0 flex-1 w-full">
                  <Link
                    href={`/admin/blogs/${post.id}/edit`}
                    className="font-bold text-[#112233] hover:text-[#2271b1] block text-lg sm:text-xl leading-tight break-words"
                    title={post.title}
                  >
                    {post.title}
                  </Link>

                  <span
                    className="block text-xs text-gray-400 font-normal truncate mt-1"
                    title={post.slug ?? undefined}
                  >
                    #{index + 1} · Slug: {post.slug || "no slug"}
                  </span>

                  {/* Blog Information Grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-xs">
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Category</span>
                      <span className="font-semibold uppercase tracking-wider text-[#2271b1] truncate block" title={post.category || undefined}>
                        {post.category || "N/A"}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date</span>
                      <span className="text-gray-600 font-medium truncate block">{post.date || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer / Actions */}
              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                <ToggleShow model="blogs" resource="blogs" id={post.id} published={post.published} />
                <EditButton href={`/admin/blogs/${post.id}/edit`} />
                {post.slug && <ViewButton href={`/blog/${post.slug}`} />}
                <DeleteButton id={post.id} model="blogs" title={post.title} />
              </div>

            </div>
          ))
        )}
      </div>
      </div>
    </AdminPageLayout>
  );
}