export default function () {
  let htmlDom = document.querySelector("html");
  const windowsVH = window.innerHeight / 100;
  htmlDom.style.setProperty("--vh", windowsVH + "px");
  htmlDom = null;
}
