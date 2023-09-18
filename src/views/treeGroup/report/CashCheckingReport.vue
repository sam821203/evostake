<template>
  <section class="total">
    <h2>
      {{ $t("代理對帳")
      }}<el-popover placement="bottom" width="auto" trigger="hover">
        <ul class="formula" :class="{ isEn }">
          <li>
            <span>{{ $t("歷史總註冊數") }}</span
            ><span>=</span>{{ $t("開站至今的註冊人數加總。") }}
          </li>
          <li>
            <span>{{ $t("歷史總轉正數") }}</span
            ><span>=</span>{{ $t("開站至今由測試轉為正式帳號的人數加總。") }}
          </li>
          <li>
            <span>{{ $t("註冊人數") }}</span
            ><span>=</span>{{ $t("區間內的註冊人數。") }}
          </li>
          <li>
            <span>{{ $t("轉正人數") }}</span
            ><span>=</span>{{ $t("區間內由測試轉為正式帳號的人數加總。") }}
          </li>
          <li>
            <span>{{ $t("活動紅利") }}</span
            ><span>=</span>{{ $t("非例行性優惠活動的紅利加總。") }}
          </li>
          <li>
            <span>{{ $t("VIP紅利") }}</span
            ><span>=</span>{{ $t("VIP相關活動的紅利加總。") }}
          </li>
          <li>
            <span>{{ $t("小遊戲紅利") }}</span
            ><span>=</span>{{ $t("小遊戲贈送的紅利加總。") }}
          </li>
          <li>
            <span>{{ $t("返水") }}</span
            ><span>=</span>{{ $t("「(有效投注) * (返水‰)」的計算結果。") }}
          </li>
          <li>
            <span>{{ $t("總紅利") }}</span
            ><span>=</span>{{ $t("「(活動紅利) + (VIP紅利) + (小遊戲紅利) + (返水)」的計算結果。") }}
          </li>
          <li>
            <span>{{ $t("首存人數") }}</span
            ><span>=</span>{{ $t("區間內進行帳號首次存款的人數加總。") }}
          </li>
          <li>
            <span>{{ $t("續存人數") }}</span
            ><span>=</span>{{ $t("區間內排除首存後，不重複存款人數加總。") }}
          </li>
          <li>
            <span>{{ $t("總存款人數") }}</span
            ><span>=</span>{{ $t("區間內不重複存款人數加總。") }}
          </li>
          <li>
            <span>{{ $t("總存款次數") }}</span
            ><span>=</span>{{ $t("區間內所有存款的次數加總。") }}
          </li>
          <li>
            <span>{{ $t("總提款人數") }}</span
            ><span>=</span>{{ $t("區間內不重複提款人數加總。") }}
          </li>
          <li>
            <span>{{ $t("總提款次數") }}</span
            ><span>=</span>{{ $t("區間內所有提款的次數加總。") }}
          </li>
          <li>
            <span>{{ $t("首存金額") }}</span
            ><span>=</span>{{ $t("區間內所有帳號進行生涯首存的金額。") }}
          </li>
          <li>
            <span>{{ $t("續存金額") }}</span
            ><span>=</span>{{ $t("區間內排除首存金額，所有帳號後續存款並成功的金額加總。") }}
          </li>
          <li>
            <span>{{ $t("總存款") }}</span
            ><span>=</span>{{ $t("區間內總存款金額加總。") }}
          </li>
          <li>
            <span>{{ $t("總提款") }}</span
            ><span>=</span>{{ $t("區間內總提款金額加總。") }}
          </li>
          <li>
            <span>{{ $t("存提差") }}</span
            ><span>=</span>{{ $t("「(總存款) - (總提款)」的計算結果。") }}
          </li>
          <li>
            <span>{{ $t("投注人數") }}</span
            ><span>=</span>{{ $t("區間內不重複的有效投注人數加總。") }}
          </li>
          <li>
            <span>{{ $t("總投注") }}</span
            ><span>=</span>{{ $t("區間內所有玩家的投注總額。") }}
          </li>
          <li>
            <span>{{ $t("有效投注") }}</span
            ><span>=</span>{{ $t("區間內所有玩家的有效投注總額。") }}
          </li>
          <li>
            <span>{{ $t("總贏分") }}</span
            ><span>=</span>{{ $t("區間內遊戲中玩家贏分加總。") }}
          </li>
          <li>
            <span>{{ $t("總輸贏") }}</span
            ><span>=</span>{{ $t("「(總投注) - (總贏分)」的計算結果。") }}
          </li>
          <li>
            <span>{{ $t("總營收") }}</span
            ><span>=</span>{{ $t("「(總輸贏) - (總紅利)」的計算結果。") }}
          </li>
        </ul>
        <template #reference>
          <el-icon :size="25"><InfoFilled color="#ad8d60" /></el-icon>
        </template>
      </el-popover>
    </h2>
    <div v-if="!mobileWidth">
      <table class="originTable mb-10" :data-name="$t('代理對帳-1')" id="table">
        <thead>
          <tr>
            <th>{{ $t("歷史總註冊數") }}</th>
            <th>{{ $t("歷史總轉正數") }}</th>
            <th>{{ $t("註冊人數") }}</th>
            <th>{{ $t("轉正人數") }}</th>
          </tr>
        </thead>
        <template v-if="!Object.keys(totalTreeData).length">
          <tbody>
            <tr class="noData">
              <td colspan="4">{{ $t("無資料") }}</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody>
            <tr>
              <td v-money="cashCheckingReport.history_sing_up"></td>
              <td v-money="cashCheckingReport.history_be_formal"></td>
              <td v-money="cashCheckingReport.sing_up"></td>
              <td v-money="cashCheckingReport.be_formal"></td>
            </tr>
          </tbody>
        </template>
      </table>

      <table class="originTable mb-10" :data-name="$t('代理對帳-2')" id="table">
        <thead>
          <tr>
            <th>{{ $t("活動紅利") }}</th>
            <th>{{ $t("VIP紅利") }}</th>
            <th>{{ $t("返利紅利") }}</th>
            <th>{{ $t("小遊戲紅利") }}</th>
            <th>{{ $t("返水") }}</th>
            <th>{{ $t("總紅利") }}</th>
          </tr>

        </thead>
        <template v-if="!Object.keys(totalTreeData).length">
            <tbody>
              <tr class="noData">
                <td colspan="5">{{ $t("無資料") }}</td>
              </tr>
            </tbody>
          </template>
          <template v-else>
            <tbody>
              <tr>
                <td v-money="cashCheckingReport.event_dividend / 10000"></td>
                <td v-money="cashCheckingReport.vip_dividend / 10000"></td>
                <td v-money="cashCheckingReport.rebate_dividend / 10000"></td>
                <!-- <td v-money="cashCheckingReport.lucky_jug / 10000"></td> -->
                <td v-money="cashCheckingReport.mini_game / 10000"></td>
                <td v-money="cashCheckingReport.rebate / 10000"></td>
                <!-- 總紅利 = 活動彩金 + 返利紅利 + VIP彩金 + 幸運壺罐 + 返水 -->
                <td
                  v-money="
                    (cashCheckingReport.event_dividend +
                    cashCheckingReport.rebate_dividend+
                      cashCheckingReport.vip_dividend +
                      cashCheckingReport.mini_game +
                      cashCheckingReport.rebate) /
                    10000
                  "
                ></td>
              </tr>
            </tbody>
          </template>
      </table>

      <table class="originTable mb-10" :data-name="$t('代理對帳-3')" id="table">
        <thead>
          <tr>
            <th>{{ $t("首存人數") }}</th>

            <!-- new -->
            <th>{{ $t("續存人數") }}</th>
            <th>{{ $t("總存款人數") }}</th>
            <th>{{ $t("總存款次數") }}</th>
            <th>{{ $t("總提款人數") }}</th>
            <th>{{ $t("總提款次數") }}</th>
            <!-- <th v-if="targetTree.level < 2">{{ $t('存提手續費') }}</th> -->
          </tr>
        </thead>
        <template v-if="!Object.keys(totalTreeData).length">
          <tbody>
            <tr class="noData">
              <td colspan="14">{{ $t("無資料") }}</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody>
            <tr>
              <td>{{ nulldataShowZero(cashCheckingReport.first_charge) }}</td>
              <td>{{ nulldataShowZero(cashCheckingReport.continuing_charge) }}</td>
              <td>{{ nulldataShowZero(cashCheckingReport.charge_ppl) }}</td>
              <td>{{ nulldataShowZero(cashCheckingReport.charge_fre) }}</td>
              <td>{{ nulldataShowZero(cashCheckingReport.consign_ppl) }}</td>
              <td>{{ nulldataShowZero(cashCheckingReport.consign_fre) }}</td>
              <!-- <td v-if="targetTree.level < 2">-</td> -->
            </tr>
          </tbody>
        </template>
      </table>

      <!-- 01001 -->
      <table class="originTable" :data-name="$t('代理對帳-4')" id="table">
        <thead>
          <tr>
            <th>{{ $t("首存金額") }}</th>
            <th>{{ $t("續存金額") }}</th>
            <th>{{ $t("總存款") }}</th>
            <th>{{ $t("總提款") }}</th>
            <th>{{ $t("存提差") }}</th>
          </tr>
        </thead>
        <template v-if="!Object.keys(totalTreeData).length">
          <tbody>
            <tr class="noData">
              <td colspan="14">{{ $t("無資料") }}</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody>
            <tr>
              <td v-money="cashCheckingReport.total_first_charge / 10000"></td>
              <!-- v-money="totalTreeData.total_bet / 10000" -->
              <td v-money="cashCheckingReport.total_continuing_charge / 10000"></td>
              <td v-money="cashCheckingReport.total_charge / 10000"></td>
              <td v-money="cashCheckingReport.total_consign / 10000"></td>
              <td v-money="(cashCheckingReport.total_charge - cashCheckingReport.total_consign) / 10000"></td>
            </tr>
          </tbody>
        </template>
      </table>
      <!-- 01001 -->

      <table class="originTable" :data-name="$t('代理對帳-5')" id="table" style="margin-top: 1rem">
        <thead>
          <tr>
            <th>{{ $t("投注人數") }}</th>
            <th>{{ $t("總投注") }}</th>
            <th>{{ $t("有效投注") }}</th>
            <th>{{ $t("總贏分") }}</th>
            <th>{{ $t("總輸贏") }}</th>
            <!-- <th>{{ $t('總淨利') }}</th>
            <th>{{ $t('下級返水') }}</th>
            <th>{{ $t('本級分潤') }}</th> -->
            <th>{{ $t("總營收") }}</th>
          </tr>
        </thead>
        <template v-if="!Object.keys(totalTreeData).length">
          <tbody>
            <tr class="noData">
              <td colspan="14">{{ $t("無資料") }}</td>
            </tr>
          </tbody>
        </template>
        <template v-else>
          <tbody>
            <tr>
              <td>{{ nulldataShowZero(cashCheckingReport.total_bet_count) }}</td>
              <td v-money="totalTreeData.total_bet / 10000"></td>
              <td v-money="cashCheckingReport.total_valid_bet / 10000"></td>
              <td v-money="(totalTreeData.total_bet - totalTreeData.total_winlose) / 10000"></td>
              <td v-money="totalTreeData.total_winlose / 10000"></td>
              <!-- <td v-money="totalTreeData.total_net_win / 10000"></td>
              <td v-money="totalTreeData.last_bonus / 10000"></td>
              <td v-money="totalProfit / 10000"></td> -->
              <!-- totalIncome / 10000 -->
              <td
                v-money="
                  (totalTreeData.total_winlose -
                    (cashCheckingReport.event_dividend +
                      cashCheckingReport.vip_dividend +
                      cashCheckingReport.mini_game +
                      cashCheckingReport.rebate_dividend)) /
                  10000
                "
              ></td>
              <!-- <td></td> -->
            </tr>
          </tbody>
        </template>
      </table>
    </div>
    <div v-else class="mobileCard">
      <ul>
        <li>
          <p>{{ $t("註冊人數") }}</p>
          <p>{{ cashCheckingReport.sing_up }}</p>
        </li>
        <li>
          <p>{{ $t("首存人數") }}</p>
          <p>{{ cashCheckingReport.first_charge }}</p>
        </li>
        <li>
          <p>{{ $t("總存款人數/次數") }}</p>
          <p>{{ cashCheckingReport.charge_ppl }} / {{ cashCheckingReport.charge_fre }}</p>
        </li>
        <li>
          <p>{{ $t("總提款人數/次數") }}</p>
          <p>{{ cashCheckingReport.consign_ppl }} / {{ cashCheckingReport.consign_fre }}</p>
        </li>
        <li>
          <p>{{ $t("總存款") }}</p>
          <p v-money="cashCheckingReport.total_charge / 10000"></p>
        </li>
        <li>
          <p>{{ $t("總提款") }}</p>
          <p v-money="cashCheckingReport.total_consign / 10000"></p>
        </li>
        <li>
          <p>{{ $t("存提差") }}</p>
          <p v-money="(cashCheckingReport.total_charge - cashCheckingReport.total_consign) / 10000"></p>
        </li>
        <!-- <li v-if="targetTree.level < 2">
          <p>{{ $t('存提手續費') }}</p>
          <td>-</td>
        </li> -->
        <li>
          <p>{{ $t("總紅利") }}</p>
          <p v-money="cashCheckingReport.total_bonus / 10000"></p>
        </li>
        <li>
          <p>{{ $t("投注人數") }}</p>
          <p>{{ cashCheckingReport.total_bet_count }}</p>
        </li>
        <li>
          <p>{{ $t("總投注") }}</p>
          <p v-money="totalTreeData.total_bet / 10000"></p>
        </li>
        <li>
          <p>{{ $t("總輸贏") }}</p>
          <p v-money="totalTreeData.total_winlose / 10000"></p>
        </li>
        <li>
          <p>{{ $t("總淨利") }}</p>
          <p v-money="totalTreeData.total_net_win / 10000"></p>
        </li>
        <li>
          <p>{{ $t("下級返水") }}</p>
          <p v-money="totalTreeData.last_bonus / 10000"></p>
        </li>
        <li>
          <p>{{ $t("本級分潤") }}</p>
          <p v-money="totalProfit / 10000"></p>
        </li>
        <li>
          <p>{{ $t("總營收") }}</p>
          <p v-money="totalIncome / 10000"></p>
        </li>
        <li v-if="targetTree.level < 2"></li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed, toRefs, inject } from 'vue-demi'
