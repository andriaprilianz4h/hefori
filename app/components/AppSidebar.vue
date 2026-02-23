<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { onClickOutside, useWindowSize, useStorage } from '@vueuse/core'

const route = useRoute()

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 1024)

const isCollapsed = useStorage('sidebar-collapsed', false)
const isMobileOpen = useState<boolean>('sidebarMobileOpen', () => false)

watch(isMobile, (mobile) => {
  if (!mobile) isMobileOpen.value = false
})

interface Menu {
  name: string
  icon: string
  to: string
}

const menus: Menu[] = [
  { name: 'Dashboard', icon: 'heroicons:squares-2x2', to: '/dashboard' },
  { name: 'Booking', icon: 'heroicons:calendar-days', to: '/booking' },
  {
    name: 'Verifikasi Pra-Bedah',
    icon: 'heroicons:clipboard-document-check',
    to: '/verifikasi-pra-bedah'
  },
  {
    name: 'Manajemen IBP',
    icon: 'heroicons:building-office-2',
    to: '/manajemen-ibp'
  },
  {
    name: 'Serah Terima',
    icon: 'heroicons:arrows-right-left',
    to: '/serah-terima'
  },
  {
    name: 'Durante Operasi',
    icon: 'heroicons:plus-circle',
    to: '/durante-operasi'
  },
  { name: 'Laporan', icon: 'heroicons:document-text', to: '/laporan' }
]

const currentPath = computed(() => route.path)

function isActiveMenu(item: Menu): boolean {
  return currentPath.value.startsWith(item.to)
}

const sidebarRef = ref<HTMLElement | null>(null)

onClickOutside(sidebarRef, () => {
  if (isMobile.value && isMobileOpen.value) {
    isMobileOpen.value = false
  }
})

function toggleSidebar() {
  if (isMobile.value) {
    isMobileOpen.value = !isMobileOpen.value
  } else {
    isCollapsed.value = !isCollapsed.value
  }
}
</script>

<template>
  <div>
    <!-- Overlay Mobile -->
    <Transition name="fade">
      <div
        v-if="isMobileOpen && isMobile"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
        @click="isMobileOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      ref="sidebarRef"
      :class="[
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out h-screen fixed lg:sticky top-0 shrink-0 z-50',
        'lg:translate-x-0',
        isCollapsed ? 'lg:w-20' : 'lg:w-64',
        'w-72',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Header -->
      <div
        :class="[
          'h-16 flex items-center px-4 border-b border-gray-200',
          isCollapsed ? 'lg:justify-center' : 'justify-between'
        ]"
      >
        <h1
          :class="[
            'text-xl font-bold text-gray-800 transition-all duration-300',
            isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : ''
          ]"
        >
          OPTI<span class="text-green-600">MUM</span>
        </h1>

        <button
          class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl transition border-none outline-none focus:ring-0"
          @click="toggleSidebar"
        >
          <UIcon
            name="heroicons:bars-3"
            class="w-5 h-5"
          />
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
        <NuxtLink
          v-for="item in menus"
          :key="item.name"
          :to="item.to"
          :class="[
            'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
            isCollapsed ? 'lg:justify-center' : '',
            isActiveMenu(item)
              ? 'bg-green-50 text-green-700 font-medium'
              : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
          ]"
        >
          <!-- Left Active Indicator -->
          <div
            v-if="isActiveMenu(item)"
            class="absolute left-0 top-2 bottom-2 w-1 bg-green-600 rounded-r"
          />

          <!-- Icon -->
          <UIcon
            :name="item.icon"
            class="w-5 h-5"
            :class="
              isActiveMenu(item)
                ? 'text-green-600'
                : 'group-hover:text-green-600'
            "
          />

          <!-- Text -->
          <span
            :class="[
              'whitespace-nowrap transition-all duration-300',
              isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : ''
            ]"
          >
            {{ item.name }}
          </span>
        </NuxtLink>
      </nav>

      <!-- Footer -->
      <div class="p-4 border-t border-gray-200">
        <div
          :class="[
            'flex items-center gap-3 text-sm text-gray-600',
            isCollapsed ? 'lg:justify-center' : ''
          ]"
        >
          <div
            class="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold"
          >
            AA
          </div>

          <div
            :class="[
              'flex-1 min-w-0 transition-all duration-300',
              isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : ''
            ]"
          >
            <p class="font-medium truncate text-gray-800">
              Andri Aprilianzah
            </p>
            <p class="text-xs text-gray-400 truncate">
              Administrator
            </p>
          </div>

          <button
            :class="[
              'hover:text-green-600 transition',
              isCollapsed ? 'lg:hidden' : ''
            ]"
          >
            <UIcon
              name="heroicons:arrow-right-on-rectangle"
              class="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
