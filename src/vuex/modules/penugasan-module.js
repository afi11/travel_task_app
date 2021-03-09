import { db, storage } from "../../config/firebase";
import { getPenugasanStatusAdm, getNamaPegawai } from "../../services/Get";
import { makeRandomString } from "../../utils";
import Swal from "sweetalert2";

const state = {
  tugas2: [],
  loading: false,
};

const getters = {
  daftarTugas2: (state) => state.tugas2,
  loadingAct: (state) => state.loading,
};

const actions = {
  async setLoading({ commit }, loading) {
    commit("setLoading", loading);
  },

  async fetchTugas({ commit }) {
    this.state.tugas2 = [];
    db.collection("penugasan").onSnapshot((snapshotChange) => {
      snapshotChange.forEach((doc) => {
        let dbRef = db.collection("pegawai").doc(doc.data().peg_id);
        const tgl = doc.data().tgl_tugas.toDate().toDateString();
        console.log(tgl)
        dbRef.get().then((doc2) => {
          this.state.tugas2.push({
            id: doc.id,
            tgl_tugas: tgl,
            pegawai: doc2.data().nama,
            kendaraan: doc.data().kendaraan,
            lokasi_nama: doc.data().lokasi_nama,
            file_url: doc.data().file_url,
            file_name: doc.data().file_name,
            selesai: doc.data().selesai,
          });
        });
      });
    });
    commit("setTugas2", this.state.tugas2);
  },

  async fetchTugasSelesai({ commit }) {
    this.state.tugas2 = [];
    getPenugasanStatusAdm("yes").then((value) => {
      console.log(value);
      value.forEach((doc) => {
        const tgl = doc.data().tgl_tugas.toDate().toDateString();
        getNamaPegawai(doc.data().peg_id).then((value2) => {
          this.state.tugas2.push({
            id: doc.id,
            tgl_tugas: tgl,
            pegawai: value2.data().nama,
            kendaraan: doc.data().kendaraan,
            lokasi_nama: doc.data().lokasi_nama,
            file_url: doc.data().file_url,
            file_name: doc.data().file_name,
          });
        });
      });
    });
    commit("setTugas2", this.state.tugas2);
  },

  async fetchTugasOnGoing({ commit }) {
    this.state.tugas2 = [];
    getPenugasanStatusAdm("ongoing").then((value) => {
      console.log(value);
      value.forEach((doc) => {
        const tgl = doc.data().tgl_tugas.toDate().toDateString();
        getNamaPegawai(doc.data().peg_id).then((value2) => {
          this.state.tugas2.push({
            id: doc.id,
            tgl_tugas: tgl,
            pegawai: value2.data().nama,
            kendaraan: doc.data().kendaraan,
            lokasi_nama: doc.data().lokasi_nama,
            file_url: doc.data().file_url,
            file_name: doc.data().file_name,
          });
        });
      });
    });
    commit("setTugas2", this.state.tugas2);
  },

  async tambahPenugasan(context, tugas) {
    const fileTugas = tugas.file_tugas;
    const namaFileTugas = makeRandomString(32);
    tugas.item_tugas.file_name = namaFileTugas;
    const uploadTask = storage
      .ref(`file_tugas/${tugas.item_tugas.file_name}`)
      .put(fileTugas);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("file_tugas")
          .child(namaFileTugas)
          .getDownloadURL()
          .then((url) => {
            tugas.item_tugas.file_url = url;
            db.collection("penugasan")
              .add(tugas.item_tugas)
              .then(() => {
                Swal.fire({
                  title: "Sukses!",
                  text: "Berhasil menyimpan data penugasan",
                  icon: "success",
                  confirmButtonText: "Ok",
                });
                context.dispatch("setLoading", false);
              })
              .catch((err) => {
                console.log(err);
              });
          });
      }
    );
  },

  async updateFileTugas(context, tugas) {
    const fileTugas = tugas.file_tugas;
    storage
      .ref("file_tugas")
      .child(tugas.item.file_name)
      .delete()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    const namaFileTugas = makeRandomString(32);
    tugas.item.file_name = namaFileTugas;
    const uploadTask = storage
      .ref(`file_tugas/${namaFileTugas}`)
      .put(fileTugas);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("file_tugas")
          .child(namaFileTugas)
          .getDownloadURL()
          .then((url) => {
            tugas.item.file_url = url;
            db.collection("penugasan")
              .doc(tugas.doc)
              .update(tugas.item)
              .then(() => {
                Swal.fire({
                  title: "Sukses!",
                  text: "Berhasil mengubah data penugasan",
                  icon: "success",
                  confirmButtonText: "Ok",
                });
                context.dispatch("setLoading", false);
              });
          });
      }
    );
  },

  async updateDataTugas(context, tugas) {
    db.collection("penugasan")
      .doc(tugas.doc)
      .update(tugas.item)
      .then(() => {
        Swal.fire({
          title: "Sukses!",
          text: "Berhasil mengubah data penugasan",
          icon: "success",
          confirmButtonText: "Ok",
        });
        context.dispatch("setLoading", false);
      });
  },

  async deleteTugas(context, tugas) {
    Swal.fire({
      title: "Apakah anda mau menghapus data penugasan ini?",
      showDenyButton: true,
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        let dbRef = db.collection("penugasan").doc(tugas.id);
        dbRef.get().then((doc) => {
          storage
            .ref("file_tugas")
            .child(doc.data().file_name)
            .delete()
            .then(() => {
              dbRef
                .delete()
                .then(() => {
                  Swal.fire("Berhasil menghapus data!", "", "success");
                  context.dispatch("fetchTugas");
                })
                .catch((error) => {
                  console.log(error);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } else if (result.isDenied) {
        Swal.fire("Data penugasan tidak dihapus", "", "info");
      }
    });
  },
};

const mutations = {
  setTugas2: (state, tugas2) => (state.tugas2 = tugas2),
  tambahTugas: (state, tugas) => state.tugas2.unshift(tugas),
  ubahTugas() {
    console.log("Berhasil ubah data tugas");
  },
  setLoading: (state, loading) => (state.loading = loading),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
