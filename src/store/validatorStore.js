import { defineStore } from 'pinia'
import i18n from '@/utils/language/i18n'
const { t } = i18n.global

export default defineStore('validatorStore', {
  state: () => ({
    password: ''
  }),
  actions: {
    required() {
      return { required: true, message: t('請輸入此欄位'), trigger: 'change' }
    },
    customize(status) {
      return { validator: this[status], trigger: 'change' }
    },
    checkpwd(rule, value, callback) {
      if (value === this.password) return callback()
      callback(new Error(t('確認二次密碼')))
    },
    checkLength(rule, value, callback) {
      switch (rule.field) {
        case 'nickname':
          if (value.length >= 2 && value.length <= 12) return callback()
          callback(new Error(t('格式錯誤，僅限2-12中英數')))
          break
        case 'realname':
          // \u4e00-\u9fff_&-
          if (/^[a-zA-Z]{2,60}$/.test(value) && value.length <= 60 && value.length >= 2) return callback()
          callback(new Error(t('格式錯誤，僅限2-60英文')))
          break
        case 'type':
          if (value.length >= 1 && value.length <= 25) return callback()
          callback(new Error(t('類別字數在 1 到 25 之間')))
          break
        default:
          if (value.length >= 6 && value.length <= 12) return callback()
          callback(new Error(`${t('限6-12英數')}`))
      }
    },
    checkWordInrule(type, word, minwordLength = 0, maxwordLength = 9999999) {
      let rule = ''
      switch (type) {
        case 'wordLength':
          // 純粹看長度
          rule = `^.{${minwordLength},${maxwordLength}}$`
          break
        case 'cn_en_num_symbol':
          // 限制在100個字符以內，僅允許中文、英文、數字以及符號的輸入
          // rule = `/^[a-zA-Z]{${minwordLength},${maxwordLength}}$/`
          // rule = /^[\u4e00-\u9fa5a-zA-Z0-9\u0020-\u007E]{0,100}$/
          rule = `^[\\u4e00-\\u9fa5a-zA-Z0-9\\u0020-\\u007E]{${minwordLength},${maxwordLength}}$`
          break
        case 'num':
          // 純數字，不含小數
          rule = `^\\d{${minwordLength},${maxwordLength}}$`
          break
        case 'num_decimals':
          // 含小數的數字
          rule = '^\\d+(\\.\\d+)?$'
          break
      }

      rule = new RegExp(rule)
      return (rule.test(word))
    },
    checkGarbled(rule, value, callback) {
      const regex = /^[a-zA-Z0-9_&-]{1,24}$/.test(value)
      if (regex) return callback()
      callback(new Error(`${t('只能包含字母數字字符')}、"&"、"_"、"-"`))
    }
  }
})
