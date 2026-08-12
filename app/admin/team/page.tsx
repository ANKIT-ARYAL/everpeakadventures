import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../components/AddNewButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import ViewButton from "../components/ViewButton";
import ToggleShow from "../components/ToggleShow";
import ResponsiveTable from "@/app/components/admin/ResponsiveTable";

export const dynamic = 'force-dynamic';

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' },
  });

  const tableRows = members.map((member, index) => [
    <span key="n" className="text-gray-400 font-medium">{index + 1}</span>,
    <img
      key="img"
      src={member.image || 'https://via.placeholder.com/150'}
      alt={member.name}
      className="w-10 h-10 object-cover rounded-full border border-gray-200 shadow-sm"
    />,
    <Link key="name" href={`/admin/team/${member.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed]">
      {member.name}
    </Link>,
    <span key="role" className="font-semibold uppercase tracking-wider text-[#24a0ed]">{member.role}</span>,
    <span key="order" className="font-bold text-gray-700">{member.order}</span>,
    <div key="actions" className="flex items-center justify-end gap-2">
      <ToggleShow model="team" resource="team" id={member.id} published={member.published} />
      <EditButton href={`/admin/team/${member.id}/edit`} />
      <ViewButton href="/our-team" />
      <DeleteButton id={member.id} model="team" title={member.name} />
    </div>,
  ]);

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Team Members</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {members.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Manage team members, roles, bios, and photos.</p>
        </div>

        <AddNewButton href="/admin/team/new" label="Add New Member" />
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <span className="font-bold text-gray-700">All ({members.length})</span>
        <div className="relative w-full sm:w-auto">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search team members..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-full sm:w-64"
          />
        </div>
      </div>

      <ResponsiveTable
        headers={['#', 'Image', 'Name', 'Role', 'Order', 'Actions']}
        rows={tableRows}
        data={members}
        emptyText="No team members found."
        columnClassNames={['w-12 text-center', 'w-16', undefined, undefined, 'text-center', 'text-right']}
        mobileCards={(_row, data, index) => {
          const m = data as (typeof members)[number];
          return (
            <>
              <div className="flex items-start gap-3">
                <img
                  src={m.image || 'https://via.placeholder.com/150'}
                  alt={m.name}
                  className="w-12 h-12 object-cover rounded-full border border-gray-200 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/team/${m.id}/edit`} className="font-bold text-[#112233] hover:text-[#24a0ed] block truncate">
                    {m.name}
                  </Link>
                  <span className="block text-[10px] text-gray-400 font-normal">#{index + 1}</span>
                </div>
                <span className="bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full text-[10px] shrink-0">#{m.order}</span>
              </div>
              <div className="mt-3 text-[11px]">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Role</span>
                <span className="font-semibold uppercase tracking-wider text-[#24a0ed]">{m.role}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-gray-100">
                <ToggleShow model="team" resource="team" id={m.id} published={m.published} />
                <EditButton href={`/admin/team/${m.id}/edit`} />
                <ViewButton href="/our-team" />
                <DeleteButton id={m.id} model="team" title={m.name} />
              </div>
            </>
          );
        }}
      />

    </div>
  );
}
