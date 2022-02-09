<template>
  <div>
      <!-- 面包屑导航栏 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
            <!-- 添加角色按钮 -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表区 -->
             <el-table :data="roleslist" style="width: 100%" border stripe>
                 <!-- 展开列 -->
                <el-table-column type='expand' width='30px'>
                    <template  slot-scope="scope">
                     <el-row v-for="(item1,i1) in scope.row.children" :key='item1.id' :class="['vcenter','bdbottom',i1=='0'?'bdtop':'']">
                         <!-- 一级权限 -->
                         <el-col :span="5">
                             <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                             <i class="el-icon-caret-right"></i>
                         </el-col>
                         <!-- 二级权限 -->
                         <el-col :span="19">
                            <el-row v-for="(item2,i2) in item1.children" :key='item2.id' :class="['vcenter',i2=='0'?'':'bdtop']">
                                <el-col :span="6">
                                    <el-tag type='success' closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                     <i class="el-icon-caret-right"></i>
                                </el-col>
                        <!-- 三级权限 -->
                                <el-col :span="18">
                                    <el-tag type='warning' v-for="item3 in item2.children" :key='item3.id' closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                </el-col>
                            </el-row>
                         </el-col>
                    </el-row>       
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type='index' width='50px'></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述" ></el-table-column>
                <el-table-column  label="操作">
                    <template  slot-scope="scope">
                        <el-button size='mini' type='primary' icon='el-icon-search'>编辑</el-button>
                        <el-button size='mini' type='danger' icon='el-icon-search'>删除</el-button>
                        <el-button size='mini' type='warning' icon='el-icon-search' @click="showSetRightDialog(scope.row)">分配权限</el-button>            
                    </template>
                </el-table-column>
             </el-table>
        </el-card>
        <!-- 分配权限对话框 -->
        <el-dialog title="提示" :visible.sync="setRightDialogVisible" width="30%" @close="setRightDialogClosed">
        <!-- 树形空寂教案 :data绑定对应嵌套的树形数组，：props绑定嵌套字段的名称和显示的字段名称的对象 -->
            <el-tree :data="rightslist" :props="treeProps"  ref='treeRef'
            show-checkbox node-key='id' :default-expand-all='true' :default-checked-keys='defKeys'
            ></el-tree>
            <span slot="footer" class="dialog-footer">
            <el-button @click="setRightDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
        </el-dialog>






        
    </div>
</template>

<script>
export default {
    data(){
        return{
            roleslist:[],
            setRightDialogVisible:false,
            // 树形权限嵌套数组
            rightslist:[],
            // 树形控件使用的绑定对象
            treeProps:{
                label:'authName',
                children:'children'
            },
            //树形控件中选中3级权限节点的ID值
            defKeys:[],
            // 保存提交求改请求角色的id
            roleId:'',

        }
    },
    created(){
        this.getRolesList();
    },
    methods:{
        // 获取角色列表
        async getRolesList(){
            const {data:res}=await this.$http.get('roles');
            if(res.meta.status!==200)  return this.$message({message:'请求角色列表失败',
                                                                 type:'error',
                                                                showClose:true});                                        
            this.roleslist=res.data;
        },
        // 删除角色权限
        async removeRightById(role,rightId){
                // 引入提示框
                const confirmResult =await this.$confirm('此操作将删除权限, 是否继续?', 
                '提示',
                 {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning' })
                .catch(err=>err)
                if (confirmResult=='cancel') return this.$message({message:'取消删除',
                                                                    type:'Info',
                                                                    showClose:true});
                const {data:res}=await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                if(res.meta.status!==200)  return this.$message({message:'删除权限失败',
                                                                 type:'error',
                                                                showClose:true});
                // 删除成功后的data返回对应角色新的权限
                role.children=res.data;   
        },
        async showSetRightDialog(role){
            this.roleId=role.id;
            const {data:res}=await this.$http.get('rights/tree');
            if(res.meta.status!==200)  return this.$message({message:'删除权限失败',
                                                             type:'error',
                                                            showClose:true});
            // 将获取的数据放入权限列表中
            this.rightslist=res.data;
            // 获取三级节点ID
            this.getLeafKeys(role,this.defKeys);
            this.setRightDialogVisible = true;
            
        },
        // 递归获取三级权限对应id
        getLeafKeys(node,arr){
            if(!node.children) return arr.push(node.id);
            node.children.forEach(element => {
                this.getLeafKeys(element,arr);    
            });
        },
        // 关闭更改对话框后将数组清零
        setRightDialogClosed(){
            this.defKeys=[];
        },
        // 点击确定为角色分配权限
        async allotRights(){
            // 将全选框和半选框的id拼接成数组,再拼接成字符串
            const keys=[
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            const idStr= keys.join(',');
            const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr});
            if(res.meta.status!==200)  return this.$message({message:'分配权限失败',
                                                             type:'error',
                                                            showClose:true});
            this.$message({message:'分配权限成功',
                                type:'success',
                                showClose:true});
            //隐藏权限分配对话框，刷新页面
            this.setRightDialogVisible=false;
            this.getRolesList();
        

        }


    }

}
</script>
<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom:  1px solid #eee;
}
.vcenter{
    display: flex;
    align-items: center;
}
</style>