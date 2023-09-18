<template>
  <section>
    <h2>{{ $t('風控資訊') }}</h2>
    <div class="searchGroup">
      <el-select v-model="searchType">
        <el-option :label="$t('全部玩家')" :value="1" />
        <el-option :label="$t('玩家ID')" :value="2" />
        <el-option :label="$t('玩家帳號')" :value="3" />
        <el-option :label="$t('玩家暱稱')" :value="4" />
        <el-option :label="$t('真實姓名')" :value="5" />
        <el-option :label="$t('身分證')" :value="6" />
        <el-option :label="$t('所屬代理帳號')" :value="7" />
        <el-option :label="$t('全部玩家')" :value="8" v-show="false" />
      </el-select>
      <el-input v-model="searchStr" :placeholder="searchType === 1 ? $t('請輸入IP位址') : ''" />
    </div>
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
        <el-button :type="!loading ? 'primary' : 'warning'" v-show="playerData?.length" @click="excel">
          Excel<i v-show="loading" class="fas fa-spinner fa-spin"></i>
        </el-button>
      </template>
    </DateChoose>
  </section>
  <!-- <section>
    <h2 class="page">
      {{ $t('風控資訊') }}
      <Pagination
        :totalPage="totalControlPage"
        :currentPage="currentControlPage"
        @changePage="getCurPage"
        @click="reportType = 'control'"
      />
    </h2>
    <div class="table" :style="{ height: controlData.length === 0 ? '105px' : '400px' }">
      <el-table
        :data="controlData"
        border
        style="width: 100%"
        :height="controlData.length === 0 ? '105px' : '400px'"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('風控資訊')"
      >
        <el-table-column :label="$t('時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.time"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('玩家帳號')" align="center">
          <template #default="scope">
            <span class="jumpLink" @click="showControlDetailModal(scope.row)">{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="real_name" :label="$t('真實姓名')" align="center" />
        <el-table-column prop="agent_account" :label="$t('所屬代理帳號')" align="center" />
        <el-table-column :label="$t('風控訊息')" align="center">
          <template #default="scope">
            <span v-if="scope.row.content">{{ $t(scope.row.content) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('最後登入時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.last_login"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('註冊時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.regist_time"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section> -->
  <section>
    <h2 class="page">
      {{ $t('玩家登入資訊') }}
      <Pagination :totalPage="totalPlayerPage" :currentPage="currentPlayerPage" @changePage="getCurPage" @click="reportType = 'player'" />
    </h2>
    <div class="table" :style="{ height: playerData.length === 0 ? '105px' : '400px' }">
      <el-table
        :data="playerData"
        border
        style="width: 100%"
        :height="playerData.length === 0 ? '105px' : '400px'"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('風控資訊')"
      >
        <el-table-column :label="$t('登入時間')" align="center" width="170">
          <template #default="scope">
            <span v-time="scope.row.time"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('玩家帳號')" align="center">
          <template #default="scope">
            <span class="jumpLink" @click="showControlDetailModal(scope.row)">{{ scope.row.account }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="real_name" :label="$t('真實姓名')" align="center" />
        <el-table-column prop="agent_account" :label="$t('所屬代理帳號')" align="center" />
        <el-table-column prop="status" :label="$t('帳號狀態')" align="center">
          <template #default="scope">
            <span :style="{ color: scope.row.status === 1 ? 'red' : 'green' }">
              {{ scope.row.status === 1 ? $t('凍結') : $t('正常') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="ip" :label="$t('登入IP')" align="center" />
        <el-table-column :label="$t('註冊時間')" align="center" width="170">
          <template #default="scope">
            <span v-time="scope.row.regist_time"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
  <ControlDetailModal @updateReport="updateReport" v-model:controlDetailModal="controlDetailModal" :detailData="detailData" />
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import ControlDetailModal from './modal/ControlDetailModal.vue'
import { getFengkongLogApi, getPlayerLoginLogApi } from '@/api/record'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const route = useRoute()
//
const loading = ref(false)
const excel = () => {
  if (loading.value) return
  const tempData = playerData.value
  playerData.value = forexcelData.value
  nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#table'), t('風控資訊'))
    playerData.value = tempData
  })
  // setTimeout(() => (adminLogData.value = tempAdminLogData), 0)
}
// 日期
const dateData = ref({})
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

const getCurPage = (page) => setTimeout(() => search(page))

const controlDetailModal = ref(false)

// 風控資訊分頁器
const totalControlPage = ref(0)
const currentControlPage = ref(0)

// 玩家資訊分頁器
const totalPlayerPage = ref(0)
const currentPlayerPage = ref(0)

// 搜尋
const reportType = ref('')
const controlData = ref([])
const playerData = ref([])
const searchStr = ref('')
const searchType = ref(1)

// 取得風控資訊
const getControlData = async (page) => {
  const { data: control } = await getFengkongLogApi(searchType.value, searchStr.value, dateData.value, page)
  console.log(control)
  if (control.code === 200) {
    controlData.value = control.data.data
    totalControlPage.value = control.data.totalN
  } else {
    controlData.value = []
    totalControlPage.value = 0
  }
}

// 取得玩家資訊
const forexcelData = ref()
const getPlayerData = async (page, updateSearchType = false) => {
  const { data: player } = await getPlayerLoginLogApi(searchType.value, searchStr.value, dateData.value, page)
  if (player.code === 200) {
    playerData.value = player.data.data
    totalPlayerPage.value = player.data.totalN
    const { data: playerDetail } = await getPlayerLoginLogApi(searchType.value, searchStr.value, dateData.value, 1, player.data.totalN)
    forexcelData.value = playerDetail.data.data
  } else {
    playerData.value = []
    // totalPlayerPage
    totalPlayerPage.value = 0
  }
  // if (updateSearchType) searchType.value = 1
}

const search = async (page) => {
  // 當前分頁
  switch (reportType.value) {
    case 'control':
      currentControlPage.value = page
      break
    case 'player':
      currentPlayerPage.value = page
      break
    default:
      currentControlPage.value = 1
      currentPlayerPage.value = 1
      break
  }

  if (!dateExist.value) return

  // 初始搜尋或是搜尋IP時取得風控資訊、玩家登入資訊
  const isSearchIP = searchType.value === 1 && searchStr.value !== ''
  if (!reportType.value || isSearchIP) {
    if (isSearchIP) searchType.value = 8
    getControlData(page)
    getPlayerData(page, true)
  }

  // 選擇風控資訊分頁只搜尋風控資訊
  if (reportType.value === 'control') getControlData(page)

  // 選擇玩家登入資訊分頁只搜尋玩家登入資訊
  if (reportType.value === 'player') getPlayerData(page)

  reportType.value = ''
}

// 凍結和解凍玩家重新玩家
const updateReport = (id) => {
  searchStr.value = id
  searchType.value = 2
  search(1)
}

// 詳細資訊
const detailData = ref({})
const showControlDetailModal = (data) => {
  controlDetailModal.value = true
  detailData.value = data
}

watch(searchType, (newVal, oldVal) => {
  if (newVal === 8 || oldVal === 8) return
  searchStr.value = ''
})

watch(searchStr, (v) => {
  if (v === '') {
    searchType.value = 1
  }
})

// 玩家審核跳轉過來搜尋玩家
const newDate = ref(0)

const jumpSearch = () => {
  searchType.value = 3
  newDate.value = 30
  setTimeout(() => {
    searchStr.value = route.params.jumpParam
    search(1)
  }, 0)
}

onMounted(() => {
  // 玩家資訊跳轉過來搜尋玩家
  if (route.params) {
    if (route.params.jumpParam) {
      jumpSearch()
      document.documentElement.style.overflowY = 'initial'
    }
  }
})
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
</style>
