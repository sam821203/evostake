import { defineStore } from 'pinia'
import { getGroupApi, getTreeApi } from '@/api/tree'
import useStore from '@/store/index'

export default defineStore('treeDataStroe', {
  state: () => ({
    groupData: JSON.parse(localStorage.getItem('groupData')) ?? {},
    lobbyStyle: [],
    treeTotal: [],
    newTreeData: {},
    targetTree: {},
    name: '',
    treeModalStatus: ''
  }),
  actions: {
    async getGroupData(editGroup) {
      if (!editGroup) {
        const { loginStore } = useStore()
        const { logingroup, role_name: name } = loginStore.loginData.userData
        this.name = name
        if (!logingroup) return
        const { data } = await getGroupApi(logingroup)
        if (data.code !== 200) return
        this.groupData = data.data.data
        this.lobbyStyle = data.data.lobby_style
        localStorage.setItem('groupData', JSON.stringify(this.groupData))
      } else {
        return await getGroupApi(editGroup)
      }
    },
    async getTreeData() {
      const { loginStore } = useStore()
      const { logingroup } = loginStore.loginData.userData
      if (!logingroup) return
      const { data } = await getTreeApi(logingroup)
      if (data.code !== 200) return
      this.treeTotal = data.data.data
      this.handTreeData()
    },
    getTargetTree(data) {
      this.targetTree = data
    },
    handTreeData() {
      const allData = new Map()
      this.treeTotal.forEach((item) => {
        item.children = []
        item.label = item.name
        allData.set(item.agent_id, item)
      })
      allData.forEach((item) => {
        if (allData.has(item.father_id)) {
          allData.get(item.father_id).children.push(item)
        }
      })
      allData.forEach((item) => {
        item.children.sort((a, b) => a.name.localeCompare(b.name))
      })
      this.newTreeData = allData.get(this.groupData.agent_id)
      // this.mytree(this.newTreeData)
    },
    // mytree(node) {
    //   if (node.children == null) {
    //     return
    //   }
    //   node.children.forEach((element) => {
    //     this.mytree(element)
    //   })
    // },
    levelText(level, name) {
      const { loginStore } = useStore()
      if (!Object.keys(loginStore.loginData).length) return '查無代理'
      switch (level) {
        case 0:
          return name === 'cadre' ? '主管' : name === 'watcher' ? '財會' : '開發商'
        case 1:
          if (name === 'cadre') return '幹部'
          if (name === 'kefu') return '遊戲客服'
          if (name === 'watcher') return '財務'
          if (name === 'shareholder') return '股東'
          if (name === 'control') return '客服主管'
          return '總代理'
        case 2:
          return name === 'cadre' ? '幹部' : '一級代理'
        case 3:
          return name === 'cadre' ? '幹部' : '二級代理'
        case 4:
          return name === 'cadre' ? '幹部' : '三級代理'
        case 5:
          return name === 'cadre' ? '幹部' : '四級代理'
        case 6:
          return name === 'cadre' ? '幹部' : '五級代理'
        case 7:
          return name === 'cadre' ? '幹部' : '六級代理'
        case 8:
          return name === 'cadre' ? '幹部' : '七級代理'
        default:
          return '查無代理'
      }
    },
    getModalStatus(status) {
      this.treeModalStatus = status
    },

    checkAgent(array) {
      const { loginStore } = useStore()
      let s = false
      for (let i = 0; i < array.length; i++) {
        const el = array[i]
        if (this.levelText(this.groupData.level, loginStore.loginData.userData?.role_name) === el) {
          s = true
        }
      }
      return s
    }

  },
  getters: {
    root() {
      return this.name === 'root'
    },
    watcher() {
      return this.name === 'watcher'
    },
    supermaster() {
      return this.name === 'supermaster'
    },
    cadre() {
      return this.name === 'cadre'
    },
    withdrawer() {
      return this.name === 'withdrawer'
    },
    agent() {
      return this.name === 'agent'
    },
    kefu() {
      return this.name === 'kefu'
    },
    control() {
      return this.name === 'control'
    },
    shareholder() {
      return this.name === 'shareholder'
    }
  }
})
