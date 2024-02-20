<template>
  <form @submit.prevent="">
    <div class="row mb-3">
      <div class="col-6">
        <div>
          <div class="mb-3">
            <label class="form-label">Skin Types</label>
            <div class="d-flex gap-3">
              <VueMultiselect
                :model-value="selectedSkinType"
                @update:model-value="updateSelectedSkinType"
                :options="skinTypes"
                :searchable="true"
                :close-on-select="false"
                :allow-empty="false"
                :option-height="31"
                label="item"
                placeholder="Select Items"
                track-by="item"
              />
              <button @click="addSelectedSkinTypes" type="button" class="btn btn-primary">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="row" v-if="selectedSkinTypes.length > 0">
            <h5 class="mb-3">Selected Cosmetics</h5>
            <div class="col-12">
              <div class="row mb-3" v-for="(skinType, index) in selectedSkinTypes">
                <div class="col">
                  <input
                    type="text"
                    class="form-control"
                    :value="skinType.item"
                    disabled
                  />
                </div>
                <div class="col">
                  <input type="text" class="form-control" v-model="skinType.remark" />
                </div>
                <div class="col">
                  <button
                    type="button"
                    @click="removeSelectedSkinTypes(index)"
                    class="btn btn-danger"
                  >
                    <i class="bi bi-dash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div>
          <div class="mb-3">
            <label class="form-label">Acnes</label>
            <div class="d-flex gap-3">
              <VueMultiselect
                :model-value="selectedAcne"
                @update:model-value="updateSelectedAcne"
                :options="acnes"
                :searchable="true"
                :close-on-select="false"
                :allow-empty="false"
                :option-height="31"
                label="item"
                placeholder="Select Items"
                track-by="item"
              />
              <button @click="addSelectedAcnes" type="button" class="btn btn-primary">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="row" v-if="selectedAcnes.length > 0">
            <h5 class="mb-3">Selected Acnes</h5>
            <div class="col-12">
              <div class="row mb-3" v-for="(acne, index) in selectedAcnes">
                <div class="col">
                  <input type="text" class="form-control" :value="acne.item" disabled />
                </div>
                <div class="col">
                  <input type="text" class="form-control" v-model="acne.remark" />
                </div>
                <div class="col">
                  <button
                    type="button"
                    @click="removeSelectedAcnes(index)"
                    class="btn btn-danger"
                  >
                    <i class="bi bi-dash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div>
          <div class="mb-3">
            <label class="form-label">Melsma & Black Spot</label>
            <div class="d-flex gap-3">
              <VueMultiselect
                :model-value="selectedBlackSpot"
                @update:model-value="updateSelectedBlackSpot"
                :options="blackSpots"
                :searchable="true"
                :close-on-select="false"
                :allow-empty="false"
                :option-height="31"
                label="item"
                placeholder="Select Items"
                track-by="item"
              />
              <button
                @click="addSelectedBlackSpots"
                type="button"
                class="btn btn-primary"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="row" v-if="selectedBlackSpots.length > 0">
            <h5 class="mb-3">Selected Melsma & Black Spot</h5>
            <div class="col-12">
              <div class="row mb-3" v-for="(blackSpot, index) in selectedBlackSpots">
                <div class="col">
                  <input
                    type="text"
                    class="form-control"
                    :value="blackSpot.item"
                    disabled
                  />
                </div>
                <div class="col">
                  <input type="text" class="form-control" v-model="blackSpot.remark" />
                </div>
                <div class="col">
                  <button
                    type="button"
                    @click="removeSelectedBlackSpots(index)"
                    class="btn btn-danger"
                  >
                    <i class="bi bi-dash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div>
          <div class="mb-3">
            <label class="form-label">Body Measurement</label>
            <div class="d-flex gap-3">
              <VueMultiselect
                :model-value="selectedMesoFat"
                @update:model-value="updateSelectedMesoFat"
                :options="mesoFats"
                :searchable="true"
                :close-on-select="false"
                :allow-empty="false"
                :option-height="31"
                label="item"
                placeholder="Select Items"
                track-by="item"
              />
              <button @click="addSelectedMesoFats" type="button" class="btn btn-primary">
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="row" v-if="selectedMesoFats.length > 0">
            <h5 class="mb-3">Selected Meso Fat</h5>
            <div class="col-12">
              <div class="row mb-3" v-for="(mesofat, index) in selectedMesoFats">
                <div class="col">
                  <input
                    type="text"
                    class="form-control"
                    :value="mesofat.item"
                    disabled
                  />
                </div>
                <div class="col">
                  <input type="text" class="form-control" v-model="mesofat.remark" />
                </div>
                <div class="col">
                  <button
                    type="button"
                    @click="removeSelectedMesoFats(index)"
                    class="btn btn-danger"
                  >
                    <i class="bi bi-dash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div>
          <div class="mb-3">
            <label class="form-label">Facial Design</label>
            <div class="d-flex gap-3">
              <VueMultiselect
                :model-value="selectedFacialDesign"
                @update:model-value="updateSelectedFacialDesign"
                :options="facialDesigns"
                :searchable="true"
                :close-on-select="false"
                :allow-empty="false"
                :option-height="31"
                label="item"
                placeholder="Select Items"
                track-by="item"
              />
              <button
                @click="addSelectedFacialDesigns"
                type="button"
                class="btn btn-primary"
              >
                <i class="bi bi-plus-lg"></i>
              </button>
            </div>
          </div>
          <div class="row" v-if="selectedFacialDesigns.length > 0">
            <h5 class="mb-3">Selected Meso Fat</h5>
            <div class="col-12">
              <div class="row mb-3" v-for="(mesofat, index) in selectedFacialDesigns">
                <div class="col">
                  <input
                    type="text"
                    class="form-control"
                    :value="mesofat.item"
                    disabled
                  />
                </div>
                <div class="col">
                  <input type="text" class="form-control" v-model="mesofat.remark" />
                </div>
                <div class="col">
                  <button
                    type="button"
                    @click="removeSelectedFacialDesigns(index)"
                    class="btn btn-danger"
                  >
                    <i class="bi bi-dash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-6">
        <label for="others" class="form-label">Other Physical Examination</label>
        <textarea
          id="others"
          cols="30"
          rows="3"
          class="form-control"
          v-model="others"
        ></textarea>
      </div>
    </div>
    <div class="text-end">
      <!-- <button
        v-if="isUpdate && payload.length > 0"
        type="button"
        @click="updatePhysicalExamination"
        class="btn btn-success"
      >
        Update
      </button>
      <button
        v-if="!isUpdate"
        type="button"
        @click="createPhysicalExamination"
        class="btn btn-primary"
      >
        Submit
      </button> -->
			<SubmitButton v-if="isUpdate" class="btn btn-success" @click="updatePhysicalExamination" name="Update" :loading="submitting" />
			<SubmitButton v-if="!isUpdate" class="btn btn-primary" @click="createPhysicalExamination" name="Create" :loading="submitting" />
    </div>
  </form>
