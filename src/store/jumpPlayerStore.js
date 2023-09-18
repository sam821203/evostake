import { defineStore } from 'pinia'

export default defineStore('jumpPlayerStore', {
  state: () => ({
    pid: '',
    account: '',
    type: ''
  }),
  actions: {
    setPid(pid) {
      this.pid = pid
    },
    setAccount(account) {
      this.account = account
    },
    setType(type) {
      this.type = type
    }
  }
})
