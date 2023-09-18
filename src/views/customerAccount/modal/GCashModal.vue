<template>
  <el-dialog :model-value="gCashModal" :width="500" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t('手機號數量') }}</h2>
    </template>
    <ul>
      <li v-for="(value, key) in totalData.g_cash" :key="key">
        <div>
          <p>{{ value }}</p>
          <p>{{ key }}</p>
        </div>
        <el-button v-if="canHandlePlayer" type="primary" class="danger" @click="handleRemove(value, key)">{{ $t('刪除') }}</el-button>
      </li>
    </ul>
  </el-dialog>
</template>

<script setup>
import { watch } from 'vue-demi'
import { removeGCashApi } from '@/api/player'
import { storeToRefs } from 'pinia'
import useStore from '@/store/index'

const emit = defineEmits(['update:gCashModal', 'updatePlayer'])

const props = defineProps({
  canHandlePlayer: Boolean,
  gCashModal: Boolean,
  totalData: Object
})

const { msgStore } = useStore()

const { openMsg } = msgStore
const { implement, type } = storeToRefs(msgStore)
let address
const handleRemove = (value, key) => {
  address = key
  openMsg({
    content: [
      {
        text: '確定要刪除此GCash帳號?',
        color: 'black'
      },
      {
        text: value,
        color: 'black'
      },
      {
        text: key,
        color: 'black'
      }
    ],
    type: 'gCash'
  })
}
watch(implement, async () => {
  if (type.value === 'gCash' && implement.value) {
    const { data } = await removeGCashApi({ u9: props.totalData.pid, address })
    msgStore.$patch({ type: '' })
    if (data.code === 200) {
      emit('updatePlayer')
      closeModal()
    }
  }
})

// modal 開關
const closeModal = () => {
  emit('update:gCashModal', false)
}
</script>

<style lang="scss" scoped>
ul {
  li {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 18px;
    }
  }
}
</style>
