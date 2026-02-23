<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// Data pasien
const patientData = ref({
  name: 'Ahmad Wijaya',
  mrn: 'MRN001234',
  procedure: 'Laparotomi',
  date: '2024-01-20',
  time: '08:00 WIB',
  status: 'Menunggu Verifikasi'
})

// Checklist dokumen
const checklist = ref([
  { id: 1, label: 'Informed Consent telah ditandatangani', checked: false },
  { id: 2, label: 'Asesmen Pra-Bedah lengkap', checked: false },
  { id: 3, label: 'Digital Marker Site terverifikasi', checked: false },
  { id: 4, label: 'Hasil Laboratorium tersedia', checked: false },
  { id: 5, label: 'Hasil Imaging (Rontgen/CT/MRI)', checked: false }
])

// Status logistik
const logistics = ref([
  {
    id: 'blood',
    icon: 'i-heroicons-beaker',
    title: 'Ketersediaan Darah',
    status: 'available',
    description: '4 kantong tersedia',
    color: 'emerald'
  },
  {
    id: 'pharmacy',
    icon: 'i-heroicons-capsule',
    title: 'Farmasi & Obat',
    status: 'available',
    description: 'Semua item tersedia',
    color: 'emerald'
  },
  {
    id: 'equipment',
    icon: 'i-heroicons-cube',
    title: 'Alat Medis',
    status: 'warning',
    description: '1 item pending sterilisasi',
    color: 'amber'
  },
  {
    id: 'icu',
    icon: 'i-heroicons-building-office',
    title: 'Slot ICU/HCU',
    status: 'available',
    description: '2 bed ICU tersedia',
    color: 'emerald'
  }
])

const allChecked = computed(() => {
  return checklist.value.every(item => item.checked)
})

const resetChecklist = () => {
  checklist.value.forEach(item => (item.checked = false))
}

const verifyComplete = () => {
  if (!allChecked.value) {
    alert('Harap checklist semua dokumen terlebih dahulu')
    return
  }
  // Handle verification
  patientData.value.status = 'Terverifikasi'
  alert('Verifikasi berhasil!')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 space-y-6">
    <!-- Header Card -->
    <UCard class="rounded-2xl shadow-sm border-0">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 mb-1">
            {{ patientData.name }}
          </h1>
          <p class="text-sm text-gray-500">
            MRN: {{ patientData.mrn }} • {{ patientData.procedure }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-sm font-medium text-gray-900">
            {{ patientData.date }}
          </p>
          <p class="text-sm text-gray-500 mb-2">
            {{ patientData.time }}
          </p>
          <UBadge
            :color="
              patientData.status === 'Terverifikasi' ? 'success' : 'warning'
            "
            variant="soft"
            class="text-xs"
          >
            {{ patientData.status }}
          </UBadge>
        </div>
      </div>
    </UCard>

    <!-- Checklist Dokumen -->
    <UCard
      class="rounded-2xl shadow-sm border-0"
      :ui="{ body: 'p-6' }"
    >
      <h2 class="text-lg font-semibold text-gray-900 mb-6">
        Checklist Kelengkapan Dokumen
      </h2>

      <div class="space-y-0">
        <div
          v-for="item in checklist"
          :key="item.id"
          class="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors px-2 -mx-2 rounded-lg"
          @click="item.checked = !item.checked"
        >
          <!-- Custom Checkbox -->
          <div
            class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 shrink-0"
            :class="
              item.checked
                ? 'bg-emerald-500 border-emerald-500'
                : 'border-gray-300 bg-white hover:border-gray-400'
            "
          >
            <UIcon
              v-if="item.checked"
              name="i-heroicons-check"
              class="w-3.5 h-3.5 text-white"
            />
          </div>

          <span
            class="text-sm text-gray-700 select-none"
            :class="{ 'text-gray-400': item.checked }"
          >
            {{ item.label }}
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 mt-8 pt-4">
        <UButton
          variant="soft"
          color="neutral"
          @click="resetChecklist"
        >
          Reset
        </UButton>
        <UButton
          color="success"
          :disabled="!allChecked"
          class="gap-2"
          @click="verifyComplete"
        >
          <UIcon
            name="i-heroicons-check-circle"
            class="w-5 h-5"
          />
          Verifikasi Lengkap
        </UButton>
      </div>
    </UCard>

    <!-- Status Logistik -->
    <UCard
      class="rounded-2xl shadow-sm border-0"
      :ui="{ body: 'p-6' }"
    >
      <h2 class="text-lg font-semibold text-gray-900 mb-6">
        Status Logistik & Ketersediaan
      </h2>

      <div class="grid md:grid-cols-2 gap-6">
        <div
          v-for="item in logistics"
          :key="item.id"
          class="flex items-start gap-4"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            :class="{
              'bg-emerald-50 text-emerald-600': item.color === 'emerald',
              'bg-amber-50 text-amber-600': item.color === 'amber'
            }"
          >
            <UIcon
              :name="item.icon"
              class="w-5 h-5"
            />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <h3 class="font-medium text-gray-900">
                {{ item.title }}
              </h3>
              <UIcon
                :name="
                  item.status === 'available'
                    ? 'i-heroicons-check-circle'
                    : 'i-heroicons-exclamation-triangle'
                "
                :class="{
                  'text-emerald-500': item.status === 'available',
                  'text-amber-500': item.status === 'warning'
                }"
                class="w-4 h-4"
              />
            </div>
            <p class="text-sm text-gray-500 mt-0.5">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="mt-6 p-4 bg-blue-50 rounded-xl flex items-start gap-3">
        <UIcon
          name="i-heroicons-information-circle"
          class="w-5 h-5 text-blue-500 shrink-0 mt-0.5"
        />
        <p class="text-sm text-blue-700">
          Semua logistik harus tersedia sebelum pasien dapat dipindahkan ke area
          IBP.
        </p>
      </div>
    </UCard>
  </div>
</template>
