import Vue from "vue";
import Vuex from "vuex";
import PegawaiModule from "../modules/pegawai-module";
import PenugasanModule from "../modules/penugasan-module";
import TugasPegawaiModule from "../modules/tugas-pegawai-module";
import AdminModule from "../modules/admin-module";
import PegawaiUserModule from "../modules/pegawai-user-module";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    PegawaiModule,
    PenugasanModule,
    TugasPegawaiModule,
    AdminModule,
    PegawaiUserModule,
  },
});
