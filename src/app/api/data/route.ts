import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!type) {
    return NextResponse.json({ error: 'Missing data type parameter' }, { status: 400 });
  }

  let rpcName = '';
  if (type === 'assets') {
    rpcName = 'get_ready_assets';
  } else if (type === 'pulse') {
    rpcName = 'get_ads_pulse';
  } else {
    return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseServer.rpc(rpcName);

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
