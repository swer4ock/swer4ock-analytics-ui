import React from 'react';
import { supabase } from '@/lib/supabaseClient'

export default async function Assets() {
  const { data, error } = await supabase
    .from('analytics.v_ready_assets')
    .select('name,fq_name,description,tags,last_refreshed')
    .order('last_refreshed', { ascending: false })
    .limit(100)

  if (error) return <pre>{error.message}</pre>

  return (
    <main style={{padding:20}}>
      <h1>Ready Assets</h1>
      <table>
        <thead>
          <tr><th>Name</th><th>FQ name</th><th>Tags</th><th>Refreshed</th></tr>
        </thead>
        <tbody>
          {data?.map((r, i) => (
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
