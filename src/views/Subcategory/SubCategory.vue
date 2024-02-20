<template>
  <template v-if="isLoading">
    <Loading />
  </template>
  <template v-else>
    <div>
      <MasterTable>
        <template #header>
          <Heading :payload="{ title: 'Subcategory' }" />
        </template>
        <template #body>
          <table class="table table-borderless table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Code</th>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(subcategory, index) in subcategories">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ subcategory.code }}</td>
                <td>{{ subcategory.name }}</td>
                <td>{{ subcategory.relatedCategory.name }}</td>
                <td>{{ subcategory.description }}</td>
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
import { useSubcategoryStore } from "@/stores/subcategory";

const isLoading = ref(true);

const subcategories = ref([]);
const subcategoryStore = useSubcategoryStore();

onMounted(async () => {
  try {
    let res = await subcategoryStore.fetchSubCategories();
    subcategories.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
