<template>
  <div class="card border-0 shadow-md">
    <div class="card-body">
      <div class="flex flex-row justify-between items-center">
        <h1 class="font-bold text-lg">{{ title }}</h1>
      </div>
      <table class="table-auto w-full mt-0 text-right">
        <thead>
          <tr>
            <td class="py-4 font-bold text-sm text-left">Tempat</td>
            <td class="py-4 font-bold text-sm">Tanggal</td>
            <td class="py-4 font-bold text-sm">Status</td>
            <td class="py-4 font-bold text-sm">Aksi</td>
          </tr>
        </thead>
        <tbody v-if="ndata > 0">
          <tr v-for="tugas in tasks" :key="tugas.id">
            <td class="text-sm text-gray-600 text-left">
              {{ tugas.lokasi_nama }}
            </td>
            <td class="text-xs text-gray-600">
              {{ tugas.tgl_tugas.toDate().toDateString() }}
            </td>
            <td class="text-xs text-gray-600">
              <span
                class="text-green-500 font-bold"
                v-if="tugas.selesai == 'yes'"
                >Selesai</span
              >
              <span
                class="text-orange-500 font-bold"
                v-else-if="tugas.selesai == 'ongoing'"
                >Dalam Progress</span
              >
              <span
                class="text-red-500 font-bold"
                v-else-if="tugas.selesai == 'no'"
                >Belum Selesai</span
              >
            </td>
            <td class="text-xs text-gray-600">
              <router-link
                class="text-blue-600 hover:text-blue-400 text-md font-semibold"
                :to="{ name: 'KerjakanTugas', query: { id: tugas.id } }"
              >
                Lihat
              </router-link>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td class="text-sm text-gray-600 text-center" colspan="4">
              Tidak ada tugas
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["tasks", "title", "ndata"],
  name: "CardTugasPegawai",
};
</script>