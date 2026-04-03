<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import { useSessionsStore } from '@/stores/sessions'

const route = useRoute()
const sessionsStore = useSessionsStore()
const sidebarOpen = ref(false)

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false
  },
)

onMounted(() => {
  sessionsStore.loadAll()
})
</script>

<template>
  <div class="app-shell">
    <div
      v-if="sidebarOpen"
      class="app-shell__overlay"
      @click="sidebarOpen = false"
    />

    <AppSidebar
      :open="sidebarOpen"
      @close="sidebarOpen = false"
    />

    <div class="app-shell__body">
      <AppTopbar @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="app-shell__main">
        <RouterView v-slot="{ Component, route: activeRoute }">
          <Transition name="page-fade-slide" mode="out-in">
            <component :is="Component" :key="activeRoute.fullPath" />
          </Transition>
        </RouterView>
      </main>
    </div>

    <ToastContainer />
  </div>
</template>
