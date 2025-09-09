// src/app/assets/page.tsx
import { supabase } from '@/lib/supabaseClient';

type Asset = {
  name: string;
  fq_name: string | null;
  description: string | null;
  tags: string[] | null;
  last_refreshed: string | null;
};

async function getAssets(): Promise<{ data: Asset[] | null; error: string | null }> {
  try {
    const { data, error } = await supabase.rpc('get_data_assets_direct');
    if (error) throw error;
    return { data, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

export default async function AssetsPage() {
  const { data: rows, error } = await getAssets();

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Готовые датасеты</h1>
      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '1rem' }}>
          <h2>Server Error:</h2>
          <pre>{error}</pre>
        </div>
      )}
      {!error && rows && rows.length === 0 && <p>Данных пока нет.</p>}
      {!error && rows && rows.length > 0 && (
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
