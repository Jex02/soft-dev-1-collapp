import Link from "next/link";
import { Building2, ChevronRight, UserCircle2, UserPlus2, Wrench } from "lucide-react";

const cards = [
  {
    title: "Manage Users",
    value: "15",
    icon: UserCircle2,
    href: "/admin/manageuser",
    className: "bg-white text-slate-950",
  },
  {
    title: "Add School Reps",
    value: "5",
    icon: UserPlus2,
    className: "bg-slate-800 text-white",
  },
  {
    title: "Add Colleges",
    value: "9",
    icon: Building2,
    className: "bg-white text-slate-950",
  },
  {
    title: "Maintenance Mode",
    value: "Off",
    icon: Wrench,
    className: "bg-slate-700 text-white",
  },
];

const registrations = [
  { name: "Jordan Adams", role: "Student", date: "Mar 14, 2026", status: "Pending" },
  { name: "Mia Chen", role: "School Rep", date: "Mar 13, 2026", status: "Approved" },
  { name: "Noah Patel", role: "College", date: "Mar 12, 2026", status: "Review" },
];

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Admin Dashboard</p>
              <h1 className="mt-3 text-5xl font-semibold text-slate-950">Welcome back, Admin</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Review registrations, manage users, add school reps and colleges, and keep your platform running smoothly.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-3xl bg-slate-950 px-5 py-4 text-white shadow-sm ring-1 ring-slate-900/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-800 text-xl font-semibold">
                A
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Administrator</p>
                <p className="mt-1 font-semibold">Collapp Admin</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;
              const cardContent = (
                <article className={`${card.className} rounded-[1.75rem] p-6 shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 ease-out ${card.href ? "group hover:-translate-y-1 hover:shadow-lg" : ""}`}>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-base font-semibold uppercase tracking-[0.2em] text-slate-500">{card.title}</p>
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-200/70 text-slate-950">
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

        <section className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:mt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Recent Registrations</p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">Latest activity</h2>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              View All
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50">
            <div className="grid grid-cols-[1fr_1fr_1fr_96px] gap-4 border-b border-slate-200 px-6 py-4 text-xs uppercase tracking-[0.4em] text-slate-500">
              <span>Name</span>
              <span>Role</span>
              <span>Date</span>
              <span className="text-right">Status</span>
            </div>
            <div className="space-y-2 px-6 py-4">
              {registrations.map((item) => (
                <div key={item.name} className="grid grid-cols-[1fr_1fr_1fr_96px] items-center gap-4 rounded-3xl bg-white px-5 py-4 shadow-sm">
                  <div>
                    <p className="font-semibold text-slate-950">{item.name}</p>
                  </div>
                  <div className="text-sm text-slate-600">{item.role}</div>
                  <div className="text-sm text-slate-600">{item.date}</div>
                  <div className="text-right text-sm font-semibold text-slate-700">{item.status}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
