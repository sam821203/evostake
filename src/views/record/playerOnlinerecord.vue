<template>
  <section>
    <h2>{{ $t('玩家在線紀錄') }}</h2>
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="excel">
          Excel
          <!-- <i v-show="loading" class="fas fa-spinner fa-spin"></i> -->
        </el-button>
      </template>
    </DateChoose>
  </section>

  <section>
    <h2 class="page">
      <!-- {{ $t('玩ㄔㄧ') }} -->
      <Pagination :pageSize="100" :totalPage="totalPlayerPage" :currentPage="currentPlayerPage" @changePage="getCurPage" />
    </h2>
    <div class="table" :style="{ height: playerData?.length === 0 ? '105px' : '550px' }">
      <el-table
        :data="playerData"
        border
        style="width: 100%"
        :height="playerData?.length === 0 ? '105px' : '550px'"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('風控資訊')"
      >
        <el-table-column :label="$t('整點時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.time"></span>
            <!-- {{ toDate(scope.row.time) }} -->
          </template>
        </el-table-column>
        <el-table-column :label="$t('在線人數')" align="center">
          <template #default="scope">
            <span>{{ scope.row.count }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { playeronlinerecordApi } from '@/api/record'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// const toDate = (e) => {
//   let edate = ''
//   edate += `${new Date(e).getFullYear()}/`
//   if (new Date(e).getMonth() + 1 < 10) {
//     edate += '0'
//   }
//   edate += `${new Date(e).getMonth() + 1}/`
//   if (new Date(e).getDate() < 10) {
//     edate += '0'
//   }
//   edate += `${new Date(e).getDate()} `
//   if (new Date(e).getHours() < 10) {
//     edate += '0'
//   }
//   edate += `${new Date(e).getHours()}:`
//   if (new Date(e).getMinutes() < 10) {
//     edate += '0'
//   }
//   edate += `${new Date(e).getMinutes()}`

//   return edate
// }
const forexceldata = ref()
const excel = () => {
  if (!playerData.value) return

  const tmpdata = playerData.value
  playerData.value = forexceldata.value
  // console.log(forexceldata.value)
  nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#table'), t('玩家在線紀錄'))
    playerData.value = tmpdata
  })

  // console.log('EXCEL2')
}

// 日期
const dateData = ref({})
const newDate = ref(0)
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

const getCurPage = (page) => setTimeout(() => search(page))

// 玩家資訊分頁器
const totalPlayerPage = ref(0)
const currentPlayerPage = ref(0)

// 搜尋

const playerData = ref([])

const search = async (page) => {
  playerData.value = []
  currentPlayerPage.value = page
  const { data } = await playeronlinerecordApi(page, dateData.value.time1, dateData.value.time2)

  // console.log(totalPlayerPage.value)
  // totalN: 22
  if (data.code === 200) {
    playerData.value = data.data.data
    totalPlayerPage.value = data.data.totalN
    const { data: forexceldatas } = await playeronlinerecordApi(1, dateData.value.time1, dateData.value.time2, totalPlayerPage.value)
    console.log(forexceldatas)
    forexceldata.value = forexceldatas.data.data
  } else {
    playerData.value = []
    totalPlayerPage.value = 0
  }
  // total_page: 8

  // console.log(data.data.data)
  // total_page
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: flex-end;
  align-content: center;
}
</style>
