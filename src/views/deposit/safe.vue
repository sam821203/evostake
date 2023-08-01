<template>
  <div class="safeSetting">
    <!-- <img src="@/assets/images/top_bar_frame.png" alt="" /> -->
    <div class="title-wrap">
      <img src="@/assets/images/memberCenter/lock.png" alt="" class="lock" />
      <h3 class="title">{{ $t("memberCenter.editPassword") }}</h3>
    </div>
    <form @submit.prevent="editPassWord">
      <baseInput
        :label="$t('memberCenter.oldPassword')"
        :type="'password'"
        :placeholder="$t('memberCenter.fillInOldPassword')"
        class="input"
        :required="true"
        v-model="oldPassword"
        :error="errors.oldPassword"
      />
      <baseInput
        :label="$t('memberCenter.newPassword')"
        :type="'password'"
        :placeholder="$t('memberCenter.fillInNewPassword')"
        class="input"
        :required="true"
        v-model="newPassword"
        :error="errors.newPassword"
      />
      <baseInput
        :label="$t('memberCenter.confirmPassword')"
        :type="'password'"
        :placeholder="$t('memberCenter.fillInConfirmPassword')"
        class="input"
        :required="true"
        v-model="confirmPassword"
        :error="errors.confirmPassword"
      />
      <div class="confirmWrap">
        <baseButton class="confirm">
          {{ $t("memberCenter.confirmChangedPassword") }}
        </baseButton>
      </div>
    </form>
  </div>
</template>

<script setup>
// import { ref } from "vue";
import { editPasswordApi } from "@/api/user";
import { useField, useForm } from "vee-validate";
import { object } from "yup";
import { useMessage } from "@/store/msgStore";
import { passwordValidate, confirmPwdValidate } from "@/utils/validate";
import { useRouter } from "vue-router";
import baseInput from "@/components/form/baseInput.vue";
import baseButton from "@/components/form/baseButton.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const router = useRouter();

const msg = useMessage();
const { openMsg } = msg;

const validationSchema = object({
  oldPassword: passwordValidate,
  newPassword: passwordValidate,
  confirmPassword: confirmPwdValidate("newPassword"),
});

const { handleSubmit, errors } = useForm({
  validationSchema,
});
const { value: oldPassword } = useField("oldPassword");
const { value: newPassword } = useField("newPassword");
const { value: confirmPassword } = useField("confirmPassword");

const editPassWord = handleSubmit(async (values) => {
  const { oldPassword, newPassword } = values;
  const res = await editPasswordApi({
    old_password: oldPassword,
    new_password: newPassword,
  });

  if (res.data.code === 0) {
    try {
      await openMsg({
        // openMsg.editPasswordSuccess
        content: t("openMsg.editPasswordSuccess"),
      }).then(() => {
        router.push("/");
      });
    } catch (error) {
      openMsg({
        content: res.data.data.msg,
      });
      console.log(error);
    }
  }
});
</script>

<style lang="scss" scoped>
.safeSetting {
  width: 100%;
  // height: fit-content;
  box-sizing: border-box;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
  .title-wrap {
    display: flex;
    align-items: baseline;
    .lock {
      width: 20px;
      margin-right: 10px;
    }
    .title {
      white-space: nowrap;
      font-size: 25px;
      color: #28dcffd9;
    }
  }
  :deep(.input) {
    height: 3rem;
  }
  .confirmWrap {
    display: flex;
    justify-content: center;
    margin-top: 50px;
    .confirm {
      width: 50%;
      height: 3rem;
    }
  }
}
</style>
