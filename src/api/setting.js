import request from '@/utils/request'
import { formatTimeZone } from '@/utils/useConvertTimeZone'

// 取得和編輯玩家公告
export const handlePlayerAnnouncementApi = (status, data, type, needChangeTimeZone) => {
  if (needChangeTimeZone) {
    if (status !== 'get') {
      for (let i = 0; i < data.announcement.length; i++) {
        const element = data.announcement[i]
        if (element.title !== '') {
          element.start_time = formatTimeZone(element.start_time)
          element.end_time = formatTimeZone(element.end_time)
        }
      }
    }
  }

  return request({
    url: `/bs/pos/announcement/${type ?? ''}`,
    method: status,
    data
  })
}

// 取得和編輯代理公告
export const handleAgentAnnouncementApi = (status, data) => {
  if (status !== 'get') {
    for (let i = 0; i < data.announcement.length; i++) {
      const element = data.announcement[i]
      if (element.title !== '') {
        element.start_time = formatTimeZone(element.start_time)
        element.end_time = formatTimeZone(element.end_time)
      }
    }
  }
  return request({
    url: '/bs/bnd/announcement',
    method: status,
    data
  })
}

// 取得和編輯活動公告
export const handleActAnnouncementApi = (status, date, data) => {
  let urls = ''
  if (status === 'get') {
    urls = `/bs/pos/announcement?start_time=${formatTimeZone(date.time1)}&end_time=${formatTimeZone(date.time2)}`
  } else {
    urls = '/bs/pos/announcement/event'
    for (const k in data.announcement) {
      data.announcement[k].start_time = formatTimeZone(data.announcement[k].start_time)
      data.announcement[k].end_time = formatTimeZone(data.announcement[k].end_time)
    }
  }
  return request({
    url: urls,
    method: status,
    data
  })
}
// 上傳圖片
export const handleActAnnouncementPICApi = (data) => {
  return request({
    url: '/bs/pos/announcement/event/picture',
    method: 'put',
    data
  })
}
// 取得圖片
export const getAnoucementImg = (pictureID) => {
  return request({
    url: `/bs/pos/announcement/${pictureID}`,
    method: 'get',
    responseType: 'blob'
  })
}
// 新增和編輯跑馬燈
export const handleMarqueeApi = (status, data, order, addStatus) => {
  console.log(order)
  // data有ID 表示編輯  沒有表示新增
  if (status === 'put') {
    for (const k in data.newsticker) {
      if (addStatus === 'add') {
        if (Number(k) === data.newsticker.length - 1) {
          data.newsticker[k].start_time = formatTimeZone(data.newsticker[k].start_time)
          data.newsticker[k].end_time = formatTimeZone(data.newsticker[k].end_time)
          data.newsticker[k].update_time = formatTimeZone(data.newsticker[k].update_time)
        }
      } else {
        if (Number(k) === order) {
          console.log(typeof (k))
          data.newsticker[k].start_time = formatTimeZone(data.newsticker[k].start_time)
          data.newsticker[k].end_time = formatTimeZone(data.newsticker[k].end_time)
          data.newsticker[k].update_time = formatTimeZone(data.newsticker[k].update_time)
        }
      }
    }
  }
  return request({
    url: '/bs/pos/newsticker',
    method: status,
    data
  })
}
// 取得所有輪播圖列表
export const getBannersApi = (startTime, endTime, page) => {
  return request({
    url: `/bs/pos/banners?pagesize=10&start_time=${formatTimeZone(startTime)}&end_time=${formatTimeZone(endTime)}&page=${page}`,
    method: 'get'
  })
}
// 取得所有輪播圖圖片
export const getBannersPicApi = (pictureID) => {
  return request({
    url: `/bs/pos/banners/picture?pid=${pictureID}`,
    method: 'get',
    responseType: 'blob'
  })
}
// 上傳輪播圖圖片
export const uploadBannerPicApi = (data) => {
  return request({
    url: '/bs/pos/banners/picture',
    method: 'put',
    data
  })
}
// 上傳輪播圖資料
export const uploadBannerDataApi = (data) => {
  return request({
    url: '/bs/pos/banners',
    method: 'post',
    data
  })
}

// 取得/新增/編輯 站內信列表
export const handleStationMailApi = (status, data, page) => {
  let urls = ''
  if (status === 'get') {
    urls = `/bs/pos/mail?start_time=${formatTimeZone(data.time1)}&end_time=${formatTimeZone(data.time2)}&page_size=100&page=${page}`
  } else {
    urls = '/bs/pos/mail'
    data.send_time = formatTimeZone(data.send_time)
  }
  return request({
    url: urls,
    method: status,
    data
  })
}

// 取消站內信
export const cancelSendStationMail = (id) => {
  return request({
    url: `/bs/pos/mail/cancel/${id}`,
    method: 'get'
  })
}
//
export const sendstatationMailPic = (data) => {
  return request({
    url: '/bs/pos/mail/picture',
    method: 'put',
    data
  })
}
