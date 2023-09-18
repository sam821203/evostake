<template>
  <span v-if="Object.keys(detailsData).length">
    <el-popover placement="bottom" width="auto" trigger="hover">
      <ul>
        <li v-for="(item, key) of detailsData.valid_bet_win" :key="item" v-show="key.includes('TWD')">
          <span v-game="key"></span>
          <span>{{ $t('有效投注') }}</span
          >：
          <span v-if="type === 'today'" v-money="item.today_valid_bet / 10000"></span>
          <span v-else v-money="item.period_valid_bet / 10000"></span>
        </li>
      </ul>
      <template #reference>
        <el-icon :size="20"><InfoFilled color="#ad8d60" /></el-icon>
      </template>
    </el-popover>
  </span>
</template>

<script setup>
defineProps({
  detailsData: Object,
  type: String
})
</script>
