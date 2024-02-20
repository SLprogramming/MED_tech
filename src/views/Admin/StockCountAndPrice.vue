<template>
  <template v-if="isLoading">
    <div>
      <Loading />
    </div>
  </template>
  <template v-else>
    <div class="row">
      <div class="col-12">
        <!-- <h6 class="fw-normal mb-3 text-secondary">Stock Count And Price</h6> -->
        <Heading :payload="{ title: 'Stock count and price' }" />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card p-3">
          <div class="d-flex gap-3">
            <button class="btn" :class="{ 'btn-primary': currentTab === 'medicineItems' }"
              @click="currentTab = 'medicineItems'">Medicine Items</button>
            <button class="btn" :class="{ 'btn-primary': currentTab === 'procedureItems' }"
              @click="currentTab = 'procedureItems'">Procedure Items</button>
            <button class="btn" :class="{ 'btn-primary': currentTab === 'procedureAccessoryItems' }"
              @click="currentTab = 'procedureAccessoryItems'">Procedure Accessory Items</button>
          </div>
          <hr>
          <div v-if="currentTab === 'medicineItems'">
            <MedicineItems />
          </div>
          <div v-if="currentTab === 'procedureItems'">
            <ProcedureItems />
          </div>
          <div v-if="currentTab === 'procedureAccessoryItems'">
            <ProcedureAccessoryItems />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref } from 'vue';
import MedicineItems from '../../components/Admin/StockCountAndPrice/MedicineItems.vue';
import ProcedureItems from '../../components/Admin/StockCountAndPrice/ProcedureItems.vue';
import ProcedureAccessoryItems from '../../components/Admin/StockCountAndPrice/ProcedureAccessoryItems.vue';
import Loading from '../../components/Common/Loading.vue';

const isLoading = ref(false)
const currentTab = ref('medicineItems')

</script>

<style lang="scss" scoped></style>