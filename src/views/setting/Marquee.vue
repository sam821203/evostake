<template>
  <section>
    <h2 v-if="!mobileWidth">{{ $t('跑馬燈工具') }}</h2>
    <div class="searchGroup">
      <el-select v-model="searchType">
        <el-option :label="$t('全部')" value="全部" />
        <el-option :label="$t('例行維護')" value="例行維護" />
        <el-option :label="$t('臨時維護')" value="臨時維護" />
        <el-option :label="$t('活動')" value="活動" />
        <el-option :label="$t('新遊戲')" value="新遊戲" />
      </el-select>
      <el-button type="primary" @click="search()">{{ $t('搜尋') }}</el-button>
      <el-button v-if="canHandleMarquee" type="primary" @click="handleMarquee('add')">{{ $t('新增跑馬燈') }}</el-button>
    </div>
  </section>
  <section>
    <h2 v-if="!mobileWidth">{{ $t('跑馬燈列表') }}</h2>
    <div v-if="!mobileWidth" class="table" :style="{ height: marqueeData.length === 0 ? '115px' : 'calc(100vh - 300px)' }">
      <el-table
        :data="marqueeData"
        border
        style="width: 100%"
        :height="marqueeData.length === 0 ? '115px' : 'calc(100vh - 300px)'"
        :empty-text="$t('無資料')"
      >
        <el-table-column prop="type" :label="$t('類別')" align="center">
          <template #default="scope">
            <span v-if="scope.row.type">{{ $t(scope.row.type) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="start_time" :label="$t('開始時間')" align="center" width="170">
          <template #default="scope">
            <span v-time="scope.row.start_time"></span>
          </template>
        </el-table-column>
        <el-table-column prop="end_time" :label="$t('結束時間')" align="center" width="170">
          <template #default="scope">
            <span v-time="scope.row.end_time"></span>
          </template>
        </el-table-column>
        <el-table-column prop="frequency" :label="$t('發送頻率/間隔')" align="center">
          <template #default="scope">
            <span v-if="scope.row.frequency">{{ $t(frequency[scope.row.frequency]) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="content" :label="$t('內文')" align="center">
          <template #default="scope">
            <span v-omitLast="scope.row.content"></span>
          </template>
        </el-table-column>
        <el-table-column prop="update_time" :label="$t('最後編輯時間')" align="center" width="170">
          <template #default="scope">
            <span v-time="scope.row.update_time"></span>
          </template>
        </el-table-column>
        <el-table-column prop="last_editor" :label="$t('最後編輯')" align="center" />
        <el-table-column align="center" v-if="canHandleMarquee">
          <template #header>{{ $t('操作') }}</template>
          <template #default="scope">
            <el-button type="primary" @click="handleMarquee('edit', scope,)">{{ $t('編輯') }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template v-for="(item, index) in marqueeData" :key="item.content" v-else>
      <div class="mobileCard">
        <ul>
          <li>
            <p>{{ $t('類別') }}</p>
            <p>{{ $t(item.type) }}</p>
          </li>
          <li>
            <p>{{ $t('開始時間') }}</p>
            <p v-time="item.start_time"></p>
          </li>
          <li>
            <p>{{ $t('結束時間') }}</p>
            <p v-time="item.end_time"></p>
          </li>
          <li>
            <p>{{ $t('發送頻率/間隔') }}</p>
            <p>{{ $t(frequency[item.frequency]) }}</p>
          </li>
          <li>
            <p>{{ $t('內文') }}</p>
            <p>{{ item.content }}</p>
          </li>
          <li>
            <p>{{ $t('最後編輯時間') }}</p>
            <p v-time="item.update_time"></p>
          </li>
          <li>
            <p>{{ $t('最後編輯') }}</p>
            <p>{{ item.last_editor }}</p>
          </li>
          <li v-if="canHandleMarquee">
            <el-button type="primary" @click="handleMarquee('edit', { row: item, $index: index })">{{ $t('編輯') }}</el-button>
          </li>
        </ul>
      </div>
    </template>
  </section>
  <!-- 創建和編輯跑馬燈彈窗 -->
  <el-dialog :model-value="marqueeModal" :width="modalWidth" :show-close="false" @close="closeModal(ruleFormRef)" :destroy-on-close="true">
    <template #header>
      <h2>{{ modalStatus === 'add' ? $t('新增') : $t('編輯') }}{{ $t('跑馬燈') }}</h2>
    </template>
    <el-form ref="ruleFormRef" :model="user" :rules="rules" label-width="170px" label-position="left">
      <el-form-item class="title" :label="$t('跑馬燈起訖時間')" prop="start_time">
        <DateChoose @getDate="getDate" :choose="false" ref="dateChoose" />
        <el-input v-model="user.start_time" class="time" />
      </el-form-item>
      <el-form-item :label="$t('指定代理對象')" prop="agentType" v-if="groupData.level === 0 && modalStatus === 'add'">
        <el-select v-model="user.agentType" :placeholder="$t('請選擇代理')">
          <el-option :label="$t('全部代理')" :value="99999999" />
          <el-option v-for="item in agentTotal" :key="item.agent_id" :label="item.name" :value="item.agent_id" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('跑馬燈類別')">
        <el-select v-model="user.type" :placeholder="$t('請選擇類別')">
          <el-option :label="$t('例行維護')" value="例行維護" />
          <el-option :label="$t('臨時維護')" value="臨時維護" />
          <el-option :label="$t('活動')" value="活動" />
          <el-option :label="$t('新遊戲')" value="新遊戲" />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('發送頻率/間隔')" prop="frequency">
        <el-select v-model="user.frequency" :placeholder="$t('請選擇間隔')">
          <el-option v-for="key of frequency" :key="key" :label="$t(key)" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item class="textarea" :label="$t('內文描述')" prop="content">
        <el-input v-model="user.content" type="textarea" :rows="4" maxlength="100" />
      </el-form-item>
      <div class="btnGroup">
        <el-button type="danger" @click="closeModal(ruleFormRef)">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="save(ruleFormRef)">{{ $t('確認') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, reactive, inject, computed, watch, nextTick } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import { handleMarqueeApi } from '@/api/setting'
import useStore from '@/store/index'
import { useI18n } from 'vue-i18n'

const { loginStore, treeStore, validatorStore, msgStore } = useStore()
const { treeTotal, groupData, supermaster, cadre, control } = storeToRefs(treeStore)

// 判斷可否創建編輯跑馬燈
const canHandleMarquee = computed(() => {
  if (groupData.value.level === 0) return true
  return supermaster.value || cadre.value || control.value
})

const { openMsg } = msgStore

const { t } = useI18n()

const moment = require('moment')

const marqueeModal = ref(false)
const modalStatus = ref('')
const user = ref({})
const ruleFormRef = ref()
const searchType = ref('全部')

const frequency = ref({
  10000: '10秒',
  20000: '20秒',
  60000: '60秒',
  300000: '5分鐘',
  1800000: '30分鐘',
  3600000: '1小時',
  10800000: '3小時',
  21600000: '6小時',
  43200000: '12小時',
  86400000: '1日'
})

// 開發商創建跑馬燈選擇代理
const agentTotal = ref([])

// 日期
const dateData = ref({})
const getDate = (date) => (dateData.value = date)
watch(dateData, () => {
  user.value.start_time = dateData.value.time1
  user.value.end_time = dateData.value.time2
})

// 取得跑馬燈列表
const marqueeData = ref([])
const getData = async () => {
  const { data } = await handleMarqueeApi('get')
  if (data.code !== 200) return
  marqueeData.value = data.data.data.sort((a, b) => a.order - b.order)
}

// 搜尋
const search = async () => {
  await getData()
  if (searchType.value === '全部') return
  marqueeData.value = marqueeData.value.filter((item) => item.type === searchType.value)
}

// 驗證
const { required } = validatorStore
const rules = reactive({
  frequency: [required()],
  content: [required()],
  start_time: [required()],
  agentType: [required()]
})

// 關閉創建和編輯跑馬燈彈窗
const closeModal = (formEl) => {
  marqueeModal.value = false
  user.value = {}
  if (formEl) formEl.resetFields()
}

// 新創和編輯跑馬燈
const dateChoose = ref(null)
const handleMarquee = (status, data) => {
  modalStatus.value = status
  marqueeModal.value = true
  agentTotal.value = treeTotal.value.filter((item) => item.level === 1)
  if (status === 'edit') {
    nextTick(() => {
      if (!data.row.start_time) return
      dateChoose.value.changeDate(data.row.start_time, data.row.end_time)
    })
    user.value = JSON.parse(JSON.stringify(data.row))
    user.value.order = data.$index
    user.value.frequency = frequency.value[user.value.frequency]
  }
}

// 儲存
const save = async (formEl) => {
  if (formEl) {
    const valid = await formEl.validate((valid) => valid)
    if (!valid) return
  }
  const { account, agent_id: id } = loginStore.loginData.userData
  user.value.agent_id = user.value.agentType ? user.value.agentType : id
  user.value.delete = false
  if (modalStatus.value === 'add') {
    user.value.id = -1
    marqueeData.value.push(user.value)
  } else {
    marqueeData.value[user.value.order] = user.value
  }
  if (typeof user.value.frequency === 'string') {
    const val = Object.values(frequency.value).findIndex((item) => item === user.value.frequency)
    user.value.frequency = Number(Object.keys(frequency.value)[val])
  }
  user.value.last_editor = account
  const time = new Date(moment().format('YYYY-MM-DD HH:mm:ss').replace(' ', 'T')).toISOString()
  user.value.update_time = time
  user.value.lasteditor = account
  const senddatas = { newsticker: user.value }
  if (modalStatus.value === 'add') {
    // 新增 不戴ID
    senddatas.newsticker.id = 0
  }
  const { data } = await handleMarqueeApi('put', { newsticker: marqueeData.value }, user.value.order, modalStatus.value)
  if (data.code !== 200) return
  searchType.value = '全部'
  await getData()
  await closeModal(formEl)
  dateData.value = {}
  if (modalStatus.value === 'add') return openMsg({ content: t('創建成功') })
  openMsg({ content: t('編輯成功') })
}

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const modalWidth = computed(() => (wh.value === 'xl' ? '700px' : wh.value === 'lg' ? '400px' : '95%'))
const mobileWidth = computed(() => wh.value === 'sm')
</script>

<style lang="scss" scoped>
.searchGroup {
  margin-bottom: 0;
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

:deep .datePicker {
  margin-bottom: 0 !important;
}
</style>
