<template>
  <section>
    <h2>{{ $t('遊戲投注營收報表') }}</h2>
    <div class="searchGroup">
      <el-select v-model="gameType">
        <el-option :label="$t('所有遊戲類型')" :value="0" />
        <el-option v-for="(val, key) in gameTypeData" :key="key" :label="$t(val)" :value="key" />
      </el-select>
      <el-select v-model="company">
        <el-option :label="$t('全部遊戲商')" value="" />
        <el-option v-for="item in companyData" :key="item" :label="$t(item)" :value="item" />
      </el-select>
      <el-select v-model="playerType">
        <el-option :label="$t('全部玩家')" value="0" />
        <el-option :label="$t('正式玩家')" value="1" />
        <el-option :label="$t('體驗玩家')" value="2" />
      </el-select>
    </div>
    <DatePeriod @getDate="getDate" :newDate="newDate" :types="'daterange'">
      <template #search>
        <el-button :type="dateExist && !loading ? 'primary' : 'warning'" @click="search()"
          >{{ $t('搜尋') }}<i v-show="loading" class="fas fa-spinner fa-spin"></i
        ></el-button>
        <el-button type="primary" v-show="summaryData?.length" @click="excel">Excel</el-button>
      </template>
    </DatePeriod>
  </section>
  <!-- 概括總計 -->
  <section>
    <h2>{{ $t('概括總計') }}</h2>
    <div class="table" :style="{ height: summaryTableHeight }">
      <el-table
        :data="summaryData"
        border
        style="width: 100%"
        :height="summaryTableHeight"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('概括總計')"
        :summary-method="getSummaries"
        :show-summary="tempCompany === ''"
      >
        <el-table-column :label="$t('遊戲商')" align="center">
          <template #default="scope">
            <span v-if="scope.row.company">{{ $t(scope.row.company) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total_bet" :label="$t('總投注')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.total_bet / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column prop="total_win" :label="$t('總贏分')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.total_win / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column prop="total_win_lose" :label="$t('總輸贏')" align="center" sortable>
          <template #default="scope">
            <span v-money="(scope.row.total_win_lose / 10000) * -1"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
  <!-- 詳細資訊 -->
  <section>
    <h2 class="page">
      {{ $t('詳細資訊') }}
      <Pagination :totalPage="totalPage" :currentPage="currentPage" :pageSize="100" @changePage="getCurPage" />
    </h2>
    <div class="table" :style="{ height: detailTableHeight }">
      <el-table
        :data="detailData"
        border
        style="width: 100%"
        :height="detailTableHeight"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('詳細資訊')"
        @sort-change="sortData"
      >
        <el-table-column :label="$t('類型')" align="center">
          <template #default="scope">
            <!-- {{scope.row.game_type}} -->
            <!-- {{gameTypeData}} -->
            <span v-if="scope.row.game_type">{{ $t(gameTypeData[scope.row.game_type]) }}</span>

          </template>
        </el-table-column>
        <el-table-column :label="$t('遊戲商')" align="center">
          <template #default="scope">
            <span v-if="scope.row.company">{{ $t(scope.row.company) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('遊戲名稱')" align="center">
          <template #default="scope">
            <span v-if="scope.row.game_name">
              {{
                gameName[scope.row.company][scope.row.game_name]==undefined?
                "":
                $t(gameName[scope.row.company][scope.row.game_name]) }}
            </span>

<!-- {{scope.row.company}}
{{scope.row.game_name}}
{{gameName}} -->
          </template>
        </el-table-column>
        <el-table-column :index="0" :label="$t('總投注')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.total_bet / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :index="1" :label="$t('總贏分')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.total_win / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :index="2" :label="$t('總輸贏')" align="center" sortable>
          <template #default="scope">
            <span v-money="(scope.row.total_win_lose / 10000) * -1"></span>
          </template>
        </el-table-column>
        <el-table-column :index="3" label="RTP (%)" align="center" sortable>
          <template #default="scope">
            <span v-rtp="scope.row.rtp"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue-demi'
import DatePeriod from '@/components/date/DatePeriod'
import { getBetWinApi } from '@/api/report'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useI18n } from 'vue-i18n'
import useStore from '@/store/index'
import { money } from '@/utils/directive'
import Pagination from '@/components/Pagination'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const { msgStore, gameTypeStore } = useStore()
const { openMsg } = msgStore

// 日期
const dateData = ref({})
const newDate = ref(0)
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 遊戲類別、遊戲商、玩家類別
const gameType = ref(0)
const company = ref('')
const playerType = ref('0')

// 遊戲類別
const gameTypeData = {
  0: '其他',
  1: '捕魚',
  2: '拉霸',
  4: '鏈遊',
  8: '撲克',
  16: '賓果',
  32: '桌遊',
  128: 'Crash',
  256: '真人',
  512: '其他'
}

// 搜尋報表資料
const summaryData = ref([])
const detailData = ref([])
const totalPage = ref(0)
const loading = ref(false)
const tempCompany = ref('')
let tempDetailData = []
const search = async () => {
  if (!dateExist.value) return
  loading.value = true
  const { data } = await getBetWinApi(dateData.value, gameType.value, company.value, playerType.value)
  tempCompany.value = company.value
  if (data.code !== 200) return (loading.value = false)

  const tempData = data.data.data
  if (!Object.keys(tempData).length) {
    summaryData.value = []
    detailData.value = []
    openMsg({ content: t('查無資料') })
    loading.value = false
    return
  }

  // 概括總計資料
  summaryData.value = Object.keys(tempData).map((item) => ({
    company: item,
    total_bet: tempData[item].total_bet,
    total_win: tempData[item].total_win,
    total_win_lose: tempData[item].total_win_lose
  }))

  // 詳細資訊資料
  detailData.value = []
  Object.keys(tempData).forEach((item) => {
    detailData.value = [...detailData.value, ...tempData[item].data]
  })
  detailData.value = detailData.value.sort((a, b) => b.total_bet - a.total_bet)

  // 取得第一頁
  totalPage.value = detailData.value.length
  tempDetailData = detailData.value
  pageData(1)

  loading.value = false
}

// 概括總計表格高度
const summaryTableHeight = computed(() => {
  const otherHeight = tempCompany.value ? 35 : 75
  return !summaryData.value.length ? '115px' : `${summaryData.value.length * 40 + otherHeight}px`
})

// 詳細資訊表格高度
const detailTableHeight = computed(() => (!summaryData.value.length ? '115px' : '600px'))

// 概括總計表尾合計
const getSummaries = (param) => {
  const { columns, data } = param
  const sums = []
  columns.forEach((column, index) => {
    if (index === 0) {
      sums[index] = t('總計')
      return
    }
    const values = data.map((item) => Number(item[column.property]))
    if (!values.every((value) => Number.isNaN(value))) {
      sums[index] =
        values.reduce((prev, curr) => {
          const value = Number(curr)
          if (!Number.isNaN(value)) {
            return prev + curr
          } else {
            return prev
          }
        }, 0) / 10000
      if (column.property === 'total_win_lose') {
        sums[index] = sums[index] * -1

        // 總輸贏負值時數值為紅字
        if (sums[index] < 0) {
          nextTick(() => {
            const id = columns.filter((item) => item.property === 'total_win_lose')[0].id
            const totalWinLoseDom = document.querySelector(`.el-table__footer td.${id}`)
            totalWinLoseDom.lastChild.style.color = 'red'
          })
        }
      }
      sums[index] = money(sums[index])
    } else {
      sums[index] = 'N/A'
    }
  })
  return sums
}

// 詳細資訊排序
const sortData = ({ column, prop, order }) => {
  let type
  switch (column.index) {
    case 0:
      type = 'total_bet'
      break
    case 1:
      type = 'total_win'
      break
    case 2:
      type = 'total_win_lose'
      break
    case 3:
      type = 'rtp'
      break
  }
  if (type === 'total_win_lose') {
    tempDetailData = tempDetailData.sort((a, b) => {
      return order !== 'descending' ? a[type] * -1 - b[type] * -1 : b[type] * -1 - a[type] * -1
    })
  } else {
    tempDetailData = tempDetailData.sort((a, b) => {
      return order !== 'descending' ? a[type] - b[type] : b[type] - a[type]
    })
  }

  pageData(1)
}

// 詳細資訊分頁換算
const getCurPage = (page) => pageData(page)
const playerBetDataPage = (min, max) => {
  detailData.value = tempDetailData.filter((i, key) => key + 1 >= min && key + 1 <= max)
}
const currentPage = ref(0)
const pageData = (num) => {
  const pagNum = 100
  const min = num * pagNum - pagNum + 1
  const max = num * pagNum
  currentPage.value = num
  playerBetDataPage(min, max)
}

// 變更遊戲類別重置遊戲商
watch(gameType, () => (company.value = ''))

// 取得所有遊戲類別、所有遊戲商
const { gameData, gameName } = storeToRefs(gameTypeStore)
if (Object.keys(gameName.value).length === 0) gameTypeStore.getGames()
const companyData = ref([])
let totalCompanyData = []
let totalGameData = []

watch(
  gameData,
  () => {
    companyData.value = gameTypeStore.company
    totalCompanyData = companyData.value
    totalGameData = gameData.value.games
  },
  { immediate: true }
)

// 遊戲類別切換篩選遊戲商
watch(gameType, (val) => {
  if (val === 0) return (companyData.value = totalCompanyData)
  const tempData = totalGameData.filter((item) => item.category === +val)
  companyData.value = [...new Set(tempData.map((item) => item.studio))]
})

// excel
const excel = async () => {
  detailData.value = tempDetailData
  await nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#table'), t('遊戲投注營收報表'))
  })
  pageData(currentPage.value)
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
</style>
