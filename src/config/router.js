import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("../components/auth/Login"),
    meta: {
      forVisitors: true,
    },
  },
  {
    path: "",
    component: () => import("../LoggedInLayout"),
    children: [
      {
        path: "/",
        name: "dashboard",
        component: () => import("../components/dashboard/Dashboard"),
        meta: {
          forAdmin: true,
        },
      },
      {
        path: "/tambah_pegawai",
        name: "pegawaiCreate",
        component: () => import("../components/pegawai/PegawaiCreate"),
        meta: {
          forAdmin: true,
        },
      },
      {
        path: "/pegawai",
        name: "pegawaiList",
        component: () => import("../components/pegawai/PegawaiList"),
        meta: {
          forAdmin: true,
        },
      },
      {
        path: "/edit_pegawai",
        name: "pegawaiEdit",
        component: () => import("../components/pegawai/PegawaiEdit"),
        meta: {
          forAdmin: true,
        },
      },
      {
        path: "/penugasan",
        name: "penugasanList",
        component: () => import("../components/penugasan/PenugasanList"),
        meta: {
          forAdmin: true,
        },
      },
      {
        path: "/penugasan_selesai",
        name: "penugasanListSelesai",
        component: () => import("../components/penugasan/PenugasanSelesai"),
        meta: {
          forAdmin: true,
        },
      },
      {
        path: "/penugasan_belum_selesai",
        name: "penugasanListOnGoing",
        component: () => import("../components/penugasan/PenugasanOnGoing"),
        meta: {
          forAdmin: true,
        },
      },
      {
        path: "/tambah_penugasan",
        name: "penugasanCreate",
        component: () => import("../components/penugasan/PenugasanCreate"),
        meta: {
          forAdmin: true,
        },
      },
      {
        path: "/edit_penugasan",
        name: "penugasanEdit",
        component: () => import("../components/penugasan/PenugasanEdit"),
        meta: {
          forAdmin: true,
        },
      },
      {
        path: "/detail_penugasan",
        name: "penugasanDetail",
        component: () => import("../components/penugasan/PenugasanDetail"),
        meta: {
          forAdmin: true,
        },
      },
      {
        path: "/daftar_tugas",
        name: "daftarTugas",
        component: () => import("../components/daftartugas/DaftarTugas"),
        meta: {
          forEmployer: true,
        },
      },
      {
        path: "/daftar_tugas_saya",
        name: "listTugas",
        component: () => import("../components/daftartugas/ListTugas"),
        meta: {
          forEmployer: true,
        },
      },
      {
        path: "/kerjakan_tugas",
        name: "KerjakanTugas",
        component: () => import("../components/kerjakantugas/KerjakanTugas"),
        meta: {
          forEmployer: true,
        },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
