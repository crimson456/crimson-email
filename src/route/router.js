import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
const Login = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
    // import Home from '../components/Home.vue'
const Home = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
    // import Welcome from '../components/Welcome.vue'
const Welcome = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
    // import Rights from '../components/power/Rights.vue'
const Rights = () =>
    import ( /* webpackChunkName: "Users_Rzights_Roles" */ '../components/power/Rights.vue')
    // import Roles from '../components/power/Roles.vue'
const Roles = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

// import Cate from '../components/goods/Cate.vue'
const Cate = () =>
    import ( /* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
    // import Params from '../components/goods/Params.vue'
const Params = () =>
    import ( /* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

// import GoodList from '../components/goods/List.vue'
const GoodList = () =>
    import ( /* webpackChunkName: "GoodsList_Add" */ '../components/goods/List.vue')
    // import Add from '../components/goods/Add.vue'
const Add = () =>
    import ( /* webpackChunkName: "GoodsList_Add" */ '../components/goods/Add.vue')

// import Orders from '../components/orders/Orders.vue'
const Orders = () =>
    import ( /* webpackChunkName: "Order_Report" */ '../components/orders/Orders.vue')
    // import Report from '../components/report/Report.vue'
const Report = () =>
    import ( /* webpackChunkName: "Order_Report" */ '../components/report/Report.vue')



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
                    { path: '/goods', component: GoodList },
                    { path: '/goods/add', component: Add },
                    { path: '/orders', component: Orders },
                    { path: '/reports', component: Report },
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