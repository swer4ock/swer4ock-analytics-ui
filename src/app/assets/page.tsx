// src/app/assets/page.tsx
import { supabase } from '@/lib/supabaseClient';

type Asset = {
  name: string;
  fq_name: string | null;
  description: string | null;
  tags: string[] | null;
  last_refreshed: string | null;
};

async function getAssets() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/hello_world`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // This is the crucial part
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch assets: ${res.status} ${res.statusText} - ${errorText}`);
    }

    const data = await res.json();
    return data as Asset[];
  } catch (error: any) {
    console.error('Error in getAssets:', error);
    // Return the error to be displayed on the page
    return [{ name: `Error: ${error.message}`, fq_name: null, description: null, tags: null, last_refreshed: null }];
  }
}

export default async function AssetsPage() {
  const rows = await getAssets();

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Готовые датасеты</h1>
      {rows.length === 0 && <p>Данных пока нет.</p>}
      {rows.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>name</th>
              <th style={{ textAlign: 'left', padding: 8 }}>fq_name</th>
              <th style={{ textAlign: 'left', padding: 8 }}>last_refreshed</th>
              <th style={{ textAlign: 'left', padding: 8 }}>tags</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: 8, borderTop: '1px solid #eee' }}>{r.name}</td>
                <td style={{ padding: 8, borderTop: '1px solid #eee' }}>{r.fq_name ?? '-'}</td>
                <td style={{ padding: 8, borderTop: '1px solid #eee' }}>{r.last_refreshed ?? '-'}</td>
                <td style={{ padding: 8, borderTop: '1px solid #eee' }}>{r.tags?.join(', ') ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
