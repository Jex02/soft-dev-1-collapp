import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type ProfileRow = {
  id: string;
  full_name: string;
  role: string;
  created_at: string;
};

function displayRole(role: string): string {
  if (role === 'school_rep') return 'School Rep';
  if (role === 'student') return 'Student';
  if (role === 'admin') return 'Admin';
  return role;
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminRow, error: adminErr } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .maybeSingle();

    if (adminErr || !adminRow || adminRow.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const maintenanceOn =
      process.env.MAINTENANCE_MODE === 'true' || process.env.MAINTENANCE_MODE === '1';

    const [
      { count: profilesTotal, error: e1 },
      { count: schoolRepCount, error: e2 },
      { count: collegeCount, error: e3 },
      { data: recentRows, error: e4 },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'school_rep'),
      supabase.from('colleges').select('*', { count: 'exact', head: true }),
      supabase
        .from('profiles')
        .select('id, full_name, role, created_at')
        .order('created_at', { ascending: false })
        .limit(12),
    ]);

    if (e1 || e2 || e3) {
      console.error('admin dashboard counts:', e1, e2, e3);
      return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
    }

    if (e4) {
      console.error('admin dashboard recent:', e4);
      return NextResponse.json({ error: 'Failed to load recent registrations' }, { status: 500 });
    }

    const recent = ((recentRows ?? []) as ProfileRow[]).map((row) => ({
      id: row.id,
      name: row.full_name?.trim() || '—',
      role: displayRole(row.role),
      date: new Date(row.created_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'Registered',
    }));

    return NextResponse.json({
      admin: {
        fullName: (adminRow.full_name as string)?.trim() || 'Admin',
      },
      counts: {
        /** All user profiles (students, reps, admins) */
        manageUsers: profilesTotal ?? 0,
        schoolReps: schoolRepCount ?? 0,
        colleges: collegeCount ?? 0,
        maintenanceMode: maintenanceOn,
      },
      recentRegistrations: recent,
    });
  } catch (e) {
    console.error('admin dashboard GET:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Server misconfigured' },
      { status: 503 }
    );
  }
}
