<template>
  <div>
      <!-- 面包屑导航栏 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!--  卡片视图区 -->
        <el-card>
            <!-- 搜索添加区域 -->
            <el-row :gutter=20>
                <el-col :span=7>
                    <el-input placeholder="请输入用户名" v-model="queryInfo.query" :clearable='true' @clear='getUserList'>
                    <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
                    </el-input>
                </el-col>
                <el-col :span=4>
                    <el-button type='primary' @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!-- 表格信息区域 -->
            <el-table :data="userlist" style="width: 100%" border stripe>
                <el-table-column type='index' width='30px'></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱" ></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <!-- 状态栏目 -->
                <el-table-column prop="mg_state" label="状态">
                    <template slot-scope="scope"> 
                        <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>             
                    </template>   
                </el-table-column>
                <!-- 操作栏目 -->
                <el-table-column label="操作" width='200px'>
                    <template slot-scope="scope"> 
                        <el-tooltip content="编辑" placement="top" :enterable='false'>
                        <el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top" :enterable='false'>
                        <el-button type="danger" icon="el-icon-delete" size='mini' @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="设置" placement="top" :enterable='false'>
                        <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>{{scope.data}}
                        </el-tooltip>
                    </template>
                </el-table-column>
             </el-table>
            <!-- 分页区 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 3, 4]" :page-size="queryInfo.pagesize"
                 layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
            </el-card>
            <!-- 添加用户对话框 -->
            <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
                <!-- 添加用户表单 -->
                <el-form ref="addFormRef" :model="addForm" :rules='addFormRules' label-width="80px">
                <el-form-item label="用户名" prop='username'>
                <el-input v-model="addForm.username" ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop='password'>
                <el-input v-model="addForm.password" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop='email'>
                <el-input v-model="addForm.email" ></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop='mobile'>
                <el-input v-model="addForm.mobile" ></el-input>
                </el-form-item>
                </el-form>

                <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary"  @click="addUser">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改用户对话框 -->
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
                <!-- 修改用户表单 -->
                <el-form ref="editFormRef" :model="editForm" :rules='editFormRules' label-width="80px">
                <el-form-item label="用户名">
                <el-input v-model="editForm.username"  disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop='email'>
                <el-input v-model="editForm.email" ></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop='mobile'>
                <el-input v-model="editForm.mobile" ></el-input>
                </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary"  @click="editUserInfo">确 定</el-button>
                </span>
            </el-dialog>


            
       



  </div>
</template>

