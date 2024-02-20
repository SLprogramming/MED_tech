<script setup>
import { RouterView } from 'vue-router'
import Sidenav from '@/components/Layout/Sidenav.vue';
import Topnav from '@/components/Layout/Topnav.vue';
import Footer from '@/components/Layout/Footer.vue';
import { useAppStore } from '@/stores/app';

const appStore = useAppStore()

</script>

<template>
  <header>
  </header>
  <div style="background-color: #f6f8f9">
    <div class="d-flex gap-3">
      <div class="d-print-none bg-primary sidebar" :class="{ 'nav-on': appStore.sidebar, 'nav-off': !appStore.sidebar }">
        <Sidenav></Sidenav>
      </div>
      <div class="w-100 overflow-hidden pe-3" :class="{ '': appStore.sidebar, '': !appStore.sidebar }">
        <div class="d-flex flex-column min-vh-100">
          <div class="d-print-none d-flex align-items-center justify-content-between gap-3">
            <div class="">
              <button class="btn btn-primary shadow border h-100" @click="appStore.toggleSidebar"><i class="bi bi-border-width"></i></button>
            </div>
            <Topnav class="w-100" />
          </div>
          <main>
            <RouterView />
          </main>
          <Footer class="d-print-none" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-on {
  width: 220px;
}

.nav-off {
  width: 0;
}

.sidebar {
  transition: all 0.5s ease;
  overflow: hidden;
  padding: 0;
  flex-shrink: 0;
}

.push-left {
  margin-left: 220px;
}
</style>