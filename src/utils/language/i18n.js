import { createI18n } from 'vue-i18n'

import tw from './zh-TW'
import cn from './zh-CN'
import en from './EN'

// 多國語系
const i18n = createI18n({
  globalInjection: true, // 全域注入，可在 <template> 可以使用 $t
  legacy: false,
  locale: localStorage.getItem('locale') ?? 'zh-TW',
  fallbackWarn: false,
  missingWarn: false, // 關閉警告
  messages: {
    'zh-CN': cn,
    'zh-TW': tw,
    EN: en
  }
})

export default i18n
