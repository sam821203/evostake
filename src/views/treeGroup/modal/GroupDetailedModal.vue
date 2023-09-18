<template>
  <el-dialog :model-value="groupDetailedModal" :width="modalWidth" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t('本級資訊') }}</h2>
    </template>
    <ul class="playerInfo" :class="{ isEn }">
      <li>
        {{ $t('代理帳號') }} : <span>{{ groupDetailedData.name }}</span>
      </li>
      <li>
        {{ $t('代理暱稱') }} : <span>{{ groupDetailedData.nickname }}</span>
      </li>
      <li>
        {{ $t('本級階級') }} : <span>{{ $t(childName) }}</span>
      </li>
      <li>{{ $t('狀態') }} : <span v-status="groupDetailedData.status"></span></li>
      <li>
        {{ $t('上級代理帳號') }} : <span>{{ targetTree.name === 'root' ? 'root' : targetTree.father_name }}</span>
      </li>
      <li>
        {{ $t('上級代理暱稱') }} : <span>{{ targetTree.name === 'root' ? $t(targetTree.nickname) : $t(targetTree.father_nickname) }}</span>
      </li>
      <li>
        {{ $t('鏈遊分潤') }}(%) : <span>{{ groupDetailedData.percent?.hash?.profit / 1000 }}</span>
      </li>
      <li>
        {{ $t('鏈遊返水') }}(‰) :
        <span v-if="hashStatus">{{ groupDetailedData.percent?.hash?.rebate / 100 }}</span>
        <span v-else class="close">{{ $t('關閉') }}</span>
      </li>
      <li>
        {{ $t('棋牌佔成') }}(%) : <span>{{ groupDetailedData.percent?.goldenwind_pk?.profit / 1000 }}</span>
      </li>
      <li></li>
      <!-- <li>
        {{ $t('體育分潤') }}(%) : <span>{{ groupDetailedData.percent?.sport?.profit / 1000 }}</span>
      </li>
      <li>
        {{ $t('體育競猜返水') }}(‰) :
        <span v-if="sportStatus">{{ groupDetailedData.percent?.sport?.rebate / 100 }}</span>
        <span v-else class="close">{{ $t('關閉') }}</span>
      </li> -->
      <li>
        {{ $t('電子遊戲分潤') }}(%) : <span>{{ groupDetailedData.percent?.ele?.profit / 1000 }}</span>
      </li>
      <li>
        {{ $t('電子遊戲返水') }}(‰) :
        <span v-if="eleStatus">{{ groupDetailedData.percent?.ele?.rebate / 100 }}</span>
        <span v-else class="close">{{ $t('關閉') }}</span>
      </li>
    </ul>
  </el-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, inject, computed, toRefs, watch } from 'vue-demi'
import useStore from '@/store/index'

const props = defineProps({
  groupDetailedModal: Boolean
})
const { groupDetailedModal } = toRefs(props)
const emit = defineEmits(['update:groupDetailedModal'])

// 階級資料
const { treeStore } = useStore()
const { targetTree } = storeToRefs(treeStore)
const childName = computed(() => treeStore.levelText(targetTree.value.level))

// 取得本級資料
const groupDetailedData = ref({})
const getData = async () => {
  if (!targetTree.value.name) return
  const { data } = await treeStore.getGroupData(targetTree.value.name)
  if (data.code !== 200) return
  groupDetailedData.value = data.data.data
}
watch(groupDetailedModal, () => {
  if (groupDetailedModal.value) getData()
})

// 返水開關狀態
const hashStatus = computed(() => groupDetailedData.value.percent?.hash?.status)
// const sportStatus = computed(() => groupDetailedData.value.percent?.sport?.status)
const eleStatus = computed(() => groupDetailedData.value.percent?.ele?.status)

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const modalWidth = computed(() => (wh.value === 'xl' ? '800px' : '95%'))

// modal 開關
const closeModal = () => {
  emit('update:groupDetailedModal', false)
}

const isEn = localStorage.getItem('locale') === 'EN'
</script>

<style lang="scss" scoped>
.playerInfo {
  border: 1px solid $dark;
  border-radius: 5px;
  margin: 10px 0;
  color: $dark;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  li {
    width: 50%;
    padding: 10px 0;
    text-align: center;
    border-bottom: 1px solid $dark;
    &:nth-last-child(-n + 2) {
      border: none;
    }
    &.mobile {
      @include breakpoint-up('sm') {
        width: 100%;
        text-align: start;
        padding-left: 10px;
      }
    }
    span {
      &.close {
        color: red;
      }
    }
  }
  &.isEn {
    li {
      @include breakpoint-up('sm') {
        width: 100%;
      }
    }
  }
}
</style>
