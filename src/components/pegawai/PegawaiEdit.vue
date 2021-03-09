<template>
  <div>
    <div class="flex flex-col justify-center items-center">
      <div class="w-3/5 md:w-full mb-4 mt-4">
        <h1 class="text-sm font-semibold text-gray-600 mb-2">
          <router-link to="/">Dashboard &nbsp;</router-link>
          <i class="fas fa-caret-right"></i>
          <router-link to="/pegawai"> Pegawai &nbsp;</router-link>
          <i class="fas fa-caret-right"></i>
          <span class="text-gray-500"> Edit Pegawai</span>
        </h1>
        <hr />
      </div>
    </div>
    <div class="flex flex-col justify-center items-center">
      <div class="card w-3/5 md:w-full">
        <div class="card-body flex flex-col">
          <div class="flex flex-col justify-center items-center">
            <div
              class="bg-blue-200 w-full py-3 px-2 rounded-r-lg text-white border-l-8 border-blue-500"
            >
              <span class="text-sm text-blue-800"
                >Data pegawai digunakan untuk mendata semua pegawai pada
                instansi.</span
              >
            </div>
            <form class="w-full" @submit.prevent="onUpdateForm">
              <div class="flex flex-col mt-4">
                <label class="mb-1 font-semibold text-gray-700"
                  >Nama Pegawai</label
                >
                <Input :text="true" v-model="pegawai.nama" />
              </div>
              <div class="flex flex-col mt-4">
                <label class="mb-1 font-semibold text-gray-700">Email</label>
                <Input :email="true" v-model="pegawai.email" />
              </div>
              <div class="flex flex-col mt-4">
                <label class="mb-1 font-semibold text-gray-700">Telepon</label>
                <Input :text="true" v-model="pegawai.telepon" />
              </div>
              <div class="flex flex-col mt-4">
                <label class="mb-1 font-semibold text-gray-700">Alamat</label>
                <textarea
                  v-model="pegawai.alamat"
                  class="border rounded-lg border-gray-400 text-gray-800 p-2"
                ></textarea>
              </div>
              <ButtonLoading v-if="loadingPeg" title="Memperbaruhi data...." />
              <Button v-else title="Simpan" />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { db } from "../../config/firebase";
import { mapActions, mapGetters } from "vuex";
import { Input, Button, ButtonLoading } from "../componentList";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      pegawai: {},
    };
  },
  components: {
    Input,
    Button,
    ButtonLoading,
  },
  created() {
    this.getPegawai();
    document.title = "Halaman Edit Pegawai"
  },
  methods: {
    ...mapActions(["updatePegawai", "setLoadingPeg"]),
    onUpdateForm(event) {
      this.setLoadingPeg(true);
      event.preventDefault();
      const { nama, email, telepon, alamat } = this.pegawai;
      if (nama != "" && email != "" && telepon != "" && alamat != "") {
        this.updatePegawai({
          uid: this.pegawai.uid,
          nama: this.pegawai.nama,
          email: this.pegawai.email,
          telepon: this.pegawai.telepon,
          alamat: this.pegawai.alamat,
        });
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
    getPegawai() {
      let dbRef = db.collection("pegawai").doc(this.$route.query.id);
      dbRef
        .get()
        .then((doc) => {
          this.pegawai = doc.data();
          console.log(this.pegawai);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: mapGetters(["loadingPeg"]),
};
</script>












