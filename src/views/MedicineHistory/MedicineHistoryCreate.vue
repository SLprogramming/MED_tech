<template>
  <template v-if="isLoading">
    <div>Loading ...</div>
  </template>
  <template v-else>
    <div class="row">
      <div class="col-12">
        <h6 class="fw-normal mb-3 text-secondary">Add Medicine History</h6>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card border-0 shadow-sm p-3 rounded">
          <ul class="nav nav-pills">
            <li class="nav-item">
              <button class="nav-link" @click="currentTab = 'History'" :class="{ active: currentTab === 'History' }"
                aria-current="page">History</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" @click="currentTab = 'Examination'"
                :class="{ active: currentTab === 'Examination' }">Physical Examination</button>
            </li>
          </ul>

          <hr class="mb-3" />

          <div v-if="currentTab === 'History'">
            <div class="row">
              <div class="col-12">
                <MedicineHistoryCreateForm @updateMedicinePayload="updateMedicinePayload"
                  :payload="payload.HistoryResult" />
              </div>
            </div>
          </div>
          <div v-if="currentTab === 'Examination'">
            <div class="row">
              <div class="col-12">
                <PhysicalExaminationCreateForm @updatePhysicalPayload="updatePhysicalPayload"
                  :payload="payload.PhysicalResult" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import MedicineHistoryCreateForm from "@/components/MedicineHistory/Create/MedicineHistoryCreateForm.vue";
import PhysicalExaminationCreateForm from "@/components/MedicineHistory/Create/PhysicalExaminationCreateForm.vue";
import { usePatientStore } from "../../stores/patient";
export default {
  setup() {
    const patientStore = usePatientStore();
    return {
      patientStore,
    };
  },
  components: {
    MedicineHistoryCreateForm,
    PhysicalExaminationCreateForm,
  },
  data() {
    return {
      isLoading: true,
      currentTab: "History",
      payload: {},
    };
  },
  methods: {
    async updatePhysicalPayload(data) {
      // this.payload.PhysicalResult = [data];
      await this.fetchOldData()
    },
    async updateMedicinePayload(data) {
      // this.payload.HistoryResult = [data];
      await this.fetchOldData()
    },
    async fetchOldData() {
      let res = await this.patientStore.fetchMedicineHistoryAndPhysicalExamination({
        id: this.$route.query.patientId,
      });
      console.log(res);
      this.payload = res;
    }
  },
  async mounted() {
    try {
      await this.fetchOldData()
    } catch (err) {
      console.log(err);
    } finally {
      this.isLoading = false;
    }
  },
};
</script>

<style lang="scss" scoped>
.nav-link.active {
  color: white !important;
}
</style>
