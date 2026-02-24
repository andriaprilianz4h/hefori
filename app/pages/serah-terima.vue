<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

// State untuk mengontrol tampilan fase
const currentPhase = ref<'mutasi' | 'timbang_terima'>('mutasi')

// ==================== FASE 1: MUTASI IRNA KE OK ====================
const patientData = ref({
  name: 'Ahmad Wijaya',
  mrn: 'MRN001234',
  age: 45,
  gender: 'Laki-laki',
  diagnosis: 'Appendicitis Akut',
  procedure: 'Laparoscopic Appendectomy',
  surgeon: 'Dr. Budi Santoso, Sp.B',
  anesthesiologist: 'Dr. Siti Rahayu, Sp.An',
  roomFrom: 'Melati 3A / Bed 12',
  date: '2024-01-20',
  timeIn: '08:00 WIB',
  timeOut: null as string | null,
  status: 'Menunggu Verifikasi'
})

// Checklist Mutasi IRNA ke OK (T1-T2)
const mutasiChecklist = ref([
  {
    id: 1,
    category: 'Dokumen',
    label: 'Informed Consent Operasi telah ditandatangani',
    checked: false,
    requierror: true
  },
  {
    id: 2,
    category: 'Dokumen',
    label: 'Informed Consent Anestesi telah ditandatangani',
    checked: false,
    requierror: true
  },
  {
    id: 3,
    category: 'Dokumen',
    label: 'Asesmen Pra-Bedah lengkap dan terbaru',
    checked: false,
    requierror: true
  },
  {
    id: 4,
    category: 'Dokumen',
    label: 'Digital Marker Site terverifikasi (Tandai Lokasi Operasi)',
    checked: false,
    requierror: true
  },
  {
    id: 5,
    category: 'Dokumen',
    label: 'Hasil Laboratorium (≤ 7 hari untuk elektif)',
    checked: false,
    requierror: true
  },
  {
    id: 6,
    category: 'Dokumen',
    label: 'Hasil Imaging (Rontgen/CT/MRI) tersedia',
    checked: false,
    requierror: true
  },
  {
    id: 7,
    category: 'Dokumen',
    label: 'EKG (untuk pasien > 40 th atau riwayat jantung)',
    checked: false,
    requierror: false
  },
  {
    id: 8,
    category: 'Persiapan',
    label: 'Puasa minimal 6-8 jam (solid & cairan jernih)',
    checked: false,
    requierror: true
  },
  {
    id: 9,
    category: 'Persiapan',
    label: 'Cukur & pencucian area operasi (jika diperlukan)',
    checked: false,
    requierror: false
  },
  {
    id: 10,
    category: 'Persiapan',
    label: 'Gelang identitas pasien terpasang & terbaca',
    checked: false,
    requierror: true
  },
  {
    id: 11,
    category: 'Persiapan',
    label: 'Prothesa/gigi palsu/alat bantu dilepas',
    checked: false,
    requierror: true
  },
  {
    id: 12,
    category: 'Persiapan',
    label: 'Perhiasan & benda berharga telah diamankan',
    checked: false,
    requierror: true
  },
  {
    id: 13,
    category: 'Medis',
    label: 'Cairan infus terpasang (access IV paten)',
    checked: false,
    requierror: true
  },
  {
    id: 14,
    category: 'Medis',
    label: 'Premedikasi diberikan (jika diindikasikan)',
    checked: false,
    requierror: false
  },
  {
    id: 15,
    category: 'Medis',
    label: 'Riwayat alergi telah dikonfirmasi',
    checked: false,
    requierror: true
  }
])

// Status logistik
const logistics = ref([
  {
    id: 'blood',
    icon: 'i-heroicons-beaker',
    title: 'Ketersediaan Darah',
    status: 'available',
    description: '4 kantong PRC tersedia (crossmatch done)',
    color: 'emerald'
  },
  {
    id: 'pharmacy',
    icon: 'i-heroicons-capsule',
    title: 'Farmasi & Obat',
    status: 'available',
    description: 'Semua item tersedia di OK',
    color: 'emerald'
  },
  {
    id: 'equipment',
    icon: 'i-heroicons-cube',
    title: 'Alat Medis',
    status: 'warning',
    description: 'Laparoscope set - pending sterilisasi',
    color: 'amber'
  },
  {
    id: 'icu',
    icon: 'i-heroicons-building-office',
    title: 'Slot ICU/HCU',
    status: 'available',
    description: '2 bed ICU tersedia (backup)',
    color: 'emerald'
  }
])

