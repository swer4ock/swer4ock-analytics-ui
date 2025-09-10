"use client";

import React, { useEffect, useState } from 'react';
import {
  rpcGetAvitoContacts,
  rpcGetCplByStrategy,
  rpcGetTopCitiesSales,
  rpcGetUnifiedAdsPerformance,
  rpcGetPositionsAnalysis,
  rpcGetGeoProfitability,
  rpcGetRecommendations
} from '@/lib/rpc';

export const dynamic = 'force-dynamic';

export default function AvitoAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [cplData, setCplData] = useState<any[] | null>(null);
  const [citiesData, setCitiesData] = useState<any[] | null>(null);
  const [positionsData, setPositionsData] = useState<any[] | null>(null);
  const [adsData, setAdsData] = useState<any[] | null>(null);
  const [geoData, setGeoData] = useState<any[] | null>(null);
  const [recommendationsData, setRecommendationsData] = useState<any[] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all data in parallel
        const [
          cplResult,
          citiesResult,
          positionsResult,
          adsResult,
          geoResult,
          recommendationsResult
        ] = await Promise.all([
          rpcGetCplByStrategy({ p_days: 90 }).catch(() => []),
          rpcGetTopCitiesSales({ p_limit: 10 }).catch(() => []),
          rpcGetPositionsAnalysis({ p_limit: 10 }).catch(() => []),
          rpcGetUnifiedAdsPerformance({ p_limit: 20 }).catch(() => []),
          rpcGetGeoProfitability({ p_limit: 15 }).catch(() => []),
          rpcGetRecommendations({ p_limit: 20 }).catch(() => [])
        ]);

        setCplData(cplResult);
        setCitiesData(citiesResult);
        setPositionsData(positionsResult);
        setAdsData(adsResult);
        setGeoData(geoResult);
        setRecommendationsData(recommendationsResult);

      } catch (err: any) {
        console.error('Avito analytics load error:', err);
        setError(String(err?.message || err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate KPIs from CPL data
  const totalContacts = cplData?.reduce((sum, item) => sum + (item.contacts || 0), 0) || 0;
  const totalCost = cplData?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
  const avgCpl = totalContacts > 0 ? totalCost / totalContacts : 0;

  return (
    <main style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#2c3e50', marginBottom: 8 }}>📊 Avito Аналитика</h1>
        <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: 24 }}>
          Комплексный анализ объявлений Avito | IT отдел CRM
        </p>

        {loading && (
          <div style={{ padding: 16, color: '#6c757d' }}>Загрузка данных…</div>
        )}

        {error && (
          <div style={{ padding: 16, color: '#721c24', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 8 }}>
            Ошибка загрузки: {error}
          </div>
        )}
      </div>

      {/* KPI Block */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#28a745', marginBottom: 20 }}>📈 Ключевые показатели</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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
              {totalContacts.toLocaleString()}
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0056b3', marginBottom: 4 }}>
              ОБЩИЕ КОНТАКТЫ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              По всем стратегиям
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
              {totalCost.toLocaleString()} ₽
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#856404', marginBottom: 4 }}>
              ОБЩИЕ ЗАТРАТЫ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              На рекламу
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
              {avgCpl.toFixed(0)} ₽
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#155724', marginBottom: 4 }}>
              СРЕДНИЙ CPL
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Стоимость контакта
            </div>
          </div>
        </div>
      </section>

      {/* Top Cities */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#6f42c1', marginBottom: 20 }}>🏙️ Топ городов по контактам</h2>
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
                <th style={{ padding: 16, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Контакты</th>
              </tr>
            </thead>
            <tbody>
              {!citiesData || citiesData.length === 0 ? (
                <tr><td colSpan={2} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Нет данных</td></tr>
              ) : citiesData.map((city, index) => (
                <tr key={index} style={{
                  borderBottom: '1px solid #f1f3f4',
                  backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                }}>
                  <td style={{ padding: 16, fontWeight: '600', color: '#2c3e50' }}>
                    {city.city}
                  </td>
                  <td style={{ padding: 16, textAlign: 'center', fontSize: '16px', fontWeight: '600' }}>
                    {city.contacts}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Category Analysis */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#fd7e14', marginBottom: 20 }}>📂 Анализ по категориям</h2>
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
              {!positionsData || positionsData.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Нет данных</td></tr>
              ) : positionsData.map((cat, index) => (
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
                      backgroundColor: cat.avg_conversion_rate >= 3 ? '#d4edda' : cat.avg_conversion_rate >= 1 ? '#fff3cd' : '#f8d7da',
                      color: cat.avg_conversion_rate >= 3 ? '#155724' : cat.avg_conversion_rate >= 1 ? '#856404' : '#721c24'
                    }}>
                      {cat.avg_conversion_rate?.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Ads Performance */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#dc3545', marginBottom: 20 }}>🏆 Топ объявлений по ROI</h2>
        <div style={{
          border: '1px solid #e9ecef',
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '12px' }}>Ранг</th>
                  <th style={{ padding: 8, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '12px' }}>Объявление</th>
                  <th style={{ padding: 8, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '12px' }}>Город</th>
                  <th style={{ padding: 8, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '12px' }}>Контакты</th>
                  <th style={{ padding: 8, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '12px' }}>Конверсия</th>
                  <th style={{ padding: 8, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '12px' }}>CPL</th>
                  <th style={{ padding: 8, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '12px' }}>ROI Score</th>
                </tr>
              </thead>
              <tbody>
                {!adsData || adsData.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Нет данных</td></tr>
                ) : adsData.slice(0, 10).map((ad, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #f1f3f4',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                  }}>
                    <td style={{ padding: 8, fontWeight: '600', color: '#2c3e50', fontSize: '12px' }}>
                      #{ad.profitability_rank || index + 1}
                    </td>
                    <td style={{ padding: 8, fontWeight: '600', color: '#2c3e50', fontSize: '12px' }}>
                      {ad.title?.substring(0, 30) || ad.ad_id}
                    </td>
                    <td style={{ padding: 8, textAlign: 'center', fontSize: '12px' }}>
                      {ad.city}
                    </td>
                    <td style={{ padding: 8, textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                      {ad.contacts}
                    </td>
                    <td style={{ padding: 8, textAlign: 'center', fontSize: '12px' }}>
                      {ad.conversion_rate?.toFixed(1)}%
                    </td>
                    <td style={{ padding: 8, textAlign: 'center', fontSize: '12px' }}>
                      {ad.cpl?.toFixed(0)} ₽
                    </td>
                    <td style={{ padding: 8, textAlign: 'center', fontSize: '12px' }}>
                      {ad.roi_score?.toFixed(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Geo Profitability */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#20c997', marginBottom: 20 }}>🗺️ Географическая прибыльность</h2>
        <div style={{
          border: '1px solid #e9ecef',
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Город</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Объявлений</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Контакты</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Потенциал</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Конкуренция</th>
                </tr>
              </thead>
              <tbody>
                {!geoData || geoData.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Нет данных</td></tr>
                ) : geoData.map((city, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #f1f3f4',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                  }}>
                    <td style={{ padding: 12, fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                      {city.city}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                      {city.ads_count}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                      {city.total_contacts}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center', fontSize: '14px' }}>
                      {city.market_potential_score?.toFixed(0)}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center', fontSize: '14px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 8,
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: city.competition_level === 'Высокая' ? '#f8d7da' :
                                       city.competition_level === 'Средняя' ? '#fff3cd' : '#d4edda',
                        color: city.competition_level === 'Высокая' ? '#721c24' :
                              city.competition_level === 'Средняя' ? '#856404' : '#155724'
                      }}>
                        {city.competition_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#17a2b8', marginBottom: 20 }}>🔧 Рекомендации по оптимизации</h2>
        <div style={{
          border: '1px solid #e9ecef',
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: 'white',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Объявление</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Проблема</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Рекомендация</th>
                  <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600', fontSize: '14px' }}>Приоритет</th>
                </tr>
              </thead>
              <tbody>
                {!recommendationsData || recommendationsData.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Нет данных</td></tr>
                ) : recommendationsData.slice(0, 15).map((rec, index) => (
                  <tr key={index} style={{
                    borderBottom: '1px solid #f1f3f4',
                    backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                  }}>
                    <td style={{ padding: 12, fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                      {rec.title?.substring(0, 25) || rec.ad_id}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center', fontSize: '14px' }}>
                      {rec.issue_type}
                    </td>
                    <td style={{ padding: 12, fontSize: '14px' }}>
                      {rec.recommended_action}
                    </td>
                    <td style={{ padding: 12, textAlign: 'center', fontSize: '14px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 8,
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: rec.priority_level === 'Высокий' ? '#f8d7da' : '#fff3cd',
                        color: rec.priority_level === 'Высокий' ? '#721c24' : '#856404'
                      }}>
                        {rec.priority_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: 24,
        backgroundColor: '#2c3e50',
        color: 'white',
        borderRadius: 12,
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: 12 }}>📊 Avito Аналитика</h3>
        <p style={{ marginBottom: 16, opacity: 0.8 }}>
          Комплексный анализ объявлений | IT отдел CRM
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            📈 {totalContacts.toLocaleString()} контактов
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            💰 {totalCost.toLocaleString()} ₽ затрат
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            🎯 {avgCpl.toFixed(0)} ₽ средний CPL
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            ⚡ Real-time данные
          </span>
        </div>
      </footer>
    </main>
  );
}
