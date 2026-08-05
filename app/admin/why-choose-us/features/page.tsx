import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Search } from 'lucide-react';
import AddNewButton from "../../components/AddNewButton";
import EditButton from "../../components/EditButton";
import DeleteButton from "../../components/DeleteButton";

export const dynamic = 'force-dynamic';

export default async function AdminWhyChooseUsFeaturesPage() {
  const features = await prisma.whyChooseUsFeature.findMany({
    orderBy: { order: 'asc' },
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto text-xs">
      
      {/* Top Header Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#112233] oswald uppercase tracking-wide">Features Grid</h1>
            <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-full">
              {features.length} items
            </span>
          </div>
          <p className="text-gray-500 mt-1">Manage the features grid cards displayed in the Why Choose Us section.</p>
        </div>

        <AddNewButton href="/admin/why-choose-us/features/new" label="Add New Feature" />
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between gap-4">
        <span className="font-bold text-gray-700">All ({features.length})</span>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search features..." 
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#24a0ed] w-64"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-4 w-16">Icon</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-center">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {features.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400 font-medium">
                    No features found.
                  </td>
                </tr>
              ) : (
                features.map((feature, index) => (
                  <tr key={feature.id} className="hover:bg-[#fcfcfc] transition-colors group">
                    <td className="py-3 px-4 text-center text-gray-400 font-medium">{index + 1}</td>
                    
                    <td className="py-3 px-4 text-center text-lg">
                      {feature.icon}
                    </td>
                    
                    <td className="py-3 px-4 font-bold text-[#112233]">
                      <Link href={`/admin/why-choose-us/features/${feature.id}/edit`} className="hover:text-[#24a0ed]">
                        {feature.title}
                      </Link>
                    </td>
                    
                    <td className="py-3 px-4 text-gray-600 font-medium max-w-md">
                      <span className="line-clamp-2">{feature.description}</span>
                    </td>
                    
                    <td className="py-3 px-4 text-center font-bold text-gray-700">
                      {feature.order}
                    </td>
                    
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditButton href={`/admin/why-choose-us/features/${feature.id}/edit`} />
                        <DeleteButton id={feature.id} model="why-choose-us-features" title={feature.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
