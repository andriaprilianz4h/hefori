<script setup lang="ts">
/* =========================
   FULLCALENDAR
========================= */
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventDropArg, EventResizeDoneArg } from '@fullcalendar/core'

definePageMeta({
  layout: 'default',
  title: 'Manajemen IBP'
})

/* =========================
   TYPE
========================= */

interface IBPEvent {
  id: number
  title: string
  start: string | Date
  end: string | Date
  ruang: string
  color: string
  pasien?: string
  operator?: string
}

/* =========================
   DATA
========================= */

const ruangOptions = [
  { label: 'OK 1', value: 'ok-1', color: '#3b82f6' },
  { label: 'OK 2', value: 'ok-2', color: '#10b981' },
  { label: 'OK 3', value: 'ok-3', color: '#f59e0b' },
  { label: 'OK 4', value: 'ok-4', color: '#ef4444' },
  { label: 'OK 5', value: 'ok-5', color: '#8b5cf6' }
]

/* =========================
   STATE
========================= */

const form = reactive({
  ruang: '',
  tanggalMulai: '',
  tanggalSelesai: '',
  pasien: '',
  operator: ''
})

const events = ref<IBPEvent[]>([])
const selectedEvent = ref<IBPEvent | null>(null)
const isEditMode = ref(false)

/* =========================
   COMPUTED
========================= */

const getRuangColor = (ruang: string) => {
  const ruangData = ruangOptions.find(r => r.value === ruang)
  return ruangData?.color || '#6366f1'
}

const getRuangLabel = (ruangValue: string) => {
  const ruang = ruangOptions.find(r => r.value === ruangValue)
  return ruang?.label || ruangValue
}

const hasConflict = computed(() => {
  if (!form.ruang || !form.tanggalMulai || !form.tanggalSelesai) return false

  const start = new Date(form.tanggalMulai).getTime()
  const end = new Date(form.tanggalSelesai).getTime()

  return events.value.some((e) => {
    if (e.ruang !== form.ruang) return false
    if (isEditMode.value && e.id === selectedEvent.value?.id) return false

    const eventStart = new Date(e.start).getTime()
    const eventEnd = new Date(e.end).getTime()

    return (
      (start >= eventStart && start < eventEnd)
      || (end > eventStart && end <= eventEnd)
      || (start <= eventStart && end >= eventEnd)
    )
  })
})

const eventsByRuang = computed(() => {
  const grouped: Record<string, IBPEvent[]> = {}
  ruangOptions.forEach((r) => {
    grouped[r.value] = events.value.filter(e => e.ruang === r.value)
  })
  return grouped
})

/* =========================
   METHODS
========================= */

