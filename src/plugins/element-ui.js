import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import '../assets/theme/index.css'

import {
  Button,
  Input,
  Form,
  FormItem,
  Row,
  Col,
  Slider,
  Radio,
  RadioButton,
  Progress,
  Avatar,
  Popover,
  InputNumber,
  Select,
  Option,
  Dialog,
  Loading,
  MessageBox,
  Tooltip,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Divider,
  Image,
  Checkbox,
  Message,
  InfiniteScroll
} from 'element-ui'

Vue.use(Input)
  .use(Button)
  .use(Form)
  .use(FormItem)
  .use(Row)
  .use(Col)
  .use(Slider)
  .use(Progress)
  .use(Avatar)
  .use(Popover)
  .use(InputNumber)
  .use(Select)
  .use(Option)
  .use(Dialog)
  .use(Loading.directive)
  .use(Tooltip)
  .use(Tabs)
  .use(TabPane)
  .use(Table)
  .use(TableColumn)
  .use(Divider)
  .use(Image)
  .use(Radio)
  .use(RadioButton)
  .use(Checkbox)
  .use(InfiniteScroll)


Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt