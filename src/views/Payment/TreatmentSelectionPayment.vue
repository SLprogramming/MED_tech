<template>
  <template v-if="isLoading">
    <div>Loading...</div>
  </template>
  <template v-else>
    <div class="row">
      <div class="col-12">
        <div class="card shadow-sm p-3">
          <h3 class="">Treatment Selecitons</h3>
          <div class="d-flex align-items-center justify-content-end mb-3">
            <button v-if="treatmentSelection.paymentMethod !== 'FOC'" :disabled="unfinishedAppointments.length <= 0"
              @click="calculatePaidAmount" class="btn btn-primary" data-bs-toggle="modal"
              data-bs-target="#treatmentSelectionPaymentBox">
              Repayment
            </button>
          </div>
          <hr />
          <div v-if="treatmentSelection.paymentMethod === 'Cash Down'" class="d-flex align-items-center mb-3 gap-3">
            <button class="btn" :class="{ 'btn-primary': currentTab === 'current' }" @click="currentTab = 'current'">
              Voucher
            </button>
            <button class="btn" :class="{ 'btn-primary': currentTab === 'repayment' }" @click="currentTab = 'repayment'">
              Repayment
            </button>
          </div>
          <div v-show="treatmentSelection.paymentMethod === 'Credit'" class="table-responsive mb-3">
            <h3 class="mb-0">Vouchers List</h3>
            <table class="table table-borderless table-striped">
              <thead>
                <tr>
                  <th class="text-nowrap" scope="col">#</th>
                  <th class="text-nowrap" scope="col">Code</th>
                  <th class="text-nowrap" scope="col">Amount</th>
                  <th class="text-nowrap" scope="col">Payment Method</th>
                  <th class="text-nowrap" scope="col">Payment Type</th>
                  <th class="text-nowrap" scope="col">Bank Type</th>
                  <th class="text-nowrap" scope="col">Appointment Date</th>
                  <th class="text-nowrap" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr style="vertical-align: middle" v-for="(item, index) in treatmentVouchers">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.code }}</td>
                  <td>{{ item.amount }}</td>
                  <td><span class="badge bg-warning">Partial</span></td>
                  <td>{{ item.paymentType }}</td>
                  <td v-if="item.bankType">{{ item.bankType }}</td>
                  <td v-else>Not Set</td>
                  <td>
                    {{
                      item.relatedAppointment?.originalDate
                      ? cusFormatDate(item.relatedAppointment.originalDate)
                      : "Not Set"
                    }}
                  </td>
                  <td>
                    <router-link v-if="item.relatedAppointment" :to="{
                      name: 'procedure-history.create',
                      query: {
                        currentTab: 'usage',
                        treatmentSelectionId: treatmentSelection._id,
                        appointmentId: item.relatedAppointment._id,
                        patientId: treatmentSelection.relatedPatient._id,
                      },
                    }" custom v-slot="{ navigate }">
                      <button class="btn btn-primary" @click="navigate" @keypress.enter="navigate" role="link">
                        Usage
                      </button>
                    </router-link>
                  </td>
                  <!-- <td v-if="">
                  
                  </td> -->
                  <!-- <td>
                    <button
                      class="btn btn-primary"
                      @click="selectTreatmentSelection(selection)"
                      data-bs-toggle="modal"
                      data-bs-target="#treatmentSelectionPaymentBox"
                    >
                      Repay
                    </button>
                  </td> -->
                </tr>
                <tr v-if="treatmentVouchers && treatmentVouchers.length <= 0">
                  <td colspan="9" class="text-center">No record exist!</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="treatmentSelection.paymentMethod === 'FOC'" class="table-responsive mb-3">
            <h3 class="mb-0">Vouchers List</h3>
            <table class="table table-borderless table-striped">
              <thead>
                <tr>
                  <th class="text-nowrap" scope="col">#</th>
                  <th class="text-nowrap" scope="col">Code</th>
                  <th class="text-nowrap" scope="col">Amount</th>
                  <th class="text-nowrap" scope="col">Payment Method</th>
                </tr>
              </thead>
              <tbody>
                <tr style="vertical-align: middle" v-for="(item, index) in treatmentVouchers">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.code }}</td>
                  <td>{{ item.amount }}</td>
                  <td><span class="badge" style="background: rgb(2, 2, 128)">{{ item.paymentMethod }}</span></td>
                  <!-- <td>
										{{
											item.relatedAppointment?.originalDate
												? cusFormatDate(item.relatedAppointment.originalDate)
												: "Not Set"
										}}
									</td> -->
                  <td v-if="item.paymentType">{{ item.paymentType }}</td>
                </tr>
                <tr v-if="treatmentVouchers && treatmentVouchers.length <= 0">
                  <td colspan="8" class="text-center">No record exist!</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="treatmentSelection.paymentMethod === 'Cash Down' &&
            currentTab === 'current'
            " class="table-responsive">
            <table class="table table-borderless table-striped">
              <thead>
                <tr>
                  <th class="text-nowrap" scope="col">#</th>
                  <th class="text-nowrap" scope="col">Code</th>
                  <th class="text-nowrap" scope="col">Amount</th>
                  <th class="text-nowrap" scope="col">Payment Method</th>
                  <th class="text-nowrap" scope="col">Type</th>
                  <th v-if="treatmentVouchers[0]?.bankType" class="text-nowrap" scope="col">Bank Type</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in treatmentVouchers">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.code }}</td>
                  <td>{{ item.amount }}</td>
                  <td>
                    <span class="badge rounded-pill" :class="{
                      'bg-success': item.paymentMethod === 'Advanced'
                      , 'bg-warning': item.paymentMethod !== 'Advanced'
                    }">{{ item.paymentMethod === "Advanced" ? "Paid" : "Partial" }}</span>
                  </td>
                  <!-- <td>
										{{
											item.relatedAppointment?.originalDate
												? cusFormatDate(item.relatedAppointment.originalDate)
												: "Not Set"
										}}
									</td> -->
                  <td v-if="item.paymentType && item.paymentType !== 'FOC'">
                    {{ item.paymentType }}
                  </td>
                  <td v-else>{{ item.relatedBank ? "Bank" : "Cash" }}</td>
                  <td v-if="item.bankType">{{ item.bankType }}</td>
                </tr>
                <tr v-if="treatmentVouchers && treatmentVouchers.length <= 0">
                  <td colspan="9" class="text-center">No record exist!</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-show="treatmentSelection.paymentMethod === 'Cash Down' &&
            currentTab === 'repayment'
            " class="table-responsive">
            <table class="table table-borderless table-striped">
              <thead>
                <tr>
                  <th class="text-nowrap" scope="col">#</th>
                  <th class="text-nowrap" scope="col">Date</th>
                  <th class="text-nowrap" scope="col">Treatment</th>
                  <th class="text-nowrap" scope="col">Appointment Date</th>
                  <th class="text-nowrap" scope="col">Paid Amount</th>
                  <th class="text-nowrap" scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in repayments">
                  <td>{{ index + 1 }}</td>
                  <td>{{ cusFormatDate(item.createdAt) }}</td>
                  <td>{{ treatmentSelection.relatedTreatment.name }}</td>
                  <td>
                    {{
                      item.relatedAppointment
                      ? cusFormatDate(item.relatedAppointment?.originalDate)
                      : "Not set"
                    }}
                  </td>
                  <td v-if="index === 0 &&
                      treatmentSelection.paymentMethod === 'Cash Down'
                      ">
                    {{ treatmentSelection.totalAmount + item.paidAmount }}
                  </td>
                  <td v-else>{{ item.paidAmount }}</td>
                  <td>
                    <router-link v-if="item.relatedAppointment" :to="{
                      name: 'procedure-history.create',
                      query: {
                        currentTab: 'usage',
                        treatmentSelectionId: treatmentSelection._id,
                        appointmentId: item.relatedAppointment._id,
                        patientId: treatmentSelection.relatedPatient._id,
                      },
                    }" custom v-slot="{ navigate }">
                      <button class="btn btn-primary" @click="navigate" @keypress.enter="navigate" role="link">
                        Usage
                      </button>
                    </router-link>
                  </td>
                  <!-- <td>
                    <button
                      class="btn btn-primary"
                      @click="selectTreatmentSelection(selection)"
                      data-bs-toggle="modal"
                      data-bs-target="#treatmentSelectionPaymentBox"
                    >
                      Repay
                    </button>
                  </td> -->
                </tr>
                <tr v-if="repayments && repayments.length <= 0">
                  <td colspan="9" class="text-center">No record exist!</td>
                </tr>
              </tbody>
            </table>
          </div>
          <template v-if="treatmentSelection.paymentMethod === 'FOC'">
            <h3>Appointment List</h3>
            <div class="table-responsive">
              <table class="table table-borderless table-striped">
                <thead>
                  <tr>
                    <th class="text-nowrap" scope="col">#</th>
                    <th class="text-nowrap" scope="col">Date</th>
                    <th class="text-nowrap" scope="col">Treatment</th>
                    <th class="text-nowrap" scope="col">Appointment Date</th>
                    <th class="text-nowrap" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(
											item, index
										) in treatmentSelection.relatedAppointments">
                    <td>{{ index + 1 }}</td>
                    <td>{{ cusFormatDate(item.createdAt) }}</td>
                    <td>{{ treatmentSelection.relatedTreatment.name }}</td>
                    <td>
                      {{ item ? cusFormatDate(item.originalDate) : "Not set" }}
                    </td>
                    <td>
                      <router-link :to="{
                        name: 'procedure-history.create',
                        query: {
                          currentTab: 'usage',
                          treatmentSelectionId: treatmentSelection._id,
                          appointmentId: item._id,
                          patientId: treatmentSelection.relatedPatient._id,
                        },
                      }" custom v-slot="{ navigate }">
                        <button class="btn btn-primary" @click="navigate" @keypress.enter="navigate" role="link">
                          Usage
                        </button>
                      </router-link>
                    </td>
                  </tr>
                  <tr v-if="treatmentSelection.relatedAppointments &&
                    treatmentSelection.relatedAppointments.length <= 0
                    ">
                    <td colspan="9" class="text-center">No record exist!</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="modal fade" ref="paymentModal" id="treatmentSelectionPaymentBox" tabindex="-1"
      aria-labelledby="treatmentSelectionPaymentBoxLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="treatmentSelectionPaymentBoxLabel">
              Repayment
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <form ref="repaymentForm" @submit="prevent">
            <div class="modal-body">
              <div class="mb-3">
                <label for="appointments" class="form-label">Appointments</label>
                <select id="appointments" class="form-select" v-model="data.selectedAppointment"
                  aria-label="Select Appointments" placeholder="Select Appointments">
                  <option v-for="(appointment, index) in unfinishedAppointments" :value="appointment">
                    {{ cusFormatDate(appointment.originalDate) }}
                  </option>
                </select>
              </div>
              <template v-if="this.treatmentSelection.paymentMethod === 'Credit'">
                <div class="mb-3">
                  <label for="paymentType" class="form-label">Payment Type</label>
                  <select class="form-select" v-model="paymentType" aria-label="Select Payment Type">
                    <option disabled>Select Payment Type</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank</option>
                  </select>
                </div>
                <div v-if="paymentType === 'Bank'" class="mb-3">
                  <label for="bankAccountType" class="form-label">Bank Payment Type</label>
                  <select id="bankAccountType" class="form-select" v-model="selectedBankAccountType"
                    aria-label="Default select example" placeholder="select Account">
                    <option v-for="(acc, index) in bankAccountTypes" :value="acc">
                      {{ acc.name }}
                    </option>
                  </select>
                </div>
                <div v-if="paymentType === 'Bank'" class="mb-3">
                  <label for="bankAccount" class="form-label">Bank Accounts</label>
                  <select id="bankAccount" class="form-select" v-model="selectedBankAccount"
                    aria-label="Default select example" placeholder="select Account">
                    <option v-for="(acc, index) in bankAccounts" :value="acc">
                      {{ acc.name }}
                    </option>
                  </select>
                </div>
                <div v-if="paymentType === 'Cash'" class="mb-3">
                  <label for="cashAccount" class="form-label">Cash Accounts</label>
                  <select id="cashAccount" class="form-select" v-model="selectedCashAccount"
                    aria-label="Default select example" placeholder="select Account">
                    <option v-for="(acc, index) in cashAccounts" :value="acc">
                      {{ acc.name }}
                    </option>
                  </select>
                </div>
              </template>
              <div class="mb-3">
                <label for="leftOverAmount" class="form-label">Left Over Amount</label>
                <input :value="treatmentSelection?.leftOverAmount" id="leftOverAmount" type="text" class="form-control"
                  disabled />
              </div>
              <div class="mb-3">
                <label for="paidAmount" class="form-label">Paid Amount</label>
                <input v-model="data.paidAmount" @keyup="calculateRemainingAmount" @change="calculateRemainingAmount"
                  id="paidAmount" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="remainingAmount" class="form-label">Remaining Amount</label>
                <input v-model="data.remainingAmount" id="remainingAmount" type="number" class="form-control" disabled />
              </div>
              <div class="mb-3">
                <label for="remark" class="form-label">Payment Description(Remark)</label>
                <input v-model="data.remark" id="remark" type="text" class="form-control" />
              </div>
              <div class="mb-3">
                <label for="paymentImage" class="form-label">Payment Image</label>
                <input type="file" class="form-control" name="payment" id="paymentImage">
              </div>
              <div class="mb-3" v-if="treatmentSelection.paymentMethod === 'Credit'">
                <div class="form-check">
                  <input v-model="data.print" class="form-check-input" type="checkbox" value="" id="printOption" />
                  <label class="form-check-label" for="printOption">
                    Print
                  </label>
                </div>
              </div>
              <div class="mb-3" v-if="treatmentSelection.paymentMethod === 'Credit'">
                <div class="form-check">
                  <input v-model="data.email" class="form-check-input" type="checkbox" value="" id="emailOption" />
                  <label class="form-check-label" for="emailOption">
                    Email
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button id="closebutton" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" class="btn btn-primary" :disabled="submitting" @click="repay">
                {{ submitting ? 'Paying' : 'Pay' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- <button class="btn btn-primary" @click="openRepaymentVoucherModal">testopne</button> -->
    <!-- <TreatmentPrintVoucher :type="data.printVoucherType" @print="printVoucher" :voucherData="voucherData"
      :treatmentSelection="treatmentSelection" :relatedAppointment="data.selectedAppointment" /> -->
    <SaleVoucherModal :paymentMethod="paymentMethod" :treatmentData="treatmentData"
      :customer="treatmentSelection.relatedPatient" :treatmentSelectionId="treatmentSelection._id"
      :treatments="selectedItems" :invoiceId="voucherId" :appointment="data.selectedAppointment" />
    <!-- <button class="btn btn-primary" @click="showRepaymentVoucherModal">show voucher</button> -->
    <div ref="castVoucherDisplay" id="castVoucherDisplay" class="card p-3 border-0 rounded shadow-sm d-none">
        <!-- html2canvas is not working without actual content(CastSaleVoucherModal) -->
        <CastSaleVoucherModal :paymentMethod="paymentMethod" :treatmentData="treatmentData"
        :customer="treatmentSelection.relatedPatient" :treatmentSelectionId="treatmentSelection._id"
        :treatments="selectedItems" :invoiceId="voucherId" :appointment="data.selectedAppointment" />
    </div>
  </template>
</template>

<script>
import { cusFormatDate, dateForParams, openDialog, openPrint } from "../../helpers"
import bootstrap from "bootstrap/dist/js/bootstrap.min"
import { getAxiosClient } from "@/data/axios.js"
import TreatmentPrintVoucher from "../../components/TreatmentSelectionPayment/TreatmentPrintVoucher.vue"
import { usePatientStore } from "../../stores/patient"
import { useTreatmentSelectionStore } from "../../stores/treatmentSelection"
import { useAppointmentStore } from "../../stores/appointment"
import { useAppStore } from "../../stores/app"
import { useAccountingListStore } from "../../stores/accountingList"
import { repaymentVoucherRes } from "../../mock/treatment"
import SaleVoucherModal from "../../components/General/SaleVoucherModal.vue"
import CastSaleVoucherModal from "../../components/General/CastSaleVoucherModal.vue"
import html2canvas from "html2canvas"
export default {
  setup() {
    const patientStore = usePatientStore()
    const treatmentSelectionStore = useTreatmentSelectionStore()
    const appointmentStore = useAppointmentStore()
    const appStore = useAppStore()
    const accountingListStore = useAccountingListStore()
    return {
      patientStore,
      treatmentSelectionStore,
      appointmentStore,
      appStore,
      accountingListStore,
    }
  },
  props: ["patientId"],
  components: {
    TreatmentPrintVoucher,
    SaleVoucherModal,
    CastSaleVoucherModal
  },
  data() {
    return {
      isLoading: true,
      filter: {
        start: "",
        end: "",
        search: "",
      },
      bankAccountTypes: [
        {
          name: "Pos",
          value: "POS",
        },
        {
          name: "Normal",
          value: "Normal",
        },
        {
          name: "Pay",
          value: "Pay",
        },
      ],
      selectedBankAccountType: null,
      paymentMethod: "Credit",
      paymentType: "Cash",
      treatmentVouchers: [],
      treatmentSelection: {},
      data: {
        print: false,
        email: true,
        paidAmount: 0,
        remainingAmount: 0,
        selectedAppointment: "",
        remark: "",
        printVoucherType: "normal",
        imageFile: null
      },
      repayments: [],
      cashAccounts: [],
      bankAccounts: [],
      selectedBankAccount: {},
      selectedCashAccount: {},
      voucherData: {},
      isVoucherModalOn: false,
      currentTab: "current",
      changeTotal: false,
      submitting: false,
      // voucher modal data
      selectedItems: [],
      treatmentData: {},
      voucherId: '',
      voucherPaymentMethod: '',
      castVoucherDisplay: null,
      // end voucher modal data
    }
  },
  computed: {
    unfinishedAppointments() {
      return this.treatmentSelection.relatedAppointments.filter(
        item => item.status == false
      )
    },
  },
  methods: {
    cusFormatDate,
    closeModal() {
      const cancelButton = document.querySelector("#closebutton")
      cancelButton.click()
    },
    prepareVoucherData(data = repaymentVoucherRes) {
      console.log(data)
      this.selectedItems = []
      let newObj = {
        name: data.data.relatedTreatment.name,
        price: data.data.relatedTreatment.sellingPrice,
        qty: 1,
        discountValue: data.treatmentVoucherResult.discountAmount ?? 0,
      }
      newObj.subTotal = +newObj.price - +newObj.discountValue
      this.selectedItems.push(newObj)
      this.treatmentData = {
        paidAmount: data.data.paidAmount,
        totalAmount: newObj.subTotal,
        discount: 0
      }
      this.voucherPaymentMethod = data.data.paymentMethod
      this.voucherId = data ? data.treatmentVoucherResult.code : 'N/A'
    },
    cusFormatDate,
    updateTreatmentSelectionAppointment(id) {
      this.treatmentSelection.relatedAppointments = [
        ...this.treatmentSelection.relatedAppointments.filter(
          item => item._id !== id
        ),
      ]
    },
    searchAppointmentsByDate() {
      return
    },
    searchAppointmentsThrottle() {
      return
    },
    calculateRemainingAmount() {
      this.data.remainingAmount =
        this.treatmentSelection.leftOverAmount - this.data.paidAmount
    },
    getPaidAmount() {
      return Math.round(
        Number(this.treatmentSelection.totalAmount) /
        Number(this.treatmentSelection.treatmentTimes)
      )
    },
    calculatePaidAmount() {
      this.data.paidAmount = this.getPaidAmount()
      this.calculateRemainingAmount()
    },
    prepareForm() {
      let data = {
        relatedAppointment: this.data.selectedAppointment._id,
        paidAmount: this.data.paidAmount,
        leftOverAmount: this.treatmentSelection.leftOverAmount,
        relatedTreatment: this.treatmentSelection.relatedTreatment._id,
        relatedPatient: this.treatmentSelection.relatedPatient._id,
        paymentMethod: this.treatmentSelection.paymentMethod,
        id: this.treatmentSelection._id,
        purchaseType: this.treatmentSelection.purchaseType
      }

      if (this.data.remark) data.remark = this.data.remark
      if (this.data.purchaseType) data.purchaseType = this.data.purchaseType

      if (this.treatmentSelection.paymentMethod === "Credit") {
        data.paymentType = this.paymentType //enum: ['Bank','Cash']

        if (data.paymentType === "Cash") {
          data.relatedCash = this.selectedCashAccount._id
        } else if (data.paymentType === "Bank") {
          data.relatedBank = this.selectedBankAccount._id
          data.bankType = this.selectedBankAccountType.value
        }
      }

      if (
        this.treatmentSelection.paymentMethod === "Cash Down" &&
        this.changeTotal
      ) {
        data.paidAmount = -(data.leftOverAmount - data.paidAmount)
      }

      // if (this.paymentMethod === "by Appointment") {
      //   this.relatedAppointment = this.data.selectedAppointment._id;
      // }

      console.log(data)

      let formData = new FormData(this.$refs.repaymentForm);

      for (var key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }

      return formData
    },
    printVoucher() {
      // let printContent = document.querySelector("#treatmentSelectionRepaymentVoucher").innerHTML;
      console.log('here')
      openPrint("treatmentSelectionRepaymentVoucher")
    },
    async fetchTreatmentVouchersByTreatmentSelectionId() {
      try {
        let res =
          await this.treatmentSelectionStore.fetchRelatedTreatmentVouchers({
            treatmentSelection: this.treatmentSelection._id,
          })
        this.treatmentVouchers = res.data
        console.log(res)
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    async showRepaymentVoucherModal() {
      // this.prepareVoucherData()
      // await this.genereateImage()
      // await this.sendEmail()
      openDialog('saleVoucherModal')
    },
    prepareEmailForm() {
      let formData = {
        recipent: this.treatmentSelection.relatedPatient.email,
        voucherType: 'Repayment',
        voucherNo: this.voucherId,
        voucherDate: cusFormatDate(dateForParams())
      }

      let newFormData = new FormData();

      for (let key in formData) {
        if (formData.hasOwnProperty(key)) {
          newFormData.append(key, formData[key]);
        }
      }
      console.log(this.data.imageFile)
      if (this.data.imageFile) newFormData.append('file', this.data.imageFile)
      return newFormData
    },
    async genereateImage() {
      let castContent = document.querySelector('#castVoucherDisplay')
      castContent.classList.remove('d-none')
      const content = await document.querySelector('#castSaleVoucherCard')
      const canvas = await html2canvas(content, {
        width: content.scrollWidth + 20,
        height: content.scrollHeight + 20,
      });
      castContent.classList.add('d-none')  
      const imageData = canvas.toDataURL('image/png')
      console.log(imageData)
      this.data.imageFile = imageData
    },
    async sendEmail() {
      await this.genereateImage()
      let payload = this.prepareEmailForm()
      console.log(payload)
      try {
        console.log('sending email')
        let res = await this.treatmentSelectionStore.sendEmail(payload)
        console.log(res)
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    async repay() {
      let data = this.prepareForm()
      this.submitting = true
      try {
        let res = await this.treatmentSelectionStore.repayment(data)
        console.log(res)
        this.prepareVoucherData(res)
        if (res) {
          let updateAppointmentRes =
            await this.appointmentStore.updateAppointment({
              id: this.data.selectedAppointment._id,
              status: true,
              relatedPatient: this.treatmentSelection.relatedPatient._id
            })
          console.log(updateAppointmentRes)
          this.updateTreatmentSelectionAppointment(
            updateAppointmentRes.data._id
          )

          if (res.treatmentVoucherResult) {
            this.voucherData = res.treatmentVoucherResult
            this.treatmentVouchers.push(this.voucherData)
          }

          if (res.rpRecordPopulated) {
            this.repayments.push(res.rpRecordPopulated[0])
          }

          this.treatmentSelection.leftOverAmount = res.data.leftOverAmount
          this.treatmentSelection.paidAmount = res.data.paidAmount

          if (
            this.treatmentSelection.paymentMethod === "Cash Down" &&
            this.treatmentSelection.leftOverAmount <= 0
          ) {
            this.changeTotal = true
            this.treatmentSelection.leftOverAmount =
              this.treatmentSelection.totalAmount
          }

          if (
            this.treatmentSelection.paymentMethod === "Credit"
          ) {
            // let modal = new bootstrap.Modal(
            //   document.querySelector("#treatmentSelectionVoucherModal")
            // )
            // modal.show()
            
            if (this.data.email) {
              await this.sendEmail()
              this.appStore.showSuccess()
            }
            this.closeModal()
            if (this.data.print) {
              this.showRepaymentVoucherModal()
            }

          } else {
            this.$router.push({
              name: "procedure-history.create",
              query: {
                currentTab: "usage",
                treatmentSelectionId: this.treatmentSelection._id,
                appointmentId: this.data.selectedAppointment._id,
                patientId: this.treatmentSelection.relatedPatient._id,
              },
            })
          }

          await this.fetchTreatmentVouchersByTreatmentSelectionId()
        }
      } catch (error) {
        this.appStore.showError()
        console.log(error)
      } finally {
        this.submitting = false
      }
    },
  },
  async mounted() {
    try {
      // await this.fetchTreatmentSelectionsByPatientId();
      // await this.treatmentStore.fetchRelatedTreatmentVouchers()
      // let treat = await this.treatmentStore.fetchRelatedTreatmentVouchers()
      // console.log(vres)

      let res = await this.treatmentSelectionStore.fetchTreatmentSelection({
        id: this.$route.query.treatmentSelectionId,
      })
      console.log(res)

      this.treatmentSelection = res.data[0]
      if (
        this.treatmentSelection.paymentMethod === "Cash Down" &&
        this.treatmentSelection.leftOverAmount <= 0
      ) {
        this.changeTotal = true
        this.treatmentSelection.leftOverAmount =
          this.treatmentSelection.totalAmount
      }
      await this.fetchTreatmentVouchersByTreatmentSelectionId()

      let resAccounts = await this.accountingListStore.fetchAccountingLists()
      this.bankAccounts = resAccounts.list.filter(
        el =>
          el.relatedHeader.name === "Cash at Bank" &&
          el.relatedType.name === "Assets"
      )

      this.selectedBankAccount = this.bankAccounts[0]

      this.cashAccounts = resAccounts.list.filter(
        el => el._id === this.appStore.account._id
        // el.relatedHeader.name === "Cash In Hand" &&
        // el.relatedType.name === "Assets"
      )

      this.selectedCashAccount = this.cashAccounts[0]

      if (this.treatmentSelection.paymentMethod === "Cash Down") {
        let repayments =
          await this.treatmentSelectionStore.fetchRelatedRepayments({
            id: this.$route.query.treatmentSelectionId,
          })
        this.repayments = repayments.data
      }
    } catch (err) {
      console.log(err)
    } finally {
      this.isLoading = false
    }
  },
}
</script>

<style lang="scss" scoped>
.treatment-voucher {
  max-width: 700px;
}
</style>
