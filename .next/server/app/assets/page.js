(()=>{var e={};e.id=650,e.ids=[650],e.modules={7849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},2390:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>o.a,__next_app__:()=>u,originalPathname:()=>p,pages:()=>c,routeModule:()=>m,tree:()=>l}),s(1164),s(2029),s(5866);var r=s(3191),n=s(8716),d=s(7922),o=s.n(d),i=s(5231),a={};for(let e in i)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(a[e]=()=>i[e]);s.d(t,a);let l=["",{children:["assets",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,1164)),"/Users/macbookpro/Desktop/defires/yandex_market/telefon_1/swer4ock-analytics-ui/src/app/assets/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,2029)),"/Users/macbookpro/Desktop/defires/yandex_market/telefon_1/swer4ock-analytics-ui/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,5866,23)),"next/dist/client/components/not-found-error"]}],c=["/Users/macbookpro/Desktop/defires/yandex_market/telefon_1/swer4ock-analytics-ui/src/app/assets/page.tsx"],p="/assets/page",u={require:s,loadChunk:()=>Promise.resolve()},m=new r.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/assets/page",pathname:"/assets",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:l}})},7698:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,2994,23)),Promise.resolve().then(s.t.bind(s,6114,23)),Promise.resolve().then(s.t.bind(s,9727,23)),Promise.resolve().then(s.t.bind(s,9671,23)),Promise.resolve().then(s.t.bind(s,1868,23)),Promise.resolve().then(s.t.bind(s,4759,23))},5303:()=>{},1164:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>n});var r=s(9510);function n(){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("main",{style:{padding:24,fontFamily:"ui-sans-serif, system-ui"},children:[r.jsx("h1",{children:"Готовые датасеты"}),r.jsx("div",{id:"loading",style:{display:"block"},children:r.jsx("p",{children:"Загрузка данных..."})}),(0,r.jsxs)("div",{id:"error",style:{display:"none",color:"red",border:"1px solid red",padding:"1rem"},children:[r.jsx("strong",{children:"Ошибка:"})," ",r.jsx("span",{id:"error-message"})]}),(0,r.jsxs)("div",{id:"content",style:{display:"none"},children:[(0,r.jsxs)("p",{children:["Найдено записей: ",r.jsx("span",{id:"count",children:"0"})]}),(0,r.jsxs)("table",{id:"data-table",style:{borderCollapse:"collapse",width:"100%",border:"1px solid #ddd"},children:[r.jsx("thead",{children:(0,r.jsxs)("tr",{style:{backgroundColor:"#f5f5f5"},children:[r.jsx("th",{style:{padding:8,border:"1px solid #ddd"},children:"Name"}),r.jsx("th",{style:{padding:8,border:"1px solid #ddd"},children:"FQ Name"}),r.jsx("th",{style:{padding:8,border:"1px solid #ddd"},children:"Last Refreshed"}),r.jsx("th",{style:{padding:8,border:"1px solid #ddd"},children:"Tags"})]})}),r.jsx("tbody",{id:"table-body"})]})]})]}),r.jsx("script",{dangerouslySetInnerHTML:{__html:`
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
        `}})]})}},2029:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>d,metadata:()=>n});var r=s(9510);let n={title:"swer4ock analytics"};function d({children:e}){return r.jsx("html",{lang:"ru",children:r.jsx("body",{style:{margin:0,fontFamily:"system-ui, sans-serif"},children:e})})}}};var t=require("../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[819],()=>s(2390));module.exports=r})();