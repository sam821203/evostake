<template>
  <div class="treeModal">
    <el-dialog :model-value="treeModal" :width="modalWidth" :show-close="false" @close="closeModal(ruleFormRef)" :destroy-on-close="true">
      <template #header>
        <h2>{{ modalStatus === "add" ? $t("創建") : $t("編輯") }}{{ modalStatus === "add" ? $t(childName) : $t(fatherName) }}</h2>
      </template>
      <el-form ref="ruleFormRef" :model="user" :rules="rules" label-width="150px" label-position="top">
        <div class="row line">
          <!-- 代理、管理員資訊 -->
          <el-form-item :label="$t('上級代理帳號')">
            <el-input :value="targetTree.level !== 0 ? targetTree.father_name : $t('開發商(無上級)')" disabled />
          </el-form-item>
          <el-form-item :label="$t('代理階級')">
            <el-input :value="$t(fatherName)" disabled />
          </el-form-item>
          <el-form-item v-if="modalStatus === 'edit'" :label="$t('代理帳號')">
            <el-input v-model="user.name" disabled />
          </el-form-item>
          <el-form-item :label="$t('代理暱稱')" prop="nickname">
            <el-input v-model="user.nickname" />
          </el-form-item>
          <template v-if="modalStatus === 'add'">
            <el-form-item :label="$t('下級代理帳號')" prop="admin_account">
              <el-input v-model="user.admin_account" autocomplete="new-password" />
            </el-form-item>
            <el-form-item :label="$t('下級代理密碼')" prop="admin_password">
              <el-input v-model="user.admin_password" show-password autocomplete="new-password" />
            </el-form-item>
            <el-form-item :label="$t('確認二次密碼')" show-password prop="checkpwd" :key="resetCheckpwd">
              <el-input v-model="user.checkpwd" show-password />
            </el-form-item>
          </template>

          <el-form-item :label="$t('代理規格')" prop="lobby_style" v-if="lobbystyleStatus()">
              <el-select v-model="user.lobby_style">
                <el-option v-for="(v,k) in lobbyStyle" :key="k" :label="$t(v)" :value="v" />
              </el-select>
            </el-form-item>
        </div>
        <!-- 分潤、返水 -->
        <div v-if="targetTree.level > 0" class="row line">
          <div>
            <p>{{ $t("鏈遊分潤") }}%</p>
            <div class="value">
              <el-form-item :label="$t(modalStatus === 'add' ? fatherName : grandfatherName)">
                <el-input :value="user.temp_hash_percent" disabled />
              </el-form-item>
              <el-form-item :label="$t(modalStatus === 'add' ? childName : fatherName)">
                <el-input v-model="user.hash_percent" :disabled="disabledInput(user.disable_hash_percent)" />
              </el-form-item>
            </div>
          </div>
          <div>
            <p>{{ $t("鏈遊返水") }}‰</p>
            <div class="value">
              <el-form-item :label="$t(modalStatus === 'add' ? fatherName : grandfatherName)">
                <el-input :value="user.temp_hash_return_percent" disabled />
              </el-form-item>
              <el-form-item :label="$t(modalStatus === 'add' ? childName : fatherName)">
                <el-input v-model="user.hash_return_percent" :disabled="disabledInput(user.disable_hash_return_percent)" />
              </el-form-item>
            </div>
          </div>
          <div>
            <p>{{ $t("棋牌佔成") }}%</p>
            <div class="value">
              <el-form-item :label="$t(modalStatus === 'add' ? fatherName : grandfatherName)">
                <el-input :value="user.temp_goldenwind_pk_percent" disabled />
              </el-form-item>
              <el-form-item :label="$t(modalStatus === 'add' ? childName : fatherName)">
                <el-input v-model="user.goldenwind_pk_percent" :disabled="disabledInput(user.disable_goldenwind_pk_percent)" />
              </el-form-item>
            </div>
          </div>
          <div></div>
          <!-- <div>
            <p>{{ $t('體育分潤') }}%</p>
            <div class="value">
              <el-form-item :label="$t(modalStatus === 'add' ? fatherName : grandfatherName)">
                <el-input :value="user.temp_sport_percent" disabled />
              </el-form-item>
              <el-form-item :label="$t(modalStatus === 'add' ? childName : fatherName)">
                <el-input v-model="user.sport_percent" :disabled="disabledInput(user.disable_sport_percent)" />
              </el-form-item>
            </div>
          </div>
          <div>
            <p>{{ $t('體育返水') }}‰</p>
            <div class="value">
              <el-form-item :label="$t(modalStatus === 'add' ? fatherName : grandfatherName)">
                <el-input :value="user.temp_sport_return_percent" disabled />
              </el-form-item>
              <el-form-item :label="$t(modalStatus === 'add' ? childName : fatherName)">
                <el-input v-model="user.sport_return_percent" :disabled="disabledInput(user.disable_sport_return_percent)" />
              </el-form-item>
            </div>
          </div> -->
          <div :class="{ line: !isMobile }">
            <p>{{ $t("電子遊戲分潤") }}%</p>
            <div class="value">
              <el-form-item :label="$t(modalStatus === 'add' ? fatherName : grandfatherName)">
                <el-input :value="user.temp_ele_percent" disabled />
              </el-form-item>
              <el-form-item :label="$t(modalStatus === 'add' ? childName : fatherName)">
                <el-input v-model="user.ele_percent" :disabled="disabledInput(user.disable_ele_percent)" />
              </el-form-item>
            </div>
          </div>
          <div class="line">
            <p>{{ $t("電子遊戲返水") }}‰</p>
            <div class="value">
              <el-form-item :label="$t(modalStatus === 'add' ? fatherName : grandfatherName)">
                <el-input :value="user.temp_ele_return_percent" disabled />
              </el-form-item>
              <el-form-item :label="$t(modalStatus === 'add' ? childName : fatherName)">
                <el-input v-model="user.ele_return_percent" :disabled="disabledInput(user.disable_ele_return_percent)" />
              </el-form-item>
            </div>
          </div>
        </div>
        <!-- 開關鍵(返水、凍結(解凍)代理) -->
        <template v-if="modalStatus === 'edit'">
          <div class="row line">
            <template v-if="targetTree.level === 1 && !groupData.level">
              <div class="switch">
                <p>{{ $t("鏈遊返水") }}{{ user.can_return_game?.hash ? $t("開") : $t("關") }}</p>
                <el-switch
                  size="large"
                  v-model="user.can_return_game.hash"
                  :active-value="true"
                  :inactive-value="false"
                  :disabled="isFreeze"
                />
              </div>
              <!-- <div class="switch">
                <p>{{ $t('體育返水') }}{{ user.can_return_game?.sport ? $t('開') : $t('關') }}</p>
                <el-switch
                  size="large"
                  v-model="user.can_return_game.sport"
                  :active-value="true"
                  :inactive-value="false"
                  :disabled="isFreeze"
                />
              </div> -->
              <div class="switch">
                <p>{{ $t("電子遊戲返水") }}{{ user.can_return_game?.ele ? $t("開") : $t("關") }}</p>
                <el-switch
                  size="large"
                  v-model="user.can_return_game.ele"
                  :active-value="true"
                  :inactive-value="false"
                  :disabled="isFreeze"
                />
              </div>
            </template>
            <div class="switch" v-if="modalStatus === 'edit'">
              <p>{{ $t(`${user.status === "Enable" ? "凍結" : "解凍"}代理`) }}</p>
              <el-switch size="large" v-model="user.status" active-value="Freeze" inactive-value="Enable" :disabled="isFreeze" />
              <p class="freezeText" v-show="isFreeze">(需由{{ grandfatherName }}{{ $t("操作解凍") }})</p>
            </div>
          </div>
        </template>
        <el-form-item :label="$t('備註')" class="memo">
          <el-input v-model="user.info" type="textarea" :rows="8" maxlength="100" />
        </el-form-item>
        <div class="btnGroup">
          <el-button type="danger" @click="closeModal(ruleFormRef)">{{ $t("取消") }}</el-button>
          <el-button type="primary" @click="save(ruleFormRef)">{{ $t("確認") }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, toRefs, inject, computed, watch } from 'vue-demi'
