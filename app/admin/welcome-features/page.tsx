/* eslint-disable @next/next/no-img-element */
import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";
import { stripHtml } from "@/lib/stripHtml";
import AdminPageLayout from "../components/AdminPageLayout";

export const dynamic = 'force-dynamic';

export default async function AdminWelcomeFeaturesPage() {
  const features = await prisma.welcomeFeature.findMany({
    orderBy: { order: 'asc' },
  });

  const tableRows = features.map((feature, index) => [
    <span key="index" className="text-gray-400 font-medium whitespace-nowrap">
      {index + 1}
    </span>,
    <div key="title" className="min-w-0">
      <Link href={`/admin/welcome-features/${feature.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block break-words">
        {feature.title}
      </Link>
    </div>,
    <span key="desc" className="text-gray-600 font-medium block max-w-md line-clamp-2 break-words">
      {stripHtml(feature.description)}
    </span>,
    <span key="order" className="font-bold text-gray-700 whitespace-nowrap">
      {feature.order}
    </span>,
    <div key="actions" className="flex items-center justify-end gap-2 whitespace-nowrap">
      <ToggleShow model="welcome-features" resource="welcome-features" id={feature.id} published={feature.published} />
      <EditButton href={`/admin/welcome-features/${feature.id}/edit`} />
      <ViewButton href="/" />
      <DeleteButton id={feature.id} model="welcome-features" title={feature.title} />
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="Welcome Features"
      description="Manage the feature highlights displayed in the Welcome section."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {features.length} items
          </span>
          <AddNewButton href="/admin/welcome-features/new" label="Add New Feature" />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10 min-w-0">
        <ResponsiveTable
          headers={['#', 'Title', 'Description', 'Order', 'Actions']}
          rows={tableRows}
          data={features}
          emptyText="No welcome features found."
          columnClassNames={['w-16 text-center whitespace-nowrap', 'w-[280px]', 'w-[400px]', 'w-24 text-center whitespace-nowrap', 'text-right whitespace-nowrap']}
          mobileCards={(_row, feature, index) => (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <Link href={`/admin/welcome-features/${feature.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] min-w-0 flex-1 block text-lg sm:text-xl leading-tight break-words">
                  <span>#{index + 1} · {feature.title}</span>
                </Link>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-xs shrink-0">Order: {feature.order}</span>
              </div>
              <p className="text-gray-600 font-medium mt-3 text-xs sm:text-sm line-clamp-3 break-words">
                {stripHtml(feature.description)}
              </p>
              <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                <ToggleShow model="welcome-features" resource="welcome-features" id={feature.id} published={feature.published} />
                <EditButton href={`/admin/welcome-features/${feature.id}/edit`} />
                <ViewButton href="/" />
                <DeleteButton id={feature.id} model="welcome-features" title={feature.title} />
              </div>
            </div>
          )}
        />
      </div>
    </AdminPageLayout>
  );
}