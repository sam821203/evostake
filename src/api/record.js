import request from '@/utils/request'
import { formatTimeZone } from '@/utils/useConvertTimeZone'

// 取得資料異動
export const getAdminlogApi = (type, searchstr, date, page, pagesize) => {
  return request({
    url: `/bs/pos/report/adminlog?type=${type}&page=${page}&pagesize=${pagesize || 100}&searchstr=${searchstr}&starttime=${formatTimeZone(date.time1)
      }&endtime=${formatTimeZone(date.time2)}`,
    method: 'get'
  })
}

// 取得簡訊紀錄
export const getBriefnewsLogApi = (type, searchstr, date) => {
  return request({
    url: `/bs/pos/report/sms?type=${type}&searchstr=${searchstr}&starttime=${formatTimeZone(date.time1)}&endtime=${formatTimeZone(date.time2)}`,
    method: 'get'
  })
}

// 取得開洗分紀錄
export const getCashInOutLogApi = (data) => {
  const { type, str, date, currency, page, pagesize } = data
  return request({
    url: `/bs/pos/report/transaction?searchtype=${type}&page=${page}&pagesize=${pagesize || 100
      }&searchstr=${str}&currency=${currency}&starttime=${formatTimeZone(date.time1)}&endtime=${formatTimeZone(date.time2)}`,
    method: 'get'
  })
}

// 取得第三方存款
export const getCashStoredValueLogApi = (data) => {
  const { type, str, date, currency, page, pagesize } = data
  for (const k in type) {
    type[k] = Number(type[k])
  }
  return request({
    url: `/bs/pos/report/thirdparty?searchtype=${type[0]}&searchtype=${type[1]}&searchtype=${type[2]}&page=${page}&pagesize=${pagesize || 100
      }&searchstr=${str}&currency=${currency}&starttime=${formatTimeZone(date.time1)}&endtime=${formatTimeZone(date.time2)}`,
    method: 'get'
  })
}

// 第三方存款補單
export const handleOrderApi = (data) => {
  return request({
    url: '/bs/pos/bankorder',
    method: 'put',
    data
  })
}

// 取得風控資訊
export const getFengkongLogApi = (type, searchstr, date, page, pagesize = 100) => {
  return request({
    url: `/bs/pos/report/fengkong?search_type=${type}&search_str=${searchstr}&start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}&page=${page}&pagesize=${pagesize}`,
    method: 'get'
  })
}

// 取得風控詳細資訊
export const getFengkongDetailLogApi = (id) => {
  return request({
    url: `/bs/pos/report/fengkong/${id}`,
    method: 'get'
  })
}

// 取得風控玩家資訊
export const getPlayerLoginLogApi = (type, searchstr, date, page, pagesize = 100) => {
  return request({
    url: `/bs/pos/report/login?search_type=${type}&search_str=${searchstr}&start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}&page=${page}&pagesize=${pagesize}`,
    method: 'get'
  })
}

// 去得玩家在線紀錄
export const playeronlinerecordApi = (page, startTime, endTime, pagesize = 100) => {
  return request({
    url: `/bs/pos/report/onlineppl?page=${page}&page_size=${pagesize}&start_time=${formatTimeZone(startTime)}&end_time=${formatTimeZone(endTime)}`,
    method: 'get'
  })
}

// 取得頭像
export const getplayerPIC = (u9) => {
  return request({
    // mock/81/pos/avatar
    url: `/bs/pos/avatar/?U9=${u9}`,
    method: 'get',
    responseType: 'blob'
  })
}
// 取得身分證相片
export const getplayerIDPIC = (u9, type = 'front') => {
  return request({
    // front/back 身分證反面
    url: `/bs/pos/idc/?u9=${u9}&type=${type}`,
    method: 'get',
    responseType: 'blob'
  })
}
// 上船頭像
export const updateplayerPIC = (data) => {
  return request({
    // front/back 身分證反面
    url: '/bs/pos/avatar',
    method: 'post',
    data
    // form-data
    // const anoucementPICdata = new FormData()
    // anoucementPICdata.append('picture_id', data.data.pid)
  })
}
// 上船身分證
export const updateplayerIDPIC = (data) => {
  return request({
    // front/back 身分證反面
    url: '/bs/pos/idc',
    method: 'post',
    data
    // form-data
    // const anoucementPICdata = new FormData()
    // anoucementPICdata.append('picture_id', data.data.pid)
  })
}
