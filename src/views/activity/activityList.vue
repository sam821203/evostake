<template>
  <section>
    <h2>{{ $t("活動列表") }}</h2>
    <DateChoose @getDate="getDate" :newDate="newDate" ref="dateChoose">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t("搜尋") }}</el-button>
        <el-button type="primary" @click="openAddnewActModal"
        v-if="checkAgent(['總代理','幹部'])"
        >{{ $t("新增活動") }}</el-button>
      </template>
    </DateChoose>
  </section>
  <section>
    <h2 class="page">
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
        :data-name="$t('風控資訊')"
      >
        <!-- <el-table-column :label="$t('編號')" align="center" width="170">
            <template #default="scope">
              <span v-time="scope.row"></span>
            </template>
          </el-table-column> -->
        <!-- <el-table-column :label="$t('活動名稱')" align="center">
            <template #default="scope">
              <span class="jumpLink" @click="showControlDetailModal(scope.row)">{{ scope.row.account }}</span>
            </template>
          </el-table-column> -->
        <el-table-column prop="id" :label="$t('編號')" align="center" />
        <el-table-column prop="promotion" :label="$t('活動名稱')" align="center" />

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

        <el-table-column :label="$t('狀態')" align="center">
          <template #default="scope">
            <span v-if="scope.row.status === 0" style="color:green">{{ $t("進行中") }}</span>
            <span v-if="scope.row.status === 1" style="color:red">{{ $t("手動關閉") }}</span>
            <span v-if="scope.row.status === 2" style="color:red">{{ $t("已過期") }}</span>
            <span v-if="scope.row.status === 3" style="color:yellow">{{ $t("準備中") }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('活動類型')" align="center">
          <template #default="scope">
            <span v-if="scope.row.type === 0">{{ $t("單筆儲值") }}</span>
            <span v-if="scope.row.type === 1">{{ $t("累積儲值") }}</span>
            <span v-if="scope.row.type === 2">{{ $t("有效流水") }}</span>
            <span v-if="scope.row.type === 3">{{ $t("特殊") }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('領取人數')" align="center">
          <template #default="scope">
            <span jumpLink
            :class="[
              checkAgent(['開發商', '財會', '主管', '總代理', '幹部', '客服主管', '財務', '客服'])?'jumpLink':''
            ]"
            @click="showReceiveNumModal(scope.row)">{{ scope.row.recipient_count }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="$t('總紅利')" align="center">
          <template #default="scope">
            <span v-money="scope.row.total_recipient / 10000"></span>
          </template>
        </el-table-column>

        <el-table-column prop="last_edit_by" :label="$t('最後編輯')" align="center" />
        <!-- <el-table-column prop="real_name" :label="$t('操作')" align="center" /> -->
        <el-table-column :label="$t('操作')" align="center" width="250px">
          <template #default="scope">
            <!--  -->
            <!-- -->
            <el-button type="primary" @click="closeAct(scope)" class="out"
            v-show="checkAgent(['總代理','幹部'])"
            v-if="scope.row.status === 0 || scope.row.status === 3">{{
              $t("關閉")
            }}</el-button>
            <el-button type="primary" @click="edditActStatus(scope)"
            v-if="checkAgent(['總代理','幹部'])"
            >{{ $t("編輯") }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
  <receiveNum v-model:receiveNumModal="receiveNumModal" :receiveNumModal="receiveNumModal" :totalData="receiveNumData" />
  <addnewActModal
    @searchData="search(currentPlayerPage)"
    v-model:addnewActModalStatus="addnewActModalStatus"
    :addnewActModalStatus="addnewActModalStatus"
  />
  <edditActModal
    @searchData="search(currentPlayerPage)"
    :totalData="edditModaldata"
    v-model:edditActModalStatus="edditActModalStatus"
    :edditActModalStatus="edditActModalStatus"
  />
  <closeActModal
    @searchData="search(currentPlayerPage)"
    v-model:closeActStatus="closeActStatus"
    :closeActStatus="closeActStatus"
    :totalData="closeActData"
  />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import { getactivityList } from '@/api/activity'
import receiveNum from '@/views/activity/modal/receiveNum'
import addnewActModal from '@/views/activity/modal/addnewActModal.vue'
import closeActModal from '@/views/activity/modal/closeAct.vue'
import edditActModal from '@/views/activity/modal/edditActModal.vue'
import useStore from '@/store/index'
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
  if (!dateData.value.time1 || !dateData.value.time2) {
    return
  }
  currentPlayerPage.value = page
  // console.log(page)
  const { data } = await getactivityList(page, dateData.value.time1, dateData.value.time2)
  // console.log(data.data)
  totalPlayerPage.value = data.data.totalN
  playerData.value = data.data.data
}
const dateChoose = ref(null)
const search = async (page, isNow = false) => {
  // 當前分頁
  currentPlayerPage.value = page

  if (!dateExist.value) return

  // 選擇玩家登入資訊分頁只搜尋玩家登入資訊
  if (isNow) {
    dateChoose.value.changeDate(new Date(), new Date())
    nextTick(() => {
      getData(page)
    })
  } else {
    getData(page)
  }
}
//
const closeActStatus = ref(false)
const closeActData = ref({})
const closeAct = (data) => {
  // console.log(data)
  closeActStatus.value = true
  closeActData.value = data.row
}
//
const receiveNumModal = ref(false)
const receiveNumData = ref()
const showReceiveNumModal = (data) => {
  if (
    checkAgent(['開發商', '財會', '主管', '總代理', '幹部', '客服主管', '財務', '客服'])
  ) {
    receiveNumModal.value = true
    receiveNumData.value = data
    // console.log(data)
  }
}
//
const addnewActModalStatus = ref(false)
//
const openAddnewActModal = () => {
  addnewActModalStatus.value = true
}
//
const edditActModalStatus = ref(false)
const edditModaldata = ref(null)
const edditActStatus = (data) => {
  // console.log(data.row)
  edditModaldata.value = data.row
  edditActModalStatus.value = true
}
//
onMounted(() => {})
</script>

  <style lang="scss" scoped>
.page {
  display: flex;
  justify-content: flex-end;
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
