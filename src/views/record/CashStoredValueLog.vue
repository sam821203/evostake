<template>
  <section>
    <h2 v-if="!mobileWidth">{{ $t('第三方存提紀錄') }}</h2>
    <div class="searchGroup">
      <el-select v-model="searchType">
        <!-- 0417 -->
        <el-option :label="$t('全部玩家')" value="1" />
        <el-option :label="$t('玩家帳號')" value="2" />
        <el-option :label="$t('玩家暱稱')" value="3" />
      </el-select>
      <el-input v-show="searchType !== '1'" v-model="searchStr" />
    </div>
    <div class="searchGroup">
      <el-select v-model="orderScope">
        <el-option :label="$t('所有訂單')" value="0" />
        <el-option :label="$t('存款')" value="1" />
        <el-option :label="$t('提款')" value="2" />
      </el-select>
      <el-select v-model="AllStatus">
        <el-option :label="$t('所有狀態')" value="0" />
        <el-option :label="$t('訂單成功')" value="3" />
        <el-option :label="$t('手動成功')" value="5" />
        <el-option :label="$t('等待審核')" value="1" />
        <el-option :label="$t('等待確認')" value="6" />
        <el-option :label="$t('存款單處理中')" value="2" />
        <el-option :label="$t('訂單失敗')" value="4" />
        <el-option :label="$t('拒絕訂單')" value="8" />
        <el-option :label="$t('提款單處理中')" value="7" />
      </el-select>
      <el-input v-model="searchNumber" :placeholder="t('請輸入存款或提款單號')" type="number" style="width:400px"/>
    </div>
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
        <el-button :type="!loading ? 'primary' : 'warning'" v-show="!mobileWidth && cashStoredValueLogData.length" @click="excel">
          Excel<i v-show="loading" class="fas fa-spinner fa-spin"></i>
        </el-button>
      </template>
    </DateChoose>
  </section>
  <div class="reportGroup" v-show="cashStoredValueLogData.length || !mobileWidth">
    <section>
      <h2 class="title">
        {{ $t('詳細紀錄') }}<Pagination v-if="!mobileWidth" :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
      </h2>
      <div v-if="!mobileWidth" class="table" :style="{ height: cashStoredValueLogData.length === 0 ? '115px' : 'calc(100vh - 350px)' }">
        <el-table
          :data="cashStoredValueLogData"
          border
          style="width: 100%"
          :height="cashStoredValueLogData.length === 0 ? '115px' : 'calc(100vh - 350px)'"
          :empty-text="$t('無資料')"
          id="table"
          :data-name="$t('詳細報表')"
        >
          <el-table-column prop="point" :label="$t('異動時間')" align="center" width="170px">
            <template #default="scope">
              <span v-time="scope.row.time"></span>
            </template>
          </el-table-column>
          <el-table-column prop="order_id" :label="$t('交易單號')" align="center" />
          <el-table-column :label="$t('所屬代理暱稱/階級')" align="center">
            <template #default="scope">
              <span>{{ scope.row.agent_name }}</span>
              <br />
              <span>{{ $t(treeStore.levelText(scope.row.agent_level)) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('玩家帳號/暱稱')" align="center">
            <template #default="scope">
              <span>{{ scope.row.player_account }}</span>
              <br />
              <span>({{ scope.row.player_nickname }})</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('交易渠道')" align="center" width="170px">
            <template #default="scope">
              <span>{{ scope.row.tx_type }}-{{ scope.row.bank }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('交易金額')" align="center">
            <template #default="scope">
              <span v-money="+scope.row.origin_amount"></span>
            </template>
          </el-table-column>
          <!-- <el-table-column :label="$t('獲得分數')" align="center">
            <template #default="scope">
              <span v-money="scope.row.point_amount / 10000"></span>
            </template>
          </el-table-column> -->
          <el-table-column :label="$t('狀態')" align="center">
            <template #default="scope">
              <!-- <span v-if="scope.row.status">{{ $t(scope.row.status) }}</span> -->
              <span v-if="scope.row.status === '等待處理' && scope.row.type === '1'">{{ $t('存款單處理中') }}</span>
              <span v-if="scope.row.status === '等待處理' && scope.row.type === '2'">{{ $t('提款單處理中') }}</span>
              <span v-if="scope.row.status !== '等待處理'">{{ $t(scope.row.status) }}</span>
              <br />
              <el-button
                type="primary"
                v-if="scope.row.status === '等待處理' && scope.row.type === '1'"
                @click="checkRepair(scope.row.order_id)"
                >{{ $t('補單') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-else v-for="item in cashStoredValueLogData" :key="item.playernname">
        <div class="mobileCard">
          <ul>
            <li>
              <p>{{ $t('時間') }}</p>
              <p v-time="item.time"></p>
            </li>
            <li></li>
            <li>
              <p>{{ $t('交易單號') }}</p>
              <p>{{ item.order_id }}</p>
            </li>
            <li></li>
            <li>
              <p>{{ $t('所屬代理') }}</p>
              <p>{{ item.agent_name }}</p>
            </li>
            <li>
              <p>{{ $t('代理階級') }}</p>
              <p>{{ $t(treeStore.levelText(item.agent_level)) }}</p>
            </li>
            <li>
              <p>{{ $t('玩家帳號') }}</p>
              <p>{{ item.player_account }}</p>
            </li>
            <li>
              <p>{{ $t('玩家暱稱') }}</p>
              <p>{{ item.player_nickname }}</p>
            </li>
            <li>
              <p>{{ $t('存款渠道') }}</p>
              <p>{{ item.tx_type }}-{{ item.bank }}</p>
            </li>
            <li>
              <p>{{ $t('存款金額') }}</p>
              <p v-money="+item.origin_amount"></p>
            </li>
            <li>
              <p>{{ $t('獲得分數') }}</p>
              <p v-money="item.point_amount / 10000"></p>
            </li>
            <li>
              <p>{{ $t('狀態') }}</p>
              <p>
                {{ $t(item.status) }}
                <el-button type="primary" v-if="item.status === '等待處理'" @click="checkRepair(item.order_id)">{{ $t('補單') }}</el-button>
              </p>
            </li>
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
import { getCashStoredValueLogApi, handleOrderApi } from '@/api/record'
import useStore from '@/store/index'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useI18n } from 'vue-i18n'

const { treeStore, msgStore } = useStore()
const { groupData } = storeToRefs(treeStore)

const { t } = useI18n()

// 日期
const dateData = ref({})
const newDate = ref(0)
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 搜尋
const cashStoredValueLogData = ref([])
const cashStoredValueLogTotalData = ref([])
const searchStr = ref('')
const searchType = ref('1')
const orderScope = ref('0')
const AllStatus = ref('0')
const searchNumber = ref('')
const totalPage = ref(0)
const currentPage = ref(0)
const currency = ref('')
const loading = ref(false)
let tempDateData
let tempSearchType
const search = async (page) => {
  currentPage.value = page
  if (!dateExist.value) return
  // searchStr.value = searchType.value === '1' ? groupData.value.agent_id : searchStr.value
  // 0417
  // searchNumber

  let searchStrval = ''
  if (searchNumber.value) {
    searchStrval = searchNumber.value
    // searchType.value = 4
  } else if (searchStr.value) {
    searchStrval = searchStr.value
  } else {
    searchStrval = groupData.value.agent_id
  }

  const obj = {
    type: [searchNumber.value ? 4 : searchType.value, orderScope.value, AllStatus.value],
    str: searchStrval,
    date: dateData.value,
    currency: currency.value,
    page
  }

  const { data } = await getCashStoredValueLogApi(obj)
  cashStoredValueLogData.value = data.data.data ?? []
  totalPage.value = data.data.total
  // excel用
  obj.pagesize = totalPage.value
  obj.page = 1
  const checkDate = dateData.value.time1 === tempDateData?.time1 && dateData.value.time2 === tempDateData?.time2
  const checkSearchType = searchType.value === tempSearchType
  if (cashStoredValueLogTotalData.value.length && checkDate && checkSearchType) return
  loading.value = true
  const { data: totalData } = await getCashStoredValueLogApi(obj)
  loading.value = false
  cashStoredValueLogTotalData.value = totalData.data.data ?? []
  tempDateData = dateData.value
  tempSearchType = searchType.value
}
const getCurPage = (page) => search(page)

// excel
const excel = () => {
  if (loading.value) return
  const tempCashStoredValueLogData = cashStoredValueLogData.value
  cashStoredValueLogData.value = cashStoredValueLogTotalData.value
  nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#table'), t('第三方存提紀錄'))
  })
  setTimeout(() => (cashStoredValueLogData.value = tempCashStoredValueLogData), 0)
}

const { openMsg } = msgStore
const { implement, type } = storeToRefs(msgStore)

// 確認補單
let repairID
const checkRepair = (id) => {
  openMsg({
    title: t('補單作業'),
    content: [
      {
        text: isEn ? `Confirm the reorder ${id}?` : `${t('確定送交')} ${id} ${t('補單申請?')}`,
        color: 'black'
      },
      {
        text: t('請先至三方後台查詢訂單狀態'),
        color: 'black'
      }
    ],
    type: 'repair'
  })
  repairID = id
}

// 執行補單
watch(implement, async () => {
  if (implement.value) {
    if (type.value === 'repair') {
      const { data } = await handleOrderApi({ oids: [repairID], status: 5 })
      if (data.code !== 200) return
      search(1)
    }
  }
})

// 搜尋類別切換重置
watch(searchType, () => (searchStr.value = ''))

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')

const isEn = localStorage.getItem('locale') === 'EN'
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.pag {
  margin-top: 10px;
}

.reportGroup {
  section {
    border: none !important;
  }
}
</style>
