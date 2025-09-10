"use client";

import React, { useEffect, useState } from 'react';
import { rpcPreferV1 } from '@/lib/rpc';

type AssetRow = {
  name: string | null;
  fq_name: string | null;
  last_refreshed: string | null;
  tags: string[] | null;
};

export default function AssetsPage() {
  const [data, setData] = useState<AssetRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const rows = await rpcPreferV1<AssetRow[]>('get_assets_data');
        if (!mounted) return;
        setData(rows);
      } catch (e: any) {
        console.error('Assets load error:', e);
        if (!mounted) return;
        setError(String(e?.message || e));
        setData([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const isLoading = data === null;

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Готовые датасеты</h1>

      {isLoading && (
        <div style={{ color: '#6c757d' }}>Загрузка данных…</div>
      )}

      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '1rem', marginTop: 12 }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}

      {!isLoading && (
        <div style={{ marginTop: 12 }}>
          <p>Найдено записей: {data?.length ?? 0}</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ddd' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Name</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>FQ Name</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Last Refreshed</th>
                  <th style={{ padding: 8, border: '1px solid #ddd' }}>Tags</th>
                </tr>
              </thead>
              <tbody>
                {data && data.length > 0 ? (
                  data.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.name ?? '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.fq_name ?? '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.last_refreshed ?? '-'}</td>
                      <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.tags ? item.tags.join(', ') : '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ padding: 12, textAlign: 'center', color: '#6c757d' }}>Нет данных</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
