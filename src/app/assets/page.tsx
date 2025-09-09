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
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssets() {
      try {
        setLoading(true);
        setError(null);
        
        // Try the hello_world RPC function first
        const { data, error: rpcError } = await supabase.rpc('hello_world');
        
        if (rpcError) {
          throw new Error(`RPC Error: ${rpcError.message}`);
        }
        
        setAssets(data || []);
      } catch (err: any) {
        console.error('Error fetching assets:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAssets();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Готовые датасеты</h1>
      
      {loading && <p>Загрузка данных...</p>}
      
      {error && (
        <div style={{ color: 'red', border: '1px solid red', padding: '1rem', margin: '1rem 0' }}>
          <h3>Ошибка:</h3>
          <pre>{error}</pre>
        </div>
      )}
      
      {!loading && !error && assets.length === 0 && (
        <p>Данных пока нет.</p>
      )}
      
      {!loading && !error && assets.length > 0 && (
        <div>
          <p>Найдено записей: {assets.length}</p>
          <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ textAlign: 'left', padding: 8, border: '1px solid #ddd' }}>Name</th>
                <th style={{ textAlign: 'left', padding: 8, border: '1px solid #ddd' }}>FQ Name</th>
                <th style={{ textAlign: 'left', padding: 8, border: '1px solid #ddd' }}>Last Refreshed</th>
                <th style={{ textAlign: 'left', padding: 8, border: '1px solid #ddd' }}>Tags</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={index}>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{asset.name}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{asset.fq_name || '-'}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{asset.last_refreshed || '-'}</td>
                  <td style={{ padding: 8, border: '1px solid #ddd' }}>{asset.tags?.join(', ') || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
