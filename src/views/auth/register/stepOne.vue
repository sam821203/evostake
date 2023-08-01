<template>
  <div style="padding-bottom: 0.5rem">
    <form @submit.prevent="throttleSave">
      <div class="input-wrap">
        <BaseInput
          :label="$t('login.account')"
          :placeholder="
            $t('register.wordLen', {
              min: 6,
              max: 12,
            })
          "
          v-model.trim="loginac"
          class="input"
          :required="true"
          :error="checkAcErr || errors.loginac"
          @inputFunction="checkAccount"
          :button-disabled="accountValidate"
        />
      </div>
      <BaseInput
        :label="$t('login.password')"
        :type="'password'"
        aria-autocomplete="true"
        :placeholder="
          $t('register.wordLen', {
            min: 6,
            max: 12,
          })
        "
        v-model.trim="loginpwd"
        class="input"
        :required="true"
        :error="errors.loginpwd"
      />
      <BaseInput
        :type="'password'"
        aria-autocomplete="true"
        :label="$t('register.passwordCheck')"
        :placeholder="$t('register.accountRestrict')"
        v-model.trim="confirmPassword"
        class="input"
        :required="true"
        :error="errors.confirmPassword"
      />
      <BaseInput
        :label="$t('register.tradePwd')"
        :placeholder="
          $t('register.wordLen', {
            min: 4,
            max: 6,
          })
        "
        v-model="secpwd"
        class="input"
        :required="true"
        :error="errors.secpwd"
      />
      <BaseInput
        :label="$t('register.checkTradePwd')"
        :placeholder="$t('register.wordLen', { min: 4, max: 6 })"
        v-model="confirm_second_password"
        class="input"
        :required="true"
        :error="errors.confirm_second_password"
      />
      <p class="remind">{{ $t("此密碼將用於提款") }}</p>
      <BaseInput
        :type="'text'"
        :label="$t('register.phone')"
        v-model.trim="phone"
        class="input"
        :required="true"
        :error="checkPhoneErr || errors.phone"
        :button-text="phoneBtn"
        @inputFunction="throttleCheckPhone"
        :button-disabled="phoneValidate || msgCountdown > 0"
        :placeholder="'XX - XXXXXXXXX'"
      />
      <!-- :placeholder="$t('register.phonePlaceholder')" -->
      <BaseInput
        :label="$t('register.confirmCode')"
        :placeholder="$t('register.codePlaceholder')"
        v-model="phone_valid_code"
        class="input"
        :required="true"
        :error="errors.phone_valid_code"
      />
      <baseButton
        :class="['button', { disabledBtn: hasError }]"
        type="submit"
        :disabled="hasError"
        :bg-type="hasError ? 'disabledBtn' : 'confirmBtn'"
      >
        {{ $t("login.submit") }}
      </baseButton>
    </form>
  </div>
</template>

<script setup>
import { onBeforeUnmount, watch } from "vue";
import BaseInput from "@/components/form/baseInput.vue";
import { object, string } from "yup";
import { useField, useForm } from "vee-validate";
import {
  loginAcValidate,
  passwordValidate,
  confirmPwdValidate,
  tradePasswordValidate,
  confirmTradePwdValidate,
} from "@/utils/validate";
import { useStore } from "@/store/index";
import { checkAccountApi, checkPhoneApi, registerApi } from "@/api/user";
import filterObjectFunc from "@/utils/filterObjectFunc";
import { computed, ref } from "vue";
import { mergeWith } from "lodash";
import baseButton from "@/components/form/baseButton.vue";
import throttle from "@/utils/throttle";
import { storeToRefs } from "pinia";
import { agentac } from "@/utils/getAgent";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { usectrlLogin } from "@/store/ctrlLogin";
const { changeloginpageStatus } = usectrlLogin();
// const { inviteFriendid } = storeToRefs(usectrlLogin());
const router = useRouter();
const route = useRoute();
const { useAuth, useMessage } = useStore();

const authStore = useAuth();
const { login } = authStore;
const { registerData } = storeToRefs(authStore);
const { openMsg } = useMessage();

const { t } = useI18n();

// 初始驗證 schema
const validationSchema = object({
  loginac: loginAcValidate,
  loginpwd: passwordValidate,
  confirmPassword: confirmPwdValidate("loginpwd"),
  secpwd: tradePasswordValidate,
  confirm_second_password: confirmTradePwdValidate,
  phone: string()
    // /^(09|639)\d{9}$/
    .matches(/^(?!0)\d{10,11}$/, "register.phoneConfirm")
    .required("login.incomplete"),
  phone_valid_code: string()
    .min(4, "register.codeConfirm")
    .max(4, "register.codeConfirm")
    .required("login.incomplete"),
});

const { handleSubmit, errors } = useForm({
  validationSchema,
});

