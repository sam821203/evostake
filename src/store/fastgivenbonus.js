import { defineStore } from 'pinia'

export default defineStore('fastgivenbonus', {
  state: () => ({
    refreshgroupBool: true,
    jumpTotree: '',
    thisFastBonus: {
      group_name: '',
      bonus: '',
      threshold_type: '',
      threshold: '',
      memo: ''
    }
  }),
  actions: {
    setthisFastBonus(data, key = null) {
      console.log(data)
      if (key == null) {
        if (data) {
          this.thisFastBonus = data
        } else {
          this.thisFastBonus = {
            group_name: '',
            bonus: '',
            threshold_type: '',
            threshold: '',
            memo: ''
          }
        }
      } else {
        this.thisFastBonus[key] = data
      }
    },
    async refreshFunc() {
      this.refreshgroupBool = !this.refreshgroupBool
      console.log(this.refreshgroupBool)
    },
    async getrefreshBool() {
      return this.refreshgroupBool
    },
    async changejumpTotree(e) {
      this.jumpTotree = e
    }
  }

})
