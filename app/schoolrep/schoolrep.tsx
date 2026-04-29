'use client';

import { Building2, ClipboardList, Users2, ShieldCheck, Bell, Settings } from 'lucide-react';

export default function SchoolRepPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center text-white">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">COLLAPP</p>
              <h1 className="text-xl font-semibold text-slate-900">School Representative Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 transition">
              <Bell size={20} />
            </button>
            <button className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm hover:bg-slate-50 transition">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        <section className="rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
          <div className="md:flex md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Welcome back</p>
              <h2 className="mt-3 text-3xl font-semibold">School Rep overview</h2>
              <p className="mt-2 max-w-2xl text-slate-200 leading-7">
                Manage your school profile, review incoming student applications, and coordinate program updates from one secure interface.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 text-slate-100 shadow-lg">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-300">Role</p>
              <p className="mt-3 text-2xl font-semibold">School Representative</p>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-slate-900 p-3 text-white">
                <ClipboardList size={24} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Applications awaiting review</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">9</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-600">
              Review and approve pending student submissions, then publish updates for accepted candidates.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="rounded-3xl bg-slate-900 p-3 text-white">
                <Users2 size={24} />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Active programs</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">12</p>
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-600">
              Keep program information current and share the latest application requirements with students.
            </p>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-800">
                <ShieldCheck size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-900">Profile status</p>
            </div>
            <p className="mt-4 text-4xl font-bold text-slate-900">Complete</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-800">
                <Building2 size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-900">School engagement</p>
            </div>
            <p className="mt-4 text-4xl font-bold text-slate-900">89%</p>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-800">
                <Bell size={20} />
              </div>
              <p className="text-sm font-semibold text-slate-900">Alerts</p>
            </div>
            <p className="mt-4 text-4xl font-bold text-slate-900">3</p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Upcoming action</p>
              <h3 className="text-xl font-semibold text-slate-900">Review new student application packets</h3>
            </div>
            <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition">
              View queue
            </button>
          </div>
          <div className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
              <p className="font-semibold text-slate-900">Program update request</p>
              <p className="text-sm text-slate-600 mt-1">New intake details need approval before publishing.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4 border border-slate-200">
              <p className="font-semibold text-slate-900">Student outreach</p>
              <p className="text-sm text-slate-600 mt-1">Send welcome guidance to applicants who started their first draft.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
