<template>
  <div class="option-wrap">
    <div
      :class="['option1', { serviceSelected: option === '服務條款' }]"
      @click="switchContent('服務條款')"
    >
      {{ $t("服務條款") }}
    </div>

    <div
      :class="['option2', { privacySelected: option === '隱私政策' }]"
      @click="switchContent('隱私政策')"
    >
      {{ $t("隱私政策") }}
    </div>
    <div
      :class="['option3', { rationalitySelected: option === '理性博彩' }]"
      @click="switchContent('理性博彩')"
    >
      {{ $t("理性博彩") }}
    </div>
  </div>
  <div class="content-wrap">
    <div class="terms-of-service" v-if="option === '服務條款'">
      <h2>{{ $t("服務條款") }}</h2>
      <div>
        <p class="title">{{ $t("termsOfService.title1") }}</p>
        <p>
          {{ $t("termsOfService.content1") }}
        </p>
        <br />
        <p class="title">{{ $t("termsOfService.title2") }}</p>
        <p>
          {{ $t("termsOfService.content2") }}
        </p>
        <br />
        <p class="title">{{ $t("termsOfService.title3") }}</p>
        <p>
          {{ $t("termsOfService.content55") }}
        </p>
        <p>
          {{ $t("termsOfService.content3") }}
        </p>
        <p>
          {{ $t("termsOfService.content4") }}
        </p>
        <p class="title">{{ $t("termsOfService.title4") }}</p>
        <p>
          {{ $t("termsOfService.content5") }}
        </p>
        <p>
          {{ $t("termsOfService.content6") }}
        </p>
        <p>
          {{ $t("termsOfService.content7") }}
        </p>
        <p>
          {{ $t("termsOfService.content8") }}
        </p>
        <p>
          {{ $t("termsOfService.content9") }}
        </p>
        <p>
          {{ $t("termsOfService.content10") }}
        </p>
        <p>
          {{ $t("termsOfService.content11") }}
        </p>
        <p>
          {{ $t("termsOfService.content12") }}
        </p>
        <p>
          {{ $t("termsOfService.content13") }}
        </p>
        <p>
          {{ $t("termsOfService.content14") }}
        </p>
        <p>
          {{ $t("termsOfService.content15") }}
        </p>
        <p>
          {{ $t("termsOfService.content16") }}
        </p>
        <p>
          {{ $t("termsOfService.content17") }}
        </p>
        <p>
          {{ $t("termsOfService.content18") }}
        </p>
        <p>
          {{ $t("termsOfService.content19") }}
        </p>
        <p>
          {{ $t("termsOfService.content20") }}
        </p>
        <p>
          {{ $t("termsOfService.content21") }}
        </p>
        <p>
          {{ $t("termsOfService.content22") }}
        </p>
        <!-- <p>
          {{ $t("termsOfService.content23") }}
        </p> -->
        <p class="title">{{ $t("termsOfService.title5") }}</p>
        <p>
          {{ $t("termsOfService.content24") }}
        </p>
        <p>
          {{ $t("termsOfService.content56") }}
        </p>
        <p class="title">{{ $t("termsOfService.title6") }}</p>
        <p>
          {{ $t("termsOfService.content25") }}
        </p>
        <p>
          {{ $t("termsOfService.content26") }}
        </p>
        <p class="title">{{ $t("termsOfService.title7") }}</p>
        <p>
          {{ $t("termsOfService.content27") }}
        </p>
        <p class="title">{{ $t("termsOfService.title8") }}</p>
        <p>
          {{ $t("termsOfService.content28") }}
        </p>
        <p class="title">{{ $t("termsOfService.title9") }}</p>
        <p>
          {{ $t("termsOfService.content29") }}
        </p>
        <p class="title">{{ $t("termsOfService.title10") }}</p>
        <p>
          {{ $t("termsOfService.content30") }}
        </p>
        <p>
          {{ $t("termsOfService.content31") }}
        </p>
        <p>
          {{ $t("termsOfService.content32") }}
        </p>
        <p>
          {{ $t("termsOfService.content33") }}
        </p>
        <p>
          {{ $t("termsOfService.content34") }}
        </p>
        <p class="title">{{ $t("termsOfService.title11") }}</p>
        <p>
          {{ $t("termsOfService.content35") }}
        </p>
        <p class="title">{{ $t("termsOfService.title12") }}</p>
        <p>
          {{ $t("termsOfService.content36") }}
          <span>{{ $t("termsOfService.content57") }}</span>
        </p>
        <p>
          {{ $t("termsOfService.content37") }}
        </p>
        <p>
          {{ $t("termsOfService.content38") }}
        </p>
        <p class="title">{{ $t("termsOfService.title13") }}</p>
        <p>
          {{ $t("termsOfService.content39") }}
        </p>
        <p>
          {{ $t("termsOfService.content40") }}
        </p>
        <p>
          {{ $t("termsOfService.content41") }}
        </p>
        <p>
          {{ $t("termsOfService.content42") }}
        </p>
        <p>
          {{ $t("termsOfService.content43") }}
        </p>
        <p>
          {{ $t("termsOfService.content44") }}
        </p>
        <p>
          {{ $t("termsOfService.content45") }}
        </p>
        <p>
          {{ $t("termsOfService.content46") }}
        </p>
        <p>
          {{ $t("termsOfService.content47") }}
        </p>
        <p>
          {{ $t("termsOfService.content48") }}
        </p>
        <p>
          {{ $t("termsOfService.content49") }}
        </p>
        <p>
          {{ $t("termsOfService.content50") }}
        </p>
        <p>
          {{ $t("termsOfService.content51") }}
        </p>
        <p>
          {{ $t("termsOfService.content51") }}
        </p>
        <p>
          {{ $t("termsOfService.content53") }}
        </p>
        <p class="title">{{ $t("termsOfService.title14") }}</p>
        <p>
          {{ $t("termsOfService.content54") }}
        </p>
      </div>
    </div>
    <div class="privacy-policy" v-if="option === '隱私政策'">
      <h2>{{ $t("隱私政策") }}</h2>
      <div>
        <p>
          {{ $t("privacy.content1") }}
        </p>
        <p>
          {{ $t("privacy.content2") }}
        </p>
        <p>
          {{ $t("privacy.content3") }}
        </p>
        <p>
          {{ $t("privacy.content4") }}
        </p>
      </div>
    </div>
    <div class="rationality-bet" v-if="option === '理性博彩'">
      <h2>{{ $t("理性博彩") }}</h2>
      <div>
        <p>
          {{ $t("responsible.content1") }}
        </p>
        <p class="title">{{ $t("responsible.title1") }}</p>
        <p>
          {{ $t("responsible.content2") }}
        </p>
        <p>
          {{ $t("responsible.content3") }}
        </p>
        <p>
          {{ $t("responsible.content4") }}
        </p>
        <p>
          {{ $t("responsible.content5") }}
        </p>
        <p>
          {{ $t("responsible.content6") }}
        </p>
        <p>
          {{ $t("responsible.content7") }}
          <a href="https://www.begambleaware.org/" target="_blank"
            >www.gambleaware.co.uk</a
          >
        </p>
        <p class="title">{{ $t("responsible.title2") }}</p>
        <p>
          {{ $t("responsible.content8") }}
        </p>
        <p>
          {{ $t("responsible.content9") }}
        </p>
        <p>
          {{ $t("responsible.content10") }}
        </p>
        <p>
          {{ $t("responsible.content11") }}
        </p>
        <p>
          {{ $t("responsible.content12") }}
        </p>
        <p>
          {{ $t("responsible.content13") }}
        </p>
        <p>
          {{ $t("responsible.content14") }}
        </p>
        <p>
          {{ $t("responsible.content15") }}
        </p>
        <p>
          {{ $t("responsible.content16") }}
        </p>
        <p>
          {{ $t("responsible.content17") }}
        </p>
        <p>
          {{ $t("responsible.content18") }}
        </p>
        <p>
          {{ $t("responsible.content19") }}
        </p>
        <p>
          {{ $t("responsible.content20") }}
        </p>
        <p>
          {{ $t("responsible.content21") }}
        </p>
        <p class="title">{{ $t("responsible.title3") }}</p>
        <p>
          <a href="https://www.gamblersanonymous.org.uk/" target="_blank"
            >www.gamblersanonymous.org.uk
          </a>
        </p>
        <p class="title">{{ $t("responsible.title4") }}</p>
        <p>
          <a href="https://ccgr.org.uk/?page_id=1240&lang=en" target="_blank"
            >https://ccgr.org.uk/?page_id=1240&lang=en</a
          >
        </p>
        <p>{{ $t("responsible.content22") }}</p>
        <p class="title">{{ $t("responsible.title5") }}</p>
        <p>
          <a href="https://www.gamblingtherapy.org/" target="_blank"
            >www.gamblingtherapy.org</a
          >
        </p>
        <p class="title">{{ $t("responsible.title6") }}</p>
        <p>
          {{ $t("responsible.content23") }}
        </p>
        <p class="title">{{ $t("responsible.title7") }}</p>
        <p>
          {{ $t("responsible.content24") }}
        </p>
        <p class="title">{{ $t("responsible.title8") }}</p>
        <p>
          {{ $t("responsible.content25") }}
        </p>
        <p>
          {{ $t("responsible.content26") }}
          <span
            ><a href="https://www.netnanny.com/" target="_blank"
              >www.netnanny.com</a
            ></span
          >
        </p>
        <p>
          {{ $t("responsible.content27") }}
          <span
            ><a href="https://27labs.com/proxy/index.php" target="_blank"
              >www.cybersitter.com</a
            ></span
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const option = ref("服務條款");
const switchContent = (value) => {
  option.value = value;
};
</script>

<style lang="scss" scoped>
.option-wrap {
  color: #fff;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  width: 90%;
  margin: 5% auto;
  // margin-top: 25%;
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
.content-wrap {
  color: $primary;
  white-space: break-spaces;
  word-wrap: break-word;
  padding: 5%;
  padding-top: 0;
  .title {
    color: red;
    margin-top: 3%;
    margin-bottom: 2%;
  }
  p {
    margin: 5%;
    line-height: 1.5;
  }
}
</style>
