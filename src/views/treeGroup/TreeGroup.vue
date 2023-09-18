<template>
  <!-- 搜尋、創建編輯階級、管理員、Excel -->
  <section>
    <h2 v-if="!mobileWidth">{{ $t('代理階級') }}</h2>
    <template v-if="isTreeGroupPath">
      <p v-show="!mobileWidth" class="orderTitle">{{ $t('目前展開的階級') }}</p>
      <div class="order">
        <div class="content" v-for="(item, index) in order" :key="item.agent_id" v-show="!mobileWidth">
          <span :class="{ jump: index !== order.length - 1 }" @click="jump(item)">{{ item.name }}({{ item.nickname }})</span>
          <span v-show="order.length > 1 && order.length !== index + 1"><i class="bi bi-arrow-right"></i></span>
        </div>
        <div class="btnGroup">
          <el-button type="primary" @click="groupDetailedModal = true" v-show="canWatcherGroupDetailed && isTreeGroupPath">{{
            $t('本級資訊')
          }}</el-button>
          <el-button class="add" type="primary" @click="handlerUser('add')" v-show="canHandleTree('add', '創建')">{{
            $t(`創建${$t(childName)}`)
          }}</el-button>
          <el-button
            class="edit"
            type="primary"
            @click="handlerUser('edit')"
            v-show="canHandleTree('edit') && (targetTree.level !== groupData.level) && (groupData.level<2) && loginStore.loginData.userData?.role_name!='kefu'"
          >

            {{ $t('編輯階級') }}
          </el-button>
          <el-button class="administrator" type="primary" @click="administratorModal = true" v-if="canWatcherAdministrator">{{
            $t('管理員資訊')
          }}</el-button>
        </div>
      </div>
    </template>
    <DateChoose @getDate="getDate" :key="resetDate" :types="'daterange'">
      <template #search>
        <el-button :type="dateExist && !loading ? 'primary' : 'warning'" @click="search"
          >{{ $t('搜尋') }}<i v-show="loading" class="fas fa-spinner fa-spin"></i
        ></el-button>
        <el-button type="primary" v-show="!mobileWidth && totalTreeData.length" @click="excel">Excel</el-button>
      </template>
    </DateChoose>
  </section>
  <!-- 報表區 -->
  <div class="reportGroup" v-show="totalTreeData.length || !mobileWidth">
    <CashCheckingReport v-if="isTreeGroupPath" :totalTreeData="totalTreeData[0]" :cashCheckingReport="cashCheckingReport" />
    <section class="total">
      <h2>
        {{ $t('輸贏總匯')
        }}<el-popover placement="bottom" width="auto" trigger="hover">
          <ul class="formula" :class="{ isEn }">
            <li>
              <span>{{ $t('總輸贏') }}</span
              ><span>=</span>{{ $t('總投注 - 總贏分') }}
            </li>
            <li>
              <span>{{ $t('有效投注') }}</span
              ><span>=</span>{{ $t('本級玩家有效投注 + 下級玩家有效投注') }}
            </li>
            <li>
              <span>{{ $t('返水') }}</span
              ><span>=</span>{{ $t('有效投注 * 返水‰') }}
            </li>
            <li>
              <span>{{ $t('總淨利') }}</span
              ><span>=</span>{{ $t('總輸贏 - 返水') }}
            </li>
            <template v-if="isTreeGroupPath">
              <li>
                <span>{{ $t('分潤') }}</span
                ><span>=</span>{{ $t('總淨利 * 分潤%') }}
              </li>
              <li>
                <span>{{ $t('本級分潤') }}</span
                ><span>=</span>{{ $t('加總各類遊戲的分潤') }}
              </li>
              <li>
                <span>{{ $t('下級分潤') }}</span
                ><span>=</span>{{ $t('加總所有下級的分潤') }}
              </li>
              <li>
                <span>{{ $t('下級返水') }}</span
                ><span>=</span>{{ $t('下級代理的遊戲返水 * (本級返水 - 下級返水)') }} <br />+
                {{ $t('本級玩家的遊戲反水 * (本級返水 - 下級返水)') }}
              </li>
              <li>
                <span>{{ $t('我的獲利') }}</span
                ><span>=</span>{{ $t('本級分潤 - 下級分潤 + 下級返水') }}
              </li>
            </template>
          </ul>
          <template #reference>
            <el-icon :size="25"><InfoFilled color="#ad8d60" /></el-icon>
          </template>
        </el-popover>
      </h2>
      <TreeReportTable v-if="!mobileWidth" :detailReport="totalTreeData" tableType="total" />
      <TreeReportCard v-else :data="totalTreeData" tableType="total" />
    </section>
    <section>
      <div class="sortData">
        <h2 v-if="targetTree.level < 2">{{ $t('下級代理') }}</h2>
        <h2 class="treeGroupPage" v-else-if="targetTree.level === 8">
          {{ $t('本級玩家詳細輸贏') }}
          <Pagination v-if="!mobileWidth" :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
        </h2>
        <h2 class="treeGroupPage" v-else>
          {{ tableStatus ? $t('下級代理') : $t('本級玩家詳細輸贏') }}
          <Pagination v-if="!mobileWidth && !tableStatus" :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
        </h2>
        <div class="mobileSort"></div>
      </div>
      <div class="btnReport">
        <template v-if="targetTree.level !== 8 && targetTree.level > 1">
          <el-button type="primary" @click="changetablestatus(true)" :class="{ target: tableStatus }">{{ $t('代理') }}</el-button>
          <el-button type="primary" @click="changetablestatus(false)" :class="{ target: !tableStatus }">{{ $t('玩家') }}</el-button>
        </template>
        <Teleport to=".mobileSort" :disabled="!mobileWidth" v-if="isMounted">
          <template>
            <!-- <el-select v-model="gameType" :placeholder="$t('排序')" v-if="!tableStatus">
              <el-option :label="$t('鏈遊')" value="hash" />
              <el-option :label="$t('電子遊戲')" value="ele" />
            </el-select> -->
            <el-select v-model="sortType" @change="sortData(sortType)" :placeholder="$t('請選擇類別')" v-if="!tableStatus && gameType">
              <el-option :label="$t('最高總投注')" value="highest-bet" />
              <el-option :label="$t('最低總投注')" value="lowest-bet" />
              <el-option :label="$t('最高總贏分')" value="highest-win" />
              <el-option :label="$t('最低總贏分')" value="lowest-win" />
              <el-option :label="$t('最高總輸贏')" value="highest-win_lose" />
              <el-option :label="$t('最低總輸贏')" value="lowest-win_lose" />
              <el-option :label="$t('最高有效投注')" value="highest-rw" />
              <el-option :label="$t('最低有效投注')" value="lowest-rw" />
              <el-option :label="$t('最高返水‰')" value="highest-rw_percent" />
              <el-option :label="$t('最低返水‰')" value="lowest-rw_percent" />
              <el-option :label="$t('最高返水')" value="highest-rw_value" />
              <el-option :label="$t('最低返水')" value="lowest-rw_value" />
              <el-option :label="$t('最高應收付')" value="highest-result" />
              <el-option :label="$t('最低應收付')" value="lowest-result" />
            </el-select>
          </template>
        </Teleport>
      </div>
      <div v-if="tableStatus">
        <TreeReportTable v-if="!mobileWidth && !hide" :detailReport="detailTreeData" tableType="detail" />
        <TreeReportCard v-else :data="detailTreeData" tableType="detail" />
      </div>
      <div v-if="!tableStatus">
        <PlayerReportTable
          @changePage="changePagePlayerReportable"
          v-if="!mobileWidth && !hide"
          :data="detailPlayerData"
          :date="getDate"
          :gameNum="gameNum"
        />
        <PlayerReportCard v-else :data="detailPlayerData" />
      </div>
    </section>
    <!-- excel -->
    <PlayerReportTable v-if="hide && detailPlayerData.length" :data="detailPlayerData" :gameNum="gameNum" />
    <template v-for="(item, index) in detailTreeData" :key="index">
      <TreeReportTable v-if="hide" :detailReport="[item]" tableType="excel" />
    </template>
  </div>
  <div class="pag" v-show="mobileWidth && !tableStatus">
    <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
  </div>
  <!-- 彈窗區 -->
  <TreeModal v-model:treeModal="treeModal" :modalStatus="modalStatus" @updateOrder="orderData" />
  <AdministratorModal v-model:administratorModal="administratorModal" />
  <GroupDetailedModal v-model:groupDetailedModal="groupDetailedModal" />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import useStore from '@/store/index'
