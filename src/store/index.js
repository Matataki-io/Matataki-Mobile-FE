import Vue from 'vue'
import Vuex from 'vuex'
import ontology from './ontology'
import scatter from './scatter'
import metamask from './metamask'
import order from './order'
import notificationAPI from '@/api/notification'

import publishMethods from '@/utils/publish_methods'
import API from '@/api/API.js'
import { getCookie, setCookie, removeCookie } from '@/utils/cookie'

if (!window.Vue) Vue.use(Vuex)
import store from '@/utils/store.js'

// 工厂函数 getDefaultState 初始化、重置
const getDefaultState = () => {
  console.log('index')
  return {
    userConfig: {
      // Identity Provider, IdP
      idProvider: null
    },
    userInfo: {
      accessToken: null, // 僅為通過 signIn 的
      nickname: ''
    },
    loginModalShow: false,
    selectTokenShow: false,
    selectedToken: null,
    notificationCounters: {},
    myUserData: {} // 我的用户信息
  }
}

export default new Vuex.Store({
  modules: {
    ontology,
    scatter,
    metamask,
    order
  },
  state: getDefaultState(),
  getters: {
    currentUserInfo: (
      { userConfig: { idProvider }, userInfo,  myUserData},
      { 'scatter/currentBalance': scatterBalance, 'ontology/currentBalance': ontologyBalance }
    ) => {
      let balance = null
      if (idProvider === 'EOS') {
        balance = scatterBalance
      } else if (idProvider === 'ONT') {
        balance = ontologyBalance
      } else if (idProvider === 'GitHub') {
        balance = null
      }
      // 用户id 用户名称
      const id = myUserData.id
      const name = myUserData.nickname || myUserData.username

      return {
        id,
        idProvider,
        name,
        balance,
        ...userInfo
      }
    },
    // 是否登录
    isLogined: (state) => {
      // 因为只 getCookie 这个值不会改变, 所以计算state来获取
      if (state.myUserData.id) {
        return !!getCookie('ACCESS_TOKEN')
      } else {
        return false
      }
    },
    isMe: (state, { currentUserInfo: { id } }) => target => id === Number(target),
    // for store
    prefixOfType: ({ userConfig: { idProvider } }) => {
      if (idProvider === 'EOS') return 'scatter'
      if (idProvider === 'MetaMask') return 'metamask'
      if (idProvider === 'ONT') return 'ontology'
      return null
    },
    // for store
    asset: ({ userConfig: { idProvider } }) => {
      let contract = null
      let symbol = null
      if (idProvider === 'EOS') {
        contract = 'eosio.token'
        symbol = 'EOS'
      } else if (idProvider === 'ONT') {
        contract = 'AFmseVrdL9f9oyCzZefL9tG6UbvhUMqNMV'
        symbol = 'ONT'
      }
      return { contract, symbol }
    },
    hasNewNotification({ notificationCounters }) {
      if (!notificationCounters || typeof notificationCounters !== 'object') return false
      for (const p in notificationCounters) {
        if (notificationCounters[p] > 0) return true
      }
      return false
    }
  },
  actions: {
    async accountCheck({
      dispatch,
      getters: {
        currentUserInfo: { accessToken, idProvider }
      }
    }) {
      console.log('account check start...')
      return dispatch('signIn', { idProvider, accessToken })
    },
    async getAuth({ dispatch }, { name = null, oldAccessToken = null }) {
      let newAccessToken = oldAccessToken
      if (!name) throw new Error('no name')
      try {
        const res = await API.auth(await dispatch('getSignatureOfAuth', { name }))
        if (res.code === 0) {
          console.log('res', res)
          newAccessToken = res.data
        } else {
          console.log('获取token报错', res.message)
          throw 'code !== 0'
        }
      } catch (error) {
        console.warn('取得 access token 出錯', error)
        throw error
      }
      return newAccessToken
    },
    // output: { publicKey, signature, username }
    async getSignature({ dispatch, getters }, data = { mode: null, rawSignData: null }) {
      // console.debug(getters.currentUserInfo, data.mode, data.rawSignData);
      const { currentUserInfo, prefixOfType } = getters
      const { idProvider } = currentUserInfo
      return { idProvider, ...(await dispatch(`${prefixOfType}/getSignature`, data)) }
    },
    async getSignatureOfArticle({ dispatch }, { author, hash }) {
      return dispatch('getSignature', { mode: 'Article', rawSignData: [author, hash] })
    },
    async getSignatureOfAuth({ dispatch }, { name = null }) {
      return dispatch('getSignature', { mode: 'Auth', rawSignData: [name] })
    },
    async signIn(
      { commit, dispatch, state, getters },
      { idProvider = null, accessToken = null }
    ) {

      console.debug('signIn:', 'idProvider:', idProvider, 'accessToken:', accessToken)

      if (!idProvider) throw new Error('did not choice idProvider')
      commit('setUserConfig', { idProvider })

      // recover
      if (accessToken) {
        console.log('signIn recover mode')
        if (idProvider === 'GitHub') {
          commit('setAccessToken', accessToken)
          return true
        }
      }

      try {
        const { prefixOfType } = getters
        const oldAccessToken = accessToken // null or from localStorage
        // Scatter
        if (idProvider === 'EOS') {
          if (!state.scatter.isConnected) {
            const result = await dispatch(`${prefixOfType}/connect`)
            if (!result) throw new Error('Scatter: connection failed')
          }
          if (!state.scatter.isLoggingIn) {
            const result = await dispatch(`${prefixOfType}/login`)
            if (!result) throw new Error('Scatter: login failed')
          }
          accessToken = await dispatch('getAuth', {
            name: getters[`${prefixOfType}/currentUsername`],
            oldAccessToken
          })
        }
        // Ontology
        else if (idProvider === 'ONT') {
          if (!state.ontology.account) await dispatch(`${prefixOfType}/getAccount`)
          await dispatch('ontology/getBalance').catch(error =>
            console.warn('Ontology: Failed to get balance :', error)
          )
          accessToken = await dispatch('getAuth', {
            name: state.ontology.account,
            oldAccessToken
          })
        }
      } catch (error) {
        console.error(error)
        dispatch('signOut')
        throw new Error(`Unable to get ${idProvider}'s id`)
      }

      // 成功後的處理
      commit('setAccessToken', accessToken)
      setCookie('idProvider', state.userConfig.idProvider)
      try {
        if (!oldAccessToken) this._vm.$userMsgChannel.postMessage('login')
      } catch (error) {
        console.log(error)
      }
      return state.userInfo.accessToken
    },
    /*
     * 購買，會自動代入目前登錄帳號，自動分流到不同合約填寫不同的合約參數格式
     * 1. 提交 order 給後端獲得 orderId
     * 2. 把其他參數打包分發給合約
     *
     * @param order - { num, amount: num * 20000, signId: 100455, sponsor: { id: null, username: null } }

      makeOrder 用法跟 makeShare 一樣，流程都打包好了，只要傳參
      推薦人參數務必用這種格式 sponsor: { id: null, username: null }
      id 和 username 有就塞沒有就 null
      一個是後端要用一個是合約要用 so...

      ex:
      makeOrder({ num, amount: num * 20000, signId: 100455, sponsor: { id: null, username: null } });
    */
    async makeOrder(
      {
        dispatch,
        getters,
        state: {
          userConfig: { idProvider }
        }
      },
      order
    ) {
      await dispatch('accountCheck')
      const order2 = { ...order, idProvider, ...getters.asset }

      let orderId = null
      const res = await API.reportOrder(order2)
      if (res.code === 0) {
        orderId = res.data.orderId
      } else {
        console.log(res.message)
      }

      // console.debug(oid);
      return dispatch(`${getters.prefixOfType}/recordOrder`, {
        ...order2,
        oId: orderId,
        sponsor: order2.sponsor.username
      })
    },
    async makeShare(
      {
        dispatch,
        getters,
        state: {
          userConfig: { idProvider }
        }
      },
      share
    ) {
      await dispatch('accountCheck')
      share.idProvider = idProvider
      if (idProvider === 'EOS') {
        share.contract = 'eosio.token'
        share.symbol = 'EOS'
      } else if (idProvider === 'ONT') {
        share.contract = 'AFmseVrdL9f9oyCzZefL9tG6UbvhUMqNMV'
        share.symbol = 'ONT'
      }
      await dispatch(`${getters.prefixOfType}/recordShare`, {
        ...share,
        sponsor: share.sponsor.username
      })

      return API.reportShare(share)
    },
    async getCurrentUser({ commit }) {
      // 没有token 自然没有当前用户信息
      if (!getCookie('ACCESS_TOKEN')) return
      
      const res = await API.getMyUserData()
      if (res.code === 0) {
        commit('setNickname', res.data.nickname || res.data.username)
        return res.data
      } else {
        commit('setNickname', '')
        return
      }
    },
    signOut({ commit, dispatch, getters: { prefixOfType } }) {
      dispatch(`${prefixOfType}/logout`)
      commit('setUserConfig')
      commit('setAccessToken')
      commit('setNickname')
      removeCookie('ACCESS_TOKEN')
      removeCookie('idProvider')
      removeCookie('referral')
      store.clear()
      sessionStorage.clear()
      this._vm.$userMsgChannel.postMessage('logout')
    },
    // data: { amount, toaddress, memo }
    async withdraw({ dispatch, getters }, data) {
      if (!publishMethods.invalidId(getters.currentUserInfo.idProvider)) {
        await dispatch('accountCheck')
      }
      console.debug(data)
      // 根据传进来的mode判断提现什么通证
      if (data.tokenName === 'EOS') {
        data.contract = 'eosio.token'
        data.symbol = 'EOS'
        data.idProvider = 'eos'
      } else if (data.tokenName === 'ONT') {
        data.contract = 'AFmseVrdL9f9oyCzZefL9tG6UbvhUMqNMV'
        data.symbol = 'ONT'
        data.idProvider = 'ont'
      }
      data.amount *= 10000 // 前端统一*10000

      const { amount, contract, symbol, toaddress, tokenName } = data
      if (!publishMethods.invalidId(getters.currentUserInfo.idProvider)) {
        data.signature = await dispatch('getSignature', {
          mode: 'withdraw',
          rawSignData: [toaddress, contract, symbol, amount],
          tokenName
        })
      }

      return API.withdraw(data)
    },
    async getNotificationCounters({ commit }) {
      const { data } = await notificationAPI.getNotificationCounters()
      if (data) commit('setNotifyCounters', data)
    },
    async clearNotificationCounter({ commit }, { provider }) {
      await notificationAPI.readNotifications(provider)
      commit('clearNotifyCounters', provider)
    },
    setLoginModal({commit}, status) {
      commit('setLoginModal', status)
    },
    // 在有token的情况下获取我的用户信息
    async getMyUserData({commit}) {
      try {
        const res = await API.getMyUserData()
        if (res.code === 0) {
          commit('setMyUserData', res.data)
        } else {
          console.log(res.message)
        }
      } catch (error) {
        console.log(error) 
      }
    },
    // 重置
    resetState ({ commit }) {
      commit('resetState')
    },
    // 重置所有状态
    resetAllStore({ commit }) {
      return new Promise((resolve, reject) => {
        try {

          // 清空all state
          commit('resetState')
          commit('metamask/resetState')
          commit('ontology/resetState')
          commit('scatter/resetState')
          
          // success
          resolve()
        } catch (error) {
          // fail
          reject(error)
        }
      })
    },
  },
  mutations: {
    setAccessToken(state, accessToken = null) {
      state.userInfo.accessToken = accessToken
      if (accessToken) {
        setCookie('ACCESS_TOKEN', accessToken)
      } else {
        removeCookie('ACCESS_TOKEN')
      }
    },
    setNickname(state, nickname = '') {
      state.userInfo.nickname = nickname
    },
    setUserConfig(state, config = null) {
      if (config) {
        setCookie('idProvider', config.idProvider)
        state.userConfig.idProvider = config.idProvider
      } else {
        removeCookie('idProvider')
        state.userConfig.idProvider = null
      }
    },
    setLoginModal(state, show) {
      state.loginModalShow = show
    },
    setSelectTokenModal(state, show) {
      state.selectTokenShow = show
    },
    setSelectedToken(state, v) {
      state.selectedToken = v
    },
    setNotifyCounters(state, counters) {
      state.notificationCounters = counters
    },
    clearNotifyCounters(state, provider) {
      if (state.notificationCounters[provider]) {
        state.notificationCounters[provider] = 0
      }
    },
    // 设置我的用户信息
    setMyUserData(state, data) {
      state.myUserData = data
    },
    // 重置
    resetState (state) {
      Object.assign(state, getDefaultState())
    }
  }
})
