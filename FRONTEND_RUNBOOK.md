# 🧭 Runbook: как фронтендеру работать с проектом

## 0) Контексты и ссылки

**GitHub (репозиторий фронта):**
https://github.com/swer4ock/swer4ock-analytics-ui

**Прод:**
https://swer4ock-analytics-ui-seven.vercel.app

**Vercel (проект):**
https://vercel.com/marsels-projects/swer4ock-analytics-ui

**Supabase (этот фронт только читает через RPC/REST):**
URL и ключ брать из переменных окружения (см. ниже).

## 1) Роли и границы ответственности

**Фронт:** создаёт/правит страницы, вызывает существующие RPC/Views через REST или @supabase/supabase-js, добавляет фильтры/графики/таблицы, пишет UI/UX.

**Бэкенд/База:** добавляет новые RPC-функции, правит RLS, меняет схемы, оптимизирует SQL.

Если фронту не хватает данных/полей → создаёт issue "RPC request" (шаблон ниже) — не лезет в БД.

## 2) Быстрый старт (локально)

```bash
# 1) клонируем
git clone https://github.com/swer4ock/swer4ock-analytics-ui.git
cd swer4ock-analytics-ui

# 2) ставим зависимости
npm i

# 3) создаём .env.local
cp .env.example .env.local
# и заполняем:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 4) старт
npm run dev
# http://localhost:3000
```

**Важно:** переменные окружения только:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3) Ветки, коммиты, деплой

**Фича-ветки:** `feature/<slug>` (напр., `feature/analytics-filters`)

**Коммиты:** `feat: ...`, `fix: ...`, `chore: ...`

**Пулл-реквест** в `main`. После мёрджа Vercel деплоит автоматически.

Если нужен ручной деплой:
https://vercel.com/marsels-projects/swer4ock-analytics-ui → Deployments → Redeploy (Clear build cache).

## 4) Данные: только через RPC (готовые контракты)

Фронт вызывает готовые RPC. Если их нет — создаём запрос на бэкенд (см. п.7).

### 4.1 RPC: get_analytics_summary

**Назначение:** KPI для карточек на странице.

**Вызов (REST):**
```
POST {NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_analytics_summary
Headers:
  apikey: {NEXT_PUBLIC_SUPABASE_ANON_KEY}
  Authorization: Bearer {NEXT_PUBLIC_SUPABASE_ANON_KEY}
  Content-Type: application/json
Body: {}
```

**Пример ответа:**
```json
{
  "total_ads": 209,
  "total_cities": 28,
  "total_contacts": 84,
  "avg_conversion": 0.67,
  "refreshed_at": "2025-09-08T10:21:00Z"
}
```

### 4.2 RPC: get_city_performance

**Назначение:** таблица топ-городов.

**Параметры (опционально):** `from_date`, `to_date`, `limit`

**Пример запроса (REST):**
```
POST .../rpc/get_city_performance
Body: {"from_date":"2025-08-01","to_date":"2025-09-08","limit":20}
```

**Пример ответа (массив):**
```json
[
  {"city":"Казань","contacts":13,"impressions":4650,"views":520,"view_to_contact":1.1},
  {"city":"Набережные Челны","contacts":6,"impressions":2100,"views":250,"view_to_contact":0.8}
]
```

### 4.3 RPC: get_strategy_monitoring

**Назначение:** эффективность автобиддера по стратегиям.

**Пример ответа:**
```json
[
  {"strategy_type":"priority","ads_count":72,"avg_cost_per_contact":480,"avg_conversion":1.05},
  {"strategy_type":"standard","ads_count":91,"avg_cost_per_contact":530,"avg_conversion":0.92}
]
```

⚠️ **Если фронту нужны новые параметры (фильтры/сортировки)** — см. п.7 (issue на бэкенд).

## 5) Как вызывать RPC в коде (два варианта)

### Вариант A. Через Supabase JS (клиентский компонент)
```tsx
"use client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchSummary() {
  const { data, error } = await supabase.rpc("get_analytics_summary");
  if (error) throw error;
  return data;
}
```

