import React from 'react';
import { supabase } from '@/lib/supabaseClient'

export default async function Pulse() {
  const { data, error } = await supabase
    .from('sales.v_ads_pulse')
    .select('*')
    .gte('report_date', new Date(Date.now()-14*864e5).toISOString().slice(0,10))
    .order('report_date', { ascending: true })

  if (error) return <pre>{error.message}</pre>

  return (
    <main style={{padding:20}}>
      <h1>Ads Pulse (14d)</h1>
      <table>
        <thead><tr>
          {data?.[0] && Object.keys(data[0]).map(k => <th key={k}>{k}</th>)}
        </tr></thead>
        <tbody>
          {data?.map((row,i) => (
            <tr key={i}>
              {Object.values(row).map((v, j) => <td key={j}>{String(v ?? '')}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
