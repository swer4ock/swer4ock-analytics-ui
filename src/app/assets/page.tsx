export default function AssetsPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return (
    <>
      <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
        <h1>Готовые датасеты</h1>
        
        <div id="loading" style={{ display: 'block' }}>
          <p>Загрузка данных...</p>
        </div>
        
        <div id="error" style={{ display: 'none', color: 'red', border: '1px solid red', padding: '1rem' }}>
          <strong>Ошибка:</strong> <span id="error-message"></span>
        </div>
        
        <div id="content" style={{ display: 'none' }}>
          <p>Найдено записей: <span id="count">0</span></p>
          <table id="data-table" style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ddd' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Name</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>FQ Name</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Last Refreshed</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Tags</th>
              </tr>
            </thead>
            <tbody id="table-body">
            </tbody>
          </table>
        </div>
      </main>

      <script dangerouslySetInnerHTML={{
        __html: `
          async function fetchData() {
            try {
              const url = '${supabaseUrl}';
              const key = '${supabaseKey}';
              
              if (!url || !key) {
                throw new Error('Missing environment variables');
              }

              const response = await fetch(url + '/rest/v1/rpc/hello_world', {
                method: 'POST',
                headers: {
                  'apikey': key,
                  'Authorization': 'Bearer ' + key,
                  'Content-Type': 'application/json'
                }
              });

              if (!response.ok) {
                throw new Error('HTTP ' + response.status + ': ' + response.statusText);
              }

              const result = await response.json();
              
              document.getElementById('loading').style.display = 'none';
              document.getElementById('content').style.display = 'block';
              document.getElementById('count').textContent = result.length;
              
              const tbody = document.getElementById('table-body');
              tbody.innerHTML = '';
              
              result.forEach(function(item) {
                const row = document.createElement('tr');
                row.innerHTML = 
                  '<td style="padding: 8px; border: 1px solid #ddd;">' + (item.name || '-') + '</td>' +
                  '<td style="padding: 8px; border: 1px solid #ddd;">' + (item.fq_name || '-') + '</td>' +
                  '<td style="padding: 8px; border: 1px solid #ddd;">' + (item.last_refreshed || '-') + '</td>' +
                  '<td style="padding: 8px; border: 1px solid #ddd;">' + (item.tags ? item.tags.join(', ') : '-') + '</td>';
                tbody.appendChild(row);
              });
              
            } catch (err) {
              document.getElementById('loading').style.display = 'none';
              document.getElementById('error').style.display = 'block';
              document.getElementById('error-message').textContent = err.message;
            }
          }
          
          // Start fetching when page loads
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fetchData);
          } else {
            fetchData();
          }
        `
      }} />
    </>
  );
}
