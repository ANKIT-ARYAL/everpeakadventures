/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import AddNewButton from "../components/AddNewButton";
import ViewButton from "../components/ViewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ToggleShow from "../components/ToggleShow";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";
import AdminPageLayout from "../components/AdminPageLayout";

export const dynamic = 'force-dynamic';

export default async function AdminActivityPage() {
  const activities = await prisma.activity.findMany({
    orderBy: { slug: 'asc' },
  });

  const tableRows = activities.map((activity: any) => [
    <div key="slug" className="min-w-0">
      <Link href={`/admin/activities/${activity.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block break-words">
        {activity.slug}
      </Link>
      <span className="block text-[10px] text-gray-400 font-normal mt-0.5 truncate">
        ID: {activity.id}
      </span>
    </div>,
    <span key="title" className="font-semibold text-gray-700 block break-words">
      {activity.title}
    </span>,
    <span key="desc" className="text-gray-500 font-medium block max-w-md line-clamp-2 break-words">
      {activity.description || '—'}
    </span>,
    <div key="actions" className="flex items-center justify-end gap-2 whitespace-nowrap">
      <ToggleShow model="activities" resource="activities" id={activity.id} published={activity.published} />
      <EditButton href={`/admin/activities/${activity.id}/edit`} />
      <ViewButton href={`/${activity.slug}`} />
      <DeleteButton id={activity.id} model="activities" title={activity.slug} />
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="Activities"
      description="Manage hero banners displayed on subpages."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {activities.length} items
          </span>
          <AddNewButton href="/admin/activities/new" label="Add New Activity" />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10 min-w-0">
        <ResponsiveTable
          headers={['Slug', 'Title', 'Subtitle', 'Actions']}
          rows={tableRows}
          data={activities}
          emptyText="No activities found."
          columnClassNames={['w-[250px]', 'w-[220px]', 'w-[350px]', 'text-right whitespace-nowrap']}
          mobileCards={(_row, activity: any) => (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
              <div className="flex items-start justify-between gap-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/activities/${activity.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block text-lg sm:text-xl leading-tight break-words">
                    {activity.slug}
                  </Link>
                  <span className="block text-xs text-gray-400 font-normal truncate mt-1">ID: {activity.id}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-3 mt-4 text-xs">
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Title</span>
                  <span className="font-semibold text-gray-700 block break-words">{activity.title}</span>
                </div>
                <div className="min-w-0">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Subtitle</span>
                  <span className="text-gray-500 font-medium line-clamp-3 break-words">{activity.description || '—'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                <ToggleShow model="activities" resource="activities" id={activity.id} published={activity.published} />
                <EditButton href={`/admin/activities/${activity.id}/edit`} />
                <ViewButton href={`/${activity.slug}`} />
                <DeleteButton id={activity.id} model="activities" title={activity.slug} />
              </div>
            </div>
          )}
        />
      </div>
    </AdminPageLayout>
  );
}