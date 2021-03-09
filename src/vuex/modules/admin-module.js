import {
  getPegawai,
  getPenugasan,
  getDetailTugas,
  getDataPenugasanByDate,
  getNamaPegawai,
  getDataPenugasanAdmByStatusLimit,
} from "../../services/Get";

const state = {
  tugasHariIni: [],
  tugasBesok: [],
  nPegawai: 0,
  nTasks: 0,
  nTasksPending: 0,
  nTasksEnd: 0,
  tugasLimitSelesai: [],
  tugasLimitOnGoing: [],
  nTugasBesok: 0,
  nTugasSkrg: 0,
  nTugasLimitSelesai: 0,
  nTugasLimitOnGoing: 0,
};

const getters = {
  daftarTgsTodayAdm: (state) => state.tugasHariIni,
  daftarTgsBsokAdm: (state) => state.tugasBesok,
  jumlahPegawai: (state) => state.nPegawai,
  jumlahTugas: (state) => state.nTasks,
  jumlahPendingTugas: (state) => state.nTasksPending,
  jumlahTugasSelesai: (state) => state.nTasksEnd,
  daftarTgsSelesaiLimit: (state) => state.tugasLimitSelesai,
  daftarTgsOngoingLimit: (state) => state.tugasLimitOnGoing,
  nTaskBesok: (state) => state.nTugasBesok,
  nTaskSkrg: (state) => state.nTugasSkrg,
  nTaskLimitSelesai: (state) => state.nTugasLimitSelesai,
  nTaskLimitOnGoing: (state) => state.nTugasLimitOnGoing,
};

const actions = {
  async getTaskTodayAdmin({ commit }) {
    let today = new Date().toISOString().slice(0, 10);
    today = new Date(today);
    this.state.tugasHariIni = [];
    getDataPenugasanByDate(today).then((value) => {
      commit("setNTaskSkrg", value.size);
      value.forEach((doc) => {
        getNamaPegawai(doc.data().peg_id).then((value2) => {
          this.state.tugasHariIni.push({
            id: doc.id,
            lokasi_nama: doc.data().lokasi_nama,
            nama: value2.data().nama,
            peg_id: doc.data().peg_id,
            tgl_tugas: doc.data().tgl_tugas,
            selesai: doc.data().selesai,
          });
        });
      });
    });
    commit("taskToday", this.state.tugasHariIni);
  },

  async getTaskTomorrowAdmin({ commit }) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let tomorrow2 = new Date(tomorrow).toISOString().slice(0, 10);
    tomorrow2 = new Date(tomorrow2);
    this.state.tugasBesok = [];
    getDataPenugasanByDate(tomorrow2).then((value) => {
      commit("setNTaskBesok", value.size);
      value.forEach((doc) => {
        getNamaPegawai(doc.data().peg_id).then((value2) => {
          this.state.tugasBesok.push({
            id: doc.id,
            lokasi_nama: doc.data().lokasi_nama,
            nama: value2.data().nama,
            peg_id: doc.data().peg_id,
            tgl_tugas: doc.data().tgl_tugas,
            selesai: doc.data().selesai,
          });
        });
      });
    });
    commit("taskBesok", this.state.tugasBesok);
  },

  async countNPegawai({ commit }) {
    getPegawai().then((value) => {
      commit("setNPegawai", value.size);
    });
  },

  async countTugas({ commit }) {
    getPenugasan().then((value) => {
      commit("setNTask", value.size);
    });
  },

  async countPendingTugas({ commit }) {
    getDetailTugas("ongoing").then((value) => {
      commit("setNTaskPending", value.size);
    });
  },

  async countTugasSelesai({ commit }) {
    getDetailTugas("yes").then((value) => {
      commit("setNTaskSelesai", value.size);
    });
  },

  async limitTgsSelesaiStatus({ commit }) {
    this.state.tugasLimitSelesai = [];
    getDataPenugasanAdmByStatusLimit("yes").then((value) => {
      commit("setNTaskLimitSelesai", value.size);
      value.forEach((doc) => {
        getNamaPegawai(doc.data().peg_id).then((value2) => {
          this.state.tugasLimitSelesai.push({
            id: doc.id,
            lokasi_nama: doc.data().lokasi_nama,
            nama: value2.data().nama,
            peg_id: doc.data().peg_id,
            tgl_tugas: doc.data().tgl_tugas,
            selesai: doc.data().selesai,
          });
        });
      });
      commit(
        "setLimitTugasSelesai",
        this.state.tugasLimitSelesai
      );
    });
  },

  async limitTgsOnGoingStatus({ commit }) {
    this.state.tugasLimitOnGoing = [];
    getDataPenugasanAdmByStatusLimit("ongoing").then((value) => {
      console.log(value)
      commit("setNTaskLimitOnGoing", value.size);
      value.forEach((doc) => {
        getNamaPegawai(doc.data().peg_id).then((value2) => {
          this.state.tugasLimitOnGoing.push({
            id: doc.id,
            lokasi_nama: doc.data().lokasi_nama,
            nama: value2.data().nama,
            peg_id: doc.data().peg_id,
            tgl_tugas: doc.data().tgl_tugas,
            selesai: doc.data().selesai,
          });
        });
      });
      commit(
        "setLimitTugasOngoing",
        this.state.tugasLimitOnGoing
      );
    });
  },
};

const mutations = {
  taskToday: (state, tasks) => (state.tugasHariIni = tasks),
  taskBesok: (state, tasks) => (state.tugasBesok = tasks),
  setNPegawai: (state, nPegawai) => (state.nPegawai = nPegawai),
  setNTask: (state, nTasks) => (state.nTasks = nTasks),
  setNTaskPending: (state, nTasksPending) =>
    (state.nTasksPending = nTasksPending),
  setNTaskSelesai: (state, nTasksEnd) => (state.nTasksEnd = nTasksEnd),
  setLimitTugasSelesai: (state, limitTgsSelesai) =>
    (state.tugasLimitSelesai = limitTgsSelesai),
  setLimitTugasOngoing: (state, limitTgsOnGoing) =>
    (state.tugasLimitOnGoing = limitTgsOnGoing),
  setNTaskBesok: (state, nTugasBesok) => (state.nTugasBesok = nTugasBesok),
  setNTaskSkrg: (state, nTugasSkrg) => (state.nTugasSkrg = nTugasSkrg),
  setNTaskLimitSelesai: (state, nTugasLimitSelesai) =>
    (state.nTugasLimitSelesai = nTugasLimitSelesai),
  setNTaskLimitOnGoing: (state, nTugasLimitOnGoing) =>
    (state.nTugasLimitOnGoing = nTugasLimitOnGoing),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
