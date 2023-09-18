import Cookies from 'js-cookie'

export default () => {
  const getToken = () => {
    return Cookies.get('token')
  }
  const setToken = token => {
    return Cookies.set('token', `Bearer ${token}`)
  }

  const removeToken = () => {
    return Cookies.remove('token')
  }

  return { getToken, setToken, removeToken }
}
