'use client';

import React from 'react';
import AdminPageLayout from '../components/AdminPageLayout';
import AdminTable from '../components/AdminTable';
import AdminCard from '../components/AdminCard';
import { Database, Globe, Server, Plus, Settings } from 'lucide-react';

export default function SitesManagementPage() {
  const dummySites = [
    { id: '1', name: 'Everpeak Adventures', domain: 'everpeakadventures.com', status: 'active', db: 'PostgreSQL (Supabase)', version: 'v1.0.0' },
    { id: '2', name: 'Future Trek Co.', domain: 'demo.futuretrek.co', status: 'provisioning', db: 'PostgreSQL (Supabase)', version: 'v1.0.1-beta' },
  ];

  return (
    <AdminPageLayout
      title="Sites & Databases"
      description="Superadmin management of tenant sites and their database connections."
      actions={
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          <Plus className="w-4 h-4" />
          <span>Provision New Site</span>
        </button>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AdminCard className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Active Sites</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
          </AdminCard>
          <AdminCard className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <Database className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Database Health</p>
              <p className="text-2xl font-bold text-emerald-600">Optimal</p>
            </div>
          </AdminCard>
          <AdminCard className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
              <Server className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Server Region</p>
              <p className="text-2xl font-bold text-gray-900">us-east-1</p>
            </div>
          </AdminCard>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mt-2">Tenant Workspaces</h2>
        <AdminTable>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-900">Workspace Name</th>
              <th className="px-4 py-3 font-semibold text-gray-900">Primary Domain</th>
              <th className="px-4 py-3 font-semibold text-gray-900">Database Engine</th>
              <th className="px-4 py-3 font-semibold text-gray-900">Status</th>
              <th className="px-4 py-3 font-semibold text-gray-900 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {dummySites.map((site) => (
              <tr key={site.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{site.name}</div>
                  <div className="text-xs text-gray-500">{site.version}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                  {site.domain}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-gray-500">
                  {site.db}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    site.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors" title="Settings">
                    <Settings className="w-5 h-5 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </AdminPageLayout>
  );
}
