<template>
  <input class="form-control" type="text" :placeholder="placeholder" v-model="searchTerm" @input="throttledSearch">
</template>

<script>
import { debounce } from 'lodash';

export default {
  props: {
    placeholder: {
      default: 'Search'
    }
  },
  data() {
    return {
      searchTerm: ''
    };
  },
  methods: {
    throttledSearch: debounce(function () {
      this.$emit('search', this.searchTerm);
    }, 1000)
  }
};
</script>
