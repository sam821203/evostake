import request from '@/utils/request'
import { formatTimeZone } from '@/utils/useConvertTimeZone'

// 取得階級群組
export const getGroupApi = (name) => {
  return request({
    url: `/bs/bnd/group?name=${name}`,
    method: 'get'
  })
}

// 取得階級樹狀
export const getTreeApi = (name) => {
  return request({
    url: `/bs/bnd/grouptree?name=${name}`,
    method: 'get'
  })
}

// 創建階級
export const addTreeApi = (data) => {
  return request({
    url: '/bs/bnd/group',
    method: 'post',
    data
  })
}

// 編輯階級分潤
export const editTreePercentApi = (data, id) => {
  return request({
    url: `/bs/bnd/group/${id}/percent`,
    method: 'put',
    data
  })
}

// 編輯階級其他資訊(暱稱、備註)
export const editTreeInfoApi = (data, id) => {
  return request({
    url: `/bs/bnd/group/${id}/info`,
    method: 'put',
    data
  })
}

// 階級凍結
export const handleTreeFreezeApi = (id) => {
  return request({
    url: `/bs/bnd/group/${id}/freeze`,
    method: 'put'
  })
}

// 階級解凍
export const handleTreeUnFreezeApi = (id) => {
  return request({
    url: `/bs/bnd/group/${id}/unfreeze`,
    method: 'put'
  })
}

// 取得階級代理報表
export const getTreeReportApi = (id, date) => {
  return request({
    url: `/bs/pos/agent/${id}/report?start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}&type=cash`,
    method: 'get'
  })
}

// 取得階級玩家報表
export const getPlayerReportApi = (id, date) => {
  return request({
    url: `/bs/pos/report/playerwinloss?agent_id=${id}&start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}&type=cash`,
    method: 'get'
  })
}

// 取得代理對帳報表
export const getCashCheckingReport = (id, date) => {
  return request({
    url: `/bs/pos/report/reconciliation?agent_id=${id}&start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}`,
    method: 'get'
  })
}
