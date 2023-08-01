export default (text, limit = 10) => {
  let res = text;
  if (typeof text !== "string") {
    text = text.toString();
  }
  if (typeof text === "string" && text.length >= limit) {
    res = `${text.slice(0, limit)}...`;
  }

  return res;
};
