<template>
  <div>
    <h3>欢迎来到电商管理系统</h3>
    <el-card>
      <el-calendar v-model="value"> </el-calendar>
    </el-card>
  </div>
</template>

<script>
export default{
    data(){
        return{
            value:new Date()
        }
    }
}
</script>