import { ref, inject, computed, nextTick, onMounted, watch } from 'vue-demi'
import { useRouter, useRoute } from 'vue-router'
import DateChoose from '@/components/date/DateChoose'
import TreeReportTable from '@/views/treeGroup/report/TreeReportTable'
import PlayerReportTable from '@/views/treeGroup/report/PlayerReportTable'
import PlayerReportCard from '@/views/treeGroup/report/PlayerReportCard'
import TreeReportCard from '@/views/treeGroup/report/TreeReportCard.vue'
import CashCheckingReport from '@/views/treeGroup/report/CashCheckingReport'
import TreeModal from '@/views/treeGroup/modal/TreeModal'
import AdministratorModal from '@/views/treeGroup/modal/AdministratorModal'
import GroupDetailedModal from '@/views/treeGroup/modal/GroupDetailedModal'
import Pagination from '@/components/Pagination'
import { getTreeReportApi, getPlayerReportApi, getCashCheckingReport } from '@/api/tree'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useI18n } from 'vue-i18n'

const { loginStore, treeStore } = useStore()
const { t } = useI18n()
const changetablestatus = (e) => {
  tableStatus.value = e
}
const isEn = localStorage.getItem('locale') === 'EN'

// 判斷是否可創建編輯階級
const canHandleTree = (status) => {
  if (groupData.value.status === 'Freeze' || (targetTree.value.level === 8 && status === 'add') || (targetTree.value.level === 6 && status === 'add')) return false
  const editStatus = groupData.value.level === targetTree.value.level - 1
  const addStatus = groupData.value.level === targetTree.value.level
  const levelStatus = status === 'add' ? addStatus : editStatus
  status = status === 'add'
  switch (loginStore.loginData.userData?.role_name) {
    case 'root':
      return true
    case 'supermaster':
      return levelStatus
    case 'watcher':
      return false
    case 'cadre':
      if (groupData.value.level && targetTree.value.level) return levelStatus
      return groupData.value.level && targetTree.value.level
    case 'kefu':
      // return false
      return levelStatus
    case 'agent':
      return levelStatus
    case 'control':
      return levelStatus
  }
}