import useStore from '@/store/index'
import { addTreeApi, editTreePercentApi, editTreeInfoApi, handleTreeFreezeApi, handleTreeUnFreezeApi } from '@/api/tree'
import { useI18n } from 'vue-i18n'

const { treeStore, validatorStore, msgStore } = useStore()
const { openMsg } = msgStore

const { t } = useI18n()

const ruleFormRef = ref()
const user = ref({})
let targetGroup

const emit = defineEmits(['update:treeModal', 'updateOrder'])
const props = defineProps({
  treeModal: Boolean,
  modalStatus: String
})
const { treeModal, modalStatus } = toRefs(props)

// 階級資料
const { targetTree, groupData, lobbyStyle } = storeToRefs(treeStore)
const grandfatherName = computed(() => treeStore.levelText(targetTree.value.level - 1))
const fatherName = computed(() => treeStore.levelText(targetTree.value.level))
const childName = computed(() => treeStore.levelText(targetTree.value.level + 1))

// 非開發商 disabled 分潤和返水
const disabledInput = (status) => groupData.value.level > 0 && modalStatus.value === 'edit' && status

// 是否為凍結
const isFreeze = computed(() => targetTree.value.level - groupData.value.level !== 1 && targetTree.value.status === 'Freeze')

// 創建、編輯
let id
const save = async (formEl) => {
  console.log(user.value)
  const valid = await formEl.validate((valid) => valid)
  if (!valid) return

  // 創建階級
  user.value.uppergroup_name = targetTree.value.name
  user.value.is_store = targetTree.value.name === 'root'
  if (modalStatus.value === 'add') {
    const { data } = await addTreeApi(user.value)
    if (data.code !== 200) return
    id = data.data.agent.agent_id
  } else if (modalStatus.value === 'edit') {
    id = targetTree.value.agent_id
  }

  // 驗證分潤和返水的下級
  console.log(targetGroup.range.profit)
  if (modalStatus.value === 'edit') {
    if (user.value.hash_percent * 1000 < targetGroup.range.profit.hash[1]) {
      openMsg({ content: '分潤不可小於其它下級的分潤' })
      return
    }
    if (targetGroup.range.profit.sport) {
      if (user.value.sport_percent * 1000 < targetGroup.range.profit.sport[1]) {
        openMsg({ content: '體育分潤不可小於其它下級的分潤' })
        return
      }
      if (user.value.sport_return_percent * 100 < targetGroup.range.rebate.sport[1]) {
        openMsg({ content: '體育返水不可小於其它下級的返水' })
        return
      }
    }

    if (user.value.ele_percent * 1000 < targetGroup.range.profit.ele[1]) {
      openMsg({ content: '電子分潤不可小於其它下級的分潤' })
      return
    }
    if (user.value.hash_return_percent * 100 < targetGroup.range.rebate.hash[1]) {
      openMsg({ content: '返水不可小於其它下級的返水' })
      return
    }

    if (user.value.ele_return_percent * 100 < targetGroup.range.rebate.ele[1]) {
      openMsg({ content: '電子返水不可小於其它下級的返水' })
      return
    }
    if (user.value.goldenwind_pk_percent * 1000 < targetGroup.range.profit.goldenwind_pk[1]) {
      openMsg({ content: '棋牌贏分服務費佔成不可小於其它下級的贏分服務費佔成' })
      return
    }
  }

  // 編輯分潤和返水、返水開關
  const percent = {}
  percent.can_return_game = user.value.can_return_game
  percent.hash_percent = targetTree.value.level !== 0 ? user.value.hash_percent * 1000 : 100000
  percent.sport_percent = targetTree.value.level !== 0 ? user.value.sport_percent * 1000 : 100000
  percent.ele_percent = targetTree.value.level !== 0 ? user.value.ele_percent * 1000 : 100000
  percent.hash_return_percent = targetTree.value.level !== 0 ? user.value.hash_return_percent * 100 : 2000
  percent.sport_return_percent = targetTree.value.level !== 0 ? user.value.sport_return_percent * 100 : 2000
  percent.ele_return_percent = targetTree.value.level !== 0 ? user.value.ele_return_percent * 100 : 2000
  percent.goldenwind_pk_percent = targetTree.value.level !== 0 ? user.value.goldenwind_pk_percent * 1000 : 100000
  if (targetTree.value.level > 0) {
    const percentRes = await editTreePercentApi(percent, id)
    if (percentRes.data.code !== 200) return
  }

  // 編輯其他訊息
  const otherInfo = {}
  otherInfo.info = user.value.info
  otherInfo.nickname = user.value.nickname
  otherInfo.can_own_player = true
  otherInfo.can_create_player = true
  otherInfo.lobby_style = user.value.lobby_style
  const infoRes = await editTreeInfoApi(otherInfo, id)
  if (infoRes.data.code !== 200) return

  // 編輯階級代理凍結
  const agentfreeze = {}
  const { status } = user.value
  if (modalStatus.value === 'edit' && targetTree.value.status !== status) {
    const api = status === 'Freeze' ? handleTreeFreezeApi : handleTreeUnFreezeApi
    agentfreeze.freeze = status
    const freezeRes = await api(id)
    if (freezeRes.data.code !== 200) return
  }
  // 刷新樹狀資料、目前展開階級
  treeStore.getModalStatus(modalStatus.value)
  await treeStore.getTreeData()
  emit('updateOrder', true)

  // 關閉modal
  const { admin_account: account, admin_password: pwd } = user.value
  closeModal(formEl)

  // 創建階級資訊
  if (modalStatus.value === 'add') {
    const url = process.env.VUE_APP_LINK
    const link = `${url}/${url.includes('192') ? 'backend_phil' : 'backend'}/?openExternalBrowser=1`
    return openMsg({
      content: [
        {
          text: isEn ? `Agent ${account} Lv ${targetTree.value.level} added successfully` : `${t('創建層級成功,層級名稱')}: ${account}`,
          color: 'black'
        },
        {
          text: `${t('管理員帳號')}: ${account}`,
          color: 'black'
        },
        {
          text: `${t('管理員密碼')}: ${pwd}`,
          color: 'black'
        },
        {
          text: `${t('後台網址')}: ${link}`,
          color: 'black'
        }
      ],
      type: 'add'
    })
  }

  openMsg({ content: t('編輯成功') })
}

