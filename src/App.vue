<script setup>
import Sidebar from './components/Sidebar.vue'

</script>
<script>
export default {
  name: 'App',
  methods: {
    getList() {
      this.$http.get(api).then((response) => {
        console.log(response.data)
      })
    }
  }
}
</script>


<template>
  <div class="container">
    <nav class="sidebar">
      <Sidebar />
    </nav>
    <router-view></router-view>
  </div>

</template>