// 判斷是否可查看本級資訊
const canWatcherGroupDetailed = computed(() => {
  if (targetTree.value.level === 0) return false
  console.log(targetTree.value.level)

  // if (targetTree.value.level >= 2) {
  //   return false
  // }
  console.log(loginStore.loginData.userData?.role_name)
  switch (loginStore.loginData.userData?.role_name) {
    case 'root':
      return true
    case 'supermaster':
      return true
    case 'watcher':
      return true
    case 'cadre':
      if (groupData.value.level === 1 || groupData.value.level === 0) return groupData.value.level !== targetTree.value.level
      return groupData.value.level !== targetTree.value.level && groupData.value.level === targetTree.value.level - 1
    case 'kefu':
      return false
    case 'control':
      if (groupData.value.level === 1 || groupData.value.level === 0) return groupData.value.level !== targetTree.value.level
      return groupData.value.level !== targetTree.value.level && groupData.value.level === targetTree.value.level - 1
    case 'agent':
      // if (targetTree.value.level <= 2) {
      //   return false
      // }
      return true
  }
})

// 判斷是否可查看管理員資訊
const canWatcherAdministrator = computed(() => {
  if (groupData.value.status === 'Freeze') return false
  console.log(groupData.value.level)
  console.log(loginStore.loginData.userData?.role_name)
  if (groupData.value.level > 2) return false
  switch (loginStore.loginData.userData?.role_name) {
    case 'root':
      return true
    case 'supermaster':
      return true
    case 'watcher':
      return true
    case 'cadre':
      if (groupData.value.level < 2) return true
      return groupData.value.level === targetTree.value.level - 1
    case 'kefu':
      return false
    case 'agent':
      return groupData.value.level >= targetTree.value.level - 1
    case 'control':
      return false
  }
})

