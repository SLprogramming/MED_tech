<template>
  <template v-if="isLoading">
    <Loading />
  </template>
  <template v-else>
    <div>
      <MasterTable>
        <template #header>
          <Heading :payload="{ title: 'Category' }" />
        </template>
        <template #body>
          <table class="table table-borderless table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Code</th>
                <th scope="col">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(category, index) in categories">
                <th scope="row">{{ index + 1 }}</th>
                <td>{{ category.code }}</td>
                <td>{{ category.name }}</td>
                <td>{{ category.description }}</td>
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
import { useCategoryStore } from "@/stores/category";

const isLoading = ref(true);

const categories = ref([]);
const categoryStore = useCategoryStore();

onMounted(async () => {
  try {
    let res = await categoryStore.fetchCategories();
    categories.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
