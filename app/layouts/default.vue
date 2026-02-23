<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const handleLogout = () => router.push('/login')

const mainRef = ref<HTMLElement | null>(null)
const showButton = ref(false)

const handleScroll = () => {
  if (!mainRef.value) return
  showButton.value = mainRef.value.scrollTop > 200
}

const scrollToTop = () => {
  mainRef.value?.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  mainRef.value?.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  mainRef.value?.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- ROOT LOCKED -->
  <div class="h-screen overflow-hidden bg-gray-50 flex">
    <!-- SIDEBAR -->
    <AppSidebar @logout="handleLogout" />

    <!-- CONTENT WRAPPER -->
    <div class="flex-1 flex flex-col">
      <!-- STICKY HEADER -->
      <div class="shrink-0 shadow-sm bg-white z-20">
        <AppHeader
          title="Dashboard"
          subtitle="Monitoring & Sistem Informasi"
        />
      </div>

      <!-- SCROLL AREA -->
      <main
        ref="mainRef"
        class="flex-1 overflow-auto px-6 py-6"
      >
        <slot />
      </main>
    </div>

    <!-- FLOATING BACK TO TOP -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-12 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-12 scale-95"
    >
      <div
        v-if="showButton"
        class="fixed bottom-6 right-6 z-50"
      >
        <UButton
          color="primary"
          variant="solid"
          size="lg"
          square
          class="rounded-full shadow-lg hover:shadow-xl transition-all"
          @click="scrollToTop"
        >
          <Icon
            name="heroicons:arrow-up-20-solid"
            class="w-5 h-5"
          />
        </UButton>
      </div>
    </transition>
  </div>
</template>
