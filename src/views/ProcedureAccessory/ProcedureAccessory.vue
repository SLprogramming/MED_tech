<template>
  <template v-if="isLoading">
    <Loading />
  </template>
  <template v-else>
    <div>
      <MasterTable>
        <template #header>
          <Heading :payload="{ title: 'Procedure Accessory' }" />
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
              <tr v-for="(procedureAccessory, index) in procedureAccessories">
                <td>{{ index + 1 }}</td>
                <td>{{ procedureAccessory.code }}</td>
                <td>{{ procedureAccessory.name }}</td>
                <td>{{ procedureAccessory.relatedBrand?.name }}</td>
                <td>{{ procedureAccessory.description }}</td>
                <td>
                  <router-link
                    v-if="procedureAccessory.name"
                    :to="{
                      name: 'procedure-accessory.related-accessory-items',
                      params: { id: procedureAccessory._id },
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
import { useProcedureAccessoryStore } from "@/stores/procedureAccessory";

const isLoading = ref(true);

const procedureAccessories = ref([]);
const procedureAccessoryStore = useProcedureAccessoryStore();

onMounted(async () => {
  try {
    let res = await procedureAccessoryStore.fetchProcedureAccessories();
    procedureAccessories.value = res.list;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
