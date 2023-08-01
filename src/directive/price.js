import priceHanlder from "@/utils/priceHanlder";
import sliceTextHandler from "@/utils/sliceTextHandler";

export default {
  mounted(el, bind) {
    const price = priceHanlder(bind.value, bind.arg);
    el.innerHTML = sliceTextHandler(price);
  },
  updated(el, bind) {
    const price = priceHanlder(bind.value, bind.arg);
    el.innerHTML = sliceTextHandler(price);
  },
};
