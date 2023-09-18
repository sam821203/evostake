<template>
  <section>
    <h2 v-if="!mobileWidth">{{ $t('遊戲AI報表') }}</h2>
    <div class="searchGroup">
      <el-select v-model="searchType" disabled>
        <el-option :label="$t('搶莊牛牛')" :value="1" />
      </el-select>
    </div>
    <DateChoose @getDate="getDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
      </template>
    </DateChoose>
  </section>
  <section>
    <h2 v-if="!mobileWidth">{{ $t('概括總計') }}</h2>
    <div v-if="!mobileWidth" class="table" :style="{ height: aiReportData.length === 0 ? '115px' : 'calc(100vh - 400px)' }">
      <el-table
        :data="groupData.level ? aiReportData : aiReportData[0]?.data"
        border
        style="width: 100%"
        :height="aiReportData.length === 0 ? '115px' : 'calc(100vh - 400px)'"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('概括總計')"
      >
        <el-table-column :label="$t('')" align="center">
          <template #default>
            <span>棋盤AI</span>
          </template>
        </el-table-column>
        <el-table-column v-if="!groupData.level" prop="group" :label="$t('總代理帳號')" align="center">
          <template #default="scope">
            <span>{{ newTreeData[scope.row.group]?.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="total_bet" :label="$t('總投注')" align="center">
          <template #default="scope">
            <span v-money="scope.row.total_bet / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column prop="total_bet" :label="$t('總輸贏')" align="center">
          <template #default="scope">
            <span v-money="scope.row.total_winlose / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column prop="total_bet" :label="$t('贏分服務費')" align="center">
          <template #default="scope">
            <span v-money="scope.row.total_service_charge / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column prop="total_bet" :label="$t('損益')" align="center">
          <template #default="scope">
            <span v-money="(scope.row.total_winlose * -1 + scope.row.total_service_charge) / 10000"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-else-if="aiReportData.length" v-for="(item, index) in groupData.level ? aiReportData : aiReportData[0]?.data" :key="index">
      <div class="mobileCard">
        <ul>
          <li>
            <p>棋盤AI</p>
          </li>
          <li v-if="groupData.level"></li>
          <li v-else>
            <p>{{ $t('總代理帳號') }}</p>
            <p>{{ newTreeData[item.group].name }}</p>
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
            <p>{{ $t('贏分服務費') }}</p>
            <p v-money="item.total_service_charge / 10000"></p>
          </li>
          <li>
            <p>{{ $t('損益') }}</p>
            <p v-money="(item.total_winlose * -1 + item.total_service_charge) / 10000"></p>
          </li>
        </ul>
      </div>
    </template>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed, inject, watch, onMounted } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import { getAiReportApi } from '@/api/report'
import useStore from '@/store/index'

// 日期
const dateData = ref({})
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 階層資料
const { treeStore } = useStore()
const { treeTotal, groupData } = storeToRefs(treeStore)

const newTreeData = ref({})
const handleTreeData = () => {
  treeTotal.value.forEach((item) => {
    newTreeData.value[item.agent_id] = item
  })
}
watch(treeTotal, () => {
  handleTreeData()
})
onMounted(() => {
  if (Object.keys(treeTotal.value).length) handleTreeData()
})

// 搜尋
const aiReportData = ref([])
const searchType = ref(1)
const search = async () => {
  if (!dateExist.value) return

  // 代理ID
  const id = !groupData.value.level
    ? treeTotal.value.filter((data) => data.level === 1).map((item) => `&group=${item.agent_id}`)
    : [`&group=${groupData.value.agent_id}`]

  const { data } = await getAiReportApi(dateData.value, id.join(''))
  if (data.code !== 200) return
  aiReportData.value = [data.data.data] ?? []
}

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')
</script>
