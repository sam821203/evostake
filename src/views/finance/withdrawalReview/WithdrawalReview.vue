<template>
  <audio :src="require('@/assets/remind.mp3')" ref="remindSound"></audio>
  <section>
    <h2>{{ $t('玩家提款審核') }}</h2>
    <div class="container">
      <div class="searchGroup">
        <el-select v-model="searchStatus">
          <el-option :label="$t('所有狀態')" :value="0" />
          <el-option :label="$t('審核中')" :value="1" />
          <el-option :label="$t('確認中')" :value="6" />
          <el-option :label="$t('已派發')" :value="2" />
          <el-option :label="$t('拒絕')" :value="8" />
        </el-select>
        <el-select v-model="searchType">
          <el-option :label="$t('全部玩家')" :value="2" />
          <el-option :label="$t('玩家ID')" :value="3" />
          <el-option :label="$t('玩家帳號')" :value="4" />
          <el-option :label="$t('玩家暱稱')" :value="5" />
          <el-option :label="$t('真實姓名')" :value="6" />
          <el-option :label="$t('所屬代理')" :value="7" />
        </el-select>
        <el-input v-model="searchStr" v-show="searchType !== 2" />
        <el-input v-model="searchOddNum" :placeholder="$t('請輸入提款單號')" />
      </div>
      <div v-if="withdrawalReviewData.length">
        <el-button v-if="canHandlerCheck()" type="primary" class="danger" @click="handleTotal('check')">{{ $t('一鍵審核設定') }}</el-button>
        <el-button v-if="canHandlerReview()" type="primary" class="danger" @click="handleTotal('review')">{{
          $t('一鍵確認設定')
        }}</el-button>
      </div>
    </div>
    <DateChoose @getDate="getDate" :newDate="0" ref="dateChoose" :key="resetDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
        <el-button :type="!loading ? 'primary' : 'warning'" v-show="withdrawalReviewData.length" @click="excel">
          Excel<i v-show="loading" class="fas fa-spinner fa-spin"></i>
        </el-button>
      </template>
    </DateChoose>
  </section>
  <section>
    <h2 class="page">
      <div>
        {{ $t('提款資訊') }}

        <el-popover placement="bottom" width="auto" trigger="hover">
          <ul class="formula" :class="{ isEn }">
            <li>
              <span>{{ $t('審核 = 第一階段出款步驟，通過後進入第二步驟。') }}</span>
            </li>
            <li>
              <span>{{ $t('確認 = 第二階段出款步驟，通過後執行出款。') }}</span>
            </li>
            <li>
              <span>{{ $t('兩個步驟可由不同權限(單位)分開執行。') }}</span>
            </li>
          </ul>
          <template #reference>
            <el-icon :size="25"><InfoFilled color="#ad8d60" /></el-icon>
          </template>
        </el-popover>

        <span class="time">
          {{ $t('下次更新時間') }}:
          <span v-if="runTime">{{ moment(time).format('mm:ss') }}</span>
          <span v-else
            >{{ $t('已停止') }}
            <i class="bi bi-arrow-clockwise" @click="runUpdateSearch" v-if="dateChoose?.time === 0"></i>
          </span>
        </span>
      </div>
      <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
    </h2>
    <div class="table" :style="{ height: withdrawalReviewData.length === 0 ? '105px' : 'calc(100vh - 400px)' }">
      <el-table
        :data="withdrawalReviewData"
        border
        style="width: 100%"
        :height="withdrawalReviewData.length === 0 ? '105px' : 'calc(100vh - 400px)'"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('提款資訊')"
      >
        <el-table-column :label="$t('提款時間')" align="center" width="170">
          <template #default="scope">
            <span v-time="scope.row.created_at"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('提款單號')" align="center">
          <template #default="scope">
            <span v-omitFirst="scope.row.oid"></span>
          </template>
        </el-table-column>
        <el-table-column prop="account" :label="$t('玩家帳號')" align="center" />
        <el-table-column prop="real_name" :label="$t('真實姓名')" align="center" />
        <el-table-column prop="agent" :label="$t('所屬代理')" align="center" />
        <el-table-column :label="$t('提款金額')" align="center">
          <template #default="scope">
            <span v-money="scope.row.amount / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('狀態')" align="center">
          <template #default="scope">
            <span :class="currStatus(scope.row.status)">{{ currStatus(scope.row.status, true) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('出款時間')" align="center" width="170">
          <template #default="scope">
            <span v-if="scope.row.finish_at" v-time="scope.row.finish_at"></span>
            <span v-else></span>
          </template>
        </el-table-column>
        <template v-if="!hide">
          <el-table-column :label="$t('備註')" align="center">
            <template #default="scope">
              <el-popover v-if="scope.row.memo1 || scope.row.memo2" placement="bottom" width="auto" trigger="hover">
                <ul>
                  <li v-if="scope.row.memo1">{{ $t('審核備註') }}: {{ scope.row.memo1 }}</li>
                  <li v-if="scope.row.memo2">{{ $t('確認備註') }}: {{ scope.row.memo2 }}</li>
                </ul>
                <template #reference>
                  <span v-if="scope.row.memo1" v-omitLast="`${$t('審核備註')}: ${scope.row.memo1}`"></span>
                  <span v-else-if="scope.row.memo2" v-omitLast="`${$t('確認備註')}: ${scope.row.memo2}`"></span>
                </template>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作')" align="center">
            <template #default="scope">
              <el-button
                class="checkBtn"
                v-if="scope.row.status === '1' && canHandlerCheck()"
                type="primary"
                @click="handleDetial(scope.row, 'check')"
                >{{ $t('審核') }}</el-button
              >
              <el-button
                class="checkBtn"
                v-else-if="scope.row.status === '6' && canHandlerReview()"
                type="primary"
                @click="handleDetial(scope.row, 'review')"
                >{{ $t('確認') }}</el-button
              >
              <span v-else class="jumpLink" @click="handleDetial(scope.row, 'detail')">{{ $t('詳細資訊') }}</span>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
  </section>
  <ReviewDetailModal
    v-model:reviewDetailModal="reviewDetailModal"
    :detailData="detailData"
    @updateReport="search(currentPage)"
    :withdrawalData="withdrawalData"
  />
  <TotalReviewModal v-model:totalReviewModal="totalReviewModal" :totalData="withdrawalReviewTotalData" @updateReport="search(1)" />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed, watch, nextTick, onUnmounted } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import ReviewDetailModal from './modal/ReviewDetailModal'
import TotalReviewModal from './modal/TotalReviewModal'
import { getConsignApi, getFongkongApi } from '@/api/finance'
import useStore from '@/store/index'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 分頁
const totalPage = ref(0)
const currentPage = ref(0)

const getCurPage = (page) => search(page)

// 判斷權限是否可以操作確認或是審核
const { treeStore, msgStore } = useStore()
const { groupData, kefu, control, shareholder, supermaster, cadre, watcher } = storeToRefs(treeStore)
const isLevelOne = groupData.value.level === 1
const canHandlerCheck = () => !shareholder.value && !kefu.value && isLevelOne
const canHandlerReview = () => !shareholder.value && !kefu.value && !control.value && isLevelOne

// 日期
const dateData = ref({})
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 彈窗區
const reviewDetailModal = ref(false)
const totalReviewModal = ref(false)

// 計算確認中或審核中資料筆數
let initDataNum = 0
const calculateData = () => {
  const tempObj = {
    check: 0,
    review: 0
  }
  tempObj.check = withdrawalReviewTotalData.value.filter((item) => item.status === '1').length
  tempObj.review = withdrawalReviewTotalData.value.filter((item) => item.status === '6').length
  return tempObj
}

const withdrawalReviewData = ref([])
const withdrawalReviewTotalData = ref([])
const searchStatus = ref(0)
const searchType = ref(2)
const searchStr = ref('')
const searchOddNum = ref('')
const loading = ref(false)
// 取得玩家提款審核資料
const search = async (page, isUpdate = false) => {
  if (!dateExist.value) return
  currentPage.value = page

  const obj = {
    type: searchOddNum.value ? 1 : searchType.value,
    str: searchOddNum.value ? searchOddNum.value : searchStr.value,
    status: searchStatus.value,
    date: dateData.value,
    page,
    pagesize: 100
  }
  const { data } = await getConsignApi(obj)

  // 自動更新時不跳查無資料modal
  if (isUpdate || runTime.value) {
    msgStore.$patch({
      hasBtn: false
    })
  }
  const tempType = withdrawalReviewTotalData.value.type
  console.log(withdrawalReviewData.value.type)

  if (data.code !== 200) {
    withdrawalReviewData.value = []
    totalPage.value = 0

    // 自動更新
    if (isUpdate) updateSearch()
    return
  }
  withdrawalReviewData.value = data.data.data
  totalPage.value = data.data.totalN
  obj.pagesize = data.data.totalN
  obj.page = 1

  // 全部資料，excel和一鍵確認審核使用
  loading.value = true
  const { data: totalData } = await getConsignApi(obj)
  withdrawalReviewTotalData.value = totalData.data.data
  withdrawalReviewTotalData.value.type = tempType
  loading.value = false

  // 自動更新時判斷是否有新的確認或是審核資料
  if (isUpdate && runTime.value) {
    const newData = calculateData()
    const newCheck = initDataNum.check < newData.check
    const newReview = initDataNum.review < newData.review

    // 風控更新判斷
    const controlUpdate = control.value && newCheck

    // 總代理、幹部、財務 判斷
    const highLevel = supermaster.value || cadre.value || watcher.value
    const otherUpdate = highLevel && (newReview || newCheck)

    if (controlUpdate || otherUpdate) {
      updateTitle()
      initDataNum = calculateData()
    }
    return
  }

  // 自動更新
  updateSearch()
}

// 重置狀態開啟自動搜尋
const resetDate = ref(0)
const runUpdateSearch = () => {
  resetDate.value++
  searchStatus.value = 0
  searchType.value = 2
  searchStr.value = ''
  searchOddNum.value = ''
  search(1, true)
}

const remindSound = ref(null)
const initTitle = document.title
let titleInterval = null
// 提醒頁籤
const updateTitle = () => {
  if (titleInterval) clearInterval(titleInterval)
  remindSound.value.play()
  titleInterval = setInterval(() => {
    const title = document.title
    if (/新/.test(title) || /New/.test(title)) {
      document.title = `${initTitle}`
    } else {
      document.title = `${initTitle}【${t('新提醒')}】`
    }
  }, 500)
}
const stopUpdateTitle = () => {
  clearInterval(titleInterval)
  document.title = initTitle
}

const moment = require('moment')
const dateChoose = ref({ time: 0 })
const runTime = ref(false)
const initTime = 60000 // 初始下次更新時間
const time = ref(initTime)
let timeInterval = null
// 自動更新搜尋
const updateSearch = () => {
  time.value = initTime
  if (timeInterval) clearInterval(timeInterval)
  const isToday = dateChoose.value.time === 0
  // 當搜尋狀態為初始時
  if (!searchStatus.value && searchType.value === 2 && !searchStr.value && !searchOddNum.value && isToday && currentPage.value === 1) {
    initDataNum = calculateData()
    runTime.value = true
    timeInterval = setInterval(() => {
      time.value = time.value - 1000
      if (time.value < 0) {
        time.value = initTime
        if (!reviewDetailModal.value) {
          search(1, true)
        }
      }
    }, 1000)
  } else {
    runTime.value = false
  }
}
onUnmounted(() => {
  if (titleInterval) clearInterval(titleInterval)
  if (timeInterval) clearInterval(timeInterval)
  document.title = initTitle
})

// 提款單狀態
const currStatus = (status, isText) => {
  switch (status) {
    case '1':
      return isText ? t('審核中') : 'check'
    case '2':
      return isText ? t('已派發') : 'success'
    case '3':
      return isText ? t('成功') : 'success'
    case '4':
      return isText ? t('失敗') : 'reject'
    case '6':
      return isText ? t('確認中') : 'check'
    case '7':
      return isText ? t('等待確認中') : 'check'
    case '8':
      return isText ? t('拒絕') : 'reject'
  }
}
// 獲取詳細風控資訊
// const FongkongData = ref()
// 詳細風控資訊
const withdrawalData = ref({
  risk_level: '',
  duplicate_pwd: '',
  duplicate_sec_pwd: '',
  duplicate_ip: '',
  account_password_match: '',
  pwd: ''
})
const getFongkongApiFunc = async (u9, acc) => {
  const { data } = await getFongkongApi(u9)
  if (data) {
    const _data = data.data.data
    console.log(_data)

    // withdrawalData.value.risk_level = _data.risk_level
    // withdrawalData.value.duplicate_pwd = _data.duplicate_pwd
    // withdrawalData.value.duplicate_sec_pwd = _data.duplicate_sec_pwd
    // withdrawalData.value.duplicate_ip = _data.duplicate_ip
    // withdrawalData.value.account_password_match = _data.account_password_match
    // withdrawalData.value.pwd = _data.pwd

    withdrawalData.value = _data
    withdrawalData.value.account = acc
    // withdrawalData.value = [
    //   ,
    //   _data.duplicate_pwd,
    //   _data.duplicate_sec_pwd,
    //   _data.duplicate_ip,
    //   _data.account_password_match
    // ]
  }
}
// 確認單、審核單、查看詳細單
const detailData = ref({})
const handleDetial = (data, type) => {
  stopUpdateTitle()
  getFongkongApiFunc(data.u9, data.account)
  detailData.value = JSON.parse(JSON.stringify(data))
  console.log(data)
  console.log(type)
  detailData.value.type = type
  reviewDetailModal.value = true
}

// 一鍵確認和審核
const handleTotal = (type) => {
  stopUpdateTitle()
  withdrawalReviewTotalData.value.type = type
  totalReviewModal.value = true
}

// excel
const hide = ref(false)
const excel = () => {
  if (loading.value) return
  hide.value = true
  const tempWithdrawalReviewData = withdrawalReviewData.value
  withdrawalReviewData.value = withdrawalReviewTotalData.value
  nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#table'), t('玩家提款審核'))
  })
  setTimeout(() => {
    withdrawalReviewData.value = tempWithdrawalReviewData
    hide.value = false
  }, 0)
}

watch(searchOddNum, (val) => {
  if (val) {
    searchType.value = 2
    searchStatus.value = 0
  }
})

watch(searchType, () => {
  searchStr.value = ''
  searchOddNum.value = ''
})
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: space-between;
}

.check {
  color: $info;
}

.success {
  color: green;
}

.reject {
  color: red;
}

.checkBtn {
  min-width: 80px !important;
}

.page {
  display: flex;
  justify-content: space-between;
  align-content: center;
  .time {
    margin-left: 0.5rem;
    font-size: 16px;
    color: black;
  }
}

.bi-arrow-clockwise {
  font-size: 20px;
  color: red;
  cursor: pointer;
}
</style>
