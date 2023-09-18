<template>
  <div class="table" :style="{ height: playerData.length === 0 ? '115px' : 'calc(100vh - 350px)' }">
    <el-table
      @row-click="clickDetailsData"
      :row-class-name="tableRowClassName"
      :data="playerData"
      border
      style="width: 100%"
      :empty-text="$t('無資料')"
      id="table"
      :height="playerData.length === 0 ? '115px' : 'calc(100vh - 350px)'"
      class="playerListTable"
    >
      <!-- <el-table-column align="center" width="150px" height="150px">
        <template #header>{{ $t('玩家頭像') }}</template>
        <template #default="scope">
          <img :src="avatarData[scope.row.pid]" alt="" class="avatar" v-if="avatarData[scope.row.pid]" />
        </template>
      </el-table-column> -->
      <el-table-column prop="account" :label="$t('玩家帳號')" align="center" />
      <el-table-column prop="realname" :label="$t('真實姓名')" align="center" />
      <el-table-column prop="nickname" :label="$t('玩家暱稱')" align="center" />
      <el-table-column :label="$t('玩家餘額')" align="center" width="150px">
        <template #default="scope">
          <span v-if="scope.row.formal" v-money="scope.row.twd_balance / 10000"></span>
          <span v-else v-money="scope.row.wallet?.TEST?.balance / 10000"></span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('今日存款')" align="center">
        <template #default="scope">
          <span v-money="scope.row.history?.today.charge / 10000"></span>
        </template>
      </el-table-column>
      <el-table-column v-if="timeStatus" prop="createtime" :label="$t('註冊時間')" align="center" width="170px">
        <template #default="scope">
          <span v-time="scope.row.createtime"></span>
        </template>
      </el-table-column>
      <el-table-column v-else prop="updatetime" :label="$t('最後登入時間')" align="center" width="170px">
        <template #default="scope">
          <span v-time="scope.row.updatetime"></span>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template #header>{{ $t('詳細資訊') }}</template>
        <el-button type="primary" @click="emit('update:playDetailsModal', true)">{{ $t('詳細資訊') }}</el-button>
      </el-table-column>
      <el-table-column prop="memo" :label="$t('備註')" align="center" />
    </el-table>
  </div>
</template>

<script setup>
import { watch, toRefs } from 'vue-demi'

const props = defineProps({
  playerData: Array,
  avatarData: Object,
  timeStatus: Boolean
})
const { playerData } = toRefs(props)

const emit = defineEmits(['update:detailsData', 'update:playDetailsModal'])

watch(playerData, () => {
  if (!playerData.value.length) return
  emit('update:detailsData', playerData.value[0])
  playerData.value[0].focus = true
})

// 點擊行取得資料給父級
const clickDetailsData = (row) => {
  // 資料傳父級
  emit('update:detailsData', row)

  // 玩家資訊點擊行更改被景色
  playerData.value.forEach((item) => {
    item.focus = item.account === row.account
  })
}

// 點擊行更改被景色(玩家資訊)
const tableRowClassName = ({ row }) => {
  if (row.focus) return 'target'
}
</script>

<style lang="scss">
.playerListTable {
  .el-table__row td {
    height: 100px;
  }
  .target {
    --el-table-tr-bg-color: #efb4d8 !important;
    color: black;
  }
  .el-table__row {
    cursor: pointer;
  }
  .el-button {
    min-width: 80px !important;
    max-width: 80px !important;
  }
  img {
    width: 25px;
    position: relative;
    top: 5px;
  }
  .cell {
    display: flex;
    justify-content: center;
  }
}
</style>
