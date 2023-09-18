<template>
  <section>
    <h2 v-if="!mobileWidth">{{ $t("玩家資訊") }}</h2>
    <div class="player" :class="{ flexWrap: searchType !== 0 }">
      <div class="searchGroup">
        <el-select v-model="searchType" :class="{ all: !searchType }">
          <el-option :label="$t('全部玩家')" :value="0" />
          <el-option :label="$t('新註冊玩家')" :value="6" />
          <el-option :label="$t('玩家ID')" :value="1" />
          <el-option :label="$t('玩家帳號')" :value="2" />
          <el-option :label="$t('手機號碼')" :value="7" />
          <el-option :label="$t('真實姓名')" :value="3" />
          <el-option :label="$t('玩家暱稱')" :value="4" />
          <el-option :label="$t('身分證')" :value="5" />
          <el-option v-if="groupData.level < 2" :label="$t('所屬代理')" :value="11" />
        </el-select>
        <DateChoose @getDate="getDate" :button="false" v-if="!mobileWidth && searchType === 6" />
        <el-input v-model="searchStr" v-show="searchType !== 0 && searchType !== 6" />
        <el-button :type="isLoading ? 'primary' : 'warning'" @click="search(1)">
          {{ $t("搜尋") }}
          <i v-show="loading" class="fas fa-spinner fa-spin"></i>
        </el-button>
        <el-button :type="isLoading ? 'primary' : 'warning'" @click="exportExcelModal = true" v-if="!treeStore.checkAgent(['一級代理', '二級代理', '三級代理', '四級代理', '五級代理'])">
          Excel
          <i v-show="loading" class="fas fa-spinner fa-spin"></i>
        </el-button>
        <el-dialog :width="modalWidth" v-model="exportExcelModal">
          <template #header>
            <h2>{{ $t("匯出excel") }}</h2>
          </template>
          <el-row type="flex">
            <el-checkbox v-model="accountStatus" v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '財務', '客服主管', '遊戲客服'])"
              :label="$t('玩家帳號')"></el-checkbox>
            <el-checkbox v-model="nicknameStatus" v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '財務', '客服主管', '遊戲客服'])"
              :label="$t('玩家暱稱')"></el-checkbox>
            <el-checkbox v-model="realNameStatus" v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '客服主管'])"
              :label="$t('真實姓名')"></el-checkbox>
            <el-checkbox v-model="agentAccountStatus" v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '財務', '客服主管', '遊戲客服'])"
              :label="$t('所屬代理')"></el-checkbox>
            <el-checkbox v-model="phoneStatus" v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '客服主管'])"
              :label="$t('手機')"></el-checkbox>
            <el-checkbox v-model="vipStatus" v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '財務', '客服主管', '遊戲客服'])"
              :label="$t('VIP等級')"></el-checkbox>
            <el-checkbox v-model="balanceStatus" v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '財務', '客服主管', '遊戲客服'])"
              :label="$t('玩家餘額')"></el-checkbox>
            <el-checkbox v-model="totalChargeStatus" v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '財務', '客服主管', '遊戲客服'])"
              :label="$t('歷史總存款')"></el-checkbox>
            <el-checkbox v-model="totalConsignStatus"
              v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '財務', '客服主管', '遊戲客服'])" :label="$t('歷史總提款')"></el-checkbox>
            <el-checkbox
              v-model="totalSpecialStatus"
              v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '財務', '客服主管', '遊戲客服'])"
              :label="$t('歷史總紅利')"
            ></el-checkbox>
            <el-checkbox v-model="historyValidBetStatus"
              v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '財務', '客服主管', '遊戲客服'])" :label="$t('歷史有效投注')"></el-checkbox>
            <el-checkbox v-model="lastLoginStatus" v-if="treeStore.checkAgent(['開發商', '總代理', '幹部', '客服主管', '遊戲客服'])"
              :label="$t('最後登入時間')"></el-checkbox>
          </el-row>
          <el-row type="flex" justify="center">
            <el-button :type="isLoading ? 'danger' : 'warning'" @click="exportExcelModal = false">
              {{ $t("取消") }}
              <i v-show="loading" class="fas fa-spinner fa-spin"></i>
            </el-button>
            <el-button :type="isLoading ? 'primary' : 'warning'" @click="handleExportExcel">
              {{ $t("確認") }}
              <i v-show="loading" class="fas fa-spinner fa-spin"></i>
            </el-button>
          </el-row>
        </el-dialog>
      </div>
    </div>
    <DateChoose @getDate="getDate" :button="false" v-if="mobileWidth && searchType === 6" />
    <template v-if="!mobileWidth">
      <ul class="playerInfo">
        <li>
          {{ $t("玩家暱稱") }} : <span>{{ detailsData.nickname }}</span>
        </li>
        <li>
          {{ $t("玩家帳號") }} : <span>{{ detailsData.account }}</span>
        </li>
        <li>
          {{ $t("所屬代理") }} : <span>{{ detailsData.agentAccount }}</span>
        </li>
        <li>
          {{ $t("手機") }} :
          <span v-if="canWatchPhoneAndGCash">{{ detailsData.phone }}</span>
          <span v-else-if="detailsData.phone">**********</span>
        </li>
        <li>{{ $t("今日存款") }} : <span v-money="detailsData.history?.today.charge / 10000"></span></li>
        <li>{{ $t("今日提款") }} : <span v-money="detailsData.history?.today.consign / 10000"></span></li>
        <li>{{ $t("歷史總存款") }} : <span v-money="detailsData.history?.history.charge / 10000"></span></li>
        <li>{{ $t("歷史總提款") }} : <span v-money="detailsData.history?.history.consign / 10000"></span></li>
        <li>{{ $t("歷史總紅利") }} : <span v-money="detailsData.history?.history.special / 10000"></span></li>
        <li>
          {{ $t("玩家餘額") }} :
          <span v-if="detailsData.formal" v-money="detailsData.twd_balance / 10000"></span>
          <span v-else v-money="detailsData.wallet?.TEST.balance / 10000"></span>
        </li>
        <li>
          {{ $t("手機號數量") }} :
          <span v-if="!canWatchPhoneAndGCash && detailsData.g_cash">{{ Object.keys(detailsData.g_cash).length }}</span>
          <span class="jumpLink" v-else-if="detailsData.g_cash" @click="gCashModal = true">
            {{ Object.keys(detailsData.g_cash).length }}
          </span>
          <span v-else>0</span>
        </li>
        <li>
          {{ $t("錢包地址") }} :
          <template v-if="detailsData.wallet_address">
            <span v-omitFirst="detailsData.wallet_address"></span>
            <el-button type="primary" @click="removeWalletAddress(detailsData.pid)" v-if="groupData.level < 2">
              {{ $t("清除錢包地址") }}
            </el-button>
          </template>
          <span></span>
        </li>
        <li>
          {{ $t("目前有效流水") }} :
          <template v-if="detailsData.formal">
            <span v-if="Object.keys(detailsData).length" v-money="detailsData.wallet?.TWD.flow / 10000"></span>
          </template>
          <span v-else v-money="detailsData.wallet?.TEST.flow / 10000"></span>
        </li>
        <li>
          {{ $t("今日有效投注") }}
          <!-- <BetPopover :detailsData="detailsData" type="today" /> -->
          <span>:</span> <span v-money="detailsData.todayBet / 10000"></span>
        </li>
        <li>
          {{ $t("歷史有效投注") }}
          <!-- <BetPopover :detailsData="detailsData" type="period" /> -->
          <span>:</span> <span v-money="detailsData.history_valid_bet_win / 10000"></span>
        </li>
      </ul>
      <template v-if="Object.keys(detailsData).length">
        <div class="btnGroup">
          <div>
            <template v-if="canHandlePlayer">
              <el-button type="primary" @click="customerAccountModal = true">{{ $t("編輯玩家") }}</el-button>
              <el-button type="primary" @click="gameLogModal = true">{{ $t("遊戲紀錄") }}</el-button>
              <el-button type="primary" @click="accountChangeModal = true">{{ $t("帳變明細") }}</el-button>
            </template>
            <el-button type="primary" @click="handlePwd" v-if="canHandleResetPwd">{{ $t("重置玩家密碼") }}</el-button>
            <el-button type="primary" @click="handleTradePwd" v-if="canHandleResetPwd">{{ $t("重置交易密碼") }}</el-button>
            <template v-if="canCashInOut">
              <el-button type="primary" @click="handleCashInOut('out', totalData.formal)" class="out"
                v-if="treeStore.checkAgent(['總代理', '幹部', '財務'])">{{ $t("洗分") }}</el-button>
              <el-button type="primary" @click="handleCashInOut('in', totalData.formal)" class="in"
                v-if="treeStore.checkAgent(['總代理', '幹部', '財務'])">{{ $t("開分") }}</el-button>
              <el-button type="primary" @click="fastGiveBonusFunc()" class="in">{{ $t("快派紅利") }}</el-button>
            </template>
          </div>
          <!-- <el-button type="primary" :class="{ danger: totalData?.isfreeze }" @click="handlefreeze" v-if="canHandlePlayer">{{
            freezeText
          }}</el-button> -->
        </div>
      </template>
    </template>
  </section>
  <!-- 玩家列表 -->
  <section>
    <h2 v-if="!mobileWidth" class="playerListPage">
      {{ $t("選擇玩家") }}
      <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" :pageSize="100"/>
    </h2>
    <PlayerListTable v-if="!mobileWidth" :playerData="playerData" :avatarData="avatarData" :timeStatus="timeStatus"
      v-model:detailsData="detailsData" v-model:playDetailsModal="playDetailsModal" />
    <PlayerListCard v-else :playerData="playerData" v-model:detailsData="detailsData" :slotData="slotData"
      :timeStatus="timeStatus" ref="playerList">
      <template #removeWalletAddress>
        <li class="btn" v-if="detailsData.wallet_address && detailsData.type === 'cash' && groupData.level < 2">
          <el-button type="primary" @click="removeWalletAddress(detailsData.pid)">
            {{ $t("清除錢包地址") }}
          </el-button>
        </li>
      </template>
      <template #edit>
        <li class="btn" v-if="canHandlePlayer">
          <el-button type="primary" @click="customerAccountModal = true">{{ $t("編輯玩家") }}</el-button>
        </li>
      </template>
      <template #GameLog>
        <li class="btn">
          <el-button type="primary" @click="gameLogModal = true">{{ $t("遊戲紀錄") }}</el-button>
        </li>
      </template>
      <template #accountDetails>
        <li class="btn">
          <el-button type="primary" @click="accountChangeModal = true">{{ $t("帳變明細") }}</el-button>
        </li>
      </template>
      <template #playDetails>
        <li class="btn">
          <el-button type="primary" @click="playDetailsModal = true">{{ $t("詳細資訊") }}</el-button>
        </li>
      </template>
      <template #cashOut>
        <li class="btn">
          <el-button type="primary" @click="handleCashInOut('out', totalData.formal)" class="out">{{ $t("洗分")
          }}</el-button>
        </li>
      </template>
      <template #cashIn>
        <li class="btn">
          <el-button type="primary" @click="handleCashInOut('in', totalData.formal)" class="in">{{ $t("開分") }}</el-button>
        </li>
      </template>
      <template #fastGiveBonus>
        <li class="btn">
          <el-button type="primary" @click="fastGiveBonusFunc" class="fastGiveBonus">{{ $t("快派紅利") }}</el-button>
        </li>
      </template>

      <template #resetPwd>
        <li class="btn" v-if="canHandleResetPwd">
          <el-button type="primary" @click="handlePwd">{{ $t("重置玩家密碼") }}</el-button>
        </li>
      </template>
      <template #freeze>
        <li class="btn" v-if="canHandlePlayer">
          <el-button type="primary" :class="{ danger: totalData?.isfreeze }" @click="handlefreeze"
            v-if="canHandlePlayer">{{
              freezeText
            }}</el-button>
        </li>
      </template>
    </PlayerListCard>
    <div class="pag" v-show="mobileWidth">
      <Pagination :totalPage="totalPage" :currentPage="currentPage" @changePage="getCurPage" />
    </div>
  </section>
  <!-- 彈窗區 -->
  <CustomerAccountModal v-model:customerAccountModal="customerAccountModal" :totalData="totalData"
    :avatarData="avatarData" @updatePlayer="updatePlayer" />
  <GameLogModal v-model:gameLogModal="gameLogModal" :totalData="totalData" />
  <AccountChangeModal v-model:accountChangeModal="accountChangeModal" :totalData="totalData" />
  <!--  -->
  <PlayDetailsModal :agentid="playerData.agentId" v-model:playDetailsModal="playDetailsModal" :totalData="totalData"
    @jumpInviter="jumpInviter" @refreshSearch="search(currentPage)" />
  <CashInOutModal v-model:cashInOutModal="cashInOutModal" :totalData="totalData" :cashInOutStatus="cashInOutStatus"
    @updatePlayer="updatePlayer" />
  <fastgivenBonusModal v-model:fastgivenBonusModal="fastgivenBonusModalStatus" :totalData="totalData"
    :fastbonusGroup="fastbonusGroup" @refreshFastBonusGroup="fastGiveBonusFunc" @updatePlayer="updatePlayer"
    :agentID="detailsData.agentAccount" @refreshPlayerdata="search(1)" />
  <GCashModal v-model:gCashModal="gCashModal" :totalData="totalData" :canHandlePlayer="canHandlePlayer"
    @updatePlayer="updatePlayer" />
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, inject, computed, watch, onMounted } from 'vue-demi'
import Pagination from '@/components/Pagination'
import {
  getPlayerApi,
  freezeAccountApi,
  unfreezeAccountApi,
  resetPwdApi,
  resetTradePwdApi,
  getAvatarApi,
  removeWalletAddressApi,
  handleFormalApi
} from '@/api/player'

