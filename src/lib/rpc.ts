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

// Avito Analytics RPC helpers
export async function rpcGetAvitoContacts(params?: { p_company?: string; p_days?: number; p_city?: string }) {
  return rpcPreferV1<{ ad_id: string; city: string; contacts: number; date: string }[]>('get_avito_contacts', params);
}

export async function rpcGetCplByStrategy(params?: { p_company?: string; p_days?: number }) {
  return rpcPreferV1<{ strategy: string; contacts: number; cost: number; cpl: number }[]>('get_avito_cpl_by_strategy', params);
}

export async function rpcGetTopCitiesSales(params?: { p_limit?: number }) {
  return rpcPreferV1<{ city: string; contacts: number }[]>('get_avito_top_cities_sales', params);
}

export async function rpcGetUnifiedAdsPerformance(params?: { p_company?: string; p_limit?: number }) {
  return rpcPreferV1<{
    ad_id: string;
    title: string;
    city: string;
    category: string;
    views: number;
    contacts: number;
    conversion_rate: number;
    current_bid: number;
    recommended_bid: number;
    bid_efficiency: number;
    cost: number;
    cpl: number;
    roi_score: number;
    profitability_rank: number;
  }[]>('get_unified_ads_performance', params);
}

export async function rpcGetPositionsAnalysis(params?: { p_limit?: number }) {
  return rpcPreferV1<{
    category: string;
    ads_count: number;
    total_views: number;
    total_contacts: number;
    avg_conversion_rate: number;
    avg_cpl: number;
    total_cost: number;
    avg_bid_efficiency: number;
    category_score: number;
  }[]>('get_avito_positions_analysis', params);
}

export async function rpcGetGeoProfitability(params?: { p_company?: string; p_limit?: number }) {
  return rpcPreferV1<{
    city: string;
    ads_count: number;
    total_contacts: number;
    avg_conversion_rate: number;
    avg_cpl: number;
    market_potential_score: number;
    competition_level: string;
  }[]>('get_geo_profitability_analysis', params);
}

export async function rpcGetRecommendations(params?: { p_company?: string; p_limit?: number }) {
  return rpcPreferV1<{
    ad_id: string;
    title: string;
    city: string;
    issue_type: string;
    current_value: number;
    recommended_action: string;
    potential_improvement: string;
    priority_level: string;
  }[]>('get_optimization_recommendations', params);
}
