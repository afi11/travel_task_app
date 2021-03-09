<template>
  <div>
    <div class="grid grid-cols-4 gap-6 xl:grid-cols-2 mb-4">
      <!-- card -->
      <div class="card border-0 shadow-md mt-6">
        <div class="card-body flex items-center">
          <div class="px-3 py-2 rounded bg-indigo-600 text-white mr-3">
            <i class="fad fa-user"></i>
          </div>
          <div class="flex flex-col">
            <h1 class="font-semibold">
              <span class="num-2">{{ jumlahPegawai }}</span> Pegawai
            </h1>
          </div>
        </div>
      </div>
      <!-- end card -->

      <!-- card -->
      <div class="card border-0 shadow-md mt-6">
        <div class="card-body flex items-center">
          <div class="px-3 py-2 rounded bg-green-600 text-white mr-3">
            <i class="fad fa-tasks"></i>
          </div>
          <div class="flex flex-col">
            <h1 class="font-semibold">
              <span class="num-2">{{ jumlahTugas }}</span> Penugasan
            </h1>
          </div>
        </div>
      </div>
      <!-- end card -->

      <!-- card -->
      <div class="card border-0 shadow-md mt-6 xl:mt-1">
        <div class="card-body flex items-center">
          <div class="px-3 py-2 rounded bg-yellow-600 text-white mr-3">
            <i class="fad fa-tasks"></i>
          </div>
          <div class="flex flex-col">
            <h1 class="font-semibold">
              <span class="num-2">{{ jumlahPendingTugas }}</span> Penugasan
              Dalam Progress
            </h1>
          </div>
        </div>
      </div>
      <!-- end card -->

      <!-- card -->
      <div class="card border-0 shadow-md mt-6 xl:mt-1">
        <div class="card-body flex items-center">
          <div class="px-3 py-2 rounded bg-red-600 text-white mr-3">
            <i class="fad fa-tasks"></i>
          </div>

          <div class="flex flex-col">
            <h1 class="font-semibold">
              <span class="num-2">{{ jumlahTugasSelesai }}</span> Penugasan
              Selesai
            </h1>
          </div>
        </div>
      </div>
      <!-- end card -->
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-1 gap-5 mt-5">
      <CardTugasHariIniAdmin
        :ndata="nTaskSkrg"
        title="Daftar Tugas Hari Ini"
        :tasks="daftarTgsTodayAdm"
      />
      <CardTugasHariIniAdmin
        :ndata="nTaskBesok"
        title="Daftar Tugas Besok"
        :tasks="daftarTgsBsokAdm"
      />
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-1 gap-5 mt-5">
      <CardTugasHariIniAdmin
        title="Daftar Tugas Belum Selesai"
        :ndata="nTaskLimitOnGoing"
        :tasks="daftarTgsOngoingLimit"
      />
      <CardTugasHariIniAdmin
        title="Daftar Tugas Selesai"
        :ndata="nTaskLimitSelesai"
        :tasks="daftarTgsSelesaiLimit"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { CardTugasHariIniAdmin } from "../componentList";

export default {
  data() {
    return {};
  },
  components: {
    CardTugasHariIniAdmin,
  },
  methods: {
    ...mapActions([
      "getTaskTodayAdmin",
      "getTaskTomorrowAdmin",
      "countNPegawai",
      "countTugas",
      "countPendingTugas",
      "countTugasSelesai",
      "limitTgsSelesaiStatus",
      "limitTgsOnGoingStatus",
    ]),
  },
  computed: mapGetters([
    "daftarTgsTodayAdm",
    "daftarTgsBsokAdm",
    "jumlahPegawai",
    "jumlahTugas",
    "jumlahPendingTugas",
    "jumlahTugasSelesai",
    "daftarTgsSelesaiLimit",
    "daftarTgsOngoingLimit",
    "nTaskBesok",
    "nTaskSkrg",
    "nTaskLimitSelesai",
    "nTaskLimitOnGoing",
  ]),
  created() {
    document.title = "Halaman Dashboard Admin"
    this.getTaskTodayAdmin();
    this.getTaskTomorrowAdmin();
    this.countNPegawai();
    this.countTugas();
    this.countPendingTugas();
    this.countTugasSelesai();
    this.limitTgsSelesaiStatus();
    this.limitTgsOnGoingStatus();
  },
};
</script>