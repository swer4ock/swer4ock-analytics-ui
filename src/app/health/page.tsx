export const dynamic = "force-dynamic";

import { rpc } from "../../lib/rpc";

// Simple REST view fetch for CEO pulse
async function fetchCeoView() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/v_ceo_dashboard?select=*`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const res = await fetch(url, {
    headers: { apikey, Authorization: `Bearer ${apikey}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

function ok(v: any) {
  return v === true || v === "ok" || v === "OK";
}

export default async function HealthPage() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const checks = await Promise.allSettled([
    // Core RPCs used around the app
    rpc("get_development_status").then(() => ({ name: "get_development_status", pass: true })).catch((e) => ({ name: "get_development_status", pass: false, error: String(e) })),
    rpc("get_recent_commits", { p_limit: 1 }).then(() => ({ name: "get_recent_commits", pass: true })).catch((e) => ({ name: "get_recent_commits", pass: false, error: String(e) })),
    rpc("get_analytics_summary").then(() => ({ name: "get_analytics_summary", pass: true })).catch((e) => ({ name: "get_analytics_summary", pass: false, error: String(e) })),
    rpc("get_city_performance", { p_limit: 1 }).then(() => ({ name: "get_city_performance", pass: true })).catch((e) => ({ name: "get_city_performance", pass: false, error: String(e) })),
    rpc("get_strategy_monitoring", { p_limit: 1 }).then(() => ({ name: "get_strategy_monitoring", pass: true })).catch((e) => ({ name: "get_strategy_monitoring", pass: false, error: String(e) })),
    rpc("get_avito_sales_summary").then(() => ({ name: "get_avito_sales_summary", pass: true })).catch((e) => ({ name: "get_avito_sales_summary", pass: false, error: String(e) })),
    fetchCeoView().then(() => ({ name: "view:v_ceo_dashboard", pass: true })).catch((e) => ({ name: "view:v_ceo_dashboard", pass: false, error: String(e) })),
  ]);

  const results = checks.map((r) => (r.status === "fulfilled" ? r.value : r.reason));

  const allOk = env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY && results.every((r: any) => r?.pass);

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <a href="/" style={{ color: '#6c757d', textDecoration: 'none', border: '1px solid #e9ecef', padding: '6px 10px', borderRadius: 8 }}>← На главную</a>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>🩺 Health Check</h1>
        <span style={{ marginLeft: 'auto', padding: '4px 10px', borderRadius: 999, background: allOk ? '#d4edda' : '#f8d7da', color: allOk ? '#155724' : '#721c24', fontWeight: 700 }}>{allOk ? 'OK' : 'ISSUES'}</span>
      </div>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8, color: '#2c3e50' }}>Переменные окружения (Production)</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
          <HealthItem name="NEXT_PUBLIC_SUPABASE_URL" pass={env.NEXT_PUBLIC_SUPABASE_URL} />
          <HealthItem name="NEXT_PUBLIC_SUPABASE_ANON_KEY" pass={env.NEXT_PUBLIC_SUPABASE_ANON_KEY} />
        </div>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8, color: '#2c3e50' }}>RPC/VIEW проверки</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
          {results.map((r: any, i: number) => (
            <div key={i} style={{ border: '1px solid #e9ecef', borderRadius: 12, padding: 12, background: '#f8f9fa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: r.pass ? '#28a745' : '#dc3545' }} />
                <strong style={{ color: '#2c3e50' }}>{r.name}</strong>
              </div>
              {!r.pass && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#6c757d', wordBreak: 'break-word' }}>
                  {r.error ?? 'Ошибка'}
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

function HealthItem({ name, pass }: { name: string; pass: boolean }) {
  return (
    <div style={{ border: '1px solid #e9ecef', borderRadius: 12, padding: 12, background: '#f8f9fa' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: pass ? '#28a745' : '#dc3545' }} />
        <strong style={{ color: '#2c3e50' }}>{name}</strong>
      </div>
      <div style={{ fontSize: 12, color: '#6c757d', marginTop: 6 }}>{pass ? 'OK' : 'Отсутствует'}</div>
    </div>
  );
}
