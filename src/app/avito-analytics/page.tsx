"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { rpcPreferV1 } from "@/lib/rpc";

export const dynamic = 'force-dynamic';

type CompanyCode = "seltka" | "iltech" | "mituroom";

interface ContactRow {
  ad_id: string;
  city: string;
  contacts: number;
  date: string; // ISO date
}

interface StrategyRow {
  strategy: string;
  contacts: number;
  cost: number;
  cpl: number | null;
}

interface CityRow {
  city: string;
  contacts: number;
}

function AvitoAnalyticsComponent() {
  const search = useSearchParams();
  const router = useRouter();

  const [company, setCompany] = React.useState<CompanyCode>("seltka");
  const [days, setDays] = React.useState<number>(7);
  const [city, setCity] = React.useState<string>("");

  const [contacts, setContacts] = React.useState<ContactRow[] | null>(null);
  const [strategies, setStrategies] = React.useState<StrategyRow[] | null>(null);
  const [topCities, setTopCities] = React.useState<CityRow[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  // Инициализация из URL
  React.useEffect(() => {
    const qCompany = (search.get("company") as CompanyCode) || undefined;
    const qDays = search.get("days");
    const qCity = search.get("city") || undefined;
    if (qCompany) setCompany(qCompany);
    if (qDays && !Number.isNaN(Number(qDays))) setDays(Number(qDays));
    if (qCity) setCity(qCity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Синхронизация URL
  React.useEffect(() => {
    const params = new URLSearchParams();
    params.set("company", company);
    params.set("days", String(days));
    if (city.trim()) params.set("city", city.trim());
    const qs = params.toString();
    router.replace(`/avito-analytics?${qs}`);
  }, [company, days, city, router]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError(null);
        setContacts(null);
        setStrategies(null);
        setTopCities(null);
        const cityParam = city.trim() ? city.trim() : undefined;
        const [c, s, t] = await Promise.all([
          rpcPreferV1<ContactRow[]>("get_avito_contacts", { p_company: company, p_days: days, p_city: cityParam }),
          rpcPreferV1<StrategyRow[]>("get_avito_cpl_by_strategy", { p_company: company, p_days: days }),
          rpcPreferV1<CityRow[]>("get_avito_top_cities_sales", { p_limit: 10 }),
        ]);
        if (!mounted) return;
        setContacts(c);
        setStrategies(s);
        setTopCities(t);
      } catch (e: any) {
        if (!mounted) return;
        console.error("Avito Analytics load error:", e);
        setError(String(e?.message || e));
        setContacts([]);
        setStrategies([]);
        setTopCities([]);
      }
    })();
    return () => { mounted = false; };
  }, [company, days, city]);

  const isLoading = contacts === null || strategies === null || topCities === null;

  const totalContacts = React.useMemo(() => (contacts || []).reduce((s, r) => s + (r.contacts || 0), 0), [contacts]);
  const totalCities = React.useMemo(() => (topCities || []).length, [topCities]);
  const bestStrategy = React.useMemo(() => {
    const data = (strategies || []).filter(r => r.cpl !== null);
    if (data.length === 0) return null;
    return data.reduce((best, cur) => (best.cpl! < cur.cpl! ? best : cur));
  }, [strategies]);

  const companies = [
    { value: "seltka" as CompanyCode, label: "Сэлтка (Кирилл)" },
    { value: "iltech" as CompanyCode, label: "Ильтех (Ильнур)" },
    { value: "mituroom" as CompanyCode, label: "mituroom (Артем)" },
  ];

  return (
    <main style={{ padding: 24, maxWidth: 1400, margin: "0 auto", fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>📈 Avito Аналитика (реальные данные через Supabase RPC)</h1>
      <p style={{ color: '#6c757d', marginBottom: 16 }}>
        Универсальные фильтры: компания, период (в днях), город.
      </p>

      <section style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <label htmlFor="company" style={{ display: 'block', fontSize: 12, color: '#555' }}>Компания</label>
          <select id="company" value={company} onChange={(e) => setCompany(e.target.value as CompanyCode)} style={{ padding: '6px 10px', border: '1px solid #e1e1e1', borderRadius: 6 }}>
            {companies.map(c => (<option key={c.value} value={c.value}>{c.label}</option>))}
          </select>
        </div>
        <div>
          <label htmlFor="days" style={{ display: 'block', fontSize: 12, color: '#555' }}>Дней</label>
          <select id="days" value={days} onChange={(e) => setDays(Number(e.target.value))} style={{ padding: '6px 10px', border: '1px solid #e1e1e1', borderRadius: 6 }}>
            <option value={7}>7</option>
            <option value={14}>14</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
            <option value={90}>90</option>
          </select>
        </div>
        <div>
          <label htmlFor="city" style={{ display: 'block', fontSize: 12, color: '#555' }}>Город (опц.)</label>
          <input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="например, Казань" style={{ padding: '6px 10px', border: '1px solid #e1e1e1', borderRadius: 6 }} />
        </div>
      </section>

      {isLoading && (
        <div style={{ padding: 16, color: '#6c757d' }}>Загрузка данных…</div>
      )}
      {error && (
        <div style={{ padding: 16, color: '#721c24', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 8, marginBottom: 16 }}>
          Ошибка: {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Всего контактов</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{totalContacts.toLocaleString('ru-RU')}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Городов в топ-таблице</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{totalCities}</div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 12, color: '#666' }}>Лучшая стратегия по CPL</div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{bestStrategy ? `${bestStrategy.strategy} (${Math.round((bestStrategy.cpl || 0))} ₽)` : '—'}</div>
            </div>
          </section>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <section>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Топ городов по контактам</h2>
              <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #eee', borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Город</th>
                      <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #eee' }}>Контакты</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(topCities || []).map((r, i) => (
                      <tr key={`${r.city}-${i}`}>
                        <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{r.city}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1', textAlign: 'right' }}>{r.contacts.toLocaleString('ru-RU')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>CPL по стратегиям</h2>
              <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #eee', borderRadius: 8 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Стратегия</th>
                      <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #eee' }}>Контакты</th>
                      <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #eee' }}>Затраты (₽)</th>
                      <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #eee' }}>CPL (₽)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(strategies || []).map((r, i) => (
                      <tr key={`${r.strategy}-${i}`}>
                        <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{r.strategy}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1', textAlign: 'right' }}>{r.contacts.toLocaleString('ru-RU')}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1', textAlign: 'right' }}>{Math.round(r.cost).toLocaleString('ru-RU')}</td>
                        <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1', textAlign: 'right' }}>{r.cpl !== null ? Math.round(r.cpl).toLocaleString('ru-RU') : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          <section style={{ marginTop: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Недавние контакты (последние {days} дн.) {city.trim() ? `— ${city.trim()}` : ''}</h2>
            <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #eee', borderRadius: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Дата</th>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Город</th>
                    <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #eee' }}>Объявление</th>
                    <th style={{ textAlign: 'right', padding: 8, borderBottom: '1px solid #eee' }}>Контакты</th>
                  </tr>
                </thead>
                <tbody>
                  {(contacts || []).map((r, i) => (
                    <tr key={`${r.ad_id}-${r.date}-${i}`}>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{new Date(r.date).toLocaleDateString('ru-RU')}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{r.city}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{r.ad_id}</td>
                      <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1', textAlign: 'right' }}>{r.contacts.toLocaleString('ru-RU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default function AvitoAnalyticsPage() {
  return (
    <Suspense fallback={<div style={{ padding: 32, textAlign: 'center', color: '#6c757d' }}>Загрузка...</div>}>
      <AvitoAnalyticsComponent />
    </Suspense>
  );
}
