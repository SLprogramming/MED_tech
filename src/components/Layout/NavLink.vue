<template>
  <router-link :to="{name: payload.url}" class="text-white d-inline-flex text-decoration-none p-2 rounded cus-nav-link">{{ payload.name }}</router-link>
</template>

<script setup>
defineProps(['payload'])
</script>

<style lang="scss" scoped>
.cus-nav-link:hover {
  background-color: rgba(255, 255, 255, 0.5);
}
</style>