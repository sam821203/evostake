<template>
  <div class="btnGroup">
    <div :class="[mode == 'today' ? 'L1' : 'L2']" @click="changeDate('today')">
      {{ $t("gameRecord.today") }}
    </div>
    <div
      :class="[mode == 'yesterday' ? 'M1' : 'M2']"
      @click="changeDate('yesterday')"
    >
      {{ $t("gameRecord.yesterday") }}
    </div>
    <div
      :class="[mode == 'thisweek' ? 'M1' : 'M2']"
      @click="changeDate('thisweek')"
    >
      {{ $t("gameRecord.七日") }}
    </div>
    <div
      :class="[mode == 'lastweek' ? 'R1' : 'R2']"
      @click="changeDate('lastweek')"
    >
      {{ $t("gameRecord.十四日") }}
    </div>
  </div>
  <div class="dataBoard">
    <table border="1">
      <tr>
        <th class="level">Nível de convite</th>
        <td class="deposit">Reembolso de depósitos</td>
        <td class="bet">Reembolso de apostas</td>
      </tr>
      <tr v-for="(item, key) in listData" :key="item">
        <th>Level {{ key }}</th>
        <td v-price="item.charge_rebate"></td>
        <td v-price="item.bet_rebate"></td>
      </tr>
      <tr>
        <th>Total</th>
        <td v-price="depositReb"></td>
        <td v-price="betReb"></td>
      </tr>
      <tr>
        <th>Reembolso total</th>
        <td colspan="2" v-price="total"></td>
      </tr>
    </table>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getRebateApi } from "@/api/friends";
import { useLoading } from "@/store/loadingStore";

const startTime = ref(new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
const endTime = ref(new Date().toISOString());
const mode = ref("today");
const loadingStore = useLoading();

const listData = ref(null);
const betReb = ref(null);
const depositReb = ref(null);
const total = ref(null);

const getData = async () => {
  loadingStore.$patch({
    loadingStatus: true,
  });
  const { data } = await getRebateApi(startTime.value, endTime.value);
  if (data.code === 0) {
    loadingStore.$patch({ loadingStatus: false });
  }
  console.log(data);
  listData.value = data.data.level_rebates;
  betReb.value = data.data.total_bet_rebate;
  depositReb.value = data.data.total_charge_rebate;
  total.value = data.data.total;
};

const changeDate = (e) => {
  mode.value = e;
  var startdate = new Date();
  var enddate = new Date();
  var date = new Date();
  switch (e) {
    case "today":
      startdate.setHours(0, 0, 0, 0);
      break;
    case "yesterday":
      startdate.setDate(date.getDate() - 1);
      startdate.setHours(0, 0, 0, 0);
      enddate.setDate(date.getDate() - 1);
      enddate.setHours(23, 59, 59, 59);
      break;
    case "thisweek":
      startdate.setDate(date.getDate() - 7);
      startdate.setHours(0, 0, 0, 0);
      // enddate.setDate(date.getDate());
      // enddate.setHours(23, 59, 59, 59);
      break;
    case "lastweek":
      startdate.setDate(date.getDate() - 14);
      startdate.setHours(0, 0, 0, 0);
      // enddate.setDate(date.getDate());
      // enddate.setHours(23, 59, 59, 59);
      break;
  }
  startTime.value = new Date(startdate).toISOString();
  endTime.value = new Date(enddate).toISOString();
  getData();
};

getData();
</script>

<style lang="scss" scoped>
.btnGroup {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
  div {
    padding: 0.5rem 1rem;
    width: 25%;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    color: white;
    display: inline-block;
    font-size: 1rem;
    word-break: keep-all;
    text-align: center;
  }
  .L1 {
    background-image: url("@/assets/images/leaderBoard/topBtn/paging_L_1.png");
  }
  .L2 {
    background-image: url("@/assets/images/leaderBoard/topBtn/paging_L_2.png");
  }
  .M1 {
    background-image: url("@/assets/images/leaderBoard/topBtn/paging_M_1.png");
  }
  .M2 {
    background-image: url("@/assets/images/leaderBoard/topBtn/paging_M_2.png");
  }
  .R1 {
    background-image: url("@/assets/images/leaderBoard/topBtn/paging_R_1.png");
  }
  .R2 {
    background-image: url("@/assets/images/leaderBoard/topBtn/paging_R_2.png");
  }
}
.dataBoard {
  width: 95%;
  margin: 0 auto;
  margin-top: 5%;
  table {
    border-collapse: collapse;
    font-size: 10px;
    text-align: center;
    margin: 0 auto;
    width: 100%;
    th {
      background-color: #8c17c2;
      height: 2rem;
    }
    tr {
      &:first-child {
        background-color: #8c17c2;
        height: 2.5rem;
      }
    }
  }
}
</style>
