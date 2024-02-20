<template>
  <template v-if="isLoading">
    <Loading />
  </template>
  <template v-else>
    <div>
      <div class="card p-3">
        <Heading :payload="{ title: 'Medicine List' }" />
        <div class="table-responsive">
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
              <tr
                v-for="(medicineList, index) in medicineLists"
                :key="'item' + medicineList._id"
              >
                <td>{{ index + 1 }}</td>
                <td>{{ medicineList.code }}</td>
                <td>{{ medicineList.name }}</td>
                <td>{{ medicineList.relatedBrand.name }}</td>
                <td>{{ medicineList.description }}</td>
                <td>
                  <router-link
                    v-if="medicineList._id"
                    :to="{
                      name: 'medicine-list.related-medicine-items',
                      params: { id: medicineList._id },
                    }"
                    class="btn btn-primary"
                  >
                    Detail
                  </router-link>
                </td>
              </tr>
              <tr class="text-center" v-if="medicineLists && medicineLists.length <= 0">
                <td colspan="9">No record exist!</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from "vue";
import _ from "lodash";
import { useMedicineListStore } from "@/stores/medicineList.js";
import { useAppStore } from "../../stores/app";

const medicineLists = ref([]);
const isLoading = ref(true);
const medicineListStore = useMedicineListStore();
const appStore = useAppStore();

onMounted(async () => {
  try {
    let res = await medicineListStore.fetchMedicineLists();
    medicineLists.value = res.list;
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped></style>
