<template>
  <section>
    <h2>{{ $t('活動公告') }}</h2>
    <!-- id/picture_id/picture -->
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
        <el-button type="primary" v-if="supermaster || cadre" @click="handleAnnouncement(scope, 'add')">{{
          $t('新增活動公告')
        }}</el-button>
      </template>
    </DateChoose>
    <div class="table" :style="{ height: resultData.length === 0 ? '115px' : '650px' }">
      <el-table
        :data="resultData"
        border
        style="width: 100%"
        :height="resultData.length === 0 ? '115px' : '650px'"
        :empty-text="$t('無資料')"
        :data-name="$t('概括總計')"
      >
        <el-table-column :label="$t('開始時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.start_time"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('結束時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.end_time"></span>
          </template>
        </el-table-column>
        <el-table-column prop="order" :label="$t('排序')" align="center"> </el-table-column>
        <el-table-column prop="title" :label="$t('標題')" align="center"> </el-table-column>
        <el-table-column prop="123" :label="$t('活動圖片')" align="center">
          <template #default="scope">
            <img :src="scope.row.imgg" style="width: 200px; object-fit: contain" />
          </template>
        </el-table-column>
        <el-table-column prop="lasteditor" :label="$t('最後編輯')" align="center"> </el-table-column>
        <el-table-column :label="$t('操作')" align="center" v-if="supermaster || cadre">
          <!-- <template #default="scope">
            <span v-time="scope.operate"></span>
          </template> -->
          <template #default="scope">
            <el-button type="primary" @click="handleAnnouncement(scope, 'edit')">{{ $t('編輯') }}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="transfer_type" :label="$t('異動內容')" align="center">
            <template #default="scope">
              <span>{{ type(scope.row.transfer_type) ? type(scope.row.transfer_type) : scope.row.transfer_type }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="before_money" :label="$t('異動前分數')" align="center">
            <template #default="scope">
              <span v-money="scope.row.before_money / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" :label="$t('異動分數')" align="center">
            <template #default="scope">
              <span v-money="scope.row.amount / 10000"></span>
            </template>
          </el-table-column>
          <el-table-column prop="after_money" :label="$t('異動後分數')" align="center">
            <template #default="scope">
              <span v-money="scope.row.after_money / 10000"></span>
            </template>
          </el-table-column> -->
      </el-table>
    </div>

    <el-dialog
      :model-value="announcementModal"
      :width="modalWidth"
      :show-close="false"
      @close="closeModal(ruleFormRef)"
      :destroy-on-close="true"
    >
      <template #header>
        <h2>{{ modalStatus === 'add' ? $t('創建') : $t('編輯') }}{{ $t('活動公告') }}</h2>
      </template>
      <el-form ref="ruleFormRef" :model="user" :rules="rules" label-width="150px" label-position="left">
        <el-form-item class="title" :label="$t('公告起訖時間')" prop="start_time">
          <DateChoose @getDate="getDate2" :choose="false" ref="dateChoose" />
          <el-input v-model="user.start_time" class="time" />
        </el-form-item>
        <el-form-item :label="$t('排序')" prop="order" v-if="groupData.level !== 0">
          <el-input v-model="user.order" />
        </el-form-item>
        <el-form-item :label="$t('活動標題')" prop="title" v-if="groupData.level !== 0">
          <el-input v-model="user.title" />
        </el-form-item>

        <el-form-item :label="$t('活動圖片')" v-if="groupData.level !== 0">
          <div class="avatar">
            <p v-show="!images.avatar">{{ $t('活動圖片') }}</p>
            <img :src="images.avatar ? images.avatar : require('@/assets/add.png')" alt="" :class="{ add: !images.avatar }" />
            <input type="file" accept="image/png" @change="changeImage($event, 'avatar')" class="uppic" />
            <!-- image/jpeg,image/jpg, -->
          </div>
        </el-form-item>

        <el-form-item class="textarea title" prop="content" label-width="auto">
          <template #label>
            <div class="textareaLabel">
              <p>{{ $t('活動內容') }}</p>
              <!-- <p class="tinycme">切換背景色</p>
              <el-radio-group v-model="tinycmeBg">
                <el-radio label="transparent" size="large">{{ $t('黑色') }}</el-radio>
                <el-radio label="white" size="large">{{ $t('白色') }}</el-radio>
              </el-radio-group> -->
            </div>
          </template>
          <TinycmeEditor v-model="user.content" />
        </el-form-item>
        <div class="btnGroup">
          <el-button type="danger" @click="closeModal(ruleFormRef)">{{ $t('取消') }}</el-button>
          <el-button type="primary" @click="save(ruleFormRef)">{{ $t('確認') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import useStore from '@/store/index'
import { ref, computed, nextTick, inject, reactive, watch } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import TinycmeEditor from '@/components/Tinymce'
import { handleActAnnouncementApi, getAnoucementImg, handleActAnnouncementPICApi } from '@/api/setting'
//
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { validatorStore, treeStore, msgStore } = useStore()
const { supermaster, cadre } = storeToRefs(treeStore)

const dateData = ref({})
const searchDateData = ref({})
const ruleFormRef = ref()
const dateExist = computed(() => Object.keys(dateData.value).length)
const getDate = (date) => {
  dateData.value = date
  searchDateData.value = date
}
const getDate2 = (date) => {
  dateData.value = date
}
watch(dateData, () => {
  user.value.start_time = dateData.value.time1
  user.value.end_time = dateData.value.time2
})
const resultData = ref([])
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
// import { getRankingApi } from '@/api/activity'
const newDate = ref(0)
const search = async () => {
  if (modalStatus.value === 'edit') {
    dateData.value = searchDateData.value
  }
  const { data } = await handleActAnnouncementApi('get', dateData.value)

  if (data.code !== 200) return
  resultData.value = data.data.event
  if (resultData.value.length === 0) {
    msgStore.openMsg({ content: t('查無資料') })
  }

  let i = 0
  while (i < resultData.value.length) {
    await getImg(resultData.value[i].picture_id, i)
    i++
  }
}
const getImg = async (PID, i) => {
  const { data } = await getAnoucementImg(PID)
  // if (data === undefined) return
  const reader = new FileReader()
  let imgg
  if (data.type.indexOf('json') === -1) {
    reader.readAsDataURL(data)
    reader.onload = () => {
      imgg = reader.result
      // imgg = reader.result.toDataURL()
      resultData.value[i].imgg = imgg
      // return imgg
    }
  }
}
// 創建和編輯公告
const { clientWidth: wh } = inject('clientWidth')
const modalWidth = computed(() => (wh.value === 'xl' ? '1000px' : wh.value === 'lg' ? '400px' : '95%'))
// const mobileWidth = computed(() => wh.value === 'sm')

// const { treeStore } = useStore();
const { groupData } = storeToRefs(treeStore)

const user = ref({})
const dateChoose = ref(null)
const announcementModal = ref(false)
const modalStatus = ref('') // 區分是編輯或是新增公告
// 0214
const handleAnnouncement = async (data, status) => {
  announcementModal.value = true
  modalStatus.value = status
  const obj = {}
  if (status === 'add') return
  // 把圖片引入
  const imgdatas = await getAnoucementImg(data.row.picture_id)

  const reader = new FileReader()
  reader.readAsDataURL(imgdatas.data)
  reader.onload = () => {
    images.value.avatar = reader.result
    images.value.avatarFile = imgdatas.data
  }
  // images.value.avatar =
  Object.keys(data.row).forEach((item) => {
    obj[item] = data.row[item] !== '0001-01-01T00:00:00Z' ? data.row[item] : ''
  })
  nextTick(() => {
    if (!obj.start_time) return
    dateChoose.value.changeDate(obj.start_time, obj.end_time)
  })
  user.value = obj
  user.value.order = data.$index
}
const { required, customize } = validatorStore
const rules = reactive({
  title: [required()],
  order: [required()],
  // img: [required()],
  content: [required()],
  start_time: [required()],
  type: [required(), customize('checkLength')]
})
const closeModal = (formEl) => {
  announcementModal.value = false
  images.value.avatar = ''
  images.value.avatarFile = ''
  user.value = {}
  if (formEl) formEl.resetFields()
  // user
}
const save = async (formEl) => {
  // 驗證沒過就停止
  if (formEl) {
    const valid = await formEl.validate((valid) => valid)
    if (!valid) return
  }
  user.value.order = Number(user.value.order)
  user.value.update_time = new Date().toISOString()
  const textdata = { announcement: [user.value] }
  // textdata.announcement.value.update_time = new Date().toISOString()
  const { data } = await handleActAnnouncementApi('post', dateData.value, textdata)
  const anoucementPICdata = new FormData()
  anoucementPICdata.append('picture_id', data.data.pid)
  anoucementPICdata.append('picture', images.value.avatarFile)
  await handleActAnnouncementPICApi(anoucementPICdata)
  closeModal()
  if (modalStatus.value === 'add') {
    newDate.value = 0
  }
  //
  search()
}
</script>

<style lang="scss" scoped>
.table {
  margin-top: 10px;
  //   box-sizing: content-box;
}
.time {
  opacity: 0;
  position: absolute;
  z-index: -1;
  top: 0;
}
.avatar {
  width: 100%;
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
// :deep .datePicker {
//   margin-bottom: 0 !important;
// }

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

// .textareaLabel {
//   display: flex;
//   align-items: center;
//   .tinycme {
//     margin: 0 10px 0 20px;
//   }
// }
</style>
