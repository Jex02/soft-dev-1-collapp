'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  BookOpen,
  Plus,
  Search,
  ChevronDown,
  Filter,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type CollegeOption = { id: number; name: string };

export default function ManageUserPage() {
  const router = useRouter();
  const [colleges, setColleges] = useState<CollegeOption[]>([]);
  const [collegeId, setCollegeId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loadingColleges, setLoadingColleges] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/server/colleges');
        if (!res.ok) throw new Error('Could not load colleges');
        const data = (await res.json()) as { id: number; name: string }[];
        if (!cancelled) {
          setColleges(data.map((c) => ({ id: c.id, name: c.name })));
        }
      } catch {
        if (!cancelled) setError('Failed to load colleges.');
      } finally {
        if (!cancelled) setLoadingColleges(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCreateRep = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const cid = parseInt(collegeId, 10);
    if (!email.trim() || !password || !username.trim() || !Number.isFinite(cid)) {
      setError('Fill in college, email, password, and username.');
      return;
    }

    const res = await fetch('/server/admin/school-reps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        username: username.trim(),
        collegeId: cid,
      }),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof body.error === 'string' ? body.error : 'Could not create rep.');
      return;
    }

    setMessage(`Created school rep for college id ${cid}. They can sign in at the School Rep portal.`);
    setEmail('');
    setPassword('');
    setFullName('');
    setUsername('');
    setCollegeId('');
  };

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    router.push('/admin-login');
  };

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-blue-600">COLLAPP</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-950">School rep accounts</h1>
            <p className="mt-1 text-slate-600">
              One rep per college (e.g. UP rep, CIT rep). The server needs the Supabase service role key in env as SUPABASE_SERVICE_ROLE_KEY.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Admin home
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-xl ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-950">Create school rep</h2>
          <p className="mt-1 text-sm text-slate-500">
            Pick the college this rep owns. They will only see that college and applications addressed to it.
          </p>

          <form onSubmit={handleCreateRep} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
              College
              <select
                required
                value={collegeId}
                onChange={(ev) => setCollegeId(ev.target.value)}
                disabled={loadingColleges}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
              >
                <option value="">Select college…</option>
                {colleges.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email (login)
              <input
                type="email"
                required
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Temporary password
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Username (profile)
              <input
                type="text"
                required
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Full name
              <input
                type="text"
                value={fullName}
                onChange={(ev) => setFullName(ev.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
              />
            </label>
            <div className="sm:col-span-2">
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
              <button
                type="submit"
                className="mt-3 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Create rep account
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200">
          <div className="flex flex-row flex-wrap items-start justify-between gap-8">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.45em] text-blue-600">COLLAPP</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">User management</h2>
              <p className="mt-3 text-base leading-7 text-slate-500">Browse users (coming soon)</p>
            </div>
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200"
              >
                <Bell className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200"
              >
                <BookOpen className="h-5 w-5" />
              </button>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                AD
              </div>
              <button
                type="button"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full rounded-3xl border border-slate-200 bg-white py-3 pl-16 pr-4 text-sm outline-none focus:border-blue-300"
                />
              </label>
              <label className="relative min-w-[150px] flex-[0_0_150px]">
                <select className="w-full appearance-none rounded-3xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm outline-none">
                  <option>All Roles</option>
                  <option>Student</option>
                  <option>School Rep</option>
                  <option>Admin</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </label>
              <label className="relative min-w-[150px] flex-[0_0_150px]">
                <select className="w-full appearance-none rounded-3xl border border-slate-200 bg-white py-3 pl-4 pr-12 text-sm outline-none">
                  <option>Sort by: Newest</option>
                  <option>Sort by: Oldest</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </label>
              <button
                type="button"
                className="inline-flex h-12 min-w-[56px] items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] bg-slate-50 p-6 ring-1 ring-slate-200">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              User list will load from Supabase in a later iteration. Use the form above to provision UP and CIT reps.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