// ==================== FASE 2: TIMBANG TERIMA PERAWAT ====================
const handoverData = ref({
  perawatPengirim: 'Ns. Rina Wulandari, S.Kep',
  perawatPenerima: 'Ns. Agus Pratama, S.Kep',
  ruanganPengirim: 'IRNA Melati 3A',
  ruanganPenerima: 'OK - Ruang Operasi 2',
  waktuSerahTerima: null as string | null
})

// Checklist Timbang Terima (T3) - SBAR format
const timbangTerimaChecklist = ref([
  {
    id: 's1',
    category: 'Situation',
    label: 'Identitas pasien diverifikasi (nama, TTL, MRN)',
    checked: false,
    critical: true
  },
  {
    id: 's2',
    category: 'Situation',
    label: 'Tindakan/prosedur yang akan dilakukan dikonfirmasi',
    checked: false,
    critical: true
  },
  {
    id: 'b1',
    category: 'Background',
    label: 'Diagnosis dan riwayat medis disampaikan',
    checked: false,
    critical: true
  },
  {
    id: 'b2',
    category: 'Background',
    label: 'Hasil lab dan penunjang terbaru diinformasikan',
    checked: false,
    critical: false
  },
  {
    id: 'b3',
    category: 'Background',
    label: 'Riwayat alergi dan reaksi obat dikomunikasikan',
    checked: false,
    critical: true
  },
  {
    id: 'a1',
    category: 'Assessment',
    label: 'Status vital terkini (TD, Nadi, RR, Suhu, SpO2)',
    checked: false,
    critical: true
  },
  {
    id: 'a2',
    category: 'Assessment',
    label: 'Status gizi dan puasa dikonfirmasi',
    checked: false,
    critical: true
  },
  {
    id: 'a3',
    category: 'Assessment',
    label: 'Tingkat nyeri dan skornya diinformasikan',
    checked: false,
    critical: false
  },
  {
    id: 'r1',
    category: 'Recommendation',
    label: 'Kebutuhan khusus selama operasi disampaikan',
    checked: false,
    critical: false
  },
  {
    id: 'r2',
    category: 'Recommendation',
    label: 'Posisi operasi dan perluasan area steril dikonfirmasi',
    checked: false,
    critical: true
  },
  {
    id: 'r3',
    category: 'Recommendation',
    label: 'Implan/protes yang akan digunakan disiapkan',
    checked: false,
    critical: false
  }
])

// Barang bawaan pasien
const patientBelongings = ref([
  {
    id: 1,
    item: 'Gelang Identitas',
    jumlah: 1,
    keterangan: 'Terpasang di pergelangan tangan',
    ada: true
  },
  {
    id: 2,
    item: 'Catatan Medis / Berkas',
    jumlah: 1,
    keterangan: 'Lengkap dengan hasil lab',
    ada: true
  },
  {
    id: 3,
    item: 'Obat-obatan pribadi',
    jumlah: 2,
    keterangan: 'Antihipertensi & DM',
    ada: true
  },
  {
    id: 4,
    item: 'Alat bantu dengar',
    jumlah: 1,
    keterangan: 'Telah dilepas, disimpan di ruangan',
    ada: false
  },
  {
    id: 5,
    item: 'Gigi palsu',
    jumlah: 1,
    keterangan: 'Telah dilepas',
    ada: false
  },
  {
    id: 6,
    item: 'Perhiasan',
    jumlah: 0,
    keterangan: 'Diamankan keluarga',
    ada: false
  }
])

// ==================== COMPUTED & METHODS ====================
const allMutasiChecked = computed(() => {
  return mutasiChecklist.value
    .filter(item => item.requierror)
    .every(item => item.checked)
})

const allTimbangTerimaChecked = computed(() => {
  return timbangTerimaChecklist.value
    .filter(item => item.critical)
    .every(item => item.checked)
})

const progressMutasi = computed(() => {
  const requierror = mutasiChecklist.value.filter(i => i.requierror).length
  const checked = mutasiChecklist.value.filter(
    i => i.requierror && i.checked
  ).length
  return Math.round((checked / requierror) * 100)
})

const progressTimbangTerima = computed(() => {
  const critical = timbangTerimaChecklist.value.filter(
    i => i.critical
  ).length
  const checked = timbangTerimaChecklist.value.filter(
    i => i.critical && i.checked
  ).length
  return Math.round((checked / critical) * 100)
})

