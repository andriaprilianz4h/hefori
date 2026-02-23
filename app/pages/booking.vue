<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

const form = reactive({
  mrn: '',
  ksm: '',
  dokter: '',
  prosedur: '',
  estimasi: 2,
  tanggal: '',
  catatan: ''
})

const ksmOptions = [
  { label: 'Bedah Umum', value: 'bedah' },
  { label: 'Obgyn', value: 'obgyn' },
  { label: 'Ortopedi', value: 'ortopedi' }
]
</script>

<template>
  <div class="p-8 space-y-10">
    <!-- ================= EMR ================= -->
    <UCard
      class="w-full rounded-2xl shadow-none border-0"
      :ui="{ header: 'border-0 pb-6' }"
    >
      <template #header>
        <h2 class="text-xl font-bold">
          Cari Data Pasien (EMR)
        </h2>
      </template>

      <div class="grid md:grid-cols-6 gap-4 items-end -mt-6">
        <!-- INPUT -->
        <div class="md:col-span-5">
          <UFormField
            label="Nomor Rekam Medis"
            name="mrn"
            :ui="{ label: 'text-sm font-medium text-gray-700 mb-0.5' }"
          >
            <UInput
              v-model="form.mrn"
              size="lg"
              class="w-full"
              placeholder="Masukkan Nomor Rekam Medis pasien"
            />
          </UFormField>
        </div>

        <!-- BUTTON -->
        <div class="md:col-span-1 flex items-end">
          <UButton
            size="lg"
            icon="i-heroicons-magnifying-glass"
            color="primary"
            class="w-full justify-center"
          >
            Cari
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- ================= DETAIL ================= -->
    <UCard
      class="w-full rounded-2xl shadow-none border-0"
      :ui="{ header: 'border-0 pb-2' }"
    >
      <template #header>
        <h2 class="text-xl font-semibold">
          Detail Permintaan Operasi
        </h2>
      </template>

      <div class="grid md:grid-cols-4 gap-8">
        <div class="space-y-2">
          <label class="text-sm text-gray-500">KSM *</label>
          <USelect
            v-model="form.ksm"
            :options="ksmOptions"
            size="lg"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm text-gray-500">Dokter Operator *</label>
          <UInput
            v-model="form.dokter"
            size="lg"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm text-gray-500">Jenis Prosedur *</label>
          <UInput
            v-model="form.prosedur"
            size="lg"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm text-gray-500">Estimasi Waktu (jam) *</label>
          <UInput
            v-model="form.estimasi"
            type="number"
            size="lg"
          />
        </div>

        <div class="space-y-2 md:col-span-2">
          <label class="text-sm text-gray-500">Tanggal Preferensi</label>
          <UInput
            v-model="form.tanggal"
            type="date"
            size="lg"
          />
        </div>

        <div class="space-y-2 md:col-span-4">
          <label class="text-sm text-gray-500">Catatan Khusus</label>
          <UTextarea
            v-model="form.catatan"
            :rows="4"
            size="lg"
          />
        </div>
      </div>
    </UCard>

    <!-- ================= UPLOAD ================= -->
    <UCard
      class="w-full rounded-2xl shadow-none border-0"
      :ui="{ header: 'border-0 pb-2' }"
    >
      <template #header>
        <h2 class="text-xl font-semibold">
          Upload Dokumen
        </h2>
      </template>

      <div class="grid md:grid-cols-3 gap-6">
        <div class="rounded-xl p-5 flex justify-between items-center border">
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-document-text"
              class="w-5 h-5 text-emerald-500"
            />
            <span class="font-medium"> Surat MRS * </span>
          </div>
          <UButton
            size="sm"
            variant="soft"
          >
            Upload
          </UButton>
        </div>

        <div class="rounded-xl p-5 flex justify-between items-center border">
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-document-text"
              class="w-5 h-5 text-emerald-500"
            />
            <span class="font-medium"> Surat RTO * </span>
          </div>
          <UButton
            size="sm"
            variant="soft"
          >
            Upload
          </UButton>
        </div>

        <div class="rounded-xl p-5 flex justify-between items-center border">
          <div class="flex items-center gap-3">
            <UIcon
              name="i-heroicons-document-text"
              class="w-5 h-5 text-emerald-500"
            />
            <span class="font-medium"> Hasil Penunjang </span>
          </div>
          <UButton
            size="sm"
            variant="soft"
          >
            Upload
          </UButton>
        </div>
      </div>
    </UCard>

    <div class="flex justify-end pt-4">
      <UButton
        size="lg"
        color="primary"
        class="px-10"
      >
        Ajukan Permintaan Operasi
      </UButton>
    </div>
  </div>
</template>
