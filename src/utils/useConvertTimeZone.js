const formatNum = (num) => (num < 10 ? '0' : '') + num

export const convertTimeZone = (str, timeZoneDiff = 0) => {
  const now = new Date(str)

  // 推出 UTC+0 後，再轉換時區差值
  now.setUTCHours(now.getUTCHours() + timeZoneDiff)

  const [year, month, date, hours, minutes, seconds] = [
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours(),
    now.getUTCMinutes(),
    now.getUTCSeconds()
  ].map(formatNum)

  return {
    year,
    month,
    date,
    hours,
    minutes,
    seconds
  }
}
const checkTimeZone = () => {
  // 目前時區偏移量
  const currentOffsetMinutes = (new Date().getTimezoneOffset()) / 60 * -1
  // 目標的時間偏移量
  const targetOffsetMin = -3
  return currentOffsetMinutes - targetOffsetMin
}
export const formatTimeZone = (str, plus = true) => {
  const timeZoneDiff = plus ? checkTimeZone() : checkTimeZone() * -1
  // const timeZoneDiff=
  const now = new Date(str)
  if (str === undefined) {
    return ''
  } else if (str === '') {
    return ''
  }
  // 推出 UTC+0 後，再轉換時區差值
  now.setUTCHours(now.getUTCHours() + timeZoneDiff)

  const formattedTime = `${formatNum(now.getUTCFullYear())}-${formatNum(now.getUTCMonth() + 1)}-${formatNum(now.getUTCDate())}T${formatNum(
    now.getUTCHours()
  )}:${formatNum(now.getUTCMinutes())}:${formatNum(now.getUTCSeconds())}.000Z`

  return formattedTime
}

export const toLocaleString = (date = new Date()) => {
  return new Date(date.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
}
