<template>
  <!-- start navbar -->
  <div
    class="md:fixed shadow-md fixed w-full top-0 z-20 md:w-full md:top-0 md:z-20 flex flex-row flex-wrap items-center bg-blue-400 p-6 border-b border-gray-300"
  >
    <!-- logo -->
    <div class="flex-none w-56 flex flex-row items-center">
      <strong class="capitalize ml-1 flex-1">Penugasan Pegawai</strong>

      <button
        id="sliderBtn"
        @click="toogleNavbar()"
        class="flex-none text-right text-gray-900 hidden md:block"
      >
        <i class="fad fa-list-ul"></i>
      </button>
    </div>
    <!-- end logo -->

    <!-- navbar content -->
    <div
      id="navbar"
      class="animated flex-1 pl-3 flex flex-row flex-wrap justify-end"
    >
      <!-- right -->
      <div class="flex flex-row-reverse text-right items-center">
        <!-- user -->
        <button
          @click="logout()"
          class="menu-btn focus:outline-none focus:shadow-outline flex flex-wrap items-center"
        >
          <div class="ml-2 capitalize flex">
            <h1
              class="text-sm text-gray-800 font-semibold m-0 p-0 leading-none"
            >
              Logout <i class="fas fa-power-off"></i>
            </h1>
          </div>
        </button>
        <button
          class="menu-btn focus:outline-none mr-5 focus:shadow-outline flex flex-wrap items-center"
        >
          <div class="ml-2 capitalize flex">
            <h1
              class="text-sm text-gray-800 font-semibold m-0 p-0 leading-none"
            >
              {{ username }}
            </h1>
          </div>
        </button>
      </div>
      <!-- end right -->
    </div>
    <!-- end navbar content -->
  </div>
  <!-- end navbar -->
</template>

<script>
import { cekEmployer, cekAdmin } from "../../config/checkUser";
import { admin_key, pegawai_key } from "../../utils/keyUser";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      username: "",
    };
  },
  name: "Navbar",
  methods: {
    toogleNavbar() {
      console.log("ok");
      // work with sidebar
      var btn = document.getElementById("sliderBtn"),
        sideBar = document.getElementById("sideBar"),
        sideBarHideBtn = document.getElementById("sideBarHideBtn");
      // show sidebar
      btn.addEventListener("click", function () {
        if (sideBar.classList.contains("md:-ml-64")) {
          sideBar.classList.replace("md:-ml-64", "md:ml-0");
          sideBar.classList.remove("md:slideOutLeft");
          sideBar.classList.add("md:slideInLeft");
        }
      });

      // hide sideBar
      sideBarHideBtn.addEventListener("click", function () {
        if (sideBar.classList.contains("md:ml-0", "slideInLeft")) {
          var _class = function () {
            sideBar.classList.remove("md:slideInLeft");
            sideBar.classList.add("md:slideOutLeft");
          };
          var animate = async function () {
            await _class();
            setTimeout(function () {
              sideBar.classList.replace("md:ml-0", "md:-ml-64");
              console.log("animated");
            }, 300);
          };
          _class();
          animate();
        }
      });
      // end with sidebar
    },
    getUserName() {
      if (this.$auth.getUserKey() === admin_key) {
        cekAdmin(this.$auth.getUserId()).then((value) => {
          value.forEach((doc) => {
            this.username = doc.data().name;
          });
        });
      } else if (this.$auth.getUserKey() === pegawai_key) {
        cekEmployer(this.$auth.getUserId()).then((value) => {
          value.forEach((doc) => {
            this.username = doc.data().nama;
          });
        });
      } else {
        this.$router.push("/login");
      }
    },
    logout() {
      Swal.fire({
        title: "Apakah akan keluar aplikasi?",
        showDenyButton: true,
        confirmButtonText: `Yes`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.$auth.destroyToken();
          this.$router.push("/login");
        }
      });
    },
  },
  created() {
    this.getUserName();
  },
};
</script>