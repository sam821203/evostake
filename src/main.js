import { createApp, markRaw } from 'vue'
import { pinia } from '@/store/index'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
// import XLSX from 'xlsx'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/display.css'
import i18n from '@/utils/language/i18n'
// https://www.jianshu.com/p/23850d4cade8
// import 'default-passive-events'
import * as directive from '@/utils/directive'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// pinia匯入router方法
pinia.use(({ store }) => {
  store.$router = markRaw(router)
})

const app = createApp(App)
Object.keys(directive).forEach((item) => {
  directive[item](app)
})

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(i18n)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
// app.use(XLSX)
app.mount('#app')
