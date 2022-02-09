<template>
    <div>
      <!-- 面包屑导航栏 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区 -->
        <el-card>
             <el-table :data="rightslist" style="width: 100%" border stripe>
                <el-table-column type='index' width='50px'></el-table-column>
                <el-table-column prop="authName" label="权限名称"></el-table-column>
                <el-table-column prop="path" label="路径" ></el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template  slot-scope="scope">
                        <el-tag v-if="scope.row.level=='0'">一级</el-tag>
                        <el-tag type='success' v-else-if="scope.row.level=='1'">二级</el-tag>
                        <el-tag type='warning' v-else>三级</el-tag>
                    </template>
                </el-table-column>
             </el-table>

        </el-card>







        
    </div>
</template>

<script>
export default {
    data(){
        return{
            rightslist:[]

        }
    },
    created(){
        this.getRightsList();

    },
    methods:{
        async getRightsList(){
            const {data:res}=await this.$http.get('rights/list');
            if(res.meta.status!==200)  return this.$message({message:'请求权限列表失败',
                                                                 type:'error',
                                                                showClose:true});                                        
            this.rightslist=res.data;



        }
    }
}
</script>

<style>

</style>