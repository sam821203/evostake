import request from '@/utils/request'
import { formatTimeZone } from '@/utils/useConvertTimeZone'

// 取得開獎結果報表的桌號
export const getPlayLotteryTableApi = () => {
  return request({
    url: '/gw/backend/room_info',
    method: 'get'
  })
}

// 取得開獎結果報表
export const getPlayLotteryApi = (id, date, page, type) => {
  return request({
    url: `/gw/backend/settle_report_type2?room_id=${id}&page=${page}&game_type=${type}&start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}`,
    method: 'get'
  })
}

// 取得各類遊戲營收報表
export const getBetWinApi = (date, gameType, company, playerType) => {
  return request({
    url: `/bs/pos/report/betwin?starttime=${formatTimeZone(date.time1)}&endtime=${formatTimeZone(date.time2)}&game_type=${gameType}&company=${company}&player_type=${playerType}`,
    // url: `/bs/pos/report/betwinfaster?starttime=${date.time1}&endtime=${date.time2}&game_type=${gameType}&company=${company}&player_type=${playerType}`,
    method: 'get'
  })
}

// 取得遊戲營收報表的遊戲類別
export const getGamesApi = () => {
  return request({
    url: '/core/games?simple_mode=1',
    method: 'get'
  })
}

// 取得玩家數據報表
export const getPlayerDataReportApi = (date, searchtype, str) => {
  return request({
    url: `/bs/pos/report/flow?searchtype=${searchtype}&ptype=cash&searchstr=${str}&starttime=${formatTimeZone(date.time1)}&endtime=${formatTimeZone(date.time2)}`,
    method: 'get'
  })
}

// 取得玩家數據報表的詳細資訊
export const getPlayerTotalDataReportApi = (pid) => {
  return request({
    url: `/bs/pos/report/flow_total?u9=${pid}`,
    method: 'get'
  })
}

// 取得遊戲AI報表
export const getAiReportApi = (date, id) => {
  return request({
    url: `/gw/backend/summary/robot_report?start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}${id}`,
    method: 'get'
  })
}

// 取得紅利報表
export const getDividendApi = (date, searchtype, str) => {
  return request({
    url: `/bs/pos/report/dividend?search_type=${searchtype}&search_str=${str}&start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}`,
    method: 'get'
  })
}
