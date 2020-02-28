<template>
  <div class="container">
    <home-head @login="showSidebar = true" />
    <router-view></router-view>
    <Sidebar v-model="showSidebar"></Sidebar>
  </div>
</template>


<script>
import homeHead from './components/homeHead.vue'
import Sidebar from '@/components/Sidebar/index.vue'

export default {
  components: {
    homeHead,
    Sidebar,
  },
  data() {
    return {
      showSidebar: false,
    }
  },
}
</script>
