// src/app/assets/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Asset = {
  name: string;
  fq_name: string | null;
  description: string | null;
  tags: string[] | null;
  last_refreshed: string | null;
};

export default function AssetsPage() {
  const [rows, setRows] = useState<Asset[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc('get_ready_assets');

      if (error) setErr(error.message);
      else setRows((data as Asset[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Готовые датасеты</h1>
      {loading && <p>Загрузка…</p>}
      {err && <p style={{ color: 'crimson' }}>Ошибка: {err}</p>}
      {!loading && !err && (
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
