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
  Progress,
  Avatar,
  Popover,
  InputNumber,
  Select,
  Option,
  Dialog,
  Loading,
  MessageBox
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

Vue.prototype.$loading = Loading.service
Vue.prototype.$prompt = MessageBox.prompt
