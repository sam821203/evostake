import request from '@/utils/request'

// 確認帳戶是否重複
export const checkAccountApi = (data) => {
  return request({
    url: '/bs/check/ac',
    method: 'post',
    data
  })
}

// 確認暱稱是否重複
export const checkNicknameApi = (data) => {
  return request({
    url: '/bs/check/nickname',
    method: 'post',
    data
  })
}

// 創建代理
export const addAgentApi = (data) => {
  return request({
    url: '/bs/agent',
    method: 'post',
    data
  })
}
