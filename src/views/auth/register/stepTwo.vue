<template>
  <div style="padding-bottom: 0.5rem">
    <form @submit.prevent="throttleSave">
      <BaseInput
        :label="$t('register.name')"
        :placeholder="
          $t('register.stringWordLen', {
            min: 2,
            max: 60,
          })
        "
        v-model.trim="name"
        class="input"
        :required="true"
        :error="errors.name"
      />
      <BaseInput
        :label="$t('register.nickname')"
        :placeholder="$t('register.nicknamePlaceholder')"
        v-model.trim="nickname"
        class="input"
        :required="true"
        :error="checkNicknameErr || errors.nickname"
        :button-text="$t('register.checkNickname')"
        @inputFunction="checkNickname"
        :button-disabled="nicknameVlidate"
      />
      <BaseInput
        :type="'text'"
        :label="$t('register.phone')"
        :placeholder="$t('register.phonePlaceholder')"
        v-model.trim="phone"
        class="input"
        :required="true"
        :error="checkPhoneErr || errors.phone"
        :button-text="phoneBtn"
        @inputFunction="throttleCheckPhone"
        :button-disabled="phoneValidate || msgCountdown > 0"
      />
      <BaseInput
        :label="$t('register.confirmCode')"
        :placeholder="$t('register.codePlaceholder')"
        v-model="phone_valid_code"
        class="input"
        :required="true"
        :error="errors.phone_valid_code"
      />
      <BaseInput
        label="GCash"
        :placeholder="$t('register.codePlaceholder')"
        v-model="phone"
        class="input"
        :disabled="true"
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
      <!-- <button
        :class="['button', { disabledBtn: Object.keys(errors).length > 0 }]"
        type="submit"
        :disabled="Object.keys(errors).length > 0"
      >
        {{ $t("login.submit") }}
      </button> -->
    </form>
  </div>
</template>

<script setup>
import { computed, ref, onBeforeUnmount } from "vue";
import { useStore } from "@/store/index";
import { useField, useForm } from "vee-validate";
import { object, string } from "yup";
import { registerApi, checkNicknameApi, checkPhoneApi } from "@/api/user";
import { nicknameValidate } from "@/utils/validate";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { mergeWith } from "lodash";
import BaseInput from "@/components/form/baseInput.vue";
import baseButton from "@/components/form/baseButton.vue";
import throttle from "@/utils/throttle";
import { agentac } from "@/utils/getAgent";
import { usectrlLogin } from "@/store/ctrlLogin";
const { changeloginpageStatus } = usectrlLogin();
const { useAuth } = useStore();
const authStore = useAuth();
const { login } = authStore;
const { registerData } = storeToRefs(authStore);

// const router = useRouter();
const route = useRoute();

const { t } = useI18n();

const { useMessage } = useStore();

const msgStore = useMessage();
const { openMsg } = msgStore;

// 初始驗證 schema
const validationSchema = object({
  name: string()
    // a-zA-Z\u4e00-\u9fff 中英
    .matches(/^[a-zA-Z]{2,60}$/, "register.nameConfirm")
    .required("login.incomplete"),
  nickname: nicknameValidate,
  phone: string()
    // /^(09|639)\d{9}$/
    .matches(/^09\d{9}$/, "register.phoneConfirm")
    .required("login.incomplete"),
  phone_valid_code: string()
    .min(4, "register.codeConfirm")
    .max(4, "register.codeConfirm")
    .required("login.incomplete"),
  // line_id: string().matches(
  //   /(^[a-z0-9_&-/.]{4,18}$)|(^$)/,
  //   "register.lineConfirm"
  // ),
});

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: name } = useField("name", undefined);
const { value: nickname, errors: nicknameError } = useField(
  "nickname",
  undefined
);
const { value: phone, errors: phoneError } = useField("phone", undefined);
const { value: phone_valid_code } = useField("phone_valid_code", undefined);
// const { value: line_id } = useField("line_id", undefined);

// 發送註冊api
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

const save = handleSubmit(async (values) => {
  const loginData = await register(values);
  if (loginData?.data?.code === 0) {
    // router.push("/home");
    // usectrlLogin().$patch({
    //   loginpageStatus: false,
    // });
    changeloginpageStatus(false);
  }
});

const throttleSave = throttle(save, 1500, true);

const checkNicknameStatus = ref(false);
const checkNicknameErr = ref("");
const checkNickname = async () => {
  if (nicknameVlidate.value) {
    return;
  }
  const res = await checkNicknameApi({
    nick_name: nickname.value,
    type: 1,
  });
  openMsg({ content: res.data.data.msg });
  checkNicknameStatus.value = res.data.data.valid;
  if (!checkNicknameStatus.value) {
    checkNicknameErr.value = res.data.data.msg;
  } else {
    checkNicknameErr.value = "";
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

const nicknameVlidate = computed(
  () => !nickname.value || nicknameError.value.length > 0
);
const phoneValidate = computed(
  () => !phone.value || phoneError.value.length > 0
);

const hasError = computed(() => {
  return (
    Object.keys(errors.value).length > 0 ||
    !checkNicknameStatus.value ||
    !checkPhoneStatus.value
  );
});

onBeforeUnmount(() => {
  clearInterval(sendMsgTimeout);
  sendMsgTimeout = null;
});
</script>
