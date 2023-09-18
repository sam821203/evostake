<template>
  <section>
    <h2 v-if="!mobileWidth">{{ $t('玩家數據報表') }}</h2>
    <div class="searchGroup" v-if="groupData.level < 2">
      <el-select v-model="agentType" :disabled="playerType !== 0">
        <el-option :label="$t('全部代理')" :value="0" />
        <el-option :label="$t('代理帳號')" :value="6" />
        <el-option :label="$t('一級代理')" :value="1" />
        <el-option :label="$t('二級代理')" :value="2" />
        <el-option :label="$t('三級代理')" :value="3" />
        <el-option :label="$t('四級代理')" :value="4" />
        <el-option :label="$t('五級代理')" :value="5" />
      </el-select>
      <el-input v-show="agentType === 6" v-model="searchStr" />
    </div>
    <div class="searchGroup">
      <el-select v-model="playerType">
        <el-option :label="$t('全部玩家')" :value="0" />
        <el-option :label="$t('玩家帳號')" :value="3" />
        <el-option :label="$t('真實姓名')" :value="4" />
        <el-option :label="$t('玩家暱稱')" :value="5" />
        <el-option :label="$t('身分證')" :value="6" />
      </el-select>
      <el-input v-show="playerType !== 0" v-model="searchStr" />
    </div>
    <DateChoose @getDate="getDate" :newDate="newDate" ref="dateChoose">
      <template #search>
        <el-button :type="dateExist && !loading ? 'primary' : 'warning'" @click="search"
          >{{ $t('搜尋') }}<i v-show="loading" class="fas fa-spinner fa-spin"></i
        ></el-button>
        <el-button type="primary" v-show="!mobileWidth && playerDataReport.agent?.length" @click="excel">Excel</el-button>
      </template>
    </DateChoose>
  </section>
  <!-- 所屬代理總匯 -->
  <div class="reportGroup" v-if="!mobileWidth || playerDataReport.player?.length">
    <section>
      <h2>{{ $t('所屬代理總匯') }}</h2>
      <div v-if="!mobileWidth" class="table" :style="{ height: agentDataStatus ? '115px' : 'calc(100vh - 350px)' }">
        <keep-alive>
          <el-table
            :data="playerDataReport.agent"
            border
            style="width: 100%"
            :height="agentDataStatus ? '115px' : 'calc(100vh - 350px)'"
            :empty-text="$t('無資料')"
            id="table"
            :data-name="$t('代理總匯')"
          >
            <el-table-column prop="name" :label="$t('代理帳號/暱稱')" align="center">
              <template #default="scope">
                <span>{{ scope.row.agent_name }}/{{ scope.row.agent_nickname }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="total.in" :label="$t('玩家存款')" align="center" sortable>
              <template #default="scope">
                <span v-money="scope.row.total.in / 10000"></span>
              </template>
            </el-table-column>
            <el-table-column prop="total.out" :label="$t('玩家提款')" align="center" sortable>
              <template #default="scope">
                <span v-money="scope.row.total.out / 10000"></span>
              </template>
            </el-table-column>
            <el-table-column prop="bonus" :label="$t('玩家紅利')" align="center" sortable>
              <template #default="scope">
                <span v-money="scope.row.bonus / 10000"></span>
              </template>
            </el-table-column>
            <el-table-column prop="total.balance" :label="$t('玩家餘額')" align="center" sortable>
              <template #default="scope">
                <span v-money="scope.row.total.balance / 10000"></span>
              </template>
            </el-table-column>
            <el-table-column prop="valid_bet" :label="$t('有效投注')" align="center" sortable>
              <template #default="scope">
                <span v-money="scope.row.valid_bet / 10000"></span>
              </template>
            </el-table-column>
            <el-table-column prop="win_lose" :label="$t('總輸贏')" align="center" sortable>
              <template #default="scope">
                <span v-money="scope.row.win_lose / 10000"></span>
              </template>
            </el-table-column>
          </el-table>
        </keep-alive>
      </div>
      <template v-else v-for="item in playerDataReport.agent" :key="item.agent_name">
        <div class="mobileCard">
          <ul>
            <li>
              <p>{{ $t('代理帳號') }}</p>
              <p>{{ item.agent_name }}</p>
            </li>
            <li>
              <p>{{ $t('代理暱稱') }}</p>
              <p>{{ item.agent_nickname }}</p>
            </li>
            <li>
              <p>{{ $t('玩家存款') }}</p>
              <p v-money="item.total.in / 10000"></p>
            </li>
            <li>
              <p>{{ $t('玩家提款') }}</p>
              <p v-money="item.total.out / 10000"></p>
            </li>
            <li>
              <p>{{ $t('玩家紅利') }}</p>
              <p v-money="item.bonus / 10000"></p>
            </li>
            <li>
              <p>{{ $t('玩家餘額') }}</p>
              <p v-money="item.total.balance / 10000"></p>
            </li>
            <li>
              <p>{{ $t('有效投注') }}</p>
              <p v-money="item.valid_bet / 10000"></p>
            </li>
            <li>
              <p>{{ $t('總輸贏') }}</p>
              <p v-money="item.win_lose / 10000"></p>
            </li>
          </ul>
        </div>
      </template>
    </section>
    <!-- 玩家資訊 -->
    <section>
      <h2 class="playerPage">
        <div>
          {{ $t('玩家資訊') }}
          <span v-if="!playerDataStatus" class="info">
            {{ $t('活躍數 / 總人數') }}: {{ playerCount.twdActiveCount }} / {{ playerCount.totalPlayerCount }}
            <span class="createPlayerCount">{{ $t('註冊人數') }}: {{ playerCount.createPlayerCount }}</span>
          </span>
        </div>
        <Pagination v-if="!mobileWidth" :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
      </h2>
      <div v-if="!mobileWidth" class="table" :style="{ height: playerDataStatus ? '115px' : 'calc(100vh - 350px)' }">
        <el-table
          :data="playerData"
          border
          style="width: 100%"
          :height="playerDataStatus ? '115px' : 'calc(100vh - 350px)'"
          :empty-text="$t('無資料')"
          id="table"
          :data-name="$t('玩家資訊')"
          @sort-change="sortData"
        >
          <el-table-column :index="0" :label="$t('玩家帳號')" align="center" sortable>
            <template #default="scope">
              <span class="jumpLink" @click="showPlayerTotalModal(scope.row)">{{ scope.row.account }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('玩家暱稱')" align="center">
            <template #default="scope">
              <span>{{ scope.row.nickname }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('所屬代理')" align="center">
            <template #default="scope">
              <span>{{ scope.row.agent_name }}</span>
            </template>
          </el-table-column>
          <el-table-column :index="1" prop="bet" :label="$t('總投注')" align="center" sortable>
            <template #default="scope">
              <span v-money="scope.row.bet / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column :index="2" prop="win" :label="$t('總贏分')" align="center" sortable>
            <template #default="scope">
              <span v-money="scope.row.win / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column :index="3" prop="valid_bet" :label="$t('有效投注')" align="center" sortable>
            <template #default="scope">
              <span v-money="scope.row.valid_bet / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column :index="4" prop="win_lose" :label="$t('總輸贏')" align="center" sortable>
            <template #default="scope">
              <span v-money="scope.row.win_lose / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column :index="5" prop="range.in" :label="$t('存款')" align="center" sortable>
            <template #default="scope">
              <span v-money="scope.row.range.in / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column :index="6" prop="range.out" :label="$t('提款')" align="center" sortable>
            <template #default="scope">
              <span v-money="scope.row.range.out / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column :index="7" prop="bonus" :label="$t('紅利')" align="center" sortable>
            <template #default="scope">
              <span v-money="scope.row.bonus / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column :index="8" prop="balance" :label="$t('玩家餘額')" align="center" sortable>
            <template #default="scope">
              <span v-money="scope.row.balance / 10000"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-else v-for="item in playerData" :key="item.agent_name">
        <div class="mobileCard">
          <ul>
            <li>
              <p>{{ $t('玩家帳號') }}</p>
              <p class="account" @click="showPlayerTotalModal(item)">{{ item.account }}</p>
            </li>
            <li>
              <p>{{ $t('玩家暱稱') }}</p>
              <p>{{ item.nickname }}</p>
            </li>
            <li>
              <p>{{ $t('所屬代理') }}</p>
              <p>{{ item.agent_name }}</p>
            </li>
            <li>
              <p>{{ $t('總投注') }}</p>
              <p v-money="item.bet / 10000"></p>
            </li>
            <li>
              <p>{{ $t('總贏分') }}</p>
              <p v-money="item.win / 10000"></p>
            </li>
            <li>
              <p>{{ $t('有效投注') }}</p>
              <p v-money="item.valid_bet / 10000"></p>
            </li>
            <li>
              <p>{{ $t('總輸贏') }}</p>
              <p v-money="item.win_lose / 10000"></p>
            </li>
            <li>
              <p>{{ $t('存款') }}</p>
              <p v-money="item.range.in / 10000"></p>
            </li>
            <li>
              <p>{{ $t('提款') }}</p>
              <p v-money="item.range.out / 10000"></p>
            </li>
            <li>
              <p>{{ $t('紅利') }}</p>
              <p v-money="item.bonus / 10000"></p>
            </li>
            <li>
              <p>{{ $t('玩家餘額') }}</p>
              <p v-money="item.balance / 10000"></p>
            </li>
            <li></li>
          </ul>
        </div>
      </template>
    </section>
  </div>
  <div class="pag" v-show="mobileWidth">
    <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
  </div>
  <keep-alive>
    <PlayerDataModal v-model:playerDataModal="playerDataModal" :detailData="detailData" />
  </keep-alive>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, nextTick, computed, watch, inject, onMounted } from 'vue-demi'
import { exportTableToExcel } from '@/utils/useExportExcel'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import PlayerDataModal from '@/views/report/playerDataReport/modal/PlayerDataModal'
import useStore from '@/store/index'
import { getPlayerDataReportApi } from '@/api/report'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
const route = useRoute()
const { t } = useI18n()
const dateChoose = ref(null)
const { treeStore, jumpPlayerStore } = useStore()
const { groupData } = storeToRefs(treeStore)

// 日期
const dateData = ref({})
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 點選玩家帳號取得 pid 查看詳細資訊
const detailData = ref({})

// 玩家詳細資訊
const playerDataModal = ref(false)

const showPlayerTotalModal = (data) => {
  playerDataModal.value = true
  detailData.value = data
}

const agentType = ref(0)
const playerType = ref(0)
const searchStr = ref(0)
const totalPage = ref(0)
const playerDataReport = ref({})
const loading = ref(false)
let tempPlayerData = []
const search = async () => {
  if (!dateExist.value) return

  loading.value = true
  let searchType = 0

  // 指定搜尋玩家帳號、姓名、暱稱、身分證
  if (playerType.value !== 0) {
    searchType = playerType.value
  }

  // 指定代理帳號
  if (agentType.value === 6) {
    searchType = 2
  }

  // 指定一級~五級代理
  if (agentType.value < 6 && agentType.value !== 0) {
    searchType = 1
    searchStr.value = agentType.value
  }

  const { data } = await getPlayerDataReportApi(dateData.value, searchType, searchStr.value)

  loading.value = false
  if (data.code !== 200) return

  playerDataReport.value = data.data
  // 沒有餘額(balance)補0
  playerDataReport.value.agent.forEach((item, index) => {
    if (item.total.balance === undefined) {
      playerDataReport.value.agent[index].total.balance = 0
    }
  })
  // 取得第一頁
  totalPage.value = playerDataReport.value.player.length
  tempPlayerData = playerDataReport.value.player
  pageData(1)

  // 計算活躍人數、註冊人數
  calculatePlaterCount()
}

// 計算活躍人數、註冊人數
const playerCount = ref({})
const calculatePlaterCount = () => {
  playerCount.value.createPlayerCount = playerDataReport.value.agent.reduce((a, b) => a + b.new_player, 0)
  playerCount.value.totalPlayerCount = playerDataReport.value.player.length
  playerCount.value.twdActiveCount = 0

  playerDataReport.value.player.forEach((item) => {
    const { range } = JSON.parse(JSON.stringify(item))
    Object.keys(range).forEach((item) => {
      delete range[item].win_lose
      delete range[item].balance
    })

    if (Object.values(range).some((e) => e > 0)) playerCount.value.twdActiveCount++
  })
}

// 分頁換算
const playerData = ref([])
const getCurPage = (page) => pageData(page)
const playerDataPage = (min, max) => {
  console.log(min)
  console.log(max)
  playerData.value = tempPlayerData.filter((i, key) => key + 1 >= min && key + 1 <= max)
}
let tempPage
const currentPage = ref(0)
const pageData = (num) => {
  tempPage = num
  const pagNum = 100
  const min = num * pagNum - pagNum + 1
  const max = num * pagNum
  currentPage.value = num
  playerDataPage(min, max)
}

// 玩家資訊排序目標
const sortData = ({ column, prop, order }) => {
  let type
  switch (column.index) {
    case 0:
      type = 'account'
      break
    case 1:
      type = 'bet'
      break
    case 2:
      type = 'win'
      break
    case 3:
      type = 'valid_bet'
      break
    case 4:
      type = 'win_lose'
      break
    case 5:
      type = 'in'
      break
    case 6:
      type = 'out'
      break
    case 7:
      type = 'bonus'
      break
    case 8:
      type = 'balance'
      break
  }
  if (type === 'account') {
    tempPlayerData = tempPlayerData.sort((a, b) => {
      return order === 'descending' ? a.account.localeCompare(b.account) : b.account.localeCompare(a.account)
    })
  } else if (type === 'in' || type === 'out') {
    tempPlayerData = tempPlayerData.sort((a, b) => {
      return (order === 'descending' ? b.range[type] : a.range[type]) - (order === 'descending' ? a.range[type] : b.range[type])
    })
  } else {
    tempPlayerData = tempPlayerData.sort((a, b) => {
      return (order === 'descending' ? b[type] : a[type]) - (order === 'descending' ? a[type] : b[type])
    })
  }
  pageData(1)
}

// 代理總匯是否為空或是只有1筆
const agentDataStatus = computed(() => !playerDataReport.value.agent?.length)

// 玩家資訊資料是否為空或是只有1筆
const playerDataStatus = computed(() => !playerDataReport.value.player?.length)

// excel
const excel = async () => {
  const tempAgentData = [...playerDataReport.value.agent]

  // 代理總匯
  playerDataReport.value.agent.length = 0
  tempAgentData.forEach((item) => {
    playerDataReport.value.agent.push({ ...item, type: 'twd' })
  })

  // 玩家資訊
  playerData.value.length = 0
  tempPlayerData.forEach((item) => {
    playerData.value.push({ ...item, type: 'twd' })
  })

  await nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#table'), t('玩家數據報表'))
  })

  playerDataReport.value.agent = [...tempAgentData]
  pageData(tempPage)
}

