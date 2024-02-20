<template>
  <div>
    <div>
      <div class="card p-3">
        <slot name="header"></slot>
        <div class="table-responsive">
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped></style>