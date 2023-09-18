<template>
  <el-form :label-width="mobileWidth ? '120px' : '150px'" label-position="top">
    <div class="row">
      <el-form-item :label="$t('玩家帳號/暱稱')">
        <p>{{ totalData.account }}/{{ totalData.nickname }}</p>
      </el-form-item>
      <el-form-item :label="$t('所屬代理/暱稱')">
        <p>{{ totalData.agentAccount }}/{{ totalData.agentNickname }}</p>
      </el-form-item>
      <el-form-item :label="$t('玩家餘額')">
        <span v-money="totalData.twd_balance / 10000"></span>
      </el-form-item>
      <el-form-item></el-form-item>
      <el-form-item :label="$t(`${title}類型`)">
        <el-select v-model="cashData.handleType" :disabled="check">
          <el-option :label="$t(`請選擇${title}類型`)" value="" disabled />
          <!-- <el-option :label="cashInOutStatus === 'in' ? $t('開分') : $t('提款')" :value="1" /> -->
          <el-option :label="$t('優惠活動')" :value="2" v-if="cashInOutStatus === 'in'" />
          <el-option :label="$t('特殊扣款')" :value="2" v-else />
          <el-option :label="cashInOutStatus === 'in' ? $t('增加提款門檻') : $t('減少提款門檻')" :value="3" />
        </el-select>
      </el-form-item>
      <div v-if="!check && !mobileWidth"></div>
      <el-form-item
        :label="$t(`${title}金額`)"
        :class="{ quota: !check }"
        v-show="cashData.handleType === 1 || (cashData.handleType === 2 && cashInOutStatus === 'out')"
      >
        <template #label>
          <p>{{ $t(`${title}金額`) }}</p>
          <span class="hint">{{ $t('金額上限10萬') }}</span>
        </template>
        <el-input v-model.number="cashData.points" :disabled="check" />
        <template v-if="!check">
          <!-- <span class="quotaText init_quota">{{ $t('分數') }} : <span v-money="points"></span></span> -->
          <div class="quotaText temp_quota">
            <el-button
              :class="[cashInOutStatus === 'in' ? 'in' : 'out']"
              v-for="item in btnGroup"
              :key="item"
              :type="disabledPointsBtn(item) ? 'primary' : 'warning'"
              @click="addScore(item)"
              >+ $ <span v-money="item"></span>
            </el-button>
          </div>
        </template>
      </el-form-item>
      <template v-if="!check || (check && cashData.bonus > 0)">
        <el-form-item
          :class="{ quota: !check }"
          v-show="(cashData.handleType === 1 || cashData.handleType === 2) && cashInOutStatus !== 'out'"
        >
          <template #label>
            <p>{{ $t('紅利金額') }}</p>
            <span class="hint">{{ $t('金額上限10萬') }}</span>
          </template>
          <el-input v-model.number="cashData.bonus" :disabled="check" />
          <!-- <template v-if="!check"> -->
          <!-- <span class="quotaText init_quota">{{ $t('分數') }} : <span v-money="bonus"></span></span> -->
          <!-- <div class="quotaText temp_quota">
              <el-button
                class="bonus"
                v-for="item in btnGroup"
                :key="item"
                :type="disabledBonusBtn(item) ? 'primary' : 'warning'"
                @click="addBonus(item)"
                >+ $ <span v-money="item"></span>
              </el-button>
            </div> -->
          <!-- </template> -->
        </el-form-item>
      </template>
      <div v-show="cashData.handleType === 2 && cashInOutStatus === 'in' && !mobileWidth && !check"></div>
      <template v-if="!check || (check && cashData.threshold > 0)">
        <el-form-item
          v-show="(cashInOutStatus === 'in' && cashData.handleType) || (cashInOutStatus === 'out' && cashData.handleType === 3)"
        >
          <template #label>
            <p>{{ $t('提款門檻') }}</p>
            <el-popover placement="top-start" width="auto" trigger="hover">
              <ul class="formula" v-if="cashInOutStatus === 'in'">
                <li>{{ $t('增加提款門檻類型有以下三種:') }}</li>
                <li>{{ $t('增加分數: 輸入要增加的提款門檻') }}</li>
                <li>{{ $t('增加倍數: 依照「 開分 + (紅利 * 倍數) 提款門檻 」') }}</li>
                <li>{{ $t('直接指定: 將目前的提款門檻直接改為指定的分數') }}</li>
              </ul>
              <ul class="formula" v-else>
                <li>{{ $t('減少提款門檻類型有以下兩種:') }}</li>
                <li>{{ $t('減少分數: 輸入要扣除的提款門檻') }}</li>
                <li>{{ $t('直接指定: 將目前的提款門檻直接改為指定的分數') }}</li>
              </ul>
              <template #reference>
                <el-icon :size="25"><InfoFilled color="#ad8d60" /></el-icon>
              </template>
            </el-popover>
          </template>
          <el-select v-model="cashData.thresholdType" :disabled="check">
            <el-option :label="$t('請選擇類型')" value="" disabled />
            <el-option :label="cashInOutStatus === 'in' ? $t('增加分數') : $t('減少分數')" :value="1" />
            <el-option :label="$t('增加倍數')" :value="2" v-show="cashData.handleType !== 3" />
            <el-option :label="$t('直接指定')" :value="3" />
          </el-select>
          <el-input style="max-width: 40%" v-model.number="cashData.threshold" :disabled="check || !cashData.thresholdType" />
        </el-form-item>
      </template>
      <el-form-item :label="$t('目前有效流水')">
        <div class="flow">
          <p v-money="flow" :class="[initThreshold > flow ? 'danger' : 'info']"></p>
          <p class="danger noThreshold" v-if="!check && initThreshold > flow">({{ $t('不可提款') }})</p>
        </div>
      </el-form-item>
      <el-form-item :label="$t('異動後提款門檻')">
        <div class="flow">
          <p v-money="cashData.newThreshold" class="info"></p>
        </div>
      </el-form-item>
      <el-form-item :label="$t('目前提款門檻')">
        <div class="flow">
          <p v-money="initThreshold" class="info"></p>
        </div>
      </el-form-item>
    </div>
    <el-form-item :label="$t('備註')" class="memo" v-show="!check || (check && cashData.info)">
      <el-input
        v-model="cashData.info"
        type="textarea"
        :rows="4"
        maxlength="20"
        :placeholder="$t('可輸入備註上限20字')"
        :disabled="check"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, toRefs, inject, computed, watch } from 'vue-demi'
