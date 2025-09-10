# 🔌 Supabase MCP Integration Guide - Автоматизация через MCP

## 🎯 Что такое MCP (Model Context Protocol)

MCP позволяет автоматизировать работу с Supabase через AI-ассистентов. Вместо ручного выполнения SQL-команд, можно использовать MCP инструменты для:

- Создания и применения миграций
- Выполнения SQL-запросов
- Управления проектами и ветками
- Мониторинга статуса системы

---

## 🛠️ Доступные MCP Инструменты

### 1. Управление проектами
```typescript
// Список всех проектов
mcp2_list_projects()

// Получение информации о проекте
mcp2_get_project({ id: "project_id" })

// Создание нового проекта (требует подтверждения стоимости)
mcp2_create_project({
  name: "My Project",
  organization_id: "org_id",
  region: "eu-west-1",
  confirm_cost_id: "cost_confirmation_id"
})
```

### 2. Выполнение SQL
```typescript
// Выполнение произвольного SQL
mcp2_execute_sql({
  project_id: "project_id",
  query: "SELECT * FROM users LIMIT 10;"
})

// Применение миграции (DDL операции)
mcp2_apply_migration({
  project_id: "project_id", 
  name: "add_user_table",
  query: "CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);"
})
```

### 3. Работа с RPC функциями
```typescript
// Список всех функций
mcp2_execute_sql({
  project_id: "project_id",
  query: `
    SELECT proname, pg_get_function_identity_arguments(oid) as args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' AND proname LIKE '%analytics%';
  `
})

// Создание v1-обёртки через миграцию
mcp2_apply_migration({
  project_id: "project_id",
  name: "create_analytics_v1_wrapper", 
  query: `
    CREATE OR REPLACE FUNCTION get_analytics_summary_v1()
    RETURNS TABLE(...) AS $$
      SELECT * FROM get_analytics_summary();
    $$;
    GRANT EXECUTE ON FUNCTION get_analytics_summary_v1() TO anon;
  `
})
```

### 4. Мониторинг и диагностика
```typescript
// Получение логов
mcp2_get_logs({
  project_id: "project_id",
  service: "api" // или "postgres", "edge-function", "auth"
})

// Проверка безопасности
mcp2_get_advisors({
  project_id: "project_id", 
  type: "security" // или "performance"
})

// Генерация TypeScript типов
mcp2_generate_typescript_types({
  project_id: "project_id"
})
```

---

## 🔄 Автоматизированный Workflow для RPC v1

### Полный процесс создания v1-обёрток

```typescript
// 1. Анализ существующих функций
const functions = await mcp2_execute_sql({
  project_id: "uumrjikuqewlakczbnbs",
  query: `
    SELECT 
      p.proname as function_name,
      pg_get_function_identity_arguments(p.oid) as arguments,
      pg_get_function_result(p.oid) as return_type
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public' 
      AND p.proname IN ('get_analytics_summary', 'get_city_performance', 'get_strategy_monitoring')
    ORDER BY p.proname, p.oid;
  `
});

// 2. Создание v1-обёрток одной миграцией
await mcp2_apply_migration({
  project_id: "uumrjikuqewlakczbnbs",
  name: "create_rpc_v1_wrappers_batch",
  query: `
    -- Analytics Summary v1
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

    -- City Performance v1  
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

    -- Strategy Monitoring v1
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
  `
});

// 3. Проверка создания функций
const verification = await mcp2_execute_sql({
  project_id: "uumrjikuqewlakczbnbs", 
  query: `
    SELECT proname, pg_get_function_identity_arguments(oid)
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid  
    WHERE n.nspname = 'public' AND proname LIKE '%_v1'
    ORDER BY proname;
  `
});
```

---

## 📋 MCP Workflow Templates

### Template 1: Новая RPC функция

```typescript
async function createNewRpcFunction(functionName: string, sql: string) {
  // 1. Создать основную функцию
  await mcp2_apply_migration({
    project_id: PROJECT_ID,
    name: `create_${functionName}`,
    query: sql
  });

  // 2. Создать v1-обёртку сразу
  await mcp2_apply_migration({
    project_id: PROJECT_ID,
    name: `create_${functionName}_v1_wrapper`,
    query: `
      CREATE OR REPLACE FUNCTION ${functionName}_v1(...)
      RETURNS TABLE (...) AS $$
        SELECT * FROM ${functionName}(...);
      $$;
      GRANT EXECUTE ON FUNCTION ${functionName}_v1(...) TO anon;
    `
  });

  // 3. Проверить права доступа
  const permissions = await mcp2_execute_sql({
    project_id: PROJECT_ID,
    query: `
      SELECT grantee, privilege_type 
      FROM information_schema.routine_privileges 
      WHERE routine_name = '${functionName}_v1';
    `
  });

  return permissions;
}
```

### Template 2: Диагностика проблем

```typescript
async function diagnoseFrontendIssues(projectId: string) {
  // 1. Проверить статус проекта
  const project = await mcp2_get_project({ id: projectId });
  
  // 2. Проверить логи API
  const apiLogs = await mcp2_get_logs({
    project_id: projectId,
    service: "api"
  });

  // 3. Проверить безопасность
  const securityIssues = await mcp2_get_advisors({
    project_id: projectId,
    type: "security"
  });

  // 4. Проверить производительность  
  const performanceIssues = await mcp2_get_advisors({
    project_id: projectId,
    type: "performance"
  });

  return {
    project,
    apiLogs,
    securityIssues,
    performanceIssues
  };
}
```

