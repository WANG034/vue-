<template>
  <div class="login_container">
    登录
    <div class="login_box">
      <!-- 登陆头像 -->
      <div class="avater_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFromRef"
        :model="loginFrom"
        :rules="loginFromRules"
        class="login_from"
        label-width="70px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginFrom.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item label="密码" prop="password" >
          <el-input
            v-model="loginFrom.password"
            type="password"
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="setloginFromRef">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {},
  data() {
    return {
      loginFrom: {
        username: 'admin',
        password: '123456',
      },

      // 添加表单校验规则
      loginFromRules: {
        username: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password:[
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" },
        ]
      }
    };
  },
  methods:{
    // 重置表单
    setloginFromRef(){
      this.$refs.loginFromRef.resetFields();
    },

    // 登录表单预验证
    // valid值是布尔值
    login(){
      this.$refs.loginFromRef.validate(async valid=>{
        console.log(valid);
        // 根据验证结果，判断是否发起请求 得先看在main.js是否安装axios包 
        if(!valid) return;
        const {data: res} = await this.$http.post('login', this.loginFrom);
        if(res.meta.status !== 200) return this.$message.error('密码或者账号错误！');
        this.$message.success("登录成功！")
        // 1．将登录成功之后的 token，保存到客户端的sessionStorage中
        // 1.1项目中出了登录之外的其他API接口，必须在登录之后才能访问
        // 1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        console.log('@@',res);
        window.sessionStorage.setItem('token', res.data.token)
        // 2．通过编程式导航跳转到后台主页，路由地址是/ home
        this.$router.push('/home')
      })
    }
  }
};
</script>


<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  color: aliceblue;
  font-size: 24px;
}

.login_box {
  height: 300px;
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
  // 绝对定位
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avater_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 0 10px #eee;
    padding: 5px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
  }
}

.login_from {
  position: absolute;
  bottom: 0;
  //充满盒子
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: space-between;
  margin-left: -60px;
}
</style>>

