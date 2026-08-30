/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import { Save } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import SectionCard from '@/app/components/admin/SectionCard';
import AdminPageLayout from '../components/AdminPageLayout';

function ProfileForm() {
  const { data: session, update } = useSession();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        name: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/users/${session?.user?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile');

      await update({ name: form.name, email: form.email });
      toast.success('Profile updated successfully');
      setForm((prev) => ({ ...prev, password: '' }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:border-[#24a0ed] bg-white';

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 pb-20 text-md font-sans text-gray-800 min-w-0">
      <Toaster position="top-center" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 min-w-0">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6 min-w-0">
          <SectionCard title="Personal Information" defaultOpen>
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Display Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">Recovery Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                  placeholder="e.g. admin@example.com (used for password reset)"
                />
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-6 xl:sticky xl:top-24 xl:self-start min-w-0">
          <SectionCard title="Security">
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1 text-sm">New Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className={inputCls}
                  placeholder="Leave blank to keep current"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2 uppercase tracking-wider text-xs sm:text-sm disabled:opacity-50 transition-colors cursor-pointer mt-2"
              >
                <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </SectionCard>
        </div>

      </div>
    </form>
  );
}

export default function AdminProfilePage() {
  return (
    <SessionProvider>
      <AdminPageLayout
        title="My Profile"
        description="Manage your admin account details and credentials."
      >
        <ProfileForm />
      </AdminPageLayout>
    </SessionProvider>
  );
}