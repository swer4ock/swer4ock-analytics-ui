export const dynamic = 'force-dynamic';

export default function InstrumentsPage() {
  return (
    <main style={{padding: 24}}>
      <h1>🔧 Инструменты анализа (MVP)</h1>
      <p>Стартовая страница для детальных таблиц и фильтров.</p>
      <div style={{marginTop: 20, padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8}}>
        <h2>Планируемый функционал:</h2>
        <ul>
          <li>📊 Детальная таблица всех объявлений</li>
          <li>🔍 Фильтрация по городам</li>
          <li>📈 Сортировка по метрикам</li>
          <li>🎨 Цветовые индикаторы эффективности</li>
        </ul>
      </div>
    </main>
  );
}
