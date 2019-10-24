/* eslint-disable func-names */
import axios from 'axios'
// import './clamp'
// style
import './index.less'
// img
// import readImg from './img/read.svg'
// import upsImg from './img/ups.svg'
// import logoImg from './img/share_logo.png'
import token from './img/token.svg'

// 获取url信息
const urlSearch = window.location.search.substr(1).split('&')
// 获取容器
const appDom = document.querySelector('#app')
// 地址
const urlMode = {
  development: {
    url: 'https://test.smartsignature.io',
    api: 'https://apitest.smartsignature.io'
  },
  production: {
    url: 'https://matataki.io',
    api: 'https://api.smartsignature.io'
  }
}
const mode = process.env.NODE_ENV
const { url } = urlMode[mode]
const baseUrl = urlMode[mode].api
const imageAddress = 'http://ssimg.frontenduse.top'

// 数据
let urlSearchData = {}

// axios 设置
const axiosApi = axios.create({
  baseURL: baseUrl
})

// url 参数解析
const urlSearchDecodeURIComponent = arr => {
  const data = {}
  arr.forEach(i => {
    const arrData = i.split('=')
    data[arrData[0]] = decodeURIComponent(arrData[1])
  })
  return data
}
urlSearchData = urlSearchDecodeURIComponent(urlSearch)

// 设置内容
const setAppDom = ({ symbol, name, username, brief, img }) => {
  console.log(symbol, name, username, brief, img)
  const appDomStr = `
      <div class="container">
        <div class="widget">
          <a class="logo" target="_blank" href="https://www.matataki.io/">
            <img src="${token}" alt="token" />
          </a>
          <a class="footer" target="_blank" href="https://www.matataki.io/">
          Powered by 瞬MATATAKI
          </a>
          <a class="token" target="_blank" href="https://www.matataki.io/">
            <img class="token-cover" src="${img}" alt="cover" />
          </a>
          <div class="token-info">
            <div class="token-info-line">
              <div class="token-title bold">${symbol || '暂无'}</div>
              <div class="token-sub">${name || '暂无'}</div>
            </div>
            <div class="token-info-line">
              <div class="token-title">创始人：</div>
              <div class="token-sub">${username || '暂无'}</div>
            </div>
            <div class="token-info-line">
              <div class="token-title">简&emsp;介：</div>
              <div class="token-sub">${brief || '暂无'}</div>
            </div>
          </div>
        </div>
      </div>`
  appDom.innerHTML = appDomStr
  // show line 3
  // eslint-disable-next-line no-undef
  // $clamp(document.querySelector('.widget-des'), { clamp: 3 })
}

// 通过id获取信息
const getInfobyId = id => {
  const url = `/minetoken/${id}`
  axiosApi
    .get(url)
    .then(response => {
      if (response.status === 200 && response.data.code === 0) {
        const { data } = response.data

        let urlSearchData = {}
        urlSearchData.symbol = data.token.symbol
        urlSearchData.name = data.token.name
        urlSearchData.username = data.user.nickname || data.user.username
        urlSearchData.brief = data.token.brief
        urlSearchData.img = data.token.logo ? `${imageAddress}${data.token.logo}` : token

        const { symbol, name, username, brief, img } = urlSearchData

        setAppDom({
          symbol,
          name,
          username,
          brief,
          img
        })
      } else {
        console.error('请求失败')
        setAppDom({
          img: token
        })
      }
    })
    .catch(error => {
      console.log(error)
      setAppDom({
        img: token
      })
    })
}
getInfobyId(urlSearchData.id)
