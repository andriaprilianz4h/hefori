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

interface Submenu {
  name: string
  icon: string
  to: string
}

interface Menu {
  name: string
  icon: string
  to: string
  submenu?: Submenu[]
}

const menus: Menu[] = [
  { name: 'Dashboard', icon: 'fas fa-home', to: '/dashboard' },
  {
    name: 'Finish Goods',
    icon: 'fas fa-box',
    to: '#',
    submenu: [
      {
        name: 'Goods Receive',
        icon: 'fas fa-box-open',
        to: '/finish-goods/goods-receive'
      },
      {
        name: 'Work In Progress',
        icon: 'fas fa-cogs',
        to: '/finish-goods/wip'
      },
      {
        name: 'Finished Products',
        icon: 'fas fa-check',
        to: '/finish-goods/finished-products'
      }
    ]
  },
  { name: 'Reports', icon: 'fas fa-chart-bar', to: '/reports' },
  { name: 'Settings', icon: 'fas fa-cog', to: '/settings' }
]

const currentPath = computed(() => route.path)
const openSubmenu = ref<string>('')

watch(
  () => route.path,
  (newPath) => {
    const activeMenu = menus.find(menu =>
      menu.submenu?.some(sub => newPath.startsWith(sub.to))
    )
    openSubmenu.value = activeMenu ? activeMenu.name : ''
    if (isMobile.value) isMobileOpen.value = false
  },
  { immediate: true }
)

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

function toggleSubmenu(name: string) {
  openSubmenu.value = openSubmenu.value === name ? '' : name
}

function isActiveMenu(item: Menu): boolean {
  if (item.submenu) {
    return item.submenu.some(sub => currentPath.value.startsWith(sub.to))
  }
  return currentPath.value.startsWith(item.to)
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
          PRO<span class="text-green-600">CIS</span>
        </h1>

        <button
          class="bg-green-600 hover:bg-green-700 text-white p-2 rounded-xl transition border-none outline-none focus:outline-none focus:ring-0"
          @click="toggleSidebar"
        >
          <i class="fas fa-bars" />
        </button>
      </div>

      <!-- Menu -->
      <nav class="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
        <div
          v-for="item in menus"
          :key="item.name"
        >
          <!-- WITHOUT SUBMENU -->
          <NuxtLink
            v-if="!item.submenu"
            :to="item.to"
            :class="[
              'relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
              isCollapsed ? 'lg:justify-center' : '',
              isActiveMenu(item)
                ? 'bg-green-50 text-green-700 font-medium'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
            ]"
          >
            <!-- Left Indicator -->
            <div
              v-if="isActiveMenu(item)"
              class="absolute left-0 top-2 bottom-2 w-1 bg-green-600 rounded-r"
            />

            <i
              :class="[
                item.icon,
                isActiveMenu(item)
                  ? 'text-green-600'
                  : 'group-hover:text-green-600'
              ]"
              class="text-lg"
            />

            <span
              :class="[
                'whitespace-nowrap transition-all duration-300',
                isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : ''
              ]"
            >
              {{ item.name }}
            </span>
          </NuxtLink>

          <!-- WITH SUBMENU -->
          <div v-else>
            <button
              :class="[
                'relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
                isCollapsed ? 'lg:justify-center' : '',
                isActiveMenu(item)
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
              ]"
              @click="toggleSubmenu(item.name)"
            >
              <div
                v-if="isActiveMenu(item)"
                class="absolute left-0 top-2 bottom-2 w-1 bg-green-600 rounded-r"
              />

              <i
                :class="[
                  item.icon,
                  isActiveMenu(item)
                    ? 'text-green-600'
                    : 'group-hover:text-green-600'
                ]"
                class="text-lg"
              />

              <span
                :class="[
                  'whitespace-nowrap transition-all duration-300',
                  isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : ''
                ]"
              >
                {{ item.name }}
              </span>

              <i
                v-if="!isCollapsed || isMobile"
                class="fas fa-chevron-right ml-auto text-xs transition-transform duration-200"
                :class="openSubmenu === item.name ? 'rotate-90' : ''"
              />
            </button>

            <!-- Submenu -->
            <Transition name="slide-down">
              <div
                v-if="item.submenu && openSubmenu === item.name"
                :class="[
                  'mt-1 space-y-1 border-l border-gray-200 pl-4',
                  isCollapsed ? 'lg:hidden' : 'ml-4'
                ]"
              >
                <NuxtLink
                  v-for="sub in item.submenu"
                  :key="sub.name"
                  :to="sub.to"
                  :class="[
                    'flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm',
                    currentPath.startsWith(sub.to)
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                  ]"
                >
                  <i :class="sub.icon" />
                  {{ sub.name }}
                </NuxtLink>
              </div>
            </Transition>
          </div>
        </div>
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
            A
          </div>

          <div
            :class="[
              'flex-1 min-w-0 transition-all duration-300',
              isCollapsed ? 'lg:opacity-0 lg:w-0 lg:overflow-hidden' : ''
            ]"
          >
            <p class="font-medium truncate text-gray-800">
              Admin User
            </p>
            <p class="text-xs text-gray-400 truncate">
              admin@procis.com
            </p>
          </div>

          <button
            :class="[
              'hover:text-green-600 transition',
              isCollapsed ? 'lg:hidden' : ''
            ]"
          >
            <i class="fas fa-sign-out-alt" />
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

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
