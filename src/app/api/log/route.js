import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
    if (!supabase) {
        // Fallback or empty if not configured yet, to prevent crashes before key is added
        console.error('Supabase client is NULL in API route.');
        console.log('Env Check - URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Found' : 'Missing');
        console.log('Env Check - Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Found' : 'Missing');
        return NextResponse.json([]);
    }

    const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Formatting for frontend compatibility (frontend expects 'timestamp')
    const formattedData = data.map(entry => ({
        ...entry,
        timestamp: entry.created_at
    }));

    return NextResponse.json(formattedData);
}

export async function POST(request) {
    if (!supabase) {
        console.error('POST: Supabase client is NULL.');
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    try {
        const body = await request.json();

        // Validate body
        if (!body.name1 || !body.name2 || !body.result) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const { error } = await supabase
            .from('logs')
            .insert([
                {
                    name1: body.name1,
                    name2: body.name2,
                    result: body.result
                }
            ]);

        if (error) {
            throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Full Error saving log:', error);
        return NextResponse.json({ success: false, error: error.message || 'Failed to save log' }, { status: 500 });
    }
}
