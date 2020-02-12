import store from 'store'
// 操作localstore
export default {
  get(key) {
    return store.get(key)
  },
  set(key, val) {
    store.set(key, val)
  },
  remove(key) {
    store.remove(key)
  },
  clearAll() {
    store.clearAll()
  },
  clear() {
    // 清除全部缓存时不会清空白名单内容
    // 白名单 两端规则不一样
    // viewMode: 夜间模式
    const whitelist = ['viewMode']
    store.each((value, key) => !whitelist.includes(key) && store.remove(key))
  }
}
