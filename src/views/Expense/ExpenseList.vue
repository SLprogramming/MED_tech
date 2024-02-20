<template>
  <template v-if="isLoading">
    <Loading />
  </template>
  <template v-else>
    <div>
      <div class="card p-3">
        <div class="d-flex justify-content-between">
          <Heading :payload="{ title: 'Expense List' }" class="mb-3" />
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#expenseCreateModal">
            + Expense
          </button>
        </div>
        <div class="d-flex rounded p-3 border my-3">
          <div class="d-flex align-items-center me-3">
            <label class="form-label me-3 mb-0">Start date</label>
            <input v-model="filter.start" type="date" class="form-control" style="width: 200px">
          </div>
          <div class="d-flex align-items-center me-3">
            <label class="form-label me-3 mb-0">End date</label>
            <input v-model="filter.end" type="date" class="form-control" style="width: 200px">
          </div>
          <button @click="getExpenseFilter" class="btn btn-primary me-3">Filter</button>
          <button class="btn btn-primary me-3" @click="exportList">Export</button>
        </div>
        <div class="mb-3 d-flex justify-content-center">
          <button class="btn me-3" :class="{ 'btn-primary': selectedTab == 'bank' }" @click="selectedTab = 'bank'">Bank
            ({{ bankTotal }})</button>
          <button class="btn" :class="{ 'btn-primary': selectedTab == 'cash' }" @click="selectedTab = 'cash'">Cash ({{
            cashTotal }})</button>
        </div>
        <div>
          <template v-if="selectedTab == 'cash'">
            <div class="table-responsive">
              <table class="table table-hover table-striped">
                <thead>
                  <tr>
                    <td>#</td>
                    <td>Date</td>
                    <td>Bank/Cash Account</td>
                    <td>Balance</td>
                    <td>Currency</td>
                    <td>Remark</td>
                    <td>Action</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="cashTableList.length > 0" v-for="(item, index) in cashTableList" :key="'item' + item._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.date ? formatDate(item.date) : 'Not set' }}</td>
                    <td>{{ item.relatedBankAccount ? item.relatedBankAccount.name : item.relatedCashAccount.name }}</td>
                    <td>{{ item.finalAmount ?? item.initialAmount }}</td>
                    <td>{{ item.finalCurrency }}</td>
                    <td>{{ item.remark ?? 'Not set' }}</td>
                    <td>
                      <router-link :to="{ name: 'account.expense.edit', params: { id: item._id } }" custom
                        v-slot="{ navigate }">
                        <button class="me-3 btn btn-warning" @click.stop="navigate" @keypress.enter="navigate"
                          role="link">
                          <i class="bi bi-pencil-square"></i>
                        </button>
                      </router-link>
                      <button @click.stop="deleteExpense(item._id)" class="btn btn-danger">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr class="text-center" v-if="cashTableList && cashTableList.length <= 0">
                    <td colspan="9">No record exist!</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-if="selectedTab == 'bank'">
            <div class="table-responsive">
              <table class="table table-hover table-striped">
                <thead>
                  <tr>
                    <td>#</td>
                    <td>Date</td>
                    <td>Bank/Cash Account</td>
                    <td>Balance</td>
                    <td>Currency</td>
                    <td>Remark</td>
                    <td>Action</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="bankTableList.length > 0" v-for="(item, index) in bankTableList" :key="'item' + item._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.date ? formatDate(item.date) : 'Not set' }}</td>
                    <td>{{ item.relatedBankAccount ? item.relatedBankAccount.name : item.relatedCashAccount.name }}</td>
                    <td>{{ item.finalAmount ?? item.initialAmount }}</td>
                    <td>{{ item.finalCurrency }}</td>
                    <td>{{ item.remark ?? 'Not set' }}</td>
                    <td>
                      <router-link :to="{ name: 'account.expense.edit', params: { id: item._id } }" custom
                        v-slot="{ navigate }">
                        <button class="me-3 btn btn-warning" @click.stop="navigate" @keypress.enter="navigate"
                          role="link">
                          <i class="bi bi-pencil-square"></i>
                        </button>
                      </router-link>
                      <button @click.stop="deleteExpense(item._id)" class="btn btn-danger">
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                  <tr class="text-center" v-if="bankTableList && bankTableList.length <= 0">
                    <td colspan="9">No record exist!</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <div class="row mt-3">
            <div class="col-6" v-if="Object.keys(bankNames).length > 0">
              <h4>Bank List</h4>
              <div v-for="(each, index) in bankNames">
                <div class="d-flex gap-3">
                  <div class="fw-bold">{{ index }} : </div>
                  <div>{{ each }}</div>
                </div>
              </div>
            </div>
            <div class="col-6" v-if="Object.keys(cashNames).length > 0">
              <h4>Cash List</h4>
              <div v-for="(each, index) in cashNames">
                <div class="d-flex gap-3">
                  <div class="fw-bold">{{ index }} : </div>
                  <div>{{ each }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ExpenseCreate @refetchExpense="getExpenseFilter" />
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { cusFormatDate, exportData, formatDate, dateForParams } from "../../helpers"
import { useMedicineSaleStore } from "../../stores/medicineSale"
import PrintModal from "../../components/Sale/MedicineSaleList/PrintModal.vue"
import { useExpenseStore } from "../../stores/expense";
import ExpenseCreate from "./ExpenseCreate.vue";
import { useAppStore } from "../../stores/app";

const appStore = useAppStore()
const expenseStore = useExpenseStore()
const table = ref()
const expenseList = ref([])
const isLoading = ref(true)
const selectedTab = ref('bank')
const bankTableList = ref([])
const cashTableList = ref([])
const bankNames = ref({})
const cashNames = ref({})
const bankTotal = ref(0)
const cashTotal = ref(0)
const filter = ref({
  start: '',
  end: ''
})

const exportList = () => {
  let src = []
  // if (selectedTab.value == 'bank') src = [...bankTableList.value]
  // if (selectedTab.value == 'cash') src = [...cashTableList.value]
  if (bankTableList.value.length > 0 || cashTableList.value.length > 0) {
    src = [
      { type: 'banklist' },
      ...bankTableList.value,
      { type: 'cashlist' },
      ...cashTableList.value
    ]
    const data = []
    src.map((each, index) => {

      let item = {}
      let paymentMethod
      if (each.paymentMethod === 'FOC') paymentMethod = 'FOC'
      if (each.paymentMethod === 'Advanced') paymentMethod = 'Paid'
      if (each.paymentMethod === 'by Appointment') paymentMethod = 'Partial'

      if (each.type === 'banklist' && bankTableList.value.length > 0) {
        item = {
          "Type": "Bank List"
        }
      } else if (each.type === 'cashlist' && cashTableList.value.length > 0) {
        item = {
          "Type": "Cash List"
        }
      } else if (each.type !== 'banklist' && each.type !== 'cashlist') {
        item =
        {
          "Date": each.date ? cusFormatDate(each.date) : 'Not Set',
          "Bank/Cash Account": each.relatedBankAccount ? each.relatedBankAccount.name : each.relatedCashAccount.name,
          "Balance": each.finalAmount ?? each.initialAmount,
          "Currency": each.finalCurrency,
          "Remark": each.remark
        }
      } else {
        return
      }

      data.push(item)
    })

    console.log(data)

    exportData(data, "ExpenseList.xlsx")
  }
}

const addExpenseList = (data) => {
  expenseList.value.push(data)
}

const getExpenseList = async () => {
  try {
    let res = await expenseStore.fetchExpenses()
    console.log(res)
    expenseList.value = res.list.reverse()
    // expenseList.value = res.list.reverse()
    // tableData.value = expenseList.value.map(each => {
    //   each.date = formatDate(each.date)
    //   console.log(each)
    //   console.log(EditButton.value)
    //   let newObj = {
    //     date: each.date,
    //     acc: each.relatedBankAccount ? each.relatedBankAccount.name : each.relatedCashAccount.name,
    //     finalAmount: each.finalAmount ?? each.initialAmount,
    //     finalCurrency: each.finalCurrency ?? "Not Set",
    //     remark: each.remark ?? 'not set',
    //     action: `<button class="btn btn-primary" onclick="editButtonClicked()">Edit</button>`
    //   }
    //   return newObj
    // })
  } catch (error) {
    console.log(error)
    throw error
  }
}

const deleteExpense = async id => {
  let res = confirm("Want to delete expense ?")
  if (res) {
    try {
      let res = await expenseStore.deleteExpense({ id })
      console.log(res)
      expenseList.value = expenseList.value.filter(each => each._id !== id)
      appStore.showSuccess()
    } catch (error) {
      appStore.showError()
      console.log(error)
    }
  }
}

const getExpenseFilter = async () => {
  if (filter.value.start && filter.value.end) {
    const payload = {
      start: new Date(filter.value.start).toISOString(),
      end: new Date(filter.value.end).toISOString()
    }
    try {
      let res = await expenseStore.expenseFilter(payload)
      console.log(res)
      bankTableList.value = res.data.BankList
      cashTableList.value = res.data.CashList
      cashTotal.value = res.data.CashTotal
      bankTotal.value = res.data.BankTotal
      cashNames.value = res.data.CashNames
      bankNames.value = res.data.BankNames
    } catch (err) {
      console.log(err)
    }
  }
}

onMounted(async () => {
  try {
    let today = new Date()
    let yesterday = new Date()
    let tomorrow = new Date()
    yesterday.setDate(today.getDate() - 1)
    tomorrow.setDate(today.getDate() + 1)
    filter.value.start = cusFormatDate(yesterday.toISOString())
    filter.value.end = cusFormatDate(tomorrow.toISOString())
    await getExpenseFilter()
    // medicineSaleList.value = medicineSaleList.value.map(each => {
    //   each.id = each._id
    //   return each 
    // })
    // originalMedicineSaleList.value = medicineSaleList.value
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
tbody {
  tr:hover {
    cursor: pointer;
  }
}
</style>
