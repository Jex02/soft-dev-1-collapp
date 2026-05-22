import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { createServiceRoleSupabase } from '@/lib/supabase/service';

export async function GET(request: NextRequest) {
  try {
    // Auth check — only logged-in school reps (or admins) can fetch signed URLs
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 403 });
    }

    if (!['school_rep', 'admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json({ error: 'path query param is required' }, { status: 400 });
    }

    // Use service role client so we can sign URLs for private buckets
    const serviceSupabase = createServiceRoleSupabase();
    const { data, error } = await serviceSupabase.storage
      .from('documents')
      .createSignedUrl(path, 3600); // 1-hour expiry

    if (error || !data?.signedUrl) {
      console.error('signed-url error:', error);
      return NextResponse.json({ error: 'Could not generate signed URL' }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (e) {
    console.error('signed-url GET:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Server error' },
      { status: 503 }
    );
  }
}
