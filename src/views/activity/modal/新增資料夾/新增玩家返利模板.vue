<template>
  <el-dialog :model-value="addnewActModalStatus" :width="thisWidth" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <h2>{{ $t("新增玩家返利") }}</h2>
    </template>
    <el-form ref="ruleFormRef" :model="senddatas" :rules="rules" label-width="170px" label-position="left">
      <h2>
        <el-form-item prop="title">
          <template #label>
            <span>{{ $t("返利標題") }}</span>
          </template>
          <el-input v-model="senddatas.title" />
        </el-form-item>
        <div class="d-flex">
          <el-form-item :label="$t('返利時間')" prop="start_time">
            <DateChoose @getDate="getDate" ref="dateChoose" :choose="false"/>
            <!-- :choose="false" -->
            <el-input v-model="senddatas.start_time" class="time" />
          </el-form-item>
          <div class="w-10"></div>
        </div>
        <div class="d-flex">
          <el-form-item prop="target_type" label-width="150px">
            <template #label>
              <span>{{ $t("參與對象") }}</span>
            </template>
            <el-select v-model="senddatas.target_type">
              <el-option value="0" :label="$t('全部玩家')"></el-option>
              <el-option value="1" :label="$t('指定代理帳號')"></el-option>
              <el-option value="2" :label="$t('指定玩家帳號')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="target" label-width="0">
              <el-input v-model="senddatas.target" v-if="senddatas.target_type !== '0'" />
            </el-form-item>
        </div>
        <!-- claim_conditions -->
        <el-form-item prop="claim_conditionsType" label-width="100px">
          <template #label>
            <span>{{ $t("領取條件") }}</span>
          </template>
          <el-checkbox v-model="senddatas.claim_conditionsType[0]" :label="$t('累積存款')"></el-checkbox>
          <el-checkbox v-model="senddatas.claim_conditionsType[1]" :label="$t('單筆存款')"></el-checkbox>
          <el-checkbox v-model="senddatas.claim_conditionsType[2]" :label="$t('累積投注')"></el-checkbox>
          <el-checkbox v-model="senddatas.claim_conditionsType[3]" :label="$t('VIP等級')"></el-checkbox>
          <el-checkbox v-model="senddatas.claim_conditionsType[4]" :label="$t('註冊天數')"></el-checkbox>
        </el-form-item>
        <div class="d-flex">
          <el-form-item prop="condition_threshold" label-width="130px" v-if="senddatas.claim_conditionsType[0]" >
            <template #label>
            <span>{{ $t("累積存款超過") }}:</span>
          </template>
            <el-input v-model="senddatas.condition_threshold[0]" type="Number"/>
          </el-form-item>
          <el-form-item prop="condition_threshold" label-width="130px" v-if="senddatas.claim_conditionsType[1]" >
            <template #label>
            <span>{{ $t("單筆存款超過") }}:</span>
          </template>
            <el-input v-model="senddatas.condition_threshold[1]" type="Number"/>
          </el-form-item>
          <el-form-item prop="condition_threshold" label-width="130px" v-if="senddatas.claim_conditionsType[2]" >
            <template #label>
            <span>{{ $t("累積投注超過") }}:</span>
          </template>
            <el-input v-model="senddatas.condition_threshold[2]" type="Number"/>
          </el-form-item>
        </div>
        <div class="d-flex">
          <el-form-item prop="condition_threshold" label-width="130px" v-if="senddatas.claim_conditionsType[3]" >
            <template #label>
            <span>{{ $t("VIP等級達到") }}:</span>
          </template>
            <el-input v-model="senddatas.condition_threshold[3]" type="Number"/>
          </el-form-item>
          <el-form-item prop="condition_threshold" label-width="130px" v-if="senddatas.claim_conditionsType[4]" >
            <template #label>
            <span>{{ $t("註冊天數達到") }}:</span>
          </template>
            <el-input v-model="senddatas.condition_threshold[4]" type="Number"/>
          </el-form-item>
        </div>
      </h2>
      <h2>
        <div class="h-10"></div>
        <div class="d-flex">
          <el-form-item prop="type" width="">
            <template #label>
              <span>{{ $t("返利類型") }}</span>
            </template>
            <el-select v-model="senddatas.type" style="width: 100%">
              <!-- <el-option v-for="item in interval" :key="item.num" :label="$t(item.text)" :value="item.num" /> -->
              <el-option value="0" :label="$t('單筆存款')"></el-option>
              <el-option value="1" :label="$t('累積存款')"></el-option>
              <el-option value="2" :label="$t('有效投注')"></el-option>
              <el-option value="3" :label="$t('特殊活動')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="nominal_valueMIN" label-width="100px">
            <template #label>
              <span>{{ $t("存款面額") }}</span>
            </template>
            <div style="position: relative">
              <div style="display: flex; align-items: center; justify-content: space-around">
                <el-input v-model="senddatas.nominal_valueMIN" />
              </div>
              <span style="position: absolute; font-size: 12px; color: red; left: 0; bottom: -23px" v-if="conditionalMarkAlert[k]">{{
                $t("最小面額必須小於最大面額")
              }}</span>
            </div>
          </el-form-item>

          <el-form-item label="~" prop="nominal_valueMAX" label-width="5px">
            <el-input v-model="senddatas.nominal_valueMAX" />
          </el-form-item>
        </div>
        <el-form-item prop="bonus_type">
          <template #label>
            <span>{{ $t("紅利類型") }}</span>
          </template>
          <el-select v-model="senddatas.bonus_type" style="width: 50%">
            <el-option value="0" :label="$t('固定數值')" disabled></el-option>
            <el-option value="1" :label="$t('百分比')"></el-option>
          </el-select>
        </el-form-item>
        <!--  -->
        <el-form-item prop="playerRebateLV">
          <template #label>
            <span>{{ $t("玩家返利層級") }}</span>
          </template>
          <el-select v-model="senddatas.playerRebateLV" style="width: 50%">
            <el-option value="1" :label="$t('一級')"></el-option>
            <el-option value="2" :label="$t('二級')"></el-option>
            <el-option value="3" :label="$t('三級')"></el-option>
            <el-option value="4" :label="$t('四級')"></el-option>
            <el-option value="5" :label="$t('五級')"></el-option>
          </el-select>
        </el-form-item>
        <div class="flex-column ml-15">
          <div class="d-flex" v-for="(v, k) in Object.keys(senddatas.level_setting).length" :key="k">
            <el-form-item prop="level_setting">
              <template #label>
                <span>{{ $t(transfromPlayerRebateLVWORD(v)) }}</span>
              </template>
              <el-input v-model="v.bonus_arg" />
            </el-form-item>
            <el-form-item prop="level_setting" label-width="140px">
              <template #label>
                <span>{{ $t("提款流水倍數") }}</span>
              </template>
              <el-input v-model="v.withdraw_flow_multiple" />
            </el-form-item>
            <el-form-item prop="level_setting" label-width="100px">
              <template #label>
                <span>{{ $t("紅利上限") }}</span>
              </template>
              <el-input v-model="v.bonus_limit" />
            </el-form-item>
          </div>
        </div>
        <!--  -->
        <div class="d-flex">
          <el-form-item prop="claim_frequency_type">
            <template #label>
              <span>{{ $t("可領取次數") }}</span>
            </template>
            <el-select v-model="senddatas.claim_frequency_type" style="width: 250px">
              <el-option value="0" :label="$t('不限次數')"></el-option>
              <el-option value="1" :label="$t('每日 (0:00重置(GMT-4))')"></el-option>
              <el-option value="2" :label="$t('期間內')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="claim_frequency" label-width="0">
            <el-input v-model="senddatas.claim_frequency" v-if="senddatas.claim_frequency_type !== '1'" />
          </el-form-item>
        </div>
      </h2>
      <div class="h-10"></div>
      <el-form-item prop="claim_expire_type">
        <template #label>
          <span>{{ $t("紅利領取時限") }}</span>
        </template>
        <div style="display: flex">
          <el-select v-model="senddatas.claim_expire_type" style="width: 100%">
            <!-- <el-option v-for="item in interval" :key="item.num" :label="$t(item.text)" :value="item.num" /> -->
            <el-option :label="$t('天')" value="0"></el-option>
            <el-option :label="$t('小時')" value="1"></el-option>
          </el-select>
          <el-input v-model="senddatas.claim_expire" />
        </div>
      </el-form-item>
      <el-form-item prop="gameCondition" label-width="150px">
        <template #label>
          <span>{{ $t("適用遊戲類型") }}</span>
        </template>
        <el-checkbox v-model="senddatas.gameCondition[0]" :label="$t('全部遊戲')"></el-checkbox>
        <el-checkbox v-model="senddatas.gameCondition[1]" :label="$t('電子')"></el-checkbox>
        <el-checkbox v-model="senddatas.gameCondition[2]" :label="$t('捕魚')"></el-checkbox>
        <el-checkbox v-model="senddatas.gameCondition[3]" :label="$t('撲克')"></el-checkbox>
        <el-checkbox v-model="senddatas.gameCondition[4]" :label="$t('哈希')"></el-checkbox>
        <el-checkbox v-model="senddatas.gameCondition[5]" :label="$t('桌遊')"></el-checkbox>
        <el-checkbox v-model="senddatas.gameCondition[6]" :label="$t('賓果')"></el-checkbox>
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
import { addactivityList } from '@/api/activity'

