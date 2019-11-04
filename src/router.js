import Vue from 'vue'
import VueRouter from 'vue-router'
import { accessTokenAPI } from '@/api'
// wechat share
import wechatShare from './utils/wechat_share'

if (!window.VueRouter) Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "index" */ './views/index/index.vue'),
      meta: {
        title: '首页-瞬MATATAKI'
      }
    },
    {
      path: '/article',
      name: 'article',
      component: () => import(/* webpackChunkName: "article" */ './views/home/index.vue'),
      meta: {
        title: '文章-瞬MATATAKI'
      }
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import(/* webpackChunkName: "shop" */ './views/home/shop.vue'),
      meta: {
        title: '商品-瞬MATATAKI'
      }
    },
    {
      path: '/about',
      name: 'About',
      // 路由级 code-splitting
      // 这会给当前的路由页生成单独的块文件 (webpackChunkName 是 about 则得到 about.[版本哈希].js)
      // 只有使用该 route 的场合才会下载这个页面的代码 (惰性加载).
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
      meta: {
        title: '关于-瞬MATATAKI'
      }
    },
    {
      path: '/p/:id', // 支持 hash id 访问
      name: 'p',
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
      name: 'Login',
      component: () => import(/* webpackChunkName: "Login" */ './views/Login.vue'),
      beforeEnter: (to, from, next) => {
        if (!to.query.from) {
          next({ name: 'Login', query: { ...to.query, from: from.path } })
        } else next()
      }
    },
    {
      path: '/user/:id',
      name: 'user-id',
      component: () => import(/* webpackChunkName: "user-id" */ './views/User/index.vue'),
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
      path: '/user/asset/:id',
      name: 'Asset',
      props: true,
      component: () => import(/* webpackChunkName: "Asset" */ './views/User/Asset/index.vue'),
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
      component: () => import(/* webpackChunkName: "AssetType" */ './views/User/Asset/Asset.vue'),
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
      component: () => import(/* webpackChunkName: "Withdraw" */ './views/User/Withdraw'),
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
      component: () => import(/* webpackChunkName: "Original" */ './views/User/Original.vue'),
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
      path: '/user/:id/reward',
      name: 'Reward',
      props: true,
      component: () => import(/* webpackChunkName: "Reward" */ './views/User/Reward.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'user-id', params: { id } })
        else {
          next()
        }
      },
      meta: {
        title: '投资-瞬MATATAKI'
      }
    },
    {
      path: '/buyHistory',
      name: 'BuyHistory',
      props: true,
      component: () => import(/* webpackChunkName: "BuyHistory" */ './views/User/buyHistory'),
      meta: {
        title: '购买-瞬MATATAKI'
      }
    },
    {
      // id 用于编辑文章或者草稿的时候动态传值使用
      // 发布文章后面可以为  publish/create
      // 编辑文章后面接id publish/id？from=”edit“ 通过query来区分
      // 草稿箱编辑 publish/id？from=”draft“ 通过query来区分
      // 统一发布、编辑、草稿箱，解决出现多套样式和重复代码的问题，并且减少工作量和不必要的错误
      path: '/publish/:id',
      name: 'Publish',
      props: true,
      component: () => import(/* webpackChunkName: "Publish" */ './views/Publish/Publish.vue'),
      meta: {
        title: '编辑文章-瞬MATATAKI'
      }
      // beforeEnter: (to, from, next) => {
      //   if (to.query.from === 'edit' && from.name !== 'Article') next('/')
      //   else next()
      // }
    },
    {
      path: '/followlist/:id',
      name: 'FollowList',
      props: true,
      component: () =>
        import(/* webpackChunkName: "FollowList" */ './views/User/FollowList/FollowList.vue'),
      meta: {
        title: '关注列表-瞬MATATAKI'
      }
    },
    {
      path: '/draftbox/:id',
      name: 'DraftBox',
      props: true,
      component: () => import(/* webpackChunkName: "DraftBox" */ './views/User/DraftBox.vue'),
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
      path: '/help',
      name: 'Help',
      props: true,
      component: () => import(/* webpackChunkName: "Help" */ './views/User/Help/index.vue'),
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
        title: '粉丝币交易所-瞬MATATAKI'
      }
    },
    {
      path: '/tokens',
      name: 'tokens',
      component: () => import(/* webpackChunkName: "tokens" */ './views/tokens/index.vue'),
      meta: {
        title: '粉丝币-瞬MATATAKI'
      }
    },
    {
      path: '/tokens/:id',
      name: 'tokensId',
      component: () => import(/* webpackChunkName: "tokensId" */ './views/tokens/id.vue'),
      meta: {
        title: '粉丝币-瞬MATATAKI'
      }
    },
    {
      path: '/minetoken',
      name: 'minetoken',
      component: () => import(/* webpackChunkName: "minetoken" */ './views/minetoken/index.vue'),
      meta: {
        title: '粉丝币-瞬MATATAKI'
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
        title: '粉丝币-瞬MATATAKI'
      }
    },
    {
      path: '/postminetoken',
      name: 'postminetoken',
      component: () =>
        import(/* webpackChunkName: "postminetoken" */ './views/minetoken/token.vue'),
      meta: {
        title: '粉丝币-瞬MATATAKI'
      }
    },
    {
      path: '/token',
      name: 'token',
      component: () => import(/* webpackChunkName: "token" */ './views/token/index.vue'),
      meta: {
        title: '粉丝币-瞬MATATAKI'
      }
    },
    {
      path: '/token/:id',
      name: 'token-id',
      component: () => import(/* webpackChunkName: "token-id" */ './views/token/_id.vue'),
      meta: {
        title: '粉丝币-瞬MATATAKI'
      }
    },
    {
      path: '/token/detail/:id',
      name: 'token-detail-id',
      component: () =>
        import(/* webpackChunkName: "token-detail-id" */ './views/token/detail/_id.vue'),
      meta: {
        title: '粉丝币-瞬MATATAKI'
      }
    },
    {
      path: '/holdliquidity',
      name: 'holdliquidity',
      component: () =>
        import(/* webpackChunkName: "holdliquidity" */ './views/holdliquidity/index.vue'),
      meta: {
        title: '粉丝币-瞬MATATAKI'
      }
    },
    {
      path: '/holdliquidity/:id',
      name: 'holdliquidity-id',
      component: () =>
        import(/* webpackChunkName: "holdliquidityId" */ './views/holdliquidity/id.vue'),
      meta: {
        title: '粉丝币-瞬MATATAKI'
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

router.afterEach((to, from) => {
  // console.log(to, from)
  Vue.nextTick(() => {
    wechatShare({
      title: to.meta.title
    })
  })
})

export default router
