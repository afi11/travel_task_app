<template>
  <div>
    <div class="mb-4 mt-4">
      <h1 class="text-sm font-semibold text-gray-600 mb-2">
        <router-link to="/">Dashboard &nbsp;</router-link>
        <i class="fas fa-caret-right"></i>
        <span class="text-gray-500"> Daftar Penugasan Selesai</span>
      </h1>
      <hr />
    </div>
    <div class="card border-0 shadow">
      <div class="card-body flex flex-col">
        <h5 class="text-ld text-gray-800 mb-3 font-semibold">
          Daftar Penugasan Selesai
        </h5>
        <VueyeTable
          :data="daftarTugas2"
          :columns="columns"
          title="Daftar Penugasan"
        >
          <template v-slot:selesai="{ item }">
            <span class="text-green-500 font-bold" v-if="item.selesai == 'yes'"
              >Selesai</span
            >
            <span
              class="text-orange-500 font-bold"
              v-else-if="item.selesai == 'ongoing'"
              >Dalam Progress</span
            >
            <span
              class="text-red-500 font-bold"
              v-else-if="item.selesai == 'no'"
              >Belum Selesai</span
            >
          </template>
          <template v-slot:file_url="{ item }">
            <a
              target="_blank"
              class="text-blue-700 hover:text-blue-400"
              :href="item.file_url"
            >
              Lihat file <i class="fas fa-file-pdf"></i>
            </a>
          </template>
          <template v-slot:actions="{ item }">
            <div class="ve-table-actions">
              <router-link
                :to="{ name: 'penugasanDetail', query: { id: item.id } }"
                class="bg-green-600 hover:bg-green-800 p-2 mr-1 text-white rounded-full"
              >
                <i class="fas fa-eye"></i> Detail
              </router-link>
              <button
                class="bg-red-600 p-1 text-white hover:bg-red-800 rounded-full"
                @click="deleteTugas(item)"
              >
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </template>
        </VueyeTable>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import VueyeTable from "vueye-table";

export default {
  data() {
    return {
      penugasan: [],
      columns: [
        {
          key: "id",
          label: "ID",
          sortable: true,
          display: false,
        },
        {
          key: "tgl_tugas",
          label: "Tanggal Tugas",
          sortable: true,
          display: true,
        },
        {
          key: "pegawai",
          label: "Pegawai",
          sortable: true,
          display: true,
        },
        {
          key: "kendaraan",
          label: "Kendaraan",
          sortable: true,
          display: true,
        },
        {
          key: "lokasi_nama",
          label: "Tempat Tugas",
          sortable: true,
          display: true,
        },
        {
          key: "file_url",
          label: "File Tugas",
          sortable: true,
          display: true,
        },
        {
          key: "actions",
          label: "Actions",
          sortable: false,
          display: true,
        },
      ],
    };
  },
  components: {
    VueyeTable,
  },
  methods: {
    ...mapActions(["fetchTugasSelesai", "deleteTugas"]),
  },
  computed: mapGetters(["daftarTugas2"]),
  created() {
    document.title = "Penugasan Pegawai Selesai";
    this.fetchTugasSelesai();
  },
};
</script>