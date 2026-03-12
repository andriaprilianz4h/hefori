<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import type { ApexOptions } from 'apexcharts'

definePageMeta({
  layout: 'default'
})

// ===== Data Pegawai =====
interface Staff {
  id: number
  name: string
  position: string
  unit: string
  hr: number
  steps: number
  sleep: number
  calories: number
}

const staffList = ref<Staff[]>([
  {
    id: 1,
    name: 'Andri',
    position: 'Dokter',
    unit: 'Bedah',
    hr: 72,
    steps: 8400,
    sleep: 7,
    calories: 2100
  },
  {
    id: 2,
    name: 'Budi',
    position: 'Perawat',
    unit: 'ICU',
    hr: 110,
    steps: 2100,
    sleep: 5,
    calories: 1800
  },
  {
    id: 3,
    name: 'Sinta',
    position: 'Dokter',
    unit: 'Anestesi',
    hr: 68,
    steps: 9200,
    sleep: 8,
    calories: 2000
  }
])

// ===== Selected Staff =====
const selectedStaff = ref<Staff | null>(staffList.value[0] || null)

// ===== Search =====
const searchQuery = ref('')
const filteredStaff = computed(() =>
  staffList.value.filter(s =>
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

// ===== Select Staff =====
function selectStaff(staff: Staff) {
  selectedStaff.value = staff
}

// ===== Chart Data =====
const chartOptions = ref<ApexOptions>({
  chart: {
    type: 'bar', // ✅ TypeScript sekarang tahu ini valid
    height: 250,
    toolbar: { show: false }
  },
  xaxis: {
    categories: ['Heart Rate', 'Steps', 'Sleep', 'Calories']
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      horizontal: false,
      columnWidth: '50%'
    }
  },
  dataLabels: { enabled: false },
  yaxis: {
    labels: { formatter: (val: number) => val.toString() }
  },
  colors: ['#34D399', '#3B82F6', '#A78BFA', '#FB923C']
})

const chartSeries = ref([
  {
    name: 'Value',
    data: selectedStaff.value
      ? [
          selectedStaff.value.hr,
          selectedStaff.value.steps,
          selectedStaff.value.sleep,
          selectedStaff.value.calories
        ]
      : []
  }
])

// Update chart when selectedStaff changes
watch(selectedStaff, (newStaff) => {
  chartSeries.value = newStaff
    ? [
        {
          name: 'Value',
          data: [
            newStaff.hr,
            newStaff.steps,
            newStaff.sleep,
            newStaff.calories
          ]
        }
      ]
    : [{ name: 'Value', data: [] }]
})
</script>

<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <!-- Daftar Pegawai -->
    <div
      class="lg:w-1/3 bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-md space-y-3"
    >
      <h2 class="text-lg font-semibold mb-2">
        Daftar Pegawai
      </h2>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari pegawai..."
        class="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-green-400"
      >

      <ul class="space-y-2 mt-2">
        <li
          v-for="staff in filteredStaff"
          :key="staff.id"
          class="cursor-pointer p-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
          :class="{
            'bg-green-100 dark:bg-green-800/30': selectedStaff?.id === staff.id
          }"
          @click="selectStaff(staff)"
        >
          <p class="font-semibold text-gray-800 dark:text-gray-200">
            {{ staff.name }}
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ staff.position }} - {{ staff.unit }}
          </p>
        </li>
      </ul>
    </div>

    <!-- Profil & Health Stats -->
    <div class="flex-1 space-y-6">
      <div
        v-if="selectedStaff"
        class="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-md"
      >
        <h2 class="text-lg font-semibold mb-2">
          Profil Pegawai
        </h2>
        <p><strong>Nama:</strong> {{ selectedStaff.name }}</p>
        <p><strong>Jabatan:</strong> {{ selectedStaff.position }}</p>
        <p><strong>Unit:</strong> {{ selectedStaff.unit }}</p>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            class="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center"
          >
            <p class="text-sm text-gray-500 dark:text-gray-300">
              Heart Rate
            </p>
            <p class="text-2xl font-bold">
              {{ selectedStaff.hr }} bpm
            </p>
          </div>
          <div
            class="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center"
          >
            <p class="text-sm text-gray-500 dark:text-gray-300">
              Steps
            </p>
            <p class="text-2xl font-bold">
              {{ selectedStaff.steps }}
            </p>
          </div>
          <div
            class="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center"
          >
            <p class="text-sm text-gray-500 dark:text-gray-300">
              Sleep
            </p>
            <p class="text-2xl font-bold">
              {{ selectedStaff.sleep }} h
            </p>
          </div>
          <div
            class="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center"
          >
            <p class="text-sm text-gray-500 dark:text-gray-300">
              Calories
            </p>
            <p class="text-2xl font-bold">
              {{ selectedStaff.calories }} kcal
            </p>
          </div>
        </div>

        <!-- Riwayat Aktivitas (Chart) -->
        <div class="mt-6">
          <h3 class="font-semibold mb-2">
            Riwayat Aktivitas
          </h3>
          <VueApexCharts
            type="bar"
            height="250"
            :options="chartOptions"
            :series="chartSeries"
          />
        </div>

        <!-- Logs / Aktivitas -->
        <div class="mt-4">
          <h3 class="font-semibold mb-2">
            Logs Aktivitas
          </h3>
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div
              class="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg shadow-sm"
            >
              <p class="text-sm">
                08:00 - Login perangkat
              </p>
            </div>
            <div
              class="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg shadow-sm"
            >
              <p class="text-sm">
                09:00 - Heart Rate {{ selectedStaff.hr }} bpm
              </p>
            </div>
            <div
              class="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-lg shadow-sm"
            >
              <p class="text-sm">
                10:00 - Steps 1200
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-gray-500 dark:text-gray-400"
      >
        Pilih pegawai untuk melihat profil
      </div>
    </div>
  </div>
</template>
