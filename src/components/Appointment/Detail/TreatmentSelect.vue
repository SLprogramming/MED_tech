<template>
  <div class="card p-3">
    <h3 class="mb-4">Treatment Select</h3>
    <div class="row">
      <div class="col-12">
        <div class="mb-3">
          <label for="name" class="form-label">Body Part</label>
          <VueMultiselect :model-value="selectedBodyPart" @update:model-value="updateSelectedBodyPart"
            :options="bodyParts" :searchable="true" :close-on-select="false" :allow-empty="false" :option-height="31"
            label="name" track-by="_id" />
        </div>
        <div class="mb-3">
          <label class="form-label">Treatment</label>
          <VueMultiselect :model-value="selectedTreatment" @update:model-value="updateSelectedTreatment"
            :options="treatmentUnits" :searchable="true" :close-on-select="false" :allow-empty="false" :option-height="31"
            label="name" track-by="_id" />
        </div>
        <div class="mb-3">
          <label class="form-label">Treatment Unit</label>
          <VueMultiselect :model-value="selectedTreatmentUnit" :custom-label="treatmentUnitSelectLabel"
            @update:model-value="updateSelectedTreatmentUnit" :options="treatments" :searchable="true"
            :close-on-select="false" :allow-empty="false" :option-height="31" label="name" track-by="_id" />
        </div>
        <div class="mb-3">
          <label for="sellingPrice" class="form-label">Treatment Times</label>
          <input v-model="data.treatmentTimes" id="sellingPrice" type="text" class="form-control" disabled>
        </div>
        <div class="mb-3">
          <label for="inBetweenDuration" class="form-label">In Between Duration</label>
          <input v-model="data.inBetweenDuration" id="inBetweenDuration" type="text" class="form-control">
        </div>
        <div class="mb-3">
          <label for="sellingPrice" class="form-label">Selling Price</label>
          <input v-model="data.sellingPrice" id="sellingPrice" type="text" class="form-control" disabled>
        </div>
        <label class="form-label">Payment Type</label>
        <div class="mb-3 border rounded p-3">
          <div class="d-flex gap-3">
            <div class="form-check">
              <input class="form-check-input" v-model="paymentType" value="credit" type="radio" name="paymentType"
                id="credit" checked>
              <label class="form-check-label" for="credit">
                Credit
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" v-model="paymentType" value="advance" type="radio" name="paymentType"
                id="advance">
              <label class="form-check-label" for="advance">
                Advance
              </label>
            </div>
          </div>
        </div>
        <div v-if="paymentType === 'advance'" class="mb-3">
          <label class="form-label">Payment Methods</label>
          <div class="mb-3">
            <select class="form-select" v-model="paymentMethod" aria-label="Default select example">
              <option value="Cash">Cash</option>
              <option value="Bank">Bank</option>
            </select>
          </div>
        </div>
        <template v-if="paymentType === 'advance'">
          <div v-if="paymentMethod === 'Bank'" class="mb-3">
            <label for="bankAccount" class="form-label">Bank Accounts</label>
            <select id="bankAccount" class="form-select" v-model="selectedBankAccount" aria-label="Default select example"
              placeholder="select Account">
              <option v-for="(acc, index) in bankAccounts" :value="acc">{{ acc.name }}
              </option>
            </select>
          </div>
          <div v-if="paymentMethod === 'Cash'" class="mb-3">
            <label for="cashAccount" class="form-label">Cash Accounts</label>
            <select id="cashAccount" class="form-select" v-model="selectedCashAccount" aria-label="Default select example"
              placeholder="select Account">
              <option v-for="(acc, index) in cashAccounts" :value="acc">{{ acc.name }}
              </option>
            </select>
          </div>
        </template>
        <div class="mb-3">
          <label for="paidAmount" class="form-label">Paid Amount</label>
          <input @keyup="calcuateLeftOverAmount" v-model="data.paidAmount" id="paidAmount" type="text"
            class="form-control" :disabled="paymentType === 'credit'">
        </div>
        <div class="mb-3">
          <label for="leftOverAmount" class="form-label">Left Over Amount</label>
          <input v-model="data.leftOverAmount" id="leftOverAmount" type="text" class="form-control" disabled>
        </div>
        <div class="mb-3 d-flex justify-content-between">
          <button @click="$emit('closeCreate')" type="button" class="btn btn-danger me-3">Cancel</button>
          <button @click="storeTreatmentSelection" type="button" class="btn btn-primary">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAxiosClient } from "@/data/axios"
