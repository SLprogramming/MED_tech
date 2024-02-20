<template>
  <template v-if="isLoading">
    <Loading />
  </template>
  <template v-else>
    <div>
      <div class="card p-3">
        <Heading :payload="{ title: 'Treatment Vouchers List' }" class="mb-3" />
        <div class="mb-3 rounded p-3 border">
          <div class="d-flex mb-3">
            <div class="d-flex align-items-center me-3">
              <label class="form-label me-3 mb-0">Start date</label>
              <input v-model="filter.startDate" type="date" class="form-control" style="width: 200px">
            </div>
            <div class="d-flex align-items-center me-3">
              <label class="form-label me-3 mb-0">End date</label>
              <input v-model="filter.endDate" type="date" class="form-control" style="width: 200px">
            </div>
            <div class="d-flex align-items-center gap-3 me-3">
              <label for="name" class="form-label mb-0 text-nowrap">Voucher Type</label>
              <select @change="fetchTreatmentVouchers" v-model="filter.tsType" class="form-select"
                aria-label="Default select example">
                <option value="TS">TS</option>
                <option value="TSMulti">TSMulti</option>
                <option value="MS">MS</option>
                <option value="Combined">Combined</option>
              </select>
            </div>
            <div class="d-flex align-items-center gap-3 me-3">
              <label for="name" class="form-label mb-0 text-nowrap">Bank Type</label>
              <select @change="fetchTreatmentVouchers" v-model="filter.bankType" class="form-select"
                aria-label="Default select example">
                <option value="POS">POS</option>
                <option value="Normal">Normal</option>
                <option value="Pay">Pay</option>
              </select>
            </div>
          </div>
          <div class="mb-3 d-flex">
            <div class="d-flex align-items-center gap-3 me-3">
              <label for="name" class="form-label mb-0">Doctor</label>
              <VueMultiselect :model-value="filter.relatedDoctor" @update:model-value="updateSelectedFilterDoctor"
                :options="doctors" :searchable="true" :close-on-select="true" :allow-empty="false" :option-height="31"
                label="name" track-by="_id" />
            </div>
            <div class="d-flex align-items-center gap-3 me-3">
              <label for="name" style="width: 150px" class="form-label mb-0">Sale Person</label>
              <VueMultiselect :model-value="filter.createdBy" @update:model-value="updateSelectedFilterUser"
                :options="users" :searchable="true" :close-on-select="true" :allow-empty="false" :option-height="31"
                label="givenName" track-by="_id" />
            </div>
            <div class="d-flex align-items-center gap-3 me-3">
              <label for="name" class="form-label mb-0">Patient</label>
              <VueMultiselect :model-value="filter.relatedPatient" @update:model-value="updateSelectedFilterPatient"
                :options="patients" :searchable="true" :close-on-select="true" :allow-empty="false" :option-height="31"
                label="name" track-by="_id" />
            </div>
          </div>
          <div class="d-flex align-items-center justify-content-end">
            <button class="btn btn-primary me-3" @click="exportList">Export</button>
            <button class="btn btn-primary me-3" @click="reload">Reload</button>
            <button class="btn btn-primary" @click="fetchTreatmentVouchers">Filter</button>
          </div>
        </div>
        <div class="mb-3 d-flex justify-content-center">
          <button class="btn me-3" :class="{ 'btn-primary': selectedTab == 'bank' }" @click="selectedTab = 'bank'">Bank
            ({{ bankTotal }})</button>
          <button class="btn" :class="{ 'btn-primary': selectedTab == 'cash' }" @click="selectedTab = 'cash'">Cash ({{
            cashTotal }})</button>
        </div>
        <div class="table-responsive">
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
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in cashTableList" :key="'item' + item._id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ cusFormatDate(item.createdAt) }}</td>
                    <td>{{ item.code }}</td>
                    <td>{{ item.createdBy?.givenName }}</td>
                    <td>
                      <template v-if="item.paymentMethod === 'FOC'">
                        FOC
                      </template>
                      <template v-else-if="item.paymentMethod === 'Advanced'">
                        Paid
                      </template>
                      <template v-else-if="item.paymentMethod === 'by Appointment'">
                        Partial
                      </template>
                      <template v-else>
                        Not Set
                      </template>
                    </td>
                    <!-- <td v-if="item.paymentMethod === 'FOC'">FOC</td>
                    <td v-if="item.paymentMethod === 'Advanced'">Paid</td>
                    <td v-if="item.paymentMethod === 'by Appointment'">Partial</td>
                    <td v-else>Not Set</td> -->
                    <!-- <td v-if="item.relatedCash">Cash</td>
                    <td v-if="!item.relatedCash">{{ item.paymentType ?? 'Not Set' }}</td> -->
                    <td>
                      <template v-if="item.paymentMethod === 'Advanced' || item.relatedBank || item.relatedCash">
                        <template v-if="item.relatedCash">
                          Cash
                        </template>
                        <template v-if="item.relatedBank">
                          Bank
                        </template>
                      </template>
                      <template v-else>
                        {{ item.paymentType ?? 'Not Set' }}
                      </template>
                    </td>
                    <td>{{ item.relatedPatient?.name }}</td>
                    <td>{{ item.relatedPatient?.phone }}</td>
                    <!-- <td>{{ item.relatedTreatmentSelection.length > 0 ? item.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name : 'Not Set' }}</td> -->
                    <td>
                      <template v-if="item.relatedTreatmentSelection.length > 0">
                        {{ item.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name ?? 'Not Set' }}
                      </template>
                      <template v-else>
                        Not Set
                      </template>
                    </td>
                    <td>{{ item.relatedTreatmentSelection.deposit ?? 0 }}</td>
                    <td>{{ item.relatedTreatmentSelection.purchaseType ?? 'Not Set' }}</td>
                    <!-- <td v-if="item.tsType === 'MS'">{{ item.msTotalAmount ?? 0 }}</td>
                    <td v-if="item.tsType !== 'MS'">{{ item.totalAmount ?? 0 }}</td> -->
                    <td>
                      <template v-if="item.tsType === 'MS'">
                        {{ item.msTotalAmount ?? 0 }}
                      </template>
                      <template v-if="item.tsType !== 'MS'">
                        {{ item.totalAmount ?? 0 }}
                      </template>
                    </td>
                  </tr>
                  <tr class="text-center" v-if="cashTableList && cashTableList.length <= 0">
                    <td colspan="12">No record exist!</td>
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
                    <th>Bank Type</th>
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
                    <td>
                      <template v-if="item.paymentMethod === 'FOC'">
                        FOC
                      </template>
                      <template v-else-if="item.paymentMethod === 'Advanced' || item.relatedBank || item.relatedCash">
                        Paid
                      </template>
                      <template v-else-if="item.paymentMethod === 'by Appointment'">
                        Partial
                      </template>
                      <template v-else>
                        Not Set
                      </template>
                    </td>
                    <td>
                      <template v-if="item.paymentMethod === 'Advanced' || item.relatedBank || item.relatedCash">
                        <template v-if="item.relatedCash">
                          Cash
                        </template>
                        <template v-if="item.relatedBank">
                          Bank
                        </template>
                      </template>
                      <template v-else>
                        {{ item.paymentType ?? 'Not Set' }}
                      </template>
                    </td>
                    <td>{{ item.bankType ?? 'Not Set' }}</td>
                    <td>{{ item.relatedPatient?.name }}</td>
                    <td>{{ item.relatedPatient?.phone }}</td>
                    <td>{{ item.relatedTreatmentSelection[0]?.relatedAppointments.length > 0 ?
                      x.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name : 'Not Set' }}</td>
                    <td>{{ item.relatedTreatmentSelection.deposit ?? 0 }}</td>
                    <td>{{ item.relatedTreatmentSelection.purchaseType ?? 'Not Set' }}</td>
                  </tr>
                  <tr class="text-center" v-if="bankTableList && bankTableList.length <= 0">
                    <td colspan="12">No record exist!</td>
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
import { onMounted } from 'vue';
import { cusFormatDate, exportData } from "../../helpers/index"
import { useTreatmentVoucherStore } from '../../stores/treatmentVoucher';
import { ref } from 'vue';
import { useDoctorStore } from '../../stores/doctor';
import { useUserStore } from '../../stores/user';
import VueMultiselect from "vue-multiselect"
import { usePatientStore } from '../../stores/patient';

