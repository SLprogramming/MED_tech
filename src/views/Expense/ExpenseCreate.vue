<template>
  <div class="modal fade" id="expenseCreateModal" tabindex="-1" aria-labelledby="expenseCreateModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="expenseCreateModalLabel">Expense Create</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <template v-if="!loading">
          <div class="modal-body">
            <form @submit.prevent>
              <div class="d-flex gap-5 justify-content-center mb-3 border rounded p-3">
                <div class="form-check">
                  <input v-model="paymentType" class="form-check-input" value="Cash" type="radio" name="flexRadioDefault"
                    id="cash">
                  <label class="form-check-label" for="cash">
                    Cash
                  </label>
                </div>
                <div class="form-check">
                  <input v-model="paymentType" class="form-check-input" type="radio" value="Bank" name="flexRadioDefault"
                    id="bank" checked>
                  <label class="form-check-label" for="bank">
                    Bank
                  </label>
                </div>
              </div>
              <div class="mb-3" v-if="paymentType === 'Bank'">
                <label for="bankAccounts" class="form-label">Select Bank Account</label>
                <select id="bankAccounts" v-model="payload.selectedBankAccount" class="form-select"
                  aria-label="select bank account">
                  <option disabled selected>Select Bank Account</option>
                  <option v-for="each in bankAccounts" :value="each">{{ each.name }}</option>
                </select>
              </div>
              <div class="mb-3" v-if="paymentType === 'Cash'">
                <label for="cashAccounts" class="form-label">Select Cash Account</label>
                <select id="cashAccounts" v-model="payload.selectedCashAccount" class="form-select"
                  aria-label="select cash account">
                  <option disabled selected>Select Cash Account</option>
                  <option v-for="each in cashAccounts" :value="each">{{ each.name }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="expenseAccount" class="form-label">Expense Account</label>
                <VueMultiselect :model-value="selectedExpenseAccount" @update:model-value="updateSelectedExpenseAccount"
                  :options="expenseAccountList" :searchable="true" :close-on-select="true" :allow-empty="false"
                  :option-height="31" track-by="_id" :custom-label="customExpenseAccountListLabel"
                  placeholder="Type to search">
                </VueMultiselect>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <div class="mb-3">
                    <label for="initialAmount" class="form-label">Initial Amount</label>
                    <input @change="calculateFinalCurrency" v-model="payload.initialAmount" type="number"
                      class="form-control" id="initialAmount">
                  </div>
                </div>
                <div class="col">
                  <div class="mb-3">
                    <label for="initialCurrency" class="form-label">Initial Currency</label>
                    <select @change="calculateFinalCurrency" v-model="payload.selectedInitialCurrency" class="form-select"
                      aria-label="Initial currency">
                      <option disabled selected>Select Initial Currency</option>
                      <option v-for="each in currencyList" :value="each">{{ each.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row mb-3">
                <div class="col">
                  <label for="finalAmount" class="form-label">Final Amount</label>
                  <input @change="calculateFinalCurrency" v-model="payload.finalAmount" type="number" class="form-control"
                    id="finalAmount">
                </div>
                <div class="col">
                  <label for="finalCurrency" class="form-label">Final Currency</label>
                  <select @change="calculateFinalCurrency" v-model="payload.selectedFinalCurrency" class="form-select"
                    aria-label="Final currency">
                    <option disabled selected>Select Final Currency</option>
                    <option v-for="each in currencyList" :value="each">{{ each.name }}</option>
                  </select>
                </div>
              </div>
              <div class="mb-3">
                <label for="expenseFormDate" class="form-label">Date</label>
                <input class="form-control" type="date" v-model="payload.date">
              </div>
              <div class="mb-3">
                <label for="expenseFormDate" class="form-label">Remark</label>
                <input class="form-control" type="text" v-model="payload.remark">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button ref="expenseCloseBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <SubmitButton @click="submit" type="button" :loading="submitting" class="btn btn-primary" name="Submit" />
          </div>
        </template>
        <template v-if="loading">
          <Loading />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { ref } from 'vue';
import VueMultiselect from "vue-multiselect"
import { useAccountingListStore } from "../../stores/accountingList"
import { useCurrencyStore } from "../../stores/currency"
import { useExpenseStore } from "../../stores/expense"
import { cusFormatDate, dateForParams } from '../../helpers';
import { useAppStore } from '../../stores/app';
import SubmitButton from '../../components/Common/SubmitButton.vue';

const emit = defineEmits(['refetchExpense'])

const accountingListStore = useAccountingListStore()
const expenseStore = useExpenseStore()
const currencyStore = useCurrencyStore()
const appStore = useAppStore()

const expenseCloseBtn = ref(null)
const paymentType = ref('Bank')
const loading = ref(true)
const submitting = ref(false)
const currencyList = ref([])
const selectedExpenseAccount = ref({})
const expenseAccountList = ref([])
const bankAccounts = ref([])
const cashAccounts = ref([])
const payload = ref({
  selectedInitialCurrency: {},
  initialAmount: 0,
  finalAmount: 0,
  selectedFinalCurrency: {},
  date: '',
  selectedBankAccount: {},
  selectedCashAccount: {}
})

const calculateFinalCurrency = () => {
  if (payload.value.selectedInitialCurrency.code === 'USD' && payload.value.selectedFinalCurrency.code === "MMK") {
    payload.value.finalAmount = Math.round(payload.value.initialAmount * Number(payload.value.selectedInitialCurrency.exchangeRate))
    console.log(payload.value.finalAmount)
  } else if (payload.value.selectedInitialCurrency.code === 'MMK' && payload.value.selectedFinalCurrency.code === "USD") {
    payload.value.finalAmount = Math.round(payload.value.initialAmount / Number(payload.value.selectedFinalCurrency.exchangeRate))
  } else {
    payload.value.finalAmount = payload.value.initialAmount
  }
}

const updateSelectedExpenseAccount = (e) => {
  selectedExpenseAccount.value = { ...e }
}

const customExpenseAccountListLabel = ({ name, code }) => {
  if (!name && !code) return 'Select Expense Account'
  return `${name} – ${code}`
}

const submit = async () => {
  submitting.value = true
  let data = prepareForm()
  console.log(data)
  console.log(JSON.stringify(data))
  try {
    let res = await expenseStore.createExpense(data)
    console.log(res)
    appStore.showSuccess()
    // emit('addExpenseList', res.data[0])
    emit('refetchExpense')
    expenseCloseBtn.value.click()
  } catch (err) {
    console.log(err)
    appStore.showError()
  } finally {
    submitting.value = false
  }
}

const prepareForm = () => {
  let data = {
    relatedAccounting: selectedExpenseAccount.value._id,
    date: payload.value.date ? dateForParams(payload.value.date) : dateForParams(),
    remark: payload.value.remark ?? undefined,
    initialAmount: payload.value.initialAmount,
    initialCurrency: payload.value.selectedInitialCurrency.code,
    finalAmount: payload.value.finalAmount,
    finalCurrency: payload.value.selectedFinalCurrency.code,
  }

  if (paymentType.value === 'Bank') {
    data.relatedBankAccount = payload.value.selectedBankAccount._id
  } else if (paymentType.value === 'Cash') {
    data.relatedCashAccount = payload.value.selectedCashAccount._id
  }

  return data
}

const fetchAccountingLists = async () => {
  try {
    const accountingListRes = await accountingListStore.fetchAccountingLists()
    // console.log(accountingListRes)
    // expenseAccountList.value = accountingListRes.list.filter(each => {
    //   if (each.relatedType?.name === "Profit and Loss" && (each.relatedHeader?.name === "Expense" || each.relatedHeader?.name === "Revenue")) {
    //     return true
    //   } else {
    //     return false
    //   }
    // })

    // bankAccounts.value = res.list.filter(el => {
    //   if (el.relatedType && el.relatedType.name === "Assets") {
    //     if (el.relatedHeader && el.relatedHeader.name === "Cash at Bank") {
    //       return el
    //     }
    //   }
    // })

    accountingListRes.list.map(each => {
      if (each.relatedType && each.relatedType.name === "Assets") {
        // if (each.relatedHeader && each.relatedHeader.name === "Cash at Bank") {
        //   appStore.accountingList.bank.map(bankAccId => {
        //     if (bankAccId === each._id) {
        //       bankAccounts.value.push(each)
        //     }
        //   })
        // } else if (each.relatedHeader && each.relatedHeader.name === "Cash in Hand") {
        //   each._id === appStore.account._id && cashAccounts.value.push(each)
        // }
        if (each.relatedHeader && each.relatedHeader.name === "Cash in Hand") {
          each._id === appStore.account._id && cashAccounts.value.push(each)
        }
      }

      appStore.accountingList.bank.map(bankSet => {
        if (each.code === bankSet.code && each.subHeader === bankSet.name) {
          bankAccounts.value.push(each)
        }
      })
    })

    payload.value.selectedBankAccount = bankAccounts.value[0]
    payload.value.selectedCashAccount = cashAccounts.value[0]
    expenseAccountList.value = accountingListRes.list
    selectedExpenseAccount.value = expenseAccountList.value[0]
  } catch (error) {
    console.log(error)
  }
}

const fetchCurrencies = async () => {
  try {
    let currenciesRes = await currencyStore.fetchCurrencies()
    currencyList.value = currenciesRes.list
    payload.value.selectedInitialCurrency = currencyList.value.filter(each => each.code === 'MMK')[0]
    payload.value.selectedFinalCurrency = currencyList.value.filter(each => each.code === 'MMK')[0]
  } catch (error) {
    console.log(error)
  }
}

// const fetchAccountingLists = async () => {
//   try {
//     let res = await this.accountingListStore.fetchAccountingLists()


//   } catch (error) {
//     console.log(error)
//   }
// }

onMounted(async () => {
  try {
    await fetchCurrencies()
    await fetchAccountingLists()
    // payload.value.date = dateForParams()
    payload.value.date = cusFormatDate(new Date().toISOString())
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped></style>