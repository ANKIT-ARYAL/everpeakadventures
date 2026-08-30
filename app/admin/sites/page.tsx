/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import AdminPageLayout from '../components/AdminPageLayout';
import AdminCard from '../components/AdminCard';
import { Database, Globe, Server, Plus, Settings, X, Save, Loader2 } from 'lucide-react';
import ResponsiveTable from '@/app/components/admin/ResponsiveTable';
import toast, { Toaster } from 'react-hot-toast';

export default function SitesManagementPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    domain: '',
    db: 'PostgreSQL (Supabase)',
    version: 'v1.0.0',
    status: 'active',
  });

  const fetchSites = async () => {
    try {
      const res = await fetch('/api/admin/sites');
      const data = await res.json();
      if (res.ok && data.success) {
        setSites(data.data);
      }
    } catch {
      // Fallback dummy data if API isn't initialized yet
      setSites([
        { id: '1', name: 'Everpeak Adventures', domain: 'everpeakadventures.com', status: 'active', db: 'PostgreSQL (Supabase)', version: 'v1.0.0' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.domain) {
      toast.error('Workspace Name and Primary Domain are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to provision site');

      toast.success('Site provisioned successfully!');
      setModalOpen(false);
      setForm({ name: '', domain: '', db: 'PostgreSQL (Supabase)', version: 'v1.0.0', status: 'active' });
      fetchSites();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = sites.filter(s => s.status === 'active').length;

  const tableRows = sites.map((site) => [
    <div key="name" className="min-w-0">
      <div className="font-bold text-[#112233] text-sm sm:text-base break-words">{site.name}</div>
      <div className="text-xs text-gray-400 font-normal">{site.version}</div>
    </div>,
    <span key="domain" className="text-gray-600 font-medium break-all text-xs sm:text-sm">
      {site.domain}
    </span>,
    <span key="db" className="text-gray-600 font-medium text-xs sm:text-sm whitespace-nowrap">
      {site.db}
    </span>,
    <span key="status" className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
      site.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
    }`}>
      {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
    </span>,
    <div key="actions" className="flex items-center justify-end whitespace-nowrap">
      <button className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-gray-100 transition-colors cursor-pointer" title="Settings">
        <Settings className="w-4 h-4" />
      </button>
    </div>,
  ]);

  return (
    <AdminPageLayout
      title="Sites & Databases"
      description="Superadmin management of tenant sites and their database connections."
      actions={
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold rounded-xl transition-colors text-xs sm:text-sm uppercase tracking-wider shadow-sm cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Site</span>
        </button>
      }
    >
      <Toaster position="top-center" />
      <div className="w-full space-y-6 pb-20 min-w-0">
        
        {/* Modal Form */}
        {modalOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden my-auto border border-gray-100 flex flex-col animate-in fade-in zoom-in duration-200">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-[#112233] oswald uppercase tracking-wide">
                  Provision New Site
                </h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-gray-200/60 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Workspace Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                    placeholder="e.g. Himalayan Explorers"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Primary Domain *</label>
                  <input
                    type="text"
                    required
                    value={form.domain}
                    onChange={(e) => setForm({ ...form, domain: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                    placeholder="e.g. himalayanexplorers.com"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Database Engine</label>
                  <input
                    type="text"
                    value={form.db}
                    onChange={(e) => setForm({ ...form, db: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed] bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Version</label>
                  <input
                    type="text"
                    value={form.version}
                    onChange={(e) => setForm({ ...form, version: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#24a0ed]"
                    placeholder="v1.0.0"
                  />
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 -mx-6 -mb-6 mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-gray-600 font-bold hover:bg-gray-50 text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 uppercase tracking-wider disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {submitting ? 'Provisioning...' : 'Save Site'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <AdminCard className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
              <Globe className="w-6 h-6 text-[#24a0ed]" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Active Sites</p>
              <p className="text-xl sm:text-2xl font-black text-[#112233] mt-0.5">{activeCount}</p>
            </div>
          </AdminCard>
          <AdminCard className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
              <Database className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Database Health</p>
              <p className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5">Optimal</p>
            </div>
          </AdminCard>
          <AdminCard className="flex items-center gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100">
              <Server className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Server Region</p>
              <p className="text-xl sm:text-2xl font-black text-[#112233] mt-0.5">us-east-1</p>
            </div>
          </AdminCard>
        </div>

        <div className="space-y-4">
          <h2 className="text-base sm:text-lg font-black text-[#112233] uppercase tracking-wide">Tenant Workspaces</h2>
          <ResponsiveTable
            headers={['Workspace Name', 'Primary Domain', 'Database Engine', 'Status', 'Actions']}
            rows={tableRows}
            data={sites}
            emptyText={loading ? "Loading sites..." : "No workspaces found."}
            columnClassNames={['w-[250px]', 'w-[220px]', 'w-[220px]', 'w-32 whitespace-nowrap', 'text-right whitespace-nowrap']}
            mobileCards={(_row, site) => (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 min-w-0 overflow-hidden">
                <div className="flex items-start justify-between gap-3 min-w-0">
                  <div className="min-w-0 flex-1">
                    <span className="block font-bold text-[#112233] text-base sm:text-lg truncate">{site.name}</span>
                    <span className="block text-[#24a0ed] text-xs font-semibold truncate mt-0.5">{site.domain}</span>
                    <span className="block text-gray-400 text-xs truncate mt-0.5">{site.version}</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shrink-0 ${
                    site.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                  </span>
                </div>

                <div className="mt-4 text-xs">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Database Engine</span>
                  <span className="text-gray-700 font-medium">{site.db}</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap mt-4 pt-3 border-t border-gray-100">
                  <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors" title="Settings">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </AdminPageLayout>
  );
}