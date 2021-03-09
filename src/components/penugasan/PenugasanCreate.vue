<template>
  <div class="flex flex-col justify-center items-center">
    <div class="w-3/5 md:w-full mb-4 mt-4">
      <h1 class="text-sm font-semibold text-gray-600 mb-2">
        <router-link to="/">Dashboard</router-link>&nbsp;
        <i class="fas fa-caret-right"></i>
        <router-link to="/penugasan"> Penugasan &nbsp;</router-link>
        <i class="fas fa-caret-right"></i>
        <span class="text-gray-500"> Tambah Penugasan</span>
      </h1>
      <hr />
    </div>
    <div class="card border-0 shadow w-3/5 md:w-full">
      <div class="card-body flex flex-col">
        <div class="flex flex-col justify-center items-center p-2">
          <div
            class="bg-blue-200 w-full py-3 px-2 rounded-r-lg text-white border-l-8 border-blue-500"
          >
            <span class="text-sm text-blue-800"
              >Data penugasan merupakan data perjalanan tugas pegawai.</span
            >
          </div>
          <form class="w-full" @submit.prevent="onFormSubmit">
            <div class="flex flex-col mt-4 mb-2">
              <label class="mb-1 font-semibold text-gray-700"
                >Pilih Pegawai Pegawai</label
              >
              <vue-select
                v-model="penugasan.peg_id"
                :options="pegawai"
                :reduce="(nama) => nama.code"
                label="nama"
              />
            </div>

            <div class="flex flex-col mt-4">
              <label class="mb-1 font-semibold text-gray-700"
                >Pilih Kendaraan</label
              >
              <vue-select v-model="penugasan.kendaraan" :options="kendaraan" />
            </div>

            <div class="flex justify-between md:flex-col">
              <div class="flex flex-col mt-4 mb-2 mr-4">
                <label class="mb-1 font-semibold text-gray-700"
                  >Tanggal Penugasan</label
                >
                <input
                  class="py-2 px-2 text-md border border-gray-400 text-gray-800 rounded-l"
                  type="date"
                  name="tanggal_penugasan"
                  v-model="penugasan.tgl_tugas"
                />
              </div>
              <div class="flex flex-col mt-4 mb-3">
                <label class="mb-1 font-semibold text-gray-700"
                  >Cari Lokasi</label
                >
                <div class="flex">
                  <input
                    type="text"
                    name="tempat_penugasan"
                    v-model="penugasan.lokasi_nama"
                    class="py-2 px-2 text-md border border-gray-400 text-gray-800 rounded-l"
                  />
                  <div
                    @click="cariLokasi"
                    class="btn-close w-8 flex items-center justify-center bg-blue-lighter border-t border-r border-b border-gray-400 rounded-r text-blue-dark"
                  >
                    <i class="fas fa-search"></i>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="displayMap" class="flex flex-row justify-between">
              <p>
                Titik lokasi belum dipilih, silahkan pilih dengan memilih tanda
                marker yang merupakan hasil pencarian atau titik lainnya. Titik
                lokasi, latitude =
                <span class="font-bold">{{ penugasan.latitude }}</span>
                ,longitude =
                <span class="font-bold">{{ penugasan.longitude }}</span>
              </p>
            </div>
            <span v-if="is_err_latlong" class="text-red-500"
              >Titik lokasi tempat penugasan belum dipilih.</span
            >
            <div v-if="displayMap" id="mapContainer" class="basemap"></div>
            <div v-else></div>
            <div class="flex flex-col mt-0 mb-5">
              <label class="mb-1 font-semibold text-gray-700"
                >File Surat Tugas (.pdf)</label
              >
              <p v-if="is_wrong_file">
                File surat tugas yang anda masukkan bukan file pdf
              </p>
              <p v-if="is_select_file">
                File surat tugas bernama {{ this.fileSelected.name }}, lakukan
                <span
                  class="font-bold text-red-700 btn-close"
                  @click="resetFile"
                  >reset</span
                >
                file apabila salah memasukkan file
              </p>
              <div class="flex items-center justify-center bg-grey-lighter">
                <label
                  class="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue hover:text-white"
                >
                  <svg
                    class="w-8 h-8"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"
                    />
                  </svg>
                  <span class="mt-2 text-base leading-normal"
                    >Select a file</span
                  >
                  <input
                    type="file"
                    name="file_surat_tugas"
                    class="hidden"
                    @change="pickFile"
                  />
                </label>
              </div>
            </div>
            <ButtonLoading v-if="loadingAct" title="Menyimpan data...." />
            <Button v-else title="Simpan" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from "../../config/firebase";
import Swal from "sweetalert2";
import { mapActions, mapGetters } from "vuex";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { apiLocationKey, apiMapBox, urlLocation } from "../../utils/index";
import { Button, ButtonLoading } from "../componentList";

