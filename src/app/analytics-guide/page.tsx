export const dynamic = 'force-dynamic';

interface AnalyticsSummary {
  data_type: string;
  record_count: number;
  description: string;
}

interface CityPerformance {
  city: string;
  ads_count: number;
  avg_bid: number;
}

interface StrategyData {
  strategy_type: string;
  ads_count: number;
  cities_count: number;
}

async function fetchAnalyticsSummary(): Promise<AnalyticsSummary[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_analytics_summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Prefer': 'count=none'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    return [];
  }
}

async function fetchCityPerformance(): Promise<CityPerformance[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_city_performance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Prefer': 'count=none'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching city performance:', error);
    return [];
  }
}

async function fetchStrategyData(): Promise<StrategyData[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_strategy_monitoring`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Prefer': 'count=none'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching strategy data:', error);
    return [];
  }
}

export default async function AnalyticsGuidePage() {
  const [summary, cityData, strategyData] = await Promise.all([
    fetchAnalyticsSummary(),
    fetchCityPerformance(),
    fetchStrategyData()
  ]);

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#2c3e50', marginBottom: 8 }}>📋 ОБРАТНАЯ СВЯЗЬ ДЛЯ АНАЛИТИЧЕСКОГО ОТДЕЛА</h1>
        <p style={{ fontSize: '18px', color: '#6c757d', marginBottom: 24 }}>
          Руководство по работе с системой автобиддинга
        </p>
      </div>

      {/* What Was Accomplished */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#28a745', marginBottom: 20 }}>🎯 ЧТО МЫ СДЕЛАЛИ ВМЕСТЕ</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 24 }}>
          <div style={{ padding: 24, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef' }}>
            <h3 style={{ color: '#007bff', marginBottom: 16 }}>1. Полная инфраструктура автобиддера</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>✅ 56 объявлений загружены в Supabase</li>
              <li style={{ marginBottom: 8 }}>✅ 20 городов с различными стратегиями</li>
              <li style={{ marginBottom: 8 }}>✅ 4 analytics views для анализа эффективности</li>
              <li style={{ marginBottom: 8 }}>✅ Логирование всех аналитических операций</li>
            </ul>
          </div>

          <div style={{ padding: 24, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef' }}>
            <h3 style={{ color: '#007bff', marginBottom: 16 }}>2. Готовые инструменты анализа</h3>
            <div style={{ fontSize: '14px', color: '#495057' }}>
              <p style={{ marginBottom: 12 }}><strong>analytics.v_bidder_ad_performance</strong> - эффективность по объявлениям</p>
              <p style={{ marginBottom: 12 }}><strong>analytics.v_bidder_city_performance</strong> - анализ по городам</p>
              <p style={{ marginBottom: 12 }}><strong>analytics.v_bidder_strategy_monitoring</strong> - мониторинг стратегий</p>
              <p style={{ marginBottom: 0 }}><strong>analytics.v_bidder_summary</strong> - сводная статистика</p>
            </div>
          </div>

          <div style={{ padding: 24, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef' }}>
            <h3 style={{ color: '#007bff', marginBottom: 16 }}>3. Активированная система</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>✅ MCP Supabase доступ настроен</li>
              <li style={{ marginBottom: 8 }}>✅ Безопасность и логирование активированы</li>
              <li style={{ marginBottom: 8 }}>✅ Первый отчет выполнен успешно</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Current System Status */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#17a2b8', marginBottom: 20 }}>📊 ТЕКУЩЕЕ СОСТОЯНИЕ СИСТЕМЫ</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 24 }}>
          {summary.map((item, index) => (
            <div key={index} style={{
              padding: 20,
              backgroundColor: '#e7f3ff',
              borderRadius: 8,
              border: '1px solid #b8daff',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0056b3', marginBottom: 8 }}>
                {item.record_count}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#0056b3', marginBottom: 4 }}>
                {item.data_type}
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d' }}>
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How to Start Working */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#ffc107', marginBottom: 20 }}>🚀 КАК НАЧАТЬ РАБОТУ АНАЛИТИКУ</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div style={{ padding: 24, backgroundColor: '#fff3cd', borderRadius: 8, border: '1px solid #ffeaa7' }}>
            <h3 style={{ color: '#856404', marginBottom: 16 }}>Шаг 1: Проверка данных</h3>
            <div style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 6, fontFamily: 'monospace', fontSize: '14px' }}>
              <div style={{ marginBottom: 8 }}>SELECT COUNT(*) FROM analytics.v_bidder_ad_performance;</div>
              <div>SELECT COUNT(*) FROM analytics.v_bidder_city_performance;</div>
            </div>
          </div>

          <div style={{ padding: 24, backgroundColor: '#d4edda', borderRadius: 8, border: '1px solid #c3e6cb' }}>
            <h3 style={{ color: '#155724', marginBottom: 16 }}>Шаг 2: Запуск первого отчета</h3>
            <div style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 6, fontFamily: 'monospace', fontSize: '14px' }}>
              <div style={{ marginBottom: 8 }}>SELECT city, COUNT(*) as ads, ROUND(AVG(current_max_bid), 0) as avg_bid</div>
              <div>FROM analytics.v_bidder_ad_performance</div>
              <div>GROUP BY city ORDER BY ads DESC LIMIT 10;</div>
            </div>
          </div>

          <div style={{ padding: 24, backgroundColor: '#d1ecf1', borderRadius: 8, border: '1px solid #bee5eb' }}>
            <h3 style={{ color: '#0c5460', marginBottom: 16 }}>Шаг 3: Мониторинг эффективности</h3>
            <div style={{ backgroundColor: '#f8f9fa', padding: 16, borderRadius: 6, fontFamily: 'monospace', fontSize: '14px' }}>
              <div style={{ marginBottom: 8 }}>SELECT strategy_type, COUNT(*) as ads, ROUND(AVG(cities_count), 0) as cities</div>
              <div>FROM analytics.v_bidder_strategy_monitoring</div>
              <div>GROUP BY strategy_type;</div>
            </div>
          </div>
        </div>
      </section>

      {/* City Performance Table */}
      {cityData.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#6f42c1', marginBottom: 20 }}>🏙️ АНАЛИЗ ПО ГОРОДАМ</h2>
          <div style={{
            border: '1px solid #e9ecef',
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: 'white'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Город</th>
                  <th style={{ padding: 16, textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>Объявлений</th>
                  <th style={{ padding: 16, textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>Средняя ставка</th>
                </tr>
              </thead>
              <tbody>
                {cityData.map((city, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: 16, fontWeight: '600' }}>{city.city}</td>
                    <td style={{ padding: 16, textAlign: 'center' }}>{city.ads_count}</td>
                    <td style={{ padding: 16, textAlign: 'center' }}>{city.avg_bid} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Strategy Monitoring */}
      {strategyData.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ color: '#fd7e14', marginBottom: 20 }}>🎯 МОНИТОРИНГ СТРАТЕГИЙ</h2>
          <div style={{
            border: '1px solid #e9ecef',
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: 'white'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 16, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Стратегия</th>
                  <th style={{ padding: 16, textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>Объявлений</th>
                  <th style={{ padding: 16, textAlign: 'center', borderBottom: '1px solid #e9ecef' }}>Городов</th>
                </tr>
              </thead>
              <tbody>
                {strategyData.map((strategy, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: 16, fontWeight: '600' }}>{strategy.strategy_type}</td>
                    <td style={{ padding: 16, textAlign: 'center' }}>{strategy.ads_count}</td>
                    <td style={{ padding: 16, textAlign: 'center' }}>{strategy.cities_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Recommendations */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#dc3545', marginBottom: 20 }}>💡 МОИ РЕКОМЕНДАЦИИ АНАЛИТИЧЕСКОМУ ОТДЕЛУ</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div style={{ padding: 24, backgroundColor: '#d4edda', borderRadius: 8, border: '1px solid #c3e6cb' }}>
            <h3 style={{ color: '#155724', marginBottom: 16 }}>✅ ЧТО ДЕЛАТЬ</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>Регулярно проверять analytics.query_logs</li>
              <li style={{ marginBottom: 8 }}>Использовать views вместо прямого доступа</li>
              <li style={{ marginBottom: 8 }}>Начинать с простых отчетов по городам</li>
              <li style={{ marginBottom: 8 }}>Следить за логами ошибок</li>
            </ul>
          </div>

          <div style={{ padding: 24, backgroundColor: '#f8d7da', borderRadius: 8, border: '1px solid #f5c6cb' }}>
            <h3 style={{ color: '#721c24', marginBottom: 16 }}>❌ ЧЕГО ИЗБЕГАТЬ</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>Не обходить систему</li>
              <li style={{ marginBottom: 8 }}>Не игнорировать логи</li>
              <li style={{ marginBottom: 8 }}>Не работать напрямую с avito_bidder_*</li>
            </ul>
          </div>
        </div>
      </section>

      {/* System Capabilities */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#20c997', marginBottom: 20 }}>🔧 ВОЗМОЖНОСТИ СИСТЕМЫ</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div style={{ padding: 24, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef' }}>
            <h3 style={{ color: '#6c757d', marginBottom: 16 }}>📊 Готовые отчеты</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>По городам: Казань, Чистополь, Мещеряково</li>
              <li style={{ marginBottom: 8 }}>По стратегиям: priority, major, standard</li>
              <li style={{ marginBottom: 8 }}>По эффективности: ROI, стоимость контакта</li>
            </ul>
          </div>

          <div style={{ padding: 24, backgroundColor: '#f8f9fa', borderRadius: 8, border: '1px solid #e9ecef' }}>
            <h3 style={{ color: '#6c757d', marginBottom: 16 }}>🔧 Технические возможности</h3>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>MCP Supabase: Полный доступ</li>
              <li style={{ marginBottom: 8 }}>Безопасность: Автоматическое логирование</li>
              <li style={{ marginBottom: 8 }}>Масштабируемость: Готова к большим объемам</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next Steps Roadmap */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ color: '#6f42c1', marginBottom: 20 }}>📈 СЛЕДУЮЩИЕ ШАГИ ДЛЯ ОТДЕЛА</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          <div style={{ padding: 20, backgroundColor: '#e7f3ff', borderRadius: 8, border: '1px solid #b8daff' }}>
            <h4 style={{ color: '#0056b3', marginBottom: 12 }}>Неделя 1: Освоение</h4>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li style={{ marginBottom: 4, fontSize: '14px' }}>Изучить доступные views</li>
              <li style={{ marginBottom: 4, fontSize: '14px' }}>Запустить первые отчеты</li>
              <li style={{ marginBottom: 4, fontSize: '14px' }}>Настроить регулярный мониторинг</li>
            </ul>
          </div>

          <div style={{ padding: 20, backgroundColor: '#fff3cd', borderRadius: 8, border: '1px solid #ffeaa7' }}>
            <h4 style={{ color: '#856404', marginBottom: 12 }}>Неделя 2: Оптимизация</h4>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li style={{ marginBottom: 4, fontSize: '14px' }}>Анализ эффективности стратегий</li>
              <li style={{ marginBottom: 4, fontSize: '14px' }}>Корректировка ставок по городам</li>
              <li style={{ marginBottom: 4, fontSize: '14px' }}>Мониторинг ROI</li>
            </ul>
          </div>

          <div style={{ padding: 20, backgroundColor: '#d4edda', borderRadius: 8, border: '1px solid #c3e6cb' }}>
            <h4 style={{ color: '#155724', marginBottom: 12 }}>Неделя 3: Автоматизация</h4>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              <li style={{ marginBottom: 4, fontSize: '14px' }}>Создание дашбордов</li>
              <li style={{ marginBottom: 4, fontSize: '14px' }}>Настройка алертов</li>
              <li style={{ marginBottom: 4, fontSize: '14px' }}>Интеграция с отчетностью</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section style={{ marginBottom: 40 }}>
        <div style={{
          padding: 32,
          backgroundColor: '#e9ecef',
          borderRadius: 12,
          textAlign: 'center',
          border: '2px solid #28a745'
        }}>
          <h2 style={{ color: '#28a745', marginBottom: 16 }}>🎉 ИТОГ</h2>
          <p style={{ fontSize: '18px', color: '#495057', marginBottom: 16 }}>
            У вас есть полная инфраструктура для анализа автобиддера!
          </p>
          <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: 24 }}>
            Начните с простых отчетов и постепенно расширяйте аналитику.
            Система готова к работе - пробуйте и задавайте вопросы!
          </p>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>
            🚀✨ Удачи в работе с данными! 🤖
          </div>
        </div>
      </section>
    </main>
  );
}
