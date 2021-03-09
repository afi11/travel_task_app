<template>
  <div class="flex flex-col justify-center items-center">
    <div class="w-3/5 md:w-full mb-4 mt-4">
      <h1 class="text-sm font-semibold text-gray-600 mb-2">
        <router-link to="/">Dashboard</router-link>&nbsp;
        <i class="fas fa-caret-right"></i>
        <router-link to="/penugasan"> Penugasan &nbsp;</router-link>
        <i class="fas fa-caret-right"></i>
        <span class="text-gray-500"> Edit Penugasan</span>
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
            <div class="flex flex-col mt-4">
              <div class="flex justify-between">
                <label class="mb-1 font-semibold text-gray-700"
                  >Pilih Pegawai Pegawai</label
                >
                <span
                  v-if="ganti_peg"
                  class="text-2xl btn-close"
                  @click="gantiPeg(false)"
                  >&times;</span
                >
              </div>
              <div v-if="!ganti_peg" class="flex justify-between">
                <input
                  readonly
                  v-model="peg_old.peg_old_nama"
                  class="border rounded-lg border-gray-400 text-gray-800 p-2 mr-2"
                />
                <button
                  type="button"
                  class="bg-blue-500 text-white rounded-md p-2"
                  @click="gantiPeg(true)"
                >
                  <i class="fas fa-user"></i> Ganti Pegawai
                </button>
              </div>
              <vue-select
                v-if="ganti_peg"
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
              <div class="flex flex-col mt-4">
                <label class="mb-1 font-semibold text-gray-700"
                  >Tanggal Penugasan</label
                >
                <input
                  class="py-2 px-2 text-md border border-gray-400 text-gray-800 rounded-l"
                  type="date"
                  name="setTodaysDate"
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
            <div class="flex flex-row justify-between">
              <p>
                Titik lokasi, latitude = {{ penugasan.latitude }} ,longitude =
                {{ penugasan.longitude }}
              </p>
            </div>
            <div id="mapContainer" class="basemap"></div>
            <div class="flex flex-col mt-4">
              <label class="mb-1 font-semibold text-gray-700"
                >File Surat Tugas</label
              >
              <a
                target="__blank"
                class="text-gray-700 mb-3"
                :href="penugasan.file_url"
                >Lihat file surat tugas <span class="fa fa-file"></span
              ></a>
              <p v-if="ganti_file">
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
                  <input type="file" class="hidden" @change="pickFile" />
                </label>
              </div>
            </div>
            <ButtonLoading v-if="loadingAct" title="Memperbaruhi data data...." />
            <Button v-else title="Simpan" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { db } from "../../config/firebase";
import Swal from "sweetalert2";
import mapboxgl from "mapbox-gl";
import axios from "axios";
import { apiLocationKey, apiMapBox, urlLocation } from "../../utils/index";
import { Button, ButtonLoading } from "../componentList";

export default {
  components: { Button, ButtonLoading },
  data() {
    return {
      pegawai: [],
      peg_old: {
        peg_old_id: "",
        peg_old_nama: "",
      },
      penugasan: {},
      ganti_peg: false,
      ganti_file: false,
      fileSelected: {},
      kendaraan: ["Dinas", "Pribadi", "Angkutan"],
      location: null,
      locCenterNew: null,
      hasilSearch: [],
      accessToken: apiMapBox,
    };
  },
  mounted() {
    this.disabledBeforeToday();
  },
  created() {
    document.title = "Edit Penugasan Pegawai"
    this.getPegawai();
    this.getSelectedTugas();
  },
  methods: {
    ...mapActions(["updateFileTugas", "updateDataTugas", "setLoading"]),
    disabledBeforeToday() {
      var today = new Date().toISOString().split("T")[0];
      document.getElementsByName("setTodaysDate")[0].setAttribute("min", today);
    },
    convertTgl() {
      const tglSelected = new Date(this.penugasan.tgl_tugas);
      this.penugasan.tgl_tugas = tglSelected;
    },
    onFormSubmit(event) {
      event.preventDefault();
      this.setLoading(true);
      this.penugasan.peg_id = this.peg_old.peg_old_id;
      this.convertTgl();
      const { peg_id, kendaraan, lokasi_nama, tgl_tugas } = this.penugasan;
      if (
        peg_id != "" &&
        lokasi_nama != "" &&
        tgl_tugas != "" &&
        kendaraan != ""
      ) {
        this.ganti_file
          ? this.updateFileTugas({
              file_tugas: this.fileSelected,
              doc: this.$route.query.id,
              item: {
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
                file_name: this.penugasan.file_name,
              },
            })
          : this.updateDataTugas({
              doc: this.$route.query.id,
              item: {
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
                file_name: this.penugasan.file_name,
              },
            });
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
    gantiPeg(state) {
      this.ganti_peg = state;
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
    getSelectedTugas() {
      const id = this.$route.query.id;
      let dbRef = db.collection("penugasan").doc(id);
      dbRef
        .get()
        .then((doc) => {
          this.penugasan = doc.data();
          this.penugasan.peg_id = "";
          this.peg_old.peg_old_id = doc.data().peg_id;
          this.penugasan.tgl_tugas = new Date(
            doc.data().tgl_tugas.seconds * 1000
          )
            .toISOString()
            .slice(0, 10);

          this.showMap(false);

          db.collection("pegawai")
            .doc(this.peg_old.peg_old_id)
            .get()
            .then((doc2) => {
              this.peg_old.peg_old_nama = doc2.data().nama;
            });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    showMap(search) {
      mapboxgl.accessToken = this.accessToken;
      const { latitude, longitude } = this.penugasan;
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

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setText(this.penugasan.lokasi_nama)
        .addTo(map);

      new mapboxgl.Marker({ color: "red" })
        .setLngLat([longitude, latitude])
        .addTo(map)
        .setPopup(popup);

      map.on("click", (e) => {
        this.penugasan.latitude = e.lngLat.lat;
        this.penugasan.longitude = e.lngLat.lng;
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
      this.ganti_file = true;
    },
    resetFile() {
      this.fileSelected = {};
      this.ganti_file = false;
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