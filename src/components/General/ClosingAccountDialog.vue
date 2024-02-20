<template>
  <div class="modal fade" id="closingAccountDialog" tabindex="-1" aria-labelledby="closingAccountDialogLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5 text-capitalize" id="openingAccountDialogLabel">Closing Account dialog</h1>
          <p class="mb-0 px-2">
            ({{ formatDate(payload.date) }})
          </p>

          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent>
            <div class="mb-3">
              <label for="closingAccountAmount" class="form-label">Closing Amount</label>
              <input type="number" class="form-control" v-model="payload.amount" id="closingAccountAmount">
            </div>
            <div class="mb-3">
              <label for="closingAccountRemark" class="form-label">Remark</label>
              <input type="text" class="form-control" v-model="payload.remark" id="closingAccountRemark">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button @click="logout" type="button" ref="closeModalBtn" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <!-- <button type="button" class="btn btn-primary" @click="submit">Save changes</button> -->
          <SubmitButton name="Save" @click="submit" :loading="submitting" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAccountBalanceStore } from "../../stores/accountBalance"
import { useAppStore } from "../../stores/app"
import Loading from '../Common/Loading.vue';
import { formatDate, dateForParams, requiredString } from '../../helpers';
import SubmitButton from '../Common/SubmitButton.vue';
import { useRouter } from 'vue-router';

const accountBalanceStore = useAccountBalanceStore()
const appStore = useAppStore()
const router = useRouter()
const closeModalBtn = ref(null)
const payload = ref({
  amount: 0,
  remark: '',
})
const submitting = ref(false)

const submit = async () => {
  submitting.value = true
  let formData = prepareForm()
  console.log(formData)
  console.log(JSON.stringify(formData))
  try {
    let res = await accountBalanceStore.createAccountBalance(formData)
    console.log(res)
    closeModalBtn.value.click()
    appStore.fetchAccountData = true
    appStore.closingAmount = res.data.amount
    appStore.showSuccess()
    logout()
  } catch (err) {
    appStore.showError()
    console.log(err)
  } finally {
    submitting.value = false
  }
}

const logout = async () => {
  try {
    await appStore.logout();
    appStore.showSuccess();
    router.push({ name: "login" });
  } catch (err) {
    appStore.showError();
    console.log(err);
  }
};

const prepareForm = () => {
  let data = {
    relatedAccounting: appStore.account._id,
    type: "Closing",
    amount: payload.value.amount,
    date: dateForParams(payload.value.date),
  }

  if (requiredString(payload.value.remark)) data.remark = payload.value.remark

  return data
}

onMounted(() => {
  payload.value.date = new Date()
})
</script>

<style lang="scss" scoped></style>