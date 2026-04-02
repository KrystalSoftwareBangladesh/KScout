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

<style scoped>
.app-shell {
  position: relative;
  display: grid;
  min-height: 100vh;
  grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
}

.app-shell__body {
  min-width: 0;
}

.app-shell__main {
  height: calc(100vh - var(--topbar-h));
  overflow-y: auto;
  padding: var(--space-6);
}

.app-shell__overlay {
  position: fixed;
  inset: 0;
  z-index: 30;
  background: rgba(2, 8, 12, 0.7);
  backdrop-filter: blur(6px);
}

@media (max-width: 767px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .app-shell__main {
    padding: var(--space-4);
  }
}
</style>
