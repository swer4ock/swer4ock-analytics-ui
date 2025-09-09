import React from 'react';
import { AdsPulse } from '@/lib/types';

async function getPulse(): Promise<AdsPulse[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/data?type=pulse`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch pulse data');
  }
  return res.json();
}

export default async function Pulse() {
  const data = await getPulse();

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
