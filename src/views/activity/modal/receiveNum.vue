<template>
  <el-dialog :model-value="receiveNumModal" :width="thisWidth" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <!-- <h2>{{ $t(`快派紅利`) }}</h2> -->
      <h2>{{totalData.promotion}}</h2>
    </template>
    <span class="actTime"> {{ $t(`活動時間`) }}:
     <span v-time="totalData.start_time"></span> ~ <span v-time="totalData.end_time"></span>
     </span>
    <div class="searchGroup">
      <el-select v-model="searchType">
        <el-option :label="$t('全部')" :value="10" />
        <el-option :label="$t('未領取')" :value="0" style="color: red;"/>
        <el-option :label="$t('已領取')" :value="1" style="color: green;" />
        <el-option :label="$t('已過期')" :value="2"  />
        <el-option :label="$t('已取消')" :value="3"  />
      </el-select>
    </div>
    <DateChoose @getDate="getDate" ref="dateChoose">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t("搜尋") }} </el-button>
        <el-button :type="!loading ? 'primary' : 'warning'" v-show="receiveNumDetailData?.player_bonus_events?.length" @click="excel">
          Excel<i v-show="loading" class="fas fa-spinner fa-spin"></i>
        </el-button>
      </template>
    </DateChoose>
    <span class="actTime2 colorBlue"> {{ $t(`派發紅利/人數`) }}:
      <span v-money="receiveNumDetailData?.total_bonus /10000"></span>
      /
      <span>{{(receiveNumDetailData?.total_count)?receiveNumDetailData?.total_count:0}}</span>
    </span>
    <span class="actTime2 colorRed"> {{ $t(`領取紅利/人數`) }}:
      <span v-money="receiveNumDetailData?.claimed_bonus /10000"></span>
      /
      <span>{{(receiveNumDetailData?.claimed_count)?receiveNumDetailData?.claimed_count:0}}</span>
    </span>

    <div class="table" :style="{ height: receiveNumDetailData?.player_bonus_events ? '500px' : '115px' }">
      <!-- <h2 v-if="!mobileWidth" class="playerListPage"> -->
      <!-- {{ $t("選擇玩家") }} -->
      <div style="display: flex;justify-content: flex-end;">
        <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
      </div>
      <!-- </h2> -->
      <el-table
        :data="receiveNumDetailData?.player_bonus_events"
        border
        id="receiveNumtable"
        style="width: 100%"
        :height="receiveNumDetailData?.player_bonus_events ? '500px' : '115px'"
        :empty-text="$t('無資料')"
      >
        <el-table-column :label="$t('玩家帳號')" align="center">
          <template #default="scope">
            <span class="jumpLink" @click="windowOpen(scope.row)">{{
              scope.row.account
            }}</span>
            <!-- 「另開新頁」方式開啟「玩家數據報表」，並自動代入搜尋該「日期區間」與「玩家帳號」。 -->
          </template>
        </el-table-column>

        <el-table-column :label="$t('玩家餘額')" align="center">
          <template #default="scope">
            <span v-money="scope.row.balance/10000"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('達成時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.achieve_time"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('領取狀態')" align="center">
          <template #default="scope">
            <span v-if="scope.row.status===0" style="color:red">{{ $t('未領取') }}</span>
            <span v-if="scope.row.status===1" style="color:green">{{ $t('已領取') }}</span>
            <span v-if="scope.row.status===2" style="color:black">{{ $t('已過期') }}</span>
            <span v-if="scope.row.status===3" style="color:black">{{ $t('已取消') }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('狀態變更時間')" align="center">
          <template #default="scope">
            <span v-if="scope.row.status===0"></span>
            <span v-else v-time="scope.row.last_change_time"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('紅利金額')" align="center">
          <template #default="scope">
            <span v-money="scope.row.bonus/10000"></span>
          </template>
        </el-table-column>

      </el-table>

    </div>
    <!-- <div style="height: 1rem;background: red;width: 100%;"></div> -->
  </el-dialog>
</template>

<script setup>
import { toRefs, computed, ref, nextTick, watch } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import { getactivityListDetail } from '@/api/activity'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const router = useRouter()
const { t } = useI18n()
//
const dateChoose = ref(null)
const loading = ref(false)
const excel = () => {
  if (loading.value) return
  // const tempAdminLogData = receiveNumDetailData.value
  // adminLogData.value = adminLogTotalData.value
  nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#receiveNumtable'), t('活動列表'))
  })
  // setTimeout(() => (adminLogData.value = tempAdminLogData), 0)
}

const emit = defineEmits(['update:receiveNumModal', 'updatePlayer'])
const props = defineProps({
  receiveNumModal: Boolean,
  totalData: Object
})

const { receiveNumModal, totalData } = toRefs(props)

watch(receiveNumModal, (v) => {
  if (v) {
    nextTick(() => {
      dateChoose.value?.changeDate(totalData.value.start_time, totalData.value.end_time)
      search(1)
    })
  }
})

const thisWidth = computed(() => '800px')

// 搜尋種類
const searchType = ref(10)
// 頁數
const totalPage = ref(0)
const currentPage = ref(0)
const getCurPage = (page) => search(page)

//
const receiveNumDetailData = ref()
//
const search = async(page) => {
  currentPage.value = page
  console.log(props.totalData)
  //   打API
  const { data } = await getactivityListDetail(
    page,
    dateData.value.time1,
    dateData.value.time2,
    props.totalData.id,
    searchType.value === 10 ? null : searchType.value
  )
  //   接到API回傳，把page塞入 totalPage
  console.log(data)
  totalPage.value = data.data.totalN
  receiveNumDetailData.value = data.data.data
}

// 日期
const dateData = ref({})
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// modal 開關
// 管理員列表 modal
const closeModal = () => {
  searchType.value = 10
  totalPage.value = 0
  currentPage.value = 0
  dateData.value = {}
  receiveNumDetailData.value = null
  emit('update:receiveNumModal', false)
}
//
const windowOpen = (data) => {
  console.log(data.account)
  // if (data) { return }
  const { href } = router.resolve({
    name: 'playerDataReport',
    params: {
      jumpParam: data.account,
      startTime: dateData.value.time1,
      endTime: dateData.value.time2
    }
  })

  // if (data) {
  //   return
  // }
  window.open(href, '_blank') // 打开新的窗口
}
</script>

  <style lang="scss" scoped>
.actTime {
  width: 100%;
  margin-bottom: 1rem;
  display: inline-block;
}
.actTime2 {
  width: 100%;
  margin-top: 0.5rem;
  display: inline-block;
}
.colorRed {
  color: red;
}
.colorBlue {
  color: #2a82e4;
}
.table{
    margin-bottom: 0.5rem;
    // margin: 20px 0;
    // width: 100%;
    // background: red;
    // position: relative;
}
</style>
