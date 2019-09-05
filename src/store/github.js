import { backendAPI } from '@/api'

const state = {}

const getters = {}

const actions = {
  // eslint-disable-next-line no-empty-pattern
  async signIn({}, { code }) {
    if (!code) throw new Error('GitHub login faild, no code.')
    const res = await backendAPI.loginGitHub(code)
    if (res.status === 200 && res.data.code === 0) return res.data.data
    else return ''
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
