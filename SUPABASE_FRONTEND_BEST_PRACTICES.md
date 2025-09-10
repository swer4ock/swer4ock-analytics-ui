# 📚 Supabase Frontend Best Practices - IT Отдел

## 🎯 Цель документа

Руководство для фронтенд-разработчиков по работе с Supabase, предотвращению ошибок SSR и созданию стабильных приложений.

---

## 🚨 КРИТИЧЕСКИЕ ПРОБЛЕМЫ И РЕШЕНИЯ

### 1. PostgREST Overloading (PGRST203)

**Проблема:** PostgREST не может выбрать функцию при перегрузке (одинаковые имена, разные параметры).

```sql
-- ❌ ПРОБЛЕМА: Перегруженные функции
CREATE FUNCTION get_analytics_summary();
CREATE FUNCTION get_analytics_summary(p_date_from date, p_date_to date);

-- PostgREST не знает, какую вызывать через REST API
```

**Решение:** Создавать явные v1-обёртки без перегрузок.

```sql
-- ✅ РЕШЕНИЕ: Явные обёртки
CREATE FUNCTION get_analytics_summary_v1() 
RETURNS TABLE(...) AS $$
  SELECT * FROM get_analytics_summary();  -- вызов конкретной версии
$$;
GRANT EXECUTE ON FUNCTION get_analytics_summary_v1() TO anon;
```

**Фронтенд-код:**
```typescript
// ✅ Правильно: используем v1 с фоллбеком
import { rpcPreferV1 } from '../lib/rpc';
const data = await rpcPreferV1('get_analytics_summary');

// ❌ Неправильно: прямой вызов перегруженной функции
const data = await rpc('get_analytics_summary'); // PGRST203 error
```

---

### 2. SSR Таймауты и Server-Side Exceptions

**Проблема:** Долгие RPC вызовы блокируют SSR, вызывая таймауты и 500 ошибки.

```typescript
// ❌ ПРОБЛЕМА: SSR с долгими RPC вызовами
export const dynamic = 'force-dynamic';
export default async function Page() {
  const data = await rpc('slow_function'); // может висеть 30+ секунд
  return <div>{data}</div>;
}
```

**Решение:** Client-side рендеринг с loading states.

```typescript
// ✅ РЕШЕНИЕ: Client-side с loading
'use client';
import { useEffect, useState } from 'react';

export default function Page() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await rpc('slow_function');
        setData(result);
      } catch (e) {
        console.error(e);
        setData([]); // fallback
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div>Загрузка...</div>;
  return <div>{data}</div>;
}
```

---

## 🔧 ОБЯЗАТЕЛЬНЫЕ ИНСТРУМЕНТЫ

### 1. RPC Helper с v1 Fallback

**Файл:** `src/lib/rpc.ts`

```typescript
export async function rpcPreferV1<T>(fn: string, body?: any): Promise<T> {
  try {
    // Сначала пробуем v1
    return await rpc<T>(`${fn}_v1`, body);
  } catch (e: any) {
    // При 404/405/PGRST203 - фоллбек на legacy
    if (e.message?.includes('404') || 
        e.message?.includes('405') || 
        e.message?.includes('PGRST203')) {
      return await rpc<T>(fn, body);
    }
    throw e;
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
    cache: 'no-store', // КРИТИЧНО для SSR
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RPC ${fn} failed: ${res.status} ${text}`);
  }
  return res.json();
}
```

### 2. Health Check Page

**Обязательно для каждого проекта:** `/health`

```typescript
'use client'; // Статический рендер для быстрой загрузки

export default function HealthPage() {
  const env = {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  // Проверки RPC, VIEW, ENV
  const results = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", pass: env.NEXT_PUBLIC_SUPABASE_URL },
    { name: "NEXT_PUBLIC_SUPABASE_ANON_KEY", pass: env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
    // Добавить проверки ваших RPC функций
  ];

  const allOk = results.every(r => r.pass);
  
  return (
    <main>
      <h1>🩺 Health Check</h1>
      <span>{allOk ? 'OK' : 'ISSUES'}</span>
      {/* Отображение результатов */}
    </main>
  );
}
```

---

## 📋 ПРАВИЛА РАЗРАБОТКИ

### 1. Выбор SSR vs Client-Side

**SSR (Server-Side Rendering):**
```typescript
export const dynamic = 'force-dynamic';
export default async function Page() {
  // ✅ Используйте для:
  // - Быстрых VIEW запросов (< 2 сек)
  // - Статических данных
  // - SEO-критичных страниц
}
```

**Client-Side:**
```typescript
'use client';
export default function Page() {
  // ✅ Используйте для:
  // - Долгих RPC вызовов (> 2 сек)
  // - Интерактивных компонентов
  // - Страниц с loading states
}
```

### 2. Обработка ошибок

```typescript
// ✅ Всегда предусматривайте fallback
try {
  const data = await rpcPreferV1('get_data');
  setData(data);
} catch (e) {
  console.error('RPC error:', e);
  setData([]); // Пустой массив вместо crash
}
```

### 3. Environment Variables

```bash
# ✅ Только NEXT_PUBLIC_* для фронтенда
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# ❌ Секретные ключи НЕ используем на фронте
SUPABASE_SERVICE_ROLE_KEY=xxx # Только для backend
```

---

## 🗂️ СТРУКТУРА ПРОЕКТА

```
src/
├── lib/
│   └── rpc.ts              # RPC helper с v1 fallback
├── app/
│   ├── health/
│   │   └── page.tsx        # Health check (обязательно)
│   ├── page.tsx            # Главная (SSR)
│   └── dashboard/
│       └── page.tsx        # Client-side с loading
└── components/
    └── ui/                 # Переиспользуемые компоненты
```

---

## 🔄 WORKFLOW ДЛЯ НОВЫХ RPC

### 1. Backend (DBA)
```sql
-- Создать v1-обёртку без перегрузок
CREATE FUNCTION my_new_function_v1(p_param int)
RETURNS TABLE(...) AS $$
  SELECT * FROM my_new_function(p_param);
$$;
GRANT EXECUTE ON FUNCTION my_new_function_v1(int) TO anon;
```

### 2. Frontend
```typescript
// Использовать rpcPreferV1
const data = await rpcPreferV1('my_new_function', { p_param: 123 });
```

### 3. Health Check
```typescript
// Добавить проверку в /health
{ name: "my_new_function_v1", pass: await checkRpc("my_new_function_v1") }
```

---

## 🚨 ЧЕКЛИСТ ПЕРЕД ДЕПЛОЕМ

- [ ] Все RPC используют `rpcPreferV1()` или имеют v1-обёртки
- [ ] Долгие операции переведены на Client-side
- [ ] ENV переменные настроены в Vercel
- [ ] Health check показывает зелёный статус
- [ ] `npm run build` проходит без ошибок
- [ ] Все страницы открываются без таймаутов

---

## 📞 КОНТАКТЫ И ПОДДЕРЖКА

**IT Отдел CRM:**
- Health Check: `/health` на каждом проекте
- Документация: `FRONTEND_RUNBOOK.md`
- Отчёты: ежедневно в 18:00, еженедельно в пятницу

**Escalation Path:**
1. Проверить `/health` страницу
2. Проверить Vercel логи
3. Проверить Supabase RPC статус
4. Связаться с DBA для SQL-обёрток

---

*Документ создан: 10.09.2025*  
*Версия: 1.0*  
*Следующее обновление: По мере развития проекта*
