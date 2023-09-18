<template>
  <el-dialog :model-value="friendsModal" :width="700" @close="closeModal" :destroy-on-close="true">
    <template #header>
      <div class="info">
        <h2 style="border: none; padding: 0">{{ playerAcc }}</h2>
        <p>{{ $t('好友首存人數') }}: {{ newFriendsData.first_charge_ppl }}</p>
        <p style="margin-left: 1.5rem">{{ $t('好友續存人數') }}:{{ newFriendsData.continuing_charge_ppl }}</p>
        <!-- <p>{{ $t('總計') }}: <span v-money="totalDividend"></span></p> -->
      </div>
    </template>
    <div class="searchGroup">
      <el-select v-model="vip">
        <el-option :label="$t('所有等級')" value="all" />
        <el-option label="VIP 0" value="0" />
        <el-option label="VIP 1" value="1" />
        <el-option label="VIP 2" value="2" />
        <el-option label="VIP 3" value="3" />
        <el-option label="VIP 4" value="4" />
        <el-option label="VIP 5" value="5" />
      </el-select>
      <el-input v-model="account" :placeholder="$t('請輸入好友帳號')" @input="changeFriends" />
    </div>
    <!-- <div class="searchGroup">
      <el-select v-model="date">
        <el-option :label="$t('請選擇')" value="" disabled />
        <el-option v-for="(item, index) in totalTime" :key="item.initTime" :label="item.initTime" :value="index" />
      </el-select>
      <el-button type="primary" @click="search">{{ $t('搜尋') }}</el-button>
    </div> -->

    <table v-if="newFriendsData.detail.length" class="list">
      <thead>
        <tr>
          <td></td>
          <td>{{ $t('總計') }}</td>
          <td v-money="totalfirstCharge / 10000"></td>
          <td v-money="totalcharge / 10000"></td>
          <td v-money="totalflow / 10000"></td>
          <td>{{ totalfriendCount }}</td>
        </tr>
        <tr>
          <td></td>
          <td>
            <div class="flexCenter">
              {{ $t('好友帳號') }}
              <div class="customSort">
                <img :src="checkTriangleImg('increase', 'account')" @click="sortdata('increase', 'account')" />
                <img :src="checkTriangleImg('decrease', 'account')" @click="sortdata('decrease', 'account')" />
              </div>
            </div>
          </td>
          <td>
            <div class="flexCenter">
              {{ $t('首存金額') }}
              <div class="customSort">
                <img :src="checkTriangleImg('increase', 'first_charge')" @click="sortdata('increase', 'first_charge')" />
                <img :src="checkTriangleImg('decrease', 'first_charge')" @click="sortdata('decrease', 'first_charge')" />
              </div>
            </div>
          </td>
          <td>
            <div class="flexCenter">
              {{ $t('續存金額') }}
              <div class="customSort">
                <img :src="checkTriangleImg('increase', 'charge')" @click="sortdata('increase', 'charge')" />
                <img :src="checkTriangleImg('decrease', 'charge')" @click="sortdata('decrease', 'charge')" />
              </div>
            </div>
          </td>

          <!-- <td>{{ $t('歷史總存款') }}</td> -->
          <!-- <td>{{ $t('歷史總提款') }}</td> -->
          <td>
            <div class="flexCenter">
              {{ $t('總流水') }}
              <div class="customSort">
                <img :src="checkTriangleImg('increase', 'flow')" @click="sortdata('increase', 'flow')" />
                <img :src="checkTriangleImg('decrease', 'flow')" @click="sortdata('decrease', 'flow')" />
              </div>
            </div>
          </td>
          <td>
            <div class="flexCenter">
              {{ $t('邀請好友數') }}
              <div class="customSort">
                <img :src="checkTriangleImg('increase', 'friend_count')" @click="sortdata('increase', 'friend_count')" />
                <img :src="checkTriangleImg('decrease', 'friend_count')" @click="sortdata('decrease', 'friend_count')" />
              </div>
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in newFriendsData.detail" :key="item.account" class="vip">
          <td>
            <div class="flex_verticalCenter">
              <img src="@/assets/vip_icon.png" alt="vip" />
              <p>VIP {{ item.vip_level }}</p>
            </div>
          </td>
          <td>{{ item.account }}</td>
          <!-- <td><span v-money="item.charge / 10000"></span></td> -->
          <!-- <td><span v-money="item.consign / 10000"></span></td> -->
          <td><span v-money="item.first_charge / 10000"></span></td>
          <td><span v-money="item.charge / 10000">續存金額</span></td>
          <td><span v-money="item.flow / 10000"></span></td>
          <td>
            <span class="jumpLink" @click="search(item.u9, item.account)" v-if="item.friend_count > 0">
              {{ item.friend_count }}
            </span>
            <span v-else>
              {{ item.friend_count }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- <ul class="list">
      <li>
        <div class="nickname">
          <div class="vip">

          </div>
          <p></p>
        </div>
      </li>
    </ul> -->
    <p v-else class="noData">{{ $t('目前無好友') }}</p>
  </el-dialog>
</template>

<script setup>
import { ref, toRefs, watch, computed } from 'vue-demi'
import { getFriendsApi } from '@/api/player'
const moment = require('moment')

const props = defineProps({
  id: String,
  first_charge_ppl: String,
  continuing_charge_ppl: String,
  playerAccount: String,
  friendsModal: Boolean,
  friendsData: Object,
  date: Object
})
const playerAcc = ref('')
const totalfirstCharge = computed(() => {
  let a = 0
  newFriendsData.value.detail.forEach((el) => {
    a += el.first_charge
  })
  return a
})
const totalcharge = computed(() => {
  let a = 0
  newFriendsData.value.detail.forEach((el) => {
    a += el.charge
  })
  return a
})
const totalflow = computed(() => {
  let a = 0
  newFriendsData.value.detail.forEach((el) => {
    a += el.flow
  })
  return a
})
const totalfriendCount = computed(() => {
  let a = 0
  newFriendsData.value.detail.forEach((el) => {
    a += el.friend_count
  })
  return a
})
watch(
  // {
  //   return props.friendsModal
  // }
  () => props.friendsModal,
  (val) => {
    if (val) {
      playerAcc.value = props.playerAccount
    }
  }
)
const { friendsData } = toRefs(props)

const newFriendsData = ref({})

// 時間格式
// const date = ref(0)
const totalTime = ref([])
for (let i = 0; i <= 6; i++) {
  const dateFrom = moment().subtract(i, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss')
  const dateTo = moment().subtract(i, 'day').endOf('day').hour(23).format('YYYY-MM-DD HH:mm:ss')
  const newTime = {
    time1: new Date(dateFrom.replace(' ', 'T')).toISOString(),
    time2: new Date(dateTo.replace(' ', 'T')).toISOString()
  }
  totalTime.value.push({
    initTime: dateFrom.replace('00:00:00', ''),
    newTime
  })
}

// 搜尋
let tempFriendsData
const search = async (e, acc) => {
  // if (e) {
  console.log(props.date)
  //   return
  // }
  const { data } = await getFriendsApi(e, props.date)
  if (data.code !== 200) return
  playerAcc.value = acc
  newFriendsData.value = data.data.data
  tempFriendsData = JSON.parse(JSON.stringify(newFriendsData.value))
}

watch(friendsData, (val) => {
  newFriendsData.value = JSON.parse(JSON.stringify(val))
  tempFriendsData = JSON.parse(JSON.stringify(val))
})

// 投注分紅總計
// const totalDividend = computed(() => newFriendsData.value.detail.reduce((a, b) => a + b.dividend, 0))

// VIP 資料
const vip = ref('all')
const vipData = () => {
  if (vip.value === 'all') return tempFriendsData.detail
  return tempFriendsData.detail.filter(({ vip_level: level }) => level === +vip.value)
}

// 搜尋玩家
const account = ref('')
const changeFriends = () => {
  if (!account.value) {
    newFriendsData.value.detail = vipData()
    console.log(newFriendsData.value.detail)
    return
  }
  newFriendsData.value.detail = vipData().filter((item) => item.account.match(account.value))
}

// 切換 VIP 等級
watch(vip, () => {
  account.value = ''
  changeFriends()
})

// modal 開關
const emit = defineEmits(['update:friendsModal'])
const closeModal = () => {
  emit('update:friendsModal', false)
  newFriendsData.value = JSON.parse(JSON.stringify(friendsData.value))
  tempFriendsData = JSON.parse(JSON.stringify(friendsData.value))
}

const sortStatus = ref({
  sorttype: '',
  whichdata: ''
})
// watch(sortStatus, (newV, oldV) => {
//   console.log(newV)
//   console.log(oldV)
// })
// sort
const sortdata = (sorttype, whichdata) => {
  if (sortStatus.value.sorttype === sorttype && sortStatus.value.whichdata === whichdata) {
    sortStatus.value.sorttype = sortStatus.value.sorttype === 'increase' ? 'decrease' : 'increase'
  } else {
    sortStatus.value = {
      sorttype: sorttype,
      whichdata: whichdata
    }
  }
  // increase
  // decrease
  function SortArray(x, y) {
    return x.account.localeCompare(y.account)
  }
  if (whichdata === 'account') {
    if (sortStatus.value.sorttype === 'decrease') {
      newFriendsData.value.detail.sort(SortArray)
    } else {
      newFriendsData.value.detail.sort(SortArray).reverse()
    }
  } else {
    newFriendsData.value.detail = newFriendsData.value.detail.sort((a, b) => {
      return sortStatus.value.sorttype === 'decrease' ? b[whichdata] - a[whichdata] : a[whichdata] - b[whichdata]
    })
  }

  // console.log(_data)
}
const checkTriangleImg = (sorttype, whichdata) => {
  if (sorttype === sortStatus.value.sorttype) {
    if (whichdata === sortStatus.value.whichdata) {
      return require('@/assets/icon/triangle-black.png')
    }
  }
  //
  //
  return require('@/assets/icon/triangle.png')
  //
  //
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 240px !important;
}
.flexCenter {
  display: flex;
  width: 100%;
  align-items: center;
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

.customSort {
  margin-left: 5px;
  // width: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 15px;
  user-select: none;
  img:nth-child(1) {
    height: 50%;
    object-fit: contain;
    margin-bottom: 1px;
  }
  img:nth-child(2) {
    height: 50%;
    object-fit: contain;
    transform: rotate(180deg);
    margin-top: 1px;
    // background: blue;
  }
}
</style>
