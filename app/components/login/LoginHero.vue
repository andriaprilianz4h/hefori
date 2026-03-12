<script setup lang="ts">
import hefori from '@/assets/img/hefori-icon.png'

const stats = [
  { value: '7+', label: 'Modul Terintegrasi' },
  { value: '24/7', label: 'Real-time Monitoring' },
  { value: '100%', label: 'Digital Checklist' }
]
</script>

<template>
  <div
    class="hidden lg:flex lg:w-1/2 bg-linear-to-br from-primary-500 via-primary-700 to-primary-800 relative overflow-hidden"
  >
    <!-- Dot Pattern -->
    <div class="absolute inset-0 opacity-10">
      <div
        class="absolute inset-0"
        style="
          background-image: radial-gradient(
            circle at 2px 2px,
            white 1px,
            transparent 0
          );
          background-size: 40px 40px;
        "
      />
    </div>

    <div class="relative z-10 flex flex-col justify-center px-12 text-white">
      <div class="flex items-center gap-3 mb-8">
        <div class="w-20 h-20 flex items-center justify-center">
          <img
            :src="hefori"
            alt="Logo"
            class="w-full h-full object-contain drop-shadow-lg"
          >
        </div>
        <div>
          <h1 class="text-5xl font-bold">
            <span class="text-yellow-400">HEF</span><span class="text-white">ORI</span>
          </h1>
          <!-- <p class="text-white/80 text-sm">
            Surgical Management System
          </p> -->
        </div>
      </div>

      <h2 class="text-4xl font-bold mb-4 leading-tight">
        Health Workforce Monitoring System <br> (HEFORI)
      </h2>
      <p class="text-lg text-white/90 mb-8 leading-relaxed">
        Platform digital untuk Monitoring Kesehatan Pegawai di Lingkungan RSUD Dr. Soetomo dengan SmartWatch sebagai alat utama untuk pengumpulan data kesehatan secara real-time.
      </p>

      <div class="grid grid-cols-3 gap-4 mt-8">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="bg-white/10 backdrop-blur-sm rounded-lg p-4"
        >
          <div class="text-3xl font-bold mb-1">
            {{ stat.value }}
          </div>
          <div class="text-sm text-white/80">
            {{ stat.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
