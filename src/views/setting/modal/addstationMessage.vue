<template>
  <!-- 新增站內信/編輯站內信(包含詳細資訊) -->
  <el-dialog :model-value="addstationMsgModal" :width="modalWidth" :show-close="false" @close="closeModal()" :destroy-on-close="true">
    <template #header>
      <!-- <h2>{{ modalStatus === "add" ? $t("創建") : $t("編輯") }}{{ $t("站內信") }}</h2> -->
      <h2>{{ $t("新增站內信") }}</h2>
    </template>
    <el-form ref="ruleFormRef" :model="user" :rules="rules" label-width="150px" label-position="left">
      <el-form-item class="title" :label="$t('發送時間')" prop="send_time">
        <template #label>
          <span>{{ $t("發送時間") }}</span>
          <el-popover placement="bottom" width="auto" trigger="hover">
            <ul class="formula" :class="{ isEn }">
              <li>
                <span>{{ $t("不填時間表示立即發送") }}</span>
              </li>
            </ul>
            <template #reference>
              <el-icon :size="25"><InfoFilled color="#ad8d60" /></el-icon>
            </template>
          </el-popover>
        </template>
        <el-date-picker  v-model="userSendtime" type="datetime" :placeholder="$t('請選擇日期')" style="margin-bottom: 8px" />
        <!-- <DateChoose @getDate="getDate2" :choose="false" ref="dateChoose" /> -->
        <!-- <el-input v-model="user.start_time" class="time" /> -->
      </el-form-item>

      <!-- <el-form-item  prop="order" v-if="groupData.level !== 0">

          <el-input v-model="user.order" />
        </el-form-item> -->
      <div style="display: flex; flex-direction: column">
        <div style="display: flex">
          <el-form-item prop="send_type">
            <template #label>
              <span>{{ $t("發送對象") }}</span>
              <el-popover placement="bottom" width="auto" trigger="hover">
                <ul class="formula" :class="{ isEn }">
                  <li>
                    <span>{{ $t("輸入帳號時，若有複數對象請用,分隔") }}</span>
                  </li>
                </ul>
                <template #reference>
                  <el-icon :size="25"><InfoFilled color="#ad8d60" /></el-icon>
                </template>
              </el-popover>
            </template>
            <!-- 0814 -->
            <el-select v-model="user.send_type" style="width: 250px">
              <el-option :value="0" :label="$t('玩家帳號_mail')"></el-option>
              <el-option :value="1" :label="$t('代理帳號_mail')"></el-option>
              <el-option :value="2" :label="$t('全部玩家')"></el-option>
              <el-option :value="3" :label="$t('VIP等級')"></el-option>
              <el-option :value="4" :label="$t('活躍玩家')"></el-option>
            </el-select>
          </el-form-item>
          <!--  -->
          <el-form-item prop="userPlayerAcc" label-width="0" style="width: 500px" v-if="user.send_type == '0' || user.send_type == '1'">
            <el-input  type="textarea" v-model="user.userPlayerAcc"  />
          </el-form-item>
          <!--  -->
          <el-form-item prop="vip_level" label-width="0" style="width: 500px" v-if="user.send_type == '3'">
            <el-checkbox-group  v-model="user.vip_level">
              <el-checkbox label="1">{{ $t("VIP1") }}</el-checkbox>
              <el-checkbox label="2">{{ $t("VIP2") }}</el-checkbox>
              <el-checkbox label="3">{{ $t("VIP3") }}</el-checkbox>
              <el-checkbox label="4">{{ $t("VIP4") }}</el-checkbox>
              <el-checkbox label="5">{{ $t("VIP5") }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <div v-if="groupData.level !== 0" v-show="user.send_type == '0'">
          <label for="fileXml" class="inportExcel">{{$t('匯入Excel')}}</label>
          <span class="redWord">{{$t('僅限匯入玩家帳號')}}</span>
          <input label="123" v-show="false" id="fileXml" type="file" accept=".xlsx" @change="getxml($event, 'avatar')" class="uppic" />
        </div>
        <el-form-item class="title" :label="$t('站內信標題')" prop="title">
          <el-input v-model="user.title" />
        </el-form-item>
      </div>

      <el-form-item class="textarea title" prop="content" label-width="auto">
        <template #label>
          <div class="textareaLabel">
            <p>{{ $t("站內信內容") }}</p>
          </div>
        </template>
        <TinycmeEditor v-model="user.content" />
      </el-form-item>
      <div class="btnGroup">
        <el-button type="danger" @click="closeModal()">{{ $t("取消") }}</el-button>
        <el-button @click="save(ruleFormRef)" :type="dateExist ? 'primary' : 'warning'">{{ $t("確認") }}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import XLSX from 'xlsx'
import useStore from '@/store/index'
import { ref, computed, inject, reactive, watch, toRefs } from 'vue-demi'
import TinycmeEditor from '@/components/Tinymce'
import { handleStationMailApi } from '@/api/setting'
import { formatTimeZone, toLocaleString } from '@/utils/useConvertTimeZone'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
const props = defineProps({
  addstationMsgModal: {
    default: false,
    type: Boolean
  },
  detailData: Object
})
const { addstationMsgModal } = toRefs(props)
const emit = defineEmits(['update:addstationMsgModal', 'refreshSearch'])
const closeModal = () => {
  emit('update:addstationMsgModal', false)
  // user.value = {}
}
//

const { validatorStore, treeStore } = useStore()

const ruleFormRef = ref()

const user = reactive({})

const userSendtime = ref()
watch(userSendtime, (v) => {
  if (v !== '') {
    user.send_time = new Date(v)?.toISOString()
  }
})
watch(addstationMsgModal, (v) => {
  if (v) {
    // user = {
    //   send_type: 1,
    //   userPlayerAcc: ''
    // }
    userSendtime.value = ''
    user.send_time = ''
    user.send_type = 0
    user.userPlayerAcc = ''
    user.vip_level = []
    user.title = ''
    user.content = ''
  }
// send_type
})

// 獲取xml
// const parseSheet = (sheet) => {
//   const dataArray = []
//   // 使用 Object.keys() 方法獲取對象的所有屬性名稱
//   const cellAddresses = Object.keys(sheet)
//   for (const cellAddress of cellAddresses) {
//     const cell = sheet[cellAddress]
//     const cellValue = cell.v
//     if (!isNaN(cellValue)) {
//       dataArray.push(cellValue)
//     }
//   }
//   return dataArray
// }
//
const dataArray = ref([])
const getxml = (e, type) => {
  const file = e.target.files[0]
  // const reader = new FileReader()
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      dataArray.value = []
      // 假設您要解析第一個工作表
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      for (const k in sheet) {
        if (sheet[k]?.v !== undefined) {
          dataArray.value.push(sheet[k]?.v)
        }
      }
      // sheet.forEach(element => {
      //   console.log(element)
      // })
      // 解析工作表的數據並轉換為數字陣列
      // dataArray.value = parseSheet(sheet)
    }
    reader.readAsArrayBuffer(file)
  }
}
watch(dataArray, (v) => {
  const xmldata = String(v.join(','))
  if (user.userPlayerAcc === ' ' || user.userPlayerAcc === '') {
    user.userPlayerAcc += `${xmldata}`
  } else {
    user.userPlayerAcc += `,${xmldata}`
  }
})

