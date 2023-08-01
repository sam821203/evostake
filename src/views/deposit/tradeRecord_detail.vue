<template>
  <table>
    <tr>
      <td colspan="2">
        <span>{{ $t("單號") }}:</span>
        <br />
        <span>{{ tabledata.oid }}</span>
      </td>
    </tr>
    <tr>
      <td>
        <span>{{ $t("實際金額") }}:</span>
        <br />
        <span v-price="tabledata.amount"></span>
      </td>

      <td>
        <span>{{ $t("存款類型") }}:</span>
        <br />
        <span>{{ tabledata.type }}</span>
      </td>
    </tr>
    <tr v-if="false">
      <td>
        <span>手續費:</span>
        <br />
        <span>沒這東西</span>
      </td>
      <td>
        <span>銀行卡號:</span>
        <br />
        <span></span>
      </td>
    </tr>
    <!-- <tr>
      <td></td>
      <td></td>
    </tr> -->
  </table>
</template>
<script setup>
import { defineProps, onMounted, ref } from "vue"; //, toRefs, ref
import request from "@/utils/request.js";
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  logType: {
    type: String,
    default: "",
  },
});
// console.log(props);
const tabledata = ref("");
// const { type: propsType } = toRefs(props);
// const type = ref(propsType.value);
// type.value = 123;

const getdata = async () => {
  const { data } = await request()({
    url: `/member/trade_log/${props.id}/?logtype=${props.logType}`,
    method: "get",
  });
  data.data.data.content = JSON.parse(data.data.data.content);
  tabledata.value = data.data.data;
};

onMounted(() => {
  getdata();
});
</script>
<style lang="scss" scoped>
table {
  text-align: center;
  width: 100%;
  padding-right: 1rem;
  border-collapse: collapse;

  tr {
    text-align: left;
    // border: 5px solid transparent;
    td {
      border: 1px solid transparent;
      span:nth-child(3) {
        // color: black;
      }
    }
    td {
      border-color: #2d4c76 #2d4c76 #2d4c76 transparent;
      padding: 0.2rem;
    }
  }
}
</style>
