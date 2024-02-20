<template>
  <button :disabled="loading" class="btn btn-primary" v-bind="$attrs">
    <template v-if="loading">
      <div class="d-flex align-items-center justify-content-center gap-3">
        <Spinner />
        <span>
          {{ name }}
        </span>
      </div>
    </template>
    <template v-else>
      {{ name }}
    </template>
  </button>
</template>

<script setup>
import Spinner from './Spinner.vue';

defineProps(['loading', 'name'])
</script>

<style lang="scss" scoped></style>