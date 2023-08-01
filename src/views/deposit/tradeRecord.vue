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
  <!--  -->
  <table border="0">
    <tr class="thead">
      <td>{{ t("gameRecord.time") }}</td>
      <td>{{ t("類型") }}</td>
      <td>{{ t("金額") }}</td>
      <td>{{ t("狀態") }}</td>
      <td></td>
    </tr>
    <template v-for="(v, k) in tradeRecord_Data" :key="k + 'k'">
      <!-- v-show="v.log_type != 1" -->
      <tr>
        <td>
          {{ new Date(v.create_time).toLocaleString("en-GB") }}
        </td>
        <td>
          <!-- <span>{{ v.log_type == 2 ? "三方" : "一般" }}</span> -->
          <!-- <br /> -->
          <span>{{ t(showWhichTradeType(v.log_type, v.type)) }}</span>
        </td>
        <td
          v-price="v.amount"
          :style="{ color: v.amount < 0 ? '#c80000' : '' }"
        ></td>
        <td :style="{ color: statusColor(v.status) }">
          {{ changeStatus(v.status) }}
        </td>
        <td @click="openDetailTR(k)">
          <div v-if="v.log_type != 1" :class="[v.pageStatus ? 'rotate90' : '']">
            >
          </div>
        </td>
      </tr>
      <tr v-if="v.log_type != 1 && v.pageStatus">
        <td colspan="5" class="detailTD">
          <detailRecord :id="v.id" :logType="v.log_type" v-if="true" />
        </td>
      </tr>
    </template>
  </table>
  <!-- <div class="table">
    <div class="tr">
      <div class="td"></div>
      <div class="td"></div>
      <div class="td"></div>
      <div class="td"></div>
      <div class="td"></div>
    </div>
    <template v-for="(v, k) in tradeRecord_Data" :key="k + 'k'">
      <div class="tr" v-show="v.log_type != 1">
        <div class="td">{{ new Date(v.create_time).toLocaleString() }}</div>
        <div class="td">
          <span>{{ v.log_type == 1 ? "一般交易" : "線上交易" }}</span>
          <span>{{ v.type }}</span>
        </div>
        <div v-price="v.amount" class="td"></div>
        <div class="td">{{ v.status }}</div>
        <div @click="openDetailTR(k)" class="td">
          <span v-if="v.log_type != 1">></span>
        </div>
      </div>
      <div v-if="v.pageStatus" class="tr trdetail">
        <div class="td" style="width: 100%">
          <detailRecord :id="v.id" :logType="v.log_type" />
        </div>
      </div>
    </template>
  </div> -->
</template>

<script setup>
import { ref, watch, onMounted } from "vue-demi";
import request from "@/utils/request.js";
import { getPlayerId } from "@/utils/cookie";
import detailRecord from "./tradeRecord_detail.vue";
import i18n from "@/utils/i18n";
const { t } = i18n.global;
const mode = ref("today");
// 初始 是今天
const startTime = ref(new Date(new Date().setHours(0, 0, 0, 0)).toISOString());
const endTime = ref(new Date().toISOString());
// 改變日期
const changeDate = (e) => {
  mode.value = e;
  var startdate = new Date();
  var enddate = new Date();
  var date = new Date();
  tradeRecord_Data.value = [];
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
  getdata1();
};
//
const showWhichTradeType = (logtype, type) => {
  var words = type;
  if (logtype == 2) {
    if (type == "cashin") {
      words = "三方存款";
    } else if (type == "cashout") {
      words = "三方提款";
    }
  }
  return words;
};
const getdata1 = async () => {
  const { data } = await request()({
    url: `/member/trade_log?user_uuid=${getPlayerId()}&start_time=${
      startTime.value
    }&end_time=${endTime.value}`,
    method: "get",
  });
  tradeRecord_Data.value = data.data.data;
};
// 判斷狀態要用啥顏色
const statusColor = (status) => {
  var color = "red";
  if (status.includes("成功")) {
    color = "#00c900";
  } else if (status.includes("失敗")) {
    color = "#c80000";
  } else {
    color = "#808080";
  }
  return color;
};
const changeStatus = (e) => {
  var word = "";
  switch (e) {
    case "成功":
      word = "Confirmado";
      break;
    case "訂單初始":
      word = "Processando";
      break;
    case "等待核審1":
      word = "Processando";
      break;
    case "等待處理":
      word = "Processando";
      break;
    case "訂單成功":
      word = "Confirmado";
      break;
    case "訂單失敗":
      word = "Falhou";
      break;

    case "手動成功":
      word = "Confirmado";
      break;
    case "等待核審2":
      word = "Processando";
      break;
    case "等待三方確認":
      word = "Processando";
      break;
    case "拒絕訂單":
      word = "Falhou";
      break;
    default:
      word = e;
  }
  return word;
};
const tradeRecord_Data = ref([]);

watch(tradeRecord_Data, (val) => {
  if (val != null) {
    val.forEach((e) => {
      e.pageStatus = false;
    });
  }
});
onMounted(() => {
  changeDate("today");
});
const openDetailTR = (e) => {
  // console.log(tradeRecord_Data);
  // console.log(e);
  tradeRecord_Data.value[e].pageStatus = !tradeRecord_Data.value[e].pageStatus;
};
</script>

<style lang="scss" scoped>
.btnGroup {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
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

table {
  margin: auto;
  width: calc(100%);
  text-align: center;
  font-size: 0.8rem;
  // color: #2d4c76;
  word-break: keep-all;
  border-collapse: collapse;
  .thead {
    background: #2d4c76;
    color: #5eeeff;

    td {
      padding-top: 0.5rem;
      padding-bottom: 0.5rem;
    }
  }
  tr {
    width: 100%;
    .rotate90 {
      transform: rotate(90deg);
    }
    td {
      padding: 0.25rem 0;
    }
    td:nth-child(1) {
      width: 25%;
    }
    // td:nth-child(2) {
    //   width: 23%;
    // }
    // td:nth-child(3) {
    //   width: 25%;
    // }
    // td:nth-child(4) {
    //   width: 15%;
    // }
    td:nth-child(5) {
      width: 7%;
      padding-right: 0.5rem;
    }
    .detailTD {
      padding-right: 0.5rem;
      padding-left: 0.5rem;
    }
  }
}
</style>
