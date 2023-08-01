export default (iNumber, base = 10000) => {
  const num = iNumber / base;
  const parts = String(num).includes(".")
    ? num.toFixed(3).slice(0, -1).toString().split(".")
    : [String(num)];
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};
