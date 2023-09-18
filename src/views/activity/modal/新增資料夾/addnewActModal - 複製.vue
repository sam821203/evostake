<template>
  <el-dialog :model-value="addnewActModalStatus" :width="thisWidth" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <!-- <h2>{{ $t(`快派紅利`) }}</h2> -->
      <h2>{{ $t("新增活動") }}</h2>
    </template>
    <el-form ref="ruleFormRef" :model="senddatas" :rules="rules" label-width="170px" label-position="left">
      <el-form-item prop="title">
        <template #label>
          <span>{{ $t("活動標題") }}</span>
          <el-popover placement="bottom" width="auto" trigger="hover">
            <ul class="formula" :class="{ isEn }">
              <li>
                <span>{{ $t("此處標題僅供「活動列表」與前台「領取紅利」使用") }}</span>
              </li>
            </ul>
            <template #reference>
              <el-icon :size="31"><InfoFilled color="#ad8d60" style="margin-left: 3px" /></el-icon>
            </template>
          </el-popover>
        </template>
        <el-input v-model="senddatas.title" />
      </el-form-item>

      <!-- class="title" -->
      <el-form-item :label="$t('活動時間')" prop="start_time">
        <DateChoose @getDate="getDate" :choose="false" ref="dateChoose" />
        <el-input v-model="senddatas.start_time" class="time" />
      </el-form-item>
      <!-- <el-form-item :label="$t('活動對象')" prop="target">
          <el-input v-model="senddatas.target" />
        </el-form-item> -->

      <el-form-item prop="eventType">
        <template #label>
          <span>{{ $t("活動類型") }}</span>
          <el-popover placement="bottom" width="auto" trigger="hover">
            <ul class="formula" :class="{ isEn }">
              <li>
                <span>{{ $t("根據選擇的活動類型，決定活動條件計算方式") }}</span>
              </li>
            </ul>
            <template #reference>
              <el-icon :size="31"><InfoFilled color="#ad8d60" style="margin-left: 3px" /></el-icon>
            </template>
          </el-popover>
        </template>
        <el-select v-model="senddatas.eventType" :placeholder="$t('活動類型')" style="width: 100%">
          <!-- <el-option v-for="item in interval" :key="item.num" :label="$t(item.text)" :value="item.num" /> -->
          <el-option value="0" :label="$t('單筆存款')"></el-option>
          <el-option value="1" :label="$t('累積存款')"></el-option>
          <el-option value="2" :label="$t('有效投注')"></el-option>
          <el-option value="3" :label="$t('特殊活動')"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="bonusTarget">
        <template #label>
          <span>{{ $t("紅利類型") }}</span>
          <el-popover placement="bottom" width="auto" trigger="hover">
            <ul class="formula" :class="{ isEn }">
              <li>
                <span>{{ $t("選擇送出的紅利為固定數值、還是用條件面額的百分比計算") }}</span>
              </li>
            </ul>
            <template #reference>
              <el-icon :size="31"><InfoFilled color="#ad8d60" style="margin-left: 3px" /></el-icon>
            </template>
          </el-popover>
        </template>
        <el-select v-model="senddatas.bonusTarget" :placeholder="$t('紅利類型')" style="width: 100%">
          <!-- <el-option v-for="item in interval" :key="item.num" :label="$t(item.text)" :value="item.num" /> -->
          <el-option value="0" :label="$t('固定數值')"></el-option>
          <el-option value="1" :label="$t('百分比')"></el-option>
        </el-select>
      </el-form-item>
      <div style="display: flex" v-for="(v, k) in senddatas.conditionalMark1" :key="k">
        <el-form-item prop="conditionalMark1">
          <template #label>
            <span>{{ $t("條件面額") }}</span>
            <el-popover placement="bottom" width="auto" trigger="hover">
              <ul class="formula" :class="{ isEn }">
                <li>
                  <span>{{ $t("決定活動類型需要多少存款或流水才能達成條件") }}</span>
                </li>
              </ul>
              <template #reference>
                <el-icon :size="31"><InfoFilled color="#ad8d60" style="margin-left: 3px" /></el-icon>
              </template>
            </el-popover>
          </template>
          <div style="position: relative">
            <div style="display: flex; align-items: center; justify-content: space-around">
              <el-input v-model="senddatas.conditionalMark1[k]" />
            </div>
            <span style="position: absolute; font-size: 12px; color: red; left: 0; bottom: -23px" v-if="conditionalMarkAlert[k]">{{
              $t("最小面額必須小於最大面額")
            }}</span>
          </div>
        </el-form-item>

        <el-form-item label="~" prop="conditionalMark2" label-width="5px">
          <el-input v-model="senddatas.conditionalMark2[k]" />
        </el-form-item>

        <el-form-item prop="bonus" label-width="80px">
          <template #label>
            <span>{{ $t("紅利") }}</span>
            <el-popover placement="bottom" width="auto" trigger="hover">
              <ul class="formula" :class="{ isEn }">
                <li>
                  <span>{{ $t("當玩家達成條件面額時，依據「紅利類型」要送出的紅利金額") }}</span>
                </li>
              </ul>
              <template #reference>
                <el-icon :size="31"><InfoFilled color="#ad8d60" style="margin-left: 3px" /></el-icon>
              </template>
            </el-popover>
          </template>
          <el-input v-model="senddatas.bonus[k]" />
        </el-form-item>
        <el-form-item :label="$t('提款流水倍數')" prop="withdrawalMultiple" label-width="160px">
          <template #label>
            <span>{{ $t("提款流水倍數") }}</span>
            <el-popover placement="bottom" width="auto" trigger="hover">
              <ul class="formula" :class="{ isEn }">
                <li>
                  <span>{{ $t("輸入的數字為領取時增加的流水「倍數」") }}</span>
                </li>
              </ul>
              <template #reference>
                <el-icon :size="31"><InfoFilled color="#ad8d60" style="margin-left: 3px" /></el-icon>
              </template>
            </el-popover>
          </template>

          <el-input v-model="senddatas.withdrawalMultiple[k]" />
        </el-form-item>
        <div class="btn_blue" v-if="k === 0" @click="addnewRow">+</div>
        <div class="btn_red" v-else @click="minusRow(k)">-</div>
      </div>
      <el-form-item :label="$t('領取次數')" prop="receiptsNumber">
        <template #label>
          <span>{{ $t("領取次數") }}</span>
          <el-popover placement="bottom" width="auto" trigger="hover">
            <ul class="formula" :class="{ isEn }">
              <li>
                <span>{{ $t("選擇此活動單一玩家可參與的規則") }}</span>
              </li>
            </ul>
            <template #reference>
              <el-icon :size="31"><InfoFilled color="#ad8d60" style="margin-left: 3px" /></el-icon>
            </template>
          </el-popover>
        </template>
        <div style="display: flex">
          <el-select v-model="senddatas.receiptsNumber" style="width: 100%">
            <!-- <el-option v-for="item in interval" :key="item.num" :label="$t(item.text)" :value="item.num" /> -->
            <el-option value="0" :label="$t('無上限')"></el-option>
            <el-option value="1" :label="$t('每日(0:00重置)')"></el-option>
            <el-option value="2" :label="$t('期間內')"></el-option>
          </el-select>
          <el-input v-model="senddatas.receiptsNumberDetail" v-show="senddatas.receiptsNumber !== '0'" />
        </div>
      </el-form-item>
      <!-- <el-form-item :label="$t('紅利上限')" prop="bonusMax">
          <el-input v-model="senddatas.target" />
        </el-form-item> -->
      <!-- <el-form-item :label="$t('適用遊戲類型')" prop="target">
          <el-input v-model="senddatas.target" />
        </el-form-item> -->
      <el-form-item :label="$t('不可同時參與')" prop="cannotJoinsametime">
        <el-select v-model="senddatas.cannotJoinsametime" style="width: 100%" multiple>
          <!-- <el-option v-for="item in interval" :key="item.num" :label="$t(item.text)" :value="item.num" /> -->
          <!-- 0703 -->
          <el-option v-for="(v, k) in cannotJoinsametime" :key="k" :label="v.promotion" :value="v.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="bonusGetlimittime">
        <template #label>
          <span>{{ $t("紅利領取時限") }}</span>
          <el-popover placement="bottom" width="auto" trigger="hover">
            <ul class="formula" :class="{ isEn }">
              <li>
                <span>{{ $t("玩家滿足活動條件後，決定是否領取紅利的時限") }}</span>
              </li>
            </ul>
            <template #reference>
              <el-icon :size="31"><InfoFilled color="#ad8d60" style="margin-left: 3px" /></el-icon>
            </template>
          </el-popover>
        </template>
        <div style="display: flex">
          <el-select v-model="senddatas.bonusGetlimittime" :placeholder="$t('紅利領取時限')" style="width: 100%">
            <!-- <el-option v-for="item in interval" :key="item.num" :label="$t(item.text)" :value="item.num" /> -->
            <el-option :label="$t('天')" :value="0"></el-option>
            <el-option :label="$t('小時')" :value="1"></el-option>
          </el-select>
          <el-input v-model="senddatas.bonusGetlimittime_Detail" />
        </div>
      </el-form-item>

      <div class="btnGroup">
        <el-button type="danger" @click="closeModal">{{ $t("取消") }}</el-button>
        <el-button type="primary" @click="save(ruleFormRef)">{{ $t("確認") }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { toRefs, computed, ref, watch, reactive } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import useStore from '@/store/index'
import { getactivityListCantcontemporaryJoin, addactivityList } from '@/api/activity'

const { validatorStore } = useStore()
const emit = defineEmits(['update:addnewActModalStatus', 'updatePlayer'])
const props = defineProps({
  addnewActModalStatus: Boolean,
  totalData: Object
})
const { addnewActModalStatus } = toRefs(props)
watch(addnewActModalStatus, (v) => {
  if (v) {
    senddatas.value.conditionalMark1 = ['']
    senddatas.value.conditionalMark2 = ['']
    senddatas.value.bonus = ['']
    senddatas.value.withdrawalMultiple = ['']
    senddatas.value.receiptsNumber = '0'
    senddatas.value.eventType = '0'
    senddatas.value.bonusTarget = '0'
  }
})
const thisWidth = computed(() => '1300px')

// 日期
const dateData = ref({})
const getDate = (date) => {
  dateData.value = date
}
watch(dateData, () => {
  senddatas.value.start_time = dateData.value.time1
  senddatas.value.end_time = dateData.value.time2
})
//
const { required, customize } = validatorStore
const rules = reactive({
  title: [required()],
  order: [required()],
  // img: [required()],
  content: [required()],
  bonusTarget: [required()],
  conditionalMark1: [required()],
  receiptsNumber: [required()],
  bonusGetlimittime: [required()],
  eventType: [required()],
  start_time: [required()],
  type: [required(), customize('checkLength')]
})
const ruleFormRef = ref()
const senddatas = ref({
  conditionalMark1: [''],
  conditionalMark2: [''],
  bonus: [''],
  withdrawalMultiple: [''],
  receiptsNumber: '0',
  eventType: '0',
  bonusTarget: '0'
})
// const dateExist = computed(() => Object.keys(dateData.value).length)
//
watch(
  () => senddatas.value.start_time,
  async (v) => {
    searchList()
  }
)
//
const cannotJoinsametime = ref(null)
const searchList = async () => {
  senddatas.value.cannotJoinsametime = []
  cannotJoinsametime.value = null
  const { data } = await getactivityListCantcontemporaryJoin(senddatas.value.start_time, senddatas.value.end_time)
  console.log(data)
  cannotJoinsametime.value = data.data.data
  // 0703
}
//
const transformSenddatas = () => {
  const sdata = {
    claim_expire_type: Number(senddatas.value.bonusGetlimittime),
    claim_expire: Number(senddatas.value.bonusGetlimittime_Detail),
    bonus_type: Number(senddatas.value.bonusTarget),
    cant_at_same_time: senddatas.value.cannotJoinsametime,
    start_time: senddatas.value.start_time,
    end_time: senddatas.value.end_time,
    type: Number(senddatas.value.eventType),
    claim_frequency_type: Number(senddatas.value.receiptsNumber),
    claim_frequency: senddatas.value.receiptsNumberDetail === undefined ? '' : Number(senddatas.value.receiptsNumberDetail),
    promotion: senddatas.value.title,
    conditions: [
      // {
      //   lower:,
      //   upper:,
      //   bonus:,
      //   threshold_multiple:,
      // }
    ]
  }
  for (let i = 0; i < senddatas.value.conditionalMark1.length; i++) {
    sdata.conditions[i] = {
      lower: 0,
      upper: 0,
      bonus: 0,
      threshold_multiple: 0
    }
    sdata.conditions[i].lower = Number(senddatas.value.conditionalMark1[i])
    sdata.conditions[i].upper = Number(senddatas.value.conditionalMark2[i])
    sdata.conditions[i].bonus = Number(senddatas.value.bonus[i])
    sdata.conditions[i].threshold_multiple = Number(senddatas.value.withdrawalMultiple[i])
  }
  return sdata
}
//
const save = async (formEl) => {
  // addactivityList
  // senddatas
  if (formEl) {
    const valid = await formEl.validate((valid) => valid)
    if (!valid) return
  }
  console.log(senddatas.value)

  let notice = false
  for (let j = 0; j < conditionalMarkAlert.value.length; j++) {
    const el = conditionalMarkAlert.value[j]
    if (el) { notice = true }
  }
  if (notice) {
    return
  }
  // if (formEl) {
  //   return
  // }
  console.log(transformSenddatas())
  const { data } = await addactivityList(transformSenddatas())
  console.log(data)
  // 紅利領取時限  claim_expire_type
  // bonusGetlimittime: 1

  // 紅利領取時限 詳細  claim_expire
  // bonusGetlimittime_Detail: "5"

  // 紅利類型 bonus_type
  // bonusTarget: "1"

  // 不可同時參與 >>>  cant_at_same_time:[0,1]
  // cannotJoinsametime: 9

  // 條件面額1
  // conditionalMark1: (2) ['1', '2']
  // 條件面額2
  // conditionalMark2: (2) ['123', '234']
  // 紅利
  // bonus: (2) ['456', '56']
  // 提款流水倍數
  // withdrawalMultiple: (2) ['7', '8']

  // 活動時間 start_time/end_time
  // start_time: "2023-06-30T16:00:00.000Z"
  // end_time: "2023-07-28T15:59:59.000Z"

  // 活動類型 type
  // eventType: "1"

  // 領取次數 claim_frequency_type/claim_frequency
  // receiptsNumber: "1"
  // receiptsNumberDetail: "123"

  // 活動標題 promotion
  // title: "123"
}

// modal 開關
// 管理員列表 modal
const closeModal = () => {
  emit('update:addnewActModalStatus', false)
}
//
const addnewRow = () => {
  senddatas.value.conditionalMark1.push('')
  senddatas.value.conditionalMark2.push('')
  senddatas.value.bonus.push('')
  senddatas.value.withdrawalMultiple.push('')
}
const minusRow = (k) => {
  senddatas.value.conditionalMark1.splice(k, 1)
  senddatas.value.conditionalMark2.splice(k, 1)
  senddatas.value.bonus.splice(k, 1)
  senddatas.value.withdrawalMultiple.splice(k, 1)
}
//
// 輸入規則
watch(
  () => senddatas.value.title,
  (after, before) => {
    if (after === '') {
      return
    }
    if (!/^[\u4E00-\u9FFFa-zA-Z0-9\s\p{P}]{1,100}$/.test(after)) {
      senddatas.value.title = before
    }
  }
)
const conditionalMarkAlert = ref([false])
watch(
  () => senddatas.value.conditionalMark1,
  (after, before) => {
    console.log(after)
    for (let i = 0; i < after.length; i++) {
      const beforeVal = senddatas.value.conditionalMark2[i]
      const thisVal = after[i]
      if (Number(beforeVal) <= Number(thisVal)) {
        conditionalMarkAlert.value[i] = true
      } else {
        conditionalMarkAlert.value[i] = false
      }
    }
  }, { deep: true }
)
watch(
  () => senddatas.value.conditionalMark2,
  (after, before) => {
    console.log(after)
    for (let i = 0; i < after.length; i++) {
      const beforeVal = senddatas.value.conditionalMark1[i]
      const thisVal = after[i]
      if (Number(beforeVal) >= Number(thisVal)) {
        conditionalMarkAlert.value[i] = true
      } else {
        conditionalMarkAlert.value[i] = false
      }
    }
  }, { deep: true }
)
watch(
  () => senddatas.value.bonus,
  (after, before) => {
    if (after === '') {
      return
    }
    if (!/^\d{1,6}$/.test(after)) {
      senddatas.value.bonus = before
    }
  }
)
watch(
  () => senddatas.value.receiptsNumberDetail,
  (after, before) => {
    if (after === '') {
      return
    }
    if (!/^\d{1,6}$/.test(after)) {
      senddatas.value.receiptsNumberDetail = before
    }
  }
)
watch(
  () => senddatas.value.withdrawalMultiple,
  (after, before) => {
    if (after === '') {
      return
    }
    if (!/^\d{1,3}$/.test(after)) {
      senddatas.value.withdrawalMultiple = before
    }
  }
)

//
//

// watch(senddatas.value, (v) => {
//   console.log(v)
// //
// })
</script>

<style lang="scss" scoped>
:deep .el-form-item {
  //   margin-bottom: 5px !important;
}
:deep .datePicker {
  margin-bottom: 0 !important;
}
:deep .el-input__wrapper {
  box-sizing: content-box;
}
:deep .el-input__inner {
  text-align: left !important;
}
:deep .el-form-item__label {
  font-size: 18px !important;
}
.time {
  opacity: 0;
  position: absolute;
  z-index: -1;
  top: 0;
}
.btn_blue {
  width: 43px;
  height: 43px;
  border-radius: 50%;
  background-color: rgb(72, 72, 255);
  color: white;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.btn_red {
  width: 43px;
  height: 43px;
  border-radius: 50%;
  background-color: red;
  color: white;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
