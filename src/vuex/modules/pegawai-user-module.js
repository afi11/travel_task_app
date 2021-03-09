import {
  getPegawai,
  getPenugasanPeg,
  getDetailTugasPeg,
  getDataPenugasanByDatePeg,
  getNamaPegawai,
  getDataPenugasanPegByStatusLimit,
} from "../../services/Get";

const state = {
  task2: [],
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
  daftarTgsTodayPeg: (state) => state.tugasHariIni,
  listTugasPegBsok: (state) => state.tugasBesok,
  jumlahTugasPeg: (state) => state.nTasks,
  jumlahPendingTugasPeg: (state) => state.nTasksPending,
  jumlahTugasSelesaiPeg: (state) => state.nTasksEnd,
  daftarTgsSelesaiLimitPeg: (state) => state.tugasLimitSelesai,
  daftarTgsOngoingLimitPeg: (state) => state.tugasLimitOnGoing,
  nTaskBesokPeg: (state) => state.nTugasBesok,
  nTaskSkrgPeg: (state) => state.nTugasSkrg,
  nTaskLimitSelesaiPeg: (state) => state.nTugasLimitSelesai,
  nTaskLimitOnGoingPeg: (state) => state.nTugasLimitOnGoing,
  listTask2: (state) => state.task2,
};

const actions = {
  async getTaskAllPeg({ commit }, userid) {
    this.state.task2 = [];
    getPenugasanPeg(userid).then((value) => {
      value.forEach((doc) => {
        const tgl = doc
          .data()
          .tgl_tugas.toDate()
          .toDateString();
        this.state.task2.push({
          id: doc.id,
          tgl_tugas: tgl,
          lokasi_nama: doc.data().lokasi_nama,
          kendaraan: doc.data().kendaraan,
          selesai: doc.data().selesai,
        });
      });
    });
    commit("setTask2", this.state.task2);
  },

  async getTaskTodayPeg({ commit }, data) {
    this.state.tugasHariIni = [];
    getDataPenugasanByDatePeg(data).then((value) => {
      commit("setNTaskSkrgPeg", value.size);
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

  async getTaskTomorrowPeg({ commit }, data) {
    this.state.tugasBesok = [];
    getDataPenugasanByDatePeg(data).then((value) => {
      commit("setNTaskBesokPeg", value.size);
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
    commit("taskBesokPeg", this.state.tugasBesok);
  },

  async countNPegawai({ commit }) {
    getPegawai().then((value) => {
      commit("setNPegawai", value.size);
    });
  },

  async countTugasPeg({ commit }, userid) {
    getPenugasanPeg(userid).then((value) => {
      commit("setNTask", value.size);
    });
  },

  async countPendingTugasPeg({ commit }, data) {
    getDetailTugasPeg(data).then((value) => {
      commit("setNTaskPending", value.size);
    });
  },

  async countTugasSelesaiPeg({ commit }, data) {
    getDetailTugasPeg(data).then((value) => {
      commit("setNTaskSelesai", value.size);
    });
  },

  async limitTgsSelesaiStatusPeg({ commit }, data) {
    this.state.tugasLimitSelesai = [];
    getDataPenugasanPegByStatusLimit(data).then((value) => {
      console.log(value);
      commit("setNTaskLimitSelesaiPeg", value.size);
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
      commit("setLimitTugasSelesaiPeg", this.state.tugasLimitSelesai);
    });
  },

  async limitTgsOnGoingStatusPeg({ commit }, data) {
    this.state.tugasLimitOnGoing = [];
    getDataPenugasanPegByStatusLimit(data).then((value) => {
      commit("setNTaskLimitOnGoingPeg", value.size);
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
      commit("setLimitTugasOngoingPeg", this.state.tugasLimitOnGoing);
    });
  },
};

const mutations = {
  taskToday: (state, tasks) => (state.tugasHariIni = tasks),
  taskBesokPeg: (state, tasks) => (state.tugasBesok = tasks),
  setNPegawai: (state, nPegawai) => (state.nPegawai = nPegawai),
  setNTask: (state, nTasks) => (state.nTasks = nTasks),
  setNTaskPending: (state, nTasksPending) =>
    (state.nTasksPending = nTasksPending),
  setNTaskSelesai: (state, nTasksEnd) => (state.nTasksEnd = nTasksEnd),
  setLimitTugasSelesaiPeg: (state, limitTgsSelesai) =>
    (state.tugasLimitSelesai = limitTgsSelesai),
  setLimitTugasOngoingPeg: (state, limitTgsOnGoing) =>
    (state.tugasLimitOnGoing = limitTgsOnGoing),
  setNTaskBesokPeg: (state, nTugasBesok) => (state.nTugasBesok = nTugasBesok),
  setNTaskSkrgPeg: (state, nTugasSkrg) => (state.nTugasSkrg = nTugasSkrg),
  setNTaskLimitSelesaiPeg: (state, nTugasLimitSelesai) =>
    (state.nTugasLimitSelesai = nTugasLimitSelesai),
  setNTaskLimitOnGoingPeg: (state, nTugasLimitOnGoing) =>
    (state.nTugasLimitOnGoing = nTugasLimitOnGoing),
  setTask2: (state, tasks2) => (state.task2 = tasks2),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
