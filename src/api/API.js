/* eslint-disable */
import request from '@/utils/request'
import qs from 'qs'

const ssImgAddress = 'https://ssimg.frontenduse.top'
import { getCookie } from '@/utils/cookie'
import { paginationUrl } from './pagination_url'
import { replaceStr } from '@/utils/reg'


export default {
  getImg(hash) {
    return `${ssImgAddress}${hash}`
  },
  getWeixinOpenId(code) {
    return request.post('/wx/login', { code })
  },
  // 获取单篇文章的信息 by hash or id  需要 token 否则无法获取投资状态
  getArticleInfo(hashOrId) {
    const reg = /^[0-9]*$/
    // post hash获取  ， p id 短链接
    const url = reg.test(hashOrId) ? 'p' : 'post'
    return request({ url: `/${url}/${hashOrId}` })
  },
  sendPost({ title, author, desc, content }) {
    const stringifyData = qs.stringify({
      'data[title]': title,
      'data[author]': author,
      'data[desc]': desc,
      'data[content]': content
    })
    return request({
      method: 'post',
      url: `/post/ipfs`,
      data: stringifyData,
      config: { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    })
  },
  //-------------微信支付-----------------
  wxNativePay(tradeNo, title) {
    return this.orderWxpay({
      tradeNo,
      trade_type: 'NATIVE',
      title
    })
  },
  wxJsapiPay(tradeNo, openid, title) {
    return this.orderWxpay({
      tradeNo,
      trade_type: 'JSAPI',
      title,
      openid
    })
  },
  orderWxpay(order) {
    return request.post('/order/wxpay', order)
  },
  //-------------微信支付-----------------
  allToken({page = 1, pagesize = 10, search = ''}) {
    return request({
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
  // 通过hash获取文章内容
  getIpfsData(hash) {
    return request.get(`/post/ipfs/${hash}`)
  },
  getMyPost(id) {
    return request.get(`/mypost/${id}`)
  },
  /**
   * 创建我的token
   * // TODO 有字段后可移除注释
   * @param {Objject} data name symbol decimals // icon 暂无
   */
  minetokenCreate(data) {
    return request({
      method: 'POST',
      url: '/minetoken/create',
      data: data
    })
  },
  /**
   * 发行我的token
   * @param {Object} data amount
   */
  minetokenMint(data) {
    return request({
      method: 'POST',
      url: '/minetoken/mint',
      data: data
    })
  },
  /**
   * 修改token详情
   * @param {Object} data token详情
   * @param {Number} tokenId token id
   */
  minetokenTokenId(data, tokenId) {
    return request({
      method: 'PUT',
      url: `/minetoken/${tokenId}`,
      data: data
    })
  },
  /**
  * 修改token资源
  * @param {Object} data token资源
  * @param {Number} tokenId token id
  */
minetokenResources(data, tokenId) {
    return request({
      method: 'PUT',
      url: `/minetoken/${tokenId}/resources`,
      data: data
    })
  },
minetokenGetResources(tokenId) {
    return request({
      method: 'GET',
      url: `/minetoken/${tokenId}/resources`,
    })
  },
  /**
   * 转移token
   * @param {*} data tokenId to amount
   */
  transferMinetoken(data) {
    return request({
      method: 'POST',
      url: '/minetoken/transfer',
      data: data
    })
  },
    /**
   * Fan票详情
   * @param {Number} id token id
   */
  minetokenId(id) {
    return request({
      method: 'GET',
      url: `/minetoken/${id}`,
    })
  },
  /**
   * 获取token详情
   * 请求头：x-access-token
   * 用户发行了token，data为对象，没有发行token，data为null
   */
  tokenDetail() {
    return request.get('/token/minetoken')
  },
  // -------------------------------- exchange API --------------------------------
  getCurrentPoolSize(tokenId) {
    return request({
      method: 'get',
      url: '/exchange/currentPoolSize',
      params: {
        tokenId
      }
    })
  },
  getYourPoolSize(tokenId) {
    return request({
      method: 'get',
      url: '/exchange/userPoolSize',
      params: {
        tokenId
      }
    })
  },
  getYourMintToken(tokenId, amount) {
    return request({
      method: 'get',
      url: '/exchange/userMintToken',
      params: {
        tokenId, amount
      }
    })
  },
  getOrderStatus(tradeNo) {
    return request({
      method: 'get',
      url: '/exchange/notify',
      params: {
        trade_no: tradeNo
      }
    })
  },
  getOutputAmount(inputTokenId, outputTokenId, inputAmount) {
    return request({
      method: 'get',
      url: '/exchange/outputAmount',
      params: {
        inputTokenId, outputTokenId, inputAmount
      }
    })
  },
  getInputAmount(inputTokenId, outputTokenId, outputAmount) {
    return request({
      method: 'get',
      url: '/exchange/inputAmount',
      params: {
        inputTokenId, outputTokenId, outputAmount
      }
    })
  },
  // token 换 token / cny接口
  swap({inputTokenId, outputTokenId, amount, limitValue, base}) {
    return request({
      method: 'post',
      url: '/exchange/swap',
      data: {
        inputTokenId, outputTokenId, amount, limitValue, base
      }
    })
  },
  getOutputPoolSize(amount, tokenId) {
    return request({
      method: 'get',
      url: '/exchange/outputPoolSize',
      params: {
        amount, tokenId
      }
    })
  },
  removeLiquidity({ tokenId, amount, min_cny, min_tokens }) {
    return request({
      method: 'post',
      url: '/exchange/removeLiquidity',
      data: {
        tokenId, amount, min_cny, min_tokens
      }
    })
  },
  getPoolCnyToTokenPrice(inputTokenId, outputTokenId, inputAmount) {
    return request({
      method: 'get',
      url: '/exchange/poolCnyToTokenPrice',
      params: {
        outputTokenId, inputAmount
      }
    })
  },
  getUserBalance(tokenId) {
    return request({
      method: 'get',
      url: '/minetoken/balance',
      params: {
        tokenId
      }
    })
  },
  getCNYBalance() {
    return request({
      method: 'get',
      url: '/asset/balance',
      params: {
        symbol: 'CNY'
      }
    })
  },
  addLiquidityBalance({tokenId, cny_amount, token_amount, min_liquidity, max_tokens, deadline}) {
    return request({
      method: 'post',
      url: '/exchange/addLiquidityBalance',
      data: {
        tokenId, cny_amount, token_amount, min_liquidity, max_tokens, deadline 
      }
    })
  },
  // 以输入为准
  cnyToTokenInputBalance({tokenId, cny_sold, min_tokens, deadline}) {
    return request({
      method: 'post',
      url: '/exchange/cnyToTokenInputBalance',
      data: {
        tokenId, cny_sold, min_tokens, deadline
      }
    })
  },
  // 以输出为准
  cnyToTokenOutputBalance({tokenId, tokens_bought, max_cny, deadline}) {
    return request({
      method: 'post',
      url: '/exchange/cnyToTokenOutputBalance',
      data: {
        tokenId, tokens_bought, max_cny, deadline
      }
    })
  },
  getPurchaseLogs(tokenId) {
    return request({
      method: 'get',
      url: '/token/purchaseLogs',
      params: {
        tokenId
      }
    })
  },
  getMyPurchaseLogs(tokenId) {
    return request({
      method: 'get',
      url: '/token/myPurchaseLogs',
      params: {
        tokenId
      }
    })
  },
  getLiquidityLogs(tokenId) {
    return request({
      method: 'get',
      url: '/token/liquidityLogs',
      params: {
        tokenId
      }
    })
  },
  getMyLiquidityLogs(tokenId) {
    return request({
      method: 'get',
      url: '/token/myLiquidityLogs',
      params: {
        tokenId
      }
    })
  },
  /**
   * 文章导入
   * @param {String} url 导入地址
   */
  importArticle(url) {
    return request({
      method: 'post',
      url: '/posts/importer',
      data:{ url },
      timeout: 40000,
    })
  },
    // 文章持通证阅读
    addMineTokens(data) {
      return request({
        method: 'post',
        url: '/post/addMineTokens',
        data: data,
      })
    },
    // 文章持币支付
    articlePrices(id, data) {
      return request({
        method: 'PUT',
        url: `/posts/${id}/prices`,
        data: data,
      })
    },
  // 删除文章持通证支付
  articlePricesDelete(id) {
    return request({
      method: 'DELETE',
      url: `/posts/${id}/prices`,
    })
  },
  /**
   * 发布文章接口 通用方法 私有方法
   * @param {String} url 接口地址
   * @param {Object} param1 文章参数
   * @param {String || null} signature 签名
   */
  _sendArticle(
    url,
    { signId = null, author, hash, title, fissionFactor, cover, isOriginal, tags, commentPayPoint, shortContent, cc_license },
    signature = null
  ) {
    // 账号类型
    let idProvider = (getCookie('idProvider')).toLocaleLowerCase()
    return request({
      method: 'POST',
      url,
      data: {
        author,
        cover,
        fissionFactor,
        hash,
        platform: idProvider,
        publickey: signature ? signature.publicKey : null,
        sign: signature ? signature.signature : null,
        signId,
        title,
        is_original: isOriginal,
        tags,
        commentPayPoint,
        cc_license,
        shortContent
      }
    })
  },
  /**
   * 发布文章
   * @param {Object} params 参数, 签名 非钱包用户需要签名
   */
  publishArticle({ article, signature }) {
    return this._sendArticle('/post/publish', article, signature)
  },
  /**
   * 编辑文章
   * @param {Object} params 参数, 签名 非钱包用户需要签名
   */
  editArticle({ article, signature }) {
    return this._sendArticle('/post/edit', article, signature)
  },
  // 创建草稿
  createDraft({ title, content, cover, fissionFactor, isOriginal, tags, commentPayPoint }) {
    return request({
      method: 'POST',
      url: '/draft/save',
      data: {
        title,
        content,
        cover,
        fissionFactor,
        is_original: isOriginal,
        tags,
        commentPayPoint
      }
    })
  },
  // 更新草稿
  updateDraft({ id, title, content, cover, fissionFactor, isOriginal, tags, commentPayPoint }) {
    return request({
      method: 'POST',
      url: '/draft/save',
      data: {
        id,
        title,
        content,
        cover,
        fissionFactor,
        is_original: isOriginal,
        tags,
        commentPayPoint
      }
    })
  },
  getDraft({ id }) {
    return request({ url: `/draft/${id}` })
  },
  // 微信登录数据保存到数据库
  loginWeixin(code) {
    return request({
      method: 'POST',
      url: '/login/weixin',
      data: {
        code
      }
    })
  },
  // 创建订单
  createOrder(order) {
    return request({
      method: 'PUT',
      url: '/orders',
      data: order
    })
  },
  getOrderData(tradeNo) {
    return request({
      method: 'get',
      url: `/orders/${tradeNo}`
    })
  },
  updateOrder(tradeNo, order) {
    return request({
      method: 'put',
      url: `/orders/${tradeNo}`,
      data: order
    })
  },
  handleAmount0(tradeNo) {
    return request({
      method: 'post',
      url: '/orders/handleAmount0',
      data: {
        tradeNo
      }
    })
  },
  getMyUserData() {
    return request({
      method: 'get',
      url: '/user/stats',
    })
  },
  follow(uid) {
    return request.post('/follow/follow', { uid })
  },
  unfollow(uid) {
    return request.post('/follow/unfollow', { uid })
  },
  // 根据symbol获取token信息
  getTokenBySymbol(symbol) {
    return request({
      method: 'GET',
      url: '/token/symbol',
      params: {
        symbol
      }
    })
  },
  tokenUserId(id) {
    return request({
      method: 'get',
      url: `/token/user/${id}`,
    })
  },
  transferAsset({ symbol = 'cny', to, amount }) {
    return request({
      method: 'POST',
      url: '/asset/transfer',
      data: {
        symbol, to, amount
      }
    })
  },
  async getResetCaptcha(email, { geetest_challenge, geetest_validate, geetest_seccode }) {
    return request({
      method: 'POST',
      url: `/login/resetPassword/captcha?email=${email}`,
      data: {
        geetest_challenge,
        geetest_validate,
        geetest_seccode
      }
    })
  },
  async resetPassword({ email, password, captcha }) {
    return request({
      method: 'POST',
      url: `/login/resetPassword`,
      data: {
        email,
        password,
        captcha: captcha.toString()
      }
    })
  },
    /**
   * 上传图片
   * @param {String} type 上传类型
   * @param {Object} data 上传数据
   */
  uploadImage(type, data) {
    const url = {
      avatar: '/user/uploadAvatar',
      artileCover: '/post/uploadImage',
      coins: '/post/uploadImage', // fan票的icon也考虑新开路由
      banner: '/user/uploadBanner'
    }
    const formdata = new FormData()
    formdata.append('image', data)
    return request({
      method: 'POST',
      url: url[type],
      data: formdata
    })
  },
  ossUploadImage(folder, data) {
    const folderOption = {
      avatar: 'avatar', // 头像
      userBanner: 'userBanner', // 用户封面
      articleCover: 'articleCover', // 文章封面
      article: 'article', // 编辑器上传
      temp: 'temp', // 临时文件
      coin: 'coin', // fan票
    }
    const formdata = new FormData()
    // Invalid filename blob
    let filename = data.name ? data.name.split('.') : 'png'
    if (typeof filename !== 'string') {
      filename = filename[filename.length - 1]
    }
    formdata.append('file', data, `${Date.now()}.${filename}`)
    return request({
      method: 'POST',
      url: `/oss/uploadImage?folder=${folderOption[folder]}`,
      data: formdata
    })
  },
  async verifyEmail(email) {
    return request({
      url: '/login/verify',
      method: 'get',
      params: { email },
      noLoading: true
    })
  },
  registerGT() {
    return request({
      url:`/gt/register-slide?t=${(new Date()).getTime()}`,
      method: 'get',
      dataType: "json",
    })
  },
  async getCaptcha(email, { geetest_challenge, geetest_validate, geetest_seccode }) {
    return request.post(`/login/captcha?email=${email}`, {
      geetest_challenge,
      geetest_validate,
      geetest_seccode
    }, { noLoading: true })

    return request.get('/login/captcha', { params: {email}, noLoading: true })
  },
  /**
   * 解析引用网址的title
   * @param {Object} data {url: xxx}
   */
  extractRefTitle(data) {
    return request({
      method: 'POST',
      url: '/posts/extractRefTitle',
      data
    })
  },
  // 得到用户信息
  getUser(id) { return request.get(`/user/${id}`) },
  // 增加阅读量
  read(hash) { return request.post(`/post/show/${hash}`) },
  // 获取当前用户的文章信息
  currentProfile(data) { return request.post('/post/currentProfile', data) },
  // 收藏
  bookmark(id) { return request.post(`/post/${id}/bookmark`) },
  unbookmark(id) { return request.delete(`/post/${id}/bookmark`) },
  // 点赞
  like(id, data) { return request.post(`/posts/${id}/like`, data) },
  dislike(id, data) { return request.post(`/posts/${id}/dislike`, data) },
  // 客户端打开文章后提交，表示开始阅读
  reading(id) { return request.post(`/posts/${id}/reading`) },
  // 获取推荐文章或者商品
  postsRecommend(params) { return request.get('/posts/recommend', { params }) },
  // -------------------------------- 账号绑定 --------------------------------
  // account binding
  accountBind(params) { return request.post('/account/binding', params) },
  // account unbinding
  accountUnbind(params) { return request.post('/account/unbinding', params) },
  // 切换主账号
  accountChange(params) { return request.post('/account/changeMainAccount', params) },
  // 账号列表
  accountList() { return request.get('/account/list') },
  // -------------------------------- 分享 --------------------------------
  // 创建分享
  createShare(data) { return request.post('/share', data) },
  // 分享详情
  // 暂时不用, 后端说用 p 接口
  // shareDetail(id) { return request.get(`/share/${id}`) },
  shareDetail(id) { return request.get(`/p/${id}`) },
  postsIdReadnew(id, time) {
    return request({
      method: 'POST',
      url: `/posts/${id}/readnew`,
      data: { time }
    })
  },
  // 删除文章
  async delArticle({ id }) {
    return request({
      method: 'DELETE',
      url: `/post/${id}`
    })
  },
  async addReadAmount(hash) {
    return request({
      method: 'POST',
      url: `/post/show/${hash}`
    })
  },
  // 提交积分评论
  async postPointComment(data) {
    return request({
      method: 'POST',
      url: '/comment/comment',
      data: data
    })
  },
  /**
   * BasePull 分页组件
   * @param {Object} param params参数
   */
  async getBackendData({ url, params, urlReplace }) {
    try {
      if (!urlReplace) {
        const pullApiUrl = paginationUrl
        return request({
          url: pullApiUrl[url],
          method: 'get',
          noLoading: true,
          params
        })
      } else {
        const pullApiUrl = paginationUrl
        let urlReg = replaceStr(pullApiUrl[url], ':', '/', urlReplace)
        return request({
          url: urlReg,
          method: 'get',
          noLoading: true,
          params
        })
      }
    }
    catch(err) {
      console.error(err)
    }
  },
  telegramLogin(data) {
    return request({
      method: 'POST',
      url: '/login/telegram',
      data: data
    })
  }
}