const resetMutasi = () => {
  mutasiChecklist.value.forEach(item => (item.checked = false))
}

const resetTimbangTerima = () => {
  timbangTerimaChecklist.value.forEach(item => (item.checked = false))
}

const completeMutasi = () => {
  if (!allMutasiChecked.value) {
    alert('Harap checklist semua item wajib terlebih dahulu')
    return
  }
  patientData.value.timeOut
    = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB'
  patientData.value.status = 'Siap Transfer ke OK'
  currentPhase.value = 'timbang_terima'
  handoverData.value.waktuSerahTerima = new Date().toLocaleString('id-ID')
}

const completeHandover = () => {
  if (!allTimbangTerimaChecked.value) {
    alert('Harap checklist semua item kritis terlebih dahulu')
    return
  }
  patientData.value.status = 'Serah Terima Selesai'
  alert(
    'Serah terima perawat berhasil diselesaikan! Pasien siap masuk ruang operasi.'
  )
}

const goBack = () => {
  currentPhase.value = 'mutasi'
}
</script>

<template>
  <div
    class="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 p-6 space-y-6"
  >
    <!-- Header Progress -->

    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
          :class="
            currentPhase === 'mutasi'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-emerald-500 text-white'
          "
        >
          1
        </div>
        <div class="hidden sm:block">
          <p class="text-sm font-medium text-gray-500">
            Fase 1
          </p>
          <p class="font-semibold text-gray-900">
            Mutasi IRNA → OK
          </p>
        </div>
      </div>

      <div class="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-linear-to-r from-blue-500 to-emerald-500 transition-all duration-500"
          :style="{ width: currentPhase === 'mutasi' ? '50%' : '100%' }"
        />
      </div>

      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
          :class="
            currentPhase === 'timbang_terima'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
              : 'bg-gray-300 text-gray-500'
          "
        >
          2
        </div>
        <div class="hidden sm:block text-right">
          <p class="text-sm font-medium text-gray-500">
            Fase 2
          </p>
          <p class="font-semibold text-gray-900">
            Timbang Terima
          </p>
        </div>
      </div>
    </div>

    <!-- ==================== FASE 1: MUTASI IRNA KE OK ==================== -->
    <div
      v-if="currentPhase === 'mutasi'"
      class="space-y-6 animate-fade-in"
    >
      <!-- Patient Info Card -->
      <UCard class="rounded-2xl shadow-lg border-0 overflow-hidden">
        <div
          class="absolute top-0 left-0 w-full h-1 bg-linear-to-rrom-blue-500 to-cyan-400"
        />
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl"
            >
              🏥
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900 mb-1">
                {{ patientData.name }}
              </h1>
              <div
                class="flex flex-wrap items-center gap-2 text-sm text-gray-600"
              >
                <span class="px-2 py-1 bg-gray-100 rounded-md font-mono">{{
                  patientData.mrn
                }}</span>
                <span>•</span>
                <span>{{ patientData.age }} th, {{ patientData.gender }}</span>
                <span>•</span>
                <span class="text-blue-600 font-medium">{{
                  patientData.procedure
                }}</span>
              </div>
              <div class="mt-2 flex items-center gap-4 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  <UIcon
                    name="i-heroicons-user-circle"
                    class="w-4 h-4"
                  />
                  {{ patientData.surgeon }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon
                    name="i-heroicons-heart"
                    class="w-4 h-4"
                  />
                  {{ patientData.anesthesiologist }}
                </span>
              </div>
            </div>
          </div>
          <div class="text-right space-y-2">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium"
            >
              <UIcon
                name="i-heroicons-map-pin"
                class="w-4 h-4"
              />
              {{ patientData.roomFrom }}
            </div>
            <div class="text-sm text-gray-500">
              <p class="font-medium text-gray-900">
                {{ patientData.date }}
              </p>
              <p>Mulai: {{ patientData.timeIn }}</p>
              <p v-if="patientData.timeOut">
                Selesai: {{ patientData.timeOut }}
              </p>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Progress Bar -->
      <div class="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div class="flex-1">
          <div class="flex justify-between text-sm mb-2">
            <span class="font-medium text-gray-700">Progress Kelengkapan (Wajib)</span>
            <span class="font-bold text-blue-600">{{ progressMutasi }}%</span>
          </div>
          <UProgress
            :value="progressMutasi"
            color="primary"
            size="lg"
          />
        </div>
        <UBadge
          :color="
            patientData.status === 'Terverifikasi' ? 'success' : 'warning'
          "
          variant="soft"
          size="lg"
          class="whitespace-nowrap"
        >
          {{ patientData.status }}
        </UBadge>
      </div>

      <!-- Checklist Mutasi -->
      <UCard class="rounded-2xl shadow-lg border-0">
        <template #header>
          <div class="flex items-center justify-between py-2">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-clipboard-document-check"
                  class="w-5 h-5 text-indigo-600"
                />
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">
                  Checklist Mutasi IRNA → OK
                </h2>
                <p class="text-sm text-gray-500">
                  Tahap T1-T2: Verifikasi kelengkapan pra-operasi
                </p>
              </div>
            </div>
            <UButton
              variant="ghost"
              color="neutral"
              size="sm"
              @click="resetMutasi"
            >
              Reset
            </UButton>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Group by Category -->
          <div
            v-for="category in ['Dokumen', 'Persiapan', 'Medis']"
            :key="category"
            class="space-y-3"
          >
            <h3
              class="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"
            >
              <span class="w-2 h-2 rounded-full bg-gray-300" />
              {{ category }}
            </h3>

            <div class="space-y-2">
              <div
                v-for="item in mutasiChecklist.filter(
                  (i) => i.category === category
                )"
                :key="item.id"
                class="group flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md"
                :class="[
                  item.checked
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-gray-100 hover:border-blue-200',
                  item.requierror && !item.checked
                    ? 'border-l-4 border-l-amber-400'
                    : ''
                ]"
                @click="item.checked = !item.checked"
              >
                <div
                  class="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 mt-0.5"
                  :class="
                    item.checked
                      ? 'bg-emerald-500 scale-110'
                      : 'bg-gray-200 group-hover:bg-blue-200'
                  "
                >
                  <UIcon
                    v-if="item.checked"
                    name="i-heroicons-check"
                    class="w-4 h-4 text-white"
                  />
                </div>

                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <span
                      class="text-sm font-medium transition-colors"
                      :class="
                        item.checked
                          ? 'text-emerald-800 line-through opacity-70'
                          : 'text-gray-700'
                      "
                    >
                      {{ item.label }}
                    </span>
                    <UBadge
                      v-if="item.requierror"
                      color="warning"
                      variant="soft"
                      size="xs"
                      class="scale-90"
                    >
                      Wajib
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Footer -->
        <template #footer>
          <div class="flex justify-end gap-3 py-2">
            <UButton
              variant="soft"
              color="neutral"
              size="lg"
              @click="resetMutasi"
            >
              Reset Checklist
            </UButton>
            <UButton
              color="primary"
              size="lg"
              class="gap-2 shadow-lg shadow-blue-200"
              :disabled="!allMutasiChecked"
              @click="completeMutasi"
            >
              <UIcon
                name="i-heroicons-arrow-right-circle"
                class="w-5 h-5"
              />
              Lanjut ke Timbang Terima
            </UButton>
          </div>
        </template>
      </UCard>

      <!-- Logistics Status -->
      <UCard
        class="rounded-2xl shadow-lg border-0 bg-linear-to-br from-white to-gray-50"
      >
        <template #header>
          <div class="flex items-center gap-3 py-2">
            <div
              class="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-cube-transparent"
                class="w-5 h-5 text-purple-600"
              />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">
                Status Logistik & Ketersediaan
              </h2>
              <p class="text-sm text-gray-500">
                Monitoring ketersediaan sumber daya
              </p>
            </div>
          </div>
        </template>

        <div class="grid md:grid-cols-2 gap-4">
          <div
            v-for="item in logistics"
            :key="item.id"
            class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md"
            :class="
              item.status === 'available'
                ? 'bg-emerald-50/30 border-emerald-100'
                : 'bg-amber-50/30 border-amber-100'
            "
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
              :class="
                item.color === 'emerald'
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-amber-100 text-amber-600'
              "
            >
              <UIcon
                :name="item.icon"
                class="w-6 h-6"
              />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-semibold text-gray-900">
                  {{ item.title }}
                </h3>
                <UIcon
                  :name="
                    item.status === 'available'
                      ? 'i-heroicons-check-circle'
                      : 'i-heroicons-exclamation-triangle'
                  "
                  :class="
                    item.color === 'emerald'
                      ? 'text-emerald-500'
                      : 'text-amber-500'
                  "
                  class="w-5 h-5"
                />
              </div>
              <p class="text-sm text-gray-600">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>

        <div
          class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3"
        >
          <UIcon
            name="i-heroicons-information-circle"
            class="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
          />
          <div class="text-sm text-blue-800">
            <p class="font-semibold mb-1">
              Catatan Penting:
            </p>
            <p>
              Semua logistik harus tersedia sebelum pasien dapat dipindahkan ke
              area OK. Jika ada keterlambatan logistik, segera hubungi
              koordinator OK.
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- ==================== FASE 2: TIMBANG TERIMA PERAWAT ==================== -->
    <div
      v-else
      class="space-y-6 animate-fade-in"
    >
      <!-- Handover Header -->
      <UCard
        class="rounded-2xl shadow-lg border-0 overflow-hidden bg-linear-to-rrom-emerald-50 to-teal-50"
      >
        <div
          class="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-emerald-500 to-teal-400"
        />
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <div class="flex items-center gap-2 mb-2">
              <UBadge
                color="success"
                variant="soft"
                size="sm"
              >
                Fase 2
              </UBadge>
              <span class="text-sm text-emerald-700 font-medium">Timbang Terima Perawat</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900">
              Serah Terima Tanggung Jawab Pasien
            </h1>
            <p class="text-gray-600 mt-1">
              Dari Ruang Rawat Inap ke Instalasi Bedah Sentral
            </p>
          </div>
          <UButton
            variant="ghost"
            color="neutral"
            @click="goBack"
          >
            <UIcon
              name="i-heroicons-arrow-left"
              class="w-4 h-4 mr-1"
            />
            Kembali
          </UButton>
        </div>
      </UCard>

      <!-- Nurse Info Cards -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Pengirim -->
        <UCard
          class="rounded-2xl shadow-md border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-arrow-up-circle"
                class="w-7 h-7 text-blue-600"
              />
            </div>
            <div>
              <p
                class="text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                Perawat Pengirim
              </p>
              <h3 class="font-bold text-gray-900">
                {{ handoverData.perawatPengirim }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ handoverData.ruanganPengirim }}
              </p>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">Waktu Serah</span>
              <span class="font-medium text-gray-900">{{
                handoverData.waktuSerahTerima || "-"
              }}</span>
            </div>
          </div>
        </UCard>

        <!-- Penerima -->
        <UCard
          class="rounded-2xl shadow-md border-2 border-dashed border-gray-200 hover:border-emerald-300 transition-colors"
        >
          <div class="flex items-center gap-4 mb-4">
            <div
              class="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-arrow-down-circle"
                class="w-7 h-7 text-emerald-600"
              />
            </div>
            <div>
              <p
                class="text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                Perawat Penerima (OK)
              </p>
              <h3 class="font-bold text-gray-900">
                {{ handoverData.perawatPenerima }}
              </h3>
              <p class="text-sm text-gray-500">
                {{ handoverData.ruanganPenerima }}
              </p>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-500">Status</span>
              <UBadge
                color="warning"
                variant="soft"
                size="sm"
              >
                Menunggu Konfirmasi
              </UBadge>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Progress -->
      <div class="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4">
        <div class="flex-1">
          <div class="flex justify-between text-sm mb-2">
            <span class="font-medium text-gray-700">Progress SBAR (Kritis)</span>
            <span class="font-bold text-emerald-600">{{ progressTimbangTerima }}%</span>
          </div>
          <UProgress
            :value="progressTimbangTerima"
            color="success"
            size="lg"
          />
        </div>
      </div>

      <!-- SBAR Checklist -->
      <UCard class="rounded-2xl shadow-lg border-0">
        <template #header>
          <div class="flex items-center justify-between py-2">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center"
              >
                <UIcon
                  name="i-heroicons-chat-bubble-left-right"
                  class="w-5 h-5 text-teal-600"
                />
              </div>
              <div>
                <h2 class="text-lg font-bold text-gray-900">
                  Komunikasi SBAR
                </h2>
                <p class="text-sm text-gray-500">
                  Situation - Background - Assessment - Recommendation
                </p>
              </div>
            </div>
          </div>
        </template>

        <div class="space-y-6">
          <div
            v-for="category in [
              'Situation',
              'Background',
              'Assessment',
              'Recommendation'
            ]"
            :key="category"
            class="space-y-3"
          >
            <div class="flex items-center gap-2">
              <span
                class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                :class="{
                  'bg-error-100 text-error-700': category === 'Situation',
                  'bg-orange-100 text-orange-700': category === 'Background',
                  'bg-blue-100 text-blue-700': category === 'Assessment',
                  'bg-purple-100 text-purple-700':
                    category === 'Recommendation'
                }"
              >
                {{ category }}
              </span>
              <div class="flex-1 h-px bg-gray-200" />
            </div>

            <div class="space-y-2 ml-4">
              <div
                v-for="item in timbangTerimaChecklist.filter(
                  (i) => i.category === category
                )"
                :key="item.id"
                class="group flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer"
                :class="[
                  item.checked
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-gray-100 hover:border-gray-300',
                  item.critical ? 'border-l-4 border-l-error-400' : ''
                ]"
                @click="item.checked = !item.checked"
              >
                <div
                  class="w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 shrink-0 mt-0.5"
                  :class="
                    item.checked
                      ? 'bg-emerald-500 scale-110'
                      : 'bg-gray-200 group-hover:bg-gray-300'
                  "
                >
                  <UIcon
                    v-if="item.checked"
                    name="i-heroicons-check"
                    class="w-4 h-4 text-white"
                  />
                </div>

                <div class="flex-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span
                      class="text-sm font-medium transition-colors"
                      :class="
                        item.checked
                          ? 'text-emerald-800 line-through opacity-70'
                          : 'text-gray-700'
                      "
                    >
                      {{ item.label }}
                    </span>
                    <UBadge
                      v-if="item.critical"
                      color="error"
                      variant="soft"
                      size="xs"
                    >
                      Kritis
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Barang Bawaan -->
      <UCard class="rounded-2xl shadow-lg border-0">
        <template #header>
          <div class="flex items-center gap-3 py-2">
            <div
              class="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"
            >
              <UIcon
                name="i-heroicons-shopping-bag"
                class="w-5 h-5 text-amber-600"
              />
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-900">
                Barang Bawaan Pasien
              </h2>
              <p class="text-sm text-gray-500">
                Verifikasi barang yang ikut/meninggal di ruangan
              </p>
            </div>
          </div>
        </template>

        <div class="overflow-hidden rounded-xl border border-gray-200">
          <table class="w-full text-sm">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left font-semibold text-gray-700">
                  Item
                </th>
                <th
                  class="px-4 py-3 text-center font-semibold text-gray-700 w-24"
                >
                  Jumlah
                </th>
                <th class="px-4 py-3 text-left font-semibold text-gray-700">
                  Keterangan
                </th>
                <th
                  class="px-4 py-3 text-center font-semibold text-gray-700 w-32"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="item in patientBelongings"
                :key="item.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 font-medium text-gray-900">
                  {{ item.item }}
                </td>
                <td class="px-4 py-3 text-center text-gray-600">
                  {{ item.jumlah }}
                </td>
                <td class="px-4 py-3 text-gray-600">
                  {{ item.keterangan }}
                </td>
                <td class="px-4 py-3 text-center">
                  <UBadge
                    :color="item.ada ? 'success' : 'neutral'"
                    variant="soft"
                    size="sm"
                  >
                    {{ item.ada ? "Ikut" : "Tinggal" }}
                  </UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>

      <!-- Final Actions -->
      <UCard
        class="rounded-2xl shadow-lg border-0 bg-linear-to-r from-emerald-50 to-teal-50"
      >
        <div
          class="flex flex-col md:flex-row justify-between items-center gap-4 p-2"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm"
            >
              <UIcon
                name="i-heroicons-shield-check"
                class="w-6 h-6 text-emerald-600"
              />
            </div>
            <div>
              <h3 class="font-bold text-gray-900">
                Siap untuk Operasi?
              </h3>
              <p class="text-sm text-gray-600">
                Pastikan semua checklist kritis telah diverifikasi
              </p>
            </div>
          </div>
          <div class="flex gap-3">
            <UButton
              variant="soft"
              color="neutral"
              size="lg"
              @click="resetTimbangTerima"
            >
              Reset
            </UButton>
            <UButton
              color="success"
              size="lg"
              class="gap-2 shadow-lg shadow-success-200"
              :disabled="!allTimbangTerimaChecked"
              @click="completeHandover"
            >
              <UIcon
                name="i-heroicons-check-badge"
                class="w-5 h-5"
              />
              Selesaikan Serah Terima
            </UButton>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
