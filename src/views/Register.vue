<template>
  <div class="register">
    <img src="@/assets/logo.png" alt="" />
    <h2>{{ $t(`${level}`) }} {{ $t("註冊") }}</h2>
    <p></p>
    <el-form ref="ruleFormRef" :model="user" :rules="rules" label-width="100px" label-position="top">
      <div class="text">
        <p>{{ $t("上級代理帳號") }} :</p>
        <span>{{ route.params.name }}</span>
      </div>
      <el-form-item class="check" prop="account">
        <template #label>
          <p>{{ $t("帳號") }}</p>
          <el-button :type="accountStatus ? 'primary' : 'warning'" @click="checkAccount">{{ $t("檢查") }}</el-button>
        </template>
        <el-input v-model="user.account" :placeholder="$t('限6-12半形英數')" />
      </el-form-item>
      <el-form-item class="check" prop="nickname">
        <template #label>
          <p>{{ $t("暱稱") }}</p>
          <el-button :type="nicknameStatus ? 'primary' : 'warning'" @click="checkNickname">{{ $t("檢查") }}</el-button>
        </template>
        <el-input v-model="user.nickname" :placeholder="$t('限2-12半形英數')" />
      </el-form-item>
      <el-form-item :label="$t('密碼')" prop="password">
        <el-input autocomplete="new-password" v-model="user.password" show-password :placeholder="$t('限6-12半形英數')" />
      </el-form-item>
      <el-form-item :label="$t('確認密碼')" prop="checkpwd" :key="resetCheckpwd">
        <el-input v-model="user.checkpwd" show-password :placeholder="$t('限6-12半形英數')" />
      </el-form-item>
      <div class="save">
        <el-button class="default" :type="checkStatus ? 'primary' : 'warning'" @click="checkData(ruleFormRef)">{{ $t("提交") }}</el-button>
      </div>
    </el-form>
  </div>
  <div class="modal center" v-show="modal">
    <div class="content">
      <h2>{{ $t(title) }}</h2>
      <p v-if="modalStatus" class="msg">{{ msg }}</p>
      <template v-else>
        <div class="user">
          <p>{{ $t("帳號") }}</p>
          <p>{{ user.account }}</p>
        </div>
        <div class="user">
          <p>{{ $t("暱稱") }}</p>
          <p>{{ user.nickname }}</p>
        </div>
        <template v-if="registerStatus">
          <p class="check">{{ $t("提醒您，創建帳號後不得再更改，請再次確認。") }}</p>
          <div class="btn">
            <el-button type="primary" @click="save()" class="default">{{ $t("送審") }}</el-button>
          </div>
        </template>
        <div class="btn" v-else>
          <el-button type="primary" @click="login">{{ $t("鏈結登入頁") }}</el-button>
        </div>
      </template>
      <div class="close" @click="modal = false">
        <div class="box center">
          <i class="bi bi-x center"></i>
        </div>
      </div>
    </div>
  </div>
  <div v-show="modal" class="mask center"></div>
</template>

<script setup>
import { ref, watch, reactive, computed } from 'vue-demi'
import { useRoute, useRouter } from 'vue-router'
import useStore from '@/store/index'
import { checkAccountApi, checkNicknameApi, addAgentApi } from '@/api/register'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { validatorStore, msgStore } = useStore()

// 談窗模板背景色
const primary = '#203864'
const success = '#006c31'
const error = '#c00000'

const ruleFormRef = ref()
const user = ref({})
const modal = ref(false)
const modalStatus = ref(false)
const modalColor = ref(primary)
const registerStatus = ref(true)

const title = ref('')
const msg = ref('')

const route = useRoute()
const router = useRouter()
const level = computed(() => {
  const lv = route.params.level
  // const text = lv === '1' ? '一級' : lv === '2' ? '二級' : lv === '3' ? '三級' : '四級'
  let text = '一'
  switch (lv) {
    case '1':
      text = '一'
      break
    case '2':
      text = '二'
      break
    case '3':
      text = '三'
      break
    case '4':
      text = '四'
      break
    case '5':
      text = '五'
      break
  }
  text = text + '級'

  return t(`${text}代理`)
})

// 檢查帳號、暱稱
const checkUser = (text) => {
  modal.value = true
  modalStatus.value = true
  modalColor.value = primary
  title.value = t('訊息')
  msg.value = t(text)
}
const checkAccount = async () => {
  if (accountStatus.value) {
    const { data } = await checkAccountApi({ account: user.value.account, type: 0 })
    checkUser(data.data.msg)
  }
}
const checkNickname = async () => {
  if (nicknameStatus.value) {
    const { data } = await checkNicknameApi({ nickname: user.value.nickname, type: 0 })
    checkUser(data.data.msg)
  }
}
const accountStatus = computed(() => user.value.account?.length >= 6 && user.value.account?.length <= 12)
const nicknameStatus = computed(() => user.value.nickname?.length >= 2 && user.value.nickname?.length <= 12)

