import VueApexCharts from 'vue3-apexcharts'

export default defineNuxtPlugin((nuxtApp) => {
  // Daftarkan komponen global
  nuxtApp.vueApp.component('ApexChart', VueApexCharts)
})
