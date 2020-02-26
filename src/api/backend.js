import axios from 'axios'
import https from 'https'
import Cookies from 'js-cookie'
import { Base64 } from 'js-base64'
import { toPrecision } from '../common/precisionConversion'
import utils from '../utils/utils'
import { paginationUrl } from './pagination_url'
// Doc : https://github.com/axios/axios

import { replaceStr } from '@/utils/reg'

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
  async getArticleDatafromIPFS(hash) {
    return axios.get(`${apiServer}/post/ipfs/${hash}`)
  },
  // 获取单篇文章的信息 by hash or id  需要 token 否则无法获取投资状态
  async getArticleInfo(hashOrId) {
    const reg = /^[0-9]*$/
    // post hash获取  ， p id 短链接
    const url = reg.test(hashOrId) ? 'p' : 'post'
    return this.accessBackend({ url: `/${url}/${hashOrId}` })
  },
  async follow({ id }) {
    return this.accessBackend({
      method: 'POST',
      url: '/follow/follow',
      data: { uid: id }
    })
  },
  async unfollow({ id }) {
    return this.accessBackend({
      method: 'POST',
      url: '/follow/unfollow',
      data: { uid: id }
    })
  },
  async getUser({ id }) {
    return this.accessBackend({ url: `/user/${id}` })
  },
  async sendComment({ comment, signId }) {
    return this.accessBackend({
      method: 'POST',
      url: '/post/comment',
      // eslint-disable-next-line camelcase
      data: { comment, sign_id: signId }
    })
  },
  // 设置头像
  async uploadAvatar(data = { avatar: null }) {
    return this.accessBackend({
      method: 'POST',
      url: '/user/setAvatar',
      data
    })
  },
  // 上传图片
  async uploadImage(type, data) {
    const url = {
      avatar: '/user/uploadAvatar',
      artileCover: '/post/uploadImage',
      coins: '/post/uploadImage',
      banner: '/user/uploadBanner'
    }
    const formdata = new FormData()
    formdata.append('image', data)
    return this.accessBackend({
      method: 'POST',
      url: url[type],
      data: formdata
    })
  },
  // BasePull 分页组件
  getBackendData({ url, params, urlReplace }, needAccessToken = false) {
    if (!urlReplace) {
      const pullApiUrl = paginationUrl
      return !needAccessToken
        ? axiosforApiServer.get(pullApiUrl[url], { params })
        : this.accessBackend({
            method: 'get',
            url: pullApiUrl[url],
            params
          })
    } else {
      const pullApiUrl = paginationUrl
      let urlReg = replaceStr(pullApiUrl[url], ':', '/', urlReplace)
      return !needAccessToken
        ? axiosforApiServer.get(urlReg, { params })
        : this.accessBackend({
            method: 'get',
            url: urlReg,
            params
          })
    }
  },
  async setProfile({ nickname, introduction, email, accept }) {
    return this.accessBackend({
      method: 'POST',
      url: '/user/setProfile',
      data: {
        nickname,
        introduction,
        email,
        accept
      }
    })
  },
  async getMyPost(id) {
    return this.accessBackend({ url: `/mypost/${id}` })
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
  async loginGitHub(code) {
    let params = { code }
    // 推荐人id
    let referral = utils.getCookie('referral')
    if (referral) Object.assign(params, { referral: referral })

    return axiosforApiServer.post('/login/github', params)
  },
  async wxShare(url) {
    return axios.get(`${apiServer}/wx/sign?url=${url}`)
  },
  async getCaptcha(email, { geetest_challenge, geetest_validate, geetest_seccode }) {
    return axiosforApiServer.post(`/login/captcha?email=${email}`, {
      geetest_challenge,
      geetest_validate,
      geetest_seccode
    })
  },
  async verifyEmail(email) {
    return axiosforApiServer({
      url: '/login/verify',
      method: 'get',
      params: { email },
      noLoading: true
    })
  },
  async register({ email, password, captcha, referral }) {
    return axiosforApiServer.post('/login/regist', {
      email,
      password,
      captcha: captcha.toString(),
      referral
    })
  },
  async login({ username, password }) {
    return axiosforApiServer.post('/login/account', { username, password })
  },
  registerGT() {
    return axiosforApiServer({
      url: `/gt/register-slide?t=${new Date().getTime()}`,
      method: 'get',
      dataType: 'json'
    })
  },
  postsIdReadnew(id, time) {
    return this.accessBackend({
      method: 'POST',
      url: `/posts/${id}/readnew`,
      data: { time }
    })
  },
  wxlogin(code) {
    return axiosforApiServer.post('/wx/login', { code })
  },
  wxpay(total, openid) {
    return axiosforApiServer.post('/wx/pay', { total, openid })
  },
  // 文章持通证阅读
  addMineTokens(data) {
    return this.accessBackend({
      method: 'post',
      url: '/post/addMineTokens',
      data: data
    })
  },
  allToken({ page = 1, pagesize = 10, search = '' }) {
    return this.accessBackend({
      url: '/token/all',
      method: 'get',
      noLoading: true,
      params: {
        page,
        pagesize,
        search
      }
    })
  },
  // 获取当前用户的文章信息
  getCurrentProfile(data) {
    return this.accessBackend({
      url: '/post/currentProfile',
      method: 'post',
      data: data
    })
  },
  // 通过hash获取文章内容
  getIpfsData(hash) {
    return this.accessBackend({
      url: `/post/ipfs/${hash}`
    })
  },
}

export default API