import useStore from '@/store/index'
import PlayerListCard from '@/views/customerAccount/list/PlayerListCard'
import PlayerListTable from '@/views/customerAccount/list/PlayerListTable.vue'
import CustomerAccountModal from '@/views/customerAccount/modal/CustomerAccountModal'
import GameLogModal from '@/views/customerAccount/modal/GameLogModal'
import AccountChangeModal from '@/views/customerAccount/modal/AccountChangeModal'
import CashInOutModal from '@/views/customerAccount/cashInOut/CashInOutModal'
import PlayDetailsModal from '@/views/customerAccount/modal/PlayDetailsModal'
import GCashModal from '@/views/customerAccount/modal/GCashModal'
import DateChoose from '@/components/date/DateChoose'
import fastgivenBonusModal from '@/views/customerAccount/modal/FastGivenBonus.vue'
// import BetPopover from '@/components/BetPopover'
import { getFastBonusgroup } from '@/api/fastBonus'
import { useI18n } from 'vue-i18n'
import { exportJsonToExcel } from '@/utils/useExportExcel'
import { convertTimeZone, formatTimeZone } from '@/utils/useConvertTimeZone'

// import { refreshgroup } from '@/store/fastgivenbonus.js'
const { loginStore, treeStore, jumpPlayerStore, msgStore, fastgivenbonus } = useStore()
// const { refreshgroupBool, thisFastBonus } = storeToRefs(fastgivenbonus)
const { refreshgroupBool } = storeToRefs(fastgivenbonus)
const { setthisFastBonus } = fastgivenbonus
const { t } = useI18n()
const { groupData, treeTotal } = storeToRefs(treeStore)
// console.log(treeStore.checkAgent(['幹部']))
const playerData = ref([])
const detailsData = ref({})

