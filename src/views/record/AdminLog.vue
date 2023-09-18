<template>
  <section>
    <h2 v-if="!mobileWidth">{{ $t('資料異動紀錄') }}</h2>
    <div class="searchGroup">
      <el-select v-model="searchType">
        <el-option :label="$t('全部類別')" value="1" />
        <el-option :label="$t('玩家')" value="2" />
        <el-option :label="$t('管理員')" value="3" />
      </el-select>
      <el-input v-model="searchStr" :placeholder="$t('請輸入管理員帳號')" />
    </div>
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
        <el-button :type="!loading ? 'primary' : 'warning'" v-show="!mobileWidth && adminLogData.length" @click="excel">
          Excel<i v-show="loading" class="fas fa-spinner fa-spin"></i>
        </el-button>
      </template>
    </DateChoose>
  </section>
  <section>
    <h2 v-if="!mobileWidth" class="adminLogPage">
      {{ $t('詳細紀錄') }}<Pagination v-if="!mobileWidth" :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
    </h2>
    <div v-if="!mobileWidth" class="table" :style="{ height: adminLogData.length === 0 ? '115px' : 'calc(100vh - 400px)' }">
      <el-table
        :data="adminLogData"
        border
        style="width: 100%"
        :height="adminLogData.length === 0 ? '115px' : 'calc(100vh - 400px)'"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('概括總計')"
      >
        <el-table-column prop="createdat" :label="$t('異動時間')" align="center" width="170px">
          <template #default="scope">
            <span v-time="scope.row.createdat"></span>
          </template>
        </el-table-column>
        <el-table-column prop="username" :label="$t('管理員帳號')" align="center" />
        <el-table-column prop="title" :label="$t('異動類別')" align="center" width="170px">
          <template #default="scope">
            <span v-if="scope.row.title">{{ $t(scope.row.title) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="target" :label="$t('異動對象')" align="center" />
        <el-table-column prop="action" :label="$t('異動品項')" align="center" width="170px">
          <template #default="scope">
            <span v-if="scope.row.action">{{ $t(scope.row.action) }}</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="before_data" :label="$t('異動前內容/狀態/數值')" align="center" width="170px">
          <template #default="scope">
            <span v-if="scope.row.uri==='/event'">{{scope.row.before_data}}</span>
            <span v-else v-money="scope.row.before_data / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column prop="after_data" :label="$t('異動後內容/狀態/數值')" align="center" width="170px">
          <template #default="scope">
            <span v-if="scope.row.uri==='/event'">{{scope.row.after_data}}</span>
            <span v-else v-money="scope.row.after_data / 10000"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-else v-for="item in adminLogData" :key="item.createdat">
      <div class="mobileCard">
        <ul>
          <li>
            <p>{{ $t('起始時間') }}</p>
            <p v-time="item.createdat"></p>
          </li>
          <li>
            <p>{{ $t('管理員帳號') }}</p>
            <p>{{ item.username }}</p>
          </li>
          <li>
            <p>{{ $t('異動類別') }}</p>
            <p>{{ $t(item.title) }}</p>
          </li>
          <li>
            <p>{{ $t('異動對象') }}</p>
            <p>{{ item.target || '-' }}</p>
          </li>
          <li>
            <p>{{ $t('異動品項') }}</p>
            <p v-if="item.action">{{ $t(item.action) }}</p>
            <p v-else></p>
          </li>
          <li>
            <p>{{ $t('異動前內容/狀態/數值') }}</p>
            <p>{{ item.before_data || '-' }}</p>
          </li>
          <li>
            <p>{{ $t('異動後內容/狀態/數值') }}</p>
            <p>{{ item.after_data || '-' }}</p>
          </li>
          <li></li>
        </ul>
      </div>
    </template>
  </section>
  <div class="pag" v-show="mobileWidth">
    <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
  </div>
</template>

<script setup>
import { ref, computed, inject, nextTick, watch } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import { getAdminlogApi } from '@/api/record'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 日期
const dateData = ref({})
const newDate = ref(0)
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 搜尋
const adminLogData = ref([])
const adminLogTotalData = ref([])
const searchStr = ref('')
const searchType = ref('1')
const totalPage = ref(0)
const currentPage = ref(0)
const loading = ref(false)
let tempDateData
const search = async (page) => {
  currentPage.value = page
  if (!dateExist.value) return
  const { data } = await getAdminlogApi(searchType.value, searchStr.value, dateData.value, page)
  adminLogData.value = data.data.data ?? []
  totalPage.value = data.data.total

  // excel用
  const checkDate = dateData.value.time1 === tempDateData?.time1 && dateData.value.time2 === tempDateData?.time2
  if (adminLogTotalData.value.length && checkDate) return
  loading.value = true
  const { data: totalData } = await getAdminlogApi(searchType.value, searchStr.value, dateData.value, page, totalPage.value)
  loading.value = false
  adminLogTotalData.value = totalData.data.data ?? []
  tempDateData = dateData.value
}
const getCurPage = (page) => search(page)

// excel
const excel = () => {
  if (loading.value) return
  const tempAdminLogData = adminLogData.value
  adminLogData.value = adminLogTotalData.value
  nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#table'), t('資料異動紀錄'))
  })
  setTimeout(() => (adminLogData.value = tempAdminLogData), 0)
}

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')

// 搜尋類別切換重置
watch(searchType, () => (searchStr.value = ''))
</script>

<style lang="scss" scoped>
.adminLogPage {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
</style>
