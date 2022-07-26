<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!--第三步、为echarts准备好dom容器  -->
      <div id="main" style="width:600px;height:400px"></div>
    </el-card>
  </div>
</template>

<script>
// 第二步、引入echarts
import * as echarts from "echarts";
// 导入深拷贝
import _ from 'lodash'

export default {
  name: "Report",
  data(){
    return{
        // options 是需要合并的数据
        options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              boundaryGap: false
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ]
        }
    }
  },
  async mounted() {
    // 第四步、基于准备好的dom容器，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    const {data:res} = await this.$http.get('reports/type/1')
    if(res.meta.status !== 200){
        return this.$message.error('获取折线图数据失败！')
    }

    // 第五步、准备数据和配置项
    const result = _.merge(res.data , this.options)

    // 第六步、展示数据
    myChart.setOption(result)
  },
};
</script>

<style>
</style>