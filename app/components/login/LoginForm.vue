<script setup lang="ts">
import hefori from '@/assets/img/hefori-icon.png'

const emit = defineEmits<{
  submit: [data: { email: string, password: string }]
}>()

const formData = reactive({
  email: '',
  password: ''
})

// Toggle password visibility
const showPassword = ref(false)

const handleSubmit = () => {
  emit('submit', { ...formData })
}
</script>

<template>
  <div
    class="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950"
  >
    <div class="w-full max-w-md">
      <!-- Mobile Logo -->
      <div class="lg:hidden flex flex-col items-center justify-center mb-8">
        <img
          :src="hefori"
          alt="logo"
          class="w-14 h-14 object-contain drop-shadow-lg"
        >

        <h1 class="text-2xl font-bold mt-2 tracking-wide">
          <span class="text-yellow-500">HEF</span>
          <span class="text-gray-900 dark:text-white">ORI</span>
        </h1>
      </div>

      <UCard class="shadow-xl border-0">
        <template #header>
          <div class="space-y-1">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
              Selamat Datang
            </h2>
            <p class="text-gray-500 dark:text-gray-400 text-sm">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>
        </template>

        <UForm
          :state="formData"
          class="space-y-4"
          @submit="handleSubmit"
        >
          <UFormField
            label="NIP/NIPTT-PK/NIM"
            name="Username"
            required
          >
            <UInput
              v-model="formData.email"
              type="text"
              placeholder="NIP/NIPTT-PK/NIM"
              icon="i-lucide-user"
              size="lg"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Password"
            name="password"
            required
          >
            <div class="relative">
              <UInput
                v-model="formData.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                icon="i-lucide-lock"
                size="lg"
                class="w-full"
                :ui="{ base: 'pr-12' }"
              />
              <UButton
                color="neutral"
                variant="ghost"
                size="xs"
                :icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                class="absolute right-2 top-1/2 -translate-y-1/2"
                @click="showPassword = !showPassword"
              />
            </div>
          </UFormField>

          <UButton
            type="submit"
            color="primary"
            size="lg"
            block
            class="font-medium"
          >
            Masuk
          </UButton>
        </UForm>

        <template #footer>
          <div class="text-center text-sm text-gray-500 dark:text-gray-400">
            Gunakan NIP/NIPTT-PK/NIM dan password untuk masuk
          </div>
        </template>
      </UCard>

      <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
        © 2026 Hefori. All rights reserved.
      </p>
    </div>
  </div>
</template>
