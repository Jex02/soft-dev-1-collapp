'use client';

import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Search, Plus, X, Upload, Building2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type College = {
  id: number;
  name: string;
  location: string;
  description: string;
  program: string;
  status: 'Available' | 'Unavailable';
  buttonColor: string;
  logoUrl?: string;
  applicants?: number;
};

type ColorOption = { label: string; value: string; hex: string };

const COLOR_OPTIONS: ColorOption[] = [
  { label: 'Navy',   value: 'navy',   hex: '#1e3a5f' },
  { label: 'Blue',   value: 'cyan',   hex: '#2563eb' },
  { label: 'Green',  value: 'green',  hex: '#16a34a' },
  { label: 'Teal',   value: 'teal',   hex: '#0d9488' },
  { label: 'Yellow', value: 'yellow', hex: '#ca8a04' },
  { label: 'Red',    value: 'red',    hex: '#dc2626' },
  { label: 'Purple', value: 'purple', hex: '#7c3aed' },
  { label: 'Slate',  value: 'slate',  hex: '#475569' },
];

function colorHex(value: string) {
  return COLOR_OPTIONS.find((c) => c.value === value)?.hex ?? '#1e3a5f';
}

// ─── Shared College Form Modal ─────────────────────────────────────────────────

function CollegeFormModal({
  open,
  onClose,
  onSaved,
  editCollege,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: (college: College) => void;
  editCollege?: College | null;
}) {
  const isEdit = !!editCollege;

  const [name, setName]             = useState('');
  const [location, setLocation]     = useState('');
  const [color, setColor]           = useState(COLOR_OPTIONS[0]);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoBase64, setLogoBase64]   = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [active, setActive]         = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayRef   = useRef<HTMLDivElement>(null);

  // Populate / reset form when modal opens or editCollege changes
  useEffect(() => {
    if (open && editCollege) {
      setName(editCollege.name);
      setLocation(editCollege.location ?? '');
      const found = COLOR_OPTIONS.find((c) => c.value === editCollege.buttonColor) ?? COLOR_OPTIONS[0];
      setColor(found);
      setLogoPreview(editCollege.logoUrl ?? null);
      setLogoBase64(null);
      setDescription(editCollege.description ?? '');
      setActive(editCollege.status === 'Available');
      setError(null);
    } else if (open && !editCollege) {
      setName('');
      setLocation('');
      setColor(COLOR_OPTIONS[0]);
      setLogoPreview(null);
      setLogoBase64(null);
      setDescription('');
      setActive(true);
      setError(null);
    }
    setSaving(false);
  }, [open, editCollege]);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('Logo must be under 2 MB.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setLogoPreview(result);
      setLogoBase64(result);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleSave = async () => {
    if (!name.trim()) { setError('College name is required.'); return; }
    setSaving(true);
    setError(null);

    const payload = {
      name: name.trim(),
      location: location.trim() || name.trim(),
      description: description.trim() || name.trim(),
      program: description.trim() || name.trim(),
      status: active ? 'Available' : 'Unavailable',
      buttonColor: color.value,
      ...(logoBase64 ? { logoBase64 } : {}),
    };

    try {
      const url    = isEdit ? `/server/colleges?id=${editCollege!.id}` : '/server/colleges';
      const method = isEdit ? 'PUT' : 'POST';

      const res  = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(typeof body.error === 'string' ? body.error : 'Could not save college.');
        return;
      }

      onSaved({
        ...body,
        logoUrl: body.logoUrl ?? logoPreview ?? editCollege?.logoUrl ?? undefined,
        applicants: editCollege?.applicants ?? body.applicants ?? 0,
      });
      onClose();
    } catch {
      setError('Network error — please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {isEdit ? 'Edit College' : 'Add College'}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEdit
                ? 'Update the details for this college.'
                : 'Fill in the details to add a new college to the platform.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-6">

          {/* College Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">College Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter college name"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Location + Color Theme */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. N. Bacalso Ave, Cebu City"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Color Theme</label>
              <div className="relative">
                <div
                  className="h-7 w-7 rounded-md border border-slate-300 absolute left-2.5 top-1/2 -translate-y-1/2 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <select
                  value={color.value}
                  onChange={(e) => {
                    const found = COLOR_OPTIONS.find((c) => c.value === e.target.value);
                    if (found) setColor(found);
                  }}
                  className="w-full rounded-lg border border-slate-200 pl-12 pr-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition appearance-none bg-white"
                >
                  {COLOR_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <path d="M6 8L1 3h10L6 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Logo</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 py-6 transition hover:border-blue-300 hover:bg-blue-50"
            >
              {logoPreview ? (
                <div className="flex flex-col items-center gap-2">
                  <img src={logoPreview} alt="Logo preview" className="h-16 w-16 rounded-full object-cover shadow" />
                  <p className="text-xs text-slate-400">Click to change</p>
                </div>
              ) : (
                <>
                  <Upload size={22} className="text-slate-400 mb-2" />
                  <p className="text-sm font-semibold text-slate-700">Click to upload logo</p>
                  <p className="text-xs text-slate-400 mt-0.5">PNG, JPG or SVG (max. 2MB)</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short description about the college..."
              rows={3}
              className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {/* Status toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActive((v) => !v)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                active ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  active ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-slate-700">{active ? 'Active' : 'Inactive'}</span>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 border border-red-100">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (isEdit ? 'Saving changes…' : 'Saving…') : (isEdit ? 'Save Changes' : 'Save College')}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── College Card ──────────────────────────────────────────────────────────────

function CollegeCard({
  college,
  onToggleStatus,
  onEdit,
}: {
  college: College;
  onToggleStatus: (id: number, newStatus: 'Available' | 'Unavailable') => void;
  onEdit: (college: College) => void;
}) {
  const isActive    = college.status === 'Available';
  const hex         = colorHex(college.buttonColor);

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white shadow-sm overflow-hidden"
          style={{ backgroundColor: hex }}
        >
          {college.logoUrl ? (
            <img src={college.logoUrl} alt={college.name} className="h-12 w-12 object-cover" />
          ) : (
            <Building2 size={20} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-900 leading-tight">{college.name}</p>
          <p className="text-xs text-slate-500 mt-0.5">{college.location}</p>
          <p className="text-xs text-slate-500 mt-1">{college.applicants ?? 0} Applicants</p>
          <span
            className={`mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(college)}
          className="flex-1 rounded-lg border border-slate-200 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onToggleStatus(college.id, isActive ? 'Unavailable' : 'Available')}
          className={`flex-1 rounded-lg border py-2 text-sm font-semibold transition ${
            isActive
              ? 'border-red-100 text-red-500 hover:bg-red-50'
              : 'border-blue-100 text-blue-500 hover:bg-blue-50'
          }`}
        >
          {isActive ? 'Disable' : 'Enable'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function CollegeManagementPage() {
  const [colleges, setColleges]           = useState<College[]>([]);
  const [loading, setLoading]             = useState(true);
  const [fetchError, setFetchError]       = useState<string | null>(null);
  const [search, setSearch]               = useState('');
  const [statusFilter, setStatusFilter]   = useState<'all' | 'Available' | 'Unavailable'>('all');
  const [modalOpen, setModalOpen]         = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | null>(null);

  const loadColleges = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res  = await fetch('/server/colleges');
      if (!res.ok) throw new Error('Failed to load colleges');
      const data = (await res.json()) as College[];
      setColleges(data);
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : 'Could not load colleges');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadColleges(); }, [loadColleges]);

  // Open ADD modal
  const openAddModal = () => {
    setEditingCollege(null);
    setModalOpen(true);
  };

  // Open EDIT modal pre-filled
  const openEditModal = (college: College) => {
    setEditingCollege(college);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCollege(null);
  };

  // Called after add or edit save
  const handleCollegeSaved = (saved: College) => {
    setColleges((prev) => {
      const exists = prev.find((c) => c.id === saved.id);
      if (exists) {
        // update in place
        return prev.map((c) => (c.id === saved.id ? saved : c));
      }
      // prepend new
      return [saved, ...prev];
    });
  };

  const handleToggleStatus = async (id: number, newStatus: 'Available' | 'Unavailable') => {
    try {
      const res = await fetch(`/server/colleges?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) return;
      setColleges((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
    } catch { /* silently fail */ }
  };

  const filtered = colleges.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <CollegeFormModal
        open={modalOpen}
        onClose={handleModalClose}
        onSaved={handleCollegeSaved}
        editCollege={editingCollege}
      />

      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-8">

          {/* Page header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <nav className="flex items-center gap-1.5 text-sm text-slate-500 mb-3">
                <span className="hover:text-slate-700 cursor-pointer">Dashboard</span>
                <span className="text-slate-300">›</span>
                <span className="text-slate-700 font-medium">Colleges</span>
              </nav>
              <h1 className="text-3xl font-bold text-slate-950">College Management</h1>
              <p className="mt-1 text-slate-500">Create, edit, and organize colleges available in CollApp.</p>
            </div>
            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 self-start"
            >
              <Plus size={16} />
              Add College
            </button>
          </div>

          {fetchError && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {fetchError}
              <button type="button" onClick={() => void loadColleges()} className="ml-3 underline font-semibold">
                Retry
              </button>
            </div>
          )}

          {/* Existing Colleges panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-900">Existing Colleges</h2>
              <p className="text-sm text-slate-500">Browse and manage all colleges in the system.</p>
            </div>

            {/* Search + filter bar */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-sm flex-1">
                <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search colleges..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-400 transition"
              >
                <option value="all">All Status</option>
                <option value="Available">Active</option>
                <option value="Unavailable">Inactive</option>
              </select>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-3 w-3/4 rounded bg-slate-200" />
                        <div className="h-3 w-1/2 rounded bg-slate-200" />
                        <div className="h-3 w-1/3 rounded bg-slate-200" />
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <div className="h-9 flex-1 rounded-lg bg-slate-200" />
                      <div className="h-9 flex-1 rounded-lg bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Building2 size={40} className="text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">
                  {colleges.length === 0 ? 'No colleges yet.' : 'No colleges match your search.'}
                </p>
                {colleges.length === 0 && (
                  <button
                    type="button"
                    onClick={openAddModal}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                  >
                    <Plus size={14} />
                    Add your first college
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    onToggleStatus={handleToggleStatus}
                    onEdit={openEditModal}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  );
}