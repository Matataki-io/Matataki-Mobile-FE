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
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Loading,
  MessageBox,
  Tooltip,
  Tabs,
  TabPane,
  Table,
  TableColumn,
  Tag,
  Divider,
  Image,
  Checkbox,
  Message,
  InfiniteScroll,
  Carousel,
  CarouselItem,
  CheckboxGroup,
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
  .use(Dropdown)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Loading.directive)
  .use(Tooltip)
  .use(Tabs)
  .use(TabPane)
  .use(Table)
  .use(TableColumn)
  .use(Tag)
  .use(Divider)
  .use(Image)
  .use(Radio)
  .use(RadioButton)
  .use(Checkbox)
  .use(InfiniteScroll)
  .use(Carousel)
  .use(CarouselItem)
  .use(CheckboxGroup)


Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt