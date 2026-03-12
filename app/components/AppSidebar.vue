<script setup lang="ts">
import hefori from '@/assets/img/hefori-icon.png'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  onClickOutside,
  useWindowSize,
  useStorage,
  useDark,
  useToggle
} from '@vueuse/core'

const route = useRoute()
const { width } = useWindowSize()
const isMobile = computed(() => width.value < 1024)

// Sidebar state
const isCollapsed = useStorage('sidebar-collapsed', false)
const isMobileOpen = useState<boolean>('sidebarMobileOpen', () => false)

// Dark mode
const isDark = useDark()
const _toggleDark = useToggle(isDark)

// Auto close mobile sidebar
watch(isMobile, (mobile) => {
  if (!mobile) isMobileOpen.value = false
})

interface Menu {
  name: string
  icon: string
  to: string
}

// === MENU TERBARU SESUAI SARAN ===
const menus: Menu[] = [
  { name: 'Dashboard', icon: 'heroicons:squares-2x2', to: '/dashboard' },
  { name: 'Staff', icon: 'heroicons:user-group', to: '/staff' },
  { name: 'Devices', icon: 'heroicons:device-phone-mobile', to: '/devices' },
  {
    name: 'Health Alerts',
    icon: 'heroicons:exclamation-triangle',
    to: '/alerts'
  },
  { name: 'Reports', icon: 'heroicons:document-text', to: '/reports' },
  { name: 'Settings', icon: 'heroicons:cog-6-tooth', to: '/settings' }
]

const currentPath = computed(() => route.path)

function isActiveMenu(item: Menu): boolean {
  return currentPath.value.startsWith(item.to)
}

const sidebarRef = ref<HTMLElement | null>(null)
const emit = defineEmits(['logout'])

onClickOutside(sidebarRef, () => {
  if (isMobile.value && isMobileOpen.value) {
    isMobileOpen.value = false
  }
})

function toggleSidebar() {
  if (isMobile.value) isMobileOpen.value = !isMobileOpen.value
  else isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div>
    <!-- Overlay Mobile -->
    <Transition name="fade">
      <div
        v-if="isMobileOpen && isMobile"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40 lg:hidden"
        @click="isMobileOpen = false"
      />
    </Transition>

    <!-- Sidebar -->
    <aside
      ref="sidebarRef"
      :class="[
        'flex flex-col transition-all duration-500 ease-in-out h-screen fixed lg:sticky top-0 shrink-0 z-50',
        'bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl',
        'border-r border-gray-200/50 dark:border-slate-700/50',
        'shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-15px_rgba(0,0,0,0.5)]',
        'lg:translate-x-0',
        isCollapsed ? 'lg:w-20' : 'lg:w-72',
        'w-80',
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Header -->
      <div
        :class="[
          'h-16 flex items-center px-5 border-b border-gray-200/50 dark:border-slate-700/50',
          isCollapsed ? 'lg:justify-center' : 'justify-between'
        ]"
      >
        <div
          :class="[
            'flex items-center gap-3 transition-all duration-500',
            isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : ''
          ]"
        >
          <img
            :src="hefori"
            alt="Logo"
            class="w-10 h-10 object-contain drop-shadow-md"
          >
          <h1
            class="text-xl font-bold bg-linear-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
          >
            HEF<span class="text-green-500">ORI</span>
          </h1>
        </div>

        <button
          class="group relative p-2.5 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-green-100 dark:hover:bg-green-900/30 text-gray-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 border border-gray-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700/50"
          @click="toggleSidebar"
        >
          <UIcon
            name="heroicons:bars-3"
            class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
            :class="{ 'rotate-180': isCollapsed && !isMobile }"
          />
        </button>
      </div>

      <!-- Menu -->
      <nav
        class="flex-1 px-3 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent"
      >
        <NuxtLink
          v-for="(item, index) in menus"
          :key="item.name"
          :to="item.to"
          :class="[
            'relative flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all duration-300 group overflow-hidden',
            isCollapsed ? 'lg:justify-center' : '',
            isActiveMenu(item)
              ? 'bg-linear-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 dark:shadow-green-500/20 scale-[1.02]'
              : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/50 hover:text-gray-900 dark:hover:text-slate-200'
          ]"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <div
            v-if="!isActiveMenu(item)"
            class="absolute inset-0 bg-linear-to-r from-green-500/0 via-green-500/5 to-green-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"
          />
          <div
            v-if="isActiveMenu(item)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          />
          <div class="relative">
            <div
              v-if="isActiveMenu(item)"
              class="absolute inset-0 bg-white/30 blur-md rounded-full"
            />
            <UIcon
              :name="item.icon"
              class="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110"
              :class="
                isActiveMenu(item)
                  ? 'text-white'
                  : 'group-hover:text-green-500 dark:group-hover:text-green-400'
              "
            />
          </div>
          <span
            :class="[
              'relative z-10 font-medium whitespace-nowrap transition-all duration-500',
              isCollapsed
                ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden'
                : 'opacity-100'
            ]"
          >
            {{ item.name }}
          </span>
          <UIcon
            v-if="isActiveMenu(item) && !isCollapsed"
            name="heroicons:chevron-right"
            class="w-4 h-4 ml-auto opacity-70"
          />
        </NuxtLink>
      </nav>

      <!-- User & Logout -->
      <div
        class="p-4 mx-3 mb-3 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 dark:from-slate-800/50 dark:to-slate-900/50 border border-gray-200/50 dark:border-slate-700/50 backdrop-blur-sm"
      >
        <div
          :class="[
            'flex items-center gap-3',
            isCollapsed ? 'lg:justify-center' : ''
          ]"
        >
          <div class="relative group">
            <div
              class="absolute inset-0 bg-green-500 blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"
            />
            <div
              class="relative w-10 h-10 rounded-full bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white dark:ring-slate-800"
            >
              AA
            </div>
            <div
              class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"
            />
          </div>
          <div
            :class="[
              'flex-1 min-w-0 transition-all duration-500',
              isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : ''
            ]"
          >
            <p
              class="font-semibold text-sm text-gray-800 dark:text-slate-200 truncate"
            >
              Andri Aprilianzah
            </p>
            <p
              class="text-xs text-green-600 dark:text-green-400 font-medium truncate"
            >
              Administrator
            </p>
          </div>
          <button
            :class="[
              'p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300',
              isCollapsed ? 'lg:hidden' : ''
            ]"
            @click="emit('logout')"
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
.scrollbar-thin::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
}
.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(71, 85, 105, 0.5);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
nav {
  scroll-behavior: smooth;
}
::selection {
  background-color: rgba(34, 197, 94, 0.2);
  color: inherit;
}
</style>
