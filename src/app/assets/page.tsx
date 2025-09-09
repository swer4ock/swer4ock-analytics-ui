import React from 'react';
import { ReadyAsset } from '@/lib/types';

async function getAssets(): Promise<ReadyAsset[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/data?type=assets`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch assets');
  }
  return res.json();
}

export default async function Assets() {
  const data = await getAssets();

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
