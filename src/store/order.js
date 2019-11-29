import { Dialog } from 'vant'
import { Loading } from 'element-ui'
import utils from '@/utils/utils'
import API from '@/api/API'
import router from '@/router'

const state = {}

const getters = {
  makeOrderParams: () => ({
    input,
    output,
    outputToken,
    type,
    needToken = true,
    needPrice = false,
    signId
  }) => {
    console.log(input, output, outputToken, type)
    const requestParams = {
      useBalance: 0,
      items: []
    }
    if (needToken) {
      requestParams.items.push({
        tokenId: outputToken.id,
        type,
        cny_amount: utils.toDecimal(input, outputToken.decimals),
        amount: utils.toDecimal(output, outputToken.decimals)
      })
    }
    if (needPrice) {
      requestParams.items.push({
        signId,
        type: 'buy_post'
      })
    }
    return requestParams
  }
}

const actions = {
  // 创建订单
  createOrder({ getters }, data) {
    const loading = Loading.service({
      lock: false,
      text: '订单创建中...',
      background: 'rgba(0, 0, 0, 0.4)'
    })
    const requestParams = getters.makeOrderParams(data)
    API.createOrder(requestParams).then(res => {
      loading.close()
      if (res.code === 0) {
        router.push({
          name: 'order-id',
          params: {
            id: res.data
          }
        })
      } else {
        Dialog.alert({
          title: '温馨提示',
          message: '订单创建失败'
        })
      }
    })
  }
}

const mutations = {}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
