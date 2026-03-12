<script setup lang="ts">
definePageMeta({ layout: 'default' })

// Top stats with gradients, trends, and progress
const stats = [
  {
    title: 'Total Staff',
    value: 128,
    valueNumeric: 128,
    max: 200,
    icon: 'i-heroicons-users',
    bgGradient: 'bg-gradient-to-br from-emerald-200 to-emerald-400',
    trend: '+5',
    trendColor: 'bg-emerald-100 text-emerald-700'
  },
  {
    title: 'Active Devices',
    value: 112,
    valueNumeric: 112,
    max: 150,
    icon: 'i-heroicons-signal',
    bgGradient: 'bg-gradient-to-br from-blue-200 to-blue-400',
    trend: '+2',
    trendColor: 'bg-blue-100 text-blue-700'
  },
  {
    title: 'Avg Heart Rate',
    value: '74 bpm',
    icon: 'i-heroicons-heart',
    bgGradient: 'bg-gradient-to-br from-red-200 to-red-400'
  },
  {
    title: 'Avg Steps Today',
    value: '7,980',
    valueNumeric: 7980,
    max: 10000,
    icon: 'i-heroicons-bolt',
    bgGradient: 'bg-gradient-to-br from-amber-200 to-amber-400',
    trend: '+12%',
    trendColor: 'bg-amber-100 text-amber-700'
  }
]

// ApexCharts data
const stepsChart = {
  series: [{ name: 'Steps', data: [3000, 5200, 4800, 7200, 8100, 9500, 7980] }],
  chartOptions: {
    chart: { type: 'line', toolbar: { show: false } },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    stroke: { curve: 'smooth' },
    markers: { size: 4 },
    grid: { borderColor: '#e0e0e0' }
  }
}

const hrChart = {
  series: [{ name: 'Heart Rate', data: [72, 75, 74, 78, 80, 76, 74] }],
  chartOptions: {
    chart: { type: 'line', toolbar: { show: false } },
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    stroke: { curve: 'smooth' },
    markers: { size: 4 },
    grid: { borderColor: '#e0e0e0' },
    colors: ['#EF4444']
  }
}

// Staff table
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'hr', header: 'Heart Rate' },
  { accessorKey: 'steps', header: 'Steps' },
  { accessorKey: 'sleep', header: 'Sleep' },
  { accessorKey: 'status', header: 'Status' }
]

const staff = [
  {
    id: 1,
    name: 'Andri',
    hr: '72 bpm',
    steps: 8400,
    sleep: '7h',
    status: 'Normal'
  },
  {
    id: 2,
    name: 'Budi',
    hr: '110 bpm',
    steps: 2100,
    sleep: '5h',
    status: 'Warning'
  },
  {
    id: 3,
    name: 'Sinta',
    hr: '68 bpm',
    steps: 9200,
    sleep: '8h',
    status: 'Good'
  }
]

// Alerts
const alerts = [
  { id: 1, name: 'Budi', message: 'High Heart Rate 110 bpm' },
  { id: 2, name: 'Rudi', message: 'Low Heart Rate 42 bpm' }
]

// Devices
const devices = [
  {
    id: 1,
    device: 'Apple Watch',
    user: 'Andri',
    battery: '78%',
    status: 'Online'
  },
  {
    id: 2,
    device: 'Mi Band',
    user: 'Budi',
    battery: '12%',
    status: 'Low Battery'
  }
]
</script>

<template>
  <div class="space-y-6">
    <!-- STATS CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      <UCard
        v-for="stat in stats"
        :key="stat.title"
        class="group relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 rounded-2xl"
      >
        <!-- Background gradient -->
        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-2xl"
          :class="
            stat.bgGradient || 'bg-gradient-to-br from-primary/20 to-primary/40'
          "
        />

        <div class="relative flex justify-between items-center p-4 sm:p-6">
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">
              {{ stat.title }}
            </p>
            <div class="flex items-baseline gap-2">
              <p
                class="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white"
              >
                {{ stat.value }}
              </p>
              <span
                v-if="stat.trend"
                class="text-xs font-semibold px-2 py-1 rounded-full"
                :class="stat.trendColor || 'bg-emerald-100 text-emerald-700'"
              >
                {{ stat.trend }}
              </span>
            </div>
          </div>

          <div
            class="p-4 sm:p-5 rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-primary/10 flex items-center justify-center"
          >
            <UIcon
              :name="stat.icon"
              class="w-8 h-8 sm:w-10 sm:h-10 text-primary"
            />
          </div>
        </div>

        <!-- Progress bar -->
        <div
          class="mt-3 h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
        >
          <div
            class="h-full rounded-full transition-all duration-1000 ease-out bg-primary"
            :style="{
              width:
                (stat.valueNumeric ? (stat.valueNumeric / stat.max) * 100 : 0)
                + '%'
            }"
          />
        </div>
      </UCard>
    </div>

    <!-- CHARTS -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          Daily Steps Trend
        </template>
        <ApexChart
          height="220"
          type="line"
          :options="stepsChart.chartOptions"
          :series="stepsChart.series"
        />
      </UCard>

      <UCard>
        <template #header>
          Heart Rate Trend
        </template>
        <ApexChart
          height="220"
          type="line"
          :options="hrChart.chartOptions"
          :series="hrChart.series"
        />
      </UCard>
    </div>

    <!-- ALERTS + DEVICES -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <UCard>
        <template #header>
          Health Alerts
        </template>
        <div class="space-y-3">
          <div
            v-for="a in alerts"
            :key="a.id"
            class="flex justify-between items-center"
          >
            <span>{{ a.name }}</span>
            <UBadge color="error">
              {{ a.message }}
            </UBadge>
          </div>
        </div>
      </UCard>

      <UCard>
        <template #header>
          Device Status
        </template>
        <div class="space-y-3">
          <div
            v-for="d in devices"
            :key="d.id"
            class="flex justify-between items-center"
          >
            <div>
              <p class="font-medium">
                {{ d.user }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ d.device }}
              </p>
            </div>
            <UBadge :color="d.status === 'Online' ? 'success' : 'warning'">
              {{
                d.battery
              }}
            </UBadge>
          </div>
        </div>
      </UCard>
    </div>

    <!-- STAFF TABLE -->
    <UCard>
      <template #header>
        Staff Monitoring
      </template>
      <UTable
        :data="staff"
        :columns="columns"
      />
    </UCard>
  </div>
</template>
