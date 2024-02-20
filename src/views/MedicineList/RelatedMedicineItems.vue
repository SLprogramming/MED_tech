<template>
  <template v-if="isLoading">
    <div>
      <Loading />
    </div>
  </template>

  <template v-else>
    <div class="card p-3">
      <h4 class="mb-3">{{ medicineItems[0]?.name.name }}'s Unit</h4>
      <div class="table-responsive">
        <table class="table table-borderless table-striped">
          <thead>
            <tr>
              <th class="text-nowrap">#</th>
              <th class="text-nowrap">Code</th>
              <th class="text-nowrap">Name</th>
              <th class="text-nowrap">Current Qty</th>
              <th class="text-nowrap">Reorder Qty</th>
              <th class="text-nowrap">Purchase Price</th>
              <th class="text-nowrap">Selling Price</th>
              <th class="text-nowrap">Unit Convention</th>
              <th class="text-nowrap">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="text-nowrap"
              v-if="medicineItems != null"
              v-for="(medicineItem, index) in medicineItems"
              :key="'medicineItem' + medicineItem._id"
            >
              <td class="text-nowrap">{{ index + 1 }}</td>
              <td class="text-nowrap">{{ medicineItem.code }}</td>
              <td class="text-nowrap">{{ medicineItem.medicineItemName }}</td>
              <td class="text-nowrap">{{ medicineItem.currentQuantity }}</td>
              <td class="text-nowrap">{{ medicineItem.reOrderQuantity }}</td>
              <td class="text-nowrap">{{ medicineItem.purchasePrice }}</td>
              <td class="text-nowrap">{{ medicineItem.sellingPrice }}</td>
              <td class="text-nowrap">{{ medicineItem.toUnit }}</td>
              <td class="text-nowrap">{{ medicineItem.description }}</td>
            </tr>
            <tr v-if="medicineItems.length <= 0">
              <td colspan="9" class="text-center p-3">No record exist!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMedicineListStore } from "@/stores/medicineList.js";

const props = defineProps(["id"]);

const isLoading = ref(true);
const medicineListStore = useMedicineListStore();

const medicineItems = ref([]);

onMounted(async () => {
  try {
    let res = await medicineListStore.fetchRelatedMedicineItems({ id: props.id });
    // console.log(res)
    medicineItems.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