<script>
export default {
    data(){
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
    // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
    // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
    // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }



        return{
            // 查询用户使用数据
            queryInfo:{
                query:'',
                pagenum: 1,
                pagesize: 2
            },
            userlist:[],
            total:0,
            // 添加表单对话框状态符
            addDialogVisible:false,
            // 添加表单数据绑定
            addForm:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            // 添加表单规则
            addFormRules:{
                username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 10, message: '用户名长度在 3到10 个字符', trigger: 'blur' }
            ],
                password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '密码在 6 到 15 个字符', trigger: 'blur' }
            ],  
                email:[
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
            ],   
                mobile:[
                { required: true, message: '请输入手机号码', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
            ]
            },
            addFormRef:'',
            // 修改用户对话框状态符
            editDialogVisible:false,
            // 修改用户查询信息绑定
            editForm:{},
            //修改用户信息校验规则
            editFormRules:{ 
                email:[
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator: checkEmail, trigger: 'blur' }
            ],   
                mobile:[
                { required: true, message: '请输入手机号码', trigger: 'blur' },
                { validator: checkMobile, trigger: 'blur' }
            ]
            }
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
            //请求列表数据
            async getUserList(){
                const { data:res}=await this.$http.get('users',{params:this.queryInfo});
                if(res.meta.status!==200) return this.$message.error('获取用户列表失败!');
                this.userlist=res.data.users;
                this.total=res.data.total;
            },
            // 每页数据条数改变重新请求列表数据
            async handleSizeChange(newSize){
                this.queryInfo.pagesize=newSize;
                const { data:res}=await this.$http.get('users',{params:this.queryInfo});          
                if(res.meta.status!==200) return this.$message.error('获取用户列表失败!');
                this.userlist=res.data.users;
                this.total=res.data.total;
            },
            // 页码改变重新请求数据
            async handleCurrentChange(newPage){
                this.queryInfo.pagenum=newPage;
                const { data:res}=await this.$http.get('users',{params:this.queryInfo});          
                if(res.meta.status!==200) return this.$message.error('获取用户列表失败!');
                this.userlist=res.data.users;
                this.total=res.data.total;
            },
            // 用户状态修改
            async userStateChange(userInfo){
                const { data:res}=await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`);
                if(res.meta.status!==200) {
                    userInfo.mg_state=!userInfo.mg_state;
                    return this.$message.error('更改用户状态失败!');}
                this.$message.success('更改用户状态成功!');
            },
            // 重置添加表单对话框
            addDialogClose(){
                this.$refs.addFormRef.resetFields();
            },
            // 添加新用户
            addUser(){
                // 通过校验规则进行预校验
                this.$refs.addFormRef.validate(async(validate)=>{
                if(!validate) return;
                // 发送添加用户信息，并从返回的对象中结构出数据data重命名为res
                const {data:res}=await this.$http.post('users',this.addForm);
                // 判断是否发送成功
                if(res.meta.status!==201)  return this.$message({message:'添加失败',
                                                                type:'error',
                                                                showClose:true});                        
                this.$message({message:'添加成功',
                        type:'success',
                        showClose:true});
                // 关闭对话框并重新加载表单
                this.addDialogVisible=false;
                this.getUserList();
                });
            },
            //打开修改用户对话框
            async showEditDialog(id){
                const{data:res} =await this.$http.get('users/'+id);
                if(res.meta.status!==200)  return this.$message({message:'查询用户信息失败',
                                                                type:'error',
                                                                showClose:true});
                //将查询信息绑定在表单中 
                this.editForm=res.data;
                this.editDialogVisible=true;                                                
            },
            // 关闭修改用户对话框
            editDialogClose(){
                this.$refs.editFormRef.resetFields();
            },
            // 修改用户信息
            async editUserInfo(){
                // 通过校验规则进行预校验
                this.$refs.editFormRef.validate(async(validate)=>{
                if(!validate) return;
                // 发送修改用户信息，并从返回的对象中结构出数据data重命名为res
                const {data:res}=await this.$http.put('users/'+this.editForm.id,{
                    email:this.editForm.email,
                    mobile:this.editForm.mobile
                });
                // 判断是否发送成功
                if(res.meta.status!==200)  return this.$message({message:'修改用户信息失败',
                                                                type:'error',
                                                                showClose:true});                        
                this.$message({message:'修改用户信息成功',
                        type:'success',
                        showClose:true});
                // 关闭对话框并重新加载表单
                this.editDialogVisible=false;
                this.getUserList();
                });
            },
            // 删除用户(如果在最后一页删除最后一个,会导致无显示)
            async removeUserById(id){
                // 引入提示框
                const confirmResult =await this.$confirm('此操作删除该用户, 是否继续?', 
                '提示',
                 {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning' })
                .catch(err=>err)
                if (confirmResult=='cancel') return this.$message({message:'取消删除',
                                                                    type:'Info',
                                                                    showClose:true});
                const {data:res}=await this.$http.delete('users/'+id);
                // 判断是否发送成功
                if(res.meta.status!==200)  return this.$message({message:'删除用户失败',
                                                                type:'error',
                                                                showClose:true}); 
                 this.$message({message:'删除用户成功',
                                type:'success',
                                showClose:true});                                                 
                // 重新加载表单
                this.getUserList();
            }

    }
}
</script>

<style>

</style>