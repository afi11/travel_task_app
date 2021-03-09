<template>
  <!-- start sidebar -->
  <div
    id="sideBar"
    class="relative flex flex-col shadow flex-wrap bg-blue-100 border-r border-gray-300 p-6 flex-none w-64 md:-ml-64 md:fixed md:top-0 md:z-30 md:h-screen md:shadow-xl animated faster"
  >
    <!-- sidebar content -->
    <div class="flex flex-col fixed">
      <div class="spacer w-full mb-5"></div>
      <!-- sidebar toggle -->
      <div class="text-right hidden md:block mb-4">
        <button id="sideBarHideBtn">
          <i class="fad fa-times-circle"></i>
        </button>
      </div>
      <!-- end sidebar toggle -->
      <p class="uppercase text-xs text-gray-600 mt-5 mb-5 tracking-wider">
        Menu
      </p>
      <span v-if="isloading"> Memuat menu... </span>
      <div v-if="!isloading" class="flex flex-col">
        <!-- link -->
        <router-link
          v-if="!isemployer"
          to="/"
          @click="selected = 1"
          :class="{ active: selected == 1 }"
          class="mb-5 capitalize font-medium text-sm hover:text-blue-600 transition ease-in-out duration-500"
        >
          <i class="fad fa-chart-pie text-xs mr-2"></i> Dashboard
        </router-link>
        <!-- end link -->
        <!-- link -->
        <router-link
          v-if="!isemployer"
          to="/pegawai"
          @click="selected = 2"
          :class="{ active: selected == 2 }"
          class="mb-5 capitalize font-medium text-sm hover:text-blue-600 transition ease-in-out duration-500"
        >
          <i class="fad fa-user text-xs mr-2"></i> Pegawai
        </router-link>
        <!-- end link -->
        <!-- link -->
        <router-link
          v-if="!isemployer"
          to="/penugasan"
          class="mb-3 capitalize font-medium text-sm hover:text-blue-600 transition ease-in-out duration-500"
        >
          <i class="fad fa-tasks text-xs mr-2"></i> Kelola Penugasan
        </router-link>
        <!-- end link -->
        <router-link
          v-if="!isemployer"
          to="/penugasan_belum_selesai"
          class="mb-3 capitalize font-medium text-sm hover:text-blue-600 transition ease-in-out duration-500"
        >
          <i class="fad fa-tasks text-xs mr-2 text-orange-400"></i> Penugasan
          Belum Selesai
        </router-link>
        <!-- end link -->
        <router-link
          v-if="!isemployer"
          to="/penugasan_selesai"
          class="mb-3 capitalize font-medium text-sm hover:text-blue-600 transition ease-in-out duration-500"
        >
          <i class="fad fa-tasks text-xs mr-2 text-green-400"></i> Penugasan
          Selesai
        </router-link>
        <!-- end link -->
        <router-link
          v-if="isemployer"
          to="/daftar_tugas"
          class="mb-3 capitalize font-medium text-sm hover:text-blue-600 transition ease-in-out duration-500"
        >
          <i class="fad fa-chart-pie text-xs mr-2"></i> Dashboard
        </router-link>
        <!-- end link -->
        <router-link
          v-if="isemployer"
          to="/daftar_tugas_saya"
          class="mb-3 capitalize font-medium text-sm hover:text-blue-600 transition ease-in-out duration-500"
        >
          <i class="fad fa-tasks text-xs mr-2"></i> Tugas Saya
        </router-link>
      </div>
    </div>
    <!-- end sidebar content -->
  </div>
  <!-- end sidbar -->
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      isloading: false,
      isemployer: false,
      selected: undefined,
    };
  },
  created() {
    this.cekUser();
  },
  methods: {
    cekUser() {
      if (this.$auth.isAdminAuthenticated()) {
        this.isemployer = false;
      } else if (this.$auth.isPegawaiAuthenticated()) {
        this.isemployer = true;
      }
    },
  },
};
</script>

<style>
.spacer {
  height: 40px;
}
.active {
  color: blanchedalmond;
}
</style>