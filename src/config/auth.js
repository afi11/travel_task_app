import { db } from "../config/firebase";
import { admin_key, pegawai_key } from "../utils";

export default function(Vue) {
  let authenticatedUser = {};

  Vue.auth = {
    setTokenUser(userId, keyUser) {
      localStorage.setItem("userid", userId);
      localStorage.setItem("keyuser", keyUser);
    },

    getUserId() {
      var userid = localStorage.getItem("userid");
      if (!userid) return null;
      else return userid;
    },

    getUserKey() {
      var keyuser = localStorage.getItem("keyuser");
      if (!keyuser) return null;
      else return keyuser;
    },

    isEmployer() {
      const userid = this.getUserId();
      const querySnapshot = db
        .collection("pegawai")
        .where("uid", "==", userid)
        .get();
      const uids = querySnapshot.docs.map((doc) => {
        return doc.data().uid;
      });
      return uids;
    },

    destroyToken() {
      localStorage.removeItem("userid");
      localStorage.removeItem("keyuser");
    },

    isAdminAuthenticated() {
      if (this.getUserKey() == admin_key && this.getUserId()) return true;
      else return false;
    },

    isPegawaiAuthenticated() {
      if (this.getUserKey() == pegawai_key && this.getUserId()) return true;
      else return false;
    },

    setAuthenticatedUser(data) {
      authenticatedUser = data;
    },

    getAuthenticatedUser() {
      return authenticatedUser;
    },
  };

  Object.defineProperties(Vue.prototype, {
    $auth: {
      get() {
        return Vue.auth;
      },
    },
  });
}
