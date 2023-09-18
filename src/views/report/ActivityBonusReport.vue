<template>
  <section>
    <h2>{{ $t("活動紅利報表") }}</h2>
    <div class="searchGroup">
      <el-select v-model="searchType">
        <el-option :label="$t('全部玩家')" value="1" />
        <el-option :label="$t('玩家帳號')" value="2" />
        <el-option :label="$t('玩家暱稱')" value="3" />
        <el-option :label="$t('所屬代理 ')" value="4" />
        <el-option :label="$t('真實姓名')" value="5" />
        <el-option :label="$t('身分證')" value="6" />
      </el-select>
      <el-input v-show="searchType !== '1'" v-model="searchStr" />
    </div>
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="!loading && dateExist ? 'primary' : 'warning'" @click="search(1)">
          {{ $t("搜尋") }}
          <i v-show="loading" class="fas fa-spinner fa-spin"></i>
        </el-button>
        <el-button :type="!loading ? 'primary' : 'warning'" v-show="bonusDetailData.length" @click="excel">
          Excel<i v-show="loading" class="fas fa-spinner fa-spin"></i>
        </el-button>
      </template>
    </DateChoose>
  </section>
  <section>
    <h2>{{ $t("概括總計") }}</h2>
    <table class="originTable" id="table" :data-name="$t('概括總計')">
      <thead>
        <tr>
          <th class="white"></th>
          <th>{{ $t("活動紅利") }}</th>
          <th>{{ $t("體驗達標紅利") }}</th>
          <th>{{ $t("幸運壺罐") }}</th>
          <th>{{ $t("七日登入") }}</th>
          <th>{{ $t("VIP晉升紅利") }}</th>
          <th>{{ $t("好友推薦紅利") }}</th>

          <th>{{ $t("好友存款返利") }}</th>
          <th>{{ $t("好友投注返利") }}</th>
          <!-- <th>{{ $t('返水') }}</th> -->
          <th>{{ $t("月紅利") }}</th>
          <th>{{ $t("總紅利") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="blue">{{ $t("派發次數") }}</td>
          <td v-money="bonusTotalData.event_bouns_frequency"></td>
          <td v-money="bonusTotalData.regist_test_coin_frequency"></td>
          <td v-money="bonusTotalData.lucky_jug_frequency"></td>
          <td v-money="bonusTotalData.seven_days_frequency"></td>
          <td v-money="bonusTotalData.upgrade_bouns_frequency"></td>
          <td v-money="bonusTotalData.invite_bouns_frequency"></td>
          <td v-money="bonusTotalData.rebate_charge_bonus_frequency"></td>
          <td v-money="bonusTotalData.rebate_bet_bonus_frequency"></td>
          <!-- <td v-money="bonusTotalData.friend_bet_bouns_frequency"></td>
          <td v-money="bonusTotalData.rebate_frequency"></td> -->
          <td v-money="bonusTotalData.period_bouns_frequency"></td>
          <!-- 總紅利 -->
          <td rowspan="3" v-money="bonusTotalData.total / 10000"></td>
        </tr>
        <tr>
          <td class="blue">{{ $t("派發人數") }}</td>
          <td v-money="bonusTotalData.event_bouns_ppl"></td>
          <td v-money="bonusTotalData.regist_test_coin_ppl"></td>
          <td v-money="bonusTotalData.lucky_jug_ppl"></td>
          <td v-money="bonusTotalData.seven_days_ppl"></td>
          <td v-money="bonusTotalData.upgrade_bouns_ppl"></td>
          <td v-money="bonusTotalData.invite_bouns_ppl"></td>
          <td v-money="bonusTotalData.rebate_charge_bonus_ppl"></td>
          <td v-money="bonusTotalData.rebate_bet_bonus_ppl"></td>
          <!-- <td v-money="bonusTotalData.friend_bet_bouns_ppl"></td>
          <td v-money="bonusTotalData.rebate_ppl"></td> -->
          <td v-money="bonusTotalData.period_bouns_ppl"></td>
        </tr>
        <tr>
          <td class="blue">{{ $t("派發紅利") }}</td>
          <td v-money="bonusTotalData.total_event_bouns / 10000"></td>
          <td v-money="bonusTotalData.total_regist_test_coin / 10000"></td>
          <td v-money="bonusTotalData.total_lucky_jug / 10000"></td>
          <td v-money="bonusTotalData.total_seven_days / 10000"></td>
          <td v-money="bonusTotalData.total_upgrade_bouns / 10000"></td>
          <td v-money="bonusTotalData.total_invite_bouns / 10000"></td>

          <td v-money="bonusTotalData.total_rebate_charge_bonus / 10000"></td>
          <td v-money="bonusTotalData.total_rebate_bet_bonus / 10000"></td>
          <!-- <td v-money="bonusTotalData.rebate_bet_bonus / 10000"></td> -->
          <!-- <td v-money="bonusTotalData.total_friend_bet_bouns / 10000"></td>
          <td v-money="bonusTotalData.total_rebate / 10000"></td> -->
          <td v-money="bonusTotalData.total_periodbouns / 10000"></td>
        </tr>
      </tbody>
    </table>
  </section>
  <section>
    <h2 class="page">
      {{ $t("詳細記錄") }}
      <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
    </h2>
    <div class="table" :style="{ height: bonusDetailData.length === 0 ? '110px' : '400px' }">
      <el-table
        :data="bonusDetailData"
        border
        style="width: 100%"
        :height="bonusDetailData.length === 0 ? '110px' : '400px'"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('詳細資訊')"
        @sort-change="sortData"
      >
        <el-table-column prop="account" :label="$t('玩家帳號')" align="center" />
        <el-table-column prop="nickname" :label="$t('玩家暱稱')" align="center" />
        <el-table-column prop="agent_account" :label="$t('所屬代理帳號')" align="center" />
        <el-table-column :index="0" :label="$t('活動紅利')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.event_bouns / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :index="1" :label="$t('體驗達標紅利')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.regist_test_coin / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :index="2" :label="$t('幸運壺罐')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.lucky_jug / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :index="9" :label="$t('七日登入')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.seven_days / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :index="3" :label="$t('VIP晉升紅利')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.vip_upgrade / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :index="4" :label="$t('好友推薦紅利')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.invite_bouns / 10000"></span>
          </template>
        </el-table-column>
        <!-- 0717 -->
        <el-table-column :index="10" :label="$t('好友存款返利')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.rebate_charge_bonus / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :index="11" :label="$t('好友投注紅利')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.rebate_bet_bonus / 10000"></span>
          </template>
        </el-table-column>
        <!-- <el-table-column :index="5" :label="$t('好友投注紅利')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.friend_bet_bouns / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :index="6" :label="$t('返水')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.rebate / 10000"></span>
          </template>
        </el-table-column> -->
        <el-table-column :index="7" :label="$t('月紅利')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.period_bouns / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :index="8" :label="$t('總紅利')" align="center" sortable>
          <template #default="scope">
            <span v-money="scope.row.total / 10000"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import { getDividendApi } from '@/api/report'
import Pagination from '@/components/Pagination'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const searchType = ref('1')
const searchStr = ref('')

// 日期
const dateData = ref({})
const newDate = ref(0)
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 搜尋
const bonusTotalData = ref({})
const bonusDetailData = ref([])
const totalPage = ref(0)
const loading = ref(false)
let tempDetailData = []
const search = async () => {
  bonusTotalData.value = []
  bonusDetailData.value = []
  if (!dateExist.value || loading.value) return

  loading.value = true
  const { data } = await getDividendApi(dateData.value, searchType.value, searchStr.value)
  if (data.code === 200) {
    bonusTotalData.value = data.data.data
    bonusDetailData.value = data.data.data.detail ?? []

    // console.log(bonusDetailData.value)
    // 取得第一頁
    totalPage.value = bonusDetailData.value.length
    tempDetailData = bonusDetailData.value
    pageData(1)
  }
  loading.value = false
}

// 詳細資訊排序
const sortData = ({ column, prop, order }) => {
  let type
  switch (column.index) {
    case 0:
      type = 'event_bouns'
      break
    case 1:
      type = 'regist_test_coin'
      break
    case 2:
      type = 'lucky_jug'
      break
    case 3:
      type = 'vip_upgrade'
      break
    case 4:
      type = 'invite_bouns'
      break
    case 5:
      type = 'friend_bet_bouns'
      break
    case 6:
      type = 'rebate'
      break
    case 7:
      type = 'period_bouns'
      break
    case 8:
      type = 'total'
      break
    case 9:
      type = 'seven_days'
      break
    case 10:
      type = 'rebate_charge_bonus'
      break
    case 11:
      type = 'rebate_bet_bonus'
      break
  }
  console.log(order)
  tempDetailData = tempDetailData.sort((a, b) => {
    return order === 'ascending' ? a[type] - b[type] : b[type] - a[type]
  })
  // ascending
  // descending
  pageData(1)
}

// 詳細資訊分頁換算
const getCurPage = (page) => pageData(page)
const playerBetDataPage = (min, max) => {
  bonusDetailData.value = tempDetailData.filter((i, key) => key + 1 >= min && key + 1 <= max)
}
const currentPage = ref(0)
const pageData = (num) => {
  const pagNum = 100
  const min = num * pagNum - pagNum + 1
  const max = num * pagNum
  currentPage.value = num
  playerBetDataPage(min, max)
}

// 搜尋類別切換重置
watch(searchType, () => (searchStr.value = ''))

// excel
const updateBonusDetailData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      bonusDetailData.value = tempDetailData
      resolve()
    }, 0)
  })
}
const excel = async () => {
  if (loading.value) return
  loading.value = true
  await updateBonusDetailData()
  await nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#table'), t('活動紅利報表'))
  })
  pageData(currentPage.value)
  loading.value = false
}
</script>

<style lang="scss" scoped>
.originTable {
  .white {
    background-color: white;
  }
  .blue {
    background-color: $light;
    font-family: "Noto Sans TC";
  }
}
</style>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
</style>
