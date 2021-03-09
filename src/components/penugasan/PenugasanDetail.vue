<template>
  <div class="flex flex-col justify-center items-center">
    <div class="md:w-full w-4/5">
      <h1 class="text-sm font-semibold text-gray-600 mb-2 mt-3">
        <router-link to="/">Dashboard</router-link>&nbsp;
        <i class="fas fa-caret-right"></i>
        <router-link to="/penugasan"> Penugasan &nbsp;</router-link>
        <i class="fas fa-caret-right"></i>
        <span class="text-gray-500"> Detail Penugasan</span>
      </h1>
      <hr />
      <div class="flex flex-col mt-4">
        <div class="card border-0 shadow">
          <div class="card-body">
            <h1 class="font-bold text-lg mb-3">Data Tugas</h1>
            <DataTugas :penugasan="penugasan" />
          </div>
        </div>
        <div class="card border-0 shadow mt-5">
          <div class="card-body">
            <div class="mb-3 flex flex-col">
              <div v-if="det_tempuh">
                <h5 class="text-lg font-bold mb-2">
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
              <div
                class="bg-orange-200 border-l-8 border-orange-500 rounded-r-lg shadow-sm py-3 px-2"
                v-else
              >
                <h5 class="text-orange-800 text-sm font-semibold">
                  Data perkiraan waktu perjalanan belum dapat ditampilkan
                  dikarenakan pegawai belum mengirim progress perjalanan.
                </h5>
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

export default {
  data() {
    return {
      penugasan: {},
      accessToken: apiMapBox,
      jarak_waktu: {},
      det_tempuh: false,
      location: null,
      routes: null,
    };
  },
  components: {
    DataTugas,
  },
  created() {
    document.title = "Halaman Detail Penugasana";
  },
  mounted() {
    this.loadDataTugas();
  },
  methods: {
    loadDataTugas() {
      let dbRef = db.collection("penugasan").doc(this.$route.query.id);
      dbRef
        .get()
        .then((doc) => {
          this.penugasan = doc.data();
          this.loadMap();
        })
        .catch((error) => {
          console.log(error);
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
            console.log(res.data.routes[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },

    loadMap() {
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
      new mapboxgl.Marker({ color: "red" })
        .setLngLat([longitude, latitude])
        .addTo(map)
        .setPopup(popup);

      latitude_selesai != 0 && longitude_selesai != 0
        ? this.cekJarak(latitude_selesai, longitude_selesai).then((value) => {
            this.det_tempuh = true;
            this.jarak_waktu.jarak = value.distance / 1000;
            this.jarak_waktu.waktu = value.duration / 3600;
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

            map.on("load", function () {
              map.addSource("route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: value.geometry.coordinates,
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