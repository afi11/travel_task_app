<template>
  <div className="relative h-screen">
    <div
      class="absolute inset-0 flex justify-center items-center bg-gray-100 flex-1"
    >
      <div class="card w-1/4 md:w-full border-0 shadow-md">
        <div class="card-body">
          <div class="flex justify-center">
            <h3 class="text-xl font-bold text-gray-800 mb-2">Login</h3>
          </div>
          <div
            class="bg-blue-200 w-full py-3 px-2 rounded-r-lg text-white border-l-8 border-blue-500"
          >
            <span class="text-sm text-blue-800"
              >Login dengan email dan password yang telah terdaftarkan.</span
            >
          </div>
          <div class="flex flex-col mt-4 mb-3">
            <label class="mb-1 font-semibold text-gray-700">Email</label>
            <Input email v-model="email" />
          </div>
          <div class="flex flex-col mb-2">
            <label class="text-gray-700 text-sm font-bold mb-2">Password</label>
            <Input password v-model="password" />
          </div>
          <ButtonLoading v-if="loading" title="Waiting...." />
          <Button
            v-else-if="!loading"
            title="Login"
            @login-user="loginUser()"
          />
        </div>
        <div class="flex justify-center py-2 border-t border-gray-500">
          <h5 class="text-gray-500">&copy;2021</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "../../config/firebase";
import { admin_key, pegawai_key } from "../../utils/keyUser";
import { Input, Button, ButtonLoading } from "../componentList";
import Swal from "sweetalert2";

export default {
  components: { Input, Button, ButtonLoading },
  data() {
    return {
      loading: false,
      email: "",
      password: "",
      error: null,
    };
  },
  created() {
    document.title = "Halaman Login";
  },
  methods: {
    loginUser() {
      this.loading = true;
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then((res) => {
          let dbRef = db.collection("pegawai").doc(res.user.uid);
          dbRef
            .get()
            .then((doc) => {
              if (doc.data()) {
                this.$auth.setTokenUser(res.user.uid, pegawai_key);
                this.loading = false;
                this.$router.push("/daftar_tugas")
              } else {
                db.collection("users")
                  .doc(res.user.uid)
                  .get()
                  .then(() => {
                    this.$auth.setTokenUser(res.user.uid, admin_key);
                    this.loading = false;
                    this.$router.push("/")
                  });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((err) => {
          this.error = err;
          this.loading = false;
          Swal.fire("Gagal Login", "Periksa Email dan Password Anda", "error");
        });
    },
  },
};
</script>