// 手機版card插入按鈕操作
const slotData = ref(['edit', 'GameLog', 'accountDetails', 'playDetails', 'resetPwd', 'freeze'])

// 權限名稱
const roleName = computed(() => loginStore.loginData.userData?.role_name)

// 判斷是否可開洗分
const canCashInOut = computed(() => {
  return treeStore.checkAgent(['總代理', '幹部', '財務', '客服主管'])
  // const type = ['supermaster', 'cadre', 'watcher', 'control']
  // return detailsData.value.type === 'cash' && groupData.value.level === 1 && type.includes(roleName.value)
})
watch(canCashInOut, () => {
  if (canCashInOut.value) {
    slotData.value.splice(slotData.value.length - 1, 0, 'cashOut')
    slotData.value.splice(slotData.value.length - 1, 0, 'cashIn')
  } else {
    slotData.value = slotData.value.filter((item) => item !== 'cashIn' && item !== 'cashOut')
  }
})

// 判斷是否可清除錢包地址
watch(
  () => detailsData.value.type,
  () => {
    if (detailsData.value.type === 'cash') {
      slotData.value.unshift('removeWalletAddress')
    } else {
      slotData.value = slotData.value.filter((item) => item !== 'removeWalletAddress')
    }
  }
)

// 判斷是否可重置玩家密碼
const canHandleResetPwd = computed(() => {
  if (groupData.value.level === 0) return true
  const type = ['supermaster', 'cadre', 'control', 'agent', 'kefu']
  return groupData.value.status !== 'Freeze' && type.includes(roleName.value)
})

