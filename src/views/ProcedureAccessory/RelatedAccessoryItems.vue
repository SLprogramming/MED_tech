<template>
  <template v-if="isLoading">
    <div>
      <Loading />
    </div>
  </template>

  <template v-else>
    <div class="card p-3">
      <h4 class="mb-3">{{ accessoryItems[0]?.name.name }}'s Unit</h4>
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
              v-if="accessoryItems != null"
              v-for="(accessoryItem, index) in accessoryItems"
            >
              <td class="text-nowrap">{{ index + 1 }}</td>
              <td class="text-nowrap">{{ accessoryItem.code }}</td>
              <td class="text-nowrap">{{ accessoryItem.accessoryItemName }}</td>
              <td class="text-nowrap">{{ accessoryItem.currentQuantity }}</td>
              <td class="text-nowrap">{{ accessoryItem.reOrderQuantity }}</td>
              <td class="text-nowrap">{{ accessoryItem.purchasePrice }}</td>
              <td class="text-nowrap">{{ accessoryItem.sellingPrice }}</td>
              <td class="text-nowrap">{{ accessoryItem.toUnit }}</td>
              <td class="text-nowrap">{{ accessoryItem.description }}</td>
            </tr>
            <tr v-if="accessoryItems.length <= 0">
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
import { useProcedureAccessoryStore } from "@/stores/procedureAccessory.js";

const props = defineProps(["id"]);

const isLoading = ref(true);
const procedureAccessoryStore = useProcedureAccessoryStore();

const accessoryItems = ref([]);

onMounted(async () => {
  try {
    let res = await procedureAccessoryStore.fetchRelatedAccessoryItems({ id: props.id });
    // console.log(res)
    accessoryItems.value = res.data;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
