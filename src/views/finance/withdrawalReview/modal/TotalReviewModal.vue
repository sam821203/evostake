<template>
  <el-dialog :model-value="totalReviewModal" width="1000px" :show-close="true" @close="closeModal()" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t(`一鍵${typeText}設定`) }}</h2>
    </template>
    <p v-if="isDoubleConfirm"></p>
    <!-- {{ $t(`確定要一次${typeText}以下提款單?`) }} -->
    <div v-else class="search">
      <p>{{ $t(`請輸入提款批量${typeText}之上限`) }}</p>
      <div class="input">
        <el-input v-model="money" :placeholder="$t('請輸入數字')" />
        <i class="bi bi-search" @click="searchData"></i>
      </div>
      <!-- <p>{{ isReview ? $t('確認後將自動出款') : $t('確認後將進入審核') }}</p> -->
    </div>
    <div class="table" :style="{ height: newTotalData.length === 0 ? '105px' : 'calc(100vh - 300px)' }">
      <el-table
        :data="newTotalData"
        border
        style="width: 100%"
        :height="newTotalData.length === 0 ? '105px' : 'calc(100vh - 300px)'"
        :empty-text="$t('無資料')"
      >
        <el-table-column prop="choose" :label="$t('玩家帳號')" align="center">
          <template #header>
            <input
              type="checkbox"
              :disabled="isDoubleConfirm"
              :indeterminate="chooseAll"
              v-model="chooseAllBoolean"
              @input="ctrlChooseData"
            />
          </template>
          <template #default="scope">
            <input type="checkbox" :disabled="isDoubleConfirm" :value="scope.row.oid" v-model="chooseData" />
            <!-- <span>{{ scope.row.oid }}</span> -->
            <!-- <img :src="avatarData[scope.row.pid]" alt="" class="avatar" v-if="avatarData[scope.row.pid]" /> -->
          </template>
        </el-table-column>
        <el-table-column prop="account" :label="$t('玩家帳號')" align="center" />
        <el-table-column prop="real_name" :label="$t('真實姓名')" align="center" />
        <el-table-column prop="agent" :label="$t('所屬代理')" align="center" />
        <el-table-column :label="$t('提款金額')" align="center">
          <template #default="scope">
            <span v-money="scope.row.amount / 10000"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('風控數量')" align="center">
          <template #default="scope">
            <span
              :class="scope.row.feng_kong_count > 0 ? 'jumpLink' : ''"
              @click="jumpPlayerDataReport(scope.row.feng_kong_count, scope.row.account)"
              >{{ scope.row.feng_kong_count }}</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="isDoubleConfirm" class="info">
      <div>
        <p>
          <!-- ${typeText} -->
          {{ $t(`總筆數`) }}: <span>{{ chooseData.length }}{{ $t('筆') }}</span>
        </p>
        <!-- ${typeText} -->
        <p>{{ $t(`總金額`) }}: <span class="money" v-money="totalMoney / 10000"></span></p>
        <p>
          {{ $t(`風控警示人數`) }}: <span :style="{ color: fongkongCount > 0 ? 'red' : '' }">{{ fongkongCount }}</span>
        </p>
      </div>
    </div>
    <div class="btnGroup">
      <template v-if="isDoubleConfirm">
        <el-button type="primary" class="danger" @click="closeModal()">{{ $t('取消') }}</el-button>
        <el-button @click="handleOrder()" :type="chooseData.length > 0 ? 'primary' : 'warning'">{{ $t('確認') }}</el-button>
      </template>
      <el-button v-else :type="chooseData.length > 0 ? 'primary' : 'warning'" @click="handleDoubleConfirm">{{ $t('確認') }}</el-button>
    </div>
  </el-dialog>
  <ul>
    <li></li>
  </ul>
</template>

<script setup>
import { ref, computed, watch } from 'vue-demi'
import { handleOrderApi } from '@/api/record'
import useStore from '@/store/index'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const router = useRouter()

