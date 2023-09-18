import request from '@/utils/request'
import { formatTimeZone } from '@/utils/useConvertTimeZone'

// 取得排行榜
export const getRankingApi = (time = '') => {
  return request({
    url: `/core/ranks/${time}`,
    method: 'get'
  })
}

export const getactivityList = (page, starttime, endtime) => {
  const pages = Number(page) < 1 ? 1 : page
  return request({
    url: `/bs/pos/event?page_size=100&page=${pages}&start_time=${formatTimeZone(starttime)}&end_time=${formatTimeZone(endtime)}`,
    method: 'get'
  })
}

export const getactivityListDetail = (page, starttime, endtime, eventid, status) => {
  let urls = ''
  const pages = Number(page) < 1 ? 1 : page
  if (status == null) {
    urls = `/bs/pos/event/detail?page_size=100&page=${pages}&start_time=${formatTimeZone(starttime)}&end_time=${formatTimeZone(endtime)}&event_id=${eventid}`
  } else {
    urls = `/bs/pos/event/detail?page_size=100&page=${pages}&start_time=${formatTimeZone(starttime)}&end_time=${formatTimeZone(endtime)}&event_id=${eventid}&status=${status}`
  }
  return request({
    url: urls,
    method: 'get'
  })
}
// 取得活動_不可同時參與
export const getactivityListCantcontemporaryJoin = (starttime, endtime) => {
  return request({
    url: `/bs/pos/event/same?start_time=${formatTimeZone(starttime)}&end_time=${formatTimeZone(endtime)}`,
    method: 'get'
  })
}

// 新增活動
export const addactivityList = (data) => {
  data.start_time = formatTimeZone(data.start_time)
  data.end_time = formatTimeZone(data.end_time)
  return request({
    url: '/bs/pos/event',
    method: 'post',
    data
  })
}
// 編輯活動
export const editactivityList = (data) => {
  data.start_time = formatTimeZone(data.start_time)
  data.end_time = formatTimeZone(data.end_time)
  return request({
    url: '/bs/pos/event',
    method: 'put',
    data
  })
}

// 編輯活動
export const closeactivityList = (id) => {
  return request({
    url: `/bs/pos/event/close/${id}`,
    method: 'get'
  })
}

// 取得玩家返利資訊
export const getPlayerRebateData = (page, starttime, endtime) => {
  const pages = Number(page) < 1 ? 1 : page
  return request({
    url: `/bs/pos/rebate?page_size=100&page=${pages}&start_time=${formatTimeZone(starttime)}&end_time=${formatTimeZone(endtime)}`,
    method: 'get'
  })
}
// 新增玩家返利資訊
export const addPlayerRebateData = (data) => {
  // console.log(data)
  data.start_time = formatTimeZone(data.start_time)
  data.end_time = formatTimeZone(data.end_time)
  return request({
    url: '/bs/pos/rebate',
    method: 'post',
    data
  })
}

//  取得返利統計領取人數
export const getRebatedetail = (rebateInfoid, starttime, endtime) => {
  return request({
    url: `/bs/pos/rebate/rebatedetail?rebate_info_id=${rebateInfoid}&start_time=${formatTimeZone(starttime)}&end_time=${formatTimeZone(endtime)}`,
    method: 'get'
  })
}

// 取得返利會員資料
export const getaccountdetail = (rebateInfoid, level, page, starttime, endtime) => {
  const pages = Number(page) < 1 ? 1 : page
  return request({
    url: `/bs/pos/rebate/accountdetail?rebate_info_id=${rebateInfoid}&level=${level}&page=${pages}&page_size=100&start_time=${formatTimeZone(starttime)}&end_time=${formatTimeZone(endtime)}`,
    method: 'get'
  })
}

// 編輯玩家返利資訊
export const editPlayerRebateData = (data) => {
  data.start_time = formatTimeZone(data.start_time)
  data.end_time = formatTimeZone(data.end_time)
  return request({
    url: '/bs/pos/rebate',
    method: 'put',
    data
  })
}