const snapTo30Minutes = (date: Date) => {
  const minutes = date.getMinutes()
  const snappedMinutes = Math.round(minutes / 30) * 30
  date.setMinutes(snappedMinutes)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

const formatDateTime = (date: string | Date) => {
  const d = new Date(date)
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const resetForm = () => {
  form.ruang = ''
  form.tanggalMulai = ''
  form.tanggalSelesai = ''
  form.pasien = ''
  form.operator = ''
  isEditMode.value = false
  selectedEvent.value = null
}

const tambahJadwal = () => {
  if (!form.ruang || !form.tanggalMulai || !form.tanggalSelesai) {
    alert('Lengkapi data jadwal!')
    return
  }

  if (hasConflict.value) {
    alert('⚠ Jadwal bentrok dengan ruang lain!')
    return
  }

  const start = snapTo30Minutes(new Date(form.tanggalMulai))
  const end = snapTo30Minutes(new Date(form.tanggalSelesai))

  if (start >= end) {
    alert('Waktu selesai harus lebih besar dari waktu mulai!')
    return
  }

  events.value.push({
    id: Date.now(),
    title: `${getRuangLabel(form.ruang)} - ${form.pasien || 'Sesi Operasi'}`,
    start,
    end,
    ruang: form.ruang,
    color: getRuangColor(form.ruang),
    pasien: form.pasien,
    operator: form.operator
  })

  resetForm()
}

const editEvent = (event: IBPEvent) => {
  selectedEvent.value = event
  form.ruang = event.ruang
  form.tanggalMulai = new Date(event.start).toISOString().slice(0, 16)
  form.tanggalSelesai = new Date(event.end).toISOString().slice(0, 16)
  form.pasien = event.pasien || ''
  form.operator = event.operator || ''
  isEditMode.value = true

  // Scroll to form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const updateJadwal = () => {
  if (!selectedEvent.value) return

  if (hasConflict.value) {
    alert('⚠ Jadwal bentrok!')
    return
  }

  const start = snapTo30Minutes(new Date(form.tanggalMulai))
  const end = snapTo30Minutes(new Date(form.tanggalSelesai))

  const index = events.value.findIndex(e => e.id === selectedEvent.value!.id)
  if (index !== -1) {
    events.value[index] = {
      ...selectedEvent.value,
      title: `${getRuangLabel(form.ruang)} - ${form.pasien || 'Sesi Operasi'}`,
      start,
      end,
      ruang: form.ruang,
      color: getRuangColor(form.ruang),
      pasien: form.pasien,
      operator: form.operator
    }
  }

  resetForm()
}

const hapusEvent = (id: number) => {
  if (confirm('Yakin ingin menghapus jadwal ini?')) {
    events.value = events.value.filter(e => e.id !== id)
    if (selectedEvent.value?.id === id) {
      resetForm()
    }
  }
}

/* =========================
   CALENDAR HANDLERS
========================= */

const handleEventDrop = (info: EventDropArg) => {
  const event = events.value.find(e => e.id === Number(info.event.id))
  if (event && info.event.start && info.event.end) {
    event.start = info.event.start
    event.end = info.event.end
  }
}

const handleEventResize = (info: EventResizeDoneArg) => {
  const event = events.value.find(e => e.id === Number(info.event.id))
  if (event && info.event.start && info.event.end) {
    event.start = info.event.start
    event.end = info.event.end
  }
}

const handleEventClick = (info: any) => {
  const event = events.value.find(e => e.id === Number(info.event.id))
  if (event) {
    editEvent(event)
  }
}

/* =========================
   LIFECYCLE
========================= */

// Set default datetime-local ke waktu sekarang
onMounted(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - (now.getMinutes() % 30))
  const defaultStart = now.toISOString().slice(0, 16)

  now.setHours(now.getHours() + 2)
  const defaultEnd = now.toISOString().slice(0, 16)

  form.tanggalMulai = defaultStart
  form.tanggalSelesai = defaultEnd
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- HEADER -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Manajemen Jadwal IBP
          </h1>
          <p class="text-sm text-gray-500 mt-1">
            Kelola jadwal operasi dan ketersediaan ruang OK
          </p>
        </div>
        <div class="flex gap-2">
          <UBadge
            v-for="ruang in ruangOptions"
            :key="ruang.value"
            :style="{ backgroundColor: ruang.color }"
            class="text-white"
          >
            {{ ruang.label }}
          </UBadge>
        </div>
      </div>

      <!-- FORM CARD -->
      <UCard class="rounded-2xl shadow-sm border-0">
        <div class="flex items-center gap-2 mb-4">
          <UIcon
            :name="
              isEditMode
                ? 'i-heroicons-pencil-square'
                : 'i-heroicons-plus-circle'
            "
            class="w-5 h-5 text-primary-500"
          />
          <h2 class="text-lg font-semibold">
            {{ isEditMode ? "Edit Jadwal" : "Tambah Jadwal Baru" }}
          </h2>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          <USelectMenu
            v-model="form.ruang"
            :items="ruangOptions"
            value-key="value"
            option-attribute="label"
            placeholder="Pilih Ruang OK"
            class="w-full"
          />

          <UInput
            v-model="form.pasien"
            placeholder="Nama Pasien"
            icon="i-heroicons-user"
          />

          <UInput
            v-model="form.operator"
            placeholder="Nama Operator"
            icon="i-heroicons-user-circle"
          />

          <UInput
            v-model="form.tanggalMulai"
            type="datetime-local"
            label="Mulai"
          />

          <UInput
            v-model="form.tanggalSelesai"
            type="datetime-local"
            label="Selesai"
          />
        </div>

        <div class="mt-4 flex items-center justify-between">
          <div
            v-if="hasConflict"
            class="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg"
          >
            <UIcon
              name="i-heroicons-exclamation-triangle"
              class="w-5 h-5"
            />
            <span class="font-medium text-sm">Terjadi Konflik Jadwal</span>
          </div>
          <div
            v-else
            class="text-sm text-gray-500"
          >
            * Jadwal akan di-snap ke 30 menit terdekat
          </div>

          <div class="flex gap-2">
            <UButton
              v-if="isEditMode"
              variant="soft"
              color="neutral"
              @click="resetForm"
            >
              Batal
            </UButton>
            <UButton
              v-if="isEditMode"
              color="primary"
              @click="updateJadwal"
            >
              Update Jadwal
            </UButton>
            <UButton
              v-else
              color="primary"
              icon="i-heroicons-plus"
              @click="tambahJadwal"
            >
              Tambah Jadwal
            </UButton>
          </div>
        </div>
      </UCard>

      <!-- MAIN CONTENT GRID -->
      <div class="grid lg:grid-cols-3 gap-6">
        <!-- CALENDAR -->
        <UCard class="rounded-2xl shadow-sm border-0 lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold flex items-center gap-2">
              <UIcon
                name="i-heroicons-calendar-days"
                class="w-5 h-5 text-primary-500"
              />
              Timeline Operasi
            </h2>
            <div class="flex gap-2">
              <UButton
                size="sm"
                variant="soft"
                color="neutral"
                @click="events = []"
              >
                Reset All
              </UButton>
            </div>
          </div>

          <div class="fc-theme-standard">
            <FullCalendar
              :plugins="[dayGridPlugin, timeGridPlugin, interactionPlugin]"
              initial-view="timeGridWeek"
              :events="events"
              :editable="true"
              :selectable="true"
              :event-resizable-from-start="true"
              :header-toolbar="{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }"
              :slot-duration="'00:30:00'"
              :slot-min-time="'06:00:00'"
              :slot-max-time="'22:00:00'"
              :all-day-slot="false"
              :height="'auto'"
              @event-drop="handleEventDrop"
              @event-resize="handleEventResize"
              @event-click="handleEventClick"
            />
          </div>
        </UCard>

        <!-- SIDEBAR: LIST & STATS -->
        <div class="space-y-6">
          <!-- STATS -->
          <UCard class="rounded-2xl shadow-sm border-0">
            <h3
              class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider"
            >
              Ringkasan
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-primary-50 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-primary-600">
                  {{ events.length }}
                </div>
                <div class="text-xs text-primary-700 mt-1">
                  Total Jadwal
                </div>
              </div>
              <div class="bg-emerald-50 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-emerald-600">
                  {{ ruangOptions.length }}
                </div>
                <div class="text-xs text-emerald-700 mt-1">
                  Ruang OK
                </div>
              </div>
            </div>
          </UCard>

          <!-- UPCOMING LIST -->
          <UCard class="rounded-2xl shadow-sm border-0">
            <h3
              class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider flex items-center gap-2"
            >
              <UIcon
                name="i-heroicons-list-bullet"
                class="w-4 h-4"
              />
              Daftar Jadwal
            </h3>

            <div
              v-if="events.length === 0"
              class="text-center py-8 text-gray-400"
            >
              <UIcon
                name="i-heroicons-inbox"
                class="w-12 h-12 mx-auto mb-2 opacity-50"
              />
              <p class="text-sm">
                Belum ada jadwal
              </p>
            </div>

            <div
              v-else
              class="space-y-3 max-h-96 overflow-y-auto pr-2"
            >
              <div
                v-for="event in [...events].sort(
                  (a, b) =>
                    new Date(a.start).getTime() - new Date(b.start).getTime()
                )"
                :key="event.id"
                class="group relative p-4 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all cursor-pointer"
                :class="{
                  'ring-2 ring-primary-500': selectedEvent?.id === event.id
                }"
                :style="{
                  borderLeftWidth: '4px',
                  borderLeftColor: event.color
                }"
                @click="editEvent(event)"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <UBadge
                        :style="{ backgroundColor: event.color }"
                        class="text-white text-xs"
                      >
                        {{ getRuangLabel(event.ruang) }}
                      </UBadge>
                      <span
                        v-if="event.pasien"
                        class="font-medium text-gray-900 truncate"
                      >
                        {{ event.pasien }}
                      </span>
                    </div>
                    <div class="text-xs text-gray-500 space-y-1">
                      <div class="flex items-center gap-1">
                        <UIcon
                          name="i-heroicons-clock"
                          class="w-3 h-3"
                        />
                        {{ formatDateTime(event.start) }}
                      </div>
                      <div
                        v-if="event.operator"
                        class="flex items-center gap-1"
                      >
                        <UIcon
                          name="i-heroicons-user"
                          class="w-3 h-3"
                        />
                        {{ event.operator }}
                      </div>
                    </div>
                  </div>
                  <UButton
                    size="xs"
                    color="error"
                    variant="ghost"
                    icon="i-heroicons-trash"
                    class="opacity-0 group-hover:opacity-100 transition-opacity"
                    @click.stop="hapusEvent(event.id)"
                  />
                </div>
              </div>
            </div>
          </UCard>

          <!-- RUANG AVAILABILITY -->
          <UCard class="rounded-2xl shadow-sm border-0">
            <h3
              class="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider"
            >
              Ketersediaan Ruang
            </h3>
            <div class="space-y-3">
              <div
                v-for="ruang in ruangOptions"
                :key="ruang.value"
                class="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: ruang.color }"
                  />
                  <span class="text-sm font-medium">{{ ruang.label }}</span>
                </div>
                <UBadge
                  variant="soft"
                  :color="
                    eventsByRuang[ruang.value]?.length > 0 ? 'primary' : 'neutral'
                  "
                >
                  {{ eventsByRuang[ruang.value]?.length || 0 }} jadwal
                </UBadge>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.fc) {
  font-family: inherit;
}

:deep(.fc-event) {
  border-radius: 6px;
  border: none;
  font-size: 0.85rem;
  padding: 2px 4px;
}

:deep(.fc-timegrid-slot) {
  height: 40px !important;
}

:deep(.fc-button-primary) {
  background-color: rgb(var(--color-primary-500));
  border-color: rgb(var(--color-primary-500));
}

:deep(.fc-button-primary:hover) {
  background-color: rgb(var(--color-primary-600));
  border-color: rgb(var(--color-primary-600));
}

:deep(.fc-button-active) {
  background-color: rgb(var(--color-primary-700)) !important;
  border-color: rgb(var(--color-primary-700)) !important;
}
</style>
