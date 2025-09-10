export const dynamic = 'force-dynamic';

import { rpc } from "../../lib/rpc";

type PulseData = {
  total_views: number;
  total_contacts: number;
  avg_price: number;
  total_ads: number;
  last_updated: string;
};

export default async function PulsePage() {
  let pulseData: PulseData[] = [];

  try {
    pulseData = await rpc<PulseData[]>('get_avito_sales_summary');
  } catch (e: any) {
    console.error('Error fetching pulse data:', e);
    // Fallback data to prevent page crash
    pulseData = [{
      total_views: 0,
      total_contacts: 0,
      avg_price: 0,
      total_ads: 0,
      last_updated: new Date().toISOString()
    }];
  }

  const data = pulseData?.[0];

  return (
    <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <a
            href="/"
            style={{
              color: '#6c757d',
              textDecoration: 'none',
              fontSize: '16px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            ← На главную
          </a>
          <div style={{ flex: 1 }}></div>
          <span style={{
            padding: '4px 12px',
            backgroundColor: '#e7f3ff',
            borderRadius: '12px',
            fontSize: '12px',
            color: '#0056b3',
            fontWeight: '600'
          }}>
            ⚡ LIVE DATA
          </span>
        </div>

        <h1 style={{
          color: '#2c3e50',
          marginBottom: 8,
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          📊 Ads Pulse
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6c757d',
          marginBottom: 24
        }}>
          Реал-тайм мониторинг объявлений | Последние 30 дней
        </p>
      </div>

      <section style={{ marginBottom: 32 }}>
        <div style={{
          padding: 24,
          backgroundColor: '#f8f9fa',
          borderRadius: 16,
          border: '2px solid #28a745',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#28a745',
              animation: 'pulse 2s infinite'
            }}></div>
            <div>
              <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '18px' }}>
                🔴 СИСТЕМА АКТИВНА
              </h3>
              <p style={{ margin: 4, color: '#6c757d', fontSize: '14px' }}>
                Мониторинг в реальном времени | Данные обновляются автоматически
              </p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>
                Последнее обновление
              </p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#2c3e50' }}>
                {data ? new Date(data.last_updated).toLocaleString('ru-RU') : 'Загрузка...'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          color: '#28a745',
          marginBottom: 24,
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          📈 Ключевые метрики
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16
        }}>
          <div style={{
            padding: 24,
            backgroundColor: '#e7f3ff',
            borderRadius: 12,
            border: '1px solid #b8daff',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#0056b3', marginBottom: 8 }}>
              {data?.total_ads?.toLocaleString() ?? '—'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0056b3' }}>
              ОБЪЯВЛЕНИЙ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Активных объявлений
            </div>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#fff3cd',
            borderRadius: 12,
            border: '1px solid #ffeaa7',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#856404', marginBottom: 8 }}>
              {data?.total_views?.toLocaleString() ?? '—'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#856404' }}>
              ПРОСМОТРОВ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              За последние 30 дней
            </div>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#d4edda',
            borderRadius: 12,
            border: '1px solid #c3e6cb',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#155724', marginBottom: 8 }}>
              {data?.total_contacts?.toLocaleString() ?? '—'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#155724' }}>
              КОНТАКТОВ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Реальных лидов
            </div>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8d7da',
            borderRadius: 12,
            border: '1px solid #f5c6cb',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#721c24', marginBottom: 8 }}>
              {data?.avg_price ? `${data.avg_price.toFixed(0)} ₽` : '—'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#721c24' }}>
              СРЕДНЯЯ ЦЕНА
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              По всем объявлениям
            </div>
          </div>
        </div>
      </section>

      <footer style={{
        padding: 32,
        backgroundColor: '#2c3e50',
        color: 'white',
        borderRadius: 16,
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: 16 }}>⚡ Ads Pulse - Реал-тайм мониторинг</h3>
        <p style={{ marginBottom: 20, opacity: 0.8 }}>
          Автоматический сбор и анализ данных объявлений | IT отдел CRM
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            🔴 LIVE
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            📊 {data?.total_ads ?? '—'} объявлений
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            👁️ {data?.total_views?.toLocaleString() ?? '—'} просмотров
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            📞 {data?.total_contacts ?? '—'} контактов
          </span>
        </div>
      </footer>
    </main>
  );
}