// 判斷是否可編輯玩家、查看遊戲紀錄、查看帳變明細、操作凍結、重置GCash
const canHandlePlayer = computed(() => {
  return true
  // if (groupData.value.level === 0) return true
  // const type = ['supermaster', 'cadre', 'control', 'kefu', 'agent']
  // return groupData.value.status !== 'Freeze' && type.includes(roleName.value)
})

// 判斷是否可顯示玩家手機號碼、GCash
const canWatchPhoneAndGCash = computed(() => {
  const type = ['supermaster', 'cadre', 'control', 'agent']
  if (type.includes(roleName.value) || groupData.value.level === 0) return true
  return false
})

// 彈窗區
const customerAccountModal = ref(false)
const gameLogModal = ref(false)
const accountChangeModal = ref(false)
const playDetailsModal = ref(false)
const cashInOutModal = ref(false)
const gCashModal = ref(false)
const fastgivenBonusModalStatus = ref(false)

// 日期
const dateData = ref({})
const getDate = (date) => (dateData.value = date)
const dateExist = computed(() => Object.keys(dateData.value).length)

// 開洗分
const cashInOutStatus = ref('')
const handleCashInOut = (status, formal) => {
  if (!formal && status === 'out') {
    openMsg({ content: '此帳號非正式帳號，無法執行洗分功能。' })
    return
  }

  if (!formal && status === 'in') {
    openMsg({
      content: [
        {
          text: '該帳號目前為體驗帳號，是否要將玩家轉為正式帳號?',
          color: 'black'
        },
        {
          text: '警告! 轉為正式帳號會清除玩家目前餘額!',
          color: 'black'
        }
      ],
      type: 'formal'
    })
    return
  }

  cashInOutStatus.value = status
  cashInOutModal.value = true
}
// 快派紅利
const fastbonusGroup = ref([])
watch(refreshgroupBool.value, (v) => {
  console.log(v)
})
const fastGiveBonusFunc = async () => {
  // 0519
  const { data } = await getFastBonusgroup(detailsData.value.agentAccount)
  fastbonusGroup.value = data.data.instant_groups
  fastgivenBonusModalStatus.value = true
  if (data.data.instant_groups) {
    setthisFastBonus(data.data.instant_groups[0])
  } else {
    setthisFastBonus(null)
  }
}
// 重新取得詳細玩家資訊
const totalData = ref({})
const updateDetailsData = () => {
  totalData.value = playerData.value.find((item) => item.account === detailsData.value.account) ?? {}
}
watch(detailsData, () => updateDetailsData())

