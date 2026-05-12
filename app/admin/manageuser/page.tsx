import {
  Bell,
  BookOpen,
  ChevronDown,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

export default function ManageUserPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-200">
          <div className="flex flex-row flex-wrap items-start justify-between gap-8">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.45em] text-blue-600">COLLAPP</p>
              <h1 className="mt-3 text-5xl font-semibold tracking-tight text-slate-950">User Management</h1>
              <p className="mt-3 text-base leading-7 text-slate-500">Manage users, roles, and permissions</p>
            </div>

            <div className="flex items-center gap-3 justify-end">
              <button className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100">
                <Bell className="h-5 w-5" />
              </button>
              <button className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-100">
                <BookOpen className="h-5 w-5" />
              </button>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white shadow-sm ring-1 ring-slate-200">AD</div>
              <button className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-10 rounded-[2rem] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:flex-nowrap">
              <label className="relative flex-1 min-w-0">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full rounded-3xl border border-slate-200 bg-white py-3 pl-16 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                />
              </label>

              <label className="relative flex-[0_0_150px] min-w-0">
                <select className="w-full appearance-none rounded-3xl border border-slate-200 bg-white bg-no-repeat bg-right bg-[length:12px_12px] py-3 pl-4 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                  <option>All Roles</option>
                  <option>Student</option>
                  <option>School Rep</option>
                  <option>College</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </label>

              <label className="relative flex-[0_0_150px] min-w-0">
                <select className="w-full appearance-none rounded-3xl border border-slate-200 bg-white bg-no-repeat bg-right bg-[length:12px_12px] py-3 pl-4 pr-12 text-sm text-slate-900 outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100">
                  <option>Sort by: Newest</option>
                  <option>Sort by: Oldest</option>
                  <option>Sort by: Name</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </label>

              <button className="inline-flex h-12 min-w-[56px] items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mt-12 rounded-[2rem] bg-slate-50 p-6 shadow-sm ring-1 ring-slate-200">
            <div className="rounded-[1.75rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="mb-6 text-sm font-medium text-slate-500">1 user found</div>
              <div className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[1.75rem] bg-blue-100 text-lg font-semibold text-blue-700">JA</div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-slate-950">Jordan Andrea</p>
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Student</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">Manage users, roles, and permissions</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="inline-flex items-center gap-2 rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-600">
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Joined</span>
                    <span className="font-semibold text-slate-900">March 2, 2026</span>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-3xl border border-blue-100 bg-white px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">Edit</button>
                  <button className="inline-flex items-center justify-center rounded-3xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
