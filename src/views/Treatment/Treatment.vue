<template>
  <template v-if="isLoading">
    <Loading />
  </template>

  <template v-else>
    <Heading :payload="{ title: 'Treatment List' }" />
    <div class="row mb-3">
      <div class="col-12">
        <div class="d-flex gap-3 justify-content-end">
          <button
            class="btn"
            @click="currentTab = 'card'"
            :class="{ 'btn-primary': currentTab === 'card' }"
          >
            Card
          </button>
          <button
            class="btn"
            @click="currentTab = 'table'"
            :class="{ 'btn-primary': currentTab === 'table' }"
          >
            Table
          </button>
        </div>
      </div>
    </div>
    <template v-if="currentTab === 'card'">
      <TreatmentCardLayout :treatments="treatments" />
    </template>
    <template v-if="currentTab === 'table'">
      <TreatmentTableLayout :treatments="treatments" />
    </template>
  </template>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTreatmentStore } from "@/stores/treatment";
import TreatmentTableLayout from "../../components/Treatment/TreatmentTableLayout.vue";
import TreatmentCardLayout from "../../components/Treatment/TreatmentCardLayout.vue";

const treatments = ref([]);
const treatmentStore = useTreatmentStore();

const currentTab = ref("card");
const isLoading = ref(true);

onMounted(async () => {
  try {
    let res = await treatmentStore.fetchTreatments();
    treatments.value = res.list;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