export default {
  components: { Button, ButtonLoading },
  data() {
    return {
      pegawai: [],
      penugasan: {
        peg_id: "",
        kendaraan: "",
        lokasi_nama: "",
        latitude: "",
        longitude: "",
        latitude_selesai: 0,
        longitude_selesai: 0,
        tgl_tugas: null,
        jarak: 0,
        selesai: "no",
      },
      is_err_latlong: false,
      is_select_file: false,
      is_wrong_file: false,
      fileSelected: "",
      displayMap: false,
      kendaraan: ["Dinas", "Pribadi", "Angkutan"],
      location: null,
      locCenterNew: null,
      hasilSearch: [],
      accessToken: apiMapBox,
    };
  },
  mounted() {
    this.showMap(false);
    this.disabledBeforeToday();
  },
  created() {
    document.title = "Tambah Penugasan Pegawai"
    this.getPegawai();
  },
  methods: {
    ...mapActions(["tambahPenugasan", "setLoading"]),
    disabledBeforeToday() {
      var today = new Date().toISOString().split("T")[0];
      document
        .getElementsByName("tanggal_penugasan")[0]
        .setAttribute("min", today);
    },
    convertTgl() {
      const tglSelected = new Date(this.penugasan.tgl_tugas);
      this.penugasan.tgl_tugas = tglSelected;
    },
    onFormSubmit(event) {
      this.setLoading(true);
      event.preventDefault();
      const {
        lokasi_nama,
        tgl_tugas,
        kendaraan,
        peg_id,
        latitude,
        longitude,
      } = this.penugasan;
      this.convertTgl();
      if (latitude == "" && longitude == "") {
        this.setLoading(false);
        this.is_err_latlong = true;
      } else if (
        peg_id != "" &&
        lokasi_nama != "" &&
        tgl_tugas != "" &&
        kendaraan != "" &&
        this.fileSelected != ""
      ) {
        this.tambahPenugasan({
          file_tugas: this.fileSelected,
          item_tugas: {
            peg_id: this.penugasan.peg_id,
            kendaraan: this.penugasan.kendaraan,
            lokasi_nama: this.penugasan.lokasi_nama,
            latitude: this.penugasan.latitude,
            longitude: this.penugasan.longitude,
            latitude_selesai: this.penugasan.latitude_selesai,
            longitude_selesai: this.penugasan.longitude_selesai,
            tgl_tugas: this.penugasan.tgl_tugas,
            jarak: this.penugasan.jarak,
            selesai: this.penugasan.selesai,
          },
        });
        this.penugasan.peg_id = "";
        this.penugasan.kendaraan = "";
        this.penugasan.lokasi_nama = "";
        this.penugasan.latitude = "";
        this.penugasan.longitude = "";
        this.penugasan.tgl_tugas = "";
      } else {
        this.setLoading(false);
        Swal.fire({
          title: "Error!",
          text: "Terdapat field yang masih kosong",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    },
    getPegawai() {
      db.collection("pegawai").onSnapshot((snapshotChnage) => {
        this.pegawai = [];
        snapshotChnage.forEach((doc) => {
          this.pegawai.push({
            code: doc.id,
            nama: doc.data().nama,
          });
        });
      });
    },
    showMap(search) {
      mapboxgl.accessToken = this.accessToken;
      navigator.geolocation.getCurrentPosition((pos) => {
        this.location = pos.coords;
        const { latitude, longitude } = this.location;
        const map = new mapboxgl.Map({
          container: "mapContainer",
          style: "mapbox://styles/mapbox/streets-v11",
          center: search
            ? [this.locCenterNew.lon, this.locCenterNew.lat]
            : [longitude, latitude],
          zoom: search ? 12 : 8,
        });
        const nav = new mapboxgl.NavigationControl();
        map.addControl(nav, "top-right");
        if (this.hasilSearch.length > 0) {
          this.hasilSearch.forEach((data) => {
            new mapboxgl.Marker().setLngLat([data.lon, data.lat]).addTo(map);
          });
        }

        map.on("click", (e) => {
          this.penugasan.latitude = e.lngLat.lat;
          this.penugasan.longitude = e.lngLat.lng;
        });
      });
    },
    cariLokasi() {
      this.displayMap = true;
      axios
        .get(
          `${urlLocation}${apiLocationKey}&q=${this.penugasan.lokasi_nama}&format=json`
        )
        .then((res) => {
          this.hasilSearch = res.data;
          this.locCenterNew = res.data[0];
          this.showMap(true);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    pickFile(event) {
      this.fileSelected = event.target.files[0];
      console.log(this.fileSelected);
      if (this.fileSelected.type != "application/pdf") {
        this.is_wrong_file = true;
        this.fileSelected = {};
      } else {
        this.is_select_file = true;
      }
    },
    resetFile() {
      this.fileSelected = {};
      this.is_select_file = false;
    },
  },
  computed: mapGetters(["loadingAct"]),
};
</script>

<style scoped>
.basemap {
  height: 500px;
}
</style>