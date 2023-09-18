<template>
  <section>
    <h2 v-if="!mobileWidth">{{ $t('開洗分紀錄') }}</h2>
    <div class="searchGroup">
      <el-select v-model="searchType">
        <el-option :label="$t('全部玩家')" value="0" />
        <el-option :label="$t('玩家帳號')" value="1" />
        <el-option :label="$t('玩家暱稱')" value="2" />
        <el-option :label="$t('真實姓名')" value="3" />
        <el-option :label="$t('所屬代理 ')" value="4" />
      </el-select>
      <el-input v-show="searchType !== '0'" v-model="searchStr" />
    </div>
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
        <el-button :type="!loading ? 'primary' : 'warning'" v-show="!mobileWidth && cashInOutLogData.length" @click="excel">
          Excel<i v-show="loading" class="fas fa-spinner fa-spin"></i>
        </el-button>
      </template>
    </DateChoose>
  </section>
  <div class="reportGroup" v-if="!mobileWidth || cashInOutLogData.length">
    <section>
      <h2>{{ $t('概括總計') }}</h2>
      <div v-if="!mobileWidth" class="table" :style="{ height: cashInOutLogData.length === 0 ? '105px' : '125px' }">
        <el-table
          :data="summaryData"
          border
          style="width: 100%"
          :height="cashInOutLogData.length === 0 ? '105px' : '125px'"
          :empty-text="$t('無資料')"
          id="table"
          :data-name="$t('概括總計')"
          :span-method="objectSpanMethod"
          class="summaryData"
        >
          <el-table-column prop="time" :label="$t('起訖時間')" align="center" width="170px">
            <template #default="scope">
              <span>{{ scope.row.time?.dateFrom }}</span>
              <br />
              <span>~</span>
              <br />
              <span>{{ scope.row.time?.dateTo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="inCount" :label="$t('存款人數 / 次數')" align="center" width="150px" />
          <el-table-column prop="outCount" :label="$t('洗分人數 / 次數')" align="center" width="150px" />
          <el-table-column prop="in" :label="$t('總存款')" align="center">
            <template #default="scope">
              <span v-money="scope.row.in / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column prop="out" :label="$t('總提款')" align="center">
            <template #default="scope">
              <span v-money="scope.row.out / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column prop="bonus" :label="$t('總紅利')" align="center">
            <template #default="scope">
              <span v-money="scope.row.bonus / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column prop="chargeback" :label="$t('特殊扣款總額')" align="center">
            <template #default="scope">
              <span v-money="scope.row.chargeback / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('小計')" align="center">
            <template #default="scope">
              <span v-money="(scope.row.in - scope.row.bonus - scope.row.out - scope.row.chargeback) / 10000"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else class="mobileCard">
        <ul v-for="item in summaryData" :key="item.currency">
          <li>
            <p>{{ $t('起訖時間') }}</p>
            <p>{{ item.time.dateFrom }} ~ {{ item.time.dateTo }}</p>
          </li>
          <li></li>
          <li>
            <p>{{ $t('存款人數 / 次數') }}</p>
            <p>{{ item.inCount }}</p>
          </li>
          <li>
            <p>{{ $t('洗分人數 / 次數') }}</p>
            <p>{{ item.outCount }}</p>
          </li>
          <li>
            <p>{{ $t('總存款') }}</p>
            <p v-money="item.in / 10000"></p>
          </li>
          <li>
            <p>{{ $t('總紅利') }}</p>
            <p v-money="item.bonus / 10000"></p>
          </li>
          <li>
            <p>{{ $t('總提款') }}</p>
            <p v-money="item.out / 10000"></p>
          </li>
          <li>
            <p>{{ $t('特殊扣款總額') }}</p>
            <p v-money="item.chargeback / 10000"></p>
          </li>
          <li>
            <p>{{ $t('小計') }}</p>
            <p v-money="(item.in - item.bonus - item.out - item.chargeback) / 10000"></p>
          </li>
          <li></li>
        </ul>
      </div>
    </section>
    <section>
      <h2 class="cashInOutLogPage">
        {{ $t('詳細紀錄') }}<Pagination v-if="!mobileWidth" :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
      </h2>
      <div v-if="!mobileWidth" class="table" :style="{ height: cashInOutLogData.length === 0 ? '115px' : 'calc(100vh - 350px)' }">
        <el-table
          :data="cashInOutLogData"
          border
          style="width: 100%"
          :height="cashInOutLogData.length === 0 ? '115px' : 'calc(100vh - 350px)'"
          :empty-text="$t('無資料')"
          id="table"
          :data-name="$t('詳細報表')"
        >
          <el-table-column prop="point" :label="$t('異動時間')" align="center" width="170px">
            <template #default="scope">
              <span v-time="scope.row.time"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('玩家帳號/暱稱')" align="center" width="150px">
            <template #default="scope">
              <span>{{ scope.row.player_ac }} <br />({{ scope.row.player_nickname }})</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('所屬代理/暱稱')" align="center" width="150px">
            <template #default="scope">
              <span>{{ scope.row.agent_name }} <br />({{ scope.row.agent_nickname }})</span>
            </template>
          </el-table-column>
          <el-table-column prop="operator" :label="$t('管理員帳號')" align="center" />
          <el-table-column :label="$t('開洗分')" align="center">
            <template #default="scope">
              <span :style="{ color: cashType(scope.row) === 'in' ? 'green' : 'red' }">{{
                cashType(scope.row) === 'in' ? $t('存款') : $t('洗分')
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="upgrade" :label="$t('開洗分類型')" align="center">
            <template #default="scope">
              <span v-if="scope.row.special && (scope.row.keyin > 0 || scope.row.keyout > 0)">{{
                $t(scope.row.type === '開分' ? '優惠活動' : '特殊扣款')
              }}</span>
              <span v-else-if="scope.row.type">{{ $t(scope.row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="upgrade" :label="$t('異動額度')" align="center">
            <template #default="scope">
              <span v-money="scope.row.amount / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column prop="downgrade" :label="$t('異動前額度')" align="center">
            <template #default="scope">
              <span v-money="scope.row.before / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column prop="downgrade" :label="$t('異動後額度')" align="center">
            <template #default="scope">
              <span v-money="scope.row.after / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column prop="downgrade" :label="$t('備註')" align="center">
            <template #default="scope">
              <span>{{ scope.row.info }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="downgrade" :label="$t('操作')" align="center">
            <el-button type="primary">{{ $t('詳細資訊') }}</el-button>
            <template #default="scope">
              <span v-money="scope.row.keyout / 10000"></span>
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <template v-else v-for="item in cashInOutLogData" :key="item.playernname">
        <div class="mobileCard">
          <ul>
            <li>
              <p>{{ $t('異動時間') }}</p>
              <p v-time="item.time"></p>
            </li>
            <li></li>
            <li>
              <p>{{ $t('玩家帳號') }}</p>
              <p>{{ item.player_ac }}</p>
            </li>
            <li>
              <p>{{ $t('玩家暱稱') }}</p>
              <p>{{ item.player_nickname }}</p>
            </li>
            <li>
              <p>{{ $t('所屬代理名稱') }}</p>
              <p>{{ item.agent_name }}</p>
            </li>
            <li>
              <p>{{ $t('所屬代理暱稱') }}</p>
              <p>{{ item.agent_nickname }}</p>
            </li>
            <li>
              <p>{{ $t('管理員帳號') }}</p>
              <p>{{ item.operator }}</p>
            </li>
            <li>
              <p>{{ $t('開洗分') }}</p>
              <p :style="{ color: cashType(item) === 'in' ? 'green' : 'red' }">
                {{ cashType(item) === 'in' ? $t('存款') : $t('洗分') }}
              </p>
            </li>
            <li>
              <p>{{ $t('開洗分類型') }}</p>
              <p v-if="item.special">{{ $t(item.type === '開分' ? '優惠活動' : '特殊扣款') }}</p>
              <p v-else>{{ item.type }}</p>
            </li>
            <li>
              <p>{{ $t('異動額度') }}</p>
              <p v-money="item.amount / 10000"></p>
            </li>
            <li>
              <p>{{ $t('異動前額度') }}</p>
              <p v-money="item.before / 10000"></p>
            </li>
            <li>
              <p>{{ $t('異動後額度') }}</p>
              <p v-money="item.after / 10000"></p>
            </li>
            <li>
              <p>{{ $t('備註') }}</p>
              <p>{{ item.info ? item.info : '-' }}</p>
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
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed, inject, watch, nextTick } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import { getCashInOutLogApi } from '@/api/record'
import useStore from '@/store/index'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useI18n } from 'vue-i18n'
import { money as thousandSign } from '@/utils/directive'

const { t } = useI18n()

// 日期
const dateData = ref({})
const newDate = ref(0)
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

const { treeStore } = useStore()
const { groupData } = storeToRefs(treeStore)

// 搜尋
const cashInOutLogData = ref([])
const cashInOutLogTotalData = ref([])
const searchStr = ref('')
const searchType = ref('0')
const totalPage = ref(0)
const currentPage = ref(0)
const loading = ref(false)
let tempDateData
let tempSearchType
const search = async (page) => {
  currentPage.value = page
  if (!dateExist.value) return

  searchStr.value = searchType.value === '0' ? groupData.value.agent_id : searchStr.value
  const obj = {
    type: searchType.value,
    str: searchStr.value,
    date: dateData.value,
    currency: 'TWD',
    page
  }

  const { data } = await getCashInOutLogApi(obj)
  cashInOutLogData.value = data.data.data ?? []
  totalPage.value = data.data.total

  // excel用
  const checkDate = dateData.value.time1 === tempDateData?.time1 && dateData.value.time2 === tempDateData?.time2
  const checkSearchType = searchType.value === tempSearchType
  if (cashInOutLogTotalData.value.length && checkDate && checkSearchType) return
  loading.value = true
  obj.pagesize = totalPage.value
  const { data: totalData } = await getCashInOutLogApi(obj)
  loading.value = false
  cashInOutLogTotalData.value = totalData.data.data ?? []
  tempDateData = dateData.value
  tempSearchType = searchType.value
  handleSummary()
}
const getCurPage = (page) => search(page)

// excel
const excel = () => {
  if (loading.value) return
  const tempCashInOutLogData = cashInOutLogData.value
  cashInOutLogData.value = cashInOutLogTotalData.value
  nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#table'), t('開洗分紀錄'))
  })
  setTimeout(() => (cashInOutLogData.value = tempCashInOutLogData), 0)
}

// 計算開洗分人數/次數
const handleCashCount = (type, currency) => {
  const data = cashInOutLogTotalData.value
    .filter((item) => item[`key${type}`] > 0 && item.currency === currency && !item.special)
    .map((item) => item.player_ac)

  return `${thousandSign([...new Set(data)].length)} / ${thousandSign(data.length)}`
}

// 概括總計
const summaryData = ref([])
const handleSummary = () => {
  if (!cashInOutLogData.value.length) return (summaryData.value = [])
  const twdData = {}

  // 鑽石
  twdData.chargeback = cashInOutLogTotalData.value
    .filter((item) => item.type !== '變更門檻' && item.currency === 'TWD' && item.special && item.keyout)
    .reduce((a, b) => a + (b.amount < 0 ? b.amount * -1 : b.amount), 0)
  twdData.out = cashInOutLogTotalData.value
    .filter((item) => item.keyout > 0 && item.currency === 'TWD' && !item.special)
    .reduce((a, b) => a + b.keyout, 0)
  twdData.bonus = cashInOutLogTotalData.value
    .filter((item) => item.type !== '變更門檻' && item.currency === 'TWD' && item.special && item.keyin)
    .reduce((a, b) => a + b.amount, 0)
  twdData.in = cashInOutLogTotalData.value
    .filter((item) => item.keyin > 0 && item.currency === 'TWD' && !item.special)
    .reduce((a, b) => a + b.keyin, 0)
  twdData.inCount = handleCashCount('in', 'TWD')
  twdData.outCount = handleCashCount('out', 'TWD')
  twdData.time = dateData.value

  summaryData.value = [twdData]
}

// 合併概括總計起訖時間表頭
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex % 2 === 0) {
      return {
        rowspan: 2,
        colspan: 1
      }
    } else {
      return {
        rowspan: 0,
        colspan: 0
      }
    }
  }
}

// 開洗分類別
const cashType = (data) => {
  if (data.keyin > 0 || data.keyout > 0) {
    return data.keyin > 0 ? 'in' : 'out'
  }
  return data.amount > 0 ? 'in' : 'out'
}

// 搜尋類別切換重置
watch(searchType, () => (searchStr.value = ''))

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')
</script>

<style lang="scss" scoped>
.cashInOutLogPage {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.pag {
  margin-top: 10px;
}

:deep .summaryData {
  .el-table__row {
    &:hover {
      --el-table-row-hover-bg-color: initial;
      background: initial;
      color: $dark;
      a {
        color: $dark;
      }
    }
  }
}
</style>
