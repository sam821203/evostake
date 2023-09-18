<template>
  <section>
    <h2>{{ $t("站內信列表") }}</h2>
    <DateChoose @getDate="getDate" :newDate="newDate">
      <template #search>
        <el-button :type="dateExist ? 'primary' : 'warning'" @click="search(1)">{{ $t("搜尋") }}</el-button>
        <el-button type="primary" v-if="supermaster || cadre|| control" @click="addstationMsgModal = true">{{ $t("新增站內信") }}</el-button>
      </template>
    </DateChoose>
    <div class="page">
      <!-- {{ $t('玩家登入資訊') }} -->
      <Pagination :totalPage="totalPlayerPage" :currentPage="currentPlayerPage" @changePage="getCurPage" />
    </div>
    <div class="table" :style="{ height: resultData.length === 0 ? '115px' : '650px' }">
      <el-table
        :data="resultData"
        border
        style="width: 100%"
        :height="resultData.length === 0 ? '115px' : '650px'"
        :empty-text="$t('無資料')"
        :data-name="$t('概括總計')"
      >
        <el-table-column :label="$t('發送時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.send_time"></span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('發送對象')" align="center">
          <template #default="scope">
            <span v-if="scope.row.send_type === 2">{{ $t("全部玩家") }}</span>
            <span v-else-if="scope.row.send_type === 4">{{ $t("活躍玩家") }}</span>
            <template v-else>
              <span v-if="scope.row.send_type===0">{{$t('玩家帳號_mail')}}:</span>
              <span v-if="scope.row.send_type===1">{{$t('代理帳號_mail')}}:</span>
              <span v-if="scope.row.send_type===3">{{$t('VIP等級')}}:</span>
              {{ arrayToStr(scope.row.recipient) }}
            </template>
          </template>
        </el-table-column>
        <el-table-column :label="$t('站內信標題')" align="center">
          <template #default="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('站內信內容')" align="center" width="200px">
          <template #default="scope">
            <span>{{ disableHtml(scope.row.content)  }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('狀態')" align="center">
          <template #default="scope">
            <span v-if="scope.row.status === 0">{{ $t("未發送") }}</span>
            <span v-if="scope.row.status === 1" style="color: green;">{{ $t("已發送") }}</span>
            <span v-if="scope.row.status === 2" style="color: red;">{{ $t("取消") }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="last_edit_by" :label="$t('最後編輯')" align="center"> </el-table-column>
        <el-table-column :label="$t('最後編輯時間')" align="center">
          <template #default="scope">
            <span v-time="scope.row.last_edit_time"></span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="280px">
          <template #header>{{ $t("操作") }}</template>
          <template #default="scope">
            <!-- {{ scope.row }} -->
            <div style="display: flex; justify-content: space-around">
              <el-button type="primary" class="out" v-if="scope.row.status == 0 && !kefu && !watcher" @click="cancelSend(scope.row.id)">{{
                $t("取消發送")
              }}</el-button>
              <el-button type="primary" v-if="scope.row.status == 0  && !kefu && !watcher" @click="editMsg(scope.row)">{{ $t("編輯") }}</el-button>
              <el-button type="primary" v-if="scope.row.status != 0" @click="detailData(scope.row)">{{ $t("詳細資訊") }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <addstationMessage
      @refreshSearch="search(1)"
      :addstationMsgModal="addstationMsgModal"
      v-model:addstationMsgModal="addstationMsgModal"
    />
    <edditstationMessage
      @refreshSearch="search(1)"
      :edditstationMsgModal="edditstationMsgModal"
      v-model:edditstationMsgModal="edditstationMsgModal"
      :detaildata="user"
    />
    <detailstationMessage
      :detailstationMsgModal="detailstationMsgModal"
      v-model:detailstationMsgModal="detailstationMsgModal"
      :detaildata="user"
    />
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import useStore from '@/store/index'
import { ref, computed, watch } from 'vue-demi'
import DateChoose from '@/components/date/DateChoose'
import Pagination from '@/components/Pagination'

import { handleStationMailApi, cancelSendStationMail } from '@/api/setting'
//
import { useI18n } from 'vue-i18n'
import addstationMessage from '@/views/setting/modal/addstationMessage'
import edditstationMessage from '@/views/setting/modal/edditstationMessage'
import detailstationMessage from '@/views/setting/modal/stationMessageDetail'
const { t } = useI18n()
const { treeStore, msgStore } = useStore()
const { implement, type, params } = storeToRefs(msgStore)
const { supermaster, cadre, control, kefu, watcher } = storeToRefs(treeStore)

const dateData = ref({})
const searchDateData = ref({})

const dateExist = computed(() => Object.keys(dateData.value).length)
const getDate = (date) => {
  dateData.value = date
  searchDateData.value = date
}
const user = ref({
  // vip_level: [false, false, false, false, false]
})
watch(dateData, () => {
  user.value.start_time = dateData.value.time1
  user.value.end_time = dateData.value.time2
})
const userSendtime = ref()
watch(userSendtime, (v) => {
  user.value.send_time = new Date(v).toISOString()
})
watch(user, (v) => {
  if (v.send_time) {
    userSendtime.value = new Date(v.send_time)
  }
})
// 玩家資訊分頁器
const totalPlayerPage = ref(0)
const currentPlayerPage = ref(0)
const getCurPage = (page) => setTimeout(() => search(page))
//
const resultData = ref([])
const newDate = ref(0)
const search = async (page) => {
  currentPlayerPage.value = page
  console.log(dateData.value.time1)
  if (dateData.value.time1 === undefined) {
    return
  }
  const { data } = await handleStationMailApi('get', dateData.value, page)
  console.log(data)
  if (data.code !== 200) return
  resultData.value = data.data.mails
  if (resultData.value.length === 0) {
    msgStore.openMsg({ content: t('查無資料') })
  }
  totalPlayerPage.value = data.data.totalN
  // resultData.value.forEach(async(el) => {
  //   el.imgg = await getImg(el.picture_id)
  //   console.log(el.imgg)
  // })
}

const addstationMsgModal = ref(false) // 新增站內信狀態
const edditstationMsgModal = ref(false) // 編輯站內信狀態
const detailstationMsgModal = ref(false) // 站內信詳細資訊
// 取消發送
const cancelSend = (ids) => msgStore.openMsg({ content: `${t('確定要取消這封站內信嗎?')}`, type: 'cancelSendStationMail', params: ids })
// 彈窗訊息執行時操作(凍結解凍、重置密碼)
watch(implement, async () => {
  if (implement.value) {
    if (type.value === 'cancelSendStationMail') {
      console.log(params.value)
      const { data } = await cancelSendStationMail(params.value)
      if (data.code !== 200) return
      msgStore.openMsg({ content: t('成功!') })
      search(currentPlayerPage.value)
    }
  }
})
const detailData = (v) => {
  user.value = v
  detailstationMsgModal.value = true
}
const editMsg = (v) => {
  user.value = v
  edditstationMsgModal.value = true
}
const arrayToStr = (v) => {
  let tmp = ''
  if (v?.length > 0) {
    tmp = String(v.join(','))
  }

  return tmp
}
// 刪除html標籤
const disableHtml = (v) => {
  // const inputString = "123<456789>4556456";
  const result = v.replace(/<.*?>/g, '')
  return result
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
:deep .cell {
  // height: 200px;
  > span {
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.page {
  margin-top: 5px;
  display: flex;
  justify-content: flex-end;
}
// .textareaLabel {
//   display: flex;
//   align-items: center;
//   .tinycme {
//     margin: 0 10px 0 20px;
//   }
// }
</style>