const { t } = useI18n()

const { msgStore } = useStore()
const { openMsg } = msgStore

const emit = defineEmits(['update:totalReviewModal', 'updateReport'])

const props = defineProps({
  totalReviewModal: Boolean,
  totalData: Array
})

const isReview = computed(() => props.totalData.type === 'review')

const typeText = computed(() => (isReview.value ? '確認' : '審核'))

const money = ref('')
const isDoubleConfirm = ref(false)
const newTotalData = ref([])
const totalMoney = ref()
const fongkongCount = ref()
// computed(() => newTotalData.value.reduce((a, b) => a + b.amount, 0))
const chooseData = ref([])
const chooseAll = computed(() => {
  if (chooseData.value.length > 0 && chooseData.value.length !== newTotalData.value.length) {
    return true
  } else {
    return false
  }
})
const chooseAllBoolean = ref(false)
watch(chooseData, (e) => {
  let moneys = 0
  let fonkonCount = 0
  newTotalData.value.forEach((el) => {
    if (e.indexOf(el.oid) >= 0) {
      moneys += Number(el.amount)
      fonkonCount += Number(el.feng_kong_count) > 0 ? 1 : 0
    }
  })
  totalMoney.value = moneys
  fongkongCount.value = fonkonCount
})
const ctrlChooseData = () => {
  // props.totalReviewModal.feng_kong_count
  if (chooseAllBoolean.value) {
    chooseData.value = []
  } else {
    chooseData.value = []
    newTotalData.value.forEach((el) => {
      if (el.feng_kong_count === 0) {
        chooseData.value.push(el.oid)
      }
    })
  }
}
const handleOrder = async () => {
  // 確認中轉換審核為6
  // 審核中轉換已派單為2
  const status = isReview.value ? 2 : 6
  // const oids = newTotalData.value.map((item) => item.oid)
  const oids = chooseData.value
  const { data } = await handleOrderApi({ oids, status })
  emit('updateReport')
  if (data.code === 200) {
    openMsg({ title: t(`一鍵${typeText.value}完成`), content: t(`${typeText.value}完成，請於提款審核列表確認`), hasBtn: false })
  }
  closeModal()
}

// 篩選提款金額
const searchData = () => {
  const targetStatus = isReview.value ? '6' : '1'
  newTotalData.value = props.totalData.filter((item) => item.amount / 10000 <= money.value && item.status === targetStatus)
  if (newTotalData.value.length === 0) openMsg({ content: t('查無資料') })
}

// 二次確認
const handleDoubleConfirm = () => {
  if (chooseData.value.length === 0) {
    return false
  }
  if (newTotalData.value.length) isDoubleConfirm.value = true
}

// modal 開關
const closeModal = () => {
  emit('update:totalReviewModal', false)
  money.value = ''
  newTotalData.value = []
  chooseAllBoolean.value = false
  chooseData.value = []
  isDoubleConfirm.value = false
}
// 跳轉玩家數據報表
const jumpPlayerDataReport = (num, acc) => {
  if (num <= 0) return false
  setTimeout(() => {
    const { href } = router.resolve({
      name: 'controlLog',
      params: {
        jumpParam: acc
      }
    })
    window.open(href, '_blank') // 打开新的窗口
  }, 0)
}
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  align-items: center;
  justify-content: center;
  .el-input {
    width: 200px;
    margin-left: 10px;
  }
}

.table {
  margin: 20px 0;
}

.input {
  position: relative;
  i {
    position: absolute;
    right: 16px;
    color: orange;
    top: 15%;
    font-size: 20px;
    cursor: pointer;
  }
}

p {
  font-size: 18px;
  text-align: center;
}

.info {
  display: flex;
  justify-content: center;
  margin: 20px;
  p {
    text-align: start;
    &:first-child {
      margin-bottom: 10px;
    }
    .money {
      color: red;
    }
  }
}
</style>
