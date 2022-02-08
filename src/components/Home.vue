<template>
    <el-container class="home-container">
    <!-- 头部 -->
        <el-header>
            <img src="../assets/mall-icon.webp" alt="">
            <span>crimson的电商后台系统</span>
            <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
    <el-container>
    <!-- 侧边栏 -->
        <el-aside :width="isCollapse?'64px':'200px'">
            <!-- 伸缩控制 -->
            <div class='toggle-button' @click="toggleCollapse">|||</div>
           <el-menu background-color="#373d41" text-color="#fff" 
           active-text-color="crimson" :unique-opened='true' :collapse='isCollapse' 
           :collapse-transition='false' :router='true' :default-active='activePath'	>
               <!-- 一级菜单 -->
                <el-submenu  :index="item.id+''" v-for="item in menulist" :key='item.id'>
                    <template slot="title">
                        <!-- 图标 -->
                        <i :class="iconlist[item.id]"></i>
                        <!-- 文本 -->
                        <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                <el-menu-item :index="'/'+subItem.path"  v-for="subItem in item.children" :key='subItem.id' @click="saveNavState('/'+subItem.path)">
                    <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                        <span>{{subItem.authName}}</span>
                    </template>
                </el-menu-item>
                </el-submenu>

    </el-menu>
        </el-aside>
        <!-- 右侧主体 -->
        <el-main>
            <!-- 子组件 -->
            <router-view></router-view>
        </el-main>
    </el-container>
    </el-container>

</template>

<script>
export default {
    data(){
        return {
            menulist:[],
            iconlist:{
                '125':'el-icon-user',
                '103':'el-icon-s-operation',
                '101':'el-icon-shopping-bag-2',
                '102':'el-icon-s-order',
                '145':'el-icon-s-data',
            },
            isCollapse:false,
            activePath:'/users'
            }
    },
    created(){
        this.getMenuList(),
        this.activePath=window.sessionStorage.activePath;

    },
    methods:{
        // 登出
        logout(){
            window.sessionStorage.clear;
            this.$router.push('/login');
        },
        // 获取菜单列表
        async getMenuList(){
            const{data:res}=await this.$http.get('menus');
            if(res.meta.status!==200) return this.$message.error(res.meta.msg);
            this.menulist=res.data;
            // console.log(this.menulist);
        },
        // 菜单缩放
        toggleCollapse(){
            this.isCollapse=!this.isCollapse;
        },
        // 菜单状态保存
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath=activePath;

        }
    }
}
</script>

<style lang="less" scoped>
.home-container{
    height: 100%;
}
.el-header{
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        color: white;
        font-size: 20px;
        padding: 0;
        padding-right: 20px;
        align-items: center;
        >img{
            width: 60px;
            height: 60px;   
        }
      

}
.el-aside{
        background-color: #333744;
        .el-menu{
            border-right: none;
        }
}
.el-main{
        background-color: #eaedf1;
        
}
.toggle-button{
    background-color: #333744;
    color: white;
    font-size: 10px;
    text-align: center;
    //字间距
    letter-spacing:3px;
    //鼠标聚焦变成手型
    cursor: pointer;
}

</style>