const copyData = (data, status) => {
  Object.keys(data.percent).forEach((item) => {
    user.value.can_return_game[item] = data.percent[item].status
    if (status) {
      user.value[`${item}_return_percent`] = data.percent[item].rebate / 100
      user.value[`${item}_percent`] = data.percent[item].profit / 1000

      // 編輯時分潤和返水有數值時 disable
      user.value[`disable_${item}_return_percent`] = data.percent[item].rebate > 0
      user.value[`disable_${item}_percent`] = data.percent[item].profit > 0
      return
    }
    user.value[`temp_${item}_return_percent`] = data.percent[item].rebate / 100
    user.value[`init_${item}_return_percent`] = data.percent[item].rebate / 100
    user.value[`temp_${item}_percent`] = data.percent[item].profit / 1000
    user.value[`init_${item}_percent`] = data.percent[item].profit / 1000
  })
}

const resetCanReturnGame = () => {
  user.value.can_return_game = {
    hash: false,
    sport: false,
    ele: false
  }
}

// 開啟 modal 取得階級資料
watch(treeModal, async () => {
  if (treeModal.value) {
    user.value = {}
    resetCanReturnGame()
    targetGroup = await treeStore.getGroupData(targetTree.value.name)
    if (targetGroup.data.code !== 200) return
    const range = targetGroup.data.data.range
    console.log(targetGroup.data.data.data)
    targetGroup = { ...targetGroup.data.data.data, range }
    // temp、init 本級分潤和返水
    copyData(targetGroup)
    user.value.lobby_style = lobbyStyle.value[0] // 因為lobby_style為必填
    // 編輯取得上級資料
    if (modalStatus.value === 'edit') {
      let fatherData = await treeStore.getGroupData(targetTree.value.father_name)
      if (fatherData.data.code !== 200) return
      fatherData = fatherData.data.data.data
      user.value = { ...targetGroup }
      resetCanReturnGame()

      // temp、init 上級分潤和返水
      copyData(fatherData)

      // 輸入框的本級分潤、返水、額度、服務費(編輯時需取回，創建時不需要(數值都為0))
      setTimeout(() => copyData(targetGroup, true), 0)
    }

    // 總代理創一級代理預設現金
    if (targetTree.value.level === 1 && modalStatus.value === 'add') {
      user.value.player_type = 'cash'
    }
  }
})

