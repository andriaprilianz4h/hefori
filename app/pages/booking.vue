<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

interface BookingForm {
  mrn: string
  ksm: string
  dokter: string
  prosedur: string
  estimasi: number
  tanggal: string
  catatan: string
}

const form = reactive<BookingForm>({
  mrn: '',
  ksm: '',
  dokter: '',
  prosedur: '',
  estimasi: 2,
  tanggal: '',
  catatan: ''
})

const ksmOptions = [
  { label: 'Bedah Umum', value: 'bedah-umum' },
  {
    label: 'Bedah Toraks, Kardiak dan Vaskular',
    value: 'bedah-toraks-kardiak-vaskular'
  },
  { label: 'Radioterapi', value: 'radioterapi' },
  {
    label: 'Bedah Plastik Rekonstruksi dan Estetik',
    value: 'bedah-plastik-rekonstruksi-estetik'
  },
  { label: 'Bedah Syaraf', value: 'bedah-syaraf' },
  { label: 'Orthopedi dan Traumatologi', value: 'orthopedi-traumatologi' },
  { label: 'Urologi', value: 'urologi' },
  { label: 'Obstetri Ginekologi', value: 'obstetri-ginekologi' },
  { label: 'Ilmu Kesehatan Anak', value: 'ilmu-kesehatan-anak' },
  { label: 'Penyakit Dalam', value: 'penyakit-dalam' },
  {
    label: 'Kardiologi dan Kedokteran Vaskular',
    value: 'kardiologi-kedokteran-vaskular'
  },
  {
    label: 'Pulmonologi dan Ilmu Kedokteran Respirasi',
    value: 'pulmonologi-kedokteran-respirasi'
  },
  { label: 'Ilmu Kesehatan Mata', value: 'ilmu-kesehatan-mata' },
  { label: 'THT-KL', value: 'tht-kl' },
  { label: 'Kesehatan Kulit dan Kelamin', value: 'kulit-dan-kelamin' },
  { label: 'Neurologi', value: 'neurologi' },
  { label: 'Andrologi', value: 'andrologi' },
  { label: 'Kedokteran Jiwa', value: 'kedokteran-jiwa' },
  { label: 'Mikrobiologi Klinik', value: 'mikrobiologi-klinik' },
  { label: 'Radiologi', value: 'radiologi' },
  { label: 'Kesehatan Gigi dan Mulut', value: 'kesehatan-gigi-mulut' },
  { label: 'Patologi Klinik', value: 'patologi-klinik' },
  { label: 'Patologi Anatomi', value: 'patologi-anatomi' },
  { label: 'Anestesiologi dan Reanimasi', value: 'anestesiologi-reanimasi' },
  { label: 'Dokter Umum', value: 'dokter-umum' },
  {
    label: 'Kedokteran Fisik dan Rehabilitasi',
    value: 'kedokteran-fisik-rehabilitasi'
  },
  {
    label: 'Kedokteran Forensik dan Medikolegal',
    value: 'forensik-medikolegal'
  },
  { label: 'Paliatif', value: 'paliatif' }
]
const dokterByKsm: Record<string, { label: string, value: string }[]> = {
  'bedah-umum': [
    { label: 'Dr. Ahmad Sp.B', value: 'ahmad' },
    { label: 'Dr. Rina Sp.B', value: 'rina' }
  ],
  'bedah-toraks-kardiak-vaskular': [
    { label: 'Dr. Surya Sp.BTKV', value: 'surya' }
  ],
  'radioterapi': [{ label: 'Dr. Lestari Sp.Onk.Rad', value: 'lestari' }],
  'bedah-plastik-rekonstruksi-estetik': [
    { label: 'Dr. Maya Sp.BP-RE', value: 'maya' }
  ],
  'bedah-syaraf': [{ label: 'Dr. Andika Sp.BS', value: 'andika' }],
  'orthopedi-traumatologi': [{ label: 'Dr. Dedi Sp.OT', value: 'dedi' }],
  'urologi': [{ label: 'Dr. Fajar Sp.U', value: 'fajar' }],
  'obstetri-ginekologi': [{ label: 'Dr. Sinta Sp.OG', value: 'sinta' }],
  'ilmu-kesehatan-anak': [{ label: 'Dr. Rudi Sp.A', value: 'rudi' }],
  'penyakit-dalam': [{ label: 'Dr. Hasan Sp.PD', value: 'hasan' }],
  'kardiologi-kedokteran-vaskular': [
    { label: 'Dr. Taufik Sp.JP', value: 'taufik' }
  ],
  'pulmonologi-kedokteran-respirasi': [
    { label: 'Dr. Dimas Sp.P', value: 'dimas' }
  ],
  'ilmu-kesehatan-mata': [{ label: 'Dr. Yuli Sp.M', value: 'yuli' }],
  'tht-kl': [{ label: 'Dr. Bagus Sp.THT-KL', value: 'bagus' }],
  'kulit-dan-kelamin': [{ label: 'Dr. Nita Sp.KK', value: 'nita' }],
  'neurologi': [{ label: 'Dr. Bima Sp.N', value: 'bima' }],
  'andrologi': [{ label: 'Dr. Yoga Sp.And', value: 'yoga' }],
  'kedokteran-jiwa': [{ label: 'Dr. Rani Sp.KJ', value: 'rani' }],
  'mikrobiologi-klinik': [{ label: 'Dr. Anton Sp.MK', value: 'anton' }],
  'radiologi': [{ label: 'Dr. Fina Sp.Rad', value: 'fina' }],
  'kesehatan-gigi-mulut': [{ label: 'Dr. Aldi Sp.KG', value: 'aldi' }],
  'patologi-klinik': [{ label: 'Dr. Sari Sp.PK', value: 'sari' }],
  'patologi-anatomi': [{ label: 'Dr. Dewa Sp.PA', value: 'dewa' }],
  'anestesiologi-reanimasi': [{ label: 'Dr. Putra Sp.An', value: 'putra' }],
  'dokter-umum': [{ label: 'Dr. Lina', value: 'lina' }],
  'kedokteran-fisik-rehabilitasi': [
    { label: 'Dr. Joko Sp.KFR', value: 'joko' }
  ],
  'forensik-medikolegal': [{ label: 'Dr. Rizal Sp.FM', value: 'rizal' }],
  'paliatif': [{ label: 'Dr. Eva Sp.Paliatif', value: 'eva' }]
}

