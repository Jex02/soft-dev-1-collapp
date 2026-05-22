import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface CollegeRow {
  id: number;
  name: string;
  location: string;
  description: string;
  program: string;
  status: 'Available' | 'Unavailable';
  button_color: string | null;
  button_action: string | null;
  application_deadline: string | null;
  requirements: string[] | null;
  contact_email: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

function mapCollege(row: CollegeRow) {
  const requirements = Array.isArray(row.requirements)
    ? row.requirements
    : typeof row.requirements === 'string'
      ? (row.requirements as string).split(',').map((item) => item.trim()).filter(Boolean)
      : [];

  return {
    id: row.id,
    name: row.name,
    location: row.location,
    description: row.description,
    program: row.program || row.description || '',
    status: row.status,
    buttonColor: (row.button_color as 'cyan' | 'yellow' | 'green' | 'teal') || 'cyan',
    buttonAction: row.button_action || 'APPLY',
    applicationDeadline: row.application_deadline ?? undefined,
    requirements,
    contactEmail: row.contact_email ?? undefined,
    logoUrl: row.logo_url ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Upload a base64 data URL to Supabase Storage and return the public URL.
// Returns null if no image data provided or upload fails.
async function uploadLogo(
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>,
  collegeId: number,
  base64DataUrl: string | null | undefined,
): Promise<string | null> {
  if (!base64DataUrl || !base64DataUrl.startsWith('data:')) return null;

  const match = base64DataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) return null;

  const mimeType = match[1];
  const base64Data = match[2];
  const ext = mimeType.split('/')[1].replace('jpeg', 'jpg').replace('svg+xml', 'svg');
  const filePath = `college-logos/${collegeId}.${ext}`;

  const buffer = Buffer.from(base64Data, 'base64');

  const { error } = await supabase.storage
    .from('college-logos')
    .upload(filePath, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error('logo upload error:', error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('college-logos')
    .getPublicUrl(filePath);

  return urlData?.publicUrl ?? null;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const status = searchParams.get('status');

    if (id) {
      const { data, error } = await supabase.from('colleges').select('*').eq('id', parseInt(id, 10)).maybeSingle();
      if (error) {
        console.error('colleges GET:', error);
        return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
      }
      if (!data) {
        return NextResponse.json({ error: 'College not found' }, { status: 404 });
      }
      const { count } = await supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('college_id', parseInt(id, 10));
      return NextResponse.json({ ...mapCollege(data as CollegeRow), applicants: count ?? 0 });
    }

    const query = supabase.from('colleges').select('*').order('id', { ascending: true });

    const { data: rows, error } = await query;
    if (error) {
      console.error('colleges GET:', error);
      return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 });
    }

    let list = (rows ?? []) as CollegeRow[];

    if (status) {
      list = list.filter((c) => c.status.toLowerCase() === status.toLowerCase());
    }

    // Fetch applicant counts for all colleges in one query
    const { data: appCounts } = await supabase
      .from('applications')
      .select('college_id');

    const countMap: Record<number, number> = {};
    for (const row of appCounts ?? []) {
      const cid = (row as { college_id: number }).college_id;
      countMap[cid] = (countMap[cid] ?? 0) + 1;
    }

    return NextResponse.json(list.map((row) => ({
      ...mapCollege(row),
      applicants: countMap[row.id] ?? 0,
    })));
  } catch (e) {
    console.error('colleges GET:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Server misconfigured' },
      { status: 503 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, location, description, program } = body;
    if (!name || !location || !(description || program)) {
      return NextResponse.json(
        { error: 'Name, location, and program or description are required' },
        { status: 400 }
      );
    }

    const normalizedRequirements = Array.isArray(body.requirements)
      ? body.requirements
      : typeof body.requirements === 'string'
        ? body.requirements.split(',').map((item: string) => item.trim()).filter(Boolean)
        : [];

    // Insert first (need the ID for the storage path)
    const { data: inserted, error } = await supabase
      .from('colleges')
      .insert({
        name,
        location,
        description: body.description || body.program || '',
        program: body.program || body.description || '',
        status: body.status || 'Available',
        button_color: body.buttonColor || 'cyan',
        button_action: body.buttonAction || 'APPLY',
        application_deadline: body.applicationDeadline || null,
        requirements: normalizedRequirements,
        contact_email: body.contactEmail || null,
        logo_url: null,
      })
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'College with this name already exists' }, { status: 409 });
      }
      console.error('colleges POST:', error);
      return NextResponse.json({ error: 'Failed to create college' }, { status: 500 });
    }

    const row = inserted as CollegeRow;

    // Upload logo now that we have the college ID
    const logoUrl = await uploadLogo(supabase, row.id, body.logoBase64 ?? null);
    if (logoUrl) {
      await supabase.from('colleges').update({ logo_url: logoUrl }).eq('id', row.id);
      row.logo_url = logoUrl;
    }

    return NextResponse.json(mapCollege(row), { status: 201 });
  } catch (e) {
    console.error('colleges POST:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Server misconfigured' },
      { status: 503 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'College ID is required' }, { status: 400 });
    }

    const body = await request.json();

    const { data: existing, error: fetchErr } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', parseInt(id, 10))
      .maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Check if requester is a school_rep and only allow editing their own college
    const { data: requesterProfile } = await supabase
      .from('profiles')
      .select('role, college_id')
      .eq('id', user.id)
      .maybeSingle();

    if (requesterProfile?.role === 'school_rep' && requesterProfile.college_id !== parseInt(id, 10)) {
      return NextResponse.json({ error: 'You can only update your own school.' }, { status: 403 });
    }

    const prev = existing as CollegeRow;
    const normalizedRequirements = Array.isArray(body.requirements)
      ? body.requirements
      : typeof body.requirements === 'string'
        ? body.requirements.split(',').map((item: string) => item.trim()).filter(Boolean)
        : prev.requirements ?? [];

    // Upload new logo if a new base64 image was provided
    let logoUrl = prev.logo_url;
    if (body.logoBase64 && body.logoBase64.startsWith('data:')) {
      const uploaded = await uploadLogo(supabase, parseInt(id, 10), body.logoBase64);
      if (uploaded) logoUrl = uploaded;
    }

    const patch = {
      name: body.name ?? prev.name,
      location: body.location ?? prev.location,
      description: body.description ?? body.program ?? prev.description,
      program: body.program ?? body.description ?? prev.program,
      status: body.status ?? prev.status,
      button_color: body.buttonColor ?? prev.button_color,
      button_action: body.buttonAction ?? prev.button_action,
      application_deadline: body.applicationDeadline ?? prev.application_deadline,
      requirements: normalizedRequirements,
      contact_email: body.contactEmail ?? prev.contact_email,
      logo_url: logoUrl,
      updated_at: new Date().toISOString(),
    };

    const { data: updated, error } = await supabase
      .from('colleges')
      .update(patch)
      .eq('id', parseInt(id, 10))
      .select('*')
      .single();

    if (error || !updated) {
      console.error('colleges PUT:', error);
      return NextResponse.json({ error: 'Failed to update college' }, { status: 500 });
    }

    return NextResponse.json(mapCollege(updated as CollegeRow));
  } catch (e) {
    console.error('colleges PUT:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Server misconfigured' },
      { status: 503 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'College ID is required' }, { status: 400 });
    }

    const { data: deleted, error } = await supabase
      .from('colleges')
      .delete()
      .eq('id', parseInt(id, 10))
      .select('*')
      .single();

    if (error || !deleted) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'College deleted successfully',
      deletedCollege: mapCollege(deleted as CollegeRow),
    });
  } catch (e) {
    console.error('colleges DELETE:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Server misconfigured' },
      { status: 503 }
    );
  }
}