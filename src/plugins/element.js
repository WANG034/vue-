import Vue from 'vue'
import { Button,Form,FormItem,Input,Message } from 'element-ui'

// 导入消息弹窗
// 弹窗组件需要通过原型对象挂载全局使用
Vue.prototype.$message = Message

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
