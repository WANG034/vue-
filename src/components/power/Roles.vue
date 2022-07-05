<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表数据 -->
      <el-table :data="rolesList" stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightsById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="8">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="16">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightsById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
                    {{scope.row}}    
                    </pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button size="mini" type="warning" icon="el-icon-setting" 
            @click="showRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加权限对话框 -->
    <el-dialog
      title="添加权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() { 
    return {
        rolesList: [],

        // 控制权限分配对话框的显示与隐藏
        setRightDialogVisible:false,

        // 权限列表存放位置
        rightsList:[],

        // 树形控件的属性绑定对象
        treeProps:{
            label:'authName',
            children:'children'
        },

        // 默认选中的节点id值得数组
        defKeys:[],

        // 当前即将分配角色的id
        roleId: ''

    
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("请求角色列表失败！");
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },

    // 根据id删除对应的权限
    async removeRightsById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除！");
      }
      // console.log('删除成功');
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败！");
      }

      // this.getRolesList()
      // 将服务器返回的最新的权限，直接赋值给当前的children，提高用户体验
      role.children = res.data;
    },

    // 显示权限对话框
    async showRightDialog(role){

        this.roleId = role.id
        // 获取所有权限的数据
        const {data:res} = await this.$http.get('rights/tree')
        if(res.meta.status !==200){
            return this.$message.error('获取权限列表失败')
        }
        this.rightsList = res.data
        console.log(this.rightsList);

        // 通过递归获取所有的三级节点id
        this.getLeafKeys(role, this.defKeys)

        this.setRightDialogVisible=true
    },

    // 通过递归的形式，获取角色下所有的三级权限的id，并保存到defKeys
    getLeafKeys(node,arr){
        // 如果当前节点不包含children，则是三级节点
        if(!node.children){
            return arr.push(node.id)
        }

        // 循环当前node里的所有数组
        node.children.forEach(item => {
           this.getLeafKeys(item,arr)
        });
    },

    // 监听权限分配的对话框
    setRightDialogClosed(){
        // 清空三级权限节点数组
        this.defKeys=[]
    },

    // 点击分配权限
    async allotRights(){
        const keys = [
            // 使用展开字符，把两个数组合成一个新的数组
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]

        // console.log(keys);
        const idStr = keys.join(',')

        // 发起添加权限的请求
        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
        if(res.meta.status !== 200){
            return this.$message.error('授予权限失败！')
        }

        this.$message.success('授予权限成功！')

        // 刷新角色列表
        this.getRolesList()

        // 关闭对话框
        this.setRightDialogVisible=false
    }
  },
};
</script>

<style lang='less' scoped>
.el-tag {
  margin-top: 7px;
  margin-left: 12px;
  margin-bottom: 7px;
}

.bdtop {
  border-top: solid 1px #eee;
}

.bdbottom {
  border-bottom: solid 1px #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>