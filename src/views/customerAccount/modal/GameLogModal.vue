<template>
  <el-dialog
    :model-value="gameLogModal"
    :width="listModalWidth"
    @close="closeListModal"
    :destroy-on-close="true"
    :show-close="!detailModal"
  >
    <template #header>
      <h2>{{ $t('遊戲紀錄') }}</h2>
    </template>
    <el-form :label-width="isEn ? '150px' : '100px'" label-position="left" class="form">
      <el-form-item :label="$t('玩家ID')">
        <el-input v-model="totalData.pid" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('玩家帳號')">
        <el-input v-model="totalData.account" disabled></el-input>
      </el-form-item>
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
    <div class="gameLogList">
      <div v-if="!mobileWidth" class="table" :style="{ height: gameLogData.length === 0 ? '115px' : '435px' }">
        <el-table
          :data="gameLogData"
          border
          style="width: 100%"
          :height="gameLogData.length === 0 ? '115px' : '435px'"
          :empty-text="$t('無資料')"
        >
          <el-table-column :label="$t('投注時間')" align="center" width="170px">
            <template #default="scope">
              <span v-time="scope.row.time"></span>
            </template>
          </el-table-column>
          <el-table-column prop="round_uuid" :label="$t('局號')" align="center" width="250px" />
          <el-table-column :label="$t('遊戲商')" align="center">
            <template #default="scope">
              <span v-if="scope.row.studio">{{ $t(scope.row.studio) }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('遊戲類型')" align="center" width="110px">
            <template #default="scope">
              <span v-if="scope.row.game_type">{{ $t(gameTypeData[scope.row.game_type]) }}</span>
            <!-- {{gameTypeData}} -->
            <!-- {{scope.row.game_type}} -->
            </template>
          </el-table-column>
          <el-table-column :label="$t('遊戲名稱')" align="center">
            <template #default="scope">
              <span v-if="scope.row.game_name">{{ $t(gameName?.[scope.row.studio]?.[scope.row.game_name]) }}</span>
              <!-- {{scope.row.studio}}
              {{scope.row.game_name}}
              {{gameName}} -->
            </template>
          </el-table-column>
          <el-table-column :label="$t('總投注')" align="center">
            <template #default="scope">
              <span v-money="scope.row.bet / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('總輸贏')" align="center">
            <template #default="scope">
              <span v-money="scope.row.win_lose / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('投注資訊')" align="center">
            <template #default="scope">
              <el-button
                v-show="scope.row.studio === 'joygames' || scope.row.studio === 'goldenwind' || scope.row.studio === 'jili'"
                type="primary"
                @click="detailBet(scope.row)"
                >{{ $t('詳細資訊') }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-for="item in gameLogData" :key="item.content" v-else>
        <div class="mobileCard">
          <ul>
            <li>
              <p>{{ $t('遊戲時間') }}</p>
              <p v-time="item.created_at"></p>
            </li>
            <li>
              <p>{{ $t('局號') }}</p>
              <p>{{ item.round_uuid }}</p>
            </li>
            <li>
              <p>{{ $t('總投注') }}</p>
              <p v-money="item.total_bet / 10000"></p>
            </li>
            <li>
              <p>{{ $t('總輸贏') }}</p>
              <p v-money="item.total_winlose / 10000"></p>
            </li>
            <li>
              <el-button type="primary" @click="detailBet(item)">{{ $t('詳細資訊') }}</el-button>
            </li>
            <li></li>
          </ul>
        </div>
      </template>
    </div>
    <div class="pag" v-show="mobileWidth">
      <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
    </div>
    <DetaiBetIframe v-model:detailModal="detailModal" :detailData="detailData" />
  </el-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, toRefs, inject, computed, watch } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'
import DetaiBetIframe from '@/components/DetaiBetIframe'
import { getGameLogApi } from '@/api/player'
import useStore from '@/store/index'

const { gameTypeStore } = useStore()
const { gameName } = storeToRefs(gameTypeStore)
const props = defineProps({
  gameLogModal: Boolean,
  totalData: Object
})
const { gameLogModal, totalData } = toRefs(props)

// 遊戲類別
const gameTypeData = {
  0: '其他',
  1: '捕魚',
  2: '拉霸',
  4: '鏈遊',
  8: '撲克',
  16: '賓果',
  32: '桌遊',
  128: 'Crash',
  256: '真人',
  512: '其他'
}

// 日期
const dateData = ref({})
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 搜尋
const gameLogData = ref([])
const totalPage = ref(0)
const currentPage = ref(0)
const getCurPage = (page) => search(page)
const search = async (page) => {
  currentPage.value = page
  if (!dateExist.value) return
  const { data } = await getGameLogApi(totalData.value.pid, dateData.value, page)
  if (data.code !== 200) return
  gameLogData.value = data.data.data ?? []
  totalPage.value = data.data.totalN
}

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const listModalWidth = computed(() => (wh.value === 'xl' ? '1400px' : '95%'))
const mobileWidth = computed(() => wh.value === 'sm')

// modal 開關
const emit = defineEmits(['update:gameLogModal'])
const closeListModal = () => {
  gameLogData.value = []
  dateData.value = []
  totalPage.value = 0
  emit('update:gameLogModal', false)
}

// 細單
const detailModal = ref(false)
const detailData = ref({})
const detailBet = (data) => {
  detailModal.value = true
  detailData.value = data
  detailData.value.pid = totalData.value.pid
}

// 取得遊戲名稱
watch(gameLogModal, (val) => {
  if (val && Object.keys(gameName.value).length === 0) gameTypeStore.getGames()
})

const isEn = localStorage.getItem('locale') === 'EN'
</script>

<style lang="scss" scoped>
.el-input {
  width: 20% !important;
  @include breakpoint-up('sm') {
    width: 50% !important;
  }
}

.gameLogList {
  @include breakpoint-up('sm') {
    height: calc(100vh - 330px);
    overflow-y: scroll;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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
</style>
