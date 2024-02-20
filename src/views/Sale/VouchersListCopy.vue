<template>
  <template v-if="isLoading">
    <Loading />
  </template>
  <template v-else>
    <div>
      <div class="card p-3">
        <Heading :payload="{ title: 'Treatment Vouchers List' }" class="mb-3" />
        <div class="d-flex rounded p-3 border my-3">
          <div class="d-flex align-items-center me-3">
            <label class="form-label me-3 mb-0">Start date</label>
            <input v-model="filter.startDate" type="date" class="form-control" style="width: 200px">
          </div>
          <div class="d-flex align-items-center me-3">
            <label class="form-label me-3 mb-0">End date</label>
            <input v-model="filter.endDate" type="date" class="form-control" style="width: 200px">
          </div>
          <div class="d-flex align-items-center me-3">
            <button @click="getTreatmentVoucherFilter" class="btn btn-primary me-3">Filter</button>
            <button class="btn btn-primary" @click="exportList">Export</button>
          </div>
        </div>
        <div class="mb-3 d-flex rounded p-3 border">
          <div class="d-flex align-items-center gap-3 me-3">
            <label for="name" class="form-label mb-0">Doctor</label>
            <VueMultiselect :model-value="filter.doctor" @update:model-value="updateSelectedFilterDoctor"
              :options="doctors" :searchable="true" :close-on-select="true" :allow-empty="false" :option-height="31"
              label="name" track-by="_id" />
          </div>
          <div class="d-flex align-items-center gap-3 me-3">
            <label for="name" style="width: 150px" class="form-label mb-0">Sale Person</label>
            <VueMultiselect :model-value="filter.user" @update:model-value="updateSelectedFilterUser" :options="users"
              :searchable="true" :close-on-select="true" :allow-empty="false" :option-height="31" label="givenName"
              track-by="_id" />
          </div>
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
              <table ref="vouchersTable" class="table table-hover table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Code</th>
                    <th>Sale By</th>
                    <th>Payment Method</th>
                    <th>Payment Type</th>
                    <th>Customer Name</th>
                    <th>Customer Phone</th>
                    <th>Doctor</th>
                    <th>Deposit</th>
                    <th>Purchase Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in cashTableList" :key="'item' + item._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ cusFormatDate(item.createdAt) }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.createdBy?.givenName }}</td>
                    <td v-if="item.paymentMethod === 'FOC'">FOC</td>
                    <td v-if="item.paymentMethod === 'Advanced'">Paid</td>
                    <td v-if="item.paymentMethod === 'by Appointment'">Partial</td>
                    <td v-if="item.relatedCash">Cash</td>
                    <td v-if="!item.relatedCash">{{ item.paymentType ?? 'Not Set' }}</td>
                    <td>{{ item.relatedPatient?.name }}</td>
                    <td>{{ item.relatedPatient?.phone }}</td>
                    <td>{{ item.relatedTreatmentSelection.relatedAppointments[0].relatedDoctor.name }}</td>
                    <td>{{ item.relatedTreatmentSelection.deposit ?? 0 }}</td>
                    <td>{{ item.relatedTreatmentSelection.purchaseType }}</td>
                  </tr>
                  <tr class="text-center" v-if="cashTableList && cashTableList.length <= 0">
                    <td colspan="11">No record exist!</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
          <template v-if="selectedTab == 'bank'">
            <div class="table-responsive">
              <table ref="vouchersTable" class="table table-hover table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Code</th>
                    <th>Sale By</th>
                    <th>Payment Method</th>
                    <th>Payment Type</th>
                    <th>Customer Name</th>
                    <th>Customer Phone</th>
                    <th>Doctor</th>
                    <th>Deposit</th>
                    <th>Purchase Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in bankTableList" :key="'item' + item._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ cusFormatDate(item.createdAt) }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.createdBy?.givenName }}</td>
                    <td v-if="item.paymentMethod === 'FOC'">FOC</td>
                    <td v-if="item.paymentMethod === 'Advanced'">Paid</td>
                    <td v-if="item.paymentMethod === 'by Appointment'">Partial</td>
                    <td v-if="item.relatedBank">Bank</td>
                    <td v-if="!item.relatedBank">{{ item.paymentType ?? 'Not Set' }}</td>
                    <td>{{ item.relatedPatient?.name }}</td>
                    <td>{{ item.relatedPatient?.phone }}</td>
                    <td>{{ item.relatedTreatmentSelection[0]?.relatedAppointments.length > 0 ? x.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name : 'Not Set' }}</td>
                    <td>{{ item.relatedTreatmentSelection.deposit ?? 0 }}</td>
                    <td>{{ item.relatedTreatmentSelection.purchaseType ?? 'Not Set' }}</td>
                  </tr>
                  <tr class="text-center" v-if="bankTableList && bankTableList.length <= 0">
                    <td colspan="11">No record exist!</td>
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
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { exportData } from "../../helpers/index"
import _ from "lodash"
import { useUserStore } from "../../stores/user"
import { cusFormatDate } from "../../helpers"
import { useTreatmentVoucherStore } from "../../stores/treatmentVoucher"
import { useAppStore } from "../../stores/app";
import VueMultiselect from "vue-multiselect"
import { useDoctorStore } from "../../stores/doctor"

