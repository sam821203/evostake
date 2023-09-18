<template>
  <el-dialog :model-value="addnewActModalStatus" :width="thisWidth" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <!-- <h2>{{ $t(`快派紅利`) }}</h2> -->
      <h2>{{ $t("新增活動") }}</h2>
    </template>

    <div class="btnGroup">
        <el-button type="danger" @click="closeModal">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="save">{{ $t("確認") }}</el-button>
      </div>
  </el-dialog>
</template>

<script setup>
import { toRefs, computed } from 'vue-demi'

const emit = defineEmits(['update:addnewActModalStatus', 'updatePlayer'])
const props = defineProps({
  addnewActModalStatus: Boolean,
  totalData: Object
})
const { addnewActModalStatus } = toRefs(props)

const thisWidth = computed(() => '1300px')

//
const save = async (formEl) => {

}

// modal 開關
// 管理員列表 modal
const closeModal = () => {
  emit('update:addnewActModalStatus', false)
}

</script>

  <style lang="scss" scoped>
</style>
