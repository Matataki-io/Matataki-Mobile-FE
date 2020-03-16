<template>
  <div class="notification">
    <BaseHeader
      :pageinfo="{ title: $t('notification.title') }"
      customize-header-bc="#fff"
      :has-bottom-border-line="true"
    />
    <NotificationNav :nav-list="nav" />
    <NotificationList :provider="PROVIDERS[active]" />
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import NotificationNav from './components/NotificationNav'
import NotificationList from './components/NotificationList'

// const ALL_PROVIDERS = ['follow', 'recommend', 'comment', 'message', 'notice']
const PROVIDERS = ['follow']
export default {
  name: 'Notifications',
  components: {
    NotificationNav,
    NotificationList
  },
  props: {},
  data() {
    return {
      PROVIDERS
    }
  },
  computed: {
    ...mapState(['notificationCounters']),
    active() {
      const index = PROVIDERS.indexOf(this.$route.params.provider)
      return index >= 0 ? index : 0
    },
    nav() {
      return ['follow', 'recommend', 'comment', 'message', 'notice'].map(name => {
        return { name, text: this.$t(`notification.${name}`), enabled: PROVIDERS.includes(name) }
      })
    }
  },
  watch: {},
  mounted() {
    this.getNotificationCounters()
  },
  methods: {
    ...mapActions(['getNotificationCounters'])
  }
}
</script>