// 搜尋玩家資訊
const searchType = ref(0)
const searchStr = ref('')
const totalPage = ref(0)
const currentPage = ref(0)
const timeStatus = ref(false)
const loading = ref(false)
const isLoading = computed(() => {
  if (searchType.value === 6) return !loading.value && dateExist.value
  return !loading.value
})
const search = async (page, status) => {
  if (status && searchStr.value === '') searchType.value = 0
  currentPage.value = page
  loading.value = true

  // 搜尋指定玩家或是代理
  const { level, name, agent_id: agentId } = groupData.value
  const id = level <= 1 && searchType.value === 0 ? name : searchStr.value ? searchStr.value : agentId

  // 搜尋新增玩家
  // 0831

  const newDate = `${formatTimeZone(dateData.value.time1)},${formatTimeZone(dateData.value.time2)}`
  if (searchType.value === 6 && !dateExist.value) return

  const { data } = await getPlayerApi(searchType.value, searchType.value === 6 ? newDate : id, page)

  if (data.code !== 200) {
    playerData.value = []
    detailsData.value = {}
    totalPage.value = 0
    loading.value = false
    return
  }
  playerData.value = data.data.data.map((item) => ({
    ...item,
    agentAccount: treeTotal.value.find((value) => value.agent_id === item.agent_id)?.name,
    agentNickname: treeTotal.value.find((value) => value.agent_id === item.agent_id)?.nickname,
    todayBet: Object.values(item.valid_bet_win != null ? item.valid_bet_win : 0).reduce((a, b) => a + b, 0),
    periodBet: Object.keys(item.valid_bet_win != null ? item.valid_bet_win : 0).reduce(
      (a, b) => a + item.valid_bet_win[b].period_valid_bet,
      0
    )
  }))
  console.log(playerData.value)
  totalPage.value = data.data.total
  if (status) updateDetailsData()

  // 取得頭像
  playerData.value.forEach((item) => {
    getAvatar(item.pid)
  })

  // 資料列表，現金:註冊時間 代理:上線時間
  timeStatus.value = searchType.value === 6

  loading.value = false
}