import useStore from '@/store/index'
import { useI18n } from 'vue-i18n'

const { msgStore } = useStore()

defineEmits(['update:cashData', 'search'])
const props = defineProps({
  cashInOutStatus: String,
  totalData: Object,
  cashData: Object, //
  check: Boolean
})
const { check, cashData, totalData, cashInOutStatus } = toRefs(props)

const title = computed(() => (cashInOutStatus.value === 'in' ? '開分' : '洗分'))

// 開洗分案鑑
const btnGroup = [100, 1000, 10000, 50000]
const resetBtn = ref(0)

// 輸入上限
const upperLimit = 100000

// 鑽石、U幣比值轉換
const points = computed(() => (cashData.value.currencyType === 'TWD' ? cashData.value.points : cashData.value.points * 300))
const bonus = computed(() => (cashData.value.currencyType === 'TWD' ? cashData.value.bonus : cashData.value.bonus * 300))

// 目前選擇幣種
const score = computed(() => {
  return cashData.value.currencyType === 'TWD' ? totalData.value.twd_balance / 10000 : totalData.value.usdt_balance / 10000
})

// 開洗分後餘額
const balance = computed(() => {
  return cashInOutStatus.value === 'in' ? score.value + points.value : score.value - points.value
})

// 判斷可否洗分
const checkPostPoints = (num) => {
  return cashInOutStatus.value === 'out' && balance.value - (cashData.value.currencyType === 'TWD' ? num : num * 300) < 0
}

// 輸入開洗分額度
const addScore = (num) => {
  if (checkPostPoints(num)) return
  if (cashData.value.points + num > upperLimit) return
  cashData.value.points += num
  resetBtn.value++
}

// 開洗分案鑑灰階狀態
const disabledPointsBtn = (num) => {
  if (checkPostPoints(num)) return false
  return cashData.value.points + num <= upperLimit
}

// 輸入紅利額度
// const addBonus = (num) => {
//   if (cashData.value.bonus + num > upperLimit) return
//   cashData.value.bonus += num
//   resetBtn.value++
// }

// 紅利案鑑灰階狀態
// const disabledBonusBtn = (num) => {
//   return +cashData.value.bonus + num <= upperLimit
// }

// 目前有效流水
const flow = computed(() => totalData.value.wallet[cashData.value.currencyType].flow / 10000)

// 目前有效門檻
const initThreshold = computed(() => totalData.value.wallet[cashData.value.currencyType].threshold / 10000)

// 異動後門檻
if (!check.value) {
  cashData.value.newThreshold = initThreshold.value
}

// 確認資訊隱藏radio
const radio = computed(() => (check.value ? 'none' : 'block'))

// 開洗分幣別類型變更重置資料
watch(
  () => cashData.value.currencyType,
  () => (cashData.value.handleType = '')
)

// 開洗分類型變更重置資料
watch(
  () => cashData.value.handleType,
  () => {
    cashData.value.points = 0
    cashData.value.bonus = 0
    cashData.value.thresholdType = ''
  }
)