/* =======================
   COMPUTED DOKTER
======================= */
const dokterOptions = computed(() => {
  return dokterByKsm[form.ksm] || []
})

/* Reset dokter jika KSM berubah */
watch(
  () => form.ksm,
  () => {
    form.dokter = ''
  }
)
/* ================= UPLOAD STATE ================= */

// FIX: Use definite assignment assertion or ensure keys exist
const files = ref<Record<string, File[]>>({
  mrs: [],
  rto: [],
  penunjang: []
})

const previewFile = ref<string | null>(null)
const activePreview = ref<File | null>(null)

/* ================= HANDLER ================= */

const handleFile = (event: Event, key: string) => {
  const target = event.target as HTMLInputElement
  if (!target.files) return

  // FIX: Use non-null assertion since we know the key exists in our files object
  files.value[key]!.push(...Array.from(target.files))
  target.value = ''
}

const removeFile = (key: string, index: number) => {
  // FIX: Use non-null assertion since we know the key exists
  files.value[key]!.splice(index, 1)
}

const openPreview = (file: File) => {
  previewFile.value = URL.createObjectURL(file)
  activePreview.value = file
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6 space-y-6">
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
      :ui="{ header: 'border-0 pb-6' }"
    >
      <template #header>
        <h2 class="text-xl font-bold">
          Detail Permintaan Operasi
        </h2>
      </template>

      <div class="grid md:grid-cols-6 gap-4 -mt-4">
        <!-- BARIS 1 -->
        <div class="md:col-span-3">
          <UFormField
            label="KSM"
            name="ksm"
            required
          >
            <USelectMenu
              v-model="form.ksm"
              :items="ksmOptions"
              value-key="value"
              option-attribute="label"
              searchable
              placeholder="Pilih KSM"
              class="w-full"
              size="lg"
            />
          </UFormField>
        </div>

        <div class="md:col-span-3">
          <UFormField
            label="Dokter Operator *"
            name="dokter"
            :ui="{ label: 'text-sm font-medium text-gray-700 mb-0.5' }"
          >
            <USelectMenu
              v-model="form.dokter"
              :items="dokterOptions"
              value-key="value"
              option-attribute="label"
              searchable
              placeholder="Pilih Dokter"
              size="lg"
              class="w-full"
              :disabled="!form.ksm"
            />
          </UFormField>
        </div>

        <!-- BARIS 2 -->
        <div class="md:col-span-2">
          <UFormField
            label="Jenis Prosedur *"
            name="prosedur"
            :ui="{ label: 'text-sm font-medium text-gray-700 mb-0.5' }"
          >
            <UInput
              v-model="form.prosedur"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="md:col-span-2">
          <UFormField
            label="Estimasi Waktu (jam) *"
            name="estimasi"
            :ui="{ label: 'text-sm font-medium text-gray-700 mb-0.5' }"
          >
            <UInput
              v-model="form.estimasi"
              type="number"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="md:col-span-2">
          <UFormField
            label="Tanggal Preferensi"
            name="tanggal"
            :ui="{ label: 'text-sm font-medium text-gray-700 mb-0.5' }"
          >
            <UInput
              v-model="form.tanggal"
              type="date"
              size="lg"
              class="w-full"
            />
          </UFormField>
        </div>

        <!-- BARIS 3 -->
        <div class="md:col-span-6">
          <UFormField
            label="Catatan Khusus"
            name="catatan"
            :ui="{ label: 'text-sm font-medium text-gray-700 mb-0.5' }"
          >
            <UTextarea
              v-model="form.catatan"
              :rows="4"
              size="lg"
              class="w-full"
            />
          </UFormField>
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
        <div
          v-for="doc in [
            { label: 'Surat MRS *', key: 'mrs' },
            { label: 'Surat RTO *', key: 'rto' },
            { label: 'Hasil Penunjang', key: 'penunjang' }
          ]"
          :key="doc.key"
          class="rounded-xl p-6 border-2 border-dashed border-gray-300 hover:border-primary-500 transition bg-gray-50"
        >
          <div class="text-center">
            <UIcon
              name="i-heroicons-cloud-arrow-up"
              class="w-10 h-10 text-primary-500 mb-3"
            />

            <p class="font-medium mb-3">
              {{ doc.label }}
            </p>

            <label>
              <UButton
                size="sm"
                variant="soft"
                as="span"
              > Pilih File </UButton>

              <input
                type="file"
                multiple
                class="hidden"
                @change="handleFile($event, doc.key)"
              >
            </label>

            <!-- FILE LIST -->
            <div v-if="activePreview?.type?.includes('image')">
              class="mt-4 space-y-2 text-sm" >
              <div
                v-for="(file, index) in files[doc.key]"
                :key="index"
                class="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm"
              >
                <span class="truncate max-w-37.5">
                  {{ file.name }}
                </span>

                <div class="flex gap-2">
                  <UButton
                    size="sm"
                    variant="soft"
                    color="primary"
                    @click="openPreview(file)"
                  >
                    Preview
                  </UButton>

                  <UButton
                    size="sm"
                    variant="soft"
                    color="error"
                    @click="removeFile(doc.key, index)"
                  >
                    ✕
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PREVIEW MODAL -->
      <!-- PREVIEW MODAL -->
      <UModal v-model="previewFile">
        <div class="p-4">
          <!-- FIX: Use double optional chaining ?.?. or check existence first -->
          <template v-if="activePreview?.type?.includes('image')">
            <img
              v-if="previewFile"
              :src="previewFile"
              class="w-full rounded-xl"
            >
          </template>

          <template v-else>
            <iframe
              v-if="previewFile"
              :src="previewFile"
              class="w-full h-125 rounded-xl"
            />
          </template>
        </div>
      </UModal>
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
