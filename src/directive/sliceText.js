import sliceTextHandler from "@/utils/sliceTextHandler";

export default {
  mounted(el, bind) {
    el.innerHTML = sliceTextHandler(bind.value, bind.arg);
  },
  updated(el, bind) {
    el.innerHTML = sliceTextHandler(bind.value, bind.arg);
  },
};
