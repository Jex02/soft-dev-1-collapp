'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type ProfileData = {
  role: 'student' | 'school_rep' | 'admin';
  fullName: string;
  description: string;
  address: string;
  avatarUrl: string | null;
  email: string;
  collegeName?: string;
  collegeDescription?: string;
  collegeAddress?: string;
  collegeLogoUrl?: string | null;
};

export default function SettingsPage() {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, string>>({});
  const [role, setRole] = useState<'student' | 'school_rep' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/server/profile');
      if (!res.ok) {
        router.replace('/');
        return;
      }

      const data = (await res.json()) as ProfileData;
      if (data.role !== 'student' && data.role !== 'school_rep') {
        router.replace('/');
        return;
      }

      setRole(data.role);
      setForm({
        fullName: data.fullName ?? '',
        description: data.description ?? '',
        address: data.address ?? '',
        avatarUrl: data.avatarUrl ?? '',
        email: data.email ?? '',
        password: '',
        schoolName: data.collegeName ?? '',
        schoolDescription: data.collegeDescription ?? '',
        schoolAddress: data.collegeAddress ?? '',
        schoolLogoUrl: data.collegeLogoUrl ?? '',
      });
      setLoading(false);
    };

    load();
  }, [router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const res = await fetch('/server/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setMessage(data.error ?? 'Failed to save settings.');
      setSaving(false);
      return;
    }

    setMessage('Settings updated successfully.');
    setForm((prev) => ({ ...prev, password: '' }));
    setSaving(false);
  };

  if (loading || !role) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Account Settings</h1>
        <p className="mb-6 text-sm text-slate-600">Update your profile and security information.</p>

        <form className="space-y-5" onSubmit={onSubmit}>
          <label className="block text-sm font-medium text-slate-700">
            Name
            <input className="mt-1 w-full rounded border border-slate-300 p-2" value={form.fullName ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Description
            <textarea className="mt-1 w-full rounded border border-slate-300 p-2" value={form.description ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Address
            <input className="mt-1 w-full rounded border border-slate-300 p-2" value={form.address ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            Profile picture URL
            <input className="mt-1 w-full rounded border border-slate-300 p-2" value={form.avatarUrl ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, avatarUrl: e.target.value }))} />
          </label>

          {role === 'school_rep' && (
            <>
              <label className="block text-sm font-medium text-slate-700">
                School name
                <input className="mt-1 w-full rounded border border-slate-300 p-2" value={form.schoolName ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, schoolName: e.target.value }))} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                School description
                <textarea className="mt-1 w-full rounded border border-slate-300 p-2" value={form.schoolDescription ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, schoolDescription: e.target.value }))} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                School address
                <input className="mt-1 w-full rounded border border-slate-300 p-2" value={form.schoolAddress ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, schoolAddress: e.target.value }))} />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                School logo URL
                <input className="mt-1 w-full rounded border border-slate-300 p-2" value={form.schoolLogoUrl ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, schoolLogoUrl: e.target.value }))} />
              </label>
            </>
          )}

          <label className="block text-sm font-medium text-slate-700">
            Email
            <input type="email" className="mt-1 w-full rounded border border-slate-300 p-2" value={form.email ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          </label>

          <label className="block text-sm font-medium text-slate-700">
            New password
            <input type="password" className="mt-1 w-full rounded border border-slate-300 p-2" value={form.password ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
          </label>

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="rounded bg-slate-900 px-4 py-2 text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save changes'}</button>
            <button type="button" onClick={() => router.back()} className="rounded border border-slate-300 px-4 py-2">Back</button>
          </div>

          {message && <p className="text-sm text-slate-700">{message}</p>}
        </form>
      </div>
    </div>
  );
}