// 跳轉邀請人重新搜尋
const jumpInviter = async (account) => {
  searchType.value = 2
  searchStr.value = account
  playDetailsModal.value = !playDetailsModal.value
  await search(1, true)
  setTimeout(() => {
    playDetailsModal.value = !playDetailsModal.value
  }, 100)
}

// 編輯玩家、開洗分，重新取得玩家資訊
const updatePlayer = () => {
  searchType.value = 1
  setTimeout(() => {
    searchStr.value = detailsData.value.pid
    search(1, true)
  }, 0)
}

// 取得玩家頭像
const avatarData = ref({})
const getAvatar = async (id) => {
  const res = await getAvatarApi(id)
  if (res.data.type.indexOf('json') === -1) {
    const reader = new FileReader()
    reader.readAsDataURL(res.data)
    reader.onload = () => {
      avatarData.value[id] = reader.result
    }
  }
}

// 凍結or解凍玩家
const { openMsg } = msgStore
const { implement, type } = storeToRefs(msgStore)
const playerList = ref(null)
const freezeText = computed(() => (totalData.value?.isfreeze ? t('解凍') : t('凍結')))
const handlefreeze = () => openMsg({ content: `確定要${freezeText.value}此玩家?`, type: 'freeze' })

// 重置玩家密碼
const handlePwd = () => openMsg({ content: `${t('你確定要重置此帳號的密碼嗎?')}`, type: 'pwd' })
const handleTradePwd = () => openMsg({ content: `${t('確定要重置此帳號的交易密碼嗎?')}`, type: 'tradePwd' })

// 彈窗訊息執行時操作(凍結解凍、重置密碼)
watch(implement, async () => {
  if (implement.value) {
    if (type.value === 'freeze') {
      const freezeStatus = totalData.value.isfreeze ? unfreezeAccountApi : freezeAccountApi
      await freezeStatus({ pid: detailsData.value.pid })
      search(1, true)
      if (playerList.value) playerList.value.resetTargetIndex()
      if (mobileWidth.value) document.documentElement.scrollTop = 0
    }
    if (type.value === 'pwd') {
      const { data } = await resetPwdApi({ pid: detailsData.value.pid })
      if (data.code !== 200) return
      openMsg({ content: t('重置玩家密碼成功') })
    }
    if (type.value === 'tradePwd') {
      const { data } = await resetTradePwdApi({ pid: detailsData.value.pid })
      if (data.code !== 200) return
      openMsg({ content: t('更改玩家交易密碼成功!') })
    }
    if (type.value === 'wallet') {
      const { data } = await removeWalletAddressApi({ pid: detailsData.value.pid })
      if (data.code !== 200) return
      updatePlayer()
      openMsg({ content: t('清除玩家錢包地址成功') })
    }
    // 體驗轉正式
    if (type.value === 'formal') {
      const { data } = await handleFormalApi({ pid: detailsData.value.pid })
      if (data.code !== 200) return
      search(1, true)
      cashInOutStatus.value = 'in'
      cashInOutModal.value = true
    }
  }
})