const { clientWidth: wh } = inject('clientWidth')
const modalWidth = computed(() => (wh.value === 'xl' ? '1000px' : wh.value === 'lg' ? '400px' : '95%'))

const { groupData } = storeToRefs(treeStore)

const { required, customize } = validatorStore
const rules = reactive({
  title: [required()],
  order: [required()],
  content: [required()],
  send_type: [required()],
  vip_level: [required()],
  userPlayerAcc: [required()],
  type: [required(), customize('checkLength')]
})
const save = async (formEl) => {
  // 驗證沒過就停止
  if (!dateExist.value) {
    return
  }
  if (formEl) {
    const valid = await formEl.validate((valid) => valid)
    if (!valid) return
  }

  if (user.send_type === 3) {
    user.recipient = user.vip_level
  } else {
    user.recipient = user.userPlayerAcc?.split(',')
  }

  if (user.send_time === '') {
    user.send_time = formatTimeZone(new Date().toISOString(), false)
  } else if (toLocaleString(user.send_time) < toLocaleString()) {
    user.send_time = formatTimeZone(new Date().toISOString(), false)
  }
  // console.log(user.content)
  // src="http://192.168.88.212/picture
  user.content = user.content.replace('src="../picture/mail', `src="${process.env.VUE_APP_LINK}/picture/mail`)
  const { data } = await handleStationMailApi('post', user)
  console.log(data)
  if (data.code === 200) {
    emit('refreshSearch')
    closeModal()
  }
}
//
const dateExist = ref(false)

watch(user, (v) => {
  let num = 0
  if (v.title === '') { num++ }
  if (v.content === '') { num++ }
  if (v.send_type === '') {
    num++
  } else {
    if (user.send_type === '3') {
      if (user.vip_level === '') {
        num++
      }
    }
    if (user.send_type === '0' || user.send_type === '1') {
      if (user.userPlayerAcc === '') {
        num++
      }
    }
  }
  // if (v.send_time === '') { num++ }
  if (num > 0) {
    dateExist.value = false
  } else {
    dateExist.value = true
  }
})
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
// :deep .el-form-item__error{
//     &:first-child {
//         margin-top: 1rem !important;
//     }
//     margin-top: 1rem !important;
// }
.inportExcel{
background: rgba($color: #EFEFEF, $alpha: 1.0);
color: black;
border: 1px solid black;
padding: 0 5px;
font-size: 12px;
}
.redWord{
  color: red;
  margin-left: 1rem;
}
</style>
