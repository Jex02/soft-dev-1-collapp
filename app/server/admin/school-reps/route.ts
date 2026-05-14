import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createServiceRoleSupabase } from '@/lib/supabase/service';

type CreateRepBody = {
  email: string;
  password: string;
  fullName: string;
  username: string;
  collegeId: number;
};

export async function POST(request: NextRequest) {
  try {
    const sessionClient = await createSupabaseServerClient();
    const {
      data: { user },
    } = await sessionClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminProfile, error: profErr } = await sessionClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profErr || !adminProfile || adminProfile.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let body: CreateRepBody;
    try {
      body = (await request.json()) as CreateRepBody;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const email = body.email?.trim().toLowerCase();
    const password = body.password;
    const fullName = body.fullName?.trim() ?? '';
    const username = body.username?.trim().toLowerCase() ?? '';
    const collegeId = Number(body.collegeId);

    if (!email || !password || !username || !Number.isFinite(collegeId)) {
      return NextResponse.json(
        { error: 'email, password, username, and collegeId are required' },
        { status: 400 }
      );
    }

    const admin = createServiceRoleSupabase();

    const { data: college, error: colErr } = await admin
      .from('colleges')
      .select('id')
      .eq('id', collegeId)
      .maybeSingle();

    if (colErr || !college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const { data: taken } = await admin
      .from('profiles')
      .select('id')
      .eq('college_id', collegeId)
      .eq('role', 'school_rep')
      .maybeSingle();

    if (taken) {
      return NextResponse.json(
        { error: 'This college already has a school rep. Remove or reassign the existing rep first.' },
        { status: 409 }
      );
    }

    const { data: authData, error: createErr } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        username,
        full_name: fullName,
      },
    });

    if (createErr || !authData.user) {
      return NextResponse.json(
        { error: createErr?.message ?? 'Failed to create auth user' },
        { status: 400 }
      );
    }

    const newId = authData.user.id;

    const { error: upErr } = await admin
      .from('profiles')
      .update({
        role: 'school_rep',
        college_id: collegeId,
        username,
        full_name: fullName || username,
      })
      .eq('id', newId);

    if (upErr) {
      await admin.auth.admin.deleteUser(newId);
      return NextResponse.json(
        { error: upErr.message ?? 'Failed to assign rep profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { id: newId, email, username, collegeId },
      { status: 201 }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Server error';
    if (message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
      return NextResponse.json(
        { error: 'Server missing SUPABASE_SERVICE_ROLE_KEY (needed to create rep accounts).' },
        { status: 503 }
      );
    }
    console.error('admin/school-reps POST:', e);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
