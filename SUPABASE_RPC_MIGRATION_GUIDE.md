# 🔄 Supabase RPC Migration Guide - Переход на v1 Wrappers

## 🎯 Проблема: PostgREST Function Overloading

PostgREST не может обрабатывать перегруженные функции (одинаковые имена, разные параметры) через REST API.

**Ошибка PGRST203:**
```json
{
  "code": "PGRST203",
  "message": "Could not choose the best candidate function between: public.get_analytics_summary(), public.get_analytics_summary(p_date_from => date, p_date_to => date, p_cities => text[])",
  "hint": "Try renaming the parameters or the function itself in the database so function overloading can be resolved"
}
```

---

## 🛠️ Решение: v1 Wrapper Functions

### 1. SQL Migration Template

```sql
-- Создание v1-обёрток для устранения перегрузок
-- Файл: supabase_rpc_wrappers_v1.sql

-- 1) Обёртка для функции без параметров
CREATE OR REPLACE FUNCTION public.get_analytics_summary_v1()
RETURNS TABLE (
  total_ads bigint,
  total_cities bigint,
  total_contacts bigint,
  avg_conversion numeric,
  refreshed_at timestamptz
) SECURITY DEFINER LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT s.total_ads, s.total_cities, s.total_contacts, s.avg_conversion, s.refreshed_at
  FROM public.get_analytics_summary() s;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_analytics_summary_v1() TO anon;

-- 2) Обёртка для функции с параметрами
CREATE OR REPLACE FUNCTION public.get_city_performance_v1(
  p_limit int DEFAULT 20,
  p_date_from date DEFAULT null,
  p_date_to date DEFAULT null
)
RETURNS TABLE (
  city text,
  impressions bigint,
  views bigint,
  contacts bigint,
  view_to_contact numeric
) SECURITY DEFINER LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT c.city, c.impressions, c.views, c.contacts, c.view_to_contact
  FROM public.get_city_performance(p_limit, p_date_from, p_date_to) c;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_city_performance_v1(int, date, date) TO anon;

-- 3) Обёртка для сложной функции
CREATE OR REPLACE FUNCTION public.get_strategy_monitoring_v1(
  p_limit int DEFAULT 50,
  p_date_from date DEFAULT null,
  p_date_to date DEFAULT null,
  p_cities text[] DEFAULT null
)
RETURNS TABLE (
  strategy_type text,
  ads_count bigint,
  avg_cost_per_contact numeric,
  avg_conversion numeric
) SECURITY DEFINER LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT s.strategy_type, s.ads_count, s.avg_cost_per_contact, s.avg_conversion
  FROM public.get_strategy_monitoring(p_limit, p_date_from, p_date_to, p_cities) s;
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_strategy_monitoring_v1(int, date, date, text[]) TO anon;
```

### 2. Rollback Commands

```sql
-- Откат изменений (если нужно)
DROP FUNCTION IF EXISTS public.get_analytics_summary_v1();
DROP FUNCTION IF EXISTS public.get_city_performance_v1(int, date, date);
DROP FUNCTION IF EXISTS public.get_strategy_monitoring_v1(int, date, date, text[]);
```

---

## 🔧 Frontend Integration

### 1. RPC Helper с Fallback

```typescript
// src/lib/rpc.ts
export async function rpcPreferV1<T>(fn: string, body?: any): Promise<T> {
  try {
    // Сначала пробуем v1 версию
    return await rpc<T>(`${fn}_v1`, body);
  } catch (e: any) {
    // При ошибках 404/405/PGRST203 - fallback на legacy
    if (e.message?.includes('404') || 
        e.message?.includes('405') || 
        e.message?.includes('PGRST203') ||
        e.message?.includes('300')) {
      console.warn(`v1 RPC failed, falling back to legacy: ${fn}`);
      return await rpc<T>(fn, body);
    }
    throw e; // Прочие ошибки пробрасываем
  }
}

export async function rpc<T>(fn: string, body?: any): Promise<T> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/${fn}`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': apikey,
      'Authorization': `Bearer ${apikey}`,
      'Content-Type': 'application/json',
      'Prefer': 'count=none',
    },
    body: body ? JSON.stringify(body) : '{}',
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RPC ${fn} failed: ${res.status} ${text}`);
  }
  return res.json();
}
```

