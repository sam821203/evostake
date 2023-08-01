import moment from "moment";

export default {
  mounted(el, bind) {
    el.innerHTML = moment(bind.value)
      .tz("Asia/Taipei")
      .format("YYYY/MM/DD HH:mm:ss");
  },
};
