<template>
  <div class="table" :style="{ height: data?.length === 0 ? '130px' : 'calc(100vh - 350px)' }" v-if="data.length>0">
    <el-table
      :data="data"
      v-if="data?.length > 0"
      border
      style="width: 100%"
      :height="data?.length === 0 ? '130px' : 'calc(100vh - 350px)'"
      :empty-text="$t('無資料')"
      id="table"
      :data-name="$t('本級玩家詳細輸贏')"
      :row-class-name="id ? rowClassName : ''"
      @cell-mouse-enter="enter"
      @cell-mouse-leave="leave"
      @sort-change="sortData"
    >
      <!-- :span-method="objectSpanMethod" -->
      <el-table-column :index="0" :label="$t('玩家帳號/暱稱')" align="center" sortable>
        <template #default="scope">
          <span>{{ scope.row.player_account }}/{{ scope.row.player_nickname }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="game" :label="$t('遊戲分類')" align="center" sortable>
        <template #default="scope">
          <span v-game="scope.row.game"></span>
        </template>
      </el-table-column> -->
      <el-table-column :index="1" :label="$t('總存款')" align="center" sortable>
        <template #default="scope">
          <span v-money="scope.row.charge / 10000"></span>
        </template>
      </el-table-column>

      <el-table-column :index="2" :label="$t('總提款')" align="center" sortable>
        <template #default="scope">
          <span v-money="scope.row.consign / 10000"></span>
        </template>
      </el-table-column>
      <!--  -->
      <el-table-column :index="3" :label="$t('存提差')" align="center" sortable>
        <template #default="scope">
          <span v-money="scope.row.trade_difference / 10000"></span>
        </template>
      </el-table-column>

      <el-table-column :index="4" :label="$t('總紅利')" align="center" sortable>
        <template #default="scope">
          <!-- 0328 -->
          <span v-money="scope.row.bonus / 10000"></span>
        </template>
      </el-table-column>

      <el-table-column :index="5" :label="$t('總投注')" align="center" sortable>
        <template #default="scope">
          <span v-money="scope.row.game_total_detail.bet / 10000"></span>
        </template>
      </el-table-column>
      <el-table-column :index="6" :label="$t('總贏分')" align="center" sortable>
        <template #default="scope">
          <span v-money="scope.row.game_total_detail.win / 10000"></span>
        </template>
      </el-table-column>
      <el-table-column :index="7" :label="$t('總輸贏')" align="center" sortable>
        <template #default="scope">
          <span v-money="scope.row.game_total_detail.win_lose / 10000"></span>
        </template>
      </el-table-column>
      <el-table-column :index="8" :label="$t('有效投注')" align="center" sortable>
        <template #default="scope">
          <span v-money="scope.row.game_total_detail.rw / 10000" v-if="scope.row.game !== 'goldenwind_pk'"></span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column :index="9" :label="$t('邀請好友數')" align="center" sortable>
        <template #default="scope">
          <span :class="scope.row.invite_count > 0 ? 'jumpLink' : ''" @click="getFriends(scope.row.player_id, scope.row.player_account)">{{
            scope.row.invite_count
          }}</span>
        </template>
      </el-table-column>

      <!-- <el-table-column prop="return_water_percent" :label="$t('返水‰')" align="center">
        <template #default="scope">
          <span v-money="scope.row.rw_percent / 100" v-if="scope.row.game !== 'goldenwind_pk'"></span>
          <span v-else>-</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="return_water_value" :label="$t('返水')" align="center">
        <template #default="scope">
          <span v-money="scope.row.rw_value / 10000" v-if="scope.row.game !== 'goldenwind_pk'"></span>
          <span v-else>-</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column prop="result" :label="$t(isTreeGroupPath ? $t('應收付') : $t('總淨利'))" align="center">
        <template #default="scope">
          <span v-money="scope.row.result / 10000"></span>
        </template>
      </el-table-column> -->
    </el-table>
    <div v-else style="border: 1px solid black; height: 80px; display: flex; justify-content: center; align-items: center; color: #909399">
      {{ $t('無資料') }}
    </div>
  </div>
  <FriendsModal v-model:friendsModal="friendsModal" :playerAccount="playerAcc" :friendsData="friendsData" />
</template>

<script setup>
// import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue-demi'
import FriendsModal from '@/views/customerAccount/modal/FriendsModal.vue'
import { getFriendsApi } from '@/api/player'
const props = defineProps({
  data: Array,
  gameNum: Number
})
const emit = defineEmits(['changePage'])
// 詳細資訊排序
const sortData = ({ column, prop, order = 'descending' }) => {
  if (order === null) {
    order = 'descending'
  }
  if (!column) {
    column = {}
    column.index = 0
  }
  console.log(order)
  let type = []
  switch (column.index) {
    case 0:
      type = ['player_account']
      break
    case 1:
      type = ['charge']
      break
    case 2:
      type = ['consign']
      break
    case 3:
      type = ['trade_difference']
      break
    case 4:
      type = ['bonus']
      break
    case 5:
      type = ['game_total_detail', 'bet']
      break
    case 6:
      type = ['game_total_detail', 'win']
      break
    case 7:
      type = ['game_total_detail', 'win_lose']
      break
    case 8:
      type = ['game_total_detail', 'rw']
      break
    case 9:
      type = ['invite_count']
      break
    default:
      type = ['charge']
      break
  }

  emit('changePage', [type, order])
}
// 好友彈窗
const friendsModal = ref(false)
const friendsData = ref({})
const playerAcc = ref()
const getFriends = async (playerid, Account) => {
  const { data } = await getFriendsApi(playerid, '')
  friendsModal.value = true
  playerAcc.value = Account
  console.log(data)
  if (data.code !== 200) return
  friendsData.value = data.data.data
  if (friendsData.value.detail) {
    friendsData.value.detail.forEach((item, index) => {
      friendsData.value.detail[index].dividend = 0
    })
  }
}
onMounted(() => {
  console.log(props.data)
})
// const route = useRoute()
// const isTreeGroupPath = computed(() => route.path === '/treeGroup')

const id = ref('')
const rowClassName = ({ row, rowIndex }) => {
  if (row.player_id === id.value) return 'hover-row'
}

const enter = (row, column, cell, event) => {
  id.value = row.player_id
}

const leave = () => {
  id.value = ''
}

// const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
//   if (columnIndex === 0 || columnIndex >= 8) {
//     if (rowIndex % props.gameNum === 0) {
//       return {
//         rowspan: props.gameNum,
//         colspan: 1
//       }
//     } else {
//       return {
//         rowspan: 0,
//         colspan: 0
//       }
//     }
//   }
// }
</script>

<style lang="scss" scoped>
:deep .el-table {
  .el-table__row td:last-of-type {
    border-right: 1px solid black !important;
  }
}
</style>
