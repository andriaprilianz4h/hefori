<script setup lang="ts">
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="flex items-center justify-center h-[80vh]">
      <UCard class="w-full max-w-3xl text-center py-20">
        <div class="space-y-4">
          <UIcon
            name="i-lucide-layout-dashboard"
            class="w-16 h-16 mx-auto text-primary-500"
          />

          <h1 class="text-5xl font-bold text-gray-900">
            INI Booking
          </h1>

          <p class="text-gray-500 text-lg">
            Selamat datang di halaman booking.
          </p>
        </div>
      </UCard>
    </div>
  </div>
</template>
