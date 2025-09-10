export const dynamic = "force-dynamic";

export default function HomePage() {
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
      </footer>
    </main>
  );
}
