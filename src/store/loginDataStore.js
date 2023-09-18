import { defineStore } from 'pinia'
import { logoutApi } from '@/api/user'
import useCookie from '@/utils/cookie'

export default defineStore('loginDataStore', {
  state: () => ({
    loginData: JSON.parse(localStorage.getItem('login')) ?? {}
  }),
  actions: {
    setLoginData(loginRes) {
      const { setToken } = useCookie()
      const { token, data: userData } = loginRes.data.data
      this.loginData = { token, userData }
      localStorage.setItem('login', JSON.stringify({ token, userData }))
      setToken(token)
    },
    async removeLoginData() {
      const { removeToken } = useCookie()
      const { data } = await logoutApi()
      if (data.code !== 200) return false
      localStorage.removeItem('login')
      removeToken()
      this.loginData = {}
      return true
    }
  }
})
