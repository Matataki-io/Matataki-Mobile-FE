import axios from 'axios'
import https from 'https'
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
import { toPrecision } from '../common/precisionConversion'
import utils from '../utils/utils'

export const urlAddress = process.env.VUE_APP_URL
export const apiServer = process.env.VUE_APP_API

// https://github.com/axios/axios/issues/535
const axiosforApiServer = axios.create({
  baseURL: apiServer,
  headers: { Accept: '*/*', lang: 'zh' },
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
})

// accessToken with Cookies
export const accessTokenAPI = {
  get() {
    const token = Cookies.get('ACCESS_TOKEN')
    if (token === 'null' || token === 'undefined') {
      this.rm()
      return this.get()
    }
    return token
  },
  set(token) {
    if (!token) this.rm()
    else Cookies.set('ACCESS_TOKEN', token, { expires: 1 })
  },
  rm() {
    Cookies.remove('ACCESS_TOKEN')
  },
  /*
   * 拆token，返回json对象
   * {iss:用户名，exp：token的过期时间，用ticks的形式表示}
   */
  disassemble(token) {
    if (!token) return { iss: null, exp: 0, platform: null, id: null }
    let tokenPayload = token.substring(token.indexOf('.') + 1)
    tokenPayload = tokenPayload.substring(0, tokenPayload.indexOf('.'))
    return JSON.parse(Base64.decode(tokenPayload))
  }
}

const API = {
  accessToken: null,
  /* eslint no-param-reassign: ["error", { "props": false }] */
  async accessBackend(config) {
    let token = null
    try {
      token = await this.accessToken
    } catch (error) {
      // console.debug(error);
    }
    console.debug('x-access-token :', token)
    // https://blog.fundebug.com/2018/07/25/es6-const/
    if (token) config.headers = { 'x-access-token': token }
    if (config.data && config.data.platform && config.data.platform === 'need') {
      config.data.platform = accessTokenAPI.disassemble(token).platform
    }
    return axiosforApiServer(config)
  }
}

export default API
