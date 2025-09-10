"use client";

import React, { useEffect, useState } from 'react';
import { rpcPreferV1 } from '@/lib/rpc';

type BidsSummary = {
  total_bids: number;
  avg_current_bid: number;
  avg_recommended_bid: number;
  total_with_bids: number;
  success_rate: number;
  last_updated: string;
};

type PositionAnalysis = {
  position_range: string;
  count_bids: number;
  avg_current_bid: number;
  avg_recommended_bid: number;
  success_rate: number;
};

export default function AvitoBidsDashboardPage() {
  const [bidsSummary, setBidsSummary] = useState<BidsSummary[] | null>(null);
  const [positionsAnalysis, setPositionsAnalysis] = useState<PositionAnalysis[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<string>('all');

  // Варианты компаний: бизнес-именование → отображаемое имя/ответственный
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
        const payload = company === 'all' ? undefined : { p_company: company } as any;
        const [s, p] = await Promise.all([
          rpcPreferV1<BidsSummary[]>('get_avito_bids_summary', payload),
          rpcPreferV1<PositionAnalysis[]>('get_avito_positions_analysis', payload)
        ]);
        if (!mounted) return;
        setBidsSummary(s);
        setPositionsAnalysis(p);
      } catch (e: any) {
        console.error('Avito Bids load error:', e);
        if (!mounted) return;
        setError(String(e?.message || e));
        setBidsSummary([]);
        setPositionsAnalysis([]);
      }
    })();
    return () => { mounted = false; };
  }, [company]);

  const isLoading = bidsSummary === null || positionsAnalysis === null;
  const s = bidsSummary?.[0];

  return (
    <main style={{ padding: '24px', maxWidth: 1400, margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ color: '#2c3e50', marginBottom: 8 }}>💰 Avito Автобиддер - Аналитика ставок</h1>
        <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: 24 }}>
          Анализ 14,000+ собранных ставок | IT отдел CRM
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
        {!isLoading && s && (
          <div style={{ padding: 16, backgroundColor: '#e7f3ff', borderRadius: 8, border: '1px solid #b8daff' }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#0056b3' }}>
              📊 <strong>Последнее обновление:</strong> {new Date(s.last_updated).toLocaleString('ru-RU')}
            </p>
          </div>
        )}
        {isLoading && (
          <div style={{ padding: 16, color: '#6c757d' }}>Загрузка данных…</div>
        )}
        {error && (
          <div style={{ padding: 16, color: '#721c24', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 8, marginTop: 12 }}>
            Ошибка загрузки: {error}
          </div>
        )}
      </div>

      {/* Executive Summary */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#28a745', marginBottom: 20 }}>📈 Сводка по автобиддеру</h2>
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
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#0056b3', marginBottom: 8 }}>
              {s?.total_bids?.toLocaleString() ?? '—'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0056b3', marginBottom: 4 }}>
              ОБЩЕЕ КОЛИЧЕСТВО СТАВОК
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Проанализировано IT отделом
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
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#856404', marginBottom: 8 }}>
              {s?.avg_current_bid ? `${s.avg_current_bid.toFixed(1)} ₽` : '—'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#856404', marginBottom: 4 }}>
              СРЕДНЯЯ ТЕКУЩАЯ СТАВКА
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Активные ставки
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
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#155724', marginBottom: 8 }}>
              {s?.avg_recommended_bid ? `${s.avg_recommended_bid.toFixed(1)} ₽` : '—'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#155724', marginBottom: 4 }}>
              РЕКОМЕНДОВАННАЯ СТАВКА
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Оптимальная цена
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
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#721c24', marginBottom: 8 }}>
              {s?.success_rate ? `${s.success_rate}%` : '—'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#721c24', marginBottom: 4 }}>
              ЭФФЕКТИВНОСТЬ СИСТЕМЫ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Успешные ставки
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
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: '#383d41', marginBottom: 8 }}>
              {s?.total_with_bids?.toLocaleString() ?? '—'}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#383d41', marginBottom: 4 }}>
              АКТИВНЫЕ СТАВКИ
            </div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>
              Установленные ставки
            </div>
          </div>
        </div>
      </section>

      {/* Position Analysis */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#6f42c1', marginBottom: 20 }}>🎯 Анализ по позициям</h2>
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
                <th style={{ padding: 16, textAlign: 'left', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Диапазон позиций</th>
                <th style={{ padding: 16, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Количество ставок</th>
                <th style={{ padding: 16, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Средняя текущая</th>
                <th style={{ padding: 16, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Средняя рекомендуемая</th>
                <th style={{ padding: 16, textAlign: 'center', borderBottom: '2px solid #e9ecef', fontWeight: '600' }}>Эффективность</th>
              </tr>
            </thead>
            <tbody>
              {!positionsAnalysis || positionsAnalysis.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Нет данных по позициям</td></tr>
              ) : positionsAnalysis.map((pos, index) => (
                <tr key={index} style={{
                  borderBottom: '1px solid #f1f3f4',
                  backgroundColor: index % 2 === 0 ? 'white' : '#fafbfc'
                }}>
                  <td style={{ padding: 16, fontWeight: '600', color: '#2c3e50' }}>
                    {pos.position_range}
                  </td>
                  <td style={{ padding: 16, textAlign: 'center', fontSize: '16px', fontWeight: '600' }}>
                    {pos.count_bids}
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    {pos.avg_current_bid.toFixed(1)} ₽
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    {pos.avg_recommended_bid.toFixed(1)} ₽
                  </td>
                  <td style={{ padding: 16, textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 12,
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: pos.success_rate >= 80 ? '#d4edda' :
                                     pos.success_rate >= 60 ? '#fff3cd' : '#f8d7da',
                      color: pos.success_rate >= 80 ? '#155724' :
                             pos.success_rate >= 60 ? '#856404' : '#721c24'
                    }}>
                      {pos.success_rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* System Status */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ color: '#20c997', marginBottom: 20 }}>🔧 Статус системы автобиддера</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 12,
            border: '1px solid #e9ecef',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#495057', marginBottom: 16 }}>📊 Статистика данных</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#6c757d' }}>
              <li style={{ marginBottom: 8 }}>Обработано: {s?.total_bids?.toLocaleString() ?? '—'} ставок</li>
              <li style={{ marginBottom: 8 }}>Активных ставок: {s?.total_with_bids?.toLocaleString() ?? '—'}</li>
              <li style={{ marginBottom: 8 }}>Успешность: {s?.success_rate ?? '—'}%</li>
              <li style={{ marginBottom: 8 }}>Последний сбор: {s ? new Date(s.last_updated).toLocaleDateString('ru-RU') : '—'}</li>
            </ul>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 12,
            border: '1px solid #e9ecef',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#dc3545', marginBottom: 16 }}>⚠️ Рекомендации</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#6c757d' }}>
              <li style={{ marginBottom: 8 }}>Оптимизировать ставки в топ-3 позициях</li>
              <li style={{ marginBottom: 8 }}>Увеличить охват позиций 11-20</li>
              <li style={{ marginBottom: 8 }}>Мониторить эффективность по диапазонам</li>
              <li style={{ marginBottom: 8 }}>Регулярно обновлять данные из API</li>
            </ul>
          </div>

          <div style={{
            padding: 24,
            backgroundColor: '#f8f9fa',
            borderRadius: 12,
            border: '1px solid #e9ecef',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#28a745', marginBottom: 16 }}>🚀 Следующие шаги</h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: '#6c757d' }}>
              <li style={{ marginBottom: 8 }}>Добавить графики трендов ставок</li>
              <li style={{ marginBottom: 8 }}>Интегрировать с реальными API</li>
              <li style={{ marginBottom: 8 }}>Создать систему алертов</li>
              <li style={{ marginBottom: 8 }}>Автоматизировать сбор данных</li>
            </ul>
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
        <h3 style={{ marginBottom: 12 }}>⚡ Avito Автобиддер - Система управления ставками</h3>
        <p style={{ marginBottom: 16, opacity: 0.8 }}>
          IT отдел CRM | Анализ 14,000+ ставок | Профессиональная оптимизация
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            📊 {s?.total_bids?.toLocaleString() ?? '—'} ставок
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            🎯 {s?.success_rate ?? '—'}% эффективность
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            💰 {s?.avg_recommended_bid ? s.avg_recommended_bid.toFixed(1) : '—'} ₽ средняя ставка
          </span>
          <span style={{ padding: '6px 12px', backgroundColor: '#34495e', borderRadius: 16, fontSize: '12px' }}>
            🔄 IT отдел активен
          </span>
        </div>
      </footer>
    </main>
  );
}
