<template>
  <el-menu class="el-menu-vertical-demo" :default-active="active" text-color="#fff" :unique-opened="true">
    <el-sub-menu index="treeGroup" :key="num">
      <!-- v-if="!shareholder && !kefu" -->
      <template #title>
        <span> <img alt="icon" src="@/assets/icon/tree.gif" /> {{ $t("代理架構") }} </span>
      </template>
      <SearchTreeAgent @searchAgent="searchAgent" />
      <el-tree
        node-key="agent_id"
        :key="resetTree"
        :data="[treeStore.newTreeData]"
        :props="defaultProps"
        :expand-on-click-node="false"
        :default-expanded-keys="defaultShowNodes"
        :render-content="renderContent"
        @node-click="handleNodeClick"
        @node-expand="handleNodeExpand"
        @node-collapse="handleNodeCollapse"
      />
    </el-sub-menu>
    <el-menu-item index="customerAccount" @click="handleOpen('customerAccount')">
      <router-link to="/customerAccount">
        <img alt="icon" src="@/assets/icon/customer.png" />
        {{ $t("玩家資訊") }}
      </router-link>
    </el-menu-item>
    <el-sub-menu index="reports">
      <template #title>
        <span>
          <img alt="icon" src="@/assets/icon/reports.png" />
          {{ $t("報表") }}
        </span>
      </template>
      <el-menu-item index="playerDataReport" @click="handleOpen('playerDataReport')"
        ><router-link to="/playerDataReport">{{ $t("玩家數據報表") }}</router-link>
      </el-menu-item>
      <!-- <el-menu-item index="agentDataReport" @click="handleOpen('agentDataReport')" v-if="!kefu"
        ><router-link to="/agentDataReport">{{ $t('代理數據報表') }}</router-link>
      </el-menu-item> -->
      <el-menu-item index="activityBonusReport" @click="handleOpen('activityBonusReport')" v-if="groupData.level < 2"
        ><router-link to="/activityBonusReport">{{ $t("活動紅利報表") }}</router-link>
      </el-menu-item>
      <!-- <el-menu-item index="aiReport" @click="handleOpen('aiReport')" v-if="canWatchItem(supermaster, cadre, shareholder, kefu)"
        ><router-link to="/aiReport">{{ $t('遊戲AI報表') }}</router-link>
      </el-menu-item> -->
    <!-- v-if="!groupData.level || (!watcher && !kefu)" -->
      <el-menu-item index="playBetReport" @click="handleOpen('playBetReport')" v-if="groupData.level < 2"
        ><router-link to="/playBetReport">{{ $t("遊戲投注營收報表") }}</router-link>
        <!-- v-if="canWatchItem(supermaster, cadre, shareholder) -->
      </el-menu-item>
      <el-menu-item index="playLotteryReport" @click="handleOpen('playLotteryReport')" v-show="false" v-if="groupData.level < 2"
        ><router-link to="/playLotteryReport">{{ $t("遊戲開獎結果報表") }}</router-link>
        <!-- v-if="canWatchItem(supermaster, cadre) -->
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="finance" v-if="groupData.level < 2 && !kefu && !shareholder && !control">
      <template #title>
        <span>
          <img alt="icon" src="@/assets/icon/finance.png" />
          {{ $t("財務S") }}
        </span>
      </template>
      <el-menu-item index="withdrawalReview" @click="handleOpen('withdrawalReview')">
        <router-link to="/withdrawalReview">{{ $t("玩家提款審核") }}</router-link>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="record" v-if="groupData.level < 2 && !shareholder">
      <template #title>
        <span>
          <img alt="icon" src="@/assets/icon/statistics.png" />
          {{ $t("紀錄") }}
        </span>
      </template>
      <!--  -->
      <template v-if="groupData.level < 2">
        <el-menu-item index="cashInOutLog" @click="handleOpen('cashInOutLog')">
          <router-link to="/cashInOutLog">{{ $t("開洗分紀錄") }}</router-link>
        </el-menu-item>
        <el-menu-item index="cashStoredValueLog" @click="handleOpen('cashStoredValueLog')">
          <router-link to="/cashStoredValueLog">{{ $t("第三方存提紀錄") }}</router-link>
        </el-menu-item>
        <el-menu-item index="controlLog" @click="handleOpen('controlLog')">
          <router-link to="/controlLog">{{ $t("風控資訊") }}</router-link>
        </el-menu-item>
        <el-menu-item index="playerOnlinerecord" @click="handleOpen('playerOnlinerecord')" v-if="!kefu && !control">
          <router-link to="/playerOnlinerecord">{{ $t("玩家在線紀錄") }}</router-link>
        </el-menu-item>
        <el-menu-item index="adminLog" @click="handleOpen('adminLog')">
          <router-link to="/adminLog">{{ $t("資料異動紀錄") }}</router-link>
        </el-menu-item>
      </template>
      <el-menu-item index="briefnewsLog" @click="handleOpen('briefnewsLog')" v-if="canWatchItem(supermaster, cadre, kefu, control)">
        <router-link to="/briefnewsLog">{{ $t("簡訊紀錄") }}</router-link>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="activity" v-if="groupData.level < 2 && !shareholder && !kefu ">
      <template #title>
        <span>
          <img alt="icon" src="@/assets/icon/activity.png" />
          {{ $t("活動") }}
        </span>
      </template>
      <!-- v-if="groupData.level < 2" -->
      <el-menu-item index="ranking" @click="handleOpen('ranking')" v-if="!watcher">
        <router-link to="/ranking">{{ $t("排行榜") }}</router-link>
      </el-menu-item>
      <el-menu-item index="activityPost" @click="handleOpen('activityPost')">
        <router-link to="/activityPost">{{ $t("活動公告") }}</router-link>
      </el-menu-item>
      <el-menu-item index="activityList" @click="handleOpen('activityList')">
        <router-link to="/activityList">{{ $t("活動列表") }}</router-link>
      </el-menu-item>
      <el-menu-item index="playerRebate" @click="handleOpen('playerRebate')" v-if="!control">
        <router-link to="/playerRebate">{{ $t("玩家返利") }}</router-link>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="setting" v-if="canWatchItem(supermaster, cadre)||(watcher || kefu || control)">
      <template #title>
        <span>
          <img alt="icon" src="@/assets/icon/systemsetup.png" />
          {{ $t("系統設定") }}
        </span>
      </template>
      <el-menu-item index="HomepageCarouselSetup" @click="handleOpen('HomepageCarouselSetup')" v-if="none">
        <router-link to="/HomepageCarouselSetup">{{ $t("首頁輪播圖工具") }}</router-link>
      </el-menu-item>

      <el-menu-item index="announcementSetting" @click="handleOpen('announcementSetting')" v-if="canWatchItem(supermaster, cadre)">
        <router-link to="/announcement">{{ $t("公告工具") }}</router-link>
      </el-menu-item>
      <el-menu-item index="marqueeSetting" @click="handleOpen('marqueeSetting')" v-if="canWatchItem(supermaster, cadre)">
        <router-link to="/marquee">{{ $t("跑馬燈工具") }}</router-link>
      </el-menu-item>
      <el-menu-item index="stationMessage" @click="handleOpen('stationMessage')" v-if="canWatchItem(supermaster, cadre)||(watcher || kefu || control)">
        <router-link to="/stationMessage">{{ $t("站內信工具") }}</router-link>
      </el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="QRcode" v-if="groupData.level >= 2||supermaster||cadre">
      <!-- groupData.level !== 0 && (supermaster || cadre || agent) -->
      <template #title>
        <span>
          <img alt="icon" src="@/assets/icon/QRcode.png" />
          QR code
          <!-- 總代理1 -->
          <!-- 一及代理 2 -->
        </span>
      </template>
      <el-menu-item index="lobbyQRcode" @click="handleOpen('lobbyQRcode')" v-if="!supermaster && !cadre && !watcher && !kefu && !control">
        <router-link to="/QRcode/lobby">{{ $t("玩家掃描") }}</router-link>
      </el-menu-item>
      <template v-if="groupData.level !== 8">
        <!-- {{ agent }} -->
        <!-- groupData.level !== 1 && groupData.level !== 6  -->
        <el-menu-item
          index="backendQRcode"
          @click="handleOpen('backendQRcode')"
          v-if="supermaster || cadre || ((groupData.level >=2)&&(groupData.level !=6))"
        >
          <router-link to="/QRcode/backend">{{ $t("下級代理掃描") }}</router-link>
        </el-menu-item>
        <!-- <el-menu-item index="backendCash" @click="handleOpen('backendCashQRcode')" v-if="groupData.level === 1">
          <router-link to="/QRcode/backendCash">{{ $t('下級代理掃描') }}</router-link>
        </el-menu-item> -->
      </template>
    </el-sub-menu>
    <el-menu-item index="logout" @click="handleLogout">
      <span><img alt="icon" :src="require('@/assets/icon/logout.png')" />{{ $t("登出") }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import useStore from '@/store/index'
import { useRouter, useRoute } from 'vue-router'
import { ref, watch, onUnmounted, computed, inject, nextTick } from 'vue-demi'
import { useI18n } from 'vue-i18n'
import SearchTreeAgent from './SearchTreeAgent'

const router = useRouter()
const route = useRoute()

const { loginStore, treeStore, jumpPlayerStore, msgStore, fastgivenbonus } = useStore()
// const { changejumpTotree } = fastgivenbonus
const { jumpTotree } = storeToRefs(fastgivenbonus)
const { changejumpTotree } = fastgivenbonus
const { treeTotal, groupData, targetTree, supermaster, cadre, kefu, watcher, shareholder, control, agent } = storeToRefs(treeStore)
console.log(agent)
const defaultProps = {
  children: 'children',
  label: 'label'
}
const emit = defineEmits(['closureSidebar', 'resetView'])

// 判斷不同權限可否查看的項目
const canWatchItem = (...permissions) => {
  // 開發商都可查看
  if (groupData.value.level === 0) return true
  return permissions.some((item) => item) && groupData.value.level < 2
}

// 登出
const { openMsg } = msgStore
const { implement, type } = storeToRefs(msgStore)
const handleLogout = () => openMsg({ content: t('確定要登出嗎?'), title: t('登出'), type: 'logout' })
const logout = async () => {
  const status = await loginStore.removeLoginData()
  if (status) router.push('/login')
}
watch(implement, async () => {
  if (implement.value && type.value === 'logout') logout()
})

// sidebar樹狀資訊
const { t } = useI18n()
const renderContent = (h, { node, data, store }) => {
  const { nickname, label, children, level: lv } = data
  const level = lv === 2 ? '一' : lv === 3 ? '二' : lv === 4 ? '三' : lv === 5 ? '四' : lv === 6 ? '五' : lv === 7 ? '六' : '七'
  const agent = lv < 2 ? t(treeStore.levelText(lv)) : t(`${level}級`)
  return h(
    'span',
    {
      class: 'custom-tree-node'
    },
    h('span', null, `${label}/${nickname}/${t(agent)}${lv !== 8 ? `(${children?.length})` : ''}`)
  )
}

const num = ref(0)
watch(
  () => route.path,
  () => {
    if (route.path !== '/treeGroup') num.value++
  }
)

// 取得階級樹狀資料、階級群組資料
const getData = async () => {
  await treeStore.getGroupData()
  await treeStore.getTreeData()
}

// 路由跳轉更新menu
const { pid, account } = storeToRefs(jumpPlayerStore)
watch([pid, account], () => {
  if (pid.value || account.value) {
    setTimeout(() => handleOpen(route.name), 500)
  }
})

// 樹狀節點
const defaultShowNodes = ref([])

// Menu樣式更新
let dom = null
const active = ref('0')
const handleOpen = (key) => {
  // 更新非樹狀Menu背景
  if (key !== 'treeGroup' && key !== 'reports' && key !== 'setting' && key !== 'record') {
    if (!width.value) emit('closureSidebar')
    active.value = key
    defaultShowNodes.value = []
  }
  if (dom) dom.style.background = 'initial'
  dom = null

  // 重新點擊玩家資訊重置畫面
  if (route.path === '/customerAccount' && !pid.value) emit('resetView')
}

const handleNodeClick = (data, status, closeSidebar = true) => {
  if (!width.value && closeSidebar) emit('closureSidebar')
  // 取得當前點擊樹狀資料跳轉頁面
  if (status !== 'updateOrder') {
    treeStore.getTargetTree(data)
    router.push('/treeGroup')
  }

  // 更新樹狀Menu背景
  active.value = 'treeGroup'
  if (dom) {
    dom.style.background = 'initial'
    dom.lastChild.lastChild.style.color = 'initial'
  }

  nextTick(() => {
    dom = document.querySelector(`.el-tree-node[data-key="${data.agent_id}"]`)
    dom = dom.firstChild
    dom.style.background = '#2a82e4'
    dom.lastChild.lastChild.style.color = 'white'
  })
}
defineExpose({
  handleTree() {
    if (dom) {
      dom.style.background = 'initial'
      dom.lastChild.lastChild.style.color = 'initial'
    }
    dom = null
    handleNodeClick(targetTree.value, 'updateOrder', false)
  }
})

// 樹狀節點展開
const handleNodeExpand = (data) => {
  const flag = defaultShowNodes.value.includes(data.agent_id)
  if (!flag) defaultShowNodes.value.push(data.agent_id)
}

// 樹狀節點關閉
const handleNodeCollapse = (data) => {
  const flag = defaultShowNodes.value.includes(data.agent_id)
  if (flag) defaultShowNodes.value.filter((item) => item !== data.agent_id)
}

// 樹狀展開指定節點
const resetTree = ref(0)
const searchAgent = (name) => {
  if (targetTree.value.name === name) return

  const target = treeTotal.value.find((item) => item.name.toLowerCase() === name.toLowerCase())
  if (!target) return openMsg({ content: '查無代理' })

  resetTree.value++
  defaultShowNodes.value = []
  defaultShowNodes.value.push(target.agent_id)
  setTimeout(() => {
    treeStore.getTargetTree(target)
    if (route.path === '/treeGroup') return
    router.push('/treeGroup')
  }, 100)
}
// 監控，由其他頁面 直接跳到查詢代理
watch(jumpTotree, (v) => {
  if (v !== '') {
    console.log(v)
    searchAgent(v)
    changejumpTotree('')
  }
})

watch(
  targetTree,
  () => {
    handleNodeClick(targetTree.value, 'updateOrder')
  },
  { deep: true }
)

onUnmounted(() => {
  treeStore.$reset()
})

getData()

// 斷點
const { clientWidth: wh } = inject('clientWidth')
const width = computed(() => wh.value === 'xl')
</script>

<style scoped lang="scss">
:deep .el-tree {
  background: $light;
  color: $dark;
  .el-icon {
    margin-left: 10px;
    svg {
      height: 50px;
      width: 50px;
    }
  }
}

:deep .el-tree-node__content {
  padding: 20px 0px;
  &:hover {
    background: $secondary !important;
    span {
      color: white !important;
    }
  }
}

:deep .el-tree-node:focus > .el-tree-node__content {
  background: initial;
}
</style>