// 搜尋類別切換重置
watch(searchType, () => {
  searchStr.value = ''
  if (searchType.value !== 6) {
    dateData.value = {}
  }
})

// 分頁更新時重新搜尋
const getCurPage = (page) => search(page)

// 清除錢包地址
const removeWalletAddress = () => {
  openMsg({ content: `${t('你確定要重置此帳號')} ${totalData.value.account} ${t('的錢包地址嗎?')}`, type: 'wallet' })
}

// 玩家數據報表跳轉過來搜尋玩家
onMounted(() => {
  if (jumpPlayerStore.pid) {
    searchType.value = 1
    setTimeout(() => {
      searchStr.value = jumpPlayerStore.pid
      search(1, true)
    }, 0)
    setTimeout(() => {
      jumpPlayerStore.setPid('')
    }, 1000)
  }
})

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')

// 匯出 excel
const exportExcelModal = ref(false)
const accountStatus = ref(true)
const nicknameStatus = ref(true)
const realNameStatus = ref(true)
const agentAccountStatus = ref(true)
const phoneStatus = ref(true)
const vipStatus = ref(true)
const balanceStatus = ref(true)
const totalChargeStatus = ref(true)
const totalConsignStatus = ref(true)
const totalSpecialStatus = ref(true)
const historyValidBetStatus = ref(true)
const lastLoginStatus = ref(true)

const initialKeepKeys = [
  'account',
  'nickname',
  'realname',
  'agent_account',
  'phone',
  'vip_level',
  'twd_balance',
  'history',
  'history_valid_bet_win',
  'updatetime'
]

const keyOrder = [
  t('玩家帳號'),
  t('玩家暱稱'),
  t('真實姓名'),
  t('所屬代理'),
  t('手機'),
  t('VIP等級'),
  t('玩家餘額'),
  t('歷史總存款'),
  t('歷史總提款'),
  t('歷史總紅利'),
  t('歷史有效投注'),
  t('最後登入時間')
]

let keepKeys = [...initialKeepKeys]

// 過濾 checkbox 的結果
const filterKeepKeys = () => {
  const keyConditions = [
    { status: accountStatus.value, key: 'account' },
    { status: nicknameStatus.value, key: 'nickname' },
    { status: realNameStatus.value, key: 'realname' },
    { status: agentAccountStatus.value, key: 'agent_account' },
    { status: phoneStatus.value, key: 'phone' },
    { status: vipStatus.value, key: 'vip_level' },
    { status: balanceStatus.value, key: 'twd_balance' },
    { status: totalChargeStatus.value, key: 'history_charge' },
    { status: totalConsignStatus.value, key: 'history_consign' },
    { status: totalSpecialStatus.value, key: 'history_special' },
    { status: historyValidBetStatus.value, key: 'history_valid_bet_win' },
    { status: lastLoginStatus.value, key: 'updatetime' }
  ]

  const checkRemoveKey = (status) => !status

  // 預設一定會把 history 鍵值帶進去，只有在使用該物件裡的鍵值才會複製過去新物件
  keyConditions.forEach((condition) => {
    if (checkRemoveKey(condition.status, condition.key)) {
      keepKeys = keepKeys.filter((key) => key !== condition.key)
    }
  })
}

