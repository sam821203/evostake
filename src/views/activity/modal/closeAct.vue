<template>
  <el-dialog :model-value="closeActStatus" :width="thisWidth" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t("關閉活動") }}</h2>
    </template>
    <div class="mainText">
      <div>
        {{ $t("確認要立即關閉") }}
        <span class="fontRed">
          <!-- {{ "活動名稱" }} -->
          {{ totalData.promotion }}
        </span>
        ?
      </div>
      <div class="redText">
        {{ $t("注意！原來已派發的活動獎勵不會回收，已領取的玩家亦不受影響；但後續玩家無法再參與該活動。") }}
      </div>
      <div class="redText">{{ $t("活動被關閉將無法再次啟用！") }}</div>
    </div>
    <div class="btnGroup">
      <el-button type="danger" @click="closeModal">{{ $t("取消") }}</el-button>

      <el-button type="warning" v-if="countTime != 0">{{ countTime }}...</el-button>
      <el-button type="primary" @click="save" v-else>{{ $t("確認") }}</el-button>
      <!-- :type="dateExist ? 'primary' : 'warning'" -->
    </div>
  </el-dialog>
</template>

<script setup>
import { toRefs, computed, ref, watch } from 'vue-demi'
import { closeactivityList } from '@/api/activity'
const emit = defineEmits(['update:closeActStatus', 'updatePlayer', 'searchData'])
const props = defineProps({
  closeActStatus: Boolean,
  totalData: Object
})
const { closeActStatus, totalData } = toRefs(props)

const thisWidth = computed(() => '800px')

//
const save = async () => {
  // if (totalData.value) {
  //   console.log(totalData.value.id)
  //   return
  // }
  const { data } = await closeactivityList(totalData.value.id)
  // console.log(data)
  if (data.code === 200) {
    // 關閉成功，重新搜尋
    closeModal()
    emit('searchData')
  }
}

// modal 開關
// 管理員列表 modal
const closeModal = () => {
  clearInterval(intervalTime.value)
  emit('update:closeActStatus', false)
}
// 倒數
const countTime = ref(3)
const intervalTime = ref(null)
watch(closeActStatus, (v) => {
  //   console.log(v)
  if (v === true) {
    countTime.value = 3
    intervalTime.value = setInterval(() => {
      if (countTime.value === 0) {
        clearInterval(intervalTime.value)
      } else {
        countTime.value -= 1
      }
    }, 1000)
  }
})
</script>

  <style lang="scss" scoped>
.mainText {
  width: 100%;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  > div {
    text-align: center;
    margin-bottom: 0.5rem;
  }
  .redText {
    font-size: 1rem;
    color: red;
  }
  .fontRed {
    color: red;
  }
}
</style>
