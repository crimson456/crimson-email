import Vue from 'vue'
import App from './App.vue'
import router from './route/router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

// 引入进度条在请求前和请求后触发
import NProgress from 'nprogress'




// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 设置基准url
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/';
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 请求拦截,在请求头上添加验证属性
axios.interceptors.request.use(config => {
    // 触发开始进度条
    NProgress.start();
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
})
axios.interceptors.response.use(config => {
        // 触发结束进度条
        NProgress.done();
        return config
    })
    // 将axios的请求方式挂在在原型http上
Vue.prototype.$http = axios;
Vue.config.productionTip = false;
Vue.use(VueQuillEditor)

Vue.component('tree-table', TreeTable);
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear();
    // 不足两位在前面填充'0'
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    const d = (dt.getDate() + '').padStart(2, '0');

    const hh = (dt.getHours() + '').padStart(2, '0');
    const mm = (dt.getMinutes() + '').padStart(2, '0');
    const ss = (dt.getSeconds() + '').padStart(2, '0');
    return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`;
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');