<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside, useWindowSize } from '@vueuse/core'

const searchQuery = ref('')
const showNotifications = ref(false)
const showProfile = ref(false)
const showMobileSearch = ref(false)

// State untuk mobile sidebar (shared dengan Sidebar)
const isMobileOpen = useState<boolean>('sidebarMobileOpen', () => false)

// ===== @vueuse/core: Window Size =====
const { width } = useWindowSize()

// Reactive breakpoint check
const isMobile = computed(() => width.value < 1024)

const notifications = [
  { id: 1, title: 'New order received', time: '5 min ago', unread: true },
  { id: 2, title: 'Production completed', time: '1 hour ago', unread: true },
  { id: 3, title: 'System maintenance', time: '2 hours ago', unread: false }
]

const unreadCount = computed(
  () => notifications.filter(n => n.unread).length
)

// ===== @vueuse/core: Click Outside =====
const notifDropdownRef = ref<HTMLElement | null>(null)
const profileDropdownRef = ref<HTMLElement | null>(null)

onClickOutside(notifDropdownRef, () => {
  showNotifications.value = false
})

onClickOutside(profileDropdownRef, () => {
  showProfile.value = false
})

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  showProfile.value = false
}

function toggleProfile() {
  showProfile.value = !showProfile.value
  showNotifications.value = false
}

function toggleMobileSidebar() {
  isMobileOpen.value = !isMobileOpen.value
}

function toggleMobileSearch() {
  showMobileSearch.value = !showMobileSearch.value
}
</script>

<template>
  <header
    class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30"
  >
    <!-- Left -->
    <div class="flex items-center gap-3 lg:gap-4">
      <button
        class="lg:hidden p-2 text-gray-500 hover:bg-green-50 rounded-xl transition-colors"
        @click="toggleMobileSidebar"
      >
        <i class="fas fa-bars text-lg" />
      </button>

      <span class="lg:hidden text-lg font-bold text-gray-800">
        PRO<span class="text-green-600">CIS</span>
      </span>
    </div>

    <!-- Right -->
    <div class="flex items-center gap-2 lg:gap-4">
      <!-- Mobile Search -->
      <button
        class="md:hidden p-2 text-gray-500 hover:bg-green-50 rounded-xl transition-colors"
        @click="toggleMobileSearch"
      >
        <i class="fas fa-search text-lg" />
      </button>

      <!-- Desktop Search -->
      <div class="relative hidden md:block">
        <i
          class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 w-48 lg:w-64 transition-all"
        >
      </div>

      <!-- Notifications -->
      <div
        ref="notifDropdownRef"
        class="relative"
      >
        <button
          class="relative p-2 text-gray-500 hover:bg-green-50 rounded-xl transition-colors"
          @click="toggleNotifications"
        >
          <i class="fas fa-bell text-lg" />
          <span
            v-if="unreadCount > 0"
            class="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
          >
            {{ unreadCount }}
          </span>
        </button>

        <div
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
          :class="isMobile ? 'fixed right-4 top-14' : ''"
        >
          <div
            class="p-4 border-b border-gray-100 flex items-center justify-between"
          >
            <h3 class="font-semibold text-gray-800">
              Notifications
            </h3>
            <button class="text-sm text-green-600 hover:text-green-700">
              Mark all read
            </button>
          </div>

          <div class="max-h-64 overflow-y-auto">
            <div
              v-for="notif in notifications"
              :key="notif.id"
              :class="[
                'p-4 border-b border-gray-50 hover:bg-green-50 transition-colors cursor-pointer',
                notif.unread ? 'bg-green-50/50' : ''
              ]"
            >
              <div class="flex items-start gap-3">
                <div
                  :class="[
                    'w-2 h-2 rounded-full mt-2',
                    notif.unread ? 'bg-green-600' : 'bg-gray-300'
                  ]"
                />
                <div class="flex-1">
                  <p
                    :class="[
                      'text-sm',
                      notif.unread
                        ? 'font-medium text-gray-800'
                        : 'text-gray-600'
                    ]"
                  >
                    {{ notif.title }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    {{ notif.time }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Profile -->
      <div
        ref="profileDropdownRef"
        class="relative"
      >
        <button
          class="flex items-center gap-2 lg:gap-3 hover:bg-green-50 rounded-xl p-1.5 lg:p-2 transition-colors"
          @click="toggleProfile"
        >
          <div
            class="w-8 h-8 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold"
          >
            A
          </div>

          <div class="hidden md:block text-left">
            <p class="text-sm font-medium text-gray-700">
              Admin User
            </p>
            <p class="text-xs text-gray-500 hidden lg:block">
              Administrator
            </p>
          </div>

          <i
            class="fas fa-chevron-down text-gray-400 text-xs hidden lg:block"
          />
        </button>

        <div
          v-if="showProfile"
          class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
          :class="isMobile ? 'fixed right-4 top-14' : ''"
        >
          <div class="p-2">
            <NuxtLink
              to="/profile"
              class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-green-50 transition-colors"
            >
              <i class="fas fa-user text-gray-400" />
              <span>Profile</span>
            </NuxtLink>

            <NuxtLink
              to="/settings"
              class="flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-green-50 transition-colors"
            >
              <i class="fas fa-cog text-gray-400" />
              <span>Settings</span>
            </NuxtLink>

            <hr class="my-2 border-gray-100">

            <button
              class="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <i class="fas fa-sign-out-alt" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- Mobile Search Bar -->
  <div
    v-if="showMobileSearch"
    class="fixed top-16 left-0 right-0 bg-white border-b border-slate-200 p-4 z-20 md:hidden"
  >
    <div class="relative">
      <i
        class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search..."
        class="w-full pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
        autofocus
      >
      <button
        class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        @click="showMobileSearch = false"
      >
        <i class="fas fa-times" />
      </button>
    </div>
  </div>
</template>