import { dateForParam } from '@/helpers'
import VueMultiselect from 'vue-multiselect'
import { useTreatmentSelectionStore } from "../../../stores/treatmentSelection"
export default {
  setup() {
    const treatmentSelectionStore = useTreatmentSelectionStore()
    return {
      treatmentSelectionStore
    }
  },
  props: ['appointment', 'cashAccounts', 'bankAccounts', 'treatments', 'treatmentUnits'],
  components: {
    VueMultiselect
  },
  data() {
    return {
      isLoading: true,
      data: {
        treatmentTimes: 0,
        sellingPrice: 0,
        paidAmount: 0,
        inBetweenDuration: 0,
      },
      bodyParts: [
        {
          _id: 0,
          name: 'Face'
        },
        {
          _id: 1,
          name: 'Body'
        },
        {
          _id: 2,
          name: 'Body Injection'
        },
      ],
      paymentMethod: 'Cash',
      selectedBodyPart: {},
      selectedTreatment: {},
      selectedTreatmentUnit: {},
      selectedBankAccount: {},
      selectedCashAccount: {},
      paymentType: 'credit',
    }
  },
  watch: {
    paymentType(newType, oldType) {
      if (newType === 'credit') {
        this.data.paidAmount = 0
        this.data.leftOverAmount = this.selectedTreatmentUnit?.sellingPrice //sellingPrice
      }
    },
    selectedTreatmentUnit(newTreatment, oldTreatment) {
      this.data.sellingPrice = newTreatment.sellingPrice
      this.data.treatmentTimes = newTreatment.treatmentTimes
      if (this.paymentType === 'credit') {
        this.data.paidAmount = 0
        this.data.leftOverAmount = this.selectedTreatmentUnit?.sellingPrice
      } else {
        this.data.leftOverAmount = this.selectedTreatmentUnit?.sellingPrice
      }
    }
  },
  methods: {
    dateForParam,
    updateSelectedTreatment(e) {
      this.selectedTreatment = { ...e }
    },
    updateSelectedBodyPart(e) {
      this.selectedBodyPart = { ...e }
    },
    updateSelectedTreatmentUnit(e) {
      this.selectedTreatmentUnit = { ...e }
    },
    calcuateLeftOverAmount() {
      this.data.leftOverAmount = this.data.sellingPrice - this.data.paidAmount
    },
    treatmentUnitSelectLabel({ treatmentName }) {
      return treatmentName?.name
    },
    prepareForm() {
      let paymentType = false
      if (this.paymentType === 'credit') {
        paymentType = 'Credit'
      } else if (this.paymentType === 'advance') {
        paymentType = 'Cash Down'
      }

      let form = {
        relatedPatient: this.appointment.relatedPatient._id,
        originalDate: this.dateForParam(this.appointment.originalDate),
        phone: this.appointment.phone,
        relatedDoctor: this.appointment.relatedDoctor._id,
        relatedTreatment: this.selectedTreatmentUnit._id,
        relatedTreatmentUnit: this.selectedTreatment._id,
        paymentMethod: paymentType,
        paidAmount: this.data.paidAmount,
        totalAmount: this.data.sellingPrice,
        appointment: this.appointment._id,
        selectionStatus: 'Ongoing', // ['Ongoing', 'Done']
        treatmentTimes: this.data.treatmentTimes,
        bodyParts: this.selectedBodyPart.name, //['Face', 'Body', 'Body Injection'],
        inBetweenDuration: this.data.inBetweenDuration,
      }

      if (this.paymentType === 'advance' && this.paymentMethod === 'Cash') {
        form.relatedCash = "6410006dad7a014778c7a67c"
      } else if (this.paymentType === 'advance' && this.paymentMethod === 'Bank') {
        form.relatedBank = "6410006dad7a014778c7a67c"
      }

      return form
    },
    async storeTreatmentSelection() {
      let data = this.prepareForm()

      try {
        let res = this.treatmentSelectionStore.addTreatmentSelection(data)
        this.appointment.relatedTreatmentSelection.push(res.data.data[0])
        this.$emit('closeCreate')
      } catch (err) {
        console.log(err)
      }

    }
  },
}
</script>

<style lang="scss" scoped></style>