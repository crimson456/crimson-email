import Vue from 'vue'
import App from './App.vue'
import router from './route/router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
// 设置基准url
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 请求拦截,在请求头上添加验证属性
axios.interceptors.request.use(config => {
        config.headers.Authorization = window.sessionStorage.getItem('token');
        return config
    })
    // 将axios的请求方式挂在在原型http上
Vue.prototype.$http = axios;
Vue.config.productionTip = false;

Vue.component('tree-table', TreeTable);


new Vue({
    router,
    render: h => h(App)
}).$mount('#app');