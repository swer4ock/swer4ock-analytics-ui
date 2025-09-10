export const dynamic = "force-dynamic";

async function fetchView<T>(): Promise<T[]> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/v_ceo_dashboard?select=*`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const res = await fetch(url, {
    headers: {
      apikey,
      Authorization: `Bearer ${apikey}`,
    },
    // never cache for SSR
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch view v_ceo_dashboard failed: ${res.status} ${text}`);
  }
  return res.json();
}

type CeoRow = {
  active_tasks_count: number | null;
  weekly_financial_flow: number | null;
  new_deals_count: number | null;
  failed_queues_count: number | null;
  most_active_ai_agent: string | null;
  ai_agent_events_count: number | null;
};

function fmtNum(v: number | null | undefined) {
  if (v === null || v === undefined) return "—";
  try {
    return Number(v).toLocaleString("ru-RU");
  } catch {
    return String(v);
  }
}

function fmtMoney(v: number | null | undefined) {
  if (v === null || v === undefined) return "—";
  try {
    return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(Number(v));
  } catch {
    return String(v);
  }
}

export default async function CeoDashboardPage() {
  let rows: CeoRow[] = [];
  try {
    rows = await fetchView<CeoRow>();
  } catch (e) {
    console.error(e);
  }
  const data = rows?.[0] || {} as CeoRow;

  return (
    <main style={{ padding: "24px", maxWidth: 1200, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <a
            href="/"
            style={{
              color: "#6c757d",
              textDecoration: "none",
              fontSize: "16px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #e9ecef",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#f8f9fa'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'; }}
          >
            ← На главную
          </a>
          <div style={{ flex: 1 }} />
          <span style={{ padding: '4px 12px', backgroundColor: '#e7f3ff', borderRadius: 12, fontSize: 12, color: '#0056b3', fontWeight: 600 }}>CEO</span>
        </div>
        <h1 style={{ color: '#2c3e50', marginBottom: 8, fontSize: 32, fontWeight: 'bold' }}>📊 CEO Dashboard — Пульс бизнес-империи</h1>
        <p style={{ fontSize: 18, color: '#6c757d', marginBottom: 24 }}>Ключевые метрики компании. Источник: представление public.v_ceo_dashboard</p>
      </div>

      {/* KPI cards */}
      <section style={{ marginBottom: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <div style={{ padding: 24, background: '#e7f3ff', border: '1px solid #b8daff', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 8 }}>Активных задач</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#0056b3' }}>{fmtNum(data.active_tasks_count)}</div>
          </div>
          <div style={{ padding: 24, background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 8 }}>Денежный поток (7 дней)</div>
            <div style={{ fontSize: 30, fontWeight: 'bold', color: '#856404' }}>{fmtMoney(data.weekly_financial_flow)}</div>
          </div>
          <div style={{ padding: 24, background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 8 }}>Новые сделки (7 дней)</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#155724' }}>{fmtNum(data.new_deals_count)}</div>
          </div>
          <div style={{ padding: 24, background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 8 }}>Горящих задач</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#721c24' }}>{fmtNum(data.failed_queues_count)}</div>
          </div>
          <div style={{ padding: 24, background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 8 }}>Самый активный AI-агент</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: '#2c3e50' }}>{data.most_active_ai_agent ?? '—'}</div>
          </div>
          <div style={{ padding: 24, background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 8 }}>Событий AI-агента</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2c3e50' }}>{fmtNum(data.ai_agent_events_count)}</div>
          </div>
        </div>
      </section>

      {/* SQL helper */}
      <section style={{ marginBottom: 40 }}>
        <div style={{ padding: 16, border: '1px dashed #e9ecef', borderRadius: 12, background: '#fcfcfd' }}>
          <div style={{ fontSize: 12, color: '#6c757d', marginBottom: 8 }}>Быстрый доступ (SQL)</div>
          <code style={{ display: 'block', whiteSpace: 'pre-wrap', background: '#f8f9fa', padding: 12, borderRadius: 8, border: '1px solid #e9ecef' }}>
            {`SELECT * FROM public.v_ceo_dashboard;`}
          </code>
        </div>
      </section>

      <footer style={{ padding: 32, backgroundColor: '#2c3e50', color: 'white', borderRadius: 16, textAlign: 'center' }}>
        <h3 style={{ marginBottom: 16 }}>📊 CEO Dashboard</h3>
        <p style={{ marginBottom: 20, opacity: 0.8 }}>Ключевые метрики бизнеса | Источник: Supabase VIEW public.v_ceo_dashboard</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" style={{ color: 'white', opacity: 0.9, textDecoration: 'underline' }}>На главную</a>
        </div>
      </footer>
    </main>
  );
}
