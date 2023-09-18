import request from '@/utils/request'

// 取得管理員列表
export const getAdministratorApi = (name, status) => {
  return request({
    url: `/bs/bnd/user/all?name=${name}`,
    method: 'get'
  })
}

// 新增管理員
export const addAdministratorApi = (data, status) => {
  return request({
    url: '/bs/bnd/user',
    method: status === 'add' ? 'post' : 'put',
    data
  })
}

// 凍結管理員
export const freezeAdministratorApi = (data, status) => {
  return request({
    url: '/bs/bnd/user/freeze',
    method: 'put',
    data
  })
}

// 解凍管理員
export const unfreezeAdministratorApi = (data, status) => {
  return request({
    url: '/bs/bnd/user/unfreeze',
    method: 'put',
    data
  })
}