// 日期
const dateData = ref({})
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 階級和管理員彈窗狀態
const treeModal = ref(false)
const administratorModal = ref(false)
const groupDetailedModal = ref(false)

// 階級資料
const { targetTree, treeTotal, groupData } = storeToRefs(treeStore)
const childName = computed(() => treeStore.levelText(targetTree.value.level + 1))

// 切換代理報表和玩家報表
const tableStatus = ref(true)
tableStatus.value = targetTree.value.level !== 8

// 玩家報表資料處理
const gameNum = ref(0)
const handlePlayerData = (data) => {
  // console.log(data)
  const newData = []
  data.forEach((item, index) => {
    delete item.game_detail.rlm
    delete item.game_detail.live
    if (mobileWidth.value) return
    Object.keys(item.game_detail).forEach((key) => {
      // 只取得鏈遊、體彩、電子
      item.game_detail[key].result = item.result
      item.game_detail[key].return_water_value = item.return_water_value
      item.game_detail[key].return_water_percent = item.return_water_percent
      if (key !== 'rlm' && key !== 'live') {
        newData.push({ game: key, ...item.game_detail[key], ...item, index })
      }
    })
  })
  gameNum.value = Object.keys(data[0].game_detail).length
  // return mobileWidth.value ? data : newData
  return data
}

// 代理報表資料處理
const handleTreeData = (data) => {
  data.forEach((item) => {
    delete item.game_detail.rlm
    delete item.game_detail.live
    delete item.game_detail.sport
    delete item.game_detail.goldenwind_pk
    item.total_bet = Object.values(item.game_detail).reduce((a, b) => a + b.bet, 0)
    item.total_win = Object.values(item.game_detail).reduce((a, b) => a + b.win, 0)
    item.total_winlose = Object.values(item.game_detail).reduce((a, b) => a + b.winlose, 0)
    item.total_rt = Object.values(item.game_detail).reduce((a, b) => a + b.rt, 0)
  })
  return data
}

// 我的獲利、下級反水報表公式計算
const calculateRepoet = (data) => {
  // 計算我的獲利，本級玩家上繳 + 下級上繳 - 上繳
  totalTreeData.value[0].mine_profit = data.last_result + data.last_amount - data.total_amount

  // 計算下級返水，我的獲利 + 下級分潤 - 本級分潤
  totalTreeData.value[0].last_bonus = data.mine_profit + data.last_profit - (data.total_net_win - data.total_amount)
}

