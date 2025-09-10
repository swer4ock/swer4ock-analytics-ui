export async function rpc<T>(fn: string, body?: any): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/${fn}`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      apikey,
      Authorization: `Bearer ${apikey}`,
      'Content-Type': 'application/json',
      Prefer: 'count=none',
    },
    body: body ? JSON.stringify(body) : '{}',
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RPC ${fn} failed: ${res.status} ${text}`);
  }
  return res.json();
}
