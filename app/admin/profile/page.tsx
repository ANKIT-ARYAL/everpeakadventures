'use client';

import React, { useEffect, useState } from 'react';
import { useSession, SessionProvider } from 'next-auth/react';
import { Save } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

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

  return (
    <div className="max-w-2xl mx-auto space-y-6 text-lg text-gray-800 p-6">
      <Toaster position="top-center" />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-black uppercase text-[#112233]">My Profile</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-bold mb-1">Display Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Recovery Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none"
              placeholder="e.g. admin@example.com (used for password reset)"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">New Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 border rounded-lg focus:border-[#24a0ed] outline-none"
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#24a0ed] hover:bg-[#1a85c6] text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 uppercase disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  return (
    <SessionProvider>
      <ProfileForm />
    </SessionProvider>
  );
}
