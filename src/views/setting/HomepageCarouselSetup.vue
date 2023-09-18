<template>
  <section>
    <h2>{{ $t('首頁輪播圖工具') }}</h2>
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t('搜尋') }}</el-button>
        <el-button :type="'primary'" @click="showBannerDialog(scope, 'add')">{{ $t('新增輪播圖') }}</el-button>
      </template>
    </DateChoose>
  </section>
  <!-- <div v-if="!bannerList">
    <p>無資料</p>
  </div> -->
  <!-- <section> -->
  <h2 class="page">
    <h1></h1>
    <Pagination :pageSize="100" :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
  </h2>
  <div class="table" :style="{ height: bannerList === null ? '115px' : '620px' }">
    <el-table :data="bannerList" border style="width: 100%" :height="bannerList === null ? '115px' : '620px'" :empty-text="$t('無資料')">
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
      <el-table-column prop="123" :label="$t('輪播圖片')" align="center" style="width: 20%">
        <template #default="scope">
          <img :src="scope.row.imgg?.imgg" style="width: 100%; object-fit: contain" />
          <span v-show="false">{{ scope.row.imgg?.imggFile }}</span>
          <!-- <img :src="images.avatar ? images.avatar : require('@/assets/add.png')" alt="" :class="{ add: !images.avatar }" /> -->
        </template>
      </el-table-column>
      <el-table-column prop="url" :label="$t('連結網址')" align="center"> </el-table-column>
      <el-table-column prop="last_editor" :label="$t('最後編輯')" align="center"> </el-table-column>
      <el-table-column :label="$t('操作')" align="center">
        <template #default="scope">
          <el-button type="primary" @click="showBannerDialog(scope, 'edit')">{{ $t('編輯') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

  <el-dialog
    :model-value="addBannerDialog"
    :width="modalWidth"
    :show-close="false"
    @close="closeModal(ruleFormRef)"
    :destroy-on-close="true"
  >
    <template #header>
      <h2>{{ $t(`${bannerType}輪播圖`) }}</h2>
    </template>
    <el-form ref="ruleFormRef" :model="user" :rules="rules" label-width="150px" label-position="left">
      <el-form-item class="title" :label="$t('輪播圖起訖時間')" prop="start_time">
        <DateChoose @getDate="getDates" :choose="false" ref="dateChoose" />
        <el-input v-model="user.start_time" class="time" v-show="false" />
      </el-form-item>
      <el-form-item :label="$t('排序')" prop="order">
        <el-input v-model="user.order" />
      </el-form-item>
      <el-form-item :label="$t('連結網址')" prop="url">
        <el-input v-model="user.url" />
      </el-form-item>
      <el-form-item :label="$t('輪播圖片')" prop="pic">
        <img :src="user.imgg?.imgg ? user.imgg?.imgg : require('@/assets/add.png')" alt="" :class="{ add: !images.avatar }" />
        <input type="file" accept="image/png" @change="changeImage($event)" class="uppic" />
      </el-form-item>
      <div class="btnGroup">
        <el-button type="danger" @click="closeModal(ruleFormRef)">{{ $t('取消') }}</el-button>
        <el-button type="primary" @click="save(ruleFormRef)">{{ $t('確認') }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { ref, watch, reactive, nextTick } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import useStore from '@/store/index'
import { getBannersApi, getBannersPicApi, uploadBannerDataApi, uploadBannerPicApi } from '@/api/setting'
import Pagination from '@/components/Pagination'
const { validatorStore } = useStore()

const totalPage = ref(0)
const currentPage = ref(0)
const getCurPage = (page) => search(page)

const bannerList = ref(null)
const bannerType = ref()
// 新增/修改資訊
const { required } = validatorStore
const rules = reactive({
  order: [required()],
  start_time: [required()],
  pic: [required()]
})

// 取得所有輪播圖
const getBanners = async (page = 1) => {
  // page
  const { data } = await getBannersApi(startTime.value, endTime.value, currentPage.value, page)
  totalPage.value = data.data.data.total // 多少筆
  // currentPage.value = page
  bannerList.value = data.data.data.data
  if (bannerList.value == null) {
    return
  }

  for (let i = 0; i < bannerList.value.length; i++) {
    const el = bannerList.value[i]
    bannerList.value[i].imgg = {
      imgg: '',
      imggFile: ''
    }
    await getBannerPics(el.picture_id, i)
  }
}

// const bannersPicRes = ref([])
const getBannerPics = async (id, i) => {
  const { data } = await getBannersPicApi(id)
  const reader = new FileReader()
  const imgs = {}
  reader.readAsDataURL(data)
  reader.onload = () => {
    imgs.imgg = reader.result
    imgs.imggFile = data
    bannerList.value[i].imgg = imgs
  }
}

// 日期
const dateData = ref({})
const dateExist = ref(false)
const startTime = ref(null)
const endTime = ref(null)
const user = ref({
  start_time: ''
})
const getDate = (date) => {
  console.log(date)

  dateData.value = date
}
watch(dateData, (val) => {
  startTime.value = dateData.value.time1
  endTime.value = dateData.value.time2
  if (val) {
    dateExist.value = true
  } else {
    dateExist.value = false
  }
  if (val.time1 === '') {
    dateExist.value = false
  }
})
watch(
  () => user.value.order,
  (afterVal, beforeVal) => {
    if (Number(afterVal) / 1 !== Number(afterVal) || Number(afterVal) > 99 || Number(afterVal) < 0) {
      user.value.order = beforeVal
    }
  }
)
//
const dateDatas = ref({})
const newDate = ref(null)
const getDates = (date) => (dateDatas.value = date)
watch(dateDatas, () => {
  user.value.start_time = dateDatas.value.time1
  user.value.end_time = dateDatas.value.time2
})
// 新增輪播圖彈窗控制
const closeModal = (formEl) => {
  addBannerDialog.value = false
  images.value.avatar = ''
  images.value.avatarFile = ''
  user.value = {}
  if (formEl) formEl.resetFields()
}
const addBannerDialog = ref(false)
const modalStatus = ref('') // 區分是編輯或是新增
const dateChoose = ref(null)
const showBannerDialog = async (data, status) => {
  addBannerDialog.value = true
  modalStatus.value = status
  // const obj = {}
  if (status === 'add') {
    bannerType.value = '新增'
    user.value = {
      end_time: '',
      imgg: {
        imgg: '',
        imggFile: ''
      },
      order: 1,
      start_time: '',
      url: ''
    }
  } else {
    bannerType.value = '編輯'
    user.value = JSON.parse(JSON.stringify(data.row))
    nextTick(() => {
      if (!data.row.start_time) return
      dateChoose.value.changeDate(data.row.start_time, data.row.end_time)
    })
  }
}

// 搜尋
const search = async (page) => {
  // 空=>undefined
  currentPage.value = page
  await getBanners(page)
}

// 選擇圖片
const images = ref({})
const changeImage = (e) => {
  const file = e.target.files[0]
  const reader = new FileReader()
  if (file) {
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      // console.log(e.target.result)
      // console.log(file)
      user.value.imgg.imgg = e.target.result
      user.value.imgg.imggFile = file
    }
  }
}

// 上傳
const save = async (formEl) => {
  if (formEl) {
    const valid = await formEl.validate((valid) => valid)
    if (!valid) return
  }
  const uploadDataRes = await uploadBannerDataApi({
    // 0529
    order: Number(user.value.order),
    start_time: user.value.start_time,
    end_time: user.value.end_time,
    url: user.value.url,
    ID: user.value.id,
    picture_id: user.value.picture_id
  })
  const bannerPicData = new FormData()
  // user.value.picture_id
  bannerPicData.append('picture_id', uploadDataRes.data.data.pid)
  bannerPicData.append('picture', user.value.imgg.imggFile)
  await uploadBannerPicApi(bannerPicData)
  closeModal()
  if (modalStatus.value === 'add') {
    // 新增的的話，若沒設日期，預設日期為今天
    // dateData.value
    newDate.value = 0
  }

  search(currentPage.value)
}
</script>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
img {
  width: 100%;
  height: 100%;
  background: white;
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
table {
  border-collapse: collapse !important;
}
</style>
