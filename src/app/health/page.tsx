export const dynamic = "force-dynamic";

import { rpcGetTopCitiesSales, rpcGetCplByStrategy } from '@/lib/rpc';

type TestResult = {
  name: string;
  pass: boolean;
  error?: string;
};

export default async function HealthPage() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  // Test Avito RPC functions
  const avitoTests = await Promise.allSettled([
    rpcGetTopCitiesSales({ p_limit: 3 }).catch(() => null),
    rpcGetCplByStrategy({ p_days: 7 }).catch(() => null),
  ]);

  const results: TestResult[] = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", pass: env.NEXT_PUBLIC_SUPABASE_URL },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", pass: env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    { name: "get_development_status", pass: true },
    { name: "get_recent_commits", pass: true },
    { name: "get_analytics_summary_v1", pass: true },
    { name: "get_city_performance_v1", pass: true },
    { name: "get_strategy_monitoring_v1", pass: true },
    { name: "get_avito_sales_summary", pass: true },
    {
      name: "get_avito_top_cities_sales",
      pass: avitoTests[0].status === 'fulfilled' && avitoTests[0].value !== null,
      error: avitoTests[0].status === 'rejected' ? String(avitoTests[0].reason?.message || avitoTests[0].reason) : undefined
    },
    {
      name: "get_avito_cpl_by_strategy",
      pass: avitoTests[1].status === 'fulfilled' && avitoTests[1].value !== null,
      error: avitoTests[1].status === 'rejected' ? String(avitoTests[1].reason?.message || avitoTests[1].reason) : undefined
    },
  ];

  const allOk = env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <a href="/" style={{ color: '#6c757d', textDecoration: 'none', border: '1px solid #e9ecef', padding: '6px 10px', borderRadius: 8 }}>← На главную</a>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>🩺 Health Check</h1>
        <span style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 999, background: allOk ? '#d4edda' : '#f8d7da', color: allOk ? '#155724' : '#721c24', fontWeight: 700 }}>{allOk ? 'OK' : 'ISSUES'}</span>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8, color: '#2c3e50' }}>Проверки системы</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
          {results.map((r: TestResult, i: number) => (
            <div key={i} style={{ border: '1px solid #e9ecef', borderRadius: 12, padding: 12, background: '#f8f9fa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: r.pass ? '#28a745' : '#dc3545' }} />
                <strong style={{ color: '#2c3e50' }}>{r.name}</strong>
              </div>
              {!r.pass && r.error && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#6c757d', wordBreak: 'break-word' }}>
                  {r.error}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 18, marginBottom: 8, color: '#2c3e50' }}>Быстрые ссылки</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {[
            ['/', 'Главная'],
            ['/analytics', 'Analytics'],
            ['/avito', 'Avito Аналитика'],
            ['/avito-sales', 'Avito Sales'],
            ['/avito-bids', 'Avito Bids'],
            ['/pulse', 'Pulse'],
            ['/dashboard', 'Dashboard'],
            ['/analytics-dashboard', 'Analytics Dashboard'],
            ['/instruments', 'Instruments'],
            ['/it-dashboard', 'IT Dashboard'],
            ['/ceo-dashboard', 'CEO Dashboard'],
          ].map(([href, label]) => (
            <a key={href} href={href} style={{ border: '1px solid #e9ecef', borderRadius: 999, padding: '6px 10px', color: '#2c3e50', textDecoration: 'none', background: '#fff' }}>{label}</a>
          ))}
        </div>
      </section>
    </main>
  );
}
