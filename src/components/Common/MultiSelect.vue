<template>
  <div class="mb-3">
    <label class="form-label">Skin Care & Cosmetic</label>
    <div class="d-flex gap-3">
      <VueMultiselect :model-value="selectedOption" @update:model-value="updateSelectedOption" :options="props.options"
        :searchable="true" :close-on-select="false" :allow-empty="false" :option-height="31" label="item"
        placeholder="Select Items" track-by="item" />
      <button @click="addSelectedOptions" type="button" class="btn btn-primary">
        <i class="bi bi-plus-lg"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import VueMultiselect from "vue-multiselect";
import { ref } from 'vue';

const props = defineProps(['props'])

const selectedOption = ref({})
const selectedOptions = ref({})

const updateSelectedOption = (e) => {
  selectedOption.value = { ...e }
}

const addSelectedOptions = (e) => {
  selectedOptions.value.push(e)
}
</script>

<style lang="scss" scoped></style>