// 驗證帳密和名稱
const { required, customize } = validatorStore
const resetCheckpwd = ref(0)
watch(
  () => user.value.admin_password,
  () => {
    validatorStore.password = user.value.admin_password
    if (user.value.admin_password === user.value.checkpwd) resetCheckpwd.value++
  }
)//
const lobbystyleStatus = () => {
  // modalStatus === "add" ? $t("創建") : $t("編輯") }}
  // {{ modalStatus === "add" ? $t(childName) : $t(fatherName)
  let nowName = ''
  if (modalStatus.value === 'add') {
    nowName = childName.value
  } else {
    nowName = fatherName.value
  }
  if (nowName === '一級代理') {
    return true
  } else {
    return false
  }
}
const rules = reactive({
  nickname: [required(), customize('checkLength')],
  admin_account: [required(), customize('checkGarbled'), customize('checkLength')],
  admin_password: [required(), customize('checkGarbled'), customize('checkLength')],
  checkpwd: [required(), customize('checkGarbled'), customize('checkLength'), customize('checkpwd')],
  lobby_style: [required()]
})

// 驗證額度、分潤、返水的上級和驗證空值轉為0
const verifyNum = (key, oldValue) => {
  if (user.value[key] === '' || user.value[key] === undefined) return (user.value[key] = 0)

  if (user.value[key].length >= 2 && user.value[key].slice(0, 1) === '0') {
    user.value[key] = user.value[key].slice(1)
  }

  user.value[`temp_${key}`] = (user.value[`init_${key}`] - user.value[key]).toPrecision(4) * 1

  if (user.value[`temp_${key}`] < 0) {
    const name = key.includes('return') ? '返水' : '分潤'
    user.value[key] = oldValue
    openMsg({
      content: t(
        `${modalStatus.value === 'add' ? childName.value : fatherName.value}的${name}不可大於${
          modalStatus.value === 'add' ? fatherName.value : grandfatherName.value
        }`
      )
    })
  }
}

