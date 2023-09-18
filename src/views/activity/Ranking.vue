<template>
  <section>
    <h2>{{ $t('排行榜') }}</h2>
    <div class="cardGroup">
      <div class="card">
        <h3>{{ $t('流水排行') }}</h3>
        <el-select v-model="time.flow" @change="search(time.flow)">
          <el-option :label="$t('請選擇時間')" value="" disabled />
          <el-option v-for="item in time.totalFlow" :key="item.init" :label="$t(item.time)" :value="item.init" />
        </el-select>
        <ul>
          <li v-for="item in totalData.flow" :key="item.player_id">
            <p>{{ item.top_n }}. {{ item.account }}</p>
            <p>{{ (item.socre / 10000).toFixed(2)}}</p>
          </li>
        </ul>
      </div>
      <div class="card">
        <h3>{{ $t('推薦排行') }}</h3>
        <el-select v-model="time.invite" @change="search(time.invite)">
          <el-option :label="$t('請選擇時間')" value="" disabled />
          <el-option v-for="item in time.totalInvite" :key="item.init" :label="$t(item.time)" :value="item.init" />
        </el-select>
        <ul>
          <li v-for="item in totalData.invite" :key="item.player_id">
            <p>{{ item.top_n }}. {{ item.account }}</p>
            <p v-money="item.socre / 10000"></p>
          </li>
        </ul>
      </div>
      <div class="card">
        <h3>{{ $t('活動排行') }}</h3>
        <p>{{ $t('暫無資料') }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue-demi'
import { getRankingApi } from '@/api/activity'

const time = ref({
  flow: '',
  invite: ''
})
const totalData = ref({})

const handleTime = (data) => {
  return data.map((item) => {
    const arr = item.split('_')
    return {
      time: `${arr[1].substr(-4)} - ${arr[2].substr(-4)}`,
      init: item
    }
  })
}

const getTime = async () => {
  const { data } = await getRankingApi()
  time.value.totalFlow = handleTime(data.data.rank_flow)
  time.value.totalInvite = handleTime(data.data.rank_invite)
}
getTime()

const search = async (time) => {
  const { data } = await getRankingApi(time)

  if (time.includes('flow')) {
    totalData.value.flow = data.data.rank
  }

  if (time.includes('invite')) {
    totalData.value.invite = data.data.rank
  }
}
</script>

<style lang="scss" scoped>
.cardGroup {
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  @include breakpoint-up('sm') {
    padding-top: 10px;
    flex-direction: column;
    align-items: center;
  }
  .card {
    background-color: $light;
    border-radius: 5px;
    padding: 10px 20px;
    min-width: 350px;
    text-align: center;
    margin-right: 10px;
    overflow-y: scroll;
    height: calc(100vh - 180px);
    ul {
      margin-top: 10px;
      li {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        p {
          &:last-child {
            margin-left: 10px;
          }
        }
      }
    }
    &.big {
      min-width: 500px;
    }
    @include breakpoint-up('sm') {
      margin-bottom: 10px;
      height: auto;
    }
    .wait {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    }
    .black {
      border-bottom: 1px solid #c8bfbf;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .title {
      display: flex;
    }
    h3 {
      margin: 0 0 10px 0;
      padding-bottom: 10px;
      font-size: 20px;
      border-bottom: 1px solid #c8bfbf;
    }
    p {
      color: black;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 5px;
      white-space: nowrap;
      &.opacity {
        opacity: 0;
      }
    }
  }
}
</style>