// 表單雙向綁定
const { value: loginac, errors: acError } = useField("loginac", undefined);
const { value: loginpwd } = useField("loginpwd", undefined);
const { value: confirmPassword } = useField("confirmPassword", undefined);
const { value: secpwd } = useField("secpwd", "");
const { value: confirm_second_password } = useField(
  "confirm_second_password",
  ""
);
const { value: phone, errors: phoneError } = useField("phone", undefined);
const { value: phone_valid_code } = useField("phone_valid_code", undefined);

// const emit = defineEmits(["send"]);
const save = handleSubmit(async (values) => {
  if (!checkAccountStatus.value) {
    return;
  }
  const apiData = filterObjectFunc(values, "confirm");
  authStore.$patch({
    registerData: {
      ...apiData,
    },
  });
  const loginData = await register(values);
  if (loginData?.data?.code === 0) {
    router.push("/home");
    // usectrlLogin().$patch({
    //   loginpageStatus: false,
    // });
    changeloginpageStatus(false);
  }
  // emit("stepOneDone", true);
  // emit("send", "StepTwo");
});
const register = async (form = {}) => {
  try {
    let apiData = mergeWith(registerData.value, form);
    const res = await registerApi({
      ...apiData,
      agentac,
      inviter: route.params.id,
    });
    if (res.data.code === 200) {
      const loginRes = login({
        account: registerData.value.loginac,
        password: registerData.value.loginpwd,
      });
      return loginRes;
    }
  } catch (error) {
    console.log(error, "register error");
  }
};

const throttleSave = throttle(save, 1500, true);

// 驗證 function
const accountValidate = computed(
  () => !loginac.value || acError.value.length > 0
);

const checkAgain = computed(() => !loginac.value || acError.value.length > 0);

watch(accountValidate, () => {
  if (accountValidate.value && !checked.value) {
    window.addEventListener("click", checkAccount);
  }
});

watch(checkAgain, () => {
  if (checkAgain.value) {
    window.addEventListener("click", checkAccount);
  }
});

watch(loginac, () => {
  if (loginac.value) {
    window.addEventListener("click", checkAccount);
  }
});

let checkAccountStatus = ref(false);
let checkAcErr = ref("");
const checked = ref(false);
const checkedAcc = ref("");

const checkAccount = async () => {
  if (accountValidate.value) {
    return;
  }
  const res = await checkAccountApi({
    account: loginac.value,
    type: 1,
  });
  if (res.data.data.valid === false) {
    openMsg({ content: res.data.data.msg })
      .then(() => {
        loginac.value = "";
        checkAcErr.value = "";
        return;
      })
      .catch(() => {
        loginac.value = "";
        checkAcErr.value = "";
        return;
      });
  } else {
    openMsg({ content: res.data.data.msg })
      .then(() => {
        checked.value = true;
        checkedAcc.value = loginac.value;
        window.removeEventListener("click", checkAccount);
      })
      .catch(() => {
        checked.value = true;
        checkedAcc.value = loginac.value;
        window.removeEventListener("click", checkAccount);
      });
  }

  checkAccountStatus.value = res.data.data.valid;
  if (!checkAccountStatus.value) {
    checkAcErr.value = res.data.data.msg;
  } else {
    checkAcErr.value = "";
  }
};

let sendMsgTimeout = null;
const msgCountdown = ref(0);

const checkPhoneStatus = ref(false);
const checkPhoneErr = ref("");
const checkPhone = async () => {
  if (phoneValidate.value || msgCountdown.value > 0) {
    return;
  }
  try {
    await openMsg({
      content: t("register.sendMsgCheckPopout", { phone: phone.value }),
      hasBtn: true,
    });
    const res = await checkPhoneApi({
      phone: phone.value,
      agentac,
    });
    checkPhoneStatus.value = res.data.code !== 400;
    if (res.data.code === 400) {
      openMsg({ content: res.data.data.errors });
      checkPhoneErr.value = res.data.data.errors;
      return;
    } else {
      checkPhoneErr.value = "";
    }
    msgCountdown.value = 600;
    sendMsgTimeout = setInterval(() => {
      if (msgCountdown.value <= 0) {
        clearInterval(sendMsgTimeout);
        sendMsgTimeout = null;
        return;
      }
      msgCountdown.value--;
    }, 1000);
    openMsg({ content: res.data.msg });
  } catch (error) {
    console.log(error);
  }
};

const throttleCheckPhone = throttle(checkPhone, 2000, true);

const phoneBtn = computed(() =>
  msgCountdown.value > 0 ? msgCountdown.value : t("register.sendMsg")
); // 發送簡訊按鈕文字
// 檢查、發簡訊按鈕驗證
const hasError = computed(() => {
  return Object.keys(errors.value).length > 0 || !checkAccountStatus.value;
});

const phoneValidate = computed(
  () => !phone.value || phoneError.value.length > 0
);

onBeforeUnmount(() => {
  clearInterval(sendMsgTimeout);
  sendMsgTimeout = null;
});
</script>

<style lang="scss" scoped>
p {
  color: red;
  margin-top: -2%;
  margin-bottom: 1%;
}
.remind {
  font-size: 0.9rem;
}
</style>
