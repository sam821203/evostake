export default () => {
  window.onload = () => {
    let lastTouchEnd = 0;
    document.addEventListener("touchstart", (event) => {
      if (event.touches.length >= 2) {
        event.preventDefault();
      }
    });

    document.addEventListener(
      "touchend",
      (event) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      false
    );

    // 阻止雙指放大
    document.addEventListener("gesturestart", (event) => {
      event.preventDefault();
    });
  };
};
