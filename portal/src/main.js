
/*import 'core-js/stable/promise';
import 'core-js/stable/symbol';
import 'core-js/stable/string/starts-with';
import 'core-js/web/url';*/
/*'@vue/cli-plugin-babel/preset',*/
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Message } from "element-ui";
import {
  registerMicroApps,
  setDefaultMountApp,
  runAfterFirstMounted,
  start,
  addGlobalUncaughtErrorHandler,
  // initGlobalState, // 官方应用间通信
} from "qiankun";
import apiDataFilter from "./utils/apiDataFilter";
import mfeList from './mfe'
import {fetch as fetchPolyfill} from 'whatwg-fetch'
Vue.config.productionTip = false
/*import {importEntry} from './index'

const requestIdleCallback =
    window.requestIdleCallback ||
    function requestIdleCallback(cb) {
      const start = Date.now();
      return setTimeout(() => {
        cb({
          didTimeout: false,
          timeRemaining() {
            return Math.max(0, 50 - (Date.now() - start));
          },
        });
      }, 1);
    };

function prefetch(entry, opts) {
  console.log('IE-----------')

requestIdleCallback( async () => {
  console.log('IE-----------2')
  const { getExternalScripts, getExternalStyleSheets } = await importEntry(entry, opts);
  requestIdleCallback(getExternalStyleSheets);
  requestIdleCallback(getExternalScripts);
})

}*/


//prefetch('//10.129.222.127:8091',{fetch:(url)=>fetchPolyfill(url)})

//importEntry('//10.129.222.127:8091',{fetch:(url)=>fetchPolyfill(url)})
/*fetchPolyfill('//10.129.222.127:8091').then(response => response.text()).then(html=>{})*/

let app = null;

/*渲染方式*/
function render({ appContent, loading } = {}) {
  if (!app) {
    app = new Vue({
      el: "#container",
      router,
      store,
      data() {
        return {
          content: appContent,
          loading
        };
      },
      render(h) {
        return h(App, {
          props: {
            content: this.content,
            loading: this.loading
          }
        });
      }
    });
  } else {
    app.content = appContent;
    app.loading = loading;
  }
}

render({loading: true });

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

/*注册子模块*/
function registerMicro(list) {
  let msg = {

  }
  if (list.length === 0) {
    Message({
      type: 'error',
      message: "没有可以注册的子应用数据"
    })
    return;
  }
  // 处理子应用注册数据
  let apps = [];
  let defaultApp = null;
  list.forEach(item => {
    apps.push({
      name: item.moduleName,
      entry: item.entry,
      //render,
      container:'#subAppLayout',
      activeRule: genActiveRule(item.routerBase),
      props: { ...msg, ROUTES: item.children, routerBase: item.routerBase }
    })
    if (item.defaultRegister) defaultApp = item.routerBase;
  });
  // 注册子应用
  registerMicroApps(apps, {
    beforeLoad: [
      app => {
        console.log("before load", app);
      }
    ],
    beforeMount: [
      app => {
        console.log("before mount", app);
      }
    ],
    afterUnmount: [
      app => {
        console.log("after unload", app);
      }
    ]
  });

  if (!defaultApp) defaultApp = list[0].routerBase;

  setDefaultMountApp(defaultApp);

  runAfterFirstMounted((app) => {
    console.log(app,'runAfterFirstMounted')
  });

  start({ prefetch: true ,sandbox:{strictStyleIsolation: true},fetch:(url,...args)=>fetchPolyfill(url,...args)});

  addGlobalUncaughtErrorHandler(event => console.log('--------',event));
}

const isProd = process.env.NODE_ENV === 'production';

let list = mfeList;
if (isProd){
  apiDataFilter.request({}).then((res)=>{
    let result = res.data;
    registerMicro(result)
  })
}else {
  try {
    registerMicro(list)
  }catch (e) {
    console.log('e---------',e)
  }
}

/*new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')*/
