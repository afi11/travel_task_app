import { db } from "../config/firebase";

export const cekEmployer = (userid) => {
  const promise = new Promise((resolve, reject) => {
    db.collection("pegawai")
      .where("uid", "==", userid)
      .get()
      .then((res) => {
        resolve(res)
      },(err) => {
          reject(err)
      });
  });
  return promise
};

export const cekAdmin = (userid) => {
  const promise = new Promise((resolve, reject) => {
    db.collection("users")
      .where("uid", "==", userid)
      .get()
      .then((res) => {
        resolve(res)
      },(err) => {
          reject(err)
      });
  });
  return promise
};
