<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        center
        show-icon
        title="添加商品信息"
        type="info"
        :closable="false"
      ></el-alert>
      <!-- 进度条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab栏区域 -->
      <el-form
        :model="addFrom"
        :rules="addFromRules"
        ref="addFormRef"
        label-width="100px"
        label-position="left"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                expand-trigger="hover"
                :options="catelist"
                :props="cateProps"
                v-model="addFrom.goods_cat"
                @change="handleChange"
                change-on-select
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单item项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableDate"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                  size="mini"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableDate"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 表示图片要上传到后台的api地址 -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload></el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 副文本编辑器组件 -->
            <quill-editor v-model="addFrom.goods_introduce"></quill-editor>

            <!-- 添加商品按钮 -->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 对话框区域 -->
    <!-- 图片预览对话框 -->
    <el-dialog :visible.sync="previewVisible" title="图片预览">
      <img :src="previewPath" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: "Add",
  data() {
    return {
      activeIndex: 0,
      // 添加商品的表单数据对象
      addFrom: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 商品所属的分类数组
        goods_cat: [],
        // 图片的数组
        pics:[],
        // 商品介绍详情
        goods_introduce:'',
        attrs:[]
      },
      // 添加商品的表单数据对象的验证规则
      addFromRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      // 分类列表
      catelist: [],
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },

      // 动态参数列表数据
      manyTableDate: [],
      // 动态属性参数
      onlyTableDate: [],
      // 上传图片的url地址
      uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件发headers请求头
      headerObj:{
        Authorization:window.sessionStorage.getItem('token')
      },

      previewPath:'',
      previewVisible:false
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败！");
      }
      this.catelist = res.data;
    },
    // 级联选择项发生变化触发的函数
    handleChange() {
      // console.log(this.addFrom.goods_cat);
      // 判断级联选择器的范围
      if (this.addFrom.goods_cat.length !== 3) {
        this.addFrom.goods_cat = [];
      }
    },

    // 标签页切换的钩子
    beforeTabLeave(avtiveName, oldActiveName) {
      if (oldActiveName === "0" && this.addFrom.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类！");
        return false;
      }
    },

    async tabClicked() {
      // 判断访问的是动态参数面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("获取参数失败！");
        }
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableDate = res.data;
        console.log(this.manyTableDate);
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取属性失败！");
        }
        this.onlyTableDate = res.data;
        console.log(this.onlyTableDate);
      }
    },

    // 处理图片预览效果
    handlePreview(file){
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },

    // 处理移除图片的操作
    handleRemove(file){
      // console.log(file);
      // 1、获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path

      // 2、从pics数组中，找到该图片的索引值
      const i = this.addFrom.pics.findIndex(x => x.pics === filePath)

      // 3、使用splice方法，把图片信息对象，从pics中删除
      this.addFrom.pics.splice(i,1)
    },

    // 监听图片上传成功的事件
    handleSuccess(response){
      console.log(response);
      // 拼接得到一个图片信息对象
      const picsInfo = { pics : response.data.tmp_path}
      // 将图片信息对象push到pics数组中去
      this.addFrom.pics.push(picsInfo)
      console.log(this.addFrom.pics);
    },

    add(){
      this.$refs.addFormRef.validate(async valid => {
        if(!valid){
          return this.$message.error('添加商品失败，请检查必选项！')
        }
        // 执行添加的业务逻辑
        // 深拷贝
        const from = _.cloneDeep(this.addFrom)
        from.goods_cat = from.goods_cat.join(',')

        // 处理动态参数
        this.manyTableDate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addFrom.attrs.push(newInfo) 
        })
        // 处理静态属性
        this.onlyTableDate.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addFrom.attrs.push(newInfo)
        })
        from.attrs = this.addFrom.attrs
        console.log(from);

        // 发起请求添加商品
        // 商品的名单必须是唯一的
        const {data:res} = await this.$http.post('goods',from)
        if(res.meta.status !== 201){
          return this.$message.error('添加商品失败！')
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/home/goods')

      })
    }
  },
  computed: {
    cateId() {
      if (this.addFrom.goods_cat.length === 3) {
        return this.addFrom.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="less" scoped>
.cascader {
  width: 100%;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg{
  width: 100%;
}
.btnAdd{
  margin-top: 15px;
}
</style>