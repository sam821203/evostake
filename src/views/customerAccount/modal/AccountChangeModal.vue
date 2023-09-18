<template>
  <el-dialog :model-value="accountChangeModal" :width="listModalWidth" @close="closeListModal" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t('帳變明細') }}</h2>
    </template>
    <el-form :label-width="isEn ? '150px' : '100px'" label-position="left" class="form">
      <div class="formItem">
        <el-form-item :label="$t('玩家ID')">
          <el-input v-model="totalData.pid" disabled class="w-50"></el-input>
        </el-form-item>
        <el-form-item :label="$t('玩家帳號')">
          <el-input v-model="totalData.account" disabled class="w-50"></el-input>
        </el-form-item>
      </div>
      <div class="formItem">
        <el-form-item :label="$t('玩家暱稱')">
          <el-input v-model="totalData.nickname" disabled class="w-50"></el-input>
        </el-form-item>
        <el-form-item v-if="totalData.formal" :label="$t('玩家餘額')">
          <p v-money="totalData.twd_balance / 10000"></p>
        </el-form-item>
        <el-form-item v-else :label="$t('玩家餘額')">
          <p v-money="totalData.wallet?.TEST.balance / 10000"></p>
        </el-form-item>
      </div>
      <div class="formItem">
        <el-form-item :label="$t('幣別')">
          <el-select v-model="currency" :disabled="!totalData.formal">
            <template v-if="totalData.formal">
              <el-option :label="$t('鑽石')" value="TWD" />
            </template>
            <el-option :label="$t('體驗金')" value="TEST" />
          </el-select>
        </el-form-item>
        <el-form-item></el-form-item>
      </div>
    </el-form>
    <div class="container">
      <div>
        <DateChoose @getDate="getDate" :dateTitle="true">
          <template #search>
            <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
          </template>
        </DateChoose>
      </div>
      <Pagination v-if="!mobileWidth" :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
    </div>
    <div class="accountChangeList">
      <div v-if="!mobileWidth" class="table" :style="{ height: accountChangeData.length === 0 ? '115px' : '350px' }">
        <el-table
          :data="accountChangeData"
          border
          style="width: 100%"
          :height="accountChangeData.length === 0 ? '115px' : '350px'"
          :empty-text="$t('無資料')"
          id="table"
          :data-name="$t('概括總計')"
        >
          <el-table-column prop="time" :label="$t('異動時間')" align="center">
            <template #default="scope">
              <span v-time="scope.row.time"></span>
            </template>
          </el-table-column>
          <el-table-column prop="transfer_type" :label="$t('異動內容')" align="center">
            <template #default="scope">
              <span v-if="scope.row.transfer_type">{{ updateType(scope.row) ? updateType(scope.row) : $t(scope.row.transfer_type) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="before_money" :label="$t('異動前分數')" align="center">
            <template #default="scope">
              <span v-money="scope.row.before_money / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" :label="$t('異動分數')" align="center">
            <template #default="scope">
              <span v-money="scope.row.amount / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column prop="after_money" :label="$t('異動後分數')" align="center">
            <template #default="scope">
              <span v-money="scope.row.after_money / 10000"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-else v-for="item in accountChangeData" :key="item.time">
        <div class="mobileCard">
          <ul>
            <li>
              <p>{{ $t('異動時間') }}</p>
              <p v-time="item.time"></p>
            </li>
            <li>
              <p>{{ $t('異動內容') }}</p>
              <p>{{ item.transfer_type }}</p>
            </li>
            <li>
              <p>{{ $t('異動前分數') }}</p>
              <p v-money="item.before_money / 10000"></p>
            </li>
            <li>
              <p>{{ $t('異動分數') }}</p>
              <p v-money="item.amount / 10000"></p>
            </li>
            <li>
              <p>{{ $t('異動後分數') }}</p>
              <p v-money="item.after_money / 10000"></p>
            </li>
            <li></li>
          </ul>
        </div>
      </template>
    </div>
    <div class="pag" v-show="mobileWidth">
      <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
    </div>
  </el-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, toRefs, inject, computed, watch } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import { getAccountChangeApi } from '@/api/player'
import useStore from '@/store/index'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { gameTypeStore } = useStore()
const { gameName } = storeToRefs(gameTypeStore)

const props = defineProps({
  accountChangeModal: Boolean,
  totalData: Object
})
const { accountChangeModal, totalData } = toRefs(props)
const dateExist = computed(() => Object.keys(dateData.value).length)

const currency = ref('TWD')
watch(accountChangeModal, () => {
  currency.value = !totalData.value.formal && accountChangeModal.value ? 'TEST' : 'TWD'
})

const dateData = ref({})
const getDate = (date) => (dateData.value = date)

const accountChangeData = ref([])
const totalPage = ref(0)
const currentPage = ref(0)
const getCurPage = (page) => search(page)
const search = async (page) => {
  currentPage.value = page
  if (!dateExist.value) return
  const { data } = await getAccountChangeApi(totalData.value.pid, dateData.value, page, currency.value)
  if (data.code !== 200) {
    totalPage.value = 0
    accountChangeData.value = []
    return
  }

  accountChangeData.value = data.data.data ?? []
  totalPage.value = data.data.total ?? 0
}

// 取得遊戲名稱
watch(accountChangeModal, (val) => {
  if (val && Object.keys(gameName.value).length === 0) gameTypeStore.getGames()
})

// 遊戲名稱異動內容翻譯
const updateType = (data) => {
  if (!data) return
  const type = data.transfer_type.split(' ')
  return isNaN(+type[0]) || type[0] === '' ? false : `${t(gameName.value[data.extra1][type[0]])} ${t(type[1])}`
}

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const listModalWidth = computed(() => (wh.value === 'xl' ? '1200px' : '95%'))
const mobileWidth = computed(() => wh.value === 'sm')

// modal 開關
// 管理員列表 modal
const emit = defineEmits(['update:accountChangeModal'])
const closeListModal = () => {
  accountChangeData.value = []
  dateData.value = []
  totalPage.value = 0
  emit('update:accountChangeModal', false)
}

const isEn = localStorage.getItem('locale') === 'EN'
</script>

<style lang="scss" scoped>
.el-input {
  @include breakpoint-up('sm') {
    width: 50% !important;
  }
}

.accountChangeList {
  @include breakpoint-up('sm') {
    height: calc(100vh - 385px);
    overflow-y: scroll;
  }
}

:deep .formItem {
  display: flex;
  @include breakpoint-up('sm') {
    display: block;
  }
  .el-form-item {
    &:last-child {
      margin-left: 20px;
      @include breakpoint-up('sm') {
        margin-left: 0;
      }
    }
    .el-form-item__label {
      font-size: 18px;
      font-weight: 900;
    }
    p {
      font-size: 16px;
    }
    .score {
      display: flex;
    }
    .content {
      display: flex;
      align-items: center;
    }
    .line {
      margin: 0 5px;
    }
  }
}

.table {
  margin-top: 10px;
}

.form {
  .el-form-item {
    @include breakpoint-up('sm') {
      margin-bottom: 5px !important;
    }
  }
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
</style>
