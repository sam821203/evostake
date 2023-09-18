<template>
  <!-- 新增站內信/編輯站內信(包含詳細資訊) -->
  <el-dialog :model-value="detailstationMsgModal" :width="modalWidth" :show-close="false" @close="closeModal()" :destroy-on-close="true">
    <template #header>
      <!-- <h2>{{ modalStatus === "add" ? $t("創建") : $t("編輯") }}{{ $t("站內信") }}</h2> -->
      <h2>{{ $t("編輯站內信") }}</h2>
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
        <el-date-picker disabled v-model="userSendtime" type="datetime" :placeholder="$t('請選擇日期')" style="margin-bottom: 8px" />
        <!-- <DateChoose @getDate="getDate2" :choose="false" ref="dateChoose" /> -->
        <!-- <el-input v-model="user.start_time" class="time" /> -->
      </el-form-item>

      <!-- <el-form-item  prop="order" v-if="groupData.level !== 0">

          <el-input v-model="user.order" />
        </el-form-item> -->
      <div style="display: flex; flex-direction: column">
        <div style="display: flex">
          <el-form-item prop="claim_frequency">
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
            <el-select v-model="user.send_type" style="width: 250px" disabled>
              <el-option :value="0" :label="$t('玩家帳號_mail')"></el-option>
              <el-option :value="1" :label="$t('代理帳號_mail')"></el-option>
              <el-option :value="2" :label="$t('全部玩家')"></el-option>
              <el-option :value="3" :label="$t('VIP等級')"></el-option>
              <el-option :value="4" :label="$t('活躍玩家')"></el-option>
            </el-select>
          </el-form-item>
          <!--  -->
          <el-form-item prop="claim_frequency" label-width="0" style="width: 500px">
            <el-input disabled v-model="userPlayerAcc" v-if="user.send_type == '0' || user.send_type == '1'" />
            <el-checkbox-group disabled v-if="user.send_type == '3'" v-model="user.recipient">
              <!-- <el-checkbox v-for="city in cities" :label="city" :key="city">{{ city }}</el-checkbox> -->
              <el-checkbox label="1">{{ $t("VIP1") }}</el-checkbox>
              <el-checkbox label="2">{{ $t("VIP2") }}</el-checkbox>
              <el-checkbox label="3">{{ $t("VIP3") }}</el-checkbox>
              <el-checkbox label="4">{{ $t("VIP4") }}</el-checkbox>
              <el-checkbox label="5">{{ $t("VIP5") }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <!-- <div v-if="groupData.level !== 0" v-show="user.send_type == '0'">
          <input type="file" accept=".xlsx" @change="getxml($event, 'avatar')" class="uppic" />
        </div> -->
        <el-form-item class="title" :label="$t('站內信標題')" prop="title">
          <el-input v-model="user.title" disabled/>
        </el-form-item>
      </div>

      <el-form-item class="textarea title" prop="content" label-width="auto">
        <template #label>
          <div class="textareaLabel">
            <p>{{ $t("站內信內容") }}</p>
          </div>
        </template>
        <TinycmeEditor v-model="user.content" disabled/>
      </el-form-item>
      <div class="btnGroup">
        <!-- <el-button type="danger" @click="closeModal()">{{ $t("取消") }}</el-button> -->
        <el-button type="danger" @click="closeModal()">{{ $t("確認") }}</el-button>
        <!-- <el-button type="primary" @click="save(ruleFormRef)">{{ $t("確認") }}</el-button> -->
      </div>
    </el-form>
  </el-dialog>
</template>

<script setup>
import useStore from '@/store/index'
import { ref, computed, inject, reactive, watch, toRefs } from 'vue-demi'
import TinycmeEditor from '@/components/Tinymce'
import { formatTimeZone } from '@/utils/useConvertTimeZone'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()
const props = defineProps({
  detailstationMsgModal: {
    default: false,
    type: Boolean
  },
  detaildata: Object
})
const { detaildata } = toRefs(props)
const user = ref({})
watch(detaildata, (v) => {
  user.value = v
  userSendtime.value = new Date(formatTimeZone(v.send_time, false))
  if (user.value.send_type === 3) {
    user.value.vip_level = user.value.recipient
  } else {
    userPlayerAcc.value = String(v.recipient.join(','))
  }
})
const emit = defineEmits(['update:detailstationMsgModal'])
const closeModal = () => {
  emit('update:detailstationMsgModal', false)
}
//

const { validatorStore } = useStore()

const ruleFormRef = ref()

const userSendtime = ref()
//
const dataArray = ref([])

watch(dataArray, (v) => {
  userPlayerAcc.value = String(v.join(','))
})
// 玩家帳號
const userPlayerAcc = ref()

const { clientWidth: wh } = inject('clientWidth')
const modalWidth = computed(() => (wh.value === 'xl' ? '1000px' : wh.value === 'lg' ? '400px' : '95%'))

const { required, customize } = validatorStore
const rules = reactive({
  title: [required()],
  order: [required()],
  // img: [required()],
  content: [required()],
  send_time: [required()],
  type: [required(), customize('checkLength')]
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
:deep .tox-sidebar-wrap{
  background: gray;
}
</style>
