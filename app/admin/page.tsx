'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { Building2, ChevronRight, UserCircle2, UserPlus2, Wrench } from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type DashboardPayload = {
  admin: { fullName: string };
  counts: {
    manageUsers: number;
    schoolReps: number;
    colleges: number;
    maintenanceMode: boolean;
  };
  recentRegistrations: {
    id: string;
    name: string;
    role: string;
    date: string;
    status: string;
  }[];
};

function firstNameOrShort(fullName: string) {
  const t = fullName.trim();
  if (!t) return 'Admin';
  const parts = t.split(/\s+/);
  return parts[0] ?? t;
}

export default function AdminPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const res = await fetch('/server/admin/dashboard');
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.error === 'string' ? body.error : 'Could not load dashboard');
      }
      const json = (await res.json()) as DashboardPayload;
      setData(json);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Could not load dashboard');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const handleSignOut = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    router.push('/admin-login');
  };

  const displayName = data?.admin.fullName?.trim() || 'Admin';
  const welcomeShort = firstNameOrShort(displayName);
  const avatarLetter = welcomeShort.slice(0, 1).toUpperCase();

  const cards = data
    ? [
        {
          title: 'Manage Users',
          value: String(data.counts.manageUsers),
          icon: UserCircle2,
          href: '/admin/users',
          className: 'bg-white text-slate-950',
        },
        {
          title: 'Add School Reps',
          value: String(data.counts.schoolReps),
          icon: UserPlus2,
          href: '/admin/manageuser',
          className: 'bg-slate-800 text-white',
        },
        {
          title: 'Add Colleges',
          value: String(data.counts.colleges),
          icon: Building2,
          href: '/admin/colleges',
          className: 'bg-white text-slate-950',
        },
        {
          title: 'Maintenance Mode',
          value: data.counts.maintenanceMode ? 'On' : 'Off',
          icon: Wrench,
          className: 'bg-slate-700 text-white',
        },
      ]
    : [];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex justify-end gap-2">
          <Link
            href="/admin-login"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Switch account
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>

        {loadError ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-800">
            {loadError}
            <button
              type="button"
              onClick={() => void loadDashboard()}
              className="ml-4 font-semibold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        ) : null}

        <div className="flex flex-col gap-6 rounded-4xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Admin Dashboard</p>
              <h1 className="mt-3 text-5xl font-semibold text-slate-950">
                {loading ? 'Welcome back…' : `Welcome back, ${welcomeShort}`}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Review registrations, manage users, add school reps and colleges, and keep your platform running
                smoothly.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-sm ring-1 ring-slate-900/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-800 text-xl font-semibold">
                {avatarLetter}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Administrator</p>
                <p className="mt-1 font-semibold">{displayName}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {loading
              ? [0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-[1.75rem] bg-slate-100 p-6 ring-1 ring-slate-200/80"
                  >
                    <div
                      className={`h-4 rounded bg-slate-200 ${i % 2 === 0 ? 'max-w-[10rem]' : 'max-w-[14rem]'}`}
                    />
                    <div className="mt-8 h-10 w-16 rounded bg-slate-200" />
                  </div>
                ))
              : cards.map((card) => {
                  const Icon = card.icon;
                  const cardContent = (
                    <article
                      className={`${card.className} rounded-[1.75rem] p-6 shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 ease-out ${
                        card.href ? 'group hover:-translate-y-1 hover:shadow-lg' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p
                          className={`text-base font-semibold uppercase tracking-[0.2em] ${
                            card.className.includes('bg-white') ? 'text-slate-500' : 'text-slate-300'
                          }`}
                        >
                          {card.title}
                        </p>
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-3xl text-slate-950 ${
                            card.className.includes('bg-white') ? 'bg-slate-200/70' : 'bg-white/15 text-white'
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                      </div>
                      <p className="mt-8 text-4xl font-semibold">{card.value}</p>
                    </article>
                  );

                  return card.href ? (
                    <Link key={card.title} href={card.href} className="block">
                      {cardContent}
                    </Link>
                  ) : (
                    <div key={card.title}>{cardContent}</div>
                  );
                })}
          </div>
        </div>

        <section className="rounded-4xl bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Recent Registrations</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Latest activity</h2>
            </div>
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
            <div className="grid grid-cols-[1fr_1fr_1fr_96px] gap-4 border-b border-slate-200 px-6 py-4 text-xs uppercase tracking-[0.4em] text-slate-500">
              <span>Name</span>
              <span>Role</span>
              <span>Date</span>
              <span className="text-right">Status</span>
            </div>
            <div className="space-y-2 px-6 py-4">
              {loading ? (
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-16 animate-pulse rounded-3xl bg-white" />
                  ))}
                </div>
              ) : !data?.recentRegistrations.length ? (
                <div className="rounded-3xl bg-white px-5 py-8 text-center text-sm text-slate-500">
                  No profile registrations yet.
                </div>
              ) : (
                data.recentRegistrations.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[1fr_1fr_1fr_96px] items-center gap-4 rounded-3xl bg-white px-5 py-4 shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-slate-950">{item.name}</p>
                    </div>
                    <div className="text-sm text-slate-600">{item.role}</div>
                    <div className="text-sm text-slate-600">{item.date}</div>
                    <div className="text-right text-sm font-semibold text-slate-700">{item.status}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}