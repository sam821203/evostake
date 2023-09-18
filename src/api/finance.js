import request from '@/utils/request'
import { formatTimeZone } from '@/utils/useConvertTimeZone'

// 取得玩家提款審核報表
export const getConsignApi = (data) => {
  const { date, str, type, page, pagesize, status } = data
  return request({
    url: `bs/pos/report/consign?search_type=${type}&search_str=${str}&page=${page}&pagesize=${pagesize}&start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}&status=${status}`,
    method: 'get'
  })
}

// 取得玩家風控資訊
export const getFongkongApi = (U9) => {
  return request({
    url: `bs/pos/report/fengkong/${U9}`,
    method: 'get'
  })
}
