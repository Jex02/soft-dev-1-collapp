'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, ChevronDown, Menu, Search, X } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type ApiUser = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
};

function displayRole(role: string): string {
  if (role === 'school_rep') return 'School Rep';
  if (role === 'student') return 'Student';
  if (role === 'admin') return 'Admin';
  return role;
}

function joinDateLabel(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'school_rep' | 'admin'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [avatarLetters, setAvatarLetters] = useState('AD');

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/server/admin/users');
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof body.error === 'string' ? body.error : 'Could not load users');
      }
      setUsers(Array.isArray(body.users) ? body.users : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/server/profile');
        if (!res.ok || cancelled) return;
        const p = (await res.json()) as { fullName?: string };
        const name = p.fullName?.trim() || 'Admin';
        const parts = name.split(/\s+/).filter(Boolean);
        const letters =
          parts.length >= 2
            ? `${parts[0][0] ?? ''}${parts[parts.length - 1][0] ?? ''}`.toUpperCase()
            : name.slice(0, 2).toUpperCase();
        if (!cancelled) setAvatarLetters(letters || 'AD');
      } catch {
        /* keep default */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (roleFilter !== 'all') {
      list = list.filter((u) => u.role === roleFilter);
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((u) => {
        const blob = [u.fullName, u.username, u.email].join(' ').toLowerCase();
        return blob.includes(q);
      });
    }
    list.sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? tb - ta : ta - tb;
    });
    return list;
  }, [users, roleFilter, search, sortOrder]);

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
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-4xl">
        {/* Top bar — matches admin tool style */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/admin" className="text-lg font-bold tracking-tight text-slate-950 hover:text-slate-700">
              COLLAPP
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <div
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white"
              aria-hidden
            >
              {avatarLetters}
            </div>
            <Link
              href="/admin"
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 sm:text-sm"
            >
              Admin home
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 sm:text-sm"
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="overflow-hidden rounded-[1.75rem] bg-slate-200/80 p-6 shadow-sm ring-1 ring-slate-200/90 sm:p-8">
          <h1 className="text-xl font-bold uppercase tracking-wide text-slate-950 sm:text-2xl">User management</h1>

          <div className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80 sm:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-12 pr-12 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  aria-label="Search users"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </label>

              <label className="relative min-w-0 md:w-44">
                <span className="sr-only">Filter by role</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium outline-none focus:border-slate-400"
                >
                  <option value="all">All roles</option>
                  <option value="student">Student</option>
                  <option value="school_rep">School Rep</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </label>

              <label className="relative min-w-0 md:w-44">
                <span className="sr-only">Sort</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as typeof sortOrder)}
                  className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-4 pr-10 text-sm font-medium outline-none focus:border-slate-400"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="oldest">Sort: Oldest</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </label>
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                {error}
                <button type="button" onClick={() => void loadUsers()} className="ml-3 font-semibold underline">
                  Retry
                </button>
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              {loading ? (
                <>
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </>
              ) : filteredUsers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center text-sm text-slate-600">
                  {users.length === 0
                    ? 'No users found in the database yet.'
                    : 'No users match your search or filters.'}
                </div>
              ) : (
                filteredUsers.map((u) => (
                  <article
                    key={u.id}
                    className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition hover:shadow-md"
                  >
                    <p className="font-semibold text-slate-950">{u.fullName}</p>
                    <p className="mt-1 text-sm text-slate-600">{displayRole(u.role)}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      Join date: {joinDateLabel(u.createdAt)}
                      {u.email ? (
                        <>
                          <span className="mx-2 text-slate-300">·</span>
                          {u.email}
                        </>
                      ) : null}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-8 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">COLLAPP</p>
          <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/admin" className="hover:text-slate-900 hover:underline">
              Admin dashboard
            </Link>
            <Link href="/admin/users" className="hover:text-slate-900 hover:underline">
              User management
            </Link>
            <Link href="/admin/manageuser" className="hover:text-slate-900 hover:underline">
              School rep tools
            </Link>
            <Link href="/LandingPage" className="hover:text-slate-900 hover:underline">
              Public site
            </Link>
          </nav>
        </footer>
      </div>
    </main>
  );
}
