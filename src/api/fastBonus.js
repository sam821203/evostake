import request from '@/utils/request'

// 查詢快派群組列表
export const getFastBonusgroup = (e) => {
  return request({
    url: `/bs/pos/instantbonus/${e}`,
    method: 'get'
  })
}

// 新增快派群組列表
export const addnewFastBonusgroup = (data) => {
  return request({
    url: '/bs/pos/instantbonus',
    method: 'post',
    data
  })
}

// 刪除快派群組列表
export const delFastBonusgroup = (groupName) => {
  return request({
    url: `/bs/pos/instantbonus/${groupName}`,
    method: 'delete'
  })
}

// 編輯快派群組列表
export const editFastBonusgroup = (data) => {
  return request({
    url: '/bs/pos/instantbonus',
    method: 'put',
    data // json
  })
}