const isLoading = ref(true)
const treatmentVoucherStore = useTreatmentVoucherStore()
const treatmentVouchers = ref([])
const doctorStore = useDoctorStore()
const userStore = useUserStore()
const patientStore = usePatientStore()
const doctors = ref([])
const users = ref([])
const patients = ref([])

const selectedTab = ref('bank')
const bankTableList = ref([])
const cashTableList = ref([])
const bankNames = ref({})
const cashNames = ref({})
const bankTotal = ref(0)
const cashTotal = ref(0)

const filter = ref({
  tsType: 'MS',
  startDate: null,
  endDate: null,
  relatedDoctor: null,
  relatedPatient: null,
  createdBy: null,
  bankType: null, // 'Normal', 'POS', 'Pay'
})

const exportList = () => {
  let src = []
  // if (selectedTab.value == 'bank') src = [...bankTableList.value]
  // if (selectedTab.value == 'cash') src = [...cashTableList.value]
  if (treatmentVouchers.value.length > 0) {
    src = [
      ...treatmentVouchers.value
    ]
    const data = []
    src.map((each, index) => {

      let item = {}
      let paymentMethod
      if (each.paymentMethod === 'FOC') paymentMethod = 'FOC'
      if (each.paymentMethod === 'Advanced') paymentMethod = 'Paid'
      if (each.paymentMethod === 'by Appointment') paymentMethod = 'Partial'

      item =
      {
        "Date": each.createdAt ? cusFormatDate(each.createdAt) : 'Not Set',
        "Code": each.code,
        "Sale By": each.createdBy?.givenName,
        "Payment Method": paymentMethod ?? 'Not Set',
        "Payment Type": each.relatedCash ? 'Cash' : 'Bank',
        "Customer Name": each.relatedPatient?.name,
        "Customer Phone": each.relatedPatient?.phone,
        "Doctor": each.relatedTreatmentSelection[0]?.relatedAppointments.length > 0 ? each.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name : 'Not Set',
        "Deposit": each.relatedTreatmentSelection.deposit ?? 0
      }

      data.push(item)
    })

    console.log(data)

    exportData(data, "TreatmentVoucherList.xlsx")
  }

}

