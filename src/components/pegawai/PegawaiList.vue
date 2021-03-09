<template>
  <div>
    <div class="mb-4 mt-4">
      <h1 class="text-sm font-semibold text-gray-600 mb-2">
        <router-link to="/">Dashboard &nbsp;</router-link>
        <i class="fas fa-caret-right"></i>
        <span class="text-gray-500">Daftar Pegawai</span>
      </h1>
      <hr />
    </div>
    <div class="card border-0 shadow">
      <div class="card-body flex flex-col">
        <div class="mb-4">
          <router-link
            :to="{ name: 'pegawaiCreate' }"
            class="bg-green-600 hover:bg-green-800 p-2 mb-2 shadow mr-1 text-white rounded-full"
          >
            <i class="fas fa-plus"></i> Tambah Pegawai
          </router-link>
        </div>
        <VueyeTable
          :data="daftarPegawai"
          :columns="columns"
          title="Daftar Pegawai"
        >
          <template v-slot:actions="{ item }">
            <div class="ve-table-actions">
              <router-link
                :to="{ name: 'pegawaiEdit', query: { id: item.id } }"
                class="bg-blue-600 hover:bg-blue-800 p-2 mr-1 text-white rounded-full"
              >
                <i class="fas fa-edit"></i> Edit
              </router-link>
              <button
                class="bg-red-600 hover:bg-red-800 p-1 text-white rounded-full"
                @click="deletePegawai(item)"
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
import { mapGetters, mapActions } from "vuex";
import VueyeTable from "vueye-table";
export default {
  data() {
    return {
      pegawai: [],
      columns: [
        {
          key: "id",
          label: "ID",
          sortable: true,
          type: "number",
          display: false,
        },
        {
          key: "nama",
          label: "Nama",
          sortable: true,
          display: true,
        },
        {
          key: "email",
          label: "Email",
          sortable: true,
          display: true,
        },
        {
          key: "telepon",
          label: "Telepon",
          sortable: true,
          display: true,
        },
        {
          key: "alamat",
          label: "Alamat",
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
    ...mapActions(["fetchPegawai", "deletePegawai"]),
  },
  computed: mapGetters(["daftarPegawai"]),
  created() {
    this.fetchPegawai();
    document.title = "Halaman Daftar Pegawai";
  },
};
</script>