import useStore from '@/store/index'

const isEn = localStorage.getItem('locale') === 'EN'

const props = defineProps({
  totalTreeData: {
    type: Object,
    default: () => ({})
  },
  cashCheckingReport: {
    type: Object,
    default: () => ({})
  }
})

const { totalTreeData, cashCheckingReport } = toRefs(props)

const { treeStore } = useStore()
const { targetTree } = storeToRefs(treeStore)

// 本級分潤
const totalProfit = computed(() => {
  return totalTreeData.value.total_net_win - totalTreeData.value.total_amount - totalTreeData.value.last_profit
})

const totalIncome = computed(() => {
  if (targetTree.value.level > 1 && targetTree.value.level < 6) {
    // 1~4級的總收益: 本級分潤 - 總紅利 + 下級返水
    return totalProfit.value - cashCheckingReport.value.total_bonus + totalTreeData.value.last_bonus
  }

  if (targetTree.value.level === 6) {
    // 5級的總收益: 本級分潤 - 總紅利
    return totalProfit.value - cashCheckingReport.value.total_bonus
  }

  return totalProfit.value
})

// 斷點
const { clientWidth } = inject('clientWidth')
const mobileWidth = computed(() => clientWidth.value === 'sm')
// 沒有數值要秀0
// 0523
const nulldataShowZero = (e) => {
  const sdata = e === undefined ? 0 : e
  return sdata
}
</script>

<style lang="scss" scoped>
.mb-10 {
  margin-bottom: 10px;
}

.el-icon {
  margin-left: 10px;
}

.formula {
  &.isEn {
    span {
      &:first-child {
        min-width: 180px !important;
      }
    }
  }
  span {
    &:first-child {
      min-width: 140px !important;
    }
  }
}
</style>
