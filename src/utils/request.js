// TODO 補上錯誤訊息, 移除localstorage使用者資訊

import axios from 'axios'
import useCookie from './cookie'
import useStore from '@/store/index'
import router from '@/router/index'
import i18n from '@/utils/language/i18n'
const { t } = i18n.global
const { getToken, removeToken } = useCookie()

const service = axios.create({
  baseURL: process.env.VUE_APP_BACKENDAPI
})

service.interceptors.request.use(
  (config) => {
    config.headers.Authorization = getToken()
    return config
  },
  (error) => {
    console.log(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const { msgStore } = useStore()
    const { openMsg } = msgStore
    const { data, config } = response
    const noData = data.code === 400 && data.msg === '查無資料'

    if (data.code !== 200 && data.code && !noData) {
      console.log(1212423132)
      const err = data.data?.errors
      if (data.msg === '找不到玩家帳號') {
        openMsg({
          content: [
            {
              text: t('找不到玩家帳號_站內信', { playAcc: err }),
              color: 'black'
            }
          ]
        })
      } else if (data.msg === '找不到代理帳號') {
        openMsg({
          content: [
            {
              text: t('找不到代理帳號_站內信', { agentAcc: err }),
              color: 'black'
            }
          ]
        })
      } else if (err !== 'http: no such file') {
        const errorText = Array.isArray(err) ? err.toString() : typeof err === 'string' ? err : ''
        openMsg({
          content: [
            {
              text: data.msg,
              color: 'black'
            },
            {
              text: errorText === data.msg ? '' : t(errorText),
              color: 'black'
            }
          ]
        })
      }
    } else if (data.data?.data === null || data.data?.data?.length === 0 || noData) {
      // 指定API不跳查無資料 bs/pos/xxxx
      const apiKey = ['fengkong', 'announcement', 'reconciliation']
      let showMsg = true
      apiKey.forEach((item) => {
        if (config.url.includes(item)) showMsg = false
      })

      const regex = /^\/bs\/pos\/event\/same/
      if (regex.test(response.config.url)) {
        // if (showMsg) {
        //   openMsg({
        //     content: '查無不可同時參與活動資料'
        //   })
        // }
      } else {
        if (showMsg) {
          openMsg({
            content: '查無資料'
          })
        }
      }
    }
    return response
  },
  async (error) => {
    const { msgStore } = useStore()
    const { openMsg } = msgStore
    const code = error.response.data.code
    const msgText = error.response.data.msg
    const errorText = error.response.data.errors
    if (code === 401 || code === 7777777) {
      localStorage.removeItem('login')
      // 回主頁
      removeToken()
      router.push('/')
      if (code === 7777777) {
        openMsg({
          content: '臨時維護中'
        })
      } else {
        openMsg({
          content: errorText
        })
      }
      return
    }
    if (errorText !== 'Token 已被註銷' && errorText !== '服務器很忙' && errorText !== '參數驗證錯誤') {
      openMsg({
        content: [
          {
            text: msgText ?? 'API ERROR',
            color: 'black'
          },
          {
            text: errorText,
            color: 'black'
          }
        ]
      })
    }
    return new Promise(error)
  }
)

export default service