// 門檻類型變更重置資料
watch(
  () => cashData.value.thresholdType,
  () => {
    cashData.value.threshold = 0
  }
)

// 驗證開洗紅利
const { openMsg } = msgStore
const { t } = useI18n()
watch(
  () => cashData.value.points,
  (newValue, oldValue) => {
    if (newValue === '' || newValue < 0) return (cashData.value.points = 0)
    if ((cashData.value.currencyType === 'TWD' ? newValue : newValue * 300) > score.value && cashInOutStatus.value === 'out') {
      cashData.value.points = oldValue
      openMsg({ content: t('玩家餘額不足') })
    }
    if (newValue > 100000) {
      cashData.value.points = oldValue
      openMsg({ content: t(`${title.value}不可超過10萬`) })
    }
  }
)
watch(
  () => cashData.value.bonus,
  (newValue, oldValue) => {
    if (newValue === '' || newValue < 0) return (cashData.value.bonus = 0)
    if (newValue > 100000) {
      cashData.value.bonus = oldValue
      openMsg({ content: t('紅利不可超過10萬') })
    }
  }
)
watch(
  () => cashData.value.threshold,
  (newValue, oldValue) => {
    if (newValue === '' || newValue < 0) return (cashData.value.threshold = 0)
    if (cashInOutStatus.value === 'out' && cashData.value.thresholdType === 1 && cashData.value.threshold > 0) {
      if (initThreshold.value - cashData.value.threshold < 0) {
        cashData.value.threshold = oldValue
        openMsg({ content: t('提款門檻不足') })
      }
    }
  }
)

// 計算異動後提款門檻
watch(
  () => [cashData.value.points, cashData.value.bonus, cashData.value.threshold, cashData.value.thresholdType, cashData.value.currencyType],
  () => {
    // 當提款門檻沒有數值時只計算開洗分金額
    if (!cashData.value.threshold && cashInOutStatus.value === 'in') {
      cashData.value.newThreshold = initThreshold.value + points.value
    }

    // 當提款門檻有數值時
    switch (cashData.value.thresholdType) {
      // 增加/減少分數
      case 1:
        if (cashInOutStatus.value === 'in') {
          cashData.value.newThreshold = initThreshold.value + cashData.value.threshold
        }
        if (cashInOutStatus.value === 'out') {
          cashData.value.newThreshold = initThreshold.value - cashData.value.threshold
        }
        break
      // 增加倍數
      case 2:
        cashData.value.newThreshold = initThreshold.value + points.value + bonus.value * cashData.value.threshold
        break
      // 直接指定
      case 3:
        cashData.value.newThreshold = cashData.value.threshold
        break
    }
  }
)

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const mobileWidth = computed(() => wh.value === 'sm')
</script>

<style lang="scss" scoped>
p {
  font-size: 18px;
}

.content {
  p {
    &:first-child {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      white-space: nowrap;
      @include breakpoint-up('sm') {
        width: 120px !important;
      }
    }
    span {
      margin: 0 10px 0 0 !important;
    }
  }
}

:deep .el-form-item {
  .el-form-item__content {
    flex-wrap: nowrap;
    > span {
      color: $dark;
      font-size: 18px;
      margin-right: 10px;
      font-weight: 900;
    }
  }
  .el-textarea {
    width: 96%;
  }
  .el-form-item__label {
    justify-content: start;
    height: auto;
  }
  .el-input__wrapper {
    width: 180px;
  }
  .el-radio {
    margin-top: 5px;
    height: auto;
  }
  .el-radio__label {
    display: flex;
    align-items: center;
  }
  .el-radio__inner {
    display: v-bind(radio);
  }
  .el-radio-group {
    flex-wrap: nowrap;
  }
}

:deep .threshold {
  position: relative;
  .el-input__wrapper {
    width: 140px;
  }
  .threshold-input {
    position: absolute;
    top: 0;
    right: 30px;
    width: 150px;
    @include breakpoint-up('xl') {
      position: initial;
      padding-left: 135px;
      width: 100%;
    }
  }
  .el-form-item__content > .el-icon {
    position: absolute;
    left: -70px;
    @include breakpoint-up('sm') {
      left: -50px !important;
    }
  }
}

.quotaText {
  left: 0 !important;
  &.temp_quota {
    display: flex;
    @include breakpoint-up('sm') {
      left: 0;
    }
    .el-button {
      min-width: 75px !important;
      max-width: 75px !important;
      height: 30px !important;
      margin: 0 5px 0 0 !important;
      font-size: 14px;
    }
  }
}

.flow {
  display: flex;
  p {
    &.danger {
      color: red;
    }
    &.info {
      color: #2b7acc;
    }
    &.noThreshold {
      margin-left: 10px;
    }
  }
}

.hint {
  color: red;
  font-size: 16px;
}
</style>
