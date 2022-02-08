<template>
<div class="login_container">
    <!-- 登录盒子 -->
    <div class="login_box">
        <!-- 头像 -->
        <div class="avatar_box">
            <img src="../assets/logo.png" alt="">
        </div>
        <!-- 表单域 -->
        <el-form  :model="loginForm" :rules='loginFormRules' label-width="0px" ref='loginFormRef'  class="login_form" >
            <!-- 用户名 -->
            <el-form-item prop='username'>
                <el-input  prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item   prop='password'>  
                <el-input  prefix-icon="el-icon-lock" v-model="loginForm.password" type= password></el-input>
            </el-form-item>
            <!-- 按钮区 -->
            <el-form-item   class="btn" >
                <el-button type="success" plain @click="login">登录</el-button>
                <el-button type="success" plain @click="resetLoginForm">重置</el-button>
            </el-form-item>
  </el-form>
    </div>

</div>

</template>

<script>
export default {
 data() {
    return {
        // 表单域内容绑定
        loginForm:{
            username: 'admin',
            password: '123456'
        },
        //   验证规则
        loginFormRules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '用户名长度在 3到10 个字符', trigger: 'blur' }
            ],
            password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '密码在 6 到 15 个字符', trigger: 'blur' }
            ]
        },
        
    }
} ,
methods:{
resetLoginForm(){
    this.$refs.loginFormRef.resetFields();
},
login(){
    // 验证用户名密码符合规则（参数validate为是否符合规则的回调函数参数）
    this.$refs.loginFormRef.validate(async(validate)=>{
        if(!validate) return;
    // axios挂载在Vue原型下的$http下
    // 发送登录信息，并从返回的对象中结构出数据data重命名为res
        const {data:res}=await this.$http.post('login',this.loginForm);
    // 判断是否发送成功，并在plugins中将信息弹框挂在在message下，并调用
        if(res.meta.status!==200)  return this.$message({message:'登录失败',
                           type:'error',
                           showClose:true});
                                                    
        this.$message({message:'登录成功',
                        type:'success',
                        showClose:true});
        window.sessionStorage.token=res.data.token;
        
        this.$router.push('/home');


});
}
}
}
</script>

<style  lang="less" scoped>
.login_container{
    height: 100%;
}
.login_box{
    width: 500px;
    height: 300px;
    background-color: gray;
    
    position: absolute;
    border-radius: 30px;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        position: absolute;
        height: 100px;
        width: 100px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow:0 0 10px blue;
        left:50%;
        transform: translate(-50%,-50%);
        background-color: white;

        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: white;
            
        }
    }
}
.btn{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom:0;
    width: 100%;
    padding:0 20px;
    box-sizing: border-box;
}
</style>