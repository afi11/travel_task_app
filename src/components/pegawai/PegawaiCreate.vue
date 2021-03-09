<template>
  <div>
    <div class="flex flex-col justify-center items-center">
      <div class="w-3/5 md:w-full mb-4 mt-4">
        <h1 class="text-sm font-semibold text-gray-600 mb-2">
          <router-link to="/">Dashboard &nbsp;</router-link>
          <i class="fas fa-caret-right"></i>
          <router-link to="/pegawai"> Pegawai &nbsp;</router-link>
          <i class="fas fa-caret-right"></i>
          <span class="text-gray-500"> Tambah Pegawai</span>
        </h1>
        <hr />
      </div>
    </div>
    <div class="flex flex-col justify-center items-center">
      <div class="card border-0 shadow w-3/5 md:w-full">
        <div class="card-body flex flex-col">
          <div class="flex flex-col justify-center items-center p-2">
            <div
              class="bg-blue-200 w-full py-3 px-2 rounded-r-lg text-white border-l-8 border-blue-500"
            >
              <span class="text-sm text-blue-800"
                >Data pegawai digunakan untuk mendata semua pegawai pada
                instansi.</span
              >
            </div>
            <form class="w-full" @submit.prevent="onFormSubmit">
              <div class="flex flex-col mt-4">
                <label class="mb-1 font-semibold text-gray-700"
                  >Nama Pegawai</label
                >
                <input
                  type="text"
                  class="border rounded-lg border-gray-400 text-gray-800 p-2 mr-2"
                  v-model="pegawai.nama"
                />
              </div>
              <div class="flex flex-col mt-4">
                <label class="mb-1 font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  class="border rounded-lg border-gray-400 text-gray-800 p-2 mr-2"
                  v-model="pegawai.email"
                />
              </div>
              <div class="flex flex-col mt-4">
                <label class="mb-1 font-semibold text-gray-700">Telepon</label>
                <input
                  type="text"
                  class="border rounded-lg border-gray-400 text-gray-800 p-2 mr-2"
                  v-model="pegawai.telepon"
                />
              </div>
              <div class="flex flex-col mt-4">
                <label class="mb-1 font-semibold text-gray-700">Alamat</label>
                <textarea
                  v-model="pegawai.alamat"
                  class="border rounded-lg border-gray-400 text-gray-800 p-2"
                ></textarea>
              </div>
              <div class="flex flex-col mt-4 mb-3">
                <label class="mb-1 font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  class="border rounded-lg border-gray-400 text-gray-800 p-2 mr-2"
                  v-model="pegawai.password"
                />
              </div>
              <ButtonLoading v-if="loadingPeg" title="Menyimpan data...." />
              <Button v-else title="Simpan" />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { Button, ButtonLoading } from "../componentList";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      pegawai: {
        nama: "",
        email: "",
        telepon: "",
        alamat: "",
        password: "",
        uid: "",
      },
    };
  },
  components: {
    Button,
    ButtonLoading,
  },
  created() {
    document.title = "Tambah Pegawai";
  },
  methods: {
    ...mapActions(["tambahPegawai", "setLoadingPeg"]),
    onFormSubmit(event) {
      this.setLoadingPeg(true);
      event.preventDefault();
      const { nama, email, telepon, alamat, password } = this.pegawai;
      if (
        nama !== "" ||
        email !== "" ||
        telepon !== "" ||
        alamat !== "" ||
        password !== ""
      ) {
        this.tambahPegawai({
          nama: this.pegawai.nama,
          email: this.pegawai.email,
          telepon: this.pegawai.telepon,
          alamat: this.pegawai.alamat,
          password: this.pegawai.password,
        });
        this.pegawai.nama = "";
        this.pegawai.email = "";
        this.pegawai.telepon = "";
        this.pegawai.alamat = "";
        this.pegawai.password = "";
      } else {
        Swal.fire({
          title: "Error!",
          text: "Terdapat field yang masih kosong",
          icon: "error",
          confirmButtonText: "Ok",
        });
        this.setLoadingPeg(false);
      }
    },
  },
  computed: mapGetters(["loadingPeg"]),
};
</script>

<style>
textarea {
  resize: none;
}
</style>









