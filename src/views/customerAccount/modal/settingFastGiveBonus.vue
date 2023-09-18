<template>
  <el-dialog :model-value="settingBonusModal" :width="700" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <div class="info">
        <h2>{{ $t('設定快派') }}</h2>
        <!-- <p>{{ $t('總計') }}: <span v-money="totalDividend"></span></p> -->
      </div>
    </template>
    <div class="searchGroup" style="flex-direction: column">
      <table style="width: 100%">
        <tr>
          <td width="10%"></td>
          <td width="20%"></td>
          <td width="20%"></td>
          <td width="10%"></td>
          <td width="20%"></td>
          <td width="20%"></td>
        </tr>
        <tr>
          <td>{{ $t('快派群組') }}:</td>
          <td colspan="3">
            <el-select style="width: 95%" v-model="senddata" :value-key="'group_name'" :reserve-keyword="true">
              <div class="addgroup">
                <el-input style="width: 95%" v-model="newGroupName"></el-input>
                <el-button @click="addnewGroup"> + </el-button>
              </div>
              <!-- <el-option :label="$t('所有等級')" value="all" /> -->
              <el-option :label="v.group_name" :value="v" v-for="(v, k) in optionList" :key="k" :disabled="v.group_name == $t('無資料')" />
            </el-select>
          </td>
          <td colspan="1">
            <el-button :type="senddata.group_name ? 'primary' : 'warning'" @click="deleteGroup">
              {{ $t('刪除') }}
              <!-- {{senddata}} -->
            </el-button>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>{{ $t('派發紅利') }}</td>
          <td colspan="2">
            <el-input v-model="fastBonus" :type="Number" style="width: 100%" />
          </td>
          <!-- <td></td> -->
          <td>{{ $t('提款門檻') }}</td>
          <td colspan="2">
            <el-select style="width: 95%" v-model="thresholdType">
              <!-- <el-option :label="$t('所有等級')" value="all" /> -->
              <el-option :label="$t('增加分數')" value="0" />
              <el-option :label="$t('增加倍數')" value="1" />
            </el-select>
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td colspan="2">
            <el-input v-if="threshold_type != ''" v-model="threshold" />
          </td>
        </tr>
        <tr>
          <td>{{ $t('備註') }}</td>
          <td colspan="5">
            <!-- v-model="" -->
            <!-- :disabled="check" -->
            <el-input v-model="memo" type="textarea" :rows="4" maxlength="20" :placeholder="$t('可輸入備註上限20字')" />
          </td>
        </tr>
      </table>
      <div class="save">
        <!-- <el-button>{{ $t('確認') }}</el-button> -->
        <el-button :type="checkInfo() ? 'primary' : 'warning'" @click="sendDataEditGroup">{{ $t('確認') }}</el-button>
        <!-- @click="checkInfo(true)" :type="checkInfo(false) ? 'primary' : 'warning'" -->
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, toRefs, watch, computed } from 'vue-demi'
import { useI18n } from 'vue-i18n'
import useStore from '@/store/index'
// import { refreshgroup } from '@/store/fastgivenbonus.js'
import { addnewFastBonusgroup, delFastBonusgroup, editFastBonusgroup } from '@/api/fastBonus'
import { storeToRefs } from 'pinia'
const { fastgivenbonus, validatorStore } = useStore()
const { checkWordInrule } = validatorStore
const { setthisFastBonus } = fastgivenbonus
const { thisFastBonus } = storeToRefs(fastgivenbonus)
const { t } = useI18n()
const senddata = ref({})
const newGroupName = ref()
const fastBonus = ref()
const thresholdType = ref()
const threshold = ref()
const memo = ref()
watch(senddata, (v) => {
  // 0523
  console.log('ZZZZZZZZZZZZZZZZZZ')
  console.log(v)
  fastBonus.value = v.bonus / 10000
  thresholdType.value = String(v.threshold_type)
  if (thresholdType.value === '0') {
    threshold.value = v.threshold / 10000
  } else {
    threshold.value = v.threshold
  }

  memo.value = v.memo
})
watch(fastBonus, (a, b) => {
  if (Number(a) / 1 !== Number(a)) {
    fastBonus.value = b
  }
})
watch(threshold, (a, b) => {
  // const pattern = /^\d+(\.\d+)?$/
  if (a !== '') {
    // 含有小數的數字
    // if (!pattern.test(a)) {
    //   threshold.value = b
    // }
    if (!checkWordInrule('num_decimals', a)) {
      threshold.value = b
    }
  }
})
const props = defineProps({
  settingBonusModal: Boolean,
  fastbonusGroup: Array,
  agentID: String
})
watch(
  () => props.settingBonusModal,
  (v) => {
    if (v) {
      console.log(v)
      senddata.value = thisFastBonus.value
    }
  }
)
const optionList = computed(() => {
  if (props.fastbonusGroup == null) {
    return [{ group_name: t('無資料') }]
  } else {
    return props.fastbonusGroup
  }
  // fastbonusGroup
})
const emit = defineEmits(['update:settingBonusModal'], 'refreshAllgroup')
const deleteGroup = async () => {
  if (!senddata.value.group_name) return
  const { data } = await delFastBonusgroup(senddata.value.group_name)
  // senddata.group
  if (data.code === 200) {
    // 1.資料全翻新
    // senddata.value = {
    //   remark: '',
    //   group: '',
    //   bonus: '',
    //   threshold: '',
    //   thresholdDetail: ''
    // }
    // 0526
    newGroupName.value = ''
    thresholdType.value = 0
    threshold.value = ''
    memo.value = ''
    fastBonus.value = ''
    senddata.value = {}
    // 成功刪除群組後，
    // 2.重新搜尋group
    emit('refreshAllgroup')
    console.log(789)
  }
}
watch(
  () => senddata.group,
  (v) => {
    console.log(v)
  }
)
const { settingBonusModal } = toRefs(props)
// const fastBonus = computed(() => props.fastbonusGroup[senddata.value.group].bonus)
// modal 開關
const closeModal = () => {
  emit('update:settingBonusModal', false)
}
//
const checkInfo = () => {
  // console.log(senddata.value.group_name)
  // console.log(fastBonus.value)
  if (senddata.value.group_name && fastBonus.value !== '' && thresholdType.value !== '' && threshold.value !== '') return true
  else {
    return false
  }
}
const sendDataEditGroup = async () => {
  if (!checkInfo()) {
    return false
  }
  // 0523
  const sdata = {
    group_name: senddata.value.group_name,
    bonus: Number(fastBonus.value) * 10000,
    threshold_type: Number(thresholdType.value),
    threshold: Number(thresholdType.value) === 0 ? Number(threshold.value) * 10000 : Number(threshold.value),
    memo: memo.value,
    agent: props.agentID
  }

  await setthisFastBonus(sdata) // 原本是把儲存全組放在 fastgivenBonus才另外開一隻PINIA紀錄
  // sdata.bonus = sdata.bonus / 10000
  // sdata.threshold = sdata.threshold / 10000
  const sdata2 = {
    group_name: senddata.value.group_name,
    bonus: Number(fastBonus.value),
    threshold_type: Number(thresholdType.value),
    threshold: Number(threshold.value),
    memo: memo.value,
    agent: props.agentID
  }

  await editFastBonusgroup(sdata2) // 先儲存此次修改

  senddata.value = {}
  closeModal() // 關閉視窗
}

const addnewGroup = async () => {
  // var senddata = {}
  const sdata = { group_name: newGroupName.value, agent: props.agentID }
  await addnewFastBonusgroup(sdata)
  // console.log(data)
  // import { refreshgroup } from '@/store/fastgivenbonus.js'
  newGroupName.value = ''
  emit('refreshAllgroup')
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 240px;
}

.info {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $info;
  // padding-bottom: 10px;
  margin-bottom: 10px;
  p {
    font-size: 16px;
    margin-left: 0.5rem;
  }
}

.list {
  width: 100%;
  color: black;
  span,
  p {
    font-size: 16px;
  }
  .account {
    display: flex;
    align-items: center;
    p {
      margin-left: 20px;
    }
  }
  .flex_verticalCenter {
    display: flex;
    align-items: center;
  }
  .vip {
    img {
      width: 30px;
      margin-right: 0.5rem;
      object-fit: contain;
    }
    p {
      font-weight: 600;
      font-size: 14px;
      color: red;
      margin: 0;
      display: inline-block;
    }
  }
}

.noData {
  text-align: center;
  margin-top: 30px;
}
td {
  padding: 5px 0;
}
.addgroup {
  width: 100%;
  padding: 0 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
