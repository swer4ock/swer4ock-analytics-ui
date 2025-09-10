-- RPC wrappers to avoid PostgREST overloading (PGRST203)
-- Safe, backward-compatible, can be rolled back by `drop function ...`.
-- Apply on Supabase (Production) and grant EXECUTE to anon.

begin;

-- 1) KPI summary (no-args)
create or replace function public.get_analytics_summary_v1()
returns table (
  total_ads int,
  total_cities int,
  total_contacts int,
  avg_conversion numeric,
  refreshed_at timestamptz
) security definer language sql as $$
  select
    total_ads,
    total_cities,
    total_contacts,
    avg_conversion,
    refreshed_at
  from public.get_analytics_summary();
$$;
grant execute on function public.get_analytics_summary_v1() to anon;

-- 2) City performance (with optional dates)
create or replace function public.get_city_performance_v1(
  p_limit int default 20,
  p_date_from date default null,
  p_date_to date default null
)
returns table (
  city text,
  impressions int,
  views int,
  contacts int,
  view_to_contact numeric
) security definer language sql as $$
  select * from public.get_city_performance(p_limit, p_date_from, p_date_to);
$$;
grant execute on function public.get_city_performance_v1(int, date, date) to anon;

-- 3) Strategy monitoring (with optional filters)
create or replace function public.get_strategy_monitoring_v1(
  p_limit int default 50,
  p_date_from date default null,
  p_date_to date default null,
  p_cities text[] default null
)
returns table (
  strategy_type text,
  ads_count int,
  avg_cost_per_contact numeric,
  avg_conversion numeric
) security definer language sql as $$
  select * from public.get_strategy_monitoring(p_limit, p_date_from, p_date_to, p_cities);
$$;
grant execute on function public.get_strategy_monitoring_v1(int, date, date, text[]) to anon;

commit;

-- Rollback (manual):
-- drop function if exists public.get_analytics_summary_v1();
-- drop function if exists public.get_city_performance_v1(int, date, date);
-- drop function if exists public.get_strategy_monitoring_v1(int, date, date, text[]);