const reload = async () => {
  filter.value = {
    tsType: 'MS',
    startDate: null,
    endDate: null,
    relatedDoctor: null,
    relatedPatient: null,
    createdBy: null,
    bankType: null, // 'Normal', 'POS', 'Pay'
  }

  await fetchTreatmentVouchers()
}

const updateSelectedFilterDoctor = (e) => {
  filter.value.relatedDoctor = { ...e }
}

const updateSelectedFilterUser = (e) => {
  filter.value.createdBy = { ...e }
}

const updateSelectedFilterPatient = (e) => {
  filter.value.relatedPatient = { ...e }
}

const fetchTreatmentVouchers = async () => {
  isLoading.value = true

  let payload = {}

  if (filter.value.tsType) payload.tsType = filter.value.tsType
  if (filter.value.startDate) payload.startDate = filter.value.startDate
  if (filter.value.endDate) payload.endDate = filter.value.endDate
  if (filter.value.createdBy) payload.createdBy = filter.value.createdBy._id
  if (filter.value.bankType) payload.bankType = filter.value.bankType
  if (filter.value.relatedDoctor) payload.relatedDoctor = filter.value.relatedDoctor._id
  if (filter.value.relatedPatient) payload.relatedPatient = filter.value.relatedPatient._id

  console.log(payload)
  try {
    let res = await treatmentVoucherStore.treatmentVoucherFilter(payload)
    console.log('voucher data', res)
    // treatmentVouchers.value = res.data
    bankTableList.value = res.data.BankList
    cashTableList.value = res.data.CashList
    cashTotal.value = res.data.CashTotal
    bankTotal.value = res.data.BankTotal
    cashNames.value = res.data.CashNames
    bankNames.value = res.data.BankNames
  } catch (error) {
    console.log(error)
    throw error
  } finally {
    isLoading.value = false
  }
}

const fetchPatients = async () => {
  try {
    let res = await patientStore.fetchPatients()
    console.log(res)
    patients.value = res.list
  } catch (error) {
    console.log(error)
    throw error
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
  await fetchTreatmentVouchers()
  await fetchDoctors()
  await fetchUsers()
  await fetchPatients()
})
</script>

<style lang="scss" scoped>
tr th,
tr td {
  white-space: nowrap;
}
</style>
