export default function AssetsPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const timestamp = new Date().toISOString();

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Готовые датасеты</h1>
      <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
        <h2>Server-Side Debug Info:</h2>
        <p>Timestamp: {timestamp}</p>
        <p>SUPABASE_URL: {url?.slice(0, 40)}...</p>
        <p>SUPABASE_KEY: {hasKey ? 'Present' : 'Missing'}</p>
        <p>This content is rendered on the server.</p>
      </div>
      <p>Данных пока нет, но сервер работает.</p>
    </main>
  );
}
