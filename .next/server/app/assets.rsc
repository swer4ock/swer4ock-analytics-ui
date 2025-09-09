3:I[9275,[],""]
4:I[1343,[],""]
2:T95d,
          async function fetchData() {
            try {
              const url = 'https://uumrjikuqewlakczbnbs.supabase.co';
              const key = 'sb_publishable_sfsDkZToPxhGJC8-WdwoiQ_ZMNTcW6m';
              
              if (!url || !key) {
                throw new Error('Missing environment variables');
              }

              const response = await fetch(url + '/rest/v1/rpc/get_assets_data', {
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
        0:["q6nuK7Emm5L7MrvNxz2lx",[[["",{"children":["assets",{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],["",{"children":["assets",{"children":["__PAGE__",{},[["$L1",[["$","main",null,{"style":{"padding":24,"fontFamily":"ui-sans-serif, system-ui"},"children":[["$","h1",null,{"children":"Готовые датасеты"}],["$","div",null,{"id":"loading","style":{"display":"block"},"children":["$","p",null,{"children":"Загрузка данных..."}]}],["$","div",null,{"id":"error","style":{"display":"none","color":"red","border":"1px solid red","padding":"1rem"},"children":[["$","strong",null,{"children":"Ошибка:"}]," ",["$","span",null,{"id":"error-message"}]]}],["$","div",null,{"id":"content","style":{"display":"none"},"children":[["$","p",null,{"children":["Найдено записей: ",["$","span",null,{"id":"count","children":"0"}]]}],["$","table",null,{"id":"data-table","style":{"borderCollapse":"collapse","width":"100%","border":"1px solid #ddd"},"children":[["$","thead",null,{"children":["$","tr",null,{"style":{"backgroundColor":"#f5f5f5"},"children":[["$","th",null,{"style":{"padding":8,"border":"1px solid #ddd"},"children":"Name"}],["$","th",null,{"style":{"padding":8,"border":"1px solid #ddd"},"children":"FQ Name"}],["$","th",null,{"style":{"padding":8,"border":"1px solid #ddd"},"children":"Last Refreshed"}],["$","th",null,{"style":{"padding":8,"border":"1px solid #ddd"},"children":"Tags"}]]}]}],["$","tbody",null,{"id":"table-body"}]]}]]}]]}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"$2"}}]]],null],null]},["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children","assets","children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","notFoundStyles":"$undefined","styles":null}],null]},[["$","html",null,{"lang":"ru","children":["$","body",null,{"style":{"margin":0,"fontFamily":"system-ui, sans-serif"},"children":["$","$L3",null,{"parallelRouterKey":"children","segmentPath":["children"],"error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":"404"}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],"notFoundStyles":[],"styles":null}]}]}],null],null],[null,"$L5"]]]]
5:[["$","meta","0",{"name":"viewport","content":"width=device-width, initial-scale=1"}],["$","meta","1",{"charSet":"utf-8"}],["$","title","2",{"children":"swer4ock analytics"}]]
1:null
