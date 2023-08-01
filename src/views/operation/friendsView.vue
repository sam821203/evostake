<template>
  <div class="option-wrap">
    <div
      :class="['option1', { serviceSelected: option === 'invite' }]"
      @click="switchContent('invite')"
    >
      {{ $t("邀請好友 ") }}
    </div>

    <div
      :class="['option2', { privacySelected: option === 'rebate' }]"
      @click="switchContent('rebate')"
    >
      {{ $t("返利總計") }}
    </div>
    <div
      :class="['option3', { rationalitySelected: option === 'friendList' }]"
      @click="switchContent('friendList')"
    >
      {{ $t("好友列表") }}
    </div>
  </div>
  <div>
    <component :is="dyComp"></component>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import friendList from "@/views/operation/friendList.vue";
import invite from "@/views/operation/invite.vue";
import rebate from "@/views/operation/rebate.vue";

const option = ref("invite");
const switchContent = (value) => {
  option.value = value;
};
const views = { invite, rebate, friendList };

const dyComp = computed(() => views[option.value]);
</script>

<style lang="scss" scoped>
.option-wrap {
  color: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  width: 95%;
  margin: 2% auto 0;
  margin-top: 5%;
  height: 2rem;
  .option1,
  .option2,
  .option3 {
    flex: 1;
    text-align: center;
    padding: 2%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
  }
  .option1 {
    background-image: url("@/assets/images/memberCenter/paging_L_1.png");
    background-size: 100% 100%;
  }
  .option2 {
    background-image: url("@/assets/images/memberCenter/paging_M_1.png");
    background-size: 100% 100%;
  }
  .option3 {
    background-image: url("@/assets/images/memberCenter/paging_R_1.png");
    background-size: 100% 100%;
  }
  .serviceSelected {
    color: #fff;
    background-image: url("@/assets/images/memberCenter/paging_L_2.png");
  }
  .privacySelected {
    color: #fff;
    background-image: url("@/assets/images/memberCenter/paging_M_2.png");
  }
  .rationalitySelected {
    color: #fff;
    background-image: url("@/assets/images/memberCenter/paging_R_2.png");
  }
}
</style>
