'use client';

export default function ITDashboardPage() {
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
            👥 IT Отдел
          </span>
        </div>

        <h1 style={{
          color: '#2c3e50',
          marginBottom: 8,
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          👥 IT Dashboard
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#6c757d',
          marginBottom: 24
        }}>
          Панель управления IT отдела | Внутренняя аналитика
        </p>
      </div>

      <section style={{ marginBottom: 32 }}>
        <div style={{
          padding: 32,
          backgroundColor: '#f8f9fa',
          borderRadius: 16,
          border: '2px solid #6f42c1',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: 16 }}>👥</div>
          <h2 style={{ marginBottom: 16, color: '#2c3e50' }}>IT Dashboard</h2>
          <p style={{ margin: 0, color: '#6c757d', fontSize: '16px' }}>
            Внутренняя панель управления IT отдела находится в разработке.
            <br />
            Здесь будет размещена внутренняя аналитика и метрики команды.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{
          color: '#6f42c1',
          marginBottom: 24,
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          📋 Планируемые разделы IT Dashboard
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
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>📈 Метрики команды</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Производительность команды, выполненные задачи, время наработки
            </p>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            border: '2px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>🚨 Статус систем</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Мониторинг состояния всех систем и сервисов
            </p>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            border: '2px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>📋 Задачи и проекты</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Отслеживание текущих задач и прогресса проектов
            </p>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 16,
            border: '2px solid #e9ecef',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: 12, color: '#2c3e50' }}>🔧 Техническая поддержка</h3>
            <p style={{ margin: 0, color: '#6c757d' }}>
              Инструменты для технической поддержки и мониторинга
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
        <h3 style={{ marginBottom: 16 }}>👥 IT Dashboard - Внутренняя аналитика</h3>
        <p style={{ marginBottom: 20, opacity: 0.8 }}>
          Панель управления для IT команды | CRM система
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            👥 IT Команда
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