const { validatorStore } = useStore()
const emit = defineEmits(['update:addnewActModalStatus'])
const props = defineProps({
  addnewActModalStatus: Boolean,
  totalData: Object
})
const { addnewActModalStatus } = toRefs(props)
watch(addnewActModalStatus, (v) => {

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
const { required } = validatorStore // customize
const rules = reactive({
  title: [required()],
  start_time: [required()],
  target_type: [required()],
  eventType: [required()],
  type: [required()],
  // , customize('checkLength')
  bonus_type: [required()],
  playerRebateLV: [required()],
  claim_frequency_type: [required()],
  claim_expire_type: [required()],
  level_setting: [required()]
})
const ruleFormRef = ref()
const senddatas = ref({
  title: '',
  start_time: null,
  end_time: null,
  target_type: '0',
  target: '',
  claim_conditionsType: [false, false, false, false, false], // 領取條件
  condition_threshold: [null, null, null, null, null],
  type: '0',
  nominal_valueMIN: null,
  nominal_valueMAX: null,
  bonus_type: '1',
  playerRebateLV: '1',
  level_setting: {
    1: {
      level: 1,
      bonus_arg: 0,
      withdraw_flow_multiple: 0,
      bonus_limit: 0
    }
  },
  claim_frequency_type: '0',
  claim_frequency: 0,
  claim_expire_type: '0',
  claim_expire: null,
  gameCondition: [false, false, false, false, false, false, false]
})
//
//
const transformTosenddatas = () => {
  const sdata = {

  }
  return sdata
}
//
const save = async (formEl) => {
  if (formEl) {
    const valid = await formEl.validate((valid) => valid)
    if (!valid) return
  }
  console.log(senddatas.value)
  if (formEl) {
    return
  }
  let notice = false
  for (let j = 0; j < conditionalMarkAlert.value.length; j++) {
    const el = conditionalMarkAlert.value[j]
    if (el) {
      notice = true
    }
  }
  if (notice) {
    return
  }
  // if (formEl) {
  //   return
  // }
  console.log(transformTosenddatas())
  const { data } = await addactivityList(transformTosenddatas())
  console.log(data)
}

// modal 開關
// 管理員列表 modal
const closeModal = () => {
  emit('update:addnewActModalStatus', false)
}
//
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
//
//
const conditionalMarkAlert = ref(false)
watch(
  () => senddatas.value.nominal_valueMIN,
  (after, before) => {
    const beforeVal = senddatas.value.nominal_valueMAX
    const thisVal = after
    if (Number(beforeVal) <= Number(thisVal)) {
      conditionalMarkAlert.value = true
    } else {
      conditionalMarkAlert.value = false
    }
  },
  { deep: true }
)
watch(
  () => senddatas.value.nominal_valueMAX,
  (after, before) => {
    const beforeVal = senddatas.value.nominal_valueMIN
    const thisVal = after
    if (Number(beforeVal) >= Number(thisVal)) {
      conditionalMarkAlert.value = true
    } else {
      conditionalMarkAlert.value = false
    }
  },
  { deep: true }
)
//
// 玩家返利層級一變動，會增加/刪除 列表
const tmpplayerRebateLV = (k) => {
  return {
    level: Number(k),
    bonus_arg: 0, // N 級返利紅利
    withdraw_flow_multiple: 0, // 提款流水倍數
    bonus_limit: 0 // 紅利上限
  }
}
watch(
  () => senddatas.value.playerRebateLV,
  (after, before) => {
    senddatas.value.level_setting = {}

    for (let i = 0; i < Number(after); i++) {
      senddatas.value.level_setting[i] = tmpplayerRebateLV(i)
    }
  }
)
// 適用遊戲類型，勾選全部，其他都會打勾
const tmpStatus = ref(false)
watch(
  () => senddatas.value.gameCondition[0],
  (v) => {
    if (v) {
      for (let i = 0; i < senddatas.value.gameCondition.length; i++) {
        senddatas.value.gameCondition[i] = true
      }
      tmpStatus.value = false
    } else {
      if (!tmpStatus.value) {
        for (let i = 0; i < senddatas.value.gameCondition.length; i++) {
          senddatas.value.gameCondition[i] = false
        }
      } else {
        tmpStatus.value = false
      }
    }
  }
)
//
watch(
  senddatas.value.gameCondition,
  (v) => {
    // console.log(v)
    for (let i = 1; i < v.length; i++) {
      const el = v[i]
      if (!el) {
        tmpStatus.value = true
        senddatas.value.gameCondition[0] = false
      }
    }
  }
)
//
const transfromPlayerRebateLVWORD = (k) => {
  let lv = '一'
  switch (k) {
    case 0:
      lv = '一'
      break
    case 1:
      lv = '一'
      break
    case 2:
      lv = '二'
      break
    case 3:
      lv = '三'
      break
    case 4:
      lv = '四'
      break
    case 5:
      lv = '五'
      break
  }
  return lv + '級返利紅利'
}
// watch(senddatas.value, (v) => {
//   console.log(v)
// //
// })
</script>

<style lang="scss" scoped>
:deep .el-form-item {
  // margin-bottom: 5px !important;
}
:deep .datePicker {
  // margin-bottom: 0 !important;
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
.d-flex {
  display: flex;
}
.flex-column{
  display: flex;
  flex-direction:column;
}
.ml-15{
  margin-left: 15px;
}
.w-10 {
  width: 10px;
}
.h-10 {
  height: 10px;
}
</style>