### 2. Использование в компонентах

```typescript
// Старый код (с ошибками)
const summary = await rpc('get_analytics_summary'); // PGRST203 error

// Новый код (с v1 fallback)
const summary = await rpcPreferV1('get_analytics_summary');
const cities = await rpcPreferV1('get_city_performance', { p_limit: 20 });
const strategies = await rpcPreferV1('get_strategy_monitoring', { p_limit: 50 });
```

---

## 🩺 Health Check Integration

### Health Page Template

```typescript
'use client';

export default function HealthPage() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  // Проверяем и v1, и legacy версии
  const results = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", pass: env.NEXT_PUBLIC_SUPABASE_URL },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", pass: env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    // v1 функции
    { name: "get_analytics_summary_v1", pass: true }, // статус после миграции
    { name: "get_city_performance_v1", pass: true },
    { name: "get_strategy_monitoring_v1", pass: true },
    // Legacy функции (для сравнения)
    { name: "get_analytics_summary", pass: false }, // PGRST203 expected
    { name: "get_avito_sales_summary", pass: true }, // работает (нет перегрузок)
  ];

  const allOk = env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return (
    <main>
      <h1>🩺 Health Check</h1>
      <span>{allOk ? 'OK' : 'ISSUES'}</span>
      <div>
        {results.map((r, i) => (
          <div key={i}>
            <span style={{ color: r.pass ? 'green' : 'red' }}>●</span>
            {r.name}
          </div>
        ))}
      </div>
    </main>
  );
}
```

---

## 📋 Migration Checklist

### Pre-Migration
- [ ] Выявить все перегруженные RPC функции
- [ ] Создать список функций для v1-обёрток
- [ ] Подготовить SQL migration script
- [ ] Обновить frontend RPC helper

### Migration Process
- [ ] Применить SQL migration в Supabase
- [ ] Проверить `GRANT EXECUTE TO anon` для всех v1 функций
- [ ] Обновить frontend код на `rpcPreferV1()`
- [ ] Обновить Health Check page
- [ ] Деплой и тестирование

### Post-Migration
- [ ] Проверить Health Check = зелёный статус
- [ ] Проверить все страницы загружаются без ошибок
- [ ] Мониторинг логов на PGRST203 ошибки
- [ ] Документировать изменения

---

## 🔄 Versioning Strategy

### v1 → v2 Migration

Когда нужно изменить контракт функции:

```sql
-- Создаём v2 с новым контрактом
CREATE FUNCTION get_analytics_summary_v2(
  p_include_archived boolean DEFAULT false
) RETURNS TABLE (...) AS $$
  -- новая логика
$$;

-- v1 остаётся для обратной совместимости
-- Frontend постепенно переходит на v2
```

### Deprecation Process

1. **Создать v2** с новым контрактом
2. **Обновить frontend** на v2 постепенно
3. **Отметить v1 как deprecated** (через 3 месяца)
4. **Удалить v1** (через 6 месяцев)

---

## 🚨 Troubleshooting

### Ошибка: "function not found"
```bash
# Проверить, что функция создана
SELECT proname, pg_get_function_identity_arguments(oid) 
FROM pg_proc 
WHERE proname LIKE '%_v1';

# Проверить права доступа
SELECT grantee, privilege_type 
FROM information_schema.routine_privileges 
WHERE routine_name LIKE '%_v1';
```

### Ошибка: "still getting PGRST203"
```bash
# Убедиться, что используется rpcPreferV1()
# Проверить, что v1 функция не перегружена
# Проверить логи Supabase на детали ошибки
```

---

## 📞 Support & Escalation

**Immediate Actions:**
1. Проверить `/health` страницу проекта
2. Проверить Supabase Function logs
3. Проверить Vercel deployment logs

**Escalation Path:**
1. **Frontend Issue** → Проверить `rpcPreferV1()` usage
2. **Database Issue** → Связаться с DBA для SQL migration
3. **Infrastructure Issue** → Проверить Supabase status page

---

*Migration Guide v1.0 - 10.09.2025*  
*IT Отдел CRM*
