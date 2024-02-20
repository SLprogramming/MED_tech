<template>
  <div class="modal fade" id="patientAdvancePaidModal" tabindex="-1" aria-labelledby="patientAdvancePaidModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="patientAdvancePaidModalLabel">Advance Paid</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
            <div class="mb-3">
              <label for="advancePaidAmount" class="form-label">Amount</label>
              <input v-model="data.amount" type="number" class="form-control" id="advancePaidAmount">
            </div>
            <div class="mb-3">
              <label for="advancePaidPaymentType" class="form-label">Payment Type</label>
              <select v-model="data.paymentType" class="form-select" id="advancePaidPaymentType"
                aria-label="Payment Type Select">
                <option selected disabled>Select Bank or Cash</option>
                <option value="bank">Bank</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div v-if="data.paymentType === 'bank'" class="mb-3">
              <label for="bankAccount" class="form-label">Bank Accounts</label>
              <select id="bankAccount" class="form-select" v-model="selectedBankAccount"
                aria-label="Default select example" placeholder="select Account">
                <option v-for="(acc, index) in props.bankAccounts" :value="acc">
                  {{ acc.name }}
                </option>
              </select>
            </div>
            <div v-if="data.paymentType === 'cash'" class="mb-3">
              <label for="cashAccount" class="form-label">Cash Accounts</label>
              <select id="cashAccount" class="form-select" v-model="selectedCashAccount"
                aria-label="Default select example" placeholder="select Account">
                <option v-for="(acc, index) in props.cashAccounts" :value="acc">
                  {{ acc.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label for="advancePaidRemark" class="form-label">Remark</label>
              <input v-model="data.remark" type="text" class="form-control" id="advancePaidRemark">
            </div>
            <div class="mb-3">
              <label for="advancePaidDate" class="form-label">Date</label>
              <input v-model="data.date" type="date" class="form-control" id="advancePaidDate">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <!-- <SubmitButton type="button" class="btn btn-primary" @click="submit">Add advance</SubmitButton> -->
          <SubmitButton @click="submit" name="Add Advance" :loading="submitting" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import SubmitButton from "../../components/Common/SubmitButton.vue";
import { useAdvanceRecordStore } from "../../stores/advanceRecord"
import { ref } from 'vue';
import { onMounted } from "vue";
import { useAppStore } from "../../stores/app";

const props = defineProps(['cashAccounts', 'bankAccounts'])
const appStore = useAppStore()
const emit = defineEmits(['updateAdvanceRecords'])

const route = useRoute()
const advanceRecordStore = useAdvanceRecordStore()
const data = ref({
  amount: 0,
  date: '',
  remark: '',
  paymentType: 'bank'
})
const selectedCashAccount = ref({})
const selectedBankAccount = ref({})
const submitting = ref(false)

const prepareForm = () => {
  console.log(route)
  let formData = {
    createdAt: data.value.date ? new Date(data.value.date).toISOString() : new Date().toISOString(),
    remark: data.value.remark,
    amount: data.value.amount,
    relatedPatient: route.params.id
  }

  if (data.value.paymentType === 'bank') {
    formData.relatedBank = selectedBankAccount.value._id
  }
  if (data.value.paymentType === 'cash') formData.relatedCash = selectedCashAccount.value._id

  return formData
}

const submit = async () => {
  submitting.value = true
  let formData = prepareForm()
  console.log(formData)
  // return
  try {
    let res = await advanceRecordStore.createAdvanceRecord(formData)
    console.log(res)
    emit('updateAdvanceRecords')
    appStore.showSuccess()
  } catch (err) {
    console.log(err)
    appStore.showError()
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  selectedCashAccount.value = props.cashAccounts[0]
  selectedBankAccount.value = props.bankAccounts[0]

})
</script>

<style lang="scss" scoped></style>