import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
Vue.use(VueRouter)

const router = new VueRouter({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login },
            {
                path: '/home',
                component: Home,
                redirect: '/welcome',
                children: [
                    { path: '/welcome', component: Welcome },
                    { path: '/users', component: Users },
                    { path: '/rights', component: Rights },
                    { path: '/roles', component: Roles },
                    { path: '/categories', component: Cate },
                    { path: '/params', component: Params },
                ]
            }
        ]
    })
    //挂载路由导航守卫
router.beforeEach((to, from, next) => {
    //to为访问路径，from为跳转前路径，next回调函数，调用表示放行
    if (to.path === '/login') return next();
    // 获取token，不存在则为空（此版本用getItem会报错）
    const tokenStr = window.sessionStorage.token;
    //判断登录状态，注意这里不能调用this
    if (!tokenStr) return next('/login');
    next();
})


export default router