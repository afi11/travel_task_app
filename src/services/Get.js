import { db } from "../config/firebase";

export const getPegawai = () => {
  return new Promise((resolve) => {
    db.collection("pegawai").onSnapshot((snapshot) => {
      resolve(snapshot);
    });
  });
};

export const getPenugasanStatusAdm = (status) => {
  return new Promise((resolve) => {
    db.collection("penugasan")
      .where("selesai", "==", status)
      .onSnapshot((snapshot) => {
        resolve(snapshot);
      });
  });
};

export const getDataPenugasanAdmByStatusLimit = (status) => {
  return new Promise((resolve) => {
    db.collection("penugasan")
      .where("selesai", "==", status)
      .limit(6)
      .onSnapshot((snapshot) => {
        resolve(snapshot);
      });
  });
};

export const getDataPenugasanByDate = (tgl) => {
  return new Promise((resolve) => {
    db.collection("penugasan")
      .where("tgl_tugas", "==", tgl)
      .onSnapshot((snapshot) => {
        resolve(snapshot);
      });
  });
};

export const getNamaPegawai = (peg_id) => {
  return new Promise((resolve) => {
    let dbRef = db.collection("pegawai").doc(peg_id);
    dbRef.get().then((doc) => {
      resolve(doc);
    });
  });
};

export const getPenugasan = () => {
  return new Promise((resolve) => {
    db.collection("penugasan").onSnapshot((snapshot) => {
      resolve(snapshot);
    });
  });
};

export const getDetailTugas = (status) => {
  return new Promise((resolve) => {
    db.collection("penugasan")
      .where("selesai", "==", status)
      .onSnapshot((snapshot) => {
        resolve(snapshot);
      });
  });
};

// Pegawai
export const getPenugasanPeg = (userid) => {
  return new Promise((resolve) => {
    db.collection("penugasan")
      .where("peg_id", "==", userid)
      .onSnapshot((snapshot) => {
        resolve(snapshot);
      });
  });
};

export const getDetailTugasPeg = (data) => {
  return new Promise((resolve) => {
    db.collection("penugasan")
      .where("peg_id", "==", data.userid)
      .where("selesai", "==", data.status)
      .onSnapshot((snapshot) => {
        resolve(snapshot);
      });
  });
};

export const getDataPenugasanByDatePeg = (data) => {
  return new Promise((resolve) => {
    db.collection("penugasan")
      .where("peg_id", "==", data.userid)
      .where("tgl_tugas", "==", data.tgl)
      .onSnapshot((snapshot) => {
        resolve(snapshot);
      });
  });
};

export const getDataPenugasanPegByStatusLimit = (data) => {
  return new Promise((resolve) => {
    db.collection("penugasan")
      .where("peg_id", "==", data.userid)
      .where("selesai", "==", data.status)
      .limit(6)
      .onSnapshot((snapshot) => {
        resolve(snapshot);
      });
  });
};
