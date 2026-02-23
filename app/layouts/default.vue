<script setup lang="ts">
const router = useRouter()
const handleLogout = () => router.push('/login')
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex">
    <AppSidebar @logout="handleLogout" />

    <div class="flex-1 flex flex-col lg:ml-0">
      <AppHeader
        title="Dashboard"
        subtitle="Monitoring & Sistem Informasi"
      />

      <main class="flex-1 overflow-auto px-1 py-1">
        <slot />
      </main>
    </div>
  </div>
</template>
