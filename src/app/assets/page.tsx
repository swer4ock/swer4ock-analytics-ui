// src/app/assets/page.tsx

async function getDiagnostics() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let rawResponse = '';
  let responseStatus = 0;
  let responseData = null;
  let fetchError = null;

  if (!url || !key) {
    return {
      envUrl: url ?? 'MISSING',
      envKey: key ? 'Exists' : 'MISSING',
      rawResponse: 'Cannot fetch without environment variables.',
      responseStatus: 0,
      responseData: null,
      fetchError: 'Missing environment variables'
    };
  }

  try {
    const res = await fetch(`${url}/rest/v1/rpc/hello_world`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });
    responseStatus = res.status;
    rawResponse = await res.text();
    
    // Try to parse JSON only if response is likely JSON
    if (res.headers.get('content-type')?.includes('application/json')) {
        responseData = JSON.parse(rawResponse);
    }

  } catch (e: any) {
    fetchError = e.message;
  }

  return { envUrl: url, envKey: 'Exists', rawResponse, responseStatus, responseData, fetchError };
}

export default async function AssetsPage() {
  const diagnostics = await getDiagnostics();

  return (
    <main style={{ padding: 24, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      <h1>Vercel Environment & Fetch Diagnostics</h1>
      
      <h2>Environment Variables:</h2>
      <p>NEXT_PUBLIC_SUPABASE_URL: {diagnostics.envUrl.slice(0, 40)}...</p>
      <p>NEXT_PUBLIC_SUPABASE_ANON_KEY: {diagnostics.envKey}</p>

      <h2>Fetch Attempt:</h2>
      <p>Status Code: {diagnostics.responseStatus}</p>
      {diagnostics.fetchError && <p>Fetch Error: <span style={{color: 'red'}}>{diagnostics.fetchError}</span></p>}
      
      <h2>Raw API Response:</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', background: '#f5f5f5' }}>
        {diagnostics.rawResponse || 'No response body'}
      </div>

      <h2>Parsed JSON Data:</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', background: '#f5f5f5' }}>
        {JSON.stringify(diagnostics.responseData, null, 2) || 'No JSON data parsed'}
      </div>
    </main>
  );
}
