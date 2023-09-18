import { defineStore } from 'pinia'

export default defineStore('msgStore', {
  state: () => ({
    title: '', // 彈窗標題
    titleDanger: false, // 彈窗標題是否為警告，當為 true 時，標題字為紅色
    content: '', // 彈窗內容 String or Array
    type: '', // 彈窗類別
    params: '', // 談窗所需參數
    hasCancel: false, // 彈窗開關
    hasBtn: true, // 是否顯示按鈕
    implement: false, //  彈窗確認執行
    rejectWithdraw: false, // 玩家提款審核 確認拒絕
    rejectTitle: '',
    rejectContent: ''
  }),
  actions: {
    openMsg({ title, titleDanger = false, content, hasBtn = true, type = 'info', params = '', rejectWithdraw = false }) {
      this.title = title
      this.titleDanger = titleDanger
      this.content = content
      this.type = type
      this.params = params
      this.hasBtn = hasBtn
      this.hasCancel = true
      this.implement = false
      this.rejectWithdraw = rejectWithdraw
    },
    operator(status = false, message) {
      return new Promise((resolve, reject) => {
        if (status) {
          resolve(message)
        } else {
          reject(new Error(message))
        }
      })
    },
    changeRejecttitle(e) {
      this.rejectTitle = e
    },
    changeRejectcontent(e) {
      this.rejectContent = e
    }

  }
})
