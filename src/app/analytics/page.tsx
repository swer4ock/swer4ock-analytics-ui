export const dynamic = 'force-dynamic';
import { rpc } from "../../lib/rpc";

type Summary = {
  total_ads: number;
  total_cities: number;
  total_contacts: number;
  avg_conversion: number;
  refreshed_at: string;
};

type CityPerf = {
  city: string;
  impressions: number;
  views: number;
  contacts: number;
  view_to_contact: number;
};

type StrategyRow = {
  strategy_type: string;
  ads_count: number;
  avg_cost_per_contact: number;
  avg_conversion: number;
};

export default async function AnalyticsPage() {
  let summary: Summary[] = [];
  let cities: CityPerf[] = [];
  let strategies: StrategyRow[] = [];

  try {
    summary = await rpc<Summary[]>('get_analytics_summary');
  } catch (e: any) {
    console.error(e);
  }

  try {
    cities = await rpc<CityPerf[]>('get_city_performance', { p_limit: 20 });
  } catch (e: any) {
    console.error(e);
  }

  try {
    strategies = await rpc<StrategyRow[]>('get_strategy_monitoring', { p_limit: 50 });
  } catch (e: any) {
    console.error(e);
  }

  // Robust aliasing to match Runbook or previous schema
  const raw: any = summary?.[0];
  const s: Summary | undefined = raw
    ? {
        total_ads: raw.total_ads ?? raw.ads_count ?? null,
        total_cities: raw.total_cities ?? raw.cities_count ?? null,
        total_contacts: raw.total_contacts ?? raw.contacts_total ?? null,
        avg_conversion: raw.avg_conversion ?? raw.conversion_pct ?? null,
        refreshed_at: raw.refreshed_at ?? raw.last_updated_at ?? null,
      }
    : undefined;

  return (
    <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Аналитика (MVP, RPC Supabase)</h1>

      {/* KPI */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
        <div style={card}><div style={kpiTitle}>Объявления</div><div style={kpiValue}>{s?.total_ads ?? '—'}</div></div>
        <div style={card}><div style={kpiTitle}>Города</div><div style={kpiValue}>{s?.total_cities ?? '—'}</div></div>
        <div style={card}><div style={kpiTitle}>Контакты (sum)</div><div style={kpiValue}>{s?.total_contacts ?? '—'}</div></div>
        <div style={card}><div style={kpiTitle}>Конверсия, % (avg)</div><div style={kpiValue}>{s?.avg_conversion ? `${s.avg_conversion.toFixed(1)}%` : '—'}</div></div>
      </section>

      {/* Города */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Производительность по городам (топ 20)</h2>
        <Table
          columns={['Город', 'Показы', 'Просмотры', 'Контакты', 'Конверсия, %']}
          rows={cities.map(c => [c.city, c.impressions, c.views, c.contacts, c.view_to_contact])}
        />
      </section>

      {/* Стратегии */}
      <section>
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>Мониторинг стратегий автобиддера</h2>
        <Table
          columns={['Стратегия', 'Объявлений', 'Ср. цена контакта', 'Ср. конверсия, %']}
          rows={strategies.map(r => [r.strategy_type, r.ads_count, r.avg_cost_per_contact, r.avg_conversion])}
        />
      </section>

      <div style={{ marginTop: 24, color: '#666', fontSize: 12 }}>
        Обновлено: {s?.refreshed_at ? new Date(s.refreshed_at).toLocaleString() : '—'}
      </div>
    </main>
  );
}

function Table({ columns, rows }: { columns: string[]; rows: (string | number | null)[][] }) {
  return (
    <div style={{ overflowX: 'auto', border: '1px solid #eee', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={th}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: 16, textAlign: 'center', color: '#888' }}>нет данных</td></tr>
          ) : rows.map((r, idx) => (
            <tr key={idx}>
              {r.map((cell, j) => (
                <td key={j} style={td}>{cell ?? '—'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const card: React.CSSProperties = { border: '1px solid #eee', borderRadius: 12, padding: '12px 16px', background: '#fafafa' };
const kpiTitle: React.CSSProperties = { fontSize: 12, color: '#666', marginBottom: 6 };
const kpiValue: React.CSSProperties = { fontSize: 22, fontWeight: 700 };
const th: React.CSSProperties = { textAlign: 'left', padding: '10px 12px', borderBottom: '1px solid #eee', background: '#fafafa', fontSize: 12, color: '#444' };
const td: React.CSSProperties = { padding: '10px 12px', borderBottom: '1px solid #f2f2f2', fontSize: 13 };