// 搜尋報表資料
const totalTreeData = ref([])
const detailTreeData = ref([])
const detailPlayerData = ref([])
const cashCheckingReport = ref({})
const totalPage = ref(0)
const loading = ref(false)
let tempData = []
const search = async () => {
  // 未選日期不可搜尋
  if (!dateExist.value) return

  loading.value = true

  // 搜尋代理對帳
  const { data } = await getCashCheckingReport(targetTree.value.agent_id, dateData.value)
  cashCheckingReport.value = data.data.data
  // 搜尋代理報表
  const { data: treeData } = await getTreeReportApi(targetTree.value.agent_id, dateData.value)
  if (treeData.code !== 200) return (loading.value = false)

  // 輸贏總匯報表和下級代理報表資料處理
  totalTreeData.value = handleTreeData([treeData.data.to_agent])
  detailTreeData.value = handleTreeData(Object.values(treeData.data.from_agents))

  // 計算下級上繳，加總下級分潤
  totalTreeData.value[0].last_amount = detailTreeData.value.reduce((a, b) => a + b.total_amount, 0)

  // 計算下級分潤，加總本級總分潤
  totalTreeData.value[0].last_profit = detailTreeData.value.reduce((a, b) => a + (b.total_net_win - b.total_amount), 0)

  // 初始化本級玩家上繳
  totalTreeData.value[0].last_result = 0

  // 計算我的獲利、下級返水
  calculateRepoet(totalTreeData.value[0])

  // 開發商跟總代理不用搜尋玩家報表
  if (targetTree.value.level < 2) return (loading.value = false)

  // 搜尋玩家報表
  const { data: playerData } = await getPlayerReportApi(targetTree.value.agent_id, dateData.value)
  if (playerData.code !== 200) return (loading.value = false)

  // 下級代理報表新增代理暱稱
  detailPlayerData.value = playerData.data.data.map((item) => ({
    ...item,
    agentNickname: treeTotal.value.find((value) => value.agent_id === item.agent_id)?.nickname
  }))

  // 計算本級玩家上繳，加總玩家應收付(應收付)
  totalTreeData.value[0].last_result = detailPlayerData.value.reduce((a, b) => a + b.result, 0)

  // 計算我的獲利、下級返水(因有重新計算本級玩家上繳，所以要再執行計算一次)
  calculateRepoet(totalTreeData.value[0])

  // 玩家報表資料處理
  detailPlayerData.value = handlePlayerData(detailPlayerData.value)

  // 玩家報表分頁處理
  tempData = detailPlayerData.value
  totalPage.value = detailPlayerData.value.length / (mobileWidth.value ? 1 : gameNum.value)
  pageData(1)
  // 初始化玩家報表排序
  gameType.value = ''
  sortData.value = ''

  loading.value = false
}

// 分頁換算
const getCurPage = (page) => pageData(page)
const playerDataPage = (min, max) => {
  detailPlayerData.value = tempData.filter((i, key) => key + 1 >= min && key + 1 <= max)
}
let tempPage
const currentPage = ref(0)
const pageData = (num) => {
  tempPage = num
  const pagNum = mobileWidth.value ? 10 : gameNum.value * 10
  const min = num * pagNum - pagNum + 1
  const max = num * pagNum
  currentPage.value = num
  playerDataPage(min, max)
}

// 玩家報表排序
const gameType = ref('')
const sortType = ref('')
const sortData = (key) => {
  const str = key.split('-')
  if (str[0] === 'highest') {
    detailPlayerData.value = tempData.sort((a, b) => {
      return b.game_detail[gameType.value][str[1]] - a.game_detail[gameType.value][str[1]]
    })
  } else {
    detailPlayerData.value = tempData.sort((a, b) => {
      return a.game_detail[gameType.value][str[1]] - b.game_detail[gameType.value][str[1]]
    })
  }
  pageData(tempPage)
}
watch(gameType, () => {
  sortType.value = ''
})

// 開啟創建和編輯階級modal以及狀態
const modalStatus = ref('')
const handlerUser = (status) => {
  modalStatus.value = status
  treeModal.value = true
}

// 目前展開的階級排序
const order = ref([])
const orderData = (status) => {
  if (status) order.value = []
  const { agent_id: id } = JSON.parse(localStorage.getItem('login')).userData
  if (order.value.length === 0) {
    order.value.push(treeTotal.value.find((item) => item.agent_id === targetTree.value.agent_id))
    orderData()
  } else if (order.value[0]?.agent_id !== id) {
    const fatherData = treeTotal.value.find((item) => item.agent_id === order.value[0].father_id)
    order.value.unshift(fatherData)
    orderData()
  }
}

