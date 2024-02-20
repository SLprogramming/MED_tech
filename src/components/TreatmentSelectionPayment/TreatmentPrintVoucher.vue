<template>
  <div class="modal" id="treatmentSelectionVoucherModal" tabindex="-1"
    aria-labelledby="treatmentSelectionVoucherModalLabel">
    <div class="modal-dialog" style="min-width: 1200px">
      <div class="modal-content">
        <div class="modal-body" id="treatmentSelectionRepaymentVoucher">
          <template v-if="type == 'normal'">
            <div class="mb-3">
              <div style="display: flex; justify-content: space-around">
                <div class="row">
                  <div class="col-md-12 text-center">
                    <div style="text-align: center">
                      <address>
                        <img style="height: 100px;" src="@/assets/img/logo.png" alt="" />
                        <p class="text-black mx-auto text-center fw-bold" style="width: 400px">{{ contact.address }}</p>
                        <template v-for="phone in contact.phones">
                          <p class="text-black fw-bold">
                            Phone No : {{ phone }}
                          </p>
                        </template>
                      </address>
                    </div>
                  </div>
                </div>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="">
                    <span class="fw-bold">Voucher Date : </span>
                    <span>{{ getToday() }}</span>
                  </div>
                  <div class="">
                    <span class="fw-bold">Voucher Code : </span>
                    <span>{{ voucherData?.code }}</span>
                  </div>
                  <div class="">
                    <span class="fw-bold">Appointment : </span>
                    <span>{{ relatedAppointment.originalDate ? cusFormatDate(relatedAppointment.originalDate) : 'Not Set'
                    }}</span>
                  </div>
                </div>
                <div>
                  <div class="">
                    <span class="fw-bold">Patient Name : </span>
                    <span>{{ treatmentSelection.relatedPatient?.name }}</span>
                  </div>
                  <div class="">
                    <span class="fw-bold">Phone Number : </span>
                    <span>{{ treatmentSelection.relatedPatient?.phone }}</span>
                  </div>
                  <div class="">
                    <span class="fw-bold">Sale By : </span>
                    <span>{{ appStore.user.data.user.name }}</span>
                  </div>
                </div>
              </div>
              <table class="table table-bordered my-5">
                <thead>
                  <tr>
                    <th scope="col" class="text-nowrap">No</th>
                    <th scope="col" class="text-nowrap">Treatment Name</th>
                    <th scope="col" class="text-nowrap">Treatment Unit Name</th>
                    <th scope="col" class="text-nowrap">Total Charge</th>
                    <th scope="col" class="text-nowrap">Payment</th>
                    <th scope="col" class="text-nowrap">Left Over Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td style="min-width: 150px">{{ treatmentSelection.relatedTreatmentList?.name }}</td>
                    <td style="min-width: 150px">{{ treatmentSelection.relatedTreatment?.name }}</td>
                    <td style="min-width: 150px">{{ treatmentSelection.totalAmount }}</td>
                    <td style="min-width: 150px">{{ treatmentSelection.paidAmount }}</td>
                    <td style="min-width: 150px">{{ treatmentSelection.leftOverAmount }}</td>
                  </tr>
                </tbody>
              </table>

              <div class="row justify-content-end">
                <div class="col-6">
                  <table class="table table-borderless">
                    <tbody>
                      <tr>
                        <td colspan="2"></td>
                        <td class="text-right fw-bold" style="font-size: 15px">
                          Net Amount
                        </td>
                        <td id="pay" style="font-size: 15px">
                          {{ treatmentSelection.totalAmount }}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2"></td>
                        <td class="text-right fw-bold" style="font-size: 15px">
                          Pay Amount
                        </td>
                        <td id="pay" style="font-size: 15px">
                          {{ treatmentSelection.paidAmount }}
                        </td>
                      </tr>
                      <tr>
                          <td colspan="2"></td>
                          <td class="text-right fw-bold" style="font-size: 15px">
                            Balance
                          </td>
                          <td id="pay" style="font-size: 15px">
                            {{ treatmentSelection.leftOverAmount }}
                          </td>
                        </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <hr>

              <div class="text-capitalize text-center fw-bold mb-3">
                no refund after payment <br>
                thank you
              </div>
            </div>
          </template>
          <template v-if="type == 'slip'">
            <div class="mx-auto" style="width: 500px">
              <div class="row border">
                <div class="col-md-12 mb-3">
                  <div style="text-align: center" class="mb-3">
                    <address>
                      <img style="height: 100px;" src="@/assets/img/logo.png" alt="" />
                      <p class="text-black mx-auto text-center fw-bold" style="width: 400px">{{ contact.address }}</p>
                      <template v-for="phone in contact.phones">
                        <p class="text-black fw-bold">
                          Phone No : {{ phone }}
                        </p>
                      </template>
                    </address>
                  </div>
                  <div class="pull-right text-left">
                    <h6 class="text-black">
                      <span class="fw-bold">Date: {{ getToday() }}</span>
                      <i class="fa fa-calendar"></i>
                    </h6>
                    <h6 class="text-black">
                      <span class="fw-bold">Voucher Number: {{ voucherData.code }}</span>
                      <span class="vou_code"> </span>
                    </h6>
                    <h6 class="text-black">
                      <span class="fw-bold">Appointment: {{ relatedAppointment.originalDate ?
                        cusFormatDate(relatedAppointment.originalDate) : 'Not Set'
                      }}</span>
                    </h6>
                    <h6 class="text-black">
                      <span class="fw-bold">Customer Name: {{ treatmentSelection.relatedPatient?.name }}</span>
                      <span class="vou_code"> </span>
                    </h6>
                    <h6 class="text-black">
                      <span class="fw-bold">Customer Phone: {{ treatmentSelection.relatedPatient?.phone }}</span>
                      <span class="vou_code"> </span>
                    </h6>
                  </div>
                </div>

                <div class="col-md-12">
                  <div class="text-black">
                    <table class="table table-bordered">
                      <thead>
                        <tr class="text-black">
                          <th style="width: 50px">No</th>
                          <th style="width: 150px">Name</th>
                          <th style="width: 80px">Total</th>
                        </tr>
                      </thead>
                      <tbody class="text-black" id="slip_live">
                        <tr>
                          <td>1</td>
                          <td>{{ treatmentSelection.relatedTreatmentList?.name }}</td>
                          <td>{{ treatmentSelection.totalAmount }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="row justify-content-end">
                      <div class="col-8">
                        <table class="table table-borderless">
                          <tbody>
                            <tr>
                              <td colspan="2"></td>
                              <td class="text-right fw-bold" style="font-size: 15px">
                                Total
                              </td>
                              <td id="slip_net" style="font-size: 15px">
                                {{ treatmentSelection.totalAmount }}
                              </td>
                            </tr>
                            <tr>
                              <td colspan="2"></td>
                              <td class="text-right fw-bold" style="font-size: 15px">
                                Pay Amount
                              </td>
                              <td id="pay" style="font-size: 15px">
                                {{ treatmentSelection.paidAmount }}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <hr>
                    <hr>
                    <div class="text-capitalize text-center fw-bold mb-3">
                      no refund after payment <br>
                      thank you
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" @click="goToUsage" class="btn btn-secondary" data-bs-dismiss="modal">
            Close
          </button>
          <button type="button" class="btn btn-primary" @click="printAndGoToUsage" data-bs-dismiss="modal">
            Print
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getToday } from '@/helpers/index'
import { useAppStore } from '../../stores/app'
import { cusFormatDate } from '../../helpers'
export default {
  setup() {
    const appStore = useAppStore()
    return {
      appStore
    }
  },
  props: ['treatmentSelection', 'relatedAppointment', 'voucherData', 'leftOverAmount', 'type'],
  data() {
    return {
      contact: {}
    }
  },
  methods: {
    cusFormatDate,
    getToday,
    goToUsage() {
      this.$router.push({
        name: 'procedure-history.create', query: {
          currentTab: 'usage',
          treatmentSelectionId: this.treatmentSelection._id,
          appointmentId: this.relatedAppointment?._id,
          patientId: this.treatmentSelection.relatedPatient._id
        }
      })
    },
    printAndGoToUsage() {
      this.$emit('print')
      this.$router.push({
        name: 'procedure-history.create', query: {
          currentTab: 'usage',
          treatmentSelectionId: this.treatmentSelection._id,
          appointmentId: this.relatedAppointment?._id,
          patientId: this.treatmentSelection.relatedPatient._id
        }
      })
    }
  },
  mounted() {
    this.contact = this.appStore.getContact()
    console.log(this.relatedAppointment)
  }
}
</script>

<style lang="scss" scoped>
.logo {
  height: 200px;
  width: auto;
}
</style>