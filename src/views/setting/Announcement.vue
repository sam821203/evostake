<template>
  <section>
    <h2 v-if="!mobileWidth">{{ $t('公告工具') }}</h2>
    <el-button v-if="!groupData.level" type="primary" @click="handleAnnouncement(scope, 'add')">{{ $t('創建代理公告') }}</el-button>
    <div
      v-if="!mobileWidth"
      class="table"
      :style="{ height: announcementData.length === 0 ? '115px' : groupData.level ? '665px' : 'calc(100vh - 232px)' }"
    >
      <el-table
        :data="announcementData"
        border
        style="width: 100%"
        :height="announcementData.length === 0 ? '115px' : groupData.level ? '665px' : 'calc(100vh - 232px)'"
        :empty-text="$t('無資料')"
        id="table"
        :data-name="$t('概括總計')"
      >
        <el-table-column v-if="groupData.level" prop="type" :label="$t('類別')" align="center" />
        <el-table-column prop="start_time" :label="$t('開始時間')" align="center" width="170px">
          <template #default="scope">
            <span v-time="scope.row.start_time"></span>
          </template>
        </el-table-column>
        <el-table-column prop="end_time" :label="$t('結束時間')" align="center" width="170px">
          <template #default="scope">
            <span v-time="scope.row.end_time"></span>
          </template>
        </el-table-column>
        <el-table-column v-if="groupData.level" prop="title" :label="$t('標題')" align="center" />
        <el-table-column prop="content" :label="$t('內文')" align="center">
          <template #default="scope">
            <span style="display: none" v-html="scope.row.content" :ref="(el) => getRefContent(scope, el)"></span>
            <span v-omitLast="scope.row.omitContent"></span>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" :label="$t('最後編輯時間')" align="center" width="170px">
          <template #default="scope">
            <span v-time="scope.row.update_time"></span>
          </template>
        </el-table-column>
        <el-table-column v-if="groupData.level" prop="lasteditor" :label="$t('最後編輯')" align="center" />
        <template v-if="canHandleEdit">
          <el-table-column v-if="groupData.level" prop="content" :label="$t('關/開')" align="center">
            <template #default="scope">
              <el-switch size="large" @click="handleAnnouncement(scope, 'switch')" v-model="scope.row.status" />
            </template>
          </el-table-column>
          <el-table-column prop="content" :label="$t('操作')" align="center">
            <template #default="scope">
              <el-button type="primary" @click="handleAnnouncement(scope, 'edit')">{{ $t('編輯') }}</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <template v-else v-for="item in announcementData" :key="item.content">
      <div class="mobileCard">
        <ul>
          <li v-if="groupData.level">
            <p>{{ $t('類別') }}</p>
            <p>{{ item.type }}</p>
          </li>
          <li>
            <p>{{ $t('開始時間') }}</p>
            <p v-time="item.start_time"></p>
          </li>
          <li>
            <p>{{ $t('結束時間') }}</p>
            <p v-time="item.end_time"></p>
          </li>
          <li v-if="groupData.level">
            <p>{{ $t('標題') }}</p>
            <p>{{ item.nickname }}</p>
          </li>
          <li>
            <p>{{ $t('內文') }}</p>
            <p v-omitLast="item.content"></p>
          </li>
          <li>
            <p>{{ $t('最後編輯時間') }}</p>
            <p v-time="item.update_time"></p>
          </li>
          <li v-if="groupData.level">
            <p>{{ $t('最後編輯') }}</p>
            <p>{{ item.lasteditor }}</p>
          </li>
          <template v-if="canHandleEdit">
            <li v-if="groupData.level">
              <p>{{ $t('關/開') }}</p>
              <el-switch size="large" @click="save(false,false)" v-model="item.status" />
            </li>
            <li>
              <el-button type="primary" @click="handleAnnouncement({ row: item }, 'edit')">{{ $t('編輯') }}</el-button>
            </li>
          </template>
          <li></li>
        </ul>
      </div>
    </template>
    <el-dialog
      :model-value="announcementModal"
      :width="modalWidth"
      :show-close="false"
      @close="closeModal(ruleFormRef)"
      :destroy-on-close="true"
    >
      <template #header>
        <h2>{{ modalStatus === 'add' ? $t('創建') : $t('編輯') }}{{ $t('公告') }}</h2>
      </template>
      <el-form ref="ruleFormRef" :model="user" :rules="rules" label-width="150px" label-position="left">
        <el-form-item class="title" :label="$t('公告起訖時間')" prop="start_time">
          <DateChoose @getDate="getDate" :choose="false" ref="dateChoose" />
          <el-input v-model="user.start_time" class="time" />
        </el-form-item>
        <el-form-item :label="$t('公告類別')" prop="type" v-if="groupData.level !== 0">
          <el-input v-model="user.type" />
        </el-form-item>
        <el-form-item :label="$t('標題')" prop="title" v-if="groupData.level !== 0">
          <el-input v-model="user.title" />
        </el-form-item>
        <el-form-item class="textarea title" prop="content" label-width="auto">
          <template #label>
            <div class="textareaLabel">
              <p>{{ $t('內文描述') }}</p>
              <p class="tinycme">{{ $t('切換背景色') }}</p>
              <el-radio-group v-model="tinycmeBg">
                <el-radio label="transparent" size="large">{{ $t('黑色') }}</el-radio>
                <el-radio label="white" size="large">{{ $t('白色') }}</el-radio>
              </el-radio-group>
            </div>
          </template>
          <TinycmeEditor v-model="user.content" />
        </el-form-item>
        <div class="btnGroup">
          <el-button type="danger" @click="closeModal(ruleFormRef)">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="save(ruleFormRef,true)">{{ $t('確認') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, inject, computed, nextTick, watch } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import { handlePlayerAnnouncementApi, handleAgentAnnouncementApi } from '@/api/setting'
import useStore from '@/store/index'
import TinycmeEditor from '@/components/Tinymce'
import { useI18n } from 'vue-i18n'

const { loginStore, treeStore, validatorStore, msgStore } = useStore()
const { supermaster, cadre, control, groupData } = storeToRefs(treeStore)

// 判斷可否編輯公告
const canHandleEdit = computed(() => {
  if (groupData.value.level === 0) return true
  return supermaster.value || cadre.value || control.value
})

const { openMsg } = msgStore

const { t } = useI18n()

const moment = require('moment')

const user = ref({})
const ruleFormRef = ref()
const announcementModal = ref(false)

// 日期
const dateData = ref({})
const getDate = (date) => (dateData.value = date)
watch(dateData, () => {
  user.value.start_time = dateData.value.time1
  user.value.end_time = dateData.value.time2
})

// 取得公告列表
const announcementData = ref([])
const getData = async () => {
  const announcementApi = groupData.value.level ? handlePlayerAnnouncementApi : handleAgentAnnouncementApi
  const { data } = await announcementApi('get')
  if (data.code !== 200) return
  announcementData.value = (groupData.value.level ? data.data.normal : data.data.data) ?? []
}

// 文字編輯器背景色
const tinycmeBg = ref('transparent')

// 取得內文純文字
const getRefContent = (data, el) => {
  if (!el) return

  if (announcementData.value[data.$index]) {
    announcementData.value[data.$index].omitContent = el.textContent
  }
}

// 驗證
const { required, customize } = validatorStore
const rules = reactive({
  title: [required()],
  content: [required()],
  start_time: [required()],
  type: [required(), customize('checkLength')]
})

const closeModal = (formEl) => {
  announcementModal.value = false
  user.value = {}
  if (formEl) formEl.resetFields()
}

// 創建和編輯公告
const dateChoose = ref(null)
const modalStatus = ref('')
const handleAnnouncement = (data, status) => {
  const isSwitch = status === 'switch'
  if (!isSwitch) announcementModal.value = true

  modalStatus.value = status
  const obj = {}
  const tempTime = isSwitch ? '0001-01-01T00:00:00Z' : ''
  if (status === 'add') return
  Object.keys(data.row).forEach((item) => {
    obj[item] = data.row[item] !== '0001-01-01T00:00:00Z' ? data.row[item] : tempTime
  })

  nextTick(() => {
    if (!obj.start_time) return
    dateChoose.value?.changeDate(obj.start_time, obj.end_time)
  })

  user.value = obj
  user.value.order = data.$index

  if (isSwitch) save()
}

// 儲存
const save = async (formEl, needChangeTimeZone) => {
  if (formEl) {
    const valid = await formEl.validate((valid) => valid)
    if (!valid) return
  }

  const { account, agent_id: id } = loginStore.loginData.userData

  if (!groupData.value.level) {
    user.value.agent_id = id
    user.value.delete = false
    if (modalStatus.value === 'add') {
      user.value.id = -1
      announcementData.value.push(user.value)
    } else {
      announcementData.value[user.value.order] = user.value
    }
  } else if (user.value.order !== undefined) {
    const time = new Date(moment().format('YYYY-MM-DD HH:mm:ss').replace(' ', 'T')).toISOString()
    announcementData.value[user.value.order] = user.value
    announcementData.value[user.value.order].lasteditor = account
    announcementData.value[user.value.order].update_time = time
    announcementData.value[user.value.order].is_edited = true
  }
  const announcementApi = groupData.value.level ? handlePlayerAnnouncementApi : handleAgentAnnouncementApi
  const { data } = await announcementApi(
    groupData.value.level ? 'post' : 'put',
    {
      announcement: announcementData.value
    },
    'normal', needChangeTimeZone
  )
  if (data.code !== 200) return
  getData()
  closeModal(formEl)
  dateData.value = {}
  if (modalStatus.value === 'add') return openMsg({ content: t('創建成功') })
  openMsg({ content: t('編輯成功') })
}

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const modalWidth = computed(() => (wh.value === 'xl' ? '1000px' : wh.value === 'lg' ? '400px' : '95%'))
const mobileWidth = computed(() => wh.value === 'sm')

if (groupData.value.level !== undefined) {
  getData()
}
</script>

<style lang="scss" scoped>
.el-table {
  .el-button {
    min-width: 80px !important;
    max-width: 80px !important;
  }
}

.textarea {
  display: block !important;
}

:deep .title {
  font-weight: 600;
  @include breakpoint-up('sm') {
    display: block;
  }
  .el-form-item__label {
    font-size: 18px !important;
  }
}

.time {
  opacity: 0;
  position: absolute;
  z-index: -1;
  top: 0;
}

.table {
  margin-top: 10px;
}

:deep .datePicker {
  margin-bottom: 0 !important;
}

:deep .tox-tinymce {
  width: 100%;
  height: 400p;
  z-index: 1000 !important;
}

:deep .tox-edit-area__iframe {
  background: v-bind(tinycmeBg);
}

:deep .el-overlay {
  z-index: 1000 !important;
}

.textareaLabel {
  display: flex;
  align-items: center;
  .tinycme {
    margin: 0 10px 0 20px;
  }
}
</style>