watch(playerType, (val) => {
  if (val !== 0) {
    agentType.value = 0
    searchStr.value = ''
  }
})

watch(agentType, (val) => {
  if (val === 0 && playerType.value === 0) searchStr.value = 0
  if (val === 6) searchStr.value = ''
})

// 玩家資訊跳轉過來搜尋玩家
const newDate = ref(0)
const jumpSearch = () => {
  if (route.params.startTime && route.params.endTime) {
    playerType.value = 3
    // newDate.value = 30
    // 0711

    setTimeout(() => {
      searchStr.value = route.params.jumpParam
      dateChoose.value.changeDate(route.params.startTime, route.params.endTime)
      search()
      jumpPlayerStore.setAccount('')
    }, 0)
  } else {
    playerType.value = 3
    newDate.value = 30
    setTimeout(() => {
      searchStr.value = route.params.jumpParam
      search()
      jumpPlayerStore.setAccount('')
    }, 0)
  }
}

onMounted(() => {
  // 玩家資訊跳轉過來搜尋玩家
  if (route.params.jumpParam) {
    jumpSearch()
    document.documentElement.style.overflowY = 'initial'
  }
})

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')
</script>

<style lang="scss" scoped>
.playerPage {
  display: flex;
  justify-content: space-between;
  align-content: center;
  .info {
    font-size: 16px;
    .createPlayerCount {
      margin-left: 10px;
    }
    @include breakpoint-up('sm') {
      display: block;
    }
  }
}
</style>
