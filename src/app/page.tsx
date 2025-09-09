import React from 'react';
import { supabase } from '@/lib/supabaseClient'

export default async function Page() {
  const { data, error } = await supabase.rpc('get_ready_assets', {}, { count: 'exact', head: true }); // Just check if the function is callable

  return (
    <main style={{padding:20}}>
      <h1>Health</h1>
      <pre>
        {JSON.stringify({
          url: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0,40) + '...',
          hasData: !!data?.length, error: error?.message
        }, null, 2)}
      </pre>
    </main>
  )
}
