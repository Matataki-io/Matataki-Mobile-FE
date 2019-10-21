import Vue from 'vue'
import VueRouter from 'vue-router'
import { accessTokenAPI } from '@/api'

if (!window.VueRouter) Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import(/* webpackChunkName: "index" */ './views/index/index.vue')
    },
    {
      path: '/article',
      name: 'article',
      component: () => import(/* webpackChunkName: "article" */ './views/home/index.vue')
    },
    {
      path: '/shop',
      name: 'shop',
      component: () => import(/* webpackChunkName: "shop" */ './views/home/shop.vue')
    },
    {
      path: '/about',
      name: 'About',
      // 路由级 code-splitting
      // 这会给当前的路由页生成单独的块文件 (webpackChunkName 是 about 则得到 about.[版本哈希].js)
      // 只有使用该 route 的场合才会下载这个页面的代码 (惰性加载).
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/p/:id', // 支持 hash id 访问
      name: 'p',
      props: true,
      component: () =>
        import(/* webpackChunkName: "p", webpackPrefetch: true */ './views/p/index.vue')
    },
    {
      path: '/tag',
      name: 'Tag',
      props: true,
      component: () => import(/* webpackChunkName: "Tag" */ './views/Tag/index.vue')
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
      name: 'User',
      component: () => import(/* webpackChunkName: "User" */ './views/User/index.vue')
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import(/* webpackChunkName: "setting" */ './views/setting/index.vue')
    },
    {
      path: '/user/asset/:id',
      name: 'Asset',
      props: true,
      component: () => import(/* webpackChunkName: "Asset" */ './views/User/Asset/index.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
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
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
      }
    },
    // todo 钱包账户路由, 逐步向pc的路由同步名称
    {
      path: '/account/cny',
      name: 'accountCny',
      component: () => import(/* webpackChunkName: "accountCny" */ './views/account/cny.vue')
    },
    {
      path: '/user/withdraw/:id/:type',
      name: 'Withdraw',
      props: true,
      component: () => import(/* webpackChunkName: "Withdraw" */ './views/User/Withdraw'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
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
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
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
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
      }
    },
    {
      path: '/buyHistory',
      name: 'BuyHistory',
      props: true,
      component: () => import(/* webpackChunkName: "BuyHistory" */ './views/User/buyHistory')
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
      component: () => import(/* webpackChunkName: "Publish" */ './views/Publish/Publish.vue')
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
        import(/* webpackChunkName: "FollowList" */ './views/User/FollowList/FollowList.vue')
    },
    {
      path: '/draftbox/:id',
      name: 'DraftBox',
      props: true,
      component: () => import(/* webpackChunkName: "DraftBox" */ './views/User/DraftBox.vue'),
      beforeEnter: (to, from, next) => {
        const { id } = to.params
        const { id: idOfToken } = accessTokenAPI.disassemble(accessTokenAPI.get())
        if (id != idOfToken) next({ name: 'User', params: { id } })
        else {
          next()
        }
      }
    },
    {
      path: '/help',
      name: 'Help',
      props: true,
      component: () => import(/* webpackChunkName: "Help" */ './views/User/Help/index.vue')
    },
    {
      path: '/point',
      name: 'point',
      props: true,
      component: () => import(/* webpackChunkName: "point" */ './views/point/index.vue')
    },
    {
      path: '/invite',
      name: 'invite',
      props: true,
      component: () => import(/* webpackChunkName: "invite" */ './views/invite/index.vue')
    },
    {
      path: '/search',
      name: 'search',
      props: true,
      component: () => import(/* webpackChunkName: "search" */ './views/search/index.vue')
    },
    {
      path: '/search/shop',
      name: 'search/shop',
      props: true,
      component: () => import(/* webpackChunkName: "search/shop" */ './views/search/shop.vue')
    },
    {
      path: '/search/user',
      name: 'search/user',
      props: true,
      component: () => import(/* webpackChunkName: "search/user" */ './views/search/user.vue')
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: () => import(/* webpackChunkName: "exchange" */ './views/exchange/index.vue')
    },
    {
      path: '/tokens',
      name: 'tokens',
      component: () => import(/* webpackChunkName: "tokens" */ './views/tokens/index.vue')
    },
    {
      path: '/tokens/:id',
      name: 'tokensId',
      component: () => import(/* webpackChunkName: "tokensId" */ './views/tokens/id.vue')
    },
    {
      path: '/minetoken',
      name: 'minetoken',
      component: () => import(/* webpackChunkName: "minetoken" */ './views/minetoken/index.vue')
    },
    {
      path: '/minetoken/detail',
      name: 'minetokenDetail',
      component: () =>
        import(/* webpackChunkName: "minetokenDetail" */ './views/minetoken/detail.vue')
    },
    {
      path: '/ipfs/:hash',
      name: 'ipfs',
      component: () => import(/* webpackChunkName: "ipfs" */ './views/ipfs/index.vue')
    },
    {
      // 幽林页面重定向进入 404 页面
      path: '*',
      name: 404,
      component: () => import(/* webpackChunkName: "404" */ './views/404/index.vue')
    }
  ]
})
