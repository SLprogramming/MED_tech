<template>
  <div class="mb-3">
    <label :for="id" class="form-label">{{ label }}</label>
    <template v-if="name">
      <input v-bind="$attrs" :type="type" :value="modelValue" class="form-control" :id="id" :placeholder="placeholder" @input="this.$emit('update:modelValue', $event.target.value)">
    </template>
    <template v-else>
      <input v-bind="$attrs" :type="type" :value="modelValue" :name="name" class="form-control" :id="id" :placeholder="placeholder" @input="this.$emit('update:modelValue', $event.target.value)">
    </template>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'Input',
  props: {
    label: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
    },
    name: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const id = ref(`input-${Math.random().toString(36).substr(2, 9)}`);

    return {
      id,
    };
  },
};
</script>