</template>

<script>
import VueMultiselect from "vue-multiselect";
import { usePhysicalExaminationStore } from "@/stores/physicalExamination.js";
import { useAppStore } from "@/stores/app";
import SubmitButton from "../../Common/SubmitButton.vue";
export default {
  setup() {
    const physicalExaminationStore = usePhysicalExaminationStore();
    const appStore = useAppStore();
    return {
      appStore,
      physicalExaminationStore,
    };
  },
  props: ["payload"],
  components: {
    VueMultiselect,
    SubmitButton
},
  data() {
    return {
      others: "",
      submitting: false,
      isUpdate: false,
      skinTypes: [
        {
          item: "I",
          remark: "",
        },
        {
          item: "II",
          remark: "",
        },
        {
          item: "III",
          remark: "",
        },
        {
          item: "IV",
          remark: "",
        },
        {
          item: "V",
          remark: "",
        },
        {
          item: "VI",
          remark: "",
        },
      ],
      selectedSkinType: {},
      selectedSkinTypes: [],
      acnes: [
        {
          item: "Comedomes",
          remark: "",
        },
        {
          item: "Inflammatory Papules",
          remark: "",
        },
        {
          item: "Cystic",
          remark: "",
        },
        {
          item: "Nodules",
          remark: "",
        },
        {
          item: "PIH",
          remark: "",
        },
        {
          item: "PAR",
          remark: "",
        },
        {
          item: "Atrophic Scar",
          remark: "",
        },
        {
          item: "Hyper Trophic Scar",
          remark: "",
        },
        {
          item: "Irritation & Drynese",
          remark: "",
        },
      ],
      selectedAcne: {},
      selectedAcnes: [],
      blackSpots: [
        {
          item: "Epidermal",
          remark: "",
        },
        {
          item: "Dermal",
          remark: "",
        },
        {
          item: "Mixed",
          remark: "",
        },
        {
          item: "Grading",
          remark: "",
        },
      ],
      selectedBlackSpot: {},
      selectedBlackSpots: [],
      mesoFats: [
        {
          item: "weight",
          remark: "",
        },
        {
          item: "height",
          remark: "",
        },
        {
          item: "waist",
          remark: "",
        },
        {
          item: "hip",
          remark: "",
        },
        {
          item: "leg",
          remark: "",
        },
        {
          item: "arm",
          remark: "",
        },
        {
          item: "others",
          remark: "",
        },
        // {
        //   item: "Umbilicues Level",
        //   remark: "",
        // },
        // {
        //   item: "1 cm above",
        //   remark: "",
        // },
        // {
        //   item: "1 cm below",
        //   remark: "",
        // },
        // {
        //   item: "Weight",
        //   remark: "",
        // },
        // {
        //   item: "Injection site",
        //   remark: "",
        // },
        // {
        //   item: "Amount",
        //   remark: "",
        // },
      ],
      selectedMesoFat: {},
      selectedMesoFats: [],
      facialDesigns: [
        {
          item: "Upper Face",
          remark: "",
        },
        {
          item: "Middle Face",
          remark: "",
        },
        {
          item: "Lower Face",
          remark: "",
        },
        {
          item: "Double Chin",
          remark: "",
        },
      ],
      selectedFacialDesign: {},
      selectedFacialDesigns: [],
    };
  },
  methods: {
    resetForm() {
      this.others = "";
      this.selectedSkinType = {};
      this.selectedSkinTypes = [];
      this.selectedAcne = {};
      this.selectedAcnes = [];
      this.selectedBlackSpot = {};
      this.selectedBlackSpots = [];
      this.selectedMesoFat = {};
      this.selectedMesoFats = [];
      this.selectedFacialDesign = {};
      this.selectedFacialDesigns = [];
    },

    updateSelectedSkinType(e) {
      this.selectedSkinType = { ...e };
    },
    addSelectedSkinTypes() {
      let alreadyExist = this.selectedSkinTypes.findIndex(
        (skinType) => skinType.item === this.selectedSkinType.item
      );

      if (alreadyExist === -1 && Object.keys(this.selectedSkinType).length > 0) {
        this.selectedSkinTypes.push(this.selectedSkinType);
      }
    },
    removeSelectedSkinTypes(index) {
      this.selectedSkinTypes = this.selectedSkinTypes.filter(
        (skinType, itemIndex) => itemIndex !== index
      );
    },

    updateSelectedAcne(e) {
      this.selectedAcne = { ...e };
    },
    addSelectedAcnes() {
      let alreadyExist = this.selectedAcnes.findIndex(
        (item) => item.item === this.selectedAcne.item
      );

      if (alreadyExist === -1 && Object.keys(this.selectedAcne).length > 0) {
        this.selectedAcnes.push(this.selectedAcne);
      }
    },
    removeSelectedAcnes(index) {
      this.selectedAcnes = this.selectedAcnes.filter(
        (item, itemIndex) => itemIndex !== index
      );
    },

    updateSelectedBlackSpot(e) {
      this.selectedBlackSpot = { ...e };
    },
    addSelectedBlackSpots() {
      let alreadyExist = this.selectedBlackSpots.findIndex(
        (item) => item.item === this.selectedBlackSpot.item
      );

      if (alreadyExist === -1 && Object.keys(this.selectedBlackSpot).length > 0) {
        this.selectedBlackSpots.push(this.selectedBlackSpot);
      }
    },
    removeSelectedBlackSpots(index) {
      this.selectedBlackSpots = this.selectedBlackSpots.filter(
        (item, itemIndex) => itemIndex !== index
      );
    },

    updateSelectedMesoFat(e) {
      this.selectedMesoFat = { ...e };
    },
    addSelectedMesoFats() {
      let alreadyExist = this.selectedMesoFats.findIndex(
        (item) => item.item === this.selectedMesoFat.item
      );

      if (alreadyExist === -1 && Object.keys(this.selectedMesoFat).length > 0) {
        this.selectedMesoFats.push(this.selectedMesoFat);
      }
    },
    removeSelectedMesoFats(index) {
      this.selectedMesoFats = this.selectedMesoFats.filter(
        (item, itemIndex) => itemIndex !== index
      );
    },

    updateSelectedFacialDesign(e) {
      this.selectedFacialDesign = { ...e };
    },
    addSelectedFacialDesigns() {
      let alreadyExist = this.selectedFacialDesigns.findIndex(
        (item) => item.item === this.selectedFacialDesign.item
      );

      if (alreadyExist === -1 && Object.keys(this.selectedFacialDesign).length > 0) {
        this.selectedFacialDesigns.push(this.selectedFacialDesign);
      }
    },
    removeSelectedFacialDesigns(index) {
      this.selectedFacialDesigns = this.selectedFacialDesigns.filter(
        (item, itemIndex) => itemIndex !== index
      );
    },

    prepareForm() {
      let data = {
        skinType: this.selectedSkinTypes,
        acne: this.selectedAcnes,
        melasmaAndBlackSpot: this.selectedBlackSpots,
        mesoFat: this.selectedMesoFats,
        facialDesign: this.selectedFacialDesigns,
        otherPhysicalExamination: this.others,
        relatedPatient: this.$route.query.patientId,
      };

      return data;
    },
    async createPhysicalExamination() {
      this.submitting = true
      let data = this.prepareForm();
      try {
        let res = await this.physicalExaminationStore.createPhysicalExamination(data);
        this.appStore.showSuccess();
        this.setData(res.data);
        this.$emit("updatePhysicalPayload", res.data);
        this.isUpdate = true;
      } catch (error) {
        console.log(error);
        this.appStore.showError();
      } finally {
        this.submitting = false
      }
    },
    async updatePhysicalExamination() {
      this.submitting = true
      let data = this.prepareForm();
      data.id = this.payload[0]._id;
      try {
        let res = await this.physicalExaminationStore.updatePhysicalExamination(data);
        this.appStore.showSuccess();
        this.setData(res.data);
        this.$emit("updatePhysicalPayload", res.data);
      } catch (error) {
        console.log(error);
        this.appStore.showError();
      } finally {
        this.submitting = false
      }
    },
    setData(payload) {
      this.selectedAcnes = payload.acne;
      this.selectedBlackSpots = payload.acne;
      this.selectedSkinTypes = payload.skinType;
      this.selectedBlackSpots = payload.melasmaAndBlackSpot;
      this.selectedMesoFats = payload.mesoFat;
      this.selectedFacialDesigns = payload.facialDesign;
      this.others = payload.otherPhysicalExamination;
    },
  },
  mounted() {
    if (this.payload.length > 0) {
      this.setData(this.payload[0]);
      this.isUpdate = true;
    }
  },
};
</script>

<style lang="scss" scoped></style>
