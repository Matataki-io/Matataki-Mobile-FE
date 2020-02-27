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
  },
  async reportOrder(order) {
    const data = {
      ...order,
      platform: 'need',
      referrer: order.sponsor.id
    }
    const { idProvider } = data
    data.amount = toPrecision(data.amount, idProvider)
    delete data.idProvider
    delete data.sponsor
    return this.accessBackend({ method: 'POST', url: '/order/order', data })
  },
  async reportShare(share) {
    const data = {
      ...share,
      platform: 'need',
      referrer: share.sponsor.id
    }
    const { idProvider } = data
    data.amount = toPrecision(data.amount, idProvider)
    delete data.idProvider
    delete data.sponsor
    return this.accessBackend({ method: 'POST', url: '/support/support', data })
  },

  /*
   * 根据用户名，公钥，客户端签名请求access_token
   */
  async auth({ idProvider, publicKey: publickey, signature: sign, username, msgParams }) {
    let params = {
      platform: idProvider.toLowerCase(),
      publickey,
      sign,
      username,
      msgParams
    }
    // 推荐人id
    let referral = utils.getCookie('referral')
    if (referral) Object.assign(params, { referral: referral })
    return axiosforApiServer.post('/login/auth', params)
  },
  async getUser({ id }) {
    return this.accessBackend({ url: `/user/${id}` })
  },
  // 获取账户资产列表 暂时没有EOS数据
  async getBalance() {
    return this.accessBackend({ url: '/user/balance' })
  },
  async withdraw(rawData) {
    const data = { ...rawData, platform: rawData.tokenName.toLowerCase() }
    if (rawData.signature) {
      data.publickey = rawData.signature.publicKey
      data.sign = rawData.signature.signature
    }
    delete data.idProvider
    delete data.tokenName
    delete data.signature
    return this.accessBackend({ method: 'POST', url: '/user/withdraw', data })
  },
}

export default API
