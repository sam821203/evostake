import { createRouter, createWebHashHistory } from 'vue-router'
import useCookie from '@/utils/cookie'
const { getToken } = useCookie()

const routes = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/layout/index'),
    redirect: '/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/views/LoginView'),
        meta: { name: '登入頁' }
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/HomeView'),
        meta: { name: '首頁' }
      },
      {
        path: 'treeGroup',
        name: 'treeGroup',
        component: () => import('@/views/treeGroup/TreeGroup'),
        meta: { name: '代理架構' }
      },
      {
        path: 'customerAccount/:jumpParam?',
        name: 'customerAccount',
        component: () => import('@/views/customerAccount/CustomerAccount'),
        meta: { name: '玩家資訊' }
      },
      {
        path: 'playerDataReport/:jumpParam?/:startTime?/:endTime?',
        name: 'playerDataReport',
        component: () => import('@/views/report/playerDataReport/PlayerDataReport'),
        meta: { name: '玩家數據報表' }
      },
      {
        path: 'agentDataReport',
        name: 'agentDataReport',
        component: () => import('@/views/report/AgentDataReport'),
        meta: { name: '代理數據報表' }
      },
      {
        path: 'activityBonusReport',
        name: 'activityBonusReport',
        component: () => import('@/views/report/ActivityBonusReport'),
        meta: { name: '活動紅利報表' }
      },
      {
        path: 'aiReport',
        name: 'aiReport',
        component: () => import('@/views/report/AiReport'),
        meta: { name: '遊戲AI報表' }
      },
      {
        path: 'playBetReport',
        name: 'playBetReport',
        component: () => import('@/views/report/PlayBetReport'),
        meta: { name: '遊戲投注營收報表' }
      },
      {
        path: 'playLotteryReport',
        name: 'playLotteryReport',
        component: () => import('@/views/report/PlayLotteryReport'),
        meta: { name: '遊戲開獎結果報表' }
      },
      {
        path: 'withdrawalReview',
        name: 'withdrawalReview',
        component: () => import('@/views/finance/withdrawalReview/WithdrawalReview'),
        meta: { name: '玩家提款審核' }
      },
      {
        path: 'adminLog',
        name: 'adminLog',
        component: () => import('@/views/record/AdminLog'),
        meta: { name: '資料異動紀錄' }
      },
      {
        path: 'cashInOutLog',
        name: 'cashInOutLog',
        component: () => import('@/views/record/CashInOutLog'),
        meta: { name: '開洗分紀錄' }
      },
      {
        path: 'cashStoredValueLog',
        name: 'cashStoredValueLog',
        component: () => import('@/views/record/CashStoredValueLog'),
        meta: { name: '第三方存提紀錄' }
      },
      {
        path: 'controlLog/:jumpParam?',
        name: 'controlLog',
        component: () => import('@/views/record/control/ControlLog'),
        meta: { name: '風控資訊' }
      },
      {
        path: 'playerOnlinerecord',
        name: 'playerOnlinerecord',
        component: () => import('@/views/record/playerOnlinerecord'),
        meta: { name: '玩家在線紀錄' }
      },
      {
        path: 'briefnewsLog',
        name: 'briefnewsLog',
        component: () => import('@/views/record/BriefnewsLog'),
        meta: { name: '簡訊紀錄' }
      },
      {
        path: 'ranking',
        name: 'ranking',
        component: () => import('@/views/activity/Ranking'),
        meta: { name: '排行榜' }
      },
      {
        path: 'activityPost',
        name: 'activityPost',
        component: () => import('@/views/activity/activityPost'),
        meta: { name: '活動公告' }
      },
      {
        path: 'activityList',
        name: 'activityList',
        component: () => import('@/views/activity/activityList'),
        meta: { name: '活動列表' }
      },
      {
        path: 'playerRebate',
        name: 'playerRebate',
        component: () => import('@/views/activity/playerRebate'),
        meta: { name: '玩家返利' }
      },
      {
        path: 'HomepageCarouselSetup',
        name: 'HomepageCarouselSetup',
        component: () => import('@/views/setting/HomepageCarouselSetup'),
        meta: { name: '首頁輪播圖工具' }
      },
      {
        path: 'announcement',
        name: 'announcement',
        component: () => import('@/views/setting/Announcement'),
        meta: { name: '公告工具' }
      },
      {
        path: 'marquee',
        name: 'marquee',
        component: () => import('@/views/setting/Marquee'),
        meta: { name: '跑馬燈工具' }
      },
      {
        path: 'stationMessage',
        name: 'stationMessage',
        component: () => import('@/views/setting/stationMessage'),
        meta: { name: '站內信工具' }
      },
      {
        path: 'QRcode/:type',
        name: 'QRcode',
        component: () => import('@/views/QRcode'),
        meta: { name: '掃描' }
      }
    ]
  },
  {
    path: '/register/:level/:name/:lang',
    name: 'register',
    component: () => import('@/views/Register'),
    meta: { name: '註冊' }
  },
  // 路由比對失敗
  {
    path: '/:pathMatch(.*)*',
    redirect: { name: 'login' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.onError(error => {
  // 在這裡進行錯誤處理
  console.error(error)
})
// 路由守衛
router.beforeEach((to) => {
  if (to.name.includes('register')) return
  if (to.name !== 'login' && !getToken()) return { name: 'login' }
})

export default router
