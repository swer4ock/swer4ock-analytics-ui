"use client";

import React, { useEffect, useState } from "react";
import { rpcPreferV1 } from "@/lib/rpc";

type CompanyCode = "seltka" | "iltech" | "mituroom";

interface AdPerformance {
  ad_id: string;
  title: string;
  city: string;
  category: string;
  views: number;
  contacts: number;
  conversion_rate: number;
  current_bid: number;
  recommended_bid: number;
  bid_efficiency: number;
  cost: number;
  cpl: number;
  roi_score: number;
  profitability_rank: number;
}

interface CategoryAnalysis {
  category: string;
  ads_count: number;
  total_views: number;
  total_contacts: number;
  avg_conversion_rate: number;
  avg_cpl: number;
  total_cost: number;
  avg_bid_efficiency: number;
  category_score: number;
}

interface GeoAnalysis {
  city: string;
  ads_count: number;
  total_contacts: number;
  avg_conversion_rate: number;
  avg_cpl: number;
  market_potential_score: number;
  competition_level: string;
}

interface Recommendation {
  ad_id: string;
  title: string;
  city: string;
  issue_type: string;
  current_value: number;
  recommended_action: string;
  potential_improvement: string;
  priority_level: string;
}

export default function AdsIntelligencePage() {
  const [company, setCompany] = useState<CompanyCode>("seltka");
  const [topAds, setTopAds] = useState<AdPerformance[] | null>(null);
  const [categories, setCategories] = useState<CategoryAnalysis[] | null>(null);
  const [geoData, setGeoData] = useState<GeoAnalysis[] | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalAdsCount, setTotalAdsCount] = useState<number | null>(null);
  const [analysisPeriod, setAnalysisPeriod] = useState<string>("Последние 90 дней");

  const companies = [
    { value: "seltka" as CompanyCode, label: "Сэлтка (Кирилл)" },
    { value: "iltech" as CompanyCode, label: "Ильтех (Ильнур)" },
    { value: "mituroom" as CompanyCode, label: "mituroom (Артем)" },
  ];

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError(null);
        setTopAds(null);
        setCategories(null);
        setGeoData(null);
        setRecommendations(null);
        setTotalAdsCount(null);

        const [ads, cats, geo, recs] = await Promise.all([
          rpcPreferV1<AdPerformance[]>("get_unified_ads_performance", { p_company: company, p_limit: 25 }),
          rpcPreferV1<CategoryAnalysis[]>("get_avito_positions_analysis", { p_limit: 8 }),
          rpcPreferV1<GeoAnalysis[]>("get_geo_profitability_analysis", { p_company: company, p_limit: 10 }),
          rpcPreferV1<Recommendation[]>("get_optimization_recommendations", { p_company: company, p_limit: 15 }),
        ]);

        if (!mounted) return;
        setTopAds(ads);
        setCategories(cats);
        setGeoData(geo);
        setRecommendations(recs);
        
        // Calculate total ads count based on available data
        const totalFromAds = ads?.length || 0;
        const totalFromCategories = cats?.reduce((sum, cat) => sum + (cat.ads_count || 0), 0) || 0;
        const totalFromGeo = geo?.reduce((sum, geo) => sum + (geo.ads_count || 0), 0) || 0;
        const estimatedTotal = Math.max(totalFromAds, totalFromCategories, totalFromGeo, 0);
        setTotalAdsCount(estimatedTotal);
      } catch (e: any) {
        if (!mounted) return;
        console.error("Ads Intelligence load error:", e);
        setError(String(e?.message || e));
        setTopAds([]);
        setCategories([]);
        setGeoData([]);
        setRecommendations([]);
        setTotalAdsCount(0);
      }
    })();
    return () => { mounted = false; };
  }, [company]);

  const isLoading = topAds === null || categories === null || geoData === null || recommendations === null;

  const getBadgeColor = (score: number, type: "roi" | "conversion" | "efficiency") => {
    if (type === "roi") {
      return score >= 50 ? "#28a745" : score >= 25 ? "#ffc107" : "#dc3545";
    }
    if (type === "conversion") {
      return score >= 5 ? "#28a745" : score >= 2 ? "#ffc107" : "#dc3545";
    }
    if (type === "efficiency") {
      return score >= 0.9 ? "#28a745" : score >= 0.7 ? "#ffc107" : "#dc3545";
    }
    return "#6c757d";
  };

  return (
    <main style={{ padding: 24, maxWidth: 1600, margin: "0 auto", fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, color: '#2c3e50' }}>
          🎯 Ads Intelligence — Анализ самых перспективных объявлений
        </h1>
        <p style={{ color: '#6c757d', fontSize: 16, marginBottom: 20 }}>
          Единый дашборд для выявления золотых позиций: ROI-анализ, конверсионная эффективность, географическая прибыльность
        </p>
        
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <label htmlFor="company" style={{ fontSize: 14, fontWeight: 600, color: '#444' }}>Компания:</label>
          <select 
            id="company" 
            value={company} 
            onChange={(e) => setCompany(e.target.value as CompanyCode)}
            style={{ padding: '8px 12px', border: '1px solid #e1e1e1', borderRadius: 8, fontSize: 14 }}
          >
            {companies.map(c => (<option key={c.value} value={c.value}>{c.label}</option>))}
          </select>
        </div>
        
        {/* Analysis Info Block */}
        {!isLoading && !error && totalAdsCount !== null && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              padding: 20, 
              background: '#f8f9fa', 
              border: '1px solid #e9ecef', 
              borderRadius: 12, 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#28a745', marginBottom: 4 }}>
                  {totalAdsCount.toLocaleString('ru-RU')}
                </div>
                <div style={{ fontSize: 14, color: '#6c757d', fontWeight: 600 }}>
                  Всего объявлений
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  В базе данных
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#007bff', marginBottom: 4 }}>
                  {companies.find(c => c.value === company)?.label || company}
                </div>
                <div style={{ fontSize: 14, color: '#6c757d', fontWeight: 600 }}>
                  Компания
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  Анализируется сейчас
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#fd7e14', marginBottom: 4 }}>
                  {analysisPeriod}
                </div>
                <div style={{ fontSize: 14, color: '#6c757d', fontWeight: 600 }}>
                  Период анализа
                </div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                  Временной диапазон
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {isLoading && (
        <div style={{ padding: 32, textAlign: 'center', color: '#6c757d', fontSize: 16 }}>
          🔄 Анализируем данные объявлений...
        </div>
      )}

      {error && (
        <div style={{ padding: 20, color: '#721c24', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 8, marginBottom: 24 }}>
          ❌ Ошибка загрузки: {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Top Performing Ads */}
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: '#28a745' }}>
              🏆 Топ объявлений по ROI (Рентабельность инвестиций)
            </h2>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8f9fa' }}>
                  <tr>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Ранг</th>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>ID объявления</th>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Объявление</th>
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Город</th>
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Сумма ставки</th>
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Контакты</th>
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Конверсия</th>
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>CPL (₽)</th>
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>ROI Score</th>
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Эффективность ставки</th>
                  </tr>
                </thead>
                <tbody>
                  {(topAds || []).slice(0, 25).map((ad, i) => (
                    <tr key={ad.ad_id} style={{ borderBottom: '1px solid #f1f3f4', backgroundColor: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: 12, fontWeight: 700, color: i < 3 ? '#ffc107' : '#6c757d' }}>
                        #{ad.profitability_rank}
                      </td>
                      <td style={{ padding: 12, fontSize: 12, fontWeight: 600, color: '#2c3e50', fontFamily: 'monospace' }}>
                        {ad.ad_id}
                      </td>
                      <td style={{ padding: 12, maxWidth: 200 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#2c3e50', marginBottom: 2 }}>{ad.title}</div>
                        <div style={{ fontSize: 12, color: '#6c757d' }}>{ad.category}</div>
                      </td>
                      <td style={{ padding: 12, textAlign: 'center', fontSize: 14 }}>{ad.city}</td>
                      <td style={{ padding: 12, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                        {ad.current_bid ? ad.current_bid.toFixed(0) : '—'} ₽
                      </td>
                      <td style={{ padding: 12, textAlign: 'center', fontSize: 16, fontWeight: 600 }}>{ad.contacts}</td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: 12, 
                          fontSize: 12, 
                          fontWeight: 600,
                          background: getBadgeColor(ad.conversion_rate, "conversion") + '20',
                          color: getBadgeColor(ad.conversion_rate, "conversion")
                        }}>
                          {ad.conversion_rate}%
                        </span>
                      </td>
                      <td style={{ padding: 12, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
                        {ad.cpl ? Math.round(ad.cpl).toLocaleString('ru-RU') : '—'}
                      </td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <span style={{ 
                          padding: '6px 10px', 
                          borderRadius: 16, 
                          fontSize: 13, 
                          fontWeight: 700,
                          background: getBadgeColor(ad.roi_score, "roi") + '20',
                          color: getBadgeColor(ad.roi_score, "roi")
                        }}>
                          {Math.round(ad.roi_score)}
                        </span>
                      </td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: 12, 
                          fontSize: 12, 
                          fontWeight: 600,
                          background: getBadgeColor(ad.bid_efficiency, "efficiency") + '20',
                          color: getBadgeColor(ad.bid_efficiency, "efficiency")
                        }}>
                          {ad.bid_efficiency.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            {/* Category Analysis */}
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#6f42c1' }}>
                📂 Анализ по категориям
              </h2>
              <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontSize: 12, fontWeight: 600 }}>Категория</th>
                      <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 12, fontWeight: 600 }}>Объявлений</th>
                      <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 12, fontWeight: 600 }}>Контакты</th>
                      <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 12, fontWeight: 600 }}>Конверсия</th>
                      <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 12, fontWeight: 600 }}>Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(categories || []).map((cat, i) => (
                      <tr key={cat.category} style={{ borderBottom: '1px solid #f1f3f4', backgroundColor: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                        <td style={{ padding: 10, fontSize: 13, fontWeight: 600, color: '#2c3e50' }}>{cat.category}</td>
                        <td style={{ padding: 10, textAlign: 'center', fontSize: 13 }}>{cat.ads_count}</td>
                        <td style={{ padding: 10, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{cat.total_contacts}</td>
                        <td style={{ padding: 10, textAlign: 'center', fontSize: 12 }}>{cat.avg_conversion_rate}%</td>
                        <td style={{ padding: 10, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#28a745' }}>
                          {Math.round(cat.category_score)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Geo Analysis */}
            <section>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#fd7e14' }}>
                🗺️ Географическая прибыльность
              </h2>
              <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ background: '#f8f9fa' }}>
                    <tr>
                      <th style={{ padding: 10, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontSize: 12, fontWeight: 600 }}>Город</th>
                      <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 12, fontWeight: 600 }}>Контакты</th>
                      <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 12, fontWeight: 600 }}>CPL (₽)</th>
                      <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 12, fontWeight: 600 }}>Потенциал</th>
                      <th style={{ padding: 10, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 12, fontWeight: 600 }}>Конкуренция</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(geoData || []).map((geo, i) => (
                      <tr key={geo.city} style={{ borderBottom: '1px solid #f1f3f4', backgroundColor: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                        <td style={{ padding: 10, fontSize: 13, fontWeight: 600, color: '#2c3e50' }}>{geo.city}</td>
                        <td style={{ padding: 10, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{geo.total_contacts}</td>
                        <td style={{ padding: 10, textAlign: 'center', fontSize: 13 }}>
                          {geo.avg_cpl ? Math.round(geo.avg_cpl).toLocaleString('ru-RU') : '—'}
                        </td>
                        <td style={{ padding: 10, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#28a745' }}>
                          {Math.round(geo.market_potential_score)}
                        </td>
                        <td style={{ padding: 10, textAlign: 'center' }}>
                          <span style={{ 
                            padding: '2px 6px', 
                            borderRadius: 8, 
                            fontSize: 11, 
                            fontWeight: 600,
                            background: geo.competition_level === 'Высокая' ? '#f8d7da' : geo.competition_level === 'Средняя' ? '#fff3cd' : '#d4edda',
                            color: geo.competition_level === 'Высокая' ? '#721c24' : geo.competition_level === 'Средняя' ? '#856404' : '#155724'
                          }}>
                            {geo.competition_level}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Optimization Recommendations */}
          <section>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: '#dc3545' }}>
              🔧 Рекомендации по оптимизации
            </h2>
            <div style={{ background: '#fff', border: '1px solid #e9ecef', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8f9fa' }}>
                  <tr>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>ID объявления</th>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Объявление</th>
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Проблема</th>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Рекомендация</th>
                    <th style={{ padding: 12, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Потенциал улучшения</th>
                    <th style={{ padding: 12, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontSize: 13, fontWeight: 600 }}>Приоритет</th>
                  </tr>
                </thead>
                <tbody>
                  {(recommendations || []).slice(0, 12).map((rec, i) => (
                    <tr key={`${rec.ad_id}-${rec.issue_type}`} style={{ borderBottom: '1px solid #f1f3f4', backgroundColor: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: 12, fontSize: 12, fontWeight: 600, color: '#2c3e50', fontFamily: 'monospace' }}>
                        {rec.ad_id}
                      </td>
                      <td style={{ padding: 12, maxWidth: 180 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#2c3e50', marginBottom: 2 }}>{rec.title}</div>
                        <div style={{ fontSize: 11, color: '#6c757d' }}>{rec.city}</div>
                      </td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: 12, 
                          fontSize: 11, 
                          fontWeight: 600,
                          background: rec.issue_type.includes('Низкая') ? '#f8d7da' : rec.issue_type.includes('Высокий') ? '#fff3cd' : '#e2e3e5',
                          color: rec.issue_type.includes('Низкая') ? '#721c24' : rec.issue_type.includes('Высокий') ? '#856404' : '#383d41'
                        }}>
                          {rec.issue_type}
                        </span>
                      </td>
                      <td style={{ padding: 12, fontSize: 13, color: '#2c3e50' }}>{rec.recommended_action}</td>
                      <td style={{ padding: 12, fontSize: 13, color: '#28a745', fontWeight: 600 }}>{rec.potential_improvement}</td>
                      <td style={{ padding: 12, textAlign: 'center' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: 12, 
                          fontSize: 11, 
                          fontWeight: 600,
                          background: rec.priority_level === 'Высокий' ? '#d4edda' : '#fff3cd',
                          color: rec.priority_level === 'Высокий' ? '#155724' : '#856404'
                        }}>
                          {rec.priority_level}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <footer style={{ marginTop: 40, padding: 24, background: '#2c3e50', color: '#fff', borderRadius: 12, textAlign: 'center' }}>
        <h3 style={{ marginBottom: 12 }}>🎯 Ads Intelligence Dashboard</h3>
        <p style={{ marginBottom: 16, opacity: 0.8 }}>
          Единая система анализа объявлений для выявления самых перспективных позиций | IT отдел CRM
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', background: '#34495e', borderRadius: 16, fontSize: 12 }}>
            🏆 ROI-анализ
          </span>
          <span style={{ padding: '6px 12px', background: '#34495e', borderRadius: 16, fontSize: 12 }}>
            📊 Конверсионная эффективность
          </span>
          <span style={{ padding: '6px 12px', background: '#34495e', borderRadius: 16, fontSize: 12 }}>
            🗺️ Географическая прибыльность
          </span>
          <span style={{ padding: '6px 12px', background: '#34495e', borderRadius: 16, fontSize: 12 }}>
            🔧 Рекомендации по оптимизации
          </span>
        </div>
      </footer>
    </main>
  );
}