// 重置資料
const resetDate = ref(0)
const resetData = () => {
  totalTreeData.value = []
  detailTreeData.value = []
  detailPlayerData.value = []
  order.value = []
  dateData.value = {}
  orderData()
  gameType.value = ''
  sortType.value = ''
  resetDate.value++
  tableStatus.value = targetTree.value.level !== 8
  loading.value = false
  totalPage.value = 0
}

// 點擊不同階級、不同報表 reset
watch(targetTree, () => resetData())

// 展開階級點擊跳轉
const jump = (data) => {
  targetTree.value = data
  orderData()
}

// 無資料導回首頁
const router = useRouter()
if (Object.keys(targetTree.value).length === 0) {
  // console.log(router)
  router.push('/home')
} else {
  console.log(targetTree.value)
  orderData()
}

const route = useRoute()
const isTreeGroupPath = computed(() => route.path === '/treeGroup')

// excel
const hide = ref(false)
const excel = () => {
  hide.value = true
  detailPlayerData.value = tempData
  nextTick(() => {
    setTimeout(() => exportTableToExcel(document.querySelectorAll('#table'), t('階層報表')), 100)
  })
  setTimeout(() => {
    hide.value = false
    pageData(tempPage)
  }, 200)
}
const changePagePlayerReportable = ([type, order]) => {
  if (type.length === 1) {
    if (type[0] === 'player_account') {
      detailPlayerData.value = tempData.sort((a, b) => {
        return order === 'descending' ? a.player_account.localeCompare(b.player_account) : b.player_account.localeCompare(a.player_account)
      })
    } else {
      if (order === 'descending') {
        detailPlayerData.value = tempData.sort((a, b) => {
          return b[type[0]] - a[type[0]]
        })
      } else {
        detailPlayerData.value = tempData.sort((a, b) => {
          return a[type[0]] - b[type[0]]
        })
      }
    }
  } else {
    // descending ascending
    if (order === 'descending') {
      detailPlayerData.value = tempData.sort((a, b) => {
        return b[type[0]][type[1]] - a[type[0]][type[1]]
      })
    } else {
      detailPlayerData.value = tempData.sort((a, b) => {
        return a[type[0]][type[1]] - b[type[0]][type[1]]
      })
    }
  }

  pageData(tempPage)
}
// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')
watch(clientWidth, () => resetData())

const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
</script>

<style lang="scss" scoped>
.orderTitle {
  margin-bottom: 10px;
}

.order {
  display: flex;
  align-items: center;
  color: $dark;
  font-size: 24px;
  white-space: nowrap;
  flex-wrap: wrap;
  @include breakpoint-up('sm') {
    flex-wrap: nowrap;
    margin-top: 0;
    margin: 0;
  }
  .btnGroup {
    margin: 10px 0;
    @include breakpoint-up('sm') {
      margin: 0;
      display: flex;
      align-items: center;
      width: 100%;
      .edit {
        order: 1;
      }
      .administrator {
        order: 2;
      }
    }
  }
  .content {
    margin-bottom: 10px;
    span {
      margin-right: 10px;
    }
  }
  .jump {
    &:hover {
      color: $primary;
      cursor: pointer;
    }
  }
}

:deep .el-select {
  margin-right: 5px;
}

.btnReport {
  display: flex;
  margin-bottom: 10px;
  @include breakpoint-up('sm') {
    .el-button {
      max-width: initial;
    }
  }
}

.sortData {
  display: flex;
  justify-content: space-between;
  padding-top: 5px;
  margin-bottom: 5px;
  h2 {
    width: 100%;
  }
}

.content {
  display: flex;
  &.block {
    display: block;
  }
}

.treeGroupPage {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.mobileSort {
  display: flex;
  .el-select {
    &:first-child {
      margin-right: 5px;
    }
  }
}

.el-icon {
  margin-left: 10px;
}

.formula {
  &.isEn {
    span {
      &:first-child {
        min-width: 180px !important;
      }
    }
  }
}
</style>
