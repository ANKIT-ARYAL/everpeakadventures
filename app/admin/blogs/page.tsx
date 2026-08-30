/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";
import AdminPageLayout from "../components/AdminPageLayout";

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { order: 'asc' },
  });

  const tableRows = posts.map((post, index) => [
    <span key="index" className="text-gray-400 font-medium whitespace-nowrap">{index + 1}</span>,
    <img
      key="img"
      src={post.image || 'https://via.placeholder.com/150'}
      alt={post.title}
      className="w-10 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
    />,
    <div key="title" className="min-w-0">
      <Link href={`/admin/blogs/${post.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block line-clamp-2 break-words">
        {post.title}
      </Link>
      <span className="block text-[10px] text-gray-400 font-normal mt-0.5 truncate">
        Slug: {post.slug}
      </span>
    </div>,
    <span key="category" className="font-semibold uppercase tracking-wider text-[#24a0ed] whitespace-nowrap">
      {post.category}
    </span>,
    <span key="date" className="text-gray-600 font-medium whitespace-nowrap">
      {post.date}
    </span>,
    <span key="order" className="font-bold text-gray-700 whitespace-nowrap">
      {post.order}
    </span>,
    <div key="actions" className="flex items-center justify-end gap-2 whitespace-nowrap">
      <ToggleShow model="blogs" resource="blogs" id={post.id} published={post.published} />
      <EditButton href={`/admin/blogs/${post.id}/edit`} />
      <ViewButton href={`/blog/${post.slug}`} />
      <DeleteButton id={post.id} model="blogs" title={post.title} />
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="Blog Posts"
      description="Manage articles, travel stories, SEO settings, and FAQs."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {posts.length} items
          </span>
          <AddNewButton href="/admin/blogs/new" label="Add New Post" />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10 min-w-0">

        {/* Filter / Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({posts.length})
          </span>
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search posts..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        <ResponsiveTable
          headers={['#', 'Image', 'Title', 'Category', 'Date', 'Order', 'Actions']}
          rows={tableRows}
          data={posts}
          emptyText="No blog posts found."
          columnClassNames={['w-16 text-center whitespace-nowrap', 'w-16 whitespace-nowrap', 'w-[320px]', 'w-40 whitespace-nowrap', 'w-32 whitespace-nowrap', 'w-24 text-center whitespace-nowrap', 'text-right whitespace-nowrap']}
          mobileCards={(_row, post, index) => (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
              <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-4 min-w-0">
                <img
                  src={post.image || 'https://via.placeholder.com/150'}
                  alt={post.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border border-gray-200 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1 w-full">
                  <Link href={`/admin/blogs/${post.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block text-lg sm:text-xl leading-tight break-words">
                    {post.title}
                  </Link>
                  <span className="block text-xs text-gray-400 font-normal truncate mt-1">
                    #{index + 1} · Slug: {post.slug}
                  </span>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-4 text-xs">
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Category</span>
                      <span className="font-semibold uppercase tracking-wider text-[#24a0ed] truncate block">{post.category}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Date</span>
                      <span className="text-gray-600 font-medium truncate block">{post.date}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                <ToggleShow model="blogs" resource="blogs" id={post.id} published={post.published} />
                <EditButton href={`/admin/blogs/${post.id}/edit`} />
                <ViewButton href={`/blog/${post.slug}`} />
                <DeleteButton id={post.id} model="blogs" title={post.title} />
              </div>
            </div>
          )}
        />

      </div>
    </AdminPageLayout>
  );
}