export const dynamic = 'force-dynamic';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  assigned_to: string;
}

interface Error {
  id: string;
  error_type: string;
  error_message: string;
  task_id: string;
  created_at: string;
}

async function fetchTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_it_tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Prefer': 'count=none'
      },
      body: JSON.stringify({ p_limit: 50 })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

async function fetchErrors(): Promise<Error[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_it_errors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        'Prefer': 'count=none'
      },
      body: JSON.stringify({ p_limit: 20 })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching errors:', error);
    return [];
  }
}

export default async function ITDashboardPage() {
  const [tasks, errors] = await Promise.all([fetchTasks(), fetchErrors()]);

  // Calculate KPI metrics
  const totalTasks = tasks.length;
  const tasksInWork = tasks.filter(t => t.status === 'in_progress').length;
  const tasksQueued = tasks.filter(t => t.status === 'queued').length;
  const tasksCompleted = tasks.filter(t => t.status === 'completed').length;
  const p1Tasks = tasks.filter(t => t.priority === 'P1').length;
  const totalErrors = errors.length;

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ marginBottom: 32 }}>🖥️ IT Dashboard</h1>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32
      }}>
        <div style={{
          padding: 20,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>Всего задач</h3>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#007bff' }}>{totalTasks}</div>
        </div>

        <div style={{
          padding: 20,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>В работе</h3>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#ffc107' }}>{tasksInWork}</div>
        </div>

        <div style={{
          padding: 20,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>В очереди</h3>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#6c757d' }}>{tasksQueued}</div>
        </div>

        <div style={{
          padding: 20,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>Готово</h3>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#28a745' }}>{tasksCompleted}</div>
        </div>

        <div style={{
          padding: 20,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>P1 задач</h3>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#dc3545' }}>{p1Tasks}</div>
        </div>

        <div style={{
          padding: 20,
          backgroundColor: '#f8f9fa',
          borderRadius: 8,
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#495057' }}>Ошибок</h3>
          <div style={{ fontSize: 32, fontWeight: 'bold', color: '#fd7e14' }}>{totalErrors}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Tasks Table */}
        <div>
          <h2 style={{ marginBottom: 16 }}>📋 Задачи IT-отдела</h2>
          <div style={{
            border: '1px solid #e9ecef',
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: 'white'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>ID</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Заголовок</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Статус</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Приоритет</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Обновлено</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Создатель</th>
                </tr>
              </thead>
              <tbody>
                {tasks.length > 0 ? tasks.map((task) => (
                  <tr key={task.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: 12, fontSize: 14 }}>{task.id.slice(-8)}</td>
                    <td style={{ padding: 12, fontSize: 14, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.title}
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        backgroundColor: task.status === 'completed' ? '#d4edda' :
                                       task.status === 'in_progress' ? '#fff3cd' : '#e2e3e5',
                        color: task.status === 'completed' ? '#155724' :
                               task.status === 'in_progress' ? '#856404' : '#383d41'
                      }}>
                        {task.status}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        backgroundColor: task.priority === 'P1' ? '#f8d7da' : '#e2e3e5',
                        color: task.priority === 'P1' ? '#721c24' : '#383d41'
                      }}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      {new Date(task.updated_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>{task.created_by}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#6c757d' }}>
                      Задач нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Errors Table */}
        <div>
          <h2 style={{ marginBottom: 16 }}>🚨 Ошибки системы</h2>
          <div style={{
            border: '1px solid #e9ecef',
            borderRadius: 8,
            overflow: 'hidden',
            backgroundColor: 'white'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Время</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Тип</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Сообщение</th>
                  <th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e9ecef' }}>Задача</th>
                </tr>
              </thead>
              <tbody>
                {errors.length > 0 ? errors.map((error) => (
                  <tr key={error.id} style={{ borderBottom: '1px solid #f1f3f4' }}>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      {new Date(error.created_at).toLocaleString('ru-RU')}
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 12,
                        backgroundColor: '#ffeaa7',
                        color: '#d63031'
                      }}>
                        {error.error_type}
                      </span>
                    </td>
                    <td style={{ padding: 12, fontSize: 14, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {error.error_message}
                    </td>
                    <td style={{ padding: 12, fontSize: 14 }}>{error.task_id ? error.task_id.slice(-8) : '-'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} style={{ padding: 24, textAlign: 'center', color: '#6c757d' }}>
                      Ошибок нет
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
