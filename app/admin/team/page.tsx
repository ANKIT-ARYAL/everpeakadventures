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

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  });

  const tableRows = members.map((member, index) => [
    <span key="n" className="text-gray-400 font-medium whitespace-nowrap">{index + 1}</span>,
    <img
      key="img"
      src={member.image || 'https://via.placeholder.com/150'}
      alt={member.name}
      className="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm"
    />,
    <div key="name" className="min-w-0">
      <Link href={`/admin/team/${member.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block break-words">
        {member.name}
      </Link>
    </div>,
    <span key="role" className="font-semibold uppercase tracking-wider text-[#24a0ed] break-words">{member.role}</span>,
    <span key="order" className="font-bold text-gray-700 whitespace-nowrap">{member.order}</span>,
    <div key="actions" className="flex items-center justify-end gap-2 whitespace-nowrap">
      <ToggleShow model="team" resource="team" id={member.id} published={member.published} />
      <EditButton href={`/admin/team/${member.id}/edit`} />
      <ViewButton href="/our-team" />
      <DeleteButton id={member.id} model="team" title={member.name} />
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="Team Members"
      description="Manage team members, roles, bios, and photos."
      actions={
        <div className="flex items-center gap-4">
          <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-1 rounded-full text-sm whitespace-nowrap">
            {members.length} items
          </span>
          <AddNewButton href="/admin/team/new" label="Add New Member" />
        </div>
      }
    >
      <div className="flex flex-col gap-6 pb-10 min-w-0">

        {/* Filter / Search Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
          <span className="font-bold text-gray-700 whitespace-nowrap text-sm">
            All ({members.length})
          </span>
          <div className="relative w-full sm:w-auto">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search team members..." 
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        <ResponsiveTable
          headers={['#', 'Image', 'Name', 'Role', 'Order', 'Actions']}
          rows={tableRows}
          data={members}
          emptyText="No team members found."
          columnClassNames={['w-16 text-center whitespace-nowrap', 'w-16 whitespace-nowrap', 'w-[250px]', 'w-[250px]', 'w-24 text-center whitespace-nowrap', 'text-right whitespace-nowrap']}
          mobileCards={(_row, data, index) => {
            const m = data as (typeof members)[number];
            return (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
                <div className="flex flex-col sm:flex-row-reverse items-center justify-between gap-4 min-w-0">
                  <img
                    src={m.image || 'https://via.placeholder.com/150'}
                    alt={m.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full border border-gray-200 shadow-sm shrink-0"
                  />
                  <div className="min-w-0 flex-1 w-full">
                    <Link href={`/admin/team/${m.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block text-lg sm:text-xl leading-tight break-words">
                      {m.name}
                    </Link>
                    <span className="block text-xs text-gray-400 font-normal truncate mt-1">
                      #{index + 1}
                    </span>

                    <div className="mt-4 text-xs">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Role</span>
                      <span className="font-semibold uppercase tracking-wider text-[#24a0ed] break-words">{m.role}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                  <ToggleShow model="team" resource="team" id={m.id} published={m.published} />
                  <EditButton href={`/admin/team/${m.id}/edit`} />
                  <ViewButton href="/our-team" />
                  <DeleteButton id={m.id} model="team" title={m.name} />
                </div>
              </div>
            );
          }}
        />

      </div>
    </AdminPageLayout>
  );
}