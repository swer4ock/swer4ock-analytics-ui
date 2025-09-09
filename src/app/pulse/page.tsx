import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import { AdsPulse } from '@/lib/types';

export default async function Pulse() {
  const { data, error } = await supabase.rpc('get_ads_pulse')

  if (error) return <pre>{error.message}</pre>

  return (
    <main style={{padding:20}}>
      <h1>Ads Pulse (14d)</h1>
      <table>
        <thead><tr>
          {data?.[0] && Object.keys(data[0]).map(k => <th key={k}>{k}</th>)}
        </tr></thead>
        <tbody>
          {(data as AdsPulse[])?.map((row: AdsPulse, i: number) => (
            <tr key={i}>
              {Object.values(row).map((v, j) => <td key={j}>{String(v ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
