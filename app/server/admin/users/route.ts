import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createServiceRoleSupabase } from '@/lib/supabase/service';

type ProfileRow = {
  id: string;
  username: string;
  full_name: string;
  role: string;
  created_at: string;
};

/**
 * Full user directory for admins: profiles + login email (from Auth) when service role is configured.
 */
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
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (adminErr || adminRow?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: rows, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('admin users GET profiles:', error);
      return NextResponse.json({ error: 'Failed to load profiles' }, { status: 500 });
    }

    const emailById = new Map<string, string>();
    try {
      const service = createServiceRoleSupabase();
      const { data: listData, error: listErr } = await service.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
      });
      if (!listErr && listData?.users) {
        for (const u of listData.users) {
          emailById.set(u.id, u.email ?? '');
        }
      } else if (listErr) {
        console.warn('admin users listUsers:', listErr.message);
      }
    } catch (e) {
      console.warn('admin users: email merge unavailable', e);
    }

    const users = ((rows ?? []) as ProfileRow[]).map((r) => ({
      id: r.id,
      username: r.username,
      fullName: (r.full_name ?? '').trim() || r.username,
      email: emailById.get(r.id) ?? '',
      role: r.role,
      createdAt: r.created_at,
    }));

    return NextResponse.json({ users });
  } catch (e) {
    console.error('admin users GET:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Server misconfigured' },
      { status: 503 }
    );
  }
}
