import Vue from 'vue'
import { Button, Dialog, Form, FormItem, Menu, Submenu, MenuItem, Input, Message, MessageBox, Main, Loading, Pagination, Carousel, CarouselItem, Container, Aside, Header, ButtonGroup, Table, TableColumn, Select, Option } from 'element-ui'

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(Main)
Vue.use(Pagination)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(ButtonGroup)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$loading = Loading
// const options = {
//   lock: true,
//   text: '拼命加载中...',
//   spinner: 'el-icon-loading',
//   fullscreen: true,
//   background: 'rgba(255, 255, 255, 0.3)'
// }
// export const loadingInstance = Loading.service(options)
// let loadingCount = 0
// let loading

// const startLoading = () => {
//   loading = Loading.service({
//     lock: true,
//     text: '拼命加载中...',
//     spinner: 'el-icon-loading',
//     background: 'rgba(255, 255, 255, 0.3)'
//   })
// }

// const endLoading = () => {
//   loading.close()
// }

// export const showLoading = () => {
//   if (loadingCount === 0) {
//     startLoading()
//   }
//   loadingCount += 1
// }

// export const hideLoading = () => {
//   if (loadingCount <= 0) {
//     return
//   }
//   loadingCount -= 1
//   if (loadingCount === 0) {
//     endLoading()
//   }
// }
