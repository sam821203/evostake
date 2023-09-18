import request from '@/utils/request'
import { formatTimeZone } from '@/utils/useConvertTimeZone'

// 取得玩家資訊
export const getPlayerApi = (type, val, page) => {
  return request({
    url: `/bs/pos/player?searchtype=${type}&searchstr=${val}&page=${page}`,
    method: 'get'
  })
}

// 取得詳細資訊
export const getPlayerDetailsApi = (id, date) => {
  return request({
    url: `/bs/pos/report/creditdetail?u9=${id}&starttime=${formatTimeZone(date.time1)}&endtime=${formatTimeZone(date.time2)}`,
    method: 'get'
  })
}

// 編輯玩家資訊
export const handlePlayerApi = (data) => {
  return request({
    url: '/bs/pos/player',
    method: 'put',
    data
  })
}

// 取得玩家頭像
export const getAvatarApi = (id) => {
  return request({
    url: `/bs/pos/avatar?U9=${id}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 編輯玩家頭像
export const editAvatarApi = (data) => {
  return request({
    url: '/bs/pos/avatar',
    method: 'post',
    data
  })
}

// 取得玩家身分證
export const getIdcApi = (id, type) => {
  return request({
    url: `/bs/pos/idc?u9=${id}&type=${type}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 編輯玩家身分證
export const editIdcApi = (data) => {
  return request({
    url: '/bs/pos/idc',
    method: 'post',
    data
  })
}

// 取得遊戲紀錄
export const getGameLogApi = (id, date, page) => {
  return request({
    url: `/bs/pos/report/gamelog/${id}?page=${page}&page_size=100&start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}`,
    method: 'get'
  })
}

// 取得帳變紀錄
export const getAccountChangeApi = (id, date, page, currency) => {
  return request({
    url: `/bs/pos/report/log/money?u9=${id}&currency=${currency}&starttime=${formatTimeZone(date.time1)}&endtime=${formatTimeZone(date.time2)}&page=${page}&pagesize=100`,
    method: 'get'
  })
}

// 凍結玩家
export const freezeAccountApi = (data) => {
  return request({
    url: '/bs/pos/player/freeze',
    method: 'put',
    data
  })
}

// 解凍玩家
export const unfreezeAccountApi = (data) => {
  return request({
    url: '/bs/pos/player/unfreeze',
    method: 'put',
    data
  })
}

// 重置玩家密碼
export const resetPwdApi = (data) => {
  return request({
    url: '/bs/pos/player/resetpwd',
    method: 'put',
    data
  })
}
export const resetTradePwdApi = (data) => {
  return request({
    url: '/bs/pos/player/resetsecpwd',
    method: 'put',
    data
  })
}
// 開洗分
// status:in
// data = {
//   currency: "TWD",
//   info: "123",
//   pid:"U306177072",
//   score:10000000,
//   special:true,
// }
export const cashInOutApi = (data, status) => {
  return request({
    url: `/bs/pos/${status === 'in' ? 'keyin' : 'keyout'}/cash`,
    method: 'post',
    data
  })
}

// data={
//   currency: "TWD"
// info: "789"
// pid: "T000000010"
// score: 100000
// special: false
// }
// 更新提款門檻
export const cashThresholdApi = (data) => {
  return request({
    url: '/bs/pos/threshold',
    method: 'post',
    data
  })
}
// 連續存款動作
export const cashInNextApi = () => {
  return request({
    url: '/bs/pos/req_next',
    method: 'get'
  })
}
// 清除錢包地址
export const removeWalletAddressApi = (data) => {
  return request({
    url: '/bs/pos/player/walletaddress',
    method: 'put',
    data
  })
}

// 體驗轉正式
export const handleFormalApi = (data) => {
  return request({
    url: '/bs/pos/player/formal',
    method: 'post',
    data
  })
}

// 取得好友
export const getFriendsApi = (id, date) => {
  return request({
    url: `/bs/pos/player/friend/${id}?start_time=${formatTimeZone(date.time1) ?? ''}&end_time=${formatTimeZone(date.time2) ?? ''}`,
    method: 'get'
  })
}

// 刪除GCash
export const removeGCashApi = (data) => {
  return request({
    url: '/bs/pos/player/gcashaddress',
    method: 'put',
    data
  })
}

// 取得電子細單
export const getGamesApi = (studio, uuid) => {
  const isEn = localStorage.getItem('locale') === 'EN'
  return request({
    url: `/core/games/${studio}/detail_record/${uuid}?lang=${isEn ? 'en-US' : 'zh-TW'}`,
    method: 'get'
  })
}

// 取得玩家資訊中，查詢可綁定帳號
export const getRecommendAcc = (agentID, u9) => {
  return request({
    url: `/bs/pos/${agentID}/player?id=${u9}`,
    method: 'get'
  })
}

// 取得玩家資訊中，更改邀請人
export const changeInviter = (data) => {
  console.log(data)
  return request({
    url: '/bs/pos/player/inviter',
    method: 'put',
    data
  })
}
