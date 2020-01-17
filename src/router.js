import Vue from 'vue'
import VueRouter from 'vue-router'
import { accessTokenAPI } from '@/api'
// wechat share
import wechatShare from './utils/wechat_share'
import { getCookie } from '@/utils/cookie'

if (!window.VueRouter) Vue.use(VueRouter)

// 路由级 code-splitting
// 这会给当前的路由页生成单独的块文件 (webpackChunkName 是 about 则得到 about.[版本哈希].js)
// 只有使用该 route 的场合才会下载这个页面的代码 (惰性加载).
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    { path: '/', redirect: '/article' },
    {
      path: '/home',
      name: 'home',
      component: () =>
        import(/* webpackChunkName: "index", webpackPrefetch: true  */ './views/index/index.vue'),
      meta: {
        title: '首页-瞬MATATAKI'
      }
    },
    // {
    //   path: '/index_backup',
    //   name: 'indeindex_backup',
    //   component: () =>
    //     import(
    //       /* webpackChunkName: "index", webpackPrefetch: true  */ './views/index/index.vue'
    //     ),
    //   meta: {
    //     title: '首页-瞬MATATAKI'
    //   }
    // },
    {
      path: '/article',
      name: 'article',
      component: () =>
        import(/* webpackChunkName: "article", webpackPrefetch: true  */ './views/home/home_layout.vue'),
      meta: {
        title: '文章-瞬MATATAKI'
      }
    },
    {
      path: '/sharehall',
      name: 'sharehall',
      props: true,
      component: () => import(/* webpackChunkName: "policy" */ './views/home/sharehall.vue'),
      meta: {
        title: '分享大厅-瞬MATATAKI'
      }
    },
    {
      path: '/share/:id',
      name: 'share-id',
      props: true,
      component: () => import(/* webpackChunkName: "policy" */ './views/share/_id.vue'),
      meta: {
        title: '分享详情-瞬MATATAKI'
      }
    },
    {
      path: '/ring/:id',
      name: 'ring-id',
      component: () =>
        import(/* webpackChunkName: "ring-id", webpackPrefetch: true  */ './views/ring/index.vue'),
      meta: {
        title: 'fan票圈详情-瞬MATATAKI'
      }
    },
    {
      path: '/ring/:id/founder',
      name: 'ring-id-founder',
      component: () =>
        import(/* webpackChunkName: "ring-id-founder", webpackPrefetch: true  */ './views/ring/founder.vue'),
      meta: {
        title: 'fan票圈创始人详情-瞬MATATAKI'
      }
    },
    {
      path: '/shop',
      name: 'shop',
      component: () =>
        import(/* webpackChunkName: "shop", webpackPrefetch: true  */ './views/home/shop.vue'),
      meta: {
        title: '商品-瞬MATATAKI'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        title: '关于-瞬MATATAKI'
      }
    },
    {
      path: '/p/:id', // 支持 hash id 访问
      name: 'p-id',
      props: true,
      component: () =>
        import(/* webpackChunkName: "p", webpackPrefetch: true */ './views/p/index.vue'),
      meta: {
        title: '文章详情-瞬MATATAKI'
      }
    },
    {
      path: '/tag',
      name: 'Tag',
      props: true,
      component: () => import(/* webpackChunkName: "Tag" */ './views/Tag/index.vue'),
      meta: {
        title: '标签-瞬MATATAKI'
      }
    },
    {
      path: '/login/github',
      name: 'login-github',
      component: () => import(/* webpackChunkName: "login-github" */ './views/login/github.vue'),
      mata: {
        title: 'Github登录-瞬MATATAKI'
      }
    },
    {
      path: '/login/email',
      name: 'login-email',
      component: () => import(/* webpackChunkName: "login-email" */ './views/login/email.vue'),
      mata: {
        title: '邮箱绑定-瞬MATATAKI'
      }
    },
    {
      path: '/login/weixin',
      name: 'WeixinLogin',
      component: () => import(/* webpackChunkName: "Login" */ './views/weixinLogin.vue'),
      mata: {
        title: '微信登录'
      }
    },
    {
      path: '/login/telegram',
      name: 'login-telegram',
      component: () => import(/* webpackChunkName: "telegramLogin" */ './views/login/telegram.vue'),
      mata: {
        title: 'Telegram Login'
      }
    },
    {
      path: '/user/:id',
      name: 'user-id',
      component: () =>
        import(/* webpackChunkName: "user-id", webpackPrefetch: true */ './views/user/index.vue'),
      meta: {
        title: '个人主页-瞬MATATAKI'
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import(/* webpackChunkName: "setting" */ './views/setting/index.vue'),
      meta: {
        title: '信息设置-瞬MATATAKI'
      }
    },
    {
      path: '/setting/account',
      name: 'setting-account',
      component: () => import(/* webpackChunkName: "setting-account" */ './views/setting/account.vue'),
      meta: {
        title: '账号设置-瞬MATATAKI'
      }
    },
    {
      path: '/user/asset/:id',
      name: 'Asset',
      props: true,
      component: () => import(/* webpackChunkName: "Asset" */ './views/user/Asset/index.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'user-id', params: { id } })
        else {
          next()
        }
      },
      meta: {
        title: '资产-瞬MATATAKI'
      }
    },
    {
      path: '/user/asset/:id/:type',
      name: 'AssetType',
      props: true,
      component: () => import(/* webpackChunkName: "AssetType" */ './views/user/Asset/Asset.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'user-id', params: { id } })
        else {
          next()
        }
      },
      meta: {
        title: '资产-瞬MATATAKI'
      }
    },
    // todo 钱包账户路由, 逐步向pc的路由同步名称
    {
      path: '/account/cny',
      name: 'accountCny',
      component: () => import(/* webpackChunkName: "accountCny" */ './views/account/cny.vue'),
      meta: {
        title: '资产-瞬MATATAKI'
      }
    },
    {
      path: '/user/withdraw/:id/:type',
      name: 'Withdraw',
      props: true,
      component: () => import(/* webpackChunkName: "Withdraw" */ './views/user/Withdraw'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'user-id', params: { id } })
        else {
          next()
        }
      },
      meta: {
        title: '资产-瞬MATATAKI'
      }
    },
    {
      path: '/user/:id/original',
      name: 'Original',
      props: true,
      component: () => import(/* webpackChunkName: "Original" */ './views/user/Original.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'user-id', params: { id } })
        else {
          next()
        }
      },
      meta: {
        title: '原创-瞬MATATAKI'
      }
    },
    {
      path: '/user/:id/share',
      name: 'user-id-share',
      props: true,
      component: () =>
        import(/* webpackChunkName: "user-id-share" */ './views/user/share.vue'),
      meta: {
        title: '分享-瞬MATATAKI'
      }
    },
    // {
    //   path: '/user/:id/reward',
    //   name: 'Reward',
    //   props: true,
    //   component: () => import(/* webpackChunkName: "Reward" */ './views/user/Reward.vue'),
    //   beforeEnter: (to, from, next) => {
    //     const { id } = to.params
    //     const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
    //     if (id != idOfToken) next({ name: 'user-id', params: { id } })
    //     else {
    //       next()
    //     }
    //   },
    //   meta: {
    //     title: '投资-瞬MATATAKI'
    //   }
    // },
    {
      path: '/user/:id/follow',
      name: 'user-id-follow',
      props: true,
      component: () => import(/* webpackChunkName: "user-id-follow" */ './views/user/follow.vue'),
      meta: {
        title: '我的关注-瞬MATATAKI'
      }
    },
    {
      path: '/user/:id/fan',
      name: 'user-id-fan',
      props: true,
      component: () => import(/* webpackChunkName: "user-id-fan" */ './views/user/fan.vue'),
      meta: {
        title: '我的粉丝-瞬MATATAKI'
      }
    },
    {
      path: '/user/:id/info',
      name: 'user-id-info',
      props: true,
      component: () => import(/* webpackChunkName: "user-id-info" */ './views/user/info.vue'),
      meta: {
        title: '个人信息-瞬MATATAKI'
      }
    },
    {
      path: '/buy',
      name: 'buy',
      props: true,
      component: () => import(/* webpackChunkName: "buy" */ './views/user/buyHistory/index'),
      meta: {
        title: '购买文章-瞬MATATAKI'
      }
    },
    {
      path: '/buy/other',
      name: 'buy-other',
      props: true,
      component: () => import(/* webpackChunkName: "buy" */ './views/user/buyHistory/other'),
      meta: {
        title: '购买其他-瞬MATATAKI'
      }
    },
    {
      path: '/publish/:type/:id',
      name: 'publish-type-id',
      props: true,
      component: () =>
        import(/* webpackChunkName: "publish-type-id" */ './views/publish/index.vue'),
      meta: {
        title: '编辑文章-瞬MATATAKI'
      }
    },
    {
      path: '/followlist/:id',
      name: 'FollowList',
      props: true,
      component: () =>
        import(/* webpackChunkName: "FollowList" */ './views/user/FollowList/FollowList.vue'),
      meta: {
        title: '关注列表-瞬MATATAKI'
      }
    },
    {
      path: '/draftbox/:id',
      name: 'DraftBox',
      props: true,
      component: () => import(/* webpackChunkName: "DraftBox" */ './views/user/DraftBox.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'user-id', params: { id } })
        else {
          next()
        }
      },
      meta: {
        title: '草稿-瞬MATATAKI'
      }
    },
    {
      path: '/bookmark',
      name: 'BookmarkList',
      props: true,
      component: () =>
        import(/* webpackChunkName: "BookmarkList" */ './views/user/BookmarkList/index.vue'),
      meta: {
        title: '收藏-瞬MATATAKI'
      }
    },
    {
      path: '/help',
      name: 'help',
      props: true,
      component: () => import(/* webpackChunkName: "help" */ './views/help/index.vue'),
      meta: {
        title: '帮助-瞬MATATAKI'
      }
    },
    {
      path: '/point',
      name: 'point',
      props: true,
      component: () => import(/* webpackChunkName: "point" */ './views/point/index.vue'),
      meta: {
        title: '积分-瞬MATATAKI'
      }
    },
    {
      path: '/invite',
      name: 'invite',
      props: true,
      component: () => import(/* webpackChunkName: "invite" */ './views/invite/index.vue'),
      meta: {
        title: '邀请-瞬MATATAKI'
      }
    },
    {
      path: '/search',
      name: 'search',
      props: true,
      component: () => import(/* webpackChunkName: "search" */ './views/search/index.vue'),
      meta: {
        title: '搜索-瞬MATATAKI'
      }
    },
    {
      path: '/search/shop',
      name: 'search/shop',
      props: true,
      component: () => import(/* webpackChunkName: "search/shop" */ './views/search/shop.vue'),
      meta: {
        title: '搜索-瞬MATATAKI'
      }
    },
    {
      path: '/search/user',
      name: 'search/user',
      props: true,
      component: () => import(/* webpackChunkName: "search/user" */ './views/search/user.vue'),
      meta: {
        title: '搜索-瞬MATATAKI'
      }
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: () => import(/* webpackChunkName: "exchange" */ './views/exchange/index.vue'),
      meta: {
        title: 'Fan票交易所-瞬MATATAKI'
      }
    },
    {
      path: '/tokens',
      name: 'tokens',
      component: () => import(/* webpackChunkName: "tokens" */ './views/tokens/index.vue'),
      meta: {
        title: 'Fan票-瞬MATATAKI'
      }
    },
    {
      path: '/tokens/:id',
      name: 'tokensId',
      component: () => import(/* webpackChunkName: "tokensId" */ './views/tokens/id.vue'),
      meta: {
        title: 'Fan票-瞬MATATAKI'
      }
    },
    {
      path: '/minetoken',
      name: 'minetoken',
      component: () => import(/* webpackChunkName: "minetoken" */ './views/minetoken/index.vue'),
      meta: {
        title: 'Fan票-瞬MATATAKI'
      }
    },
    {
      path: '/ipfs/:hash',
      name: 'ipfs',
      component: () => import(/* webpackChunkName: "ipfs" */ './views/ipfs/index.vue'),
      meta: {
        title: 'IPFS-瞬MATATAKI'
      }
    },
    {
      path: '/editminetoken',
      name: 'editminetoken',
      component: () =>
        import(/* webpackChunkName: "editminetoken" */ './views/minetoken/token.vue'),
      meta: {
        title: 'Fan票-瞬MATATAKI'
      }
    },
    {
      path: '/postminetoken',
      name: 'postminetoken',
      component: () =>
        import(/* webpackChunkName: "postminetoken" */ './views/minetoken/token.vue'),
      meta: {
        title: 'Fan票-瞬MATATAKI'
      }
    },
    {
      path: '/token',
      name: 'token',
      component: () =>
        import(/* webpackChunkName: "token", webpackPrefetch: true */ './views/token/index.vue'),
      meta: {
        title: 'Fan票-瞬MATATAKI'
      }
    },
    {
      path: '/order/:id',
      name: 'order-id',
      component: () => import(/* webpackChunkName: "order-id" */ './views/order/index.vue'),
      meta: {
        title: '订单详情页-瞬MATATAKI'
      }
    },
    {
      path: '/alipay',
      name: 'alipay',
      component: () => import(/* webpackChunkName: "alipay" */ './views/order/alipay.vue'),
      meta: {
        title: 'alipay'
      }
    },
    {
      path: '/pay/weixin',
      name: 'WeixinPay',
      component: () => import(/* webpackChunkName: "WeixinPay" */ './views/weixinPay.vue'),
      mata: {
        title: '微信支付'
      }
    },
    {
      path: '/token/:id',
      name: 'token-id',
      component: () => import(/* webpackChunkName: "token-id" */ './views/token/_id.vue'),
      meta: {
        title: 'Fan票-瞬MATATAKI'
      }
    },
    {
      path: '/holdliquidity',
      name: 'holdliquidity',
      component: () =>
        import(/* webpackChunkName: "holdliquidity" */ './views/holdliquidity/index.vue'),
      meta: {
        title: 'Fan票-瞬MATATAKI'
      }
    },
    {
      path: '/holdliquidity/:id',
      name: 'holdliquidity-id',
      component: () =>
        import(/* webpackChunkName: "holdliquidityId" */ './views/holdliquidity/id.vue'),
      meta: {
        title: 'Fan票-瞬MATATAKI'
      }
    },
    {
      path: '/notification/:provider',
      name: 'notification',
      component: () =>
        import(/* webpackChunkName: "notification" */ './views/notification/_provider.vue'),
      meta: {
        title: '消息通知-瞬MATATAKI'
      }
    },
    {
      path: '/token/:id/related',
      name: 'MinetokenRelated',
      props: true,
      component: () =>
        import(/* webpackChunkName: "MinetokenRelated" */ './views/minetoken/related/index.vue'),
      meta: {
        title: '相关创作-瞬MATATAKI'
      }
    },
    {
      path: '/agreement',
      name: 'agreement',
      props: true,
      component: () => import(/* webpackChunkName: "agreement" */ './views/agreement/index.vue'),
      meta: {
        title: '用户服务协议-瞬MATATAKI'
      }
    },
    {
      path: '/policy',
      name: 'policy',
      props: true,
      component: () => import(/* webpackChunkName: "policy" */ './views/policy/index.vue'),
      meta: {
        title: '用户隐私政策-瞬MATATAKI'
      }
    },
    {
      // 幽林页面重定向进入 404 页面
      path: '*',
      name: 404,
      component: () => import(/* webpackChunkName: "404" */ './views/404/index.vue')
    }
  ]
})
router.beforeEach((to, from, next) => {
  const hasLoginPage = [
    // TODO: 移动端路由和pc不一样需要统一, 否则这块数组路由无法统一
    'invite',
    'minetoken',
    'editminetoken',
    'postminetoken',
    'setting',
    'publish-type-id',
    'buy',
    'buy-other'
  ] // 需要登陆才能进入
  // TODO: 单纯用 document.referrer判断暂未想好, 目前跳转到首页
  // 需要登陆的页面没有token
  if (hasLoginPage.includes(to.name) && !getCookie('ACCESS_TOKEN')) next('/')
  else next()
})
router.afterEach(to => {
  Vue.nextTick(() => {
    wechatShare({
      title: to.meta.title
    })
  })
  const autoAlertLoginPage = [] // 进入页面没有登陆则弹出信息框
  // 需要登陆的页面没有登陆, 弹出登陆框
  if (autoAlertLoginPage.includes(to.name) && !getCookie('ACCESS_TOKEN')) {
    Vue.nextTick(() => {
      setTimeout(() => {
        // TODO: 需要settimeout才能正常执行 需要调整
        router.app.$options.store.commit('setLoginModal', true)
      }, 0)
    })
  }
})

export default router
