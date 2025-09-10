'use client';

export default function AnalyticsDashboardPage() {
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
            📊 Аналитика
          </span>
        </div>

        <h1 style={{
          color: '#2c3e50',
          marginBottom: 8,
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          📊 Аналитический Dashboard
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6c757d',
          marginBottom: 24
        }}>
          Расширенная аналитика данных | IT отдел CRM
        </p>
      </div>

      <section style={{ marginBottom: 32 }}>
        <div style={{
          padding: 32,
          backgroundColor: '#f8f9fa',
          borderRadius: 16,
          border: '2px solid #007bff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: 16 }}>📊</div>
          <h2 style={{ marginBottom: 16, color: '#2c3e50' }}>Расширенная аналитика</h2>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>
            Расширенный аналитический дашборд находится в активной разработке.
            <br />
            Здесь будут размещены продвинутые аналитические инструменты и визуализации.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          color: '#007bff',
          marginBottom: 24,
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          📈 Планируемые аналитические инструменты
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20
        }}>
          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            border: '2px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>📈 Трендовый анализ</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Анализ трендов и паттернов в данных по времени
            </p>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            border: '2px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>🎯 Предиктивная аналитика</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Прогнозирование на основе исторических данных
            </p>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            border: '2px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>📊 Сравнительный анализ</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Сравнение показателей по периодам и категориям
            </p>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            border: '2px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>🔍 Детальный разбор</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Глубокий анализ конкретных показателей и сегментов
            </p>
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
        <h3 style={{ marginBottom: 16 }}>📊 Расширенный аналитический дашборд</h3>
        <p style={{ marginBottom: 20, opacity: 0.8 }}>
          Продвинутая аналитика данных | IT отдел CRM
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            📊 Аналитика
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            📈 Тренды
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            🔄 В разработке
          </span>
        </div>
      </footer>
    </main>
  );
}
