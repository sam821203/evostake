<template>
  <div class="searchGroup">
    <el-input v-model="agentName" :placeholder="$t('搜尋指定代理名稱')"></el-input>
    <el-button type="primary" @click="emit('searchAgent', agentName)">{{ $t('搜尋') }}</el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue-demi'

const agentName = ref('')
const emit = defineEmits(['searchAgent'])
</script>

<style lang="scss" scoped>
.searchGroup {
  width: 80%;
  margin-left: 20px !important;
}

:deep .el-input__wrapper {
  height: 30px !important;
}

:deep .el-button {
  height: 30px !important;
  span {
    color: white !important;
  }
}
</style>
