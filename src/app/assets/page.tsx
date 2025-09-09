'use client';

import { useEffect, useState } from 'react';

export default function AssetsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!url || !key) {
          throw new Error('Missing environment variables');
        }

        const response = await fetch(`${url}/rest/v1/rpc/hello_world`, {
          method: 'POST',
          headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Готовые датасеты</h1>
      
      {loading && <p>Загрузка...</p>}
      
      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '1rem' }}>
          <strong>Ошибка:</strong> {error}
        </div>
      )}
      
      {!loading && !error && (
        <div>
          <p>Найдено записей: {data.length}</p>
          {data.length > 0 && (
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
                {data.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.name}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.fq_name || '-'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.last_refreshed || '-'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{item.tags?.join(', ') || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </main>
  );
}