### Template 3: Массовое обновление функций

```typescript
async function batchUpdateRpcFunctions(projectId: string, functions: string[]) {
  const results = [];
  
  for (const func of functions) {
    try {
      // Создать v1-обёртку для каждой функции
      const result = await mcp2_apply_migration({
        project_id: projectId,
        name: `create_${func}_v1_wrapper`,
        query: generateV1Wrapper(func)
      });
      results.push({ function: func, status: 'success', result });
    } catch (error) {
      results.push({ function: func, status: 'error', error });
    }
  }
  
  return results;
}

function generateV1Wrapper(functionName: string): string {
  // Автоматическая генерация v1-обёртки на основе анализа функции
  return `
    CREATE OR REPLACE FUNCTION ${functionName}_v1(...)
    RETURNS TABLE (...) AS $$
    BEGIN
      RETURN QUERY SELECT * FROM ${functionName}(...);
    END;
    $$;
    GRANT EXECUTE ON FUNCTION ${functionName}_v1(...) TO anon;
  `;
}
```

---

## 🔧 Интеграция с Frontend

### Автоматическая проверка Health

```typescript
// Использование MCP для проверки статуса RPC
async function checkRpcHealth(projectId: string, functions: string[]) {
  const results = [];
  
  for (const func of functions) {
    try {
      // Проверить v1 версию
      await mcp2_execute_sql({
        project_id: projectId,
        query: `SELECT ${func}_v1() LIMIT 1;`
      });
      results.push({ name: `${func}_v1`, status: 'OK' });
    } catch (error) {
      results.push({ name: `${func}_v1`, status: 'ERROR', error: error.message });
    }
    
    try {
      // Проверить legacy версию
      await mcp2_execute_sql({
        project_id: projectId, 
        query: `SELECT ${func}() LIMIT 1;`
      });
      results.push({ name: func, status: 'OK' });
    } catch (error) {
      results.push({ name: func, status: 'ERROR', error: error.message });
    }
  }
  
  return results;
}
```

### Автоматическая генерация типов

```typescript
// Генерация TypeScript типов для новых RPC
async function generateTypesForRpc(projectId: string) {
  const types = await mcp2_generate_typescript_types({ project_id: projectId });
  
  // Сохранить в файл проекта
  await writeFile('src/types/supabase.ts', types);
  
  return types;
}
```

---

## 📊 Мониторинг и Алерты

### Автоматический мониторинг

```typescript
async function monitorSupabaseHealth(projectId: string) {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    project: await mcp2_get_project({ id: projectId }),
    logs: await mcp2_get_logs({ project_id: projectId, service: "api" }),
    security: await mcp2_get_advisors({ project_id: projectId, type: "security" }),
    performance: await mcp2_get_advisors({ project_id: projectId, type: "performance" })
  };

  // Отправить в систему мониторинга или Slack
  if (healthCheck.security.length > 0 || healthCheck.performance.length > 0) {
    await sendAlert(healthCheck);
  }

  return healthCheck;
}
```

---

## 🚀 Best Practices для MCP

### 1. Безопасность
- Всегда используйте `SECURITY DEFINER` для v1-обёрток
- Проверяйте `GRANT EXECUTE TO anon` после создания функций
- Регулярно запускайте security advisors

### 2. Производительность  
- Группируйте связанные изменения в одну миграцию
- Используйте `mcp2_apply_migration` для DDL, `mcp2_execute_sql` для DML
- Мониторьте performance advisors

### 3. Отслеживание изменений
- Используйте описательные имена для миграций
- Ведите лог всех MCP операций
- Сохраняйте rollback команды

### 4. Автоматизация
- Создавайте скрипты для повторяющихся задач
- Интегрируйте MCP проверки в CI/CD
- Настройте автоматические health checks

---

## 📞 Troubleshooting через MCP

### Диагностика PGRST203 ошибок

```typescript
async function diagnosePGRST203(projectId: string, functionName: string) {
  // 1. Найти все перегруженные функции
  const overloads = await mcp2_execute_sql({
    project_id: projectId,
    query: `
      SELECT proname, pg_get_function_identity_arguments(oid) as signature
      FROM pg_proc p
      JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND proname = '${functionName}'
      ORDER BY oid;
    `
  });

  // 2. Проверить существование v1-обёртки
  const v1Exists = await mcp2_execute_sql({
    project_id: projectId,
    query: `
      SELECT EXISTS(
        SELECT 1 FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid  
        WHERE n.nspname = 'public' AND proname = '${functionName}_v1'
      );
    `
  });

  // 3. Создать v1-обёртку если не существует
  if (!v1Exists[0].exists) {
    await mcp2_apply_migration({
      project_id: projectId,
      name: `fix_${functionName}_overloading`,
      query: generateV1Wrapper(functionName)
    });
  }

  return { overloads, v1Exists, fixed: !v1Exists[0].exists };
}
```

---

*MCP Integration Guide v1.0 - 10.09.2025*  
*IT Отдел CRM - Автоматизация через Model Context Protocol*
