import { db } from "../../config/firebase";

const state = {
  tugasHariIni: [],
  tugasBesok: [],
  tugasSelesai: [],
};

const getters = {
  daftarTgsToday: (state) => state.tugasHariIni,
  daftarTgsBsokPeg: (state) => state.tugasBesok,
  daftarTgsSelesai: (state) => state.tugasSelesai,
};

const actions = {
  async getTaskToday({ commit }, userid) {
    let today = new Date().toISOString().slice(0, 10);
    today = new Date(today);
    this.state.tugasHariIni = [];
    db.collection("penugasan")
      .where("peg_id", "==", userid)
      .where("selesai", "==", "no")
      .where("tgl_tugas", "==", today)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.state.tugasHariIni.push({
            id: doc.id,
            lokasi_nama: doc.data().lokasi_nama,
            file_url: doc.data().file_url,
            peg_id: doc.data().peg_id,
            tgl_tugas: doc.data().tgl_tugas,
            selesai: doc.data().selesai,
          });
        });
      });
    commit("taskToday", this.state.tugasHariIni);
  },

  async getTaskSelesai({ commit }, userid) {
    this.state.tugasSelesai = [];
    db.collection("penugasan")
      .where("peg_id", "==", userid)
      .where("selesai", "==", "yes")
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          this.state.tugasSelesai.push({
            id: doc.id,
            lokasi_nama: doc.data().lokasi_nama,
            file_url: doc.data().file_url,
            peg_id: doc.data().peg_id,
            tgl_tugas: doc.data().tgl_tugas,
            selesai: doc.data().selesai,
          });
        });
      });
    commit("taskSelesai", this.state.tugasSelesai);
  },
};

const mutations = {
  taskToday: (state, tasks) => (state.tugasHariIni = tasks),
  taskBesok: (state, tasks) => (state.tugasBesok = tasks),
  taskSelesai: (state, tasks) => (state.tugasSelesai = tasks),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
