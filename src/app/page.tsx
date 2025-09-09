// src/app/page.tsx
export default function Page() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasUrl = Boolean(url);
  const hasKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>swer4ock analytics — health</h1>
      <ul>
        <li>NEXT_PUBLIC_SUPABASE_URL: {hasUrl ? '✅' : '❌'}</li>
        <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {hasKey ? '✅' : '❌'}</li>
      </ul>
      <p>Страницы: <a href="/assets">/assets</a> · <a href="/pulse">/pulse</a></p>
    </main>
  );
}
