import { defineStore } from 'pinia'

export const userDevice = defineStore('deviceStore', {
  state: () => ({
    isMobile: false
  }),
  actions: {
    checkDevice() {
      const mobileDevice = [
        'Android',
        'webOS',
        'iPhone',
        'iPod',
        'BlackBerry',
        'Windows Phone'
      ]
      const isMobileDevice = mobileDevice.some((e) =>
        navigator.userAgent.match(e)
      )
      if (isMobileDevice) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    }
  }
})
