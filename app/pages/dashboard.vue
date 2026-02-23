<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

/* ================= WEEKLY BAR ================= */

const weeklySeries = [
  {
    name: 'Operasi',
    data: [8, 12, 10, 15, 12, 6, 4]
  }
]

const weeklyOptions = {
  chart: {
    type: 'bar',
    toolbar: { show: false }
  },
  colors: ['#16a34a'],
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '50%'
    }
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  },
  grid: {
    borderColor: '#e5e7eb'
  }
}

/* ================= DONUT ================= */

const donutSeries = [30, 25, 20, 15, 10]

const donutOptions = {
  chart: { type: 'donut' },
  labels: ['Bedah', 'Jantung', 'Saraf', 'Orthopedi', 'Lainnya'],
  colors: ['#16a34a', '#facc15', '#3b82f6', '#a855f7', '#d1d5db'],
  legend: { position: 'bottom' },
  dataLabels: { enabled: false }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 space-y-6">
    <!-- ================= STAT CARDS ================= -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <UCard>
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-500">
              Hari Ini
            </p>
            <p class="text-3xl font-bold">
              12
            </p>
          </div>
          <div class="p-3 rounded-xl bg-green-100 text-green-600">
            <UIcon
              name="i-lucide-heart-pulse"
              class="w-6 h-6"
            />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-500">
              Berlangsung
            </p>
            <p class="text-3xl font-bold">
              3
            </p>
          </div>
          <div class="p-3 rounded-xl bg-yellow-100 text-yellow-600">
            <UIcon
              name="i-lucide-clock"
              class="w-6 h-6"
            />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-500">
              Menunggu
            </p>
            <p class="text-3xl font-bold">
              5
            </p>
          </div>
          <div class="p-3 rounded-xl bg-blue-100 text-blue-600">
            <UIcon
              name="i-lucide-clock"
              class="w-6 h-6"
            />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-500">
              Selesai
            </p>
            <p class="text-3xl font-bold">
              4
            </p>
          </div>
          <div class="p-3 rounded-xl bg-green-100 text-green-600">
            <UIcon
              name="i-lucide-check"
              class="w-6 h-6"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- ================= CHARTS ================= -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <!-- BAR -->
      <UCard class="xl:col-span-2">
        <h3 class="text-lg font-semibold mb-4">
          Operasi Mingguan
        </h3>
        <ClientOnly>
          <apexchart
            type="bar"
            height="320"
            :options="weeklyOptions"
            :series="weeklySeries"
          />
        </ClientOnly>
      </UCard>

      <!-- DONUT -->
      <UCard>
        <h3 class="text-lg font-semibold mb-4">
          Distribusi KSM
        </h3>
        <ClientOnly>
          <apexchart
            type="donut"
            height="320"
            :options="donutOptions"
            :series="donutSeries"
          />
        </ClientOnly>
      </UCard>
    </div>

    <!-- ================= LIST ================= -->
    <UCard>
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">
          Jadwal Operasi Hari Ini
        </h3>
        <UButton
          size="sm"
          variant="soft"
        >
          Lihat Semua
        </UButton>
      </div>

      <div class="space-y-4">
        <div
          class="flex justify-between items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
        >
          <div>
            <p class="font-semibold">
              Ahmad Wijaya
            </p>
            <p class="text-sm text-gray-500">
              08:00 • OK 1 • Bedah Digestif
            </p>
          </div>
          <UBadge color="success">
            Berlangsung
          </UBadge>
        </div>

        <div
          class="flex justify-between items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
        >
          <div>
            <p class="font-semibold">
              Siti Nurhaliza
            </p>
            <p class="text-sm text-gray-500">
              09:00 • OK 2 • Bedah Saraf
            </p>
          </div>
          <UBadge color="warning">
            Dijadwalkan
          </UBadge>
        </div>

        <div
          class="flex justify-between items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
        >
          <div>
            <p class="font-semibold">
              Bambang Suryadi
            </p>
            <p class="text-sm text-gray-500">
              10:30 • OK 3 • Jantung
            </p>
          </div>
          <UBadge color="info">
            Verifikasi
          </UBadge>
        </div>
      </div>
    </UCard>
  </div>
</template>
