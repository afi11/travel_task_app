<template>
  <div class="flex flex-col justify-center items-center">
    <div class="md:w-full w-4/5">
      <div class="flex flex-col">
        <div class="card border-0 shadow mb-5">
          <div class="card-body">
            <h5 class="font-extrabold text-lg mb-3">Petunjuk Penggunaan</h5>
            <div class="bg-red-200 px-2 py-3 mb-3 rounded">
              <span class="text-red-800 text-sm"
                >Gunakan perangkat
                <span class="font-bold">smartphone</span> dengan mengaktifkan
                <span class="font-bold">GPS</span> agar lokasi anda lebih
                akurat.<br />
                <span class="font-bold">Petunjuk Penggunaan Menu :</span><br />
                1. Menu route digunakan untuk menampilkan route perjalanan
                menuju lokasi penugasan.<br />
                2. Menu kirim progress digunakan untuk memberikan progress
                perjalanan menuju lokasi penugasan.<br />
                3. Menu selesai digunakan apabila telah selesai melakukan tugas
                yang diberikan.<br />
              </span>
            </div>
          </div>
        </div>
        <div class="card border-0 shadow">
          <div class="card-body">
            <h1 class="font-extrabold text-lg mb-3">Data Tugas</h1>
            <DataTugas :penugasan="penugasan" />
          </div>
        </div>
        <div class="card border-0 shadow mt-5">
          <div class="card-body">
            <div class="mb-3 flex flex-col">
              <h5 class="font-extrabold text-lg mb-3">Daftar Menu</h5>
              <div>
                <button
                  class="bg-gray-500 hover:bg-gray-700 rounded text-white p-2 mr-3"
                  @click="getDirection()"
                >
                  <i class="fas fa-directions"></i> Route
                </button>
                <span v-if="kerjakan_tgs">
                  <button
                    v-if="showmenu"
                    class="bg-orange-500 hover:bg-orange-700 rounded text-white p-2 mr-3"
                    @click="kirimProgess('ongoing')"
                  >
                    Kirim Progress
                  </button>
                  <button
                    v-if="showmenu"
                    class="bg-green-500 hover:bg-green-700 rounded text-white p-2 mr-3"
                    @click="confirmSelesai()"
                  >
                    Selesai
                  </button>
                  <button
                    v-if="!showmenu"
                    class="bg-white hover:bg-gray-300 rounded text-blue-500 p-2 mr-3"
                  >
                    Tugas Telah Selesai
                  </button>
                </span>
                <span v-else>
                  <button
                    class="bg-white hover:bg-gray-300 rounded text-red-500 p-2 mr-3"
                  >
                    Tugas Belum dapat dikerjakan
                  </button>
                </span>
              </div>
              <div v-if="det_tempuh" class="mt-4">
                <h5 class="text-md font-bold mb-2">
                  Perkiraan Waktu Perjalanan
                </h5>
                <table class="table-auto w-full">
                  <thead>
                    <tr>
                      <td class="text-sm font-bold">Jarak Tempuh</td>
                      <td class="text-sm font-bold">Waktu Tempuh</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{{ jarak_waktu.jarak.toFixed(0) + " KM" }}</td>
                      <td>{{ jarak_waktu.waktu.toFixed(2) + " Jam" }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div id="mapContainer" class="basemap"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { db } from "../../config/firebase";
import { urlroute } from "../../utils/Url";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { DataTugas } from "../componentList";
import { apiMapBox } from "../../utils/index";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      penugasan: {},
      accessToken: apiMapBox,
      jarak_waktu: {},
      kerjakan_tgs: false,
      det_tempuh: false,
      location: null,
      routes: null,
    };
  },
  components: {
    DataTugas,
  },
  mounted() {
    this.loadDataTugas();
  },
  created() {
    document.title = "Halaman Mengerjakan Tugas";
  },
  methods: {
    getTanggalSkrg() {
      let today = new Date().toISOString().slice(0, 10);
      today = new Date(today);
      return today;
    },
    loadDataTugas() {
      let dbRef = db.collection("penugasan").doc(this.$route.query.id);
      dbRef
        .get()
        .then((doc) => {
          this.penugasan = doc.data();
          let tgl_tugas = this.penugasan.tgl_tugas.toDate().toDateString();
          tgl_tugas = new Date(tgl_tugas);
          if (this.getTanggalSkrg() >= tgl_tugas) {
            this.kerjakan_tgs = true;
          }
          this.loadMap(false, null);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getDirection() {
      return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
          reject(new Error("Geolocation is not available."));
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            this.location = pos.coords;
            const { latitude, longitude } = this.location;
            axios
              .get(
                `${urlroute}${longitude},${latitude};${this.penugasan.longitude},${this.penugasan.latitude}?access_token=${this.accessToken}&geometries=geojson`
              )
              .then((res) => {
                var coords = res.data.routes[0].geometry.coordinates;
                this.jarak_waktu.jarak = res.data.routes[0].distance / 1000;
                this.jarak_waktu.waktu = res.data.routes[0].duration / 3600;
                this.det_tempuh = true;
                this.routes = coords;
                console.log(res.data);
                this.loadMap(true, coords);
              })
              .catch((err) => console.log(err));
          },
          (err) => {
            reject(err);
          }
        );
      });
    },

    confirmSelesai() {
      Swal.fire({
        title: "Apakah anda mau menyelesaikan penugasan ini ?",
        showDenyButton: true,
        confirmButtonText: `Yes`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.kirimProgess("yes");
        } else if (result.isDenied) {
          Swal.fire("Data penugasan belum diselesaikan", "", "info");
        }
      });
    },

    async kirimProgess(selesai) {
      axios.get("https://ipapi.co/json/").then((res) => {
        const { latitude, longitude} = res.data.latitude;
        this.cekJarak(latitude, longitude).then((value) => {
          this.penugasan.jarak = value.distance;
          this.penugasan.latitude_selesai = latitude;
          this.penugasan.longitude_selesai = longitude;
          this.penugasan.selesai = selesai;
          db.collection("penugasan")
            .doc(this.$route.query.id)
            .update(this.penugasan)
            .then(() => {
              this.loadMap(false, null);
            })
            .catch((err) => console.log(err));
        });
      });
      console.log(selesai);
      return new Promise((resolve, reject) => {
        if (!("geolocation" in navigator)) {
          reject(new Error("Geolocation is not available."));
        }
        navigator.geolocation.getCurrentPosition((pos) => {
          this.location = pos.coords;
          const { latitude, longitude } = this.location;

        });
      });
    },

    async cekJarak(latitude, longitude) {
      return new Promise((resolve, reject) => {
        axios
          .get(
            `${urlroute}${longitude},${latitude};${this.penugasan.longitude},${this.penugasan.latitude}?access_token=${this.accessToken}&geometries=geojson`
          )
          .then((res) => {
            resolve(res.data.routes[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    loadMap(drawroute, route) {
      mapboxgl.accessToken = this.accessToken;
      const {
        latitude,
        longitude,
        latitude_selesai,
        longitude_selesai,
      } = this.penugasan;
      const map = new mapboxgl.Map({
        container: "mapContainer",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [longitude, latitude],
        zoom: 12,
      });

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setText("Lokasi Tugas : " + this.penugasan.lokasi_nama)
        .addTo(map);

      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav, "top-right");
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([longitude, latitude])
        .addTo(map)
        .setPopup(popup);

      latitude_selesai != 0 && longitude_selesai != 0
        ? this.cekJarak(latitude_selesai, longitude_selesai).then((value) => {
            const popup2 = new mapboxgl.Popup({ offset: 25 })
              .setText(
                "Progress Perjalanan, Jarak tempuh : " +
                  (value.distance / 1000).toFixed(0) +
                  " KM dan Waktu tempuh : " +
                  (value.duration / 3600).toFixed(2) +
                  " Jam"
              )
              .addTo(map);

            new mapboxgl.Marker({ color: "orange" })
              .setLngLat([longitude_selesai, latitude_selesai])
              .addTo(map)
              .setPopup(popup2);
          })
        : "";

      drawroute && route != null
        ? map.on("load", function () {
            map.addSource("route", {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: route,
                },
              },
            });
            map.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#438EE4",
                "line-width": 4,
                "line-opacity": 0.7,
              },
            });
          })
        : "";
    },
  },
  computed: {
    showmenu: function () {
      this.penugasan.selesai;
      return (
        this.penugasan.selesai === "ongoing" || this.penugasan.selesai === "no"
      );
    },
  },
};
</script>

<style scoped>
.basemap {
  height: 500px;
}
</style>