### Вариант B. Прямой REST fetch (SSR/клиент)
```tsx
const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_city_performance`;
const res = await fetch(url, {
  method: "POST",
  headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ limit: 20 }),
  cache: "no-store", // важно, чтобы не залипало в кэше
});
const data = await res.json();
```

## 6) Страницы и маршруты (минимум для MVP)

- `/` — health: показать `NEXT_PUBLIC_SUPABASE_URL` (часть), пинг RPC
- `/analytics` — основная аналитика:
  - KPI карточки (ответ `get_analytics_summary`)
  - Таблица городов (ответ `get_city_performance`)
  - Таблица стратегий (ответ `get_strategy_monitoring`)

**Все страницы рендерим без кэша:**
```tsx
export const dynamic = "force-dynamic";
```

## 7) Как правильно просить бэкенд «добавить данные» (шаблон issue)

Создаём issue в https://github.com/swer4ock/swer4ock-analytics-ui или в трекере задач, заголовок:

```
RPC Request: get_city_performance — add filters (city, strategy, date range)
```

**Описание:**
```
Зачем: нужен фильтр в интерфейсе по городам и датам
Нужно в ответе: city, impressions, views, contacts, conversion_pct, cost_per_contact
Параметры RPC:
cities text[] NULL,
from_date date NULL,
to_date date NULL,
strategy_type text NULL
Приоритет: P2
Дедлайн: 2 дня
Скрин: (куда это попадёт на UI)
```

После готовности бэкенд пометит issue `done` + приложит пример вызова.

## 8) Тест-чеклист перед пушем

- ✅ `npm run lint && npm run build` — без ошибок
- ✅ Локально открываются `/` и `/analytics`
- ✅ RPC ответы обрабатываются при пустых данных (показываем "Нет данных")
- ✅ Нет тайных ключей в клиентском коде (используем только `NEXT_PUBLIC_*`)
- ✅ UI не ломается на мобильном (Tailwind responsive)

## 9) Три частые ошибки и как их обходить

**Билд на Vercel падает из-за API route**
- Удалить/починить проблемный `app/api/.../route.ts` перед мёрджем в `main`
- Проверить логи в Vercel → Deployments → конкретный билд

**RPC возвращает 401/403**
- Проверить переменные окружения в Vercel → Project → Settings → Environment Variables
- Убедиться, что RPC имеет `SECURITY DEFINER` и разрешён для `anon`

**На проде пусто, локально ок**
- На Vercel сделать Redeploy с Clear build cache
- Убедиться, что вызовы помечены `cache: "no-store"` или `dynamic = "force-dynamic"`

## 10) Как обновить прод

Мёрдж в `main` → Vercel сам задеплоит.

Если нужно руками:
https://vercel.com/marsels-projects/swer4ock-analytics-ui → Deployments → Redeploy → Clear build cache.

## 11) Что делать, если требуется «ещё вчера»

**Быстрая заглушка:** отрисовать страницу с мок-данными (json), затем заменить вызовом RPC.

Если «горит» по данным — заводим параллельно задачу на бэкенд (см. п.7) и ставим флаг в UI "данные загружаются, в финализации".

## 12) Контакты внутри проекта

**Vercel проект (деплой/логи):**
https://vercel.com/marsels-projects/swer4ock-analytics-ui

**GitHub (код/issue):**
https://github.com/swer4ock/swer4ock-analytics-ui

## 13) Health Check (/health) и отчетность IT

### /health — страница здоровья системы
- Маршрут: `/health`
- Проверяет ENV: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Проверяет RPC: `get_development_status`, `get_recent_commits`, `get_analytics_summary`, `get_city_performance`, `get_strategy_monitoring`,## 🩺 HEALTH / ПОЛИТИКА RPC V1
  
  **Принципы:**
  - Всегда иметь страницу `/health` для распознавания проблем сразу (ENV, RPC, VIEW).
  - Для RPC, вызываемых фронтендом, использовать явные обёртки без перегрузок: `*_v1`.
  - При изменении контракта — выпускать `*_v2`, поддерживая обратную совместимость на время миграции фронта.
  
  **PostgREST Overloading (PGRST203):**
  - Перегруженные функции недоступны по REST из-за неоднозначности.
  - Решение: создать wrapper-функции (`*_v1`) с чётким набором параметров и выдать `GRANT EXECUTE TO anon`.
  
  **Фронтенд-протокол:**
  - Хелпер `rpcPreferV1()` сначала вызывает `${fn}_v1`, при 404/405/ambiguity — фоллбек на `${fn}`.
  - В UI ошибки не приводят к падению страницы: отображаем статусы/заглушки.

## 📚 ДОПОЛНИТЕЛЬНАЯ ДОКУМЕНТАЦИЯ

**Обязательное чтение для всех фронтенд-разработчиков:**

1. **SUPABASE_FRONTEND_BEST_PRACTICES.md** - Полное руководство по работе с Supabase
   - Решение проблем PostgREST overloading (PGRST203)
   - SSR vs Client-side rendering
   - Обработка ошибок и fallback данные
   - Структура проекта и workflow

2. **SUPABASE_RPC_MIGRATION_GUIDE.md** - Миграция на v1 wrappers
   - SQL templates для создания v1-обёрток
   - Frontend integration с rpcPreferV1()
   - Health check integration
   - Troubleshooting PGRST203 ошибок

3. **SUPABASE_MCP_INTEGRATION_GUIDE.md** - Автоматизация через MCP
   - Использование MCP инструментов для Supabase
   - Автоматическое создание v1-обёрток
   - Мониторинг и диагностика
   - Workflow templates для типовых задач

**Критические правила:**
- ❌ НИКОГДА не используйте перегруженные RPC напрямую
- ✅ ВСЕГДА создавайте v1-обёртки для новых RPC
- ✅ ВСЕГДА используйте `rpcPreferV1()` helper
- ✅ ВСЕГДА добавляйте fallback данные при ошибках
- ✅ Долгие RPC (>2 сек) - только Client-side rendering в IT отдел
- Ежедневно: короткий апдейт (что сделано / в работе / блокеры + ссылка на деплой)
- Еженедельно: сводка (коммиты/фичи/фиксы/документация/активные задачи + ссылки)
- Инциденты: приложить ссылку на `/health` и Runtime Logs в Vercel

---
{{ ... }}
## Коротко: что делать прямо сейчас фронтендеру

1. Склонировать репо, поставить зависимости, заполнить `.env.local`
2. Открыть `/analytics`, подцепить три RPC (см. п.4, п.5)
3. Вывести KPI + две таблицы
4. Сделать PR → мёрдж → проверить прод
5. Если не хватает данных — завести issue "RPC Request" по шаблону (п.7)

Готово. С такой инструкцией фронт будет работать стабильно и предсказуемо, а ты — не ловить «сюрпризы» из-за пересечения с бэкендом.
