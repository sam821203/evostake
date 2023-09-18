import request from '@/utils/request'

export const loginApi = (data) => {
  return request({
    url: '/bs/login',
    method: 'post',
    data
  })
}

export const logoutApi = () => {
  return request({
    url: '/bs/logout',
    method: 'post'
  })
}
