<template>
  <template v-if="isLoading">
    <Loading />
  </template>
  <template v-else>
    <div>
      <MasterTable>
        <template #header>
          <Heading :payload="{ title: 'Procedure Medicine' }" />
        </template>
        <template #body>
          <table class="table table-borderless table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Name</th>
                <th>Related Brand</th>
                <th>Description</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(procedureMedicine, index) in procedureMedicines">
                <td>{{ index + 1 }}</td>
                <td>{{ procedureMedicine.code }}</td>
                <td>{{ procedureMedicine.name }}</td>
                <td>{{ procedureMedicine.relatedBrand?.name }}</td>
                <td>{{ procedureMedicine.description }}</td>
                <td>
                  <router-link
                    v-if="procedureMedicine.name"
                    :to="{
                      name: 'procedure-medicine.related-procedure-items',
                      params: { id: procedureMedicine._id },
                    }"
                    class="btn btn-primary"
                  >
                    Detail
                  </router-link>
                </td>
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
import { useProcedureMedicineStore } from "@/stores/procedureMedicine";

const isLoading = ref(true);

const procedureMedicines = ref([]);
const procedureMedicineStore = useProcedureMedicineStore();

onMounted(async () => {
  try {
    let res = await procedureMedicineStore.fetchProcedureMedicines();
    procedureMedicines.value = res.list;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
