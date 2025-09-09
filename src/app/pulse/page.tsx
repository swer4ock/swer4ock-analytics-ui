// src/app/pulse/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type PulseRow = {
  report_date: string;
  impressions: number | null;
  clicks: number | null;
  spend_rub: number | null;
  messages: number | null;
  leads: number | null;
  orders: number | null;
};

export default function PulsePage() {
  const [rows, setRows] = useState<PulseRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('v_ads_pulse') // sales.v_ads_pulse (экспортируется как v_ads_pulse)
        .select('*')
        .order('report_date', { ascending: false })
        .limit(30);

      if (error) setErr(error.message);
      else setRows((data as PulseRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Ads Pulse (последние 30 дней)</h1>
      {loading && <p>Загрузка…</p>}
      {err && <p style={{ color: 'crimson' }}>Ошибка: {err}</p>}
      {!loading && !err && rows.length === 0 && <p>Данных пока нет.</p>}
      {!loading && !err && rows.length > 0 && (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 8 }}>date</th>
              <th style={{ textAlign: 'right', padding: 8 }}>impr</th>
              <th style={{ textAlign: 'right', padding: 8 }}>clicks</th>
              <th style={{ textAlign: 'right', padding: 8 }}>spend₽</th>
              <th style={{ textAlign: 'right', padding: 8 }}>messages</th>
              <th style={{ textAlign: 'right', padding: 8 }}>leads</th>
              <th style={{ textAlign: 'right', padding: 8 }}>orders</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{ padding: 8, borderTop: '1px solid #eee' }}>{r.report_date}</td>
                <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{r.impressions ?? 0}</td>
                <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{r.clicks ?? 0}</td>
                <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{r.spend_rub ?? 0}</td>
                <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{r.messages ?? 0}</td>
                <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{r.leads ?? 0}</td>
                <td style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>{r.orders ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{ marginTop: 12 }}><a href="/">← назад</a></p>
    </main>
  );
}
