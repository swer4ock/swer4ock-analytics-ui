export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <main style={{padding: 24}}>
      <h1>🚀 Оперативная сводка (MVP)</h1>
      <p>Если ты видишь этот текст на проде — рутинг работает, деплой обновился.</p>
      <div style={{marginTop: 20, padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8}}>
        <h2>Статус системы:</h2>
        <ul>
          <li>✅ Next.js маршрутизация работает</li>
          <li>✅ Vercel деплой обновился</li>
          <li>⏳ Supabase интеграция (в разработке)</li>
        </ul>
      </div>
    </main>
  );
}
