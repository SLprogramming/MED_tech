<template>
  <template v-if="isLoading">
    <Loading />
  </template>

  <template v-else>
    <div>
      <MasterTable>
        <template #header>
          <Heading :payload="{ title: 'Treatment List' }" />
        </template>
        <template #body>
          <table class="table table-borderless table-striped">
            <thead>
              <tr>
                <th class="text-nowrap" scope="col">#</th>
                <th class="text-nowrap" scope="col">Code</th>
                <th class="text-nowrap" scope="col">Name</th>
                <th class="text-nowrap" scope="col">Body Parts</th>
                <th class="text-nowrap" scope="col">Description</th>
                <th class="text-nowrap" scope="col">Treatment Unit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(treatment, index) in treatmentList">
                <td>{{ index + 1 }}</td>
                <td>{{ treatment.code }}</td>
                <td>{{ treatment.name }}</td>
                <td>{{ treatment.bodyParts }}</td>
                <td>{{ treatment.description }}</td>
                <td>
                  <router-link
                      v-if="treatment.name"
                      :to="{
                        name: 'treatment-list.related-treatments',
                        params: { id: treatment._id },
                      }"
                      class="btn btn-primary"
                    >
                      Unit
                    </router-link>
                </td>
              </tr>
              <tr v-if="treatmentList && treatmentList.length <= 0">
                <td colspan="6" class="text-center">No record exist!</td>
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
import { useTreatmentListStore } from "@/stores/treatmentList";

const treatmentList = ref([]);
const treatmentListStore = useTreatmentListStore();

const isLoading = ref(true);

onMounted(async () => {
  try {
    let res = await treatmentListStore.fetchTreatmentLists();
    treatmentList.value = res.list;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
td {
  white-space: nowrap;
}
</style>
