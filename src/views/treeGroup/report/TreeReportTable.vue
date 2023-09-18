<template>
  <table class="originTable" :data-name="tableName" id="table">
    <thead>
      <tr>
        <th>{{ $t(tableType === 'total' ? parentName : childName) }}{{ $t('資訊') }}</th>
        <th colspan="11">{{ $t('輸贏報表') }}</th>
      </tr>
    </thead>
    <template v-if="!detailReport.length">
      <tbody>
        <tr class="noData">
          <td colspan="14">{{ $t('無資料') }}</td>
        </tr>
      </tbody>
    </template>
    <template v-else>
      <tbody v-for="item in detailReport" :key="item.from_agent_id" :class="{ detailed: tableType === 'detail' }">
        <template v-for="(detail, key, index) of item.game_detail" :key="key">
          <tr>
            <td v-if="index === 0" :rowspan="Object.keys(item.game_detail).length * 2 + 2">
              {{ account(item.from_agent_id) }}
            </td>
            <td rowspan="2" v-game="key"></td>
            <td v-if="isTreeGroupPath">{{ $t('投注人數') }}</td>
            <td>{{ $t('總投注') }}</td>
            <td v-if="!isTreeGroupPath">{{ $t('總贏分') }}</td>
            <td>{{ $t('總輸贏') }}</td>
            <template v-if="key === 'goldenwind_pk'">
              <template v-if="isTreeGroupPath">
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </template>
              <template v-else>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </template>
              <td v-if="isTreeGroupPath">{{ $t('贏分服務費') }}</td>
              <td v-else>{{ $t('總淨利') }}</td>
              <td v-if="isTreeGroupPath">{{ $t('佔成%') }}</td>
            </template>
            <template v-else>
              <td>{{ $t('有效投注') }}</td>
              <td>{{ $t('返水') }}‰</td>
              <td>{{ $t('返水') }}</td>
              <td>{{ $t('總淨利') }}</td>
              <td v-if="isTreeGroupPath">{{ $t('分潤') }}%</td>
            </template>
            <td v-if="isTreeGroupPath">{{ $t('分潤') }}</td>
          </tr>
          <tr>
            <td v-if="isTreeGroupPath">{{ detail.bet_ppl }}</td>
            <td v-money="detail.bet / 10000"></td>
            <td v-if="!isTreeGroupPath" v-money="detail.win / 10000"></td>
            <td v-money="detail.winlose / 10000"></td>
            <template v-if="key === 'goldenwind_pk'">
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td v-if="isTreeGroupPath" v-money="detail.service_charge / 10000"></td>
              <td v-else v-money="detail.net_win / 10000"></td>
              <td v-if="isTreeGroupPath">{{ detail.percent / 1000 }}</td>
            </template>
            <template v-else>
              <td v-money="detail.rt / 10000"></td>
              <td>{{ detail.rt_percent / 100 }}</td>
              <td v-money="detail.bonus / 10000"></td>
              <td v-money="detail.net_win / 10000"></td>
              <td v-if="isTreeGroupPath">{{ detail.percent / 1000 }}</td>
            </template>
            <!-- 分潤: 總淨利 - 上繳 -->
            <td v-if="isTreeGroupPath" v-money="detail.net_win / 10000 - detail.amount / 10000"></td>
          </tr>
        </template>
        <template v-if="isTreeGroupPath">
          <tr>
            <td rowspan="2">{{ $t('小計') }}</td>
            <td colspan="3">{{ $t('本級分潤') }}</td>
            <td colspan="2"></td>
            <td>{{ tableType === 'total' ? $t('下級返水') : '' }}</td>
            <td>{{ tableType === 'total' ? $t('下級分潤') : '' }}</td>
            <td colspan="2">{{ tableType === 'total' ? $t('我的獲利') : '' }}</td>
          </tr>
          <tr>
            <!-- 本級分潤 = 分潤(加總所有遊戲分潤) -->
            <td colspan="3" v-money="item.total_net_win / 10000 - item.total_amount / 10000"></td>
            <td colspan="2"></td>
            <!-- 下級返水 -->
            <td v-if="tableType === 'total'" v-money="item.last_bonus / 10000"></td>
            <td v-if="tableType !== 'total'" colspan="2"></td>
            <!-- 下級分潤 -->
            <td v-if="tableType === 'total'" v-money="item.last_profit / 10000"></td>
            <!-- 我的獲利：本級玩家上繳 + 下級上繳 - 上繳 -->
            <td colspan="2" v-if="tableType === 'total'" v-money="item.mine_profit / 10000"></td>
            <td v-else colspan="2"></td>
          </tr>
        </template>
        <template v-else>
          <tr>
            <td rowspan="2">{{ $t('小計') }}</td>
            <td>{{ $t('總投注') }}</td>
            <td v-if="!isTreeGroupPath">{{ $t('總贏分') }}</td>
            <td>{{ $t('總輸贏') }}</td>
            <td>{{ $t('有效投注') }}</td>
            <td></td>
            <td>{{ $t('返水') }}</td>
            <td>{{ $t('總淨利') }}</td>
          </tr>
          <tr>
            <td v-money="item.total_bet / 10000"></td>
            <td v-if="!isTreeGroupPath" v-money="item.total_win / 10000"></td>
            <td v-money="item.total_winlose / 10000"></td>
            <td v-money="item.total_rt / 10000"></td>
            <td></td>
            <td v-money="item.total_bonus / 10000"></td>
            <td v-money="item.total_net_win / 10000"></td>
          </tr>
        </template>
      </tbody>
    </template>
  </table>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, computed, toRefs } from 'vue-demi'
import useStore from '@/store/index'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  tableType: String,
  detailReport: Array,
  detailRrofit: String,
  playerRrofit: String
})
const { detailReport } = toRefs(props)

const route = useRoute()
const isTreeGroupPath = computed(() => route.path === '/treeGroup')

const { treeStore } = useStore()
const { targetTree, treeTotal, groupData } = storeToRefs(treeStore)

const account = (id) => {
  return treeTotal.value.filter((item) => item.agent_id === id)[0]?.name
}

const tableName = ref('')
const { t } = useI18n()
tableName.value = props.tableType === 'total' ? t('輸贏總匯') : account(detailReport.value[0]?.from_agent_id)

const parentName = computed(() => treeStore.levelText(isTreeGroupPath.value ? targetTree.value.level : groupData.value.level))
const childName = computed(() => treeStore.levelText(isTreeGroupPath.value ? targetTree.value.level + 1 : groupData.value.level + 1))
</script>
