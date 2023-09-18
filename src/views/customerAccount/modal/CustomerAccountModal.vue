<template>
  <el-dialog
    :model-value="customerAccountModal"
    :width="userModalWidth"
    :show-close="false"
    @close="closeModal(ruleFormRef)"
    :destroy-on-close="true"
  >
    <template #header>
      <h2>{{ $t('編輯玩家') }}</h2>
    </template>
    <el-form ref="ruleFormRef" :model="user" :rules="rules" label-position="top">
      <el-row :gutter="30" justify="center">
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <el-form-item :label="$t('所屬代理')">
            <el-input v-model="user.agent" disabled />
          </el-form-item>
          <el-form-item :label="$t('身分證')">
            <el-input v-model="user.idnumber" />
          </el-form-item>
          <el-form-item :label="$t('生日')">
            <el-date-picker v-model="user.birthday" type="date" :placeholder="$t('請選擇日期')" />
          </el-form-item>
          <el-form-item :label="$t('真實姓名')" prop="realname">
            <el-input v-model="user.realname"/>
          </el-form-item>
          <el-form-item :label="$t('暱稱')" prop="nickname">
            <el-input v-model="user.nickname" />
          </el-form-item>
          <el-form-item v-if="!treeStore.kefu" :label="$t('手機')">
            <el-input v-model="user.phone" />
          </el-form-item>
          <!-- <el-form-item label="LINE ID">
            <el-input v-model="user.line_id" />
          </el-form-item> -->
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <div class="avatar">
            <p v-show="!images.avatar">{{ $t('玩家頭像') }}</p>
            <img :src="images.avatar ? images.avatar : require('@/assets/add.png')" alt="" :class="{ add: !images.avatar }" />
            <input type="file" accept="image/jpeg,image/jpg,image/png" @change="changeImage($event, 'avatar')" class="uppic" />
          </div>
          <div class="avatarGroup">
            <div class="avatar">
              <p v-show="!images.front">{{ $t('身分證正面') }}</p>
              <img :src="images.front ? images.front : require('@/assets/add.png')" alt="" :class="{ add: !images.front }" />
              <input type="file" accept="image/jpeg,image/jpg,image/png" @change="changeImage($event, 'front')" class="uppic" />
            </div>
            <div class="avatar">
              <p v-show="!images.back">{{ $t('身分證反面') }}</p>
              <img :src="images.back ? images.back : require('@/assets/add.png')" alt="" :class="{ add: !images.back }" />
              <input type="file" accept="image/jpeg,image/jpg,image/png" @change="changeImage($event, 'back')" class="uppic" />
            </div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
          <el-form-item :label="$t('玩家ID')">
            <el-input v-model="user.pid" disabled />
          </el-form-item>
          <el-form-item :label="$t('玩家體彩ID')">
            <el-input v-model="user.sport_id" disabled />
          </el-form-item>
          <el-form-item :label="$t('玩家帳號')" class="account">
            <el-input v-model="user.account" disabled />
          </el-form-item>
          <el-form-item :label="$t('玩家密碼')">
            <el-input v-model="user.loginpwd" />
          </el-form-item>
          <el-form-item :label="$t('性別')">
            <el-radio-group v-model="user.gender" class="ml-4">
              <el-radio :label="1" size="large">{{ $t('男性') }}</el-radio>
              <el-radio :label="0" size="large">{{ $t('女性') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('備註')" class="memo">
            <el-input v-model="user.memo" type="textarea" :rows="6" maxlength="100" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="line" />
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <p style="margin-bottom: 15px">{{ $t('鏈遊') }}</p>
          <el-form-item :label="$t('代理返水千分比')">
            <el-input :value="agentData.percent?.hash?.rebate / 100" disabled />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <p style="margin-bottom: 15px">{{ $t('電子遊戲') }}</p>
          <el-form-item :label="$t('代理返水千分比')">
            <el-input :value="agentData.percent?.ele?.rebate / 100" disabled />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
          <!-- <p style="margin-bottom: 15px">{{ $t('體育競猜') }}</p>
          <el-form-item :label="$t('代理返水千分比')">
            <el-input :value="agentData.percent?.sport?.rebate / 100" disabled />
          </el-form-item> -->
        </el-col>
        <!-- 未來填視訊機台返水 -->
        <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6"> </el-col>
        <el-col class="btnGroup">
          <el-button type="danger" @click="closeModal(ruleFormRef)">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="save(ruleFormRef)">{{ $t('確認') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch, toRefs, inject, computed } from 'vue-demi'
import useStore from '@/store/index'
import { getGroupApi } from '@/api/tree'
import { handlePlayerApi, editAvatarApi, editIdcApi, getIdcApi } from '@/api/player'
import { useI18n } from 'vue-i18n'
import { money } from '@/utils/directive'

const { validatorStore, msgStore, treeStore } = useStore()
const { openMsg } = msgStore

const emit = defineEmits(['update:customerAccountModal', 'updatePlayer'])

const props = defineProps({
  customerAccountModal: Boolean,
  avatarData: Object,
  totalData: {
    type: Object,
    default: () => ({})
  }
})
const { customerAccountModal, totalData, avatarData } = toRefs(props)

const ruleFormRef = ref()
const user = ref({})

// 選擇頭像和身分證圖檔
const images = ref({})
const changeImage = (e, type) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  if (file) {
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      images.value[type] = e.target.result
      images.value[`${type}File`] = file
    }
  }
}

// 創建、編輯
const { t } = useI18n()
const save = async (formEl) => {
  const valid = await formEl.validate((valid) => valid)
  if (!valid) return

  user.value.birthday = user.value.birthday === '' ? '0001-01-01T00:00:00Z' : user.value.birthday

  const { data } = await handlePlayerApi(user.value)
  if (data.code !== 200) return

  // 頭像
  const avatarFromData = new FormData()
  avatarFromData.append('avatar', images.value.avatarFile)
  avatarFromData.append('U9', user.value.pid)
  await editAvatarApi(avatarFromData)

  // 身分證(正)
  const idFrontFromData = new FormData()
  idFrontFromData.append('type', 'front')
  idFrontFromData.append('u9', user.value.pid)
  idFrontFromData.append('idcard', images.value.frontFile)
  await editIdcApi(idFrontFromData)

  // 身分證(反)
  const idBackFromData = new FormData()
  idBackFromData.append('type', 'back')
  idBackFromData.append('u9', user.value.pid)
  idBackFromData.append('idcard', images.value.backFile)
  await editIdcApi(idBackFromData)

  emit('updatePlayer')
  closeModal(formEl)
  openMsg({ content: t('編輯成功') })
}

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const userModalWidth = computed(() => (wh.value === 'xl' ? '70%' : wh.value === 'lg' ? '400px' : '95%'))

const { required, customize } = validatorStore

const rules = reactive({
  nickname: [required(), customize('checkLength')],
  tempReturnwater: [required()],
  realname: [required(), customize('checkLength')]
})

// 管理員創建編輯 modal
const closeModal = (formEl) => {
  emit('update:customerAccountModal', false)
  user.value = {}
  if (formEl) formEl.resetFields()
}

// 取得身分證圖片
const getIdentity = async (status) => {
  const res = await getIdcApi(user.value.pid, status)
  if (res.data.type.indexOf('json') === -1) {
    const reader = new FileReader()
    reader.readAsDataURL(res.data)
    reader.onload = () => {
      if (status === 'front') {
        images.value.front = reader.result
      } else {
        images.value.back = reader.result
      }
    }
  }
}

// 取得編輯玩家資料
const agentData = ref({})
watch(customerAccountModal, async () => {
  images.value = {}
  user.value = {}
  if (customerAccountModal.value) {
    user.value = { ...totalData.value }
    user.value.birthday = user.value.birthday === '0001-01-01T00:00:00Z' ? '' : user.value.birthday
    user.value.tempReturnwater = user.value.returnwater / 100
    user.value.score = money(user.value.twd_balance / 10000)

    // 取得玩家返水
    Object.keys(user.value.rebate).forEach((item) => {
      user.value[item] = user.value.rebate[item] / 100
    })

    // 取得頭像、身分證
    images.value.avatar = avatarData.value[user.value.pid]
    getIdentity('front')
    getIdentity('back')

    // 取得代理返水
    const { data } = await getGroupApi(totalData.value.agentAccount)
    agentData.value = data.data.data
    agentData.value.temp_quota = agentData.value.quota / 10000 - agentData.value.quota_used / 10000
    agentData.value.init_quota = agentData.value.quota / 10000 - agentData.value.quota_used / 10000
  }
  // 所屬代理
  user.value.agent = user.value.agentAccount
})

watch(
  () => user.value.line_id,
  (newValue, oldValue) => {
    user.value.line_id = newValue?.toLowerCase()
  }
)
</script>

<style lang="scss" scoped>
.avatar {
  width: 200px;
  height: 200px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  position: relative;
  p {
    position: absolute;
    color: black;
    font-weight: 600;
    font-size: 18px;
    top: 10px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    &.add {
      width: 50%;
      height: 50%;
    }
  }
  .uppic {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}

.avatarGroup {
  display: flex;
  margin-top: 10px;
  .avatar {
    width: 235px;
    height: 150px;
    &:first-child {
      margin-right: 10px;
    }
    img {
      &.add {
        width: 50%;
        height: 55%;
      }
    }
  }
}

.el-row {
  .el-col {
    &.create {
      position: relative;
      left: -70px;
      @include breakpoint-up('xl') {
        position: initial;
      }
    }
    &:nth-child(1) {
      @include breakpoint-up('xl') {
        order: 2;
        margin-bottom: 0 !important;
      }
    }
    &:nth-child(2) {
      @include breakpoint-up('xl') {
        order: 1;
      }
    }
    &:nth-child(3) {
      @include breakpoint-up('xl') {
        order: 3;
      }
    }
    &:nth-child(n + 4) {
      @include breakpoint-up('xl') {
        order: 4;
      }
    }
  }
}

.line {
  border-bottom: 1px solid #5b7196;
}

:deep .el-dialog {
  .el-dialog__body {
    padding: 20px 30px 10px 30px !important;
    @include breakpoint-up('xl') {
      padding: 10px 20px !important;
    }
  }
}
</style>
