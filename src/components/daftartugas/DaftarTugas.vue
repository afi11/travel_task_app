<template>
  <div>
    <div class="grid grid-cols-3 gap-6 xl:grid-cols-2 mb-4">
      <!-- card -->
      <div class="card border-0 shadow-md mt-6">
        <div class="card-body flex items-center">
          <div class="px-3 py-2 rounded bg-green-600 text-white mr-3">
            <i class="fad fa-tasks"></i>
          </div>
          <div class="flex flex-col">
            <h1 class="font-semibold">
              <span class="num-2">{{ jumlahTugasPeg }}</span> Penugasan
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
              <span class="num-2">{{ jumlahPendingTugasPeg }}</span> Penugasan
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
              <span class="num-2">{{ jumlahTugasSelesaiPeg }}</span> Penugasan
              Selesai
            </h1>
          </div>
        </div>
      </div>
      <!-- end card -->
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-1 gap-5 mt-5">
      <CardTugasPegawai
        :ndata="nTaskSkrgPeg"
        title="Daftar Tugas Hari Ini"
        :tasks="daftarTgsTodayPeg"
      />
      <CardTugasPegawai
        :ndata="nTaskBesokPeg"
        title="Daftar Tugas Besok"
        :tasks="listTugasPegBsok"
      />
      <CardTugasPegawai
        :ndata="nTaskLimitOnGoingPeg"
        title="Daftar Tugas Dalam Proses"
        :tasks="daftarTgsOngoingLimitPeg"
      />
      <CardTugasPegawai
        :ndata="nTaskLimitSelesaiPeg"
        title="Daftar Tugas Selesai"
        :tasks="daftarTgsSelesaiLimitPeg"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { CardTugasPegawai } from "../componentList";

export default {
  data() {
    return {};
  },
  components: {
    CardTugasPegawai,
  },
  methods: {
    ...mapActions([
      "countTugasPeg",
      "countPendingTugasPeg",
      "countTugasSelesaiPeg",
      "getTaskTodayPeg",
      "getTaskTomorrowPeg",
      "limitTgsOnGoingStatusPeg",
      "limitTgsSelesaiStatusPeg",
    ]),
    getTugasSelesai() {
      let data = {
        userid: this.$auth.getUserId(),
        status: "yes",
      };
      this.countTugasSelesaiPeg(data);
    },
    getTugasOngoing() {
      let data = {
        userid: this.$auth.getUserId(),
        status: "ongoing",
      };
      this.countPendingTugasPeg(data);
    },
    getTugasHariIni() {
      let today = new Date().toISOString().slice(0, 10);
      today = new Date(today);
      let data = {
        userid: this.$auth.getUserId(),
        tgl: today,
      };
      this.getTaskTodayPeg(data);
    },
    getTugasBesok() {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      let tomorrow2 = new Date(tomorrow).toISOString().slice(0, 10);
      tomorrow2 = new Date(tomorrow2);
      let data = {
        userid: this.$auth.getUserId(),
        tgl: tomorrow2,
      };
      this.getTaskTomorrowPeg(data);
    },
    getTugasOngoingLimit() {
      let data = {
        userid: this.$auth.getUserId(),
        status: "ongoing",
      };
      this.limitTgsOnGoingStatusPeg(data);
    },
    getTugasSelesaiLimit() {
      let data = {
        userid: this.$auth.getUserId(),
        status: "yes",
      };
      this.limitTgsSelesaiStatusPeg(data);
    },
  },
  computed: mapGetters([
    "jumlahTugasPeg",
    "jumlahPendingTugasPeg",
    "jumlahTugasSelesaiPeg",
    "nTaskSkrgPeg",
    "daftarTgsTodayPeg",
    "listTugasPegBsok",
    "nTaskBesokPeg",
    "daftarTgsOngoingLimitPeg",
    "nTaskLimitOnGoingPeg",
    "daftarTgsSelesaiLimitPeg",
    "nTaskLimitSelesaiPeg",
  ]),
  created() {
    document.title = "Halaman Dashboard Pegawai";
    this.countTugasPeg(this.$auth.getUserId());
    this.getTugasSelesai();
    this.getTugasOngoing();
    this.getTugasHariIni();
    this.getTugasBesok();
    this.getTugasOngoingLimit();
    this.getTugasSelesaiLimit();
  },
};
</script>