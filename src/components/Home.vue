<template>
  <el-container class="home-container">
    <!--头部区域  -->
    <el-header>
      <div class="header-div">
        <img src="../assets/home.png" alt="" />
        <span>电商管理后台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧边栏 -->
      <!-- 动态改变左边栏的大小 -->
      <el-aside :width="isCollapse ? '64px' :'200px'">   
      <!-- <el-aside width="200px"> -->
        <!-- 侧边栏菜单区域 -->
        <div class="toggle-button" @click="toggleCollapse" >|||</div>
        <el-menu
          background-color="#46cdcf"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id +''"  v-for="item in menulist" :key="item.id" >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">

              <!-- 一级菜单的图标 -->
              <i :class="iconsObj[item.id]"></i>

              <!-- 一级菜单的标题 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="subItem.path + ''"  v-for="subItem in item.children" :key="subItem.id" @click="getActivePath(subItem.path)">
              <template slot="title">
                <i class="el-icon-coffee"></i>
                <span class="second-authName">{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧主体 -->
      <el-main>
        <router-view>

        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  name: "Home",
  data(){
    return{
      menulist:[],
      iconsObj:{
        125:'iconfont icon-users',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao',
      },
      isCollapse: false,
      activePath:''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res);
      console.log(this.menulist);
    },
    toggleCollapse(){
      this.isCollapse =! this.isCollapse 
    },
    getActivePath(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}

.el-header {
  background-color: #48466D;
  display: flex;
  justify-content: space-between;
  color: #fff;
  align-items: center;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
        
    }
  }
  img {
    height: 50px;
    width: 43px;
  }
}

.el-menu-item{
  padding-left: 73px;
}

.second-authName{
  font-size: 12px;
}

.el-aside {
  background-color: #46cdcf;
  .el-menu{
    border-right: none;
  }
}

.el-main {
  background-color: #eeeeee;
}

.iconfont{
  margin-right: 10px;
}

.toggle-button{
  background-color: #3d84a8;
  color: #fff;
  line-height: 24px;

  // 调整间距
  letter-spacing: 0.2em;
  // 鼠标放上去变成一个小手
  cursor: pointer;

}
</style>