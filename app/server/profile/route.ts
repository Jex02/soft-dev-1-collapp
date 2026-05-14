import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

type CollegeEmbed = { name: string } | { name: string }[] | null;

function collegeNameFromEmbed(embed: CollegeEmbed | undefined): string | null {
  if (!embed) return null;
  if (Array.isArray(embed)) {
    return embed[0]?.name ?? null;
  }
  return embed.name ?? null;
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(
        `
        id,
        username,
        full_name,
        role,
        college_id,
        colleges ( name )
      `
      )
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('profile GET:', error);
      return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const row = profile as {
      id: string;
      username: string;
      full_name: string;
      role: string;
      college_id: number | null;
      colleges?: CollegeEmbed;
    };

    return NextResponse.json({
      id: row.id,
      username: row.username,
      fullName: row.full_name,
      role: row.role,
      collegeId: row.college_id,
      collegeName: collegeNameFromEmbed(row.colleges),
    });
  } catch (e) {
    console.error('profile GET:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Server misconfigured' },
      { status: 503 }
    );
  }
}
