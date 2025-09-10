'use client';

export default function DashboardPage() {
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
            📊 MVP
          </span>
        </div>

        <h1 style={{
          color: '#2c3e50',
          marginBottom: 8,
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          🎯 Основной дашборд
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6c757d',
          marginBottom: 24
        }}>
          MVP версия аналитической панели | IT отдел CRM
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
          <div style={{ fontSize: '64px', marginBottom: 16 }}>🚀</div>
          <h2 style={{ marginBottom: 16, color: '#2c3e50' }}>Дашборд в разработке</h2>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>
            Основная аналитическая панель находится в активной разработке.
            <br />
            Следите за обновлениями на главной странице проекта.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          color: '#28a745',
          marginBottom: 24,
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          📋 Доступные аналитики
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20
        }}>
          <a href="/analytics" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 24,
              backgroundColor: '#f8f9fa',
              borderRadius: 16,
              border: '2px solid #007bff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>📊 Аналитический дашборд</h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Полная аналитика с KPI, фильтрами и реальными данными из Supabase
              </p>
            </div>
          </a>

          <a href="/avito-sales" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 24,
              backgroundColor: '#f8f9fa',
              borderRadius: 16,
              border: '2px solid #28a745',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>💰 Avito Продажи</h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Анализ продаж по городам, категориям и эффективности
              </p>
            </div>
          </a>

          <a href="/avito-bids" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 24,
              backgroundColor: '#f8f9fa',
              borderRadius: 16,
              border: '2px solid #fd7e14',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>⚡ Avito Автобиддер</h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Аналитика автобиддер системы IT отдела
              </p>
            </div>
          </a>

          <a href="/pulse" style={{ textDecoration: 'none' }}>
            <div style={{
              padding: 24,
              backgroundColor: '#f8f9fa',
              borderRadius: 16,
              border: '2px solid #dc3545',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>⚡ Ads Pulse</h3>
              <p style={{ margin: 0, color: '#6c757d' }}>
                Реал-тайм мониторинг объявлений
              </p>
            </div>
          </a>
        </div>
      </section>

      <footer style={{
        padding: 32,
        backgroundColor: '#2c3e50',
        color: 'white',
        borderRadius: 16,
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: 16 }}>🎯 Основной дашборд - MVP</h3>
        <p style={{ marginBottom: 20, opacity: 0.8 }}>
          Аналитическая панель в разработке | IT отдел CRM
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            🚀 MVP
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            📊 Аналитика
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            🔄 В разработке
          </span>
        </div>
      </footer>
    </main>
  );
}
