import request from '@/utils/request'

export default {
  fetchNotifications(provider, page = 1, type = 'check_time') {
    return request.get('/notification/fetch', { params: { page, type, provider } })
  },
  getNotificationCounters() {
    return request.get('/notification')
  },
  readNotifications(provider) {
    return request.post('/notification/read', { provider })
  }
}