// 送審
const save = async () => {
  const obj = {
    nickname: user.value.nickname,
    uppergroup_name: route.params.name,
    player_type: 'cash',
    admin_account: user.value.account,
    admin_password: user.value.password
  }

  const { data } = await addAgentApi(obj)
  modal.value = true

  if (data.code !== 200) {
    const tempMsg = data.msg.split(' ')
    modalStatus.value = true
    title.value = '提交失敗'
    msg.value = `${tempMsg[0]} ${t(tempMsg[1])}`
    modalColor.value = error
  } else {
    msgStore.hasCancel = false
    modalStatus.value = false
    registerStatus.value = false
    title.value = '完成提交'
    modalColor.value = success
  }
}

// 提交
const checkData = async (formEl) => {
  const valid = await formEl.validate((valid) => valid)
  if (!valid) return
  if (!checkStatus.value) return

  modal.value = true
  modalStatus.value = false
  registerStatus.value = true
  modalColor.value = primary
  title.value = '確認送審提交'
}

// 確認是否可提交
const checkStatus = computed(() => {
  if (!user.value.account || !user.value.password || !user.value.nickname || !user.value.checkpwd) return false
  if (user.value.password !== user.value.checkpwd) return false
  if (!accountStatus.value || !nicknameStatus.value) return false
  return true
})

const login = () => {
  router.push('/')
}

// 驗證帳密和名稱
const { required, customize } = validatorStore
const resetCheckpwd = ref(0)
watch(
  () => user.value.password,
  () => {
    validatorStore.password = user.value.password
    if (user.value.password === user.value.checkpwd) resetCheckpwd.value++
  }
)
const rules = reactive({
  nickname: [required(), customize('checkLength')],
  account: [required(), customize('checkGarbled'), customize('checkLength')],
  password: [required(), customize('checkGarbled'), customize('checkLength'), customize('checkpwd')],
  checkpwd: [required(), customize('checkGarbled'), customize('checkLength'), customize('checkpwd')]
})

// 語系更新
if (localStorage.getItem('locale') !== route.params.lang) {
  localStorage.setItem('locale', route.params.lang)
  router.go(0)
}
</script>

<style lang="scss" scoped>
:deep .el-form {
  width: 350px;
  @include breakpoint-up("sm") {
    width: 100%;
  }
}

.register {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 15px 12px 0;
  // background: $dark;
  background: black;
  h2 {
    margin-bottom: 16px;
    color: white;
  }
  img {
    width: 200px;
    // height: 152px;
    object-fit: contain;
    margin-bottom: 10px;
  }
  .text {
    display: flex;
    p {
      // width: 160px;
      margin-right: 10px;
      font-weight: 900;
      font-size: 18px;
      margin-bottom: 18px;
      color: white;
    }
    span {
      color: white;
    }
  }
  .save {
    text-align: center;
  }
}

:deep .check {
  .el-form-item__content {
    flex-wrap: nowrap;
    .el-button {
      margin-left: 10px !important;
      min-width: 80px !important;
      max-width: 80px !important;
    }
  }
}

:deep .el-form-item__label {
  color: white;
  display: flex !important;
  justify-content: flex-start;
  white-space: nowrap;
  p {
    color: white;
  }
  .el-button {
    min-width: 80px !important;
    height: 30px !important;
    margin-left: 10px !important;
  }
}

.modal {
  background: white;
  padding: 5px;
  border-radius: 20px;
  width: 450px;
  z-index: 10;
  @include breakpoint-up("sm") {
    width: 90%;
  }
  p {
    font-weight: 900;
    color: white;
    &.msg {
      text-align: center;
      padding: 30px 0;
      white-space: nowrap;
      font-size: 20px;
    }
  }
  .content {
    position: relative;
    background: v-bind(modalColor);
    border-radius: 20px;
    padding: 10px 20px;
    h2 {
      color: white;
      margin: 10px 0 20px 0;
      text-align: center;
      font-size: 20px;
    }
    .user {
      display: flex;
      margin-left: 10px;
      p {
        font-size: 20px;
        margin-bottom: 16px;
        margin-right: 16px;
        &:first-child {
          width: 100px;
        }
      }
    }
    .check {
      margin: 30px 0 20px 10px;
      color: #fafa02;
      font-size: 20px;
    }
    .btn {
      text-align: center;
      margin-bottom: 10px;
    }
  }
}

.close {
  position: absolute;
  top: -12px;
  right: -10px;
  width: 30px;
  height: 30px;
  background: white;
  border-radius: 50%;
  padding: 10px;
  cursor: pointer;
  .box {
    width: 23px;
    height: 23px;
    background: #4472c4;
    border-radius: 50%;
    .bi-x {
      font-size: 26px;
      top: 8px;
      color: white;
    }
  }
}

.center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mask {
  background: rgba(0, 0, 0, 0.5);
  width: 100vw;
  height: 100vh;
}
</style>
