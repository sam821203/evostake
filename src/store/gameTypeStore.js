import { defineStore } from 'pinia'
import { getGamesApi } from '@/api/report'

export default defineStore('gameTypeStore', {
  state: () => ({
    gameData: [],
    company: []
  }),
  actions: {
    async getGames() {
      const { data } = await getGamesApi()
      this.gameData = data.data
      this.company = [...new Set(data.data.games.map((item) => item.studio))]
    }
  },
  getters: {
    gameName() {
      const gameName = {}
      this.company.forEach((item) => {
        gameName[item] = {}
      })
      if (this.gameData?.games?.length) {
        this.gameData.games.forEach((item) => {
          gameName[item.studio][item.game_id] = item.game_name_cn
        })
      }
      return gameName
    }
  }
})
