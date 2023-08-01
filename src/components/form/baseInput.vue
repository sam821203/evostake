<template>
  <label :for="label">
    {{ label }}
  </label>
  <span class="error" v-if="error">{{ $t(error) }}</span>
  <div class="input-inner">
    <input
      v-bind="$attrs"
      :type="type"
      :class="['input', { hasBtn: buttonText }]"
      :value="modelValue"
      @input="inputHandler($event)"
      :disabled="disabled"
      ref="input"
    />
    <img
      :src="require(`@/assets/images/form/${togglePwd ? 'eye2' : 'eye'}.png`)"
      alt=""
      @click.prevent="checkPwd"
      :class="[{ isClick: togglePwd }, 'eye']"
      v-show="propsType === 'password'"
    />
    <div class="functionBtn" v-show="buttonText" @click="checkFunction">
      <img src="@/assets/images/form/A_btn.png" alt="" v-if="!buttonDisabled" />
      <img src="@/assets/images/form/B_btn.png" alt="" v-else />
      <span>{{ buttonText }}</span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, toRefs, ref, nextTick } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  modelValue: {
    type: [String, Number],
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "text",
  },
  error: {
    type: String,
    default: "",
  },
  buttonText: {
    type: [String, Number],
    default: "",
  },
  buttonDisabled: {
    type: Boolean,
    default: false,
  },
});
const { type: propsType } = toRefs(props);
const input = ref(null);
const togglePwd = ref(false);
const type = ref(propsType.value);
const checkPwd = () => {
  togglePwd.value = !togglePwd.value;
  if (togglePwd.value) {
    type.value = "text";
  } else {
    type.value = "password";
  }
};
const emit = defineEmits(["update:modelValue", "inputFunction"]);

const checkFunction = () => {
  emit("inputFunction");
};
const inputHandler = ($event) => {
  const val =
    typeof $event.target.value === "string"
      ? $event.target.value.trim()
      : $event.target.value;
  emit("update:modelValue", val);
};

// const globalStore = useGlobal()
// onMounted(() => {
//   input.value.addEventListener('focusin', (e) => {
//     globalStore.$patch({
//       isFocus: true
//     })
//   })
//   input.value.addEventListener('focusout', (e) => {
//     globalStore.$patch({
//       isFocus: false
//     })
//   })
// })

// onBeforeUnmount(() => {
//   reseizeWindow();
// });
const focus = () => {
  nextTick(() => {
    input.value.focus();
  });
};
defineExpose({
  focus,
});
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss" scoped>
label {
  white-space: nowrap;
}
.input-inner {
  position: relative;
  margin-bottom: 3%;
  .eye {
    position: absolute;
    width: 10%;
    right: 3%;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    @media (min-width: 1024px) {
      right: 4%;
    }
    @media (min-width: 1600px) {
      right: 6%;
    }
    &.isClick {
      // position: relative;
    }
  }
}
.input {
  @include input;
}
label {
  display: inline-block;
  font-size: 18px;
  color: $primary;
  margin-right: 15px;
  margin-bottom: 1%;
}
.error {
  text-align: center;
  color: red;
  margin-bottom: 15px;
  font-size: 0.8rem;
}
.functionBtn {
  position: absolute;
  top: 50%;
  right: 1.5%;
  transform: translateY(-50%);
  width: 5rem;
  height: 2rem;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
  span {
    position: absolute;
    font-size: 1rem;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: break-spaces;
    text-align: center;
    font-size: 0.7rem;
  }
}
</style>
