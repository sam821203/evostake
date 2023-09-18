<template>
  <section>
    <h2 v-if="!mobileWidth">{{ $t('簡訊紀錄') }}</h2>
    <div class="searchGroup">
      <el-select v-model="searchType">
        <el-option :label="$t('全部代理')" :value="1" />
        <el-option :label="$t('指定一級代理帳號')" :value="2" />
        <el-option :label="$t('指定一級代理暱稱')" :value="3" />
      </el-select>
      <el-input v-model="searchStr" :placeholder="searchType === 1 ? $t('請輸入手機號碼') : ''" />
    </div>
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
        <el-button type="primary" v-show="!mobileWidth && briefnewsLogData.length" @click="excel"> Excel </el-button>
      </template>
    </DateChoose>
  </section>
  <div class="reportGroup" v-if="!mobileWidth || briefnewsLogData.length">
    <section>
      <h2>{{ $t('概括總計') }}</h2>
      <table class="originTable" :data-name="$t('概括總計')" id="table">
        <thead>
          <tr>
            <th>{{ $t('簡訊商') }}</th>
            <th>{{ $t('發訊總筆數') }}</th>
            <th>{{ $t('總簡訊費(美金)') }}</th>
          </tr>
        </thead>
        <template v-if="!briefnewsLogData.length">
          <tbody>
            <tr class="noData">
              <td colspan="14">{{ $t('無資料') }}</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody>
            <tr>
              <td>{{ $t('樂雲') }}</td>
              <td>{{ summaryData.leyun }}</td>
              <td>{{ summaryData.leyun * 0.062 }}</td>
            </tr>
            <tr>
              <td>{{ $t('短信雲') }}</td>
              <td>{{ summaryData.short }}</td>
              <td>{{ summaryData.short * 0.062 }}</td>
            </tr>
          </tbody>
        </template>
      </table>
      <!-- <div v-if="!mobileWidth" class="table summaryTable" :style="{ height: briefnewsLogData.length === 0 ? '100px' : '80px' }">
        <el-table
          :data="summaryData"
          border
          style="width: 100%"
          :height="briefnewsLogData.length === 0 ? '100px' : '75px'"
          :empty-text="$t('無資料')"
          id="table"
          :data-name="$t('概括總計1')"
        >
          <el-table-column :label="$t('簡訊商')" align="center">
            <template #default>
              <span>LEYUN</span>
            </template>
          </el-table-column>
          <el-table-column prop="count" :label="$t('發訊總筆數')" align="center" />
          <el-table-column :label="$t('總簡訊費(美金)')" align="center">
            <template #default="scope">
              <span v-money="scope.row.count * 0.062"></span>
            </template>
          </el-table-column>
        </el-table>
      </div> -->
      <div v-if="!mobileWidth" class="table" :style="{ height: briefnewsLogData.length === 0 ? '100px' : '400px' }">
        <el-table
          :data="briefnewsLogData"
          border
          style="width: 100%"
          :height="briefnewsLogData.length === 0 ? '100px' : '400px'"
          :empty-text="$t('無資料')"
          id="table"
          :data-name="$t('概括總計2')"
        >
          <el-table-column :label="$t('一級代理名稱/暱稱')" align="center">
            <template #default="scope">
              <span>{{ scope.row.agent_ac }}/{{ scope.row.agent_nickname }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="count" :label="$t('發送數')" align="center" />
          <el-table-column :label="$t('簡訊費(美金)')" align="center">
            <template #default="scope">
              <span v-money="scope.row.count * 0.062"></span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 暫無手機版 -->
      <!-- <div v-else class="mobileCard">
        <ul>
          <li></li>
        </ul>
      </div> -->
    </section>
    <section>
      <h2>{{ $t('驗證列表') }}</h2>
      <div v-if="!mobileWidth" class="table" :style="{ height: detailData.length === 0 ? '100px' : '400px' }">
        <el-table
          :data="detailData"
          border
          style="width: 100%"
          :height="detailData.length === 0 ? '100px' : '400px'"
          :empty-text="$t('無資料')"
          id="table"
          :data-name="$t('詳細報表')"
        >
          <el-table-column :label="$t('發送時間')" align="center">
            <template #default="scope">
              <span v-time="scope.row.time"></span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('類型')" align="center">
            <template #default>
              <span>{{ $t('註冊') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="phone_number" :label="$t('手機號碼')" align="center" />
          <el-table-column prop="code" :label="$t('驗證碼')" align="center" />
        </el-table>
      </div>
      <!-- 暫無手機版 -->
      <!-- <template v-else v-for="item in detailData" :key="item.agent_ac">
        <div class="mobileCard">
          <ul>
            <li></li>
          </ul>
        </div>
      </template> -->
    </section>
  </div>
</template>

<script setup>
import { ref, computed, inject, nextTick, watch } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import { getBriefnewsLogApi } from '@/api/record'
import { exportTableToExcel } from '@/utils/useExportExcel'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 日期
const dateData = ref({})
const newDate = ref(0)
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 搜尋
const briefnewsLogData = ref([])
const detailData = ref([])
const searchStr = ref('')
const searchType = ref(1)
const search = async () => {
  if (!dateExist.value) return
  const { data } = await getBriefnewsLogApi(searchType.value, searchStr.value, dateData.value)
  briefnewsLogData.value = data.data.data ?? []

  if (searchType.value === 1 && searchStr.value && data.data.detail) {
    detailData.value = data.data.detail.filter((item) => item.phone_number === searchStr.value)
    handleSummary()
    return
  }
  detailData.value = data.data.detail ?? []
  handleSummary()
}

// 概括總計
const summaryData = ref({})
const handleSummary = () => {
  summaryData.value = {}
  if (!detailData.value.length) return
  summaryData.value.leyun = detailData.value.filter((item) => item.company === '樂雲').length
  summaryData.value.short = detailData.value.filter((item) => item.company === '短信雲').length
}

watch(searchType, () => {
  searchStr.value = ''
})

// excel
const excel = () => {
  const tempbriefnewsLogData = briefnewsLogData.value
  nextTick(() => {
    exportTableToExcel(document.querySelectorAll('#table'), t('簡訊紀錄'))
  })
  setTimeout(() => (briefnewsLogData.value = tempbriefnewsLogData), 0)
}

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')
</script>

<style lang="scss" scoped>
.originTable {
  margin-bottom: 10px;
}
</style>
