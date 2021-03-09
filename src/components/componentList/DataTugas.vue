<template>
  <table class="table-auto w-full mb-4">
    <thead>
      <tr>
        <td class="py-2 font-semibold md:text-sm text-md md:text-center">
          Surat Tugas
        </td>
        <td class="py-2 font-semibold md:text-sm text-md md:text-center">
          Tanggal
        </td>
        <td class="py-2 font-semibold md:text-sm text-md md:text-center">
          Tempat
        </td>
        <td class="py-2 font-semibold md:text-sm text-md md:text-center">
          Kendaraan
        </td>
        <td class="py-2 font-semibold md:text-sm text-md md:text-center">
          Status
        </td>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-sm text-gray-600 text-left">
          <a target="_blank" class="text-blue-500 hover:text-blue-800" :href="penugasan.file_url"
            ><i class="fas fa-eye"></i> Lihat
          </a>
        </td>
        <td class="text-sm text-gray-600 text-left">
          {{ penugasan.tgl_tugas.toDate().toDateString() }}
        </td>
        <td class="text-sm text-gray-600 text-left">
          {{ penugasan.lokasi_nama }}
        </td>
        <td class="text-sm text-gray-600 text-left">
          {{ penugasan.kendaraan }}
        </td>
        <td class="text-sm text-gray-600 text-left">
          {{
            penugasan.selesai == "no"
              ? "Belum dikerjakan"
              : penugasan.selesai == "ongoing"
              ? "Process"
              : penugasan.selesai == "yes"
              ? "Selesai"
              : ""
          }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "DataTugas",
  props: ["penugasan"],
};
</script>