watch(
  () => user.value.hash_percent,
  (newValue, oldValue) => verifyNum('hash_percent', oldValue),
  { immediate: true }
)
watch(
  () => user.value.sport_percent,
  (newValue, oldValue) => verifyNum('sport_percent', oldValue),
  { immediate: true }
)
watch(
  () => user.value.ele_percent,
  (newValue, oldValue) => verifyNum('ele_percent', oldValue),
  { immediate: true }
)
watch(
  () => user.value.hash_return_percent,
  (newValue, oldValue) => verifyNum('hash_return_percent', oldValue),
  { immediate: true }
)
watch(
  () => user.value.sport_return_percent,
  (newValue, oldValue) => verifyNum('sport_return_percent', oldValue),
  { immediate: true }
)
watch(
  () => user.value.ele_return_percent,
  (newValue, oldValue) => verifyNum('ele_return_percent', oldValue),
  { immediate: true }
)
watch(
  () => user.value.goldenwind_pk_percent,
  (newValue, oldValue) => verifyNum('goldenwind_pk_percent', oldValue),
  { immediate: true }
)

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const modalWidth = computed(() => {
  if (wh.value === 'xl') return '800px'
  if (wh.value === 'lg') return '500px'
  return '95%'
})
const isMobile = computed(() => wh.value === 'sm')

// modal 開關
const closeModal = (formEl) => {
  if (formEl) formEl.resetFields()
  emit('update:treeModal', false)
}

const isEn = localStorage.getItem('locale') === 'EN'

</script>

<style lang="scss">
.treeModal {
  .el-dialog {
    overflow-y: scroll;
    max-height: 80vh;
    .switch {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 40px;
      margin-bottom: 20px;
      @include breakpoint-up("xl") {
        margin-right: 0;
        margin-bottom: 10px;
      }
      p {
        margin-right: 15px;
      }
    }
  }
}

.freezeText {
  margin-left: 5px !important;
}

// 返水跟分潤
.value {
  display: flex;
  margin-top: 10px;
  margin-right: 15px;
}
</style>
