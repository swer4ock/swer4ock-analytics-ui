import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ReadyAsset } from '@/lib/types';

export default async function Assets() {
  const { data, error } = await supabase.rpc('get_ready_assets')

  if (error) return <pre>{error.message}</pre>

  return (
    <main style={{padding:20}}>
      <h1>Ready Assets</h1>
      <table>
        <thead>
          <tr><th>Name</th><th>FQ name</th><th>Tags</th><th>Refreshed</th></tr>
        </thead>
        <tbody>
          {(data as ReadyAsset[])?.map((r: ReadyAsset, i: number) => (
            <tr key={i}>
              <td>{r.name}</td>
              <td>{r.fq_name}</td>
              <td>{(r.tags || []).join(', ')}</td>
              <td>{r.last_refreshed ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
