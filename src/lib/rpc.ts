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
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`RPC ${fn} failed: ${res.status} ${text}`);
    // @ts-ignore attach status
    (err as any).status = res.status;
    throw err;
  }
  return res.json();
}

/**
 * Prefer calling `${fn}_v1` first, then fall back to legacy `${fn}` on common PostgREST errors.
 * Fallback if status 404/405 or PostgREST 300 PGRST203 ambiguity is detected.
 */
export async function rpcPreferV1<T>(fn: string, body?: any): Promise<T> {
  const tryCall = async (name: string) => {
    try {
      return await rpc<T>(name, body);
    } catch (e: any) {
      throw e;
    }
  };

  const v1 = `${fn}_v1`;
  try {
    return await tryCall(v1);
  } catch (e: any) {
    const msg = String(e?.message ?? e);
    const status = e?.status;
    const isAmbiguity = msg.includes('PGRST203') || msg.includes('Could not choose the best candidate function');
    const shouldFallback = status === 404 || status === 405 || isAmbiguity;
    if (shouldFallback) {
      return await tryCall(fn);
    }
    throw e;
  }
}
