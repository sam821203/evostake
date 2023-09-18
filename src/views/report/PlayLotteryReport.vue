<template>
  <section>
    <h2 v-show="!mobileWidth">{{ $t('遊戲開獎結果報表') }}</h2>
    <div class="type">
      <el-select v-model="gameType">
        <el-option v-for="(item, key) of hashGame" :key="key" :label="$t(item)" :value="+key" />
      </el-select>
      <el-select v-model="tableType" class="table">
        <el-option :label="$t('全部')" value="" />
        <el-option v-for="item in tableData" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
    </div>
    <DatePeriod @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
        <el-button type="primary" v-show="!mobileWidth && playLotteryData.length" @click="excel">Excel</el-button>
      </template>
    </DatePeriod>
  </section>
  <section>
    <h2 v-show="!mobileWidth" class="container">
      {{ $t('詳細報表') }}<Pagination v-if="!mobileWidth" :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" :pageSize="10"/>
    </h2>
    <div v-if="!mobileWidth" class="table" :style="{ height: playLotteryData.length === 0 ? '115px' : 'calc(100vh - 347px)' }">
      <el-table
        :data="playLotteryData"
        border
        style="width: 100%"
        :height="playLotteryData.length === 0 ? '115px' : 'calc(100vh - 347px)'"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('遊戲開獎結果報表')"
      >
        <el-table-column prop="id" :label="$t('局號')" align="center" width="200">
          <template #default="scope">
            <a href="#" @click.prevent="detailBet(scope.row)" class="link">{{ scope.row.round_uuid }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="block_tx_id" :label="$t('交易')" align="center">
          <template #default="scope">
            <span v-if="scope.row.block_tx_id">{{ scope.row.block_tx_id }}</span>
            <span v-else>未取得</span>
          </template>
        </el-table-column>
        <el-table-column prop="block_hash" :label="$t('區塊')" align="center">
          <template #default="scope">
            <a v-if="scope.row.block_hash" class="link" :href="`${tronscan}${scope.row.block_num}`" target="_blank">{{
              scope.row.block_hash
            }}</a>
            <span v-else>未取得</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-else v-for="item in playLotteryData" :key="item.id">
      <div class="mobileCard">
        <ul>
          <li>
            <p>{{ $t('局號') }}</p>
            <a class="link" href="#" @click.prevent="detailBet(item)">{{ item.round_uuid }}</a>
          </li>
          <li></li>
          <li>
            <p>{{ $t('交易') }}</p>
            <p v-if="item.block_tx_id">{{ item.block_tx_id }}</p>
            <p v-else>未取得</p>
          </li>
          <li></li>
          <li>
            <p>{{ $t('區塊') }}</p>
            <a v-if="item.block_hash" class="link" :href="`${tronscan}${item.block_num}`" target="_blank">{{ item.block_hash }}</a>
            <p v-else>未取得</p>
          </li>
          <li></li>
        </ul>
      </div>
    </template>
    <div class="pag" v-show="mobileWidth">
      <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
    </div>
    <DetaiBetIframe v-model:detailModal="detailModal" :detailData="detailData" />
  </section>
</template>

<script setup>
import { ref, inject, computed, watch } from 'vue-demi'
import DatePeriod from '@/components/date/DatePeriod'
import Pagination from '@/components/Pagination'
import DetaiBetIframe from '@/components/DetaiBetIframe'
import { getPlayLotteryApi, getPlayLotteryTableApi } from '@/api/report'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const gameType = ref(15)
const tableType = ref('')
const tronscan = ref(process.env.VUE_APP_TRONSCAN)

// 日期
const dateData = ref({})
const newDate = ref(0)
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

const hashGame = {
  15: '超級牛牛',
  16: '競速百家',
  17: '大小單雙',
  18: '龍虎鬥',
  19: '哈希足球',
  20: '哈希輪盤',
  21: '色碟',
  22: '哈希天九',
  23: '搶莊牛牛',
  24: '世足PK賽',
  25: '哈希魚蝦蟹',
  26: '哈希賽馬',
  27: '輪盤16',
  28: '哈希鬥雞'
}

// 搜尋報表資料
const totalPage = ref(0)
const currentPage = ref(0)
const getCurPage = (page) => search(page)
const playLotteryData = ref([])
const search = async (page) => {
  currentPage.value = page
  if (!dateExist.value) return
  const { data } = await getPlayLotteryApi(tableType.value, dateData.value, page, gameType.value)
  if (data.code !== 200) return
  playLotteryData.value = data.data.data ?? []
  totalPage.value = data.data.total
}

// 取得桌號
const playLotteryTableData = ref([])
const getTableData = async () => {
  const { data } = await getPlayLotteryTableApi()
  if (data.code !== 200) return
  playLotteryTableData.value = data.data.data
}
const tableData = computed(() => playLotteryTableData.value.filter((item) => item.game_type === gameType.value))
getTableData()

// 更換遊戲類別重置桌號
watch(gameType, () => (tableType.value = ''))

// 細單
const detailModal = ref(false)
const detailData = ref({})
const detailBet = (data) => {
  detailModal.value = true
  detailData.value = data
  detailData.value.pag = currentPage.value
}

// excel
const excel = () => {
  exportTableToExcel(document.querySelectorAll('#table'), t('遊戲開獎結果報表'))
}

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')
</script>

<style lang="scss" scoped>
.btnReport {
  display: flex;
  margin-bottom: 10px;
  @include breakpoint-up('sm') {
    .el-button {
      max-width: initial;
      &:first-child {
        margin: 0 !important;
      }
    }
  }
}

.type {
  margin-bottom: 5px;
  .table {
    @include breakpoint-up('sm') {
      margin-left: 5px;
    }
  }
  @include breakpoint-up('sm') {
    margin-bottom: 0;
  }
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  h2 {
    width: 100%;
  }
}
</style>
