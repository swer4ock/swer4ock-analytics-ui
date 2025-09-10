"use client";

import React, { useEffect, useState } from 'react';
import { rpcPreferV1 } from '@/lib/rpc';

type SalesSummary = {
  total_ads: number;
  total_views: number;
  total_contacts: number;
  avg_conversion: number;
  total_revenue: number;
  refreshed_at: string;
};

type CitySales = {
  city: string;
  ads_count: number;
  total_views: number;
  total_contacts: number;
  conversion_rate: number;
  avg_price: number;
};

type CategoryPerformance = {
  category: string;
  ads_count: number;
  total_views: number;
  total_contacts: number;
  conversion_rate: number;
  avg_days_online: number;
};

type SalesTrend = {
  report_date: string;
  total_ads: number;
  total_views: number;
  total_contacts: number;
  avg_conversion: number;
};

export default function AvitoSalesDashboardPage() {
  const [summary, setSummary] = useState<SalesSummary[] | null>(null);
  const [cities, setCities] = useState<CitySales[] | null>(null);
  const [categories, setCategories] = useState<CategoryPerformance[] | null>(null);
  const [trends, setTrends] = useState<SalesTrend[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<string>('all');

  const companies = [
    { value: 'all', label: 'Все компании' },
    { value: 'seltka', label: 'Сэлтка (Кирилл)' },
    { value: 'iltech', label: 'Ильтех (Ильнур)' },
    { value: 'mituroom', label: 'mituroom (Артем)' },
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const payloadBase = company === 'all' ? {} : { p_company: company } as any;
        const [s, c, cats, t] = await Promise.all([
          rpcPreferV1<SalesSummary[]>('get_avito_sales_summary', Object.keys(payloadBase).length ? payloadBase : undefined),
          rpcPreferV1<CitySales[]>('get_avito_top_cities_sales', { p_limit: 10, ...payloadBase }),
          rpcPreferV1<CategoryPerformance[]>('get_avito_categories_performance', { p_limit: 10, ...payloadBase }),
          rpcPreferV1<SalesTrend[]>('get_avito_sales_trends', { p_days: 7, ...payloadBase })
        ]);
        if (!mounted) return;
        setSummary(s);
        setCities(c);
        setCategories(cats);
        setTrends(t);
      } catch (e: any) {
        console.error('Avito Sales load error:', e);
        if (!mounted) return;
        setError(String(e?.message || e));
        setSummary([]);
        setCities([]);
        setCategories([]);
        setTrends([]);
      }
    })();
    return () => { mounted = false; };
  }, [company]);

  const isLoading = summary === null || cities === null || categories === null || trends === null;
  const s = summary?.[0];

  return (
    <main style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#2c3e50', marginBottom: 8 }}>📊 Avito Продажи - Дашборд</h1>
        <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: 24 }}>
          Аналитическая панель продаж Avito | IT отдел CRM
        </p>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <label htmlFor="company" style={{ fontSize: 14, color: '#444' }}>Компания:</label>
          <select
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{ padding: '6px 10px', border: '1px solid #e1e1e1', borderRadius: 6 }}
          >
            {companies.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        {isLoading && (
          <div style={{ padding: 16, color: '#6c757d' }}>Загрузка данных…</div>
        )}
        {error && (
          <div style={{ padding: 16, color: '#721c24', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 8 }}>
            Ошибка загрузки: {error}
          </div>
        )}
      </div>

      {/* Executive Summary */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#28a745', marginBottom: 20 }}>🎯 Ключевые показатели продаж</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          marginBottom: 24
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
              {s?.total_ads?.toLocaleString() ?? '—'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0056b3', marginBottom: 4 }}>
              ОБЪЯВЛЕНИЙ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Всего в системе
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
              {s?.total_views?.toLocaleString() ?? '—'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#856404', marginBottom: 4 }}>
              ПРОСМОТРОВ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Общий трафик
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
              {s?.total_contacts?.toLocaleString() ?? '—'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#155724', marginBottom: 4 }}>
              КОНТАКТОВ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Реальные лиды
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
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#721c24', marginBottom: 8 }}>
              {s?.avg_conversion ? `${s.avg_conversion.toFixed(1)}%` : '—'}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#721c24', marginBottom: 4 }}>
              КОНВЕРСИЯ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Просмотры → Контакты
            </div>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#e2e3e5',
            borderRadius: 12,
            border: '1px solid #d6d8db',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#383d41', marginBottom: 8 }}>
              {(s?.total_revenue ?? 0).toLocaleString()} ₽
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#383d41', marginBottom: 4 }}>
              ВЫРУЧКА
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Суммарная стоимость
            </div>
          </div>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>

        {/* Top Cities */}
        <section>
          <h2 style={{ color: '#6f42c1', marginBottom: 20 }}>🏙️ Топ городов по продажам</h2>
          <div style={{
            border: '1px solid #e9ecef',
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 16, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Город</th>
                  <th style={{ padding: 16, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Объявлений</th>
                  <th style={{ padding: 16, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Просмотры</th>
                  <th style={{ padding: 16, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Контакты</th>
                  <th style={{ padding: 16, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Конверсия</th>
                </tr>
              </thead>
              <tbody>
                {!cities || cities.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Нет данных</td></tr>
                ) : cities.map((city, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #f1f3f4',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                  }}>
                    <td style={{ padding: 16, fontWeight: '600', color: '#2c3e50' }}>
                      {city.city}
                    </td>
                    <td style={{ padding: 16, textAlign: 'center', fontSize: '16px', fontWeight: '600' }}>
                      {city.ads_count}
                    </td>
                    <td style={{ padding: 16, textAlign: 'center' }}>
                      {city.total_views.toLocaleString()}
                    </td>
                    <td style={{ padding: 16, textAlign: 'center', fontSize: '16px', fontWeight: '600' }}>
                      {city.total_contacts}
                    </td>
                    <td style={{ padding: 16, textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 12,
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: city.conversion_rate >= 5 ? '#d4edda' : city.conversion_rate >= 2 ? '#fff3cd' : '#f8d7da',
                        color: city.conversion_rate >= 5 ? '#155724' : city.conversion_rate >= 2 ? '#856404' : '#721c24'
                      }}>
                        {city.conversion_rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Categories Performance */}
        <section>
          <h2 style={{ color: '#fd7e14', marginBottom: 20 }}>📂 Эффективность категорий</h2>
          <div style={{
            border: '1px solid #e9ecef',
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Категория</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Объявлений</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Контакты</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Конверсия</th>
                </tr>
              </thead>
              <tbody>
                {!categories || categories.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Нет данных</td></tr>
                ) : categories.map((cat, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #f1f3f4',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                  }}>
                    <td style={{ padding: 12, fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                      {cat.category}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                      {cat.ads_count}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                      {cat.total_contacts}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 8,
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: cat.conversion_rate >= 3 ? '#d4edda' : cat.conversion_rate >= 1 ? '#fff3cd' : '#f8d7da',
                        color: cat.conversion_rate >= 3 ? '#155724' : cat.conversion_rate >= 1 ? '#856404' : '#721c24'
                      }}>
                        {cat.conversion_rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

      {/* Sales Trends */}
      {trends && trends.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ color: '#20c997', marginBottom: 20 }}>📈 Тренды продаж (последние 7 дней)</h2>
          <div style={{
            border: '1px solid #e9ecef',
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Дата</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Объявлений</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Просмотры</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Контакты</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Конверсия</th>
                </tr>
              </thead>
              <tbody>
                {trends.map((trend, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #f1f3f4',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                  }}>
                    <td style={{ padding: 12, fontWeight: '600', color: '#2c3e50' }}>
                      {new Date(trend.report_date).toLocaleDateString('ru-RU')}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      {trend.total_ads}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      {trend.total_views.toLocaleString()}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center', fontWeight: '600' }}>
                      {trend.total_contacts}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center' }}>
                      {trend.avg_conversion ? `${trend.avg_conversion.toFixed(1)}%` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        padding: 24,
        backgroundColor: '#2c3e50',
        color: 'white',
        borderRadius: 12,
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: 12 }}>🚀 Avito Продажи - Аналитический Дашборд</h3>
        <p style={{ marginBottom: 16, opacity: 0.8 }}>
          IT отдел CRM | Frontend разработчик | Supabase + Vercel
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            📊 {(cities?.length ?? 0)} городов
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            📂 {(categories?.length ?? 0)} категорий
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            📈 {(trends?.length ?? 0)} дней трендов
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            ⚡ Real-time данные
          </span>
        </div>
        <div style={{ marginTop: 16, fontSize: '12px', opacity: 0.6 }}>
          Обновлено: {s?.refreshed_at ? new Date(s.refreshed_at).toLocaleString('ru-RU') : '—'}
        </div>
      </footer>
    </main>
  );
}
