<template>
  <section>
    <h2>{{ $t("玩家返利") }}</h2>
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t("搜尋") }}</el-button>
        <el-button type="primary" @click="openAddplayerRebateModal" v-if="checkAgent(['總代理', '幹部'])">{{
          $t("新增玩家返利")
        }}</el-button>
      </template>
    </DateChoose>
  </section>
  <section>
    <h2 class="page">
      <div></div>
      <!-- {{ $t('玩家登入資訊') }} -->
      <Pagination :totalPage="totalPlayerPage" :currentPage="currentPlayerPage" @changePage="getCurPage" />
    </h2>
    <div class="table" :style="{ height: playerData?.length === 0 ? '105px' : '550px' }">
      <el-table
        :data="playerData"
        border
        style="width: 100%"
        :height="playerData?.length === 0 ? '105px' : '100%'"
        :empty-text="$t('無資料')"
        id="table"
        show-overflow-tooltip
        :data-name="$t('')"
      >
        <!-- <el-table-column prop="id" :label="$t('編號')" align="center" />
        <el-table-column prop="promotion" :label="$t('活動名稱')" align="center" /> -->

        <el-table-column :label="$t('開始時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.start_time"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('結束時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.end_time"></span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('參與對象')" align="center">
          <template #default="scope">
            <span v-if="scope.row.target_type === 0">{{ $t("全部玩家") }}</span>
            <span v-if="scope.row.target_type === 1">{{ $t("指定代理帳號") }}</span>
            <span v-if="scope.row.target_type === 2">{{ $t("已過指定玩家帳號期") }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('返利類型')" align="center">
          <template #default="scope">
            <span v-if="scope.row.type === 0">{{ $t("存款返利") }}</span>
            <span v-if="scope.row.type === 1">{{ $t("投注返利") }}</span>
            <!-- <span v-if="scope.row.type === 2">{{ $t("有效流水") }}</span> -->
            <!-- <span v-if="scope.row.type === 3">{{ $t("特殊") }}</span> -->
          </template>
        </el-table-column>
        <el-table-column :label="$t('面額')" align="center">
          <template #default="scope">
            <!-- #default="scope" -->
            <span v-money="scope.row.nominal_value.min"></span>
            ~
            <span v-money="scope.row.nominal_value.max"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('返利層級')" align="center">
          <template #default="scope">
            <!-- #default="scope" -->
            <!-- <span>{{ $t(getRebateMaxlv(scope.row.level_setting)) }}</span> -->
            <span>{{ $t(getRebateMaxlv(scope.row.level_setting)) }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('狀態')" align="center">
          <template #default="scope">
            <span v-if="scope.row.status === 0" style="color:green">{{ $t("進行中") }}</span>
            <span v-if="scope.row.status === 1" style="color:red">{{ $t("手動關閉") }}</span>
            <span v-if="scope.row.status === 2" style="color:red">{{ $t("已過期") }}</span>
            <span v-if="scope.row.status === 3" style="color:yellow">{{ $t("準備中") }}</span>
            <!-- <span v-if="scope.row.type === 0">{{ $t("單筆儲值") }}</span>
            <span v-if="scope.row.type === 1">{{ $t("累積儲值") }}</span>
            <span v-if="scope.row.type === 2">{{ $t("有效流水") }}</span>
            <span v-if="scope.row.type === 3">{{ $t("特殊") }}</span> -->
          </template>
        </el-table-column>
        <el-table-column :label="$t('領取人數')" align="center">
          <template #default="scope">
            <span class="jumpLink" @click="openreceiveNumModal(scope.row)">{{ scope.row.recipient_count }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="last_edit_by" :label="$t('最後編輯')" align="center" />
        <!-- <el-table-column prop="real_name" :label="$t('操作')" align="center" /> -->
        <el-table-column :label="$t('操作')" align="center" width="250px">
          <template #default="scope">
            <!--  -->
            <!-- -->
            <el-button type="primary" v-if="checkAgent(['總代理', '幹部'])" @click="edit(scope.row)">{{ $t("編輯") }}</el-button>
            <!-- <span class="jumpLink" v-else>{{ $t("詳細資訊") }}</span> -->

          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
  <receiveNum v-model:receiveNumModal="receiveNumModal" :receiveNumModal="receiveNumModal" :totalData="receiveNumData" />
  <addplayerRebateModal
  @searchData="search(currentPlayerPage)"
  :addnewActModalStatus="addnewActModalStatus" v-model:addnewActModalStatus="addnewActModalStatus"/>
  <editplayerRebateModal
  @searchData="search(currentPlayerPage)"
  :editnewActModalStatus="editnewActModalStatus" v-model:editnewActModalStatus="editnewActModalStatus" :totalData="editnewActModalData"/>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import { getPlayerRebateData } from '@/api/activity'
import useStore from '@/store/index'
import addplayerRebateModal from '@/views/activity/modal/addplayerRebateModal.vue'
import receiveNum from '@/views/activity/modal/playerRebateReceiveNum.vue'
import editplayerRebateModal from '@/views/activity/modal/editplayerRebateModal.vue'
const { treeStore, loginStore } = useStore()
// 確認身分類別
const checkAgent = (array) => {
  let s = false
  for (let i = 0; i < array.length; i++) {
    const el = array[i]
    if (treeStore.levelText(treeStore.groupData.level, loginStore.loginData.userData?.role_name) === el) {
      s = true
    }
  }
  return s
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

const getData = async (page) => {
  // console.log(dateData.value)
  currentPlayerPage.value = page
  // console.log(page)
  const { data } = await getPlayerRebateData(page, dateData.value.time1, dateData.value.time2)
  // console.log(data.data)
  totalPlayerPage.value = data.data.totalN
  playerData.value = data.data.data
}

const search = async (page) => {
  // 當前分頁
  currentPlayerPage.value = page

  if (!dateExist.value) return

  // 選擇玩家登入資訊分頁只搜尋玩家登入資訊
  getData(page)
}
//
const addnewActModalStatus = ref(false)
const openAddplayerRebateModal = () => {
  addnewActModalStatus.value = true
}
//
const receiveNumModal = ref(false)
const receiveNumData = ref()
const openreceiveNumModal = (data) => {
  receiveNumData.value = data
  receiveNumModal.value = true
}
// 返利層級server回傳OBJ取KEY最高
const getRebateMaxlv = (a) => {
  // const a = {
  //   1: {
  //     bonus_arg: 100,
  //     bonus_limit: 5000,
  //     level: 1
  //   },
  //   2: {
  //     bonus_arg: 100,
  //     bonus_limit: 5000,
  //     level: 1
  //   }
  // }
  let maxLV = 0
  for (const k in a) {
    if (Number(k) > maxLV) {
      maxLV = Number(k)
    }
  }
  switch (maxLV) {
    case 1:
      maxLV = '一'
      break
    case 2:
      maxLV = '二'
      break
    case 3:
      maxLV = '三'
      break
    case 4:
      maxLV = '四'
      break
    case 5:
      maxLV = '五'
      break
    default:
      maxLV = '一'
      break
  }
  return maxLV + '級_original'
}
onMounted(() => {
  // getRebateMaxlv()
})
//
const editnewActModalStatus = ref(false)
const editnewActModalData = ref()
const edit = (data) => {
  editnewActModalStatus.value = true
  editnewActModalData.value = data
}
</script>

  <style lang="scss" scoped>
.page {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
:deep .el-table_1_column_10 {
  width: 100%;
}
:deep .cell {
  display: flex;
  justify-content: space-around;
}
</style>