const appStore = useAppStore()
const userStore = useUserStore()
const doctorStore = useDoctorStore()
const treatmentVouchers = ref([])
const isLoading = ref(true)
const treatmentVoucherStore = useTreatmentVoucherStore()
const selectedTab = ref('bank')
const bankTableList = ref([])
const cashTableList = ref([])
const doctors = ref([])
const users = ref([])
const bankNames = ref({})
const cashNames = ref({})
const bankTotal = ref(0)
const cashTotal = ref(0)
const filter = ref({
  start: '',
  end: '',
  doctor: null,
  user: null
})

// const filter = ref({
//   tsType: null,
//   startDate: null,
//   endDate: null,
//   relatedDoctor: null,
//   relatedPatient: null,
//   createdBy: null,
//   bankType: null, // 'Normal', 'POS', 'Pay'
// })

const vouchersTable = ref(null)

const updateSelectedFilterDoctor = async (e) => {
  filter.value.doctor = e
  await getTreatmentVoucherFilter()
}

const updateSelectedFilterUser = async (e) => {
  filter.value.user = e
  await getTreatmentVoucherFilter()
}

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
          "Date": each.createdAt ? cusFormatDate(each.createdAt) : 'Not Set',
          "Code": each.code,
          "Sale By": each.createdBy?.givenName,
          "Payment Method": paymentMethod,
          "Payment Type": each.relatedCash ? 'Cash' : 'Bank',
          "Customer Name": each.relatedPatient?.name,
          "Customer Phone": each.relatedPatient?.phone,
          "Doctor": each.relatedTreatmentSelection.relatedAppointments[0].relatedDoctor.name,
          "Purchase Type": each.relatedTreatmentSelection.purchaseType
        }
      } else {
        return
      }

      data.push(item)
    })

    console.log(data)

    exportData(data, "TreatmentVoucherList.xlsx")
  }

}

const getTreatmentVoucherFilter = async () => {
  let payload = {}
  if (filter.value.start && filter.value.end) {
    payload = {
      start: new Date(filter.value.start).toISOString(),
      end: new Date(filter.value.end).toISOString()
    }
  }

  if (filter.value.doctor) {
    payload.relatedDoctor = filter.value.doctor._id
  }

  if (filter.value.user) {
    payload.createdBy = filter.value.user._id
  }

  try {
    let res = await treatmentVoucherStore.treatmentVoucherFilter(payload)
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

const fetchDoctors = async () => {
  try {
    let res = await doctorStore.fetchDoctors()
    console.log(res)
    doctors.value = res.data
  } catch (error) {
    throw error
  }
}

const fetchUsers = async () => {
  try {
    let res = await userStore.fetchUsers()
    users.value = res.list
    console.log(res)
  } catch (err) {
    console.log(err)
    throw err
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
    await getTreatmentVoucherFilter()
    await fetchDoctors()
    await fetchUsers()
  } catch (err) {
    console.log(err)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
tr th,
tr td {
  white-space: nowrap;
}
</style>
