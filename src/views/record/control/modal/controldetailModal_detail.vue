<template>
  <el-dialog :model-value="detailModal" width="50%" :show-close="true" @close="closeModal(ruleFormRef)" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t(title) }}</h2>
    </template>
    <table>
      <thead>
        <tr>
          <td>{{ $t('玩家帳號') }}</td>
          <td>{{ detaildataTitle }}</td>
        </tr>
        <tr>
          <td>{{ meAccount }}</td>
          <td>{{ $t(fix) }}</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(v, k) in detailData" :key="k">
          <td>
            <span :class="v != meAccount ? 'jumpLink' : ''" @click="openNew(v)">{{ v }}</span>
          </td>
          <td>{{ $t(fix) }}</td>
        </tr>
      </tbody>
    </table>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
// import { toRefs } from 'vue-demi'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const router = useRouter()
const props = defineProps({
  title: { type: String, default: '' },
  fix: String,
  me: String,
  detailData: {
    type: Object,
    default: () => ({
      name: 'John',
      age: 20,
      address: '123 Main St'
    })
  },
  meAccount: String
})
const { t } = useI18n()

const adjustTitle = (e) => {
  let re = ''
  switch (e) {
    case '密碼重複帳號':
      re = '玩家密碼'
      break
    case '交易密碼重複帳號':
      re = '交易密碼'
      break
    case '註冊IP重複帳號':
      re = '註冊IP'
      break
    default:
      re = ''
  }
  return t(re)
}

const detaildataTitle = computed(() => adjustTitle(props.title))

const openNew = (e) => {
  const { href } = router.resolve({
    name: 'controlLog',
    params: {
      jumpParam: e
    }
  })
  window.open(href, '_blank') // 打开新的窗口
}

onMounted(() => {
  console.log(props.meAccount)
})
const emit = defineEmits(['update:controldetailmodelDetailStatus'])
//   detailModal: Boolean,

const detailModal = ref(true)
// const { detailModal } = toRefs(props)

// modal 開關
const closeModal = () => {
  emit('update:controldetailmodelDetailStatus', false)
}
</script>

<style lang="scss" scoped>
table {
  width: 80%;
  font-size: 1.2rem;
}
</style>
