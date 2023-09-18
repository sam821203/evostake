<template>
  <el-dialog :model-value="administratorModal" :width="listModalWidth" @close="closeListModal" :destroy-on-close="true">
    <template #header v-if="canHandleController('add')">
      <h2>{{ $t('創建管理員') }}</h2>
    </template>
    <el-button type="primary" class="create" @click="handleAdministrator('add')" v-if="canHandleController('add')">{{
      $t('創建管理員')
    }}</el-button>
    <h2>{{ $t('管理員列表') }}</h2>
    <div class="administratorList">
      <div v-if="!mobileWidth" class="table" :style="{ height: administratorData.length === 0 ? '115px' : '400px' }">
        <el-table
          :data="administratorData"
          border
          style="width: 100%"
          :empty-text="$t('無資料')"
          :height="administratorData.length === 0 ? '115px' : '400px'"
        >
          <el-table-column prop="role" :label="$t('類型')" align="center">
            <template #default="scope">
              <span v-if="scope.row.role">{{ $t(scope.row.role) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="account" :label="$t('帳號')" align="center" />
          <el-table-column prop="nickname" :label="$t('暱稱')" align="center" />
          <el-table-column prop="status" :label="$t('狀態')" align="center">
            <template #default="scope">
              <span v-status="scope.row.status"></span>
            </template>
          </el-table-column>
          <el-table-column prop="created_time" :label="$t('建立時間')" align="center" width="170px">
            <template #default="scope">
              <span v-time="scope.row.created_time"></span>
            </template>
          </el-table-column>
          <el-table-column prop="lasted_login_time" :label="$t('最後登入時間')" align="center" width="170px">
            <template #default="scope">
              <span v-time="scope.row.lasted_login_time"></span>
            </template>
          </el-table-column>
          <el-table-column align="center" width="170px" v-if="canHandleController('edit')">
            <template #header>{{ $t('編輯') }}</template>
            <template #default="scope">
              <div class="btnGroup edit" v-if="canHandleCadre(scope.row)">
                <el-button type="primary" @click="handleAdministrator('edit', scope.row)" class="edit">{{ $t('編輯') }}</el-button>
                <el-button
                  type="primary"
                  :class="{ danger: scope.row.status === 'Freeze' }"
                  @click="handlefreeze(scope.row)"
                  v-show="loginStore.loginData.userData.account !== scope.row.account && scope.row.role_name !== 'root'"
                >
                  {{ scope.row.status === 'Enable' ? $t('凍結') : $t('解凍') }}
                </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-else v-for="item in administratorData" :key="item.account">
        <div class="mobileCard">
          <ul>
            <li>
              <p>{{ $t('狀態') }}</p>
              <p v-status="item.status"></p>
            </li>
            <li>
              <p>{{ $t('類型') }}</p>
              <p>{{ $t(item.role) }}</p>
            </li>
            <li>
              <p>{{ $t('帳號') }}</p>
              <p>{{ item.account }}</p>
            </li>
            <li>
              <p>{{ $t('暱稱') }}</p>
              <p>{{ item.nickname }}</p>
            </li>
            <li>
              <p>{{ $t('建立時間') }}</p>
              <p v-time="item.created_time"></p>
            </li>
            <li>
              <p>{{ $t('最後登入時間') }}</p>
              <p v-time="item.lasted_login_time"></p>
            </li>
            <template v-if="canHandleController('edit') && canHandleCadre(item)">
              <li>
                <el-button type="primary" @click="handleAdministrator('edit', item)" class="edit">{{ $t('編輯') }}</el-button>
              </li>
              <li>
                <el-button
                  type="primary"
                  :class="{ freeze: item.status === 'Freeze' }"
                  @click="handlefreeze(item)"
                  v-show="loginStore.loginData.userData.account !== item.account"
                >
                  {{ item.status === 'Enable' ? $t('凍結') : $t('解凍') }}
                </el-button>
              </li>
            </template>
          </ul>
        </div>
      </template>
    </div>
  </el-dialog>
  <el-dialog
    :model-value="createEditModal"
    :width="userModalWidth"
    :show-close="false"
    @close="closeUserModal(ruleFormRef)"
    :destroy-on-close="true"
  >
    <template #header>
      <h2>{{ modalStatus === 'add' ? $t('創建') : $t('編輯') }}{{ $t('管理員') }}</h2>
    </template>
    <el-form ref="ruleFormRef" :model="user" :rules="rules" :label-width="isEn ? '120px' : '100px'">
      <el-row :gutter="30" justify="center">
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item :label="$t('帳號')" prop="account">
            <el-input v-model="user.account" :disabled="modalStatus === 'edit'" autocomplete="new-password" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
          <el-form-item :label="$t('暱稱')" prop="nickname">
            <el-input v-model="user.nickname" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-if="targetTree.level < 2 && modalStatus === 'add'">
          <el-form-item :label="$t('類型')" prop="role">
            <el-select v-model="user.role" :placeholder="$t('請選擇類型')">
              <el-option
                v-if="loginStore.loginData.userData?.role_name !== 'watcher'"
                :label="targetTree.level === 0 ? $t('財會') : $t('財務')"
                value="watcher"
              />
              <el-option
                v-if="loginStore.loginData.userData?.role_name !== 'cadre'"
                :label="targetTree.level === 0 ? $t('主管') : $t('幹部')"
                value="cadre"
              />
              <template v-if="targetTree.level === 1">
                <el-option :label="$t('遊戲客服')" value="kefu" />
                <!-- <el-option :label="$t('股東')" value="shareholder" /> -->
                <!-- <el-option :label="$t('風控')" value="control" /> -->
                <el-option :label="$t('客服主管')" value="control" />
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="isEn && modalStatus === 'edit' ? 10 : 12" :xl="isEn && modalStatus === 'edit' ? 10 : 12">
          <el-form-item :label="$t('密碼')" prop="password">
            <el-input v-model="user.password" show-password autocomplete="new-password" />
          </el-form-item>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="24"
          :lg="isEn ? 10 : 12"
          :xl="isEn ? 10 : 12"
          v-if="pcWidth && targetTree.level < 2 && modalStatus === 'add'"
        >
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="isEn ? 14 : 12" :xl="isEn ? 14 : 12">
          <el-form-item :label-width="isEn ? '190px' : '100px'" :label="$t('確認密碼')" prop="checkpwd" :key="resetCheckpwd">
            <el-input v-model="user.checkpwd" show-password />
          </el-form-item>
        </el-col>
        <el-col class="btnGroup">
          <el-button type="danger" @click="closeUserModal(ruleFormRef)">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="save(ruleFormRef)">{{ $t('確認') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, watch, toRefs, inject, computed } from 'vue-demi'
import useStore from '@/store/index'
import { getAdministratorApi, addAdministratorApi, freezeAdministratorApi, unfreezeAdministratorApi } from '@/api/administrator'
import { useI18n } from 'vue-i18n'

const { loginStore, treeStore, validatorStore, msgStore } = useStore()

const { t } = useI18n()

const modalStatus = ref('')
const ruleFormRef = ref()
const user = ref({
  password: ''
})

const { targetTree, groupData } = storeToRefs(treeStore)

// 判斷是否可創建編輯管理員
const canHandleController = (status, data) => {
  if (groupData.value.level > 1) return false
  const levelStatus = groupData.value.level === targetTree.value.level || groupData.value.level === targetTree.value.level - 1
  switch (loginStore.loginData.userData?.role_name) {
    case 'root':
      return true
    case 'supermaster':
      return levelStatus
    case 'watcher':
      return false
    case 'cadre':
      // 開發商的主管
      if (!groupData.value.level && groupData.value.level !== targetTree.value.level) return false
      // 是否隱藏管理欄位
      if (status === 'edit') return levelStatus
      // 1~5級幹部
      if (groupData.value.level > 1) return false
      // groupData.value.level === targetTree.value.level - 1
      // 總代理的幹部
      return groupData.value.level === 1 && status === 'add' && groupData.value.level >= targetTree.value.level - 1
    case 'kefu':
      return false
    case 'agent':
      return levelStatus
  }
}

// 判斷是否可編輯和凍結管理員
const canHandleCadre = (data) => {
  switch (loginStore.loginData.userData?.role_name) {
    case 'root':
      return true
    case 'supermaster':
      return true
    case 'watcher':
      return false
    case 'cadre':
      if (!groupData.value.level) return data.role_name === loginStore.loginData.userData?.role_name
      if (groupData.value.level < targetTree.value.level) return true
      return (
        loginStore.loginData.userData?.account === data.account ||
        data.role_name === 'kefu' ||
        data.role_name === 'shareholder' ||
        data.role_name === 'control' ||
        data.role_name === 'watcher'
      )
    case 'agent':
      return true
  }
}

// 取得管理員資料
const administratorData = ref([])
const getAdministrator = async () => {
  const { data } = await getAdministratorApi(targetTree.value.name)
  if (data.code !== 200) return
  administratorData.value = data.data.data.map((item) => ({
    ...item,
    role: treeStore.levelText(targetTree.value.level, item.role_name)
  }))
}

// 創建和編輯管理員modal
const handleAdministrator = (status, data) => {
  createEditModal.value = true
  modalStatus.value = status
  if (status === 'add') return
  user.value = data
}

const { openMsg } = msgStore
const { implement, type } = storeToRefs(msgStore)

// 凍結和解凍管理員
const handlefreeze = (data) => {
  user.value = data
  openMsg({ content: `確定要${user.value.status === 'Enable' ? '凍結' : '解凍'}此管理員?`, type: 'freeze' })
}
watch(implement, async () => {
  if (implement.value) {
    if (type.value === 'freeze') {
      const freezeStatus = user.value.status === 'Enable' ? freezeAdministratorApi : unfreezeAdministratorApi
      await freezeStatus({ account: user.value.account })
      getAdministrator()
    }
  }
})

// 創建編輯管理員
const save = async (formEl) => {
  const valid = await formEl.validate((valid) => valid)
  if (!valid) return
  user.value.logingroup = targetTree.value.name
  if (targetTree.value.level > 1 && modalStatus.value === 'add') user.value.role = 'cadre'
  const { data } = await addAdministratorApi(user.value, modalStatus.value)
  if (data.code !== 200) return
  getAdministrator()
  closeUserModal(formEl)
  if (modalStatus.value === 'add') return openMsg({ content: t('創建成功') })
  openMsg({ content: t('編輯成功') })
}

const props = defineProps({
  administratorModal: Boolean
})
const { administratorModal } = toRefs(props)

// 驗證帳密、暱稱、類別
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
  role: [required()],
  nickname: [required(), customize('checkLength')],
  account: [required(), customize('checkGarbled'), customize('checkLength')],
  password: [required(), customize('checkGarbled'), customize('checkLength')],
  checkpwd: [required(), customize('checkGarbled'), customize('checkLength'), customize('checkpwd')]
})

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const listModalWidth = computed(() => (wh.value === 'xl' ? '1200px' : '95%'))
const userModalWidth = computed(() => (wh.value === 'xl' ? '900px' : wh.value === 'lg' ? '800px' : '95%'))
const pcWidth = computed(() => wh.value === 'xl')
const mobileWidth = computed(() => wh.value === 'sm')

// modal 開關
// 管理員列表 modal
const emit = defineEmits(['update:administratorModal'])
const closeListModal = () => emit('update:administratorModal', false)

// 管理員創建編輯 modal
const createEditModal = ref(false)
const closeUserModal = (formEl) => {
  createEditModal.value = false
  user.value = {}
  if (formEl) formEl.resetFields()
}

watch(administratorModal, () => {
  if (administratorModal.value) getAdministrator()
})

// 手機版 管理員modal 展開鎖定body
watch(administratorModal, () => {
  document.documentElement.style.overflowY = administratorModal.value ? 'hidden' : 'initial'
})

const isEn = localStorage.getItem('locale') === 'EN'
</script>

<style lang="scss" scoped>
.administratorList {
  @include breakpoint-up('sm') {
    height: calc(100vh - 275px);
    overflow-y: scroll;
  }
}

.create {
  margin-bottom: 10px !important;
  @include breakpoint-up('sm') {
    margin-left: 0 !important;
  }
}

.el-table {
  margin-top: 20px;
}

.btnGroup {
  display: flex;
  &.edit .el-button {
    min-width: 70px !important;
    max-width: 70px !important;
    &:first-child {
      margin-right: 5px !important;
    }
  }
}

.table {
  margin-bottom: 10px;
}
.el-select{
  width: 95%;
}
</style>
