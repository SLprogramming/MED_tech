<template>
  <div>
    <MasterTable>
      <template #header>
        <Heading :payload="{ title: 'Treatment List' }" />
      </template>
      <template #body>
        <table class="table table-borderless table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Code</th>
              <th scope="col">Name</th>
              <th scope="col">Est. Cost</th>
              <th scope="col">Selling Price</th>
              <th scope="col">Body Part</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(treatment, index) in treatments">
              <td>{{ index + 1 }}</td>
              <td>{{ treatment.treatmentCode }}</td>
              <td>{{ treatment.treatmentName?.name }}</td>
              <td>{{ treatment.estimateTotalPrice }}</td>
              <td>{{ treatment.sellingPrice }}</td>
              <td>
                {{ treatment.treatmentName?.bodyParts }}
              </td>
            </tr>
            <tr v-if="treatments && treatments.length <= 0">
              <td colspan="6" class="text-center">No record exist!</td>
            </tr>
          </tbody>
        </table>
      </template>
    </MasterTable>
  </div>
</template>

<script setup>
import MasterTable from "@/views/Layout/MasterTable.vue";
defineProps(["treatments"]);
</script>

<style lang="scss" scoped></style>
