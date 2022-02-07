/*
 * @Author: chen
 * @Date: 2021-12-24 15:13:42
 * @LastEditTime: 2022-02-05 14:44:46
 * @LastEditors: chen
 * @Description: 
 * @FilePath: \cultural-shopping\frontend-boblog\plugins\element-ui.js
 * 
 */
import Vue from 'vue'
import {
  Icon,
  Drawer,
  Dialog,
  Button,
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Loading,
  MessageBox,
  Message,
  Radio,
  RadioGroup,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Empty,
  Tag,
  Input,
  Form,
  FormItem,
  
} from 'element-ui'

import locale from 'element-ui/lib/locale/lang/en'

const components = [
  Icon,
  Button,
  Avatar,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Drawer,
  Radio,
  RadioGroup,
  Table,
  TableColumn,
  Tabs,
  TabPane,
  Empty,
  Tag,
  Input,
  Form,
  FormItem
]
const Element = {
  install(Vue) {
    components.forEach(component => {
      Vue.component(component.name, component)
    })
  }
}

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;

Vue.use(Element, { locale })
