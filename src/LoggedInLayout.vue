<template>
  <div id="app">
    <Navbar />
    <div class="h-screen flex flex-row flex-wrap">
      <Sidebar />
       <!-- strat content -->
      <div class="bg-gray-100 flex-1 p-6 md:mt-16 mt-16"> 
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/templates/Navbar.vue'
import Sidebar from './components/templates/Sidebar.vue'

export default {
  name: 'LoggedInLayout',
  components: {
    Navbar,
    Sidebar
  }
}
</script>
