<template>
  <Teleport to="#app">
    <div class="detaiBetIframe" v-if="detailModal">
      <div class="overlay" @click="closeModal"></div>
      <div class="container">
        <div class="detail">
          <div class="content" :class="{ isEle }">
            <iframe :src="detailUrl"></iframe>
            <img v-show="isEle" src="@/assets/close.png" alt="close" class="close" @click="closeModal" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, toRefs } from 'vue-demi'
import { useRoute } from 'vue-router'
import { getGamesApi } from '@/api/player'

const route = useRoute()
const props = defineProps({
  detailModal: Boolean,
  detailData: Object
})
const { detailModal, detailData } = toRefs(props)

const detailUrl = ref('')
const isEle = ref(false)
const detailBet = async () => {
  const api = process.env.VUE_APP_LINK
  const url = api.includes('192') ? api : `${api.slice(0, 8)}hashking.${api.slice(8)}`
  const { pid, status, round_uuid: uuid, created_at: time, studio } = detailData.value
  const isCustomerAccount = route.path === '/customerAccount'
  const isWithdrawalReview = route.path === '/withdrawalReview'
  const type = (isCustomerAccount || isWithdrawalReview) ? +detailData.value.game_name : detailData.value.game_type

  let game
  switch (type) {
    case 15:
      game = 'newnew1'
      break
    case 16:
      game = 'baijia'
      break
    case 17:
      game = 'bigsmall'
      break
    case 18:
      game = 'dragonTiger'
      break
    case 19:
      game = 'footBall'
      break
    case 20:
      game = 'roulette'
      break
    case 21:
      game = 'xocdia'
      break
    case 22:
      game = 'tiengow'
      break
    case 23:
      game = 'battleniuniu'
      break
    case 24:
      game = 'pkfootball'
      break
    case 25:
      game = 'hooheyhow'
      break
    case 26:
      game = 'horserace'
      break
    case 27:
      game = 'roulette16'
      break
    case 28:
      game = 'chickenfight'
      break
  }
  isEle.value = studio === 'joygames' || studio === 'jili'
  const lang = localStorage.getItem('locale') === 'EN' ? 'en_US' : 'zh_TW'
  if (isCustomerAccount || isWithdrawalReview) {
    // 鏈遊紀錄
    detailUrl.value = `${url}/Dist/HashGame_Dist/?gameName=${game}&gamePlayerId=${pid}&gameType=${type}&gameCurrency=TWD&language=${lang}&id=${uuid}&mode=backend`

    // 電子遊戲紀錄
    if (!isEle.value) return
    const { data } = await getGamesApi(studio, uuid)
    detailUrl.value = data.data.url
  } else {
    // 開獎紀錄
    detailUrl.value = `${url}/Dist/HashGame_Record/?language=${lang}&BureauNumber=${uuid}&mode=${game}&status=${status}&created_at=${time}`
  }
}

watch(detailModal, () => {
  if (detailModal.value) detailBet()
})

const emit = defineEmits(['update:accountChangeModal'])
const closeModal = () => emit('update:detailModal', false)
window.addEventListener('message', (e) => {
  if (e.data === 'closeWebview') closeModal()
})
</script>

<style lang="scss" scoped>
.detaiBetIframe {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 9999;
  .container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .overlay {
    z-index: 9997;
  }
}

.detail {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 9998;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  .content {
    display: flex;
    justify-content: center;
    position: relative;
    height: 640px;
    width: 500px;
    iframe {
      height: 100%;
      width: 100%;
      border: none;
    }
    &.isEle {
      width: 1200px;
    }
    img {
      width: 40px;
    }
  }
  .close {
    position: absolute;
    top: 0;
    right: 0;
    width: 12%;
    cursor: pointer;
  }
}
</style>
