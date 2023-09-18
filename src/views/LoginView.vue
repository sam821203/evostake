<template>
  <el-row justify="center" align="middle">
    <el-col :xs="20" :sm="16" :md="14" :lg="10" :xl="10">
      <el-card>
        <div class="login-title">
          <img src="@/assets/HK_UAT.png" alt="logo" v-show="mobileWidth" />
          <p v-show="!mobileWidth">{{ $t('登入') }}</p>
        </div>
        <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="120px">
          <el-form-item :label="!mobileWidth ? `${$t('帳號')}:` : ''" prop="account">
            <el-input v-model="form.account" :placeholder="$t('請輸入帳號')" autocomplete="new-password"></el-input>
          </el-form-item>
          <el-form-item :label="!mobileWidth ? `${$t('密碼')}:` : ''" prop="password">
            <el-input :placeholder="$t('請輸入密碼')" v-model="form.password" autocomplete="new-password" show-password></el-input>
          </el-form-item>
          <el-form-item class="login-item">
            <Teleport to=".login-title" :disabled="mobileWidth" v-if="isMounted">
              <el-button class="reload default" @click="reload" type="primary"
                ><i class="bi bi-arrow-clockwise"></i>{{ $t('重新載入') }}</el-button
              >
            </Teleport>
            <el-button class="login" @click="login(ruleFormRef)" type="primary">{{ $t('確認') }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, computed, onMounted, inject } from 'vue-demi'
import { loginApi } from '@/api/user'
import useStore from '@/store/index'
import { useRouter } from 'vue-router'

const { loginStore, validatorStore } = useStore()

const ruleFormRef = ref()
const form = ref({ account: '', password: '' })

const router = useRouter()

// 登入
const login = async (formEl) => {
  const valid = await formEl.validate((valid) => valid)
  if (!valid) return
  const loginRes = await loginApi(form.value)
  if (loginRes.data.code !== 200) return
  loginStore.setLoginData(loginRes)
  router.push('/home')
  document.documentElement.scrollTop = 0
}

// 監聽 localStorage 的語系
// const lang = ref(localStorage.getItem('locale') ?? 'zh-TW')
// window.addEventListener('locale', (e) => {
//   if (e.key === 'locale') lang.value = e.value
// })

// 驗證
const { required } = validatorStore
const rules = computed(() => {
  const verify = reactive({
    account: [required()],
    password: [required()]
  })
  return verify
})

// 重新載入
const reload = () => router.go(0)

// 確認 Teleport 載入
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')
</script>

<style lang="scss" scoped>
.el-row {
  min-height: 100%;
  @include breakpoint-up('sm') {
    align-items: initial;
  }
}
.el-card {
  background: $light;
  @include breakpoint-up('sm') {
    background: transparent;
    border: 0;
    box-shadow: initial;
  }
}
.el-form {
  padding: 0 15%;
  @include breakpoint-up('sm') {
    padding: 0;
  }
}

:deep .el-form-item__content {
  justify-content: center;
  flex-wrap: initial;
  margin: 10px 0 0 !important;
  @include breakpoint-up('sm') {
    justify-content: space-between;
  }
  .login {
    margin-left: 10px;
  }
}
.login-title {
  text-align: center;
  position: relative;
  font-weight: 900;
  font-size: 24px;
  margin-bottom: 20px;
  p {
    color: $primary;
  }
  .reload {
    position: absolute;
    left: 0;
    top: 0;
  }
  img {
    height: 230px;
  }
}
</style>
