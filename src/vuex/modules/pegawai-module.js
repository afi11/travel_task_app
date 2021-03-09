import { db, auth } from "../../config/firebase";
import Swal from "sweetalert2";

const state = {
  pegawai2: [],
  loadingPeg: false,
};

const getters = {
  daftarPegawai: (state) => state.pegawai2,
  loadingPeg: (state) => state.loadingPeg,
};

const actions = {
  async setLoadingPeg({ commit }, state) {
    commit("setLoadingPeg", state);
  },

  async fetchPegawai({ commit }) {
    this.state.pegawai2 = [];
    db.collection("pegawai").onSnapshot((response) => {
      response.forEach((doc) => {
        this.state.pegawai2.push({
          id: doc.id,
          nama: doc.data().nama,
          email: doc.data().email,
          telepon: doc.data().telepon,
          alamat: doc.data().alamat,
        });
      });
    });
    commit("setPegawai", this.state.pegawai2);
  },

  async tambahPegawai(context, pegawai) {
    auth
      .createUserWithEmailAndPassword(pegawai.email, pegawai.password)
      .then((res) => {
        pegawai.uid = res.user.uid;
        db.collection("pegawai")
          .doc(res.user.uid)
          .set(pegawai)
          .then(() => {
            context.dispatch("setLoadingPeg", false);
            Swal.fire({
              title: "Sukses!",
              text: "Berhasil menyimpan data pegawai",
              icon: "success",
              confirmButtonText: "Ok",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  },

  async deletePegawai(context, pegawai) {
    Swal.fire({
      title: "Apakah anda mau menghapus data pegawai ini?",
      showDenyButton: true,
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        db.collection("pegawai")
          .doc(pegawai.id)
          .delete()
          .then(() => {
            context.dispatch("fetchPegawai");
          });
      } else if (result.isDenied) {
        Swal.fire("Data pegawai tidak dihapus", "", "info");
      }
    });
  },

  async updatePegawai(context, pegawai) {
    db.collection("pegawai")
      .doc(pegawai.uid)
      .update(pegawai)
      .then(() => {
        context.dispatch("setLoadingPeg", false);
        Swal.fire({
          title: "Sukses!",
          text: "Berhasil mengubah data pegawai",
          icon: "success",
          confirmButtonText: "Ok",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  },
};

const mutations = {
  setPegawai: (state, pegawai2) => (state.pegawai2 = pegawai2),
  setLoadingPeg: (state, loadingPeg) => (state.loadingPeg = loadingPeg),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
