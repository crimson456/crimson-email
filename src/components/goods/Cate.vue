<template>
  <div>
      <!-- 面包屑导航栏 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 树形表格 -->
            <tree-table :data='catelist' :columns="columns" show-index :show-row-hover='false'
            :selection-type='false' :expand-type='false'>
            <!-- 是否有效的作用域插槽 -->
            <template slot='isok' slot-scope="scope">
                <i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color:lightgreen"></i>
                <i class="el-icon-error" v-else style="color:red"></i>
            </template> 
            <!-- 排序的作用域插槽 -->
            <template slot='order' slot-scope="scope">
                <el-tag size='mini'  v-if="scope.row.cat_level==0">一级</el-tag>
                <el-tag size='mini' type='success' v-else-if="scope.row.cat_level==1">二级</el-tag>
                <el-tag size='mini' type='warning' v-else>三级</el-tag>
            </template>
            <!-- 操作的作用域插槽 -->
            <template slot='opt' slot-scope="">
                <el-button type='primary' icon='el-icon-edit'>编辑</el-button>
                <el-button type='danger' icon='el-icon-delete'>删除</el-button>
            </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 7, 9]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed"> 
            <!-- 添加分类表单 -->
            <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="100px">
                <el-form-item label="分类名称:" prop='cat_name'>
                <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <!-- 级联选择器 options绑定级联的数据， props中设定绑定label，值， model绑定选中的标签的值（必须用数组）-->
                    <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps"
                    @change="parentCateChange" clearable></el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>






        
    </div>
</template>

<script>
export default {
    data(){
        return{
            // 商品分类列表
            catelist:[],
            // 请求参数
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },
            // 总页数
            total:0,
            // 树形表格控件
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },
                // 使用作用域插槽
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'isok'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                },
            ],
            // 添加分类对话框状态符
            addCateDialogVisible : false,
            // 添加分类数据对象
            addCateForm:{
                cat_name:'',
                // 父级分类Id
                cat_pid:0,
                // 默认为1级
                cat_level:0

            },
            // 分类表单验证规则
            addCateFormRules:{
                cat_name:[
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            // 父级分类目录（数据源）
            parentCateList:[],
            // 级联选择器绑定数据
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger: 'hover' ,
                checkStrictly:true
            },
            // 级联选择器选择对应id
            selectedKeys:[],


            
        }
    },
    created(){
        this.getcatelist();
    },
    methods:{
        // 获取商品数据
        async getcatelist(){
            const{data:res}=await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status!==200)  return this.$message({message:'请求商品分类列表失败',
                                                                 type:'error',
                                                                showClose:true}); 
            this.catelist=res.data.result;
            this.total=res.data.total;
        },
        // 处理切换分页和单页大小
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getcatelist();
        },
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage;
            this.getcatelist();
        },
        // 获取父节点数据用于渲染对话框
        async getParentCateList(){
            const{data:res}=await this.$http.get('categories',{params:{type:2}})
            if(res.meta.status!==200)  return this.$message({message:'获取父级数据失败',
                                                                 type:'error',
                                                                showClose:true});
            this.parentCateList=res.data;
        },
        // 弹出添加对话框
        showAddCateDialog(){
            this.getParentCateList();
            this.addCateDialogVisible=true;
        },
        // 级联选择器选择时更新父Id数据和等级数据
        parentCateChange(){
            console.log(this.selectedKeys);
            if(this.selectedKeys.length>0){
                this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1];
                this.addCateForm.cat_level=this.selectedKeys.length;
                return;
            }
            this.addCateForm.cat_pid=0;
            this.addCateForm.cat_level=0;
        },
        // 添加目录
        addCate(){
            this.$refs.addCateFormRef.validate(async valid=>{
                if(!valid) return;
            
            const{data:res}=await this.$http.post('categories',this.addCateForm)
            if(res.meta.status!==201)  return this.$message({message:'添加目录失败',
                                                                 type:'error',
                                                                showClose:true});
            this.$message({message:'添加目录成功',
                            type:'success',
                            showClose:true});
            this.getcatelist();
            this.addCateDialogVisible=false;
            });

        },
        // 添加目录对话框关闭清除数据
        addCateDialogClosed(){
            this.$refs.addCateFormRef.resetFields();
            this.selectedKeys=[];
            this.addCateForm.cat_level=0;
            this.addCateForm.cat_pid=0;
        }


    }
}
</script>

<style lang="less" scoped>
.el-cascader{
    width:100%;
}

</style>