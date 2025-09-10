import { rpc } from "../lib/rpc";

export const dynamic = "force-dynamic";

type DevStatus = {
  total_commits: number;
  features_added: number;
  bugs_fixed: number;
  docs_updated: number;
  last_commit_date: string;
  active_tasks: number;
};

type CommitItem = {
  commit_hash: string;
  commit_message: string;
  author_name: string;
  commit_date: string;
  category?: string; // feat|fix|docs|refactor...
};

type CeoRow = {
  active_tasks_count: number | null;
  weekly_financial_flow: number | null;
  new_deals_count: number | null;
  failed_queues_count: number | null;
  most_active_ai_agent: string | null;
  ai_agent_events_count: number | null;
};

async function fetchCeoView(): Promise<CeoRow | undefined> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/v_ceo_dashboard?select=*`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const res = await fetch(url, {
    headers: { apikey, Authorization: `Bearer ${apikey}` },
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const text = await res.text();
    console.error(`Fetch view v_ceo_dashboard failed: ${res.status} ${text}`);
    return undefined;
  }
  const rows = (await res.json()) as CeoRow[];
  return rows?.[0];
}

export default async function HomePage() {
  let status: DevStatus | undefined;
  let commits: CommitItem[] = [];
  let ceo: CeoRow | undefined;
  try {
    const [statusRows, commitRows] = await Promise.all([
      rpc<DevStatus[]>("get_development_status"),
      rpc<CommitItem[]>("get_recent_commits", { p_limit: 8 }),
    ]);
    status = statusRows?.[0];
    commits = commitRows ?? [];
  } catch (e) {
    console.error("Failed to load IT Hub data:", e);
  }
  try {
    ceo = await fetchCeoView();
  } catch (e) {
    console.error("Failed to load CEO view:", e);
  }
  return (
    <main style={{ padding: "24px", maxWidth: 1200, margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{
          fontSize: "48px",
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 16,
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
        }}>
          🚀 Swer4ock Analytics
        </h1>
        <p style={{
          fontSize: "20px",
          color: "#6c757d",
          marginBottom: 8
        }}>
          Аналитическая панель управления проектами
        </p>
        <p style={{
          fontSize: "16px",
          color: "#495057"
        }}>
          IT отдел CRM | Frontend разработчик | Supabase + Vercel
        </p>
      </div>
      
      <section style={{ marginBottom: 48 }}>
        <h2 style={{
          fontSize: "28px",
          color: "#6f42c1",
          textAlign: "center",
          marginBottom: 32
        }}>
          🎯 Быстрая навигация по страницам
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: 20
        }}>
          <a href="/analytics" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #007bff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#007bff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  📊
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    Аналитический дашборд
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /analytics
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Комплексная аналитика с KPI, фильтрами и реальными данными из Supabase.
              </p>
            </div>
          </a>

          <a href="/avito-sales" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #28a745",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#28a745",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  💰
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    Avito Продажи
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /avito-sales
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Анализ продаж по городам, категориям и эффективности. Данные из 4,158 объявлений.
              </p>
            </div>
          </a>

          <a href="/avito-bids" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #fd7e14",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#fd7e14",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  💰
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    Avito Автобиддер
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /avito-bids
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Аналитика автобиддер системы IT отдела. 14,094 ставки с анализом позиций.
              </p>
            </div>
          </a>

          <a href="/analytics-guide" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #6f42c1",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#6f42c1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  📚
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    Руководство по аналитике
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /analytics-guide
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Полное руководство для аналитического отдела по работе с системой.
              </p>
            </div>
          </a>

          {/* Pulse */}
          <a href="/pulse" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #dc3545",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#dc3545",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  ⚡
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    Ads Pulse
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /pulse
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Реал-тайм мониторинг объявлений с автоматическим обновлением данных.
              </p>
            </div>
          </a>

          {/* Dashboard */}
          <a href="/dashboard" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #6c757d",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#6c757d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  🧭
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    Основной дашборд (MVP)
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /dashboard
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Центральная панель аналитики с быстрыми ссылками.
              </p>
            </div>
          </a>

          {/* Analytics Dashboard (advanced) */}
          <a href="/analytics-dashboard" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #007bff",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#007bff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  📈
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    Расширенная аналитика
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /analytics-dashboard
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Продвинутые аналитические инструменты и визуализации.
              </p>
            </div>
          </a>

          {/* Avito Analytics */}
          <a href="/avito" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #e83e8c",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#e83e8c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  📊
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    Avito Аналитика
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /avito
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Комплексный анализ объявлений Avito с реальными данными из Supabase.
              </p>
            </div>
          </a>

          {/* Instruments */}
          <a href="/instruments" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #17a2b8",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#17a2b8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  🛠️
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    Инструменты
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /instruments
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Утилиты для работы с данными и настройками системы.
              </p>
            </div>
          </a>

          {/* IT Dashboard */}
          <a href="/it-dashboard" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #6f42c1",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#6f42c1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  👥
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    IT Dashboard
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /it-dashboard
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Внутренняя панель для команды IT: статус, метрики, задачи.
              </p>
            </div>
          </a>

          {/* CEO Dashboard */}
          <a href="/ceo-dashboard" style={{ textDecoration: "none" }}>
            <div style={{
              padding: 24,
              backgroundColor: "#f8f9fa",
              borderRadius: 16,
              border: "2px solid #20c997",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer",
              height: "100%"
            }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: "#20c997",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                  color: "white",
                  fontSize: "24px"
                }}>
                  🧠
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#2c3e50" }}>
                    CEO Dashboard
                  </h3>
                  <p style={{ margin: 4, fontSize: "12px", color: "#6c757d" }}>
                    /ceo-dashboard
                  </p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#495057", lineHeight: 1.4, fontSize: "14px" }}>
                Пульс бизнеса: активные задачи, сделки, поток, AI события.
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* Бизнес пульс (CEO) */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, color: '#20c997', marginBottom: 12 }}>🧠 Бизнес пульс</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12
        }}>
          <div style={{ padding: 16, background: '#e7f3ff', border: '1px solid #b8daff', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6c757d' }}>Активных задач</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#0056b3' }}>{ceo?.active_tasks_count ?? '—'}</div>
          </div>
          <div style={{ padding: 16, background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6c757d' }}>Денежный поток (7д)</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#856404' }}>{ceo?.weekly_financial_flow?.toLocaleString('ru-RU') ?? '—'} ₽</div>
          </div>
          <div style={{ padding: 16, background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6c757d' }}>Новые сделки (7д)</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#155724' }}>{ceo?.new_deals_count ?? '—'}</div>
          </div>
          <div style={{ padding: 16, background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 12 }}>
            <div style={{ fontSize: 12, color: '#6c757d' }}>Горящих задач</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#721c24' }}>{ceo?.failed_queues_count ?? '—'}</div>
          </div>
        </div>
        <div style={{ marginTop: 10 }}>
          <a href="/ceo-dashboard" style={{ color: '#20c997', textDecoration: 'underline' }}>Открыть CEO Dashboard →</a>
        </div>
      </section>

      {/* IT Hub Section */}
      <section style={{ marginBottom: 48 }}>
        <h2 style={{
          fontSize: "28px",
          color: "#20c997",
          textAlign: "center",
          marginBottom: 24
        }}>
          👥 IT Hub — статус разработки
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20
        }}>
          {/* Dev Status KPIs */}
          <div style={{
            padding: 24,
            backgroundColor: "#f8f9fa",
            borderRadius: 16,
            border: "1px solid #e9ecef",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 12, color: "#2c3e50" }}>📈 Статус разработки</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ background: '#e7f3ff', border: '1px solid #b8daff', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6c757d' }}>Коммитов</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#0056b3' }}>{status?.total_commits ?? '—'}</div>
              </div>
              <div style={{ background: '#d4edda', border: '1px solid #c3e6cb', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6c757d' }}>Фич</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#155724' }}>{status?.features_added ?? '—'}</div>
              </div>
              <div style={{ background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6c757d' }}>Фиксов</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#721c24' }}>{status?.bugs_fixed ?? '—'}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 12 }}>
              <div style={{ background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6c757d' }}>Документация</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#856404' }}>{status?.docs_updated ?? '—'}</div>
              </div>
              <div style={{ background: '#f0f2f5', border: '1px solid #e9ecef', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6c757d' }}>Активных задач</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#2c3e50' }}>{status?.active_tasks ?? '—'}</div>
              </div>
              <div style={{ background: '#f0f2f5', border: '1px solid #e9ecef', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6c757d' }}>Последний коммит</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#2c3e50' }}>{status?.last_commit_date ? new Date(status.last_commit_date).toLocaleString('ru-RU') : '—'}</div>
              </div>
            </div>
          </div>

          {/* Recent commits */}
          <div style={{
            padding: 24,
            backgroundColor: "#f8f9fa",
            borderRadius: 16,
            border: "1px solid #e9ecef",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 12, color: "#2c3e50" }}>📝 Последние коммиты</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(commits && commits.length > 0 ? commits : []).slice(0, 8).map((c, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: '#ffffff', border: '1px solid #e9ecef', borderRadius: 8 }}>
                  <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: '#e7f3ff', color: '#0056b3', fontWeight: 600 }}>{(c.category ?? 'commit').toUpperCase()}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, color: '#2c3e50', fontWeight: 600, marginBottom: 2 }}>{c.commit_message}</div>
                    <div style={{ fontSize: 12, color: '#6c757d' }}>{c.author_name} • {new Date(c.commit_date).toLocaleString('ru-RU')}</div>
                  </div>
                  <code style={{ fontSize: 11, color: '#6c757d' }}>{c.commit_hash?.slice(0, 7)}</code>
                </div>
              ))}
              {(!commits || commits.length === 0) && (
                <div style={{ padding: 12, border: '1px dashed #e9ecef', borderRadius: 8, color: '#6c757d', textAlign: 'center' }}>
                  Нет данных о коммитах
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer style={{
        padding: 32,
        backgroundColor: "#2c3e50",
        color: "white",
        borderRadius: 16,
        textAlign: "center"
      }}>
        <h3 style={{ marginBottom: 16 }}>🎯 Swer4ock Analytics Platform</h3>
        <p style={{ marginBottom: 20, opacity: 0.8 }}>
          Профессиональная аналитика для бизнеса | IT отдел CRM
        </p>
        <div style={{ fontSize: "12px", opacity: 0.6 }}>
          © 2025 IT отдел CRM | Frontend разработчик | Все ссылки на дашборды доступны выше
        </div>
        <div style={{ marginTop: 12 }}>
          <a href="/health" style={{
            display: 'inline-block',
            padding: '8px 12px',
            borderRadius: 8,
            background: '#20c997',
            color: 'white',
            textDecoration: 'none',
            fontSize: 12,
          }}>🩺 Открыть Health Check</a>
        </div>
      </footer>
    </main>
  );
}
