'use client';

export default function InstrumentsPage() {
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
            🔧 Инструменты
          </span>
        </div>

        <h1 style={{
          color: '#2c3e50',
          marginBottom: 8,
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          🛠️ Инструменты
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6c757d',
          marginBottom: 24
        }}>
          Набор инструментов для работы с данными | IT отдел CRM
        </p>
      </div>

      <section style={{ marginBottom: 32 }}>
        <div style={{
          padding: 32,
          backgroundColor: '#f8f9fa',
          borderRadius: 16,
          border: '2px solid #17a2b8',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: 16 }}>🛠️</div>
          <h2 style={{ marginBottom: 16, color: '#2c3e50' }}>Панель инструментов</h2>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>
            Раздел с инструментами для работы с данными находится в разработке.
            <br />
            Здесь будут размещены различные утилиты и вспомогательные инструменты.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          color: '#17a2b8',
          marginBottom: 24,
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          📋 Планируемые инструменты
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
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>📊 Генератор отчетов</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Автоматическая генерация отчетов в различных форматах (PDF, Excel, CSV)
            </p>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            border: '2px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>🔍 Поиск по данным</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Продвинутый поиск по всем таблицам и полям базы данных
            </p>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            border: '2px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>📈 Экспорт данных</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Экспорт данных в различные форматы с настройками фильтрации
            </p>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            border: '2px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>⚙️ Настройки</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Настройки системы, уведомлений и пользовательских предпочтений
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
        <h3 style={{ marginBottom: 16 }}>🛠️ Панель инструментов</h3>
        <p style={{ marginBottom: 20, opacity: 0.8 }}>
          Инструменты для работы с данными | IT отдел CRM
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            🛠️ Инструменты
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
