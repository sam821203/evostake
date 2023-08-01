// 物件篩選function
export default (obj, delKey) => {
  const apiData = Object.fromEntries(
    Object.entries(obj).filter(([key]) => !key.includes(delKey))
  );

  return apiData;
};
