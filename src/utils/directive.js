import i18n from '@/utils/language/i18n'
const { t } = i18n.global

// 小數點兩位+千分號轉換
const updateNum = (val) => {
  const parts = String(val).includes('.') ? val.toFixed(3).slice(0, -1).toString().split('.') : [String(val)]
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts
}
export const money = (data) => {
  if (typeof data !== 'object') return updateNum(data).join('.')
  return data.directive('money', (el, binding) => {
    if (!binding.value && binding.value !== 0) return (el.innerText = 0)
    el.innerText = updateNum(binding.value).join('.')
    el.style.color = binding.value < 0 ? 'red' : ''
  })
}

// 日期時間轉換
const moment = require('moment')
moment.suppressDeprecationWarnings = true
export const time = (app) => {
  return app.directive('time', (el, binding) => {
    // if (binding.value === '1970-01-01T00:00:00Z' || binding.value === '0001-01-01T00:00:00Z') return (el.innerText = '-')
    // const time = moment(binding.value).format('YYYY-MM-DD HH:mm:ss')
    // if (time !== 'Invalid date' && time.indexOf('1970-01-01 ')) return (el.innerText = time)
    // return (el.innerText = false)
    if (
      binding.value === '1970-01-01T00:00:00Z' ||
      binding.value === '0001-01-01T00:00:00Z'
    ) {
      return (el.innerText = '-')
    }

    // Convert RFC3339 time to moment object with UTC timezone
    const utcMoment = moment.utc(binding.value)

    // Convert UTC moment to Brazil timezone (BRT)
    const brazilMoment = utcMoment.tz('America/Sao_Paulo')

    // Format the Brazil time in the desired format
    const formattedTime = brazilMoment.format('YYYY-MM-DD HH:mm:ss')

    // Update the element's innerText
    el.innerText = formattedTime
  })
}

// 凍結or解凍狀態
export const status = (app) => {
  return app.directive('status', (el, binding) => {
    if (typeof binding.value === 'string') {
      el.innerText = binding.value === 'Enable' ? t('常態') : t('凍結')
      el.style.color = binding.value === 'Enable' ? '#128b12' : 'red'
    } else {
      el.innerText = !binding.value ? t('常態') : t('凍結')
      el.style.color = !binding.value ? '#128b12' : 'red'
    }
  })
}

// 字元過長 最後轉換...
export const omitLast = (app) => {
  return app.directive('omitLast', (el, binding) => {
    binding.value = binding.value?.replaceAll('\n', '')
    el.innerText = binding.value?.length > 10 ? binding.value.slice(0, 10) + '...' : binding.value
  })
}

// 字元過長 開頭轉換...
export const omitFirst = (app) => {
  return app.directive('omitFirst', (el, binding) => {
    if (binding.value === undefined) return
    el.innerText = binding.value.length > 10 ? '...' + binding.value.slice(-6) : binding.value
  })
}

// 遊戲類別轉換
export const game = (app) => {
  return app.directive('game', (el, binding) => {
    if (binding.value.includes('_')) {
      const key = binding.value.replaceAll('_TWD', '')
      switch (key) {
        case 'goldenwind':
          el.innerText = t('鏈遊')
          break
        case 'sportnice666':
          el.innerText = t('體育')
          break
        case 'joygames':
          el.innerText = t('電子遊戲')
          break
        case 'goldenwind_pk':
          el.innerText = t('棋牌')
          break
        default:
          el.innerText = '查無類別'
      }
      return
    }
    switch (binding.value) {
      case 'hash':
        el.innerText = t('鏈遊')
        break
      case 'sport':
        el.innerText = t('體育')
        break
      case 'rlm':
        el.innerText = t('視訊機台')
        break
      case 'ele':
        el.innerText = t('電子遊戲')
        break
      case 'live':
        el.innerText = '真人桌'
        break
      case 'goldenwind_pk':
        el.innerText = t('棋牌')
        break
      default:
        el.innerText = '查無類別'
    }
  })
}

// RTP
export const rtp = (app) => {
  return app.directive('rtp', (el, binding) => {
    if (!binding.value) return (el.innerText = 0)
    const soure = String(binding.value)
    const start = String(binding.value).length - 2
    const num = soure.slice(0, start)
    el.innerText = `${!num ? 0 : ''}${num}.${soure.slice(start)}`
  })
}
