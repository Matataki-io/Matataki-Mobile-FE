/* eslint-disable func-names */
import axios from 'axios'
// import './clamp'
// style
import './index.less'
// img
// import readImg from './img/read.svg'
// import upsImg from './img/ups.svg'
import logoImg from './img/widget_user_logo.png'
// import token from './img/token.svg'

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
const setAppDom = ({ username, follows, fans, img, introduction }) => {
  const appDomStr = `
      <div class="container">
        <div class="widget">
          <a class="logo" target="_blank" href="${url}/user/${urlSearchData.id}">
            <img src="${logoImg}" alt="logo" />
          </a>
          <a class="footer" target="_blank" href="${url}">
          Powered by 瞬MATATAKI
          </a>
          <a class="token" target="_blank" href="${url}/user/${urlSearchData.id}">
            <img class="token-cover" src="${img}" alt="cover" />
          </a>
          <div class="token-info">
            <div class="token-info-line">
            <a class="token-title"  target="_blank" href="${url}/user/${urlSearchData.id}">
              ${username || '暂无昵称'}
            </a>
            </div>
            <div class="token-info-line">
              <div class="token-sub">
                关注：${follows || 0}
                &nbsp;
                &nbsp;
                粉丝：${fans || 0}
              </div>
            </div>
            <div class="token-info-line">
              <div class="token-sub">
                简介：${introduction || '暂无'}
              </div>
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
  const url = `/user/${id}`
  axiosApi
    .get(url)
    .then(response => {
      if (response.status === 200 && response.data.code === 0) {
        const { data } = response.data

        console.log(data)

        let urlSearchData = {}
        urlSearchData.username = data.nickname || data.username
        urlSearchData.follows = data.follows
        urlSearchData.fans = data.fans
        urlSearchData.introduction = data.introduction
        urlSearchData.img = data.avatar ? `${imageAddress}${data.avatar}` : logoImg

        const { username, follows, fans, img, introduction, id } = urlSearchData

        console.log(urlSearchData)

        setAppDom({
          username,
          follows,
          fans,
          img,
          introduction
        })
      } else {
        console.error('请求失败')
        setAppDom({
          img: logoImg
        })
      }
    })
    .catch(error => {
      console.log(error)
      setAppDom({
        img: logoImg
      })
    })
}

// 如果id是0 也不会请求
if (urlSearchData.id) {
  getInfobyId(urlSearchData.id)
} else {
  setAppDom({
    img: logoImg
  })
}
