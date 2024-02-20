<template>
  <template v-if="isLoading">
    <Loading />
  </template>
  <template v-else>
    <div>
      <MasterTable>
        <template #header>
          <Heading :payload="{ title: 'Brand' }" />
        </template>
        <template #body>
          <table class="table table-borderless table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(brand, index) in brands">
                <td>{{ index + 1 }}</td>
                <td>{{ brand.code }}</td>
                <td>{{ brand.name }}</td>
                <td>{{ brand.category?.name }}</td>
                <td>{{ brand.subCategory?.name }}</td>
                <td>{{ brand.description }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </MasterTable>
    </div>
  </template>
</template>

<script setup>
import MasterTable from "@/views/Layout/MasterTable.vue";
import { ref, onMounted } from "vue";
import { useBrandStore } from "@/stores/brand";

const isLoading = ref(true);

const brands = ref([]);
const brandStore = useBrandStore();

onMounted(async () => {
  try {
    let res = await brandStore.fetchBrands();
    brands.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
