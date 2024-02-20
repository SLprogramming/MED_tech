<template>
  <template v-if="isLoading">
    <div>Loading ...</div>
  </template>
  <template v-else>
    <div class="row">
      <div class="col-12">
        <Heading :payload="{ title: 'Add Procedure History' }" />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm p-3 rounded">
          <ul class="nav nav-pills">
            <li class="nav-item">
              <button
                class="nav-link"
                @click="currentTab = 'record'"
                :class="{ active: currentTab === 'record' }"
                aria-current="page"
                >Record</button
              >
            </li>
            <li class="nav-item">
              <button
                class="nav-link"
                @click="currentTab = 'usage'"
                :class="{ active: currentTab === 'usage' }"
                >Usage
              </button>
            </li>
          </ul>

          <hr class="mb-3" />

          <div v-if="currentTab === 'record'">
            <div class="row">
              <div class="col-12">
                <RecordForm />
              </div>
            </div>
          </div>
          <div v-if="currentTab === 'usage'">
            <div class="row">
              <div class="col-12">
                <UsageForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import RecordForm from "../../components/ProcedureHistory/RecordForm.vue";
import UsageForm from "../../components/ProcedureHistory/UsageForm.vue";
import Heading from "../../components/Common/Heading.vue";

const isLoading = ref(false);
const currentTab = ref("record");
const route = useRoute()

onMounted(() => {
  if (route.query.currentTab) {
    currentTab.value = route.query.currentTab
  }
})
</script>

<style lang="scss" scoped></style>
