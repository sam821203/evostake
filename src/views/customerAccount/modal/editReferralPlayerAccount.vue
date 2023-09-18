<template>
  <el-dialog :model-value="editReferralPlayerAccountModal" :width="700" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <div class="info">
        <h2 style="border: none; padding: 0">{{ $t('推薦玩家帳號') }}</h2>
      </div>
    </template>
    <div class="searchGroup">
      <el-select v-model="account">
        <!-- <el-option :label="$t('所有等級')" value="all" /> -->
        <div style="padding: 5px">
          <el-input v-model="searchAcc" @input="changefriendAccList" />
        </div>
        <el-option :label="v.account" :value="v.u9" v-for="(v, k) in optionList" :key="k" :disabled="v.u9 == ''" />
      </el-select>
      <!-- <el-input v-model="account" :placeholder="$t('請輸入好友帳號')" @input="changeFriends" /> -->
    </div>
    <div style="text-align: center">
      <el-button type="primary" @click="submitApi">{{ $t('確認') }}</el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue-demi'
import { getRecommendAcc, changeInviter } from '@/api/player'
const account = ref('')
const searchAcc = ref('')
const props = defineProps({
  editReferralPlayerAccountModal: Boolean,
  agentid: Number,
  u9: Number
})
const optionList = ref([])
const fiexedoptionList = ref([])

const changefriendAccList = () => {
  if (!searchAcc.value) {
    optionList.value = fiexedoptionList.value
    return
  }
  optionList.value = fiexedoptionList.value.filter((item) => item.account.match(searchAcc.value))
  if (optionList.value.length === 0) {
    optionList.value = [{ account: '無資料', u9: '' }]
    // VIP0500
  }
}
const submitApi = async () => {
  if (account.value === '') {
    return
  }
  const senddata = {
    u9: props.u9,
    inviter_u9: account.value
  }
  const { data } = await changeInviter(senddata)

  if (data.msg === 'OK') {
    emit('editReferralPlayerAccountStatus', false)
  }
  // u9
  //   inviter_u9
}
watch(
  () => props.editReferralPlayerAccountModal,
  async (v) => {
    if (v) {
      const { data } = await getRecommendAcc(props.agentid, props.u9)
      optionList.value = data.data.data
      fiexedoptionList.value = data.data.data
    } else {
      account.value = ''
    }
  }
)
// modal 開關
const emit = defineEmits(['update:editReferralPlayerAccountModal', 'editReferralPlayerAccountStatus'])
const closeModal = () => {
  emit('update:editReferralPlayerAccountModal', false)
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 240px !important;
}

.info {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid $info;
  // padding-bottom: 10px;
  margin-bottom: 10px;
  p {
    font-size: 16px;
    margin-left: 0.5rem;
  }
}

.list {
  width: 100%;
  color: black;
  span,
  p {
    font-size: 16px;
  }
  .account {
    display: flex;
    align-items: center;
    p {
      margin-left: 20px;
    }
  }
  .flex_verticalCenter {
    display: flex;
    align-items: center;
  }
  .vip {
    img {
      width: 30px;
      margin-right: 0.5rem;
      object-fit: contain;
    }
    p {
      font-weight: 600;
      font-size: 14px;
      color: red;
      margin: 0;
      display: inline-block;
    }
  }
}

.noData {
  text-align: center;
  margin-top: 30px;
}
</style>
