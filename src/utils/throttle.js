export default (cb, timeout = 250, once = false) => {
  let timer = null;
  let last = null;

  return function () {
    let context = this;
    let now = +new Date();
    let args = arguments;

    if (last && now < last + timeout) {
      clearTimeout(timer);

      timer = setTimeout(() => {
        last = now;
        if (!once) {
          cb.apply(context, args);
        }
      }, timeout);
    } else {
      last = now;
      cb.apply(context, args);
    }
  };
};