// 過濾需要的鍵值
const filterObjectKeys = (obj, keysToKeep) => {
  if (!obj || typeof obj !== 'object') {
    throw new Error('The input is not a valid object.')
  }

  if (!Array.isArray(keysToKeep)) {
    throw new Error('keysToKeep must be an array.')
  }

  const keyMappings = {
    account: t('玩家帳號'),
    nickname: t('玩家暱稱'),
    realname: t('真實姓名'),
    agent_account: t('所屬代理'),
    phone: t('手機'),
    vip_level: t('VIP等級')
  }

  const divideByNum = (num) => num / 10000

  const filterObj = Object.keys(obj).reduce((result, key) => {
    if (keysToKeep.includes(key)) {
      if (obj[key] === false) return result

      if (key === 'history') {
        const { charge, consign, special } = obj.history.history

        if (totalChargeStatus.value) result[t('歷史總存款')] = divideByNum(charge)
        if (totalConsignStatus.value) result[t('歷史總提款')] = divideByNum(consign)
        if (totalSpecialStatus.value) result[t('歷史總紅利')] = divideByNum(special)
      } else if (key === 'twd_balance') {
        result[t('玩家餘額')] = divideByNum(obj[key])
      } else if (key === 'history_valid_bet_win') {
        result[t('歷史有效投注')] = divideByNum(obj[key])
      } else if (key === 'updatetime') {
        const { year, month, date, hours, minutes, seconds } = convertTimeZone(obj[key], -3)
        result[t('最後登入時間')] = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`
      } else {
        result[keyMappings[key]] = obj[key]
      }
    }

    return result
  }, {})

  return filterObj
}

// 排序鍵值
const sortObjectKeys = (obj, keyOrder) => {
  const sortedKeys = Object.keys(obj).sort((a, b) => {
    const indexA = keyOrder.indexOf(a)
    const indexB = keyOrder.indexOf(b)

    if (indexA === -1) return 1
    if (indexB === -1) return -1

    return indexA - indexB
  })

  const sortedObject = {}

  sortedKeys.forEach((key) => {
    sortedObject[key] = obj[key]
  })

  return sortedObject
}

const handleExportExcel = async () => {
  const { level, name, agent_id: agentId } = groupData.value
  const id = level <= 1 && searchType.value === 0 ? name : searchStr.value ? searchStr.value : agentId
  const { data } = await getPlayerApi(0, id, 0)
  const newKeysArray = []
  const exportData = ref([])

  exportData.value = data.data.data.map((item) => ({
    ...item,
    agent_account: treeTotal.value.find((value) => value.agent_id === item.agent_id)?.name
  }))

  filterKeepKeys()

  exportData.value.forEach((item) => {
    const finalObject = sortObjectKeys(filterObjectKeys(item, keepKeys), keyOrder)
    newKeysArray.push(finalObject)
  })

  exportJsonToExcel(newKeysArray, t('玩家資訊'))
}

watch(exportExcelModal, (val) => {
  if (!val) {
    keepKeys = [...initialKeepKeys]

    accountStatus.value = true
    nicknameStatus.value = true
    realNameStatus.value = true
    agentAccountStatus.value = true
    phoneStatus.value = true
    vipStatus.value = true
    balanceStatus.value = true
    totalChargeStatus.value = true
    totalConsignStatus.value = true
    totalSpecialStatus.value = true
    historyValidBetStatus.value = true
    lastLoginStatus.value = true
  }
})
</script>

<style lang="scss" scoped>
.player {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @include breakpoint-up("sm") {
    &.flexWrap {
      flex-wrap: wrap;
    }
  }

  .create {
    @include breakpoint-up("sm") {
      margin: 5px 0 0 0 !important;
      max-width: 110px !important;
    }
  }
}

.playerInfo {
  border: 1px solid $dark;
  border-radius: 5px;
  margin-bottom: 10px;
  color: $dark;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  li {
    width: calc(100% / 3);
    padding: 10px 0;
    border-bottom: 1px solid $dark;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      margin: 0 5px;
    }

    &:nth-last-child(-n + 3) {
      border: none;
    }
  }
}

.playerListPage {
  display: flex;
  justify-content: space-between;
  align-content: center;
}

.btnGroup {
  display: flex;
  justify-content: space-between;
}

.el-row {
  margin-bottom: 16px;
}
</style>
