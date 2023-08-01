const sliceAccountFunc = (text, limit) => {
  let res = text;
  if (typeof text === "string" && text.length >= limit) {
    res = `${text.slice(0, limit)}*********`;
  }

  return res;
};
export default {
  mounted(el, bind) {
    el.innerHTML = sliceAccountFunc(bind.value, bind.arg);
  },
  updated(el, bind) {
    el.innerHTML = sliceAccountFunc(bind.value, bind.arg);
  },
};
