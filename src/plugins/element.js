import Vue from 'vue'
import { 
    Button, 
    Form, 
    FormItem, 
    Input, 
    Message, 
    Container, 
    Header, 
    Aside, 
    Main,
    Submenu,
    MenuItem,
    MenuItemGroup,
    Menu,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Calendar,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    CheckboxGroup,
    Checkbox,
    Upload,
    Timeline,
    TimelineItem
    } from 'element-ui'

// 导入消息弹窗
// 弹窗组件需要通过原型对象挂载全局使用
Vue.prototype.$message = Message

// 挂载messagebox的confirm函数到vue的原型对象上
Vue.prototype.$confirm = MessageBox.confirm

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Calendar)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
