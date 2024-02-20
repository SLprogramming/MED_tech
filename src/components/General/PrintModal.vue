<template>
  <div class="modal fade" :id="`treatmentSelectPrintModal`" tabindex="-1" aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog" style="max-width: 900px">
      <div class="modal-content" style="width: 900px">
        <div class="modal-header">
          <h1 class="modal-title fs-5">Voucher</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div :id="'treatmentSelectPrintCard' + props.id" class="modal-body">
          <div class="col-md-12">
            <template v-if="!props.resourceFromTreatmentSelect">
              Loading ...
            </template>
            <template v-if="props.type == 'normal'">
              <div class="card card-body ">
                <div style="display: flex; justify-content: space-around">
                  <div class="row">
                    <div class="col-md-12 text-center">
                      <div style="text-align: center">
                        <address>
                          <img style="height: 100px;" src="@/assets/img/logo.png" alt="" />
                          <p class="text-black mx-auto text-center fw-bold" style="width: 400px">{{ contact?.address }}
                          </p>
                          <template v-for="phone in contact?.phones">
                            <p class="text-black fw-bold">
                              Phone No : {{ phone }}
                            </p>
                          </template>
                        </address>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-content-between mb-3">
                  <div class="">
                    <h3 class="mt-2" style="font-size: 15px">
                      <span class="fw-bold">Date:</span> {{ getToday() }}
                    </h3>
                    <h3 v-if="payload && payload.treatmentVoucherResult" class="mt-2" style="font-size: 15px">
                      <span class="fw-bold">Code:</span> {{ payload?.treatmentVoucherResult[0]?.code }}
                    </h3>
                    <h3 class="mt-2 mb-0" style="font-size: 15px">
                      <span class="fw-bold">Sale By : </span> {{ appStore.user.data.user.name }}
                    </h3>
                    <div v-if="item.relatedAppointments">
                      <div class="d-flex gap-3">
                        <span class="fw-bold" style="font-size: 15px">
                          Doctor :
                        </span>
                        <span style="font-size: 15px">
                          {{ item.relatedAppointments[0].relatedDoctor.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="">
                    <h3 class="mt-2" style="font-size: 15px">
                      <span class="fw-bold">Customer Name: </span>
                      <span>{{ item?.relatedPatient?.name }}</span>
                    </h3>
                    <h3 class="mt-2" style="font-size: 15px">
                      <span class="fw-bold">Customer Phone: </span>
                      <span> {{ item?.relatedPatient?.phone }}</span>
                    </h3>
                    <h3 class="mt-2" style="font-size: 15px">
                      <span class="fw-bold">Payment Method </span>
                      <template v-if="item.paymentMethod === 'Cash Down'">
                        <span>Paid</span>
                      </template>
                      <template v-if="item.paymentMethod === 'Credit'">
                        <span>Partial</span>
                      </template>
                      <template v-if="item.paymentMethod === 'FOC'">
                        <span>FOC</span>
                      </template>
                    </h3>
                  </div>
                </div>

                <div class="row my-5">
                  <div class="col-md-12">
                    <table class="table table-bordered mb-0" style="width: 100%">
                      <thead class="text-center">
                        <tr>
                          <th style="font-size: 15px; font-weight: normal; height: 15px; white-space: nowrap;"
                            class="text-center fw-bold">
                            Treatment Name
                          </th>
                          <th style="font-size: 15px; font-weight: normal; height: 15px; white-space: nowrap;"
                            class="text-center fw-bold">
                            Treatment Unit Name
                          </th>
                          <th style="font-size: 15px; font-weight: normal; height: 15px; white-space: nowrap;"
                            class="text-center fw-bold">
                            Total Amount
                          </th>
                          <th style="font-size: 15px; font-weight: normal; height: 15px; white-space: nowrap;"
                            class="text-center fw-bold">
                            <!-- Paid Amount -->Qty
                          </th>
                          <th style="font-size: 15px; font-weight: normal; height: 15px; white-space: nowrap;"
                            class="text-center fw-bold">
                            Sub Total
                          </th>
                        </tr>
                      </thead>
                      <tbody class="text-center" id="a5_body">
                        <tr v-for="(item, index) in payload?.data">
                          <td style="width: 150px">{{ item.relatedTreatmentList?.name }}</td>
                          <td style="width: 150px">{{ item.relatedTreatment?.name }}</td>
                          <td style="width: 150px" v-if="item.paymentMethod !== 'FOC'">{{ item.totalAmount }}</td>
                          <td style="width: 150px" v-if="item.paymentMethod === 'FOC'">{{ item.relatedTreatment.sellingPrice }}</td>
                          <td style="width: 150px">{{ 1 }}</td>
                          <td style="width: 150px">{{ payload.treatmentVoucherResult[0]?.discountAmount ?
                            Number(item.relatedTreatment.sellingPrice) -
                            Number(payload.treatmentVoucherResult[0]?.discountAmount) :
                            item.relatedTreatment.sellingPrice }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="row justify-content-end">
                  <div class="col-6">
                    <table class="table table-borderless">
                      <tbody>
                        <template v-for="(item, index) in payload?.data">
                          <tr>
                            <td colspan="2"></td>
                            <td class="text-right fw-bold" style="font-size: 15px">
                              Total Amount
                            </td>
                            <td id="slip_net" style="font-size: 15px">
                              {{ item.relatedTreatment.sellingPrice }}
                            </td>
                          </tr>
                          <tr v-if="payload.treatmentVoucherResult[0]?.relatedDiscount?.name">
                            <td colspan="2"></td>
                            <td class="text-right fw-bold" style="font-size: 15px">
                              Discount Name
                            </td>
                            <td id="pay" style="font-size: 15px">
                              {{ payload.treatmentVoucherResult[0]?.relatedDiscount?.name }}
                            </td>
                          </tr>
                          <tr v-if="payload.treatmentVoucherResult[0]?.relatedDiscount?.type">
                            <td colspan="2"></td>
                            <td class="text-right fw-bold" style="font-size: 15px">
                              Discount Type
                            </td>
                            <td id="pay" style="font-size: 15px">
                              {{ payload.treatmentVoucherResult[0]?.relatedDiscount?.type }}
                            </td>
                          </tr>
                          <tr v-if="payload.treatmentVoucherResult[0]?.discountAmount">
                            <td colspan="2"></td>
                            <td class="text-right fw-bold" style="font-size: 15px">
                              Discount Value
                            </td>
                            <td id="pay" style="font-size: 15px">
                              {{ payload.treatmentVoucherResult[0]?.discountAmount ?? 0 }}
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2"></td>
                            <td class="text-right fw-bold" style="font-size: 15px">
                              Net Amount
                            </td>
                            <td id="pay" style="font-size: 15px">
                              {{ payload.treatmentVoucherResult[0]?.discountAmount ?
                                Number(item.relatedTreatment.sellingPrice) -
                                Number(payload.treatmentVoucherResult[0]?.discountAmount) :
                                item.relatedTreatment.sellingPrice }}
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2"></td>
                            <td class="text-right fw-bold" style="font-size: 15px">
                              Pay Amount
                            </td>
                            <td id="pay" style="font-size: 15px">
                              {{ item.paidAmount }}
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2"></td>
                            <td class="text-right fw-bold" style="font-size: 15px">
                              Balance
                            </td>
                            <td id="pay" style="font-size: 15px" v-if="item.paymentMethod !== 'FOC'">
                              {{ item.leftOverAmount }}
                            </td>
                            <td v-if="item.paymentMethod === 'FOC'">
                              0
                            </td>
                          </tr>

                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div v-if="item.remark">
                  <span class="fw-bold">Remark:</span> {{ item.remark }}
                </div>

                <hr>

                <div class="text-capitalize text-center fw-bold mb-3">
                  no refund after payment <br>
                  thank you
                </div>
              </div>
            </template>
            <template v-if="props.type == 'slip'">
              <div class="mx-auto" style="width: 500px">
                <div class="row border">
                  <div class="col-md-12 mb-5">
                    <div style="text-align: center">
                      <address>
                        <img style="height: 100px;" src="@/assets/img/logo.png" alt="" />
                        <p class="text-black mx-auto text-center fw-bold" style="width: 400px">{{ contact?.address }}
                        </p>
                        <template v-for="phone in contact?.phones">
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
                        <span class="fw-bold">Voucher Number: {{ payload?.treatmentVoucherResult[0]?.code }}</span>
                        <span class="vou_code"> </span>
                      </h6>
                      <h6 class="text-black">
                        <span class="fw-bold">Customer Name: {{ item?.relatedPatient?.name }}</span>
                        <span class="vou_code"> </span>
                      </h6>
                      <h6 class="text-black">
                        <span class="fw-bold">Customer Phone: {{ item?.relatedPatient?.phone }}</span>
                        <span class="vou_code"> </span>
                      </h6>
                      <h6 class="text-black">
                        <span class="fw-bold">Payment Method: {{ item?.paymentMethod }}</span>
                        <span class="vou_code"> </span>
                      </h6>
                      <div v-if="item.relatedAppointments">
                        <div class="d-flex gap-3">
                          <span class="fw-bold" style="font-size: 15px">
                            Doctor :
                          </span>
                          <span class="fw-bold" style="font-size: 15px">
                            {{ item.relatedAppointments[0].relatedDoctor.name }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-12">
                    <div class="text-black">
                      <table class="table table-bordered">
                        <thead>
                          <tr class="text-black">
                            <th style="width: 50px">No</th>
                            <th style="width: 150px">Name</th>
                            <th style="width: 80px">Code</th>
                          </tr>
                        </thead>
                        <tbody class="text-black" id="slip_live">
                          <tr v-for="(item, index) in payload?.data">
                            <td style="width: 50px">{{ index + 1 }}</td>
                            <td>{{ item.relatedTreatment?.name }}</td>
                            <td>
                              {{ item.relatedTreatment?.treatmentCode }}
                            </td>
                          </tr>
                          <tr v-if="payload.data?.length <= 0">
                            <td colspan="5" class="text-center fw-bold">
                              No item exist!
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <div class="row justify-content-end">
                        <div class="col-8">
                          <table class="table table-borderless">
                            <tbody>
                              <template v-for="(item, index) in payload?.data">
                                <tr>
                                  <td colspan="2"></td>
                                  <td class="text-right fw-bold" style="font-size: 15px">
                                    Total Amount
                                  </td>
                                  <td id="slip_net" style="font-size: 15px">
                                    {{ item.relatedTreatment.sellingPrice }}
                                  </td>
                                </tr>
                                <tr v-if="payload.treatmentVoucherResult[0]?.relatedDiscount?.name">
                                  <td colspan="2"></td>
                                  <td class="text-right fw-bold" style="font-size: 15px">
                                    Discount Name
                                  </td>
                                  <td id="pay" style="font-size: 15px">
                                    {{ payload.treatmentVoucherResult[0]?.relatedDiscount?.name }}
                                  </td>
                                </tr>
                                <tr v-if="payload.treatmentVoucherResult[0]?.relatedDiscount?.type">
                                  <td colspan="2"></td>
                                  <td class="text-right fw-bold" style="font-size: 15px">
                                    Discount Type
                                  </td>
                                  <td id="pay" style="font-size: 15px">
                                    {{ payload.treatmentVoucherResult[0]?.relatedDiscount?.type }}
                                  </td>
                                </tr>
                                <tr v-if="payload.treatmentVoucherResult[0]?.discountAmount">
                                  <td colspan="2"></td>
                                  <td class="text-right fw-bold" style="font-size: 15px">
                                    Discount Value
                                  </td>
                                  <td id="pay" style="font-size: 15px">
                                    {{ payload.treatmentVoucherResult[0]?.discountAmount ?? 0 }}
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2"></td>
                                  <td class="text-right fw-bold" style="font-size: 15px">
                                    Net Amount
                                  </td>
                                  <td id="pay" style="font-size: 15px">
                                    {{ payload.treatmentVoucherResult[0]?.discountAmount ?
                                      Number(item.relatedTreatment.sellingPrice) -
                                      Number(payload.treatmentVoucherResult[0]?.discountAmount) :
                                      item.relatedTreatment.sellingPrice }}
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2"></td>
                                  <td class="text-right fw-bold" style="font-size: 15px">
                                    Pay Amount
                                  </td>
                                  <td id="pay" style="font-size: 15px">
                                    {{ item.paidAmount }}
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2"></td>
                                  <td class="text-right fw-bold" style="font-size: 15px">
                                    Balance
                                  </td>
                                  <td id="pay" style="font-size: 15px">
                                    {{ item.leftOverAmount }}
                                  </td>
                                </tr>

                              </template>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div v-if="item.remark">
                        <span class="fw-bold">Remark:</span> {{ item.remark }}
                      </div>
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
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" @click="openPrint">Print</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getToday } from '../../helpers';
import { useAppStore } from '../../stores/app';

const contact = ref({})

const appStore = useAppStore()

const props = defineProps({
  resourceFromTreatmentSelect: {
    default: {}
  },
  type: {
    default: "normal"
  },
  id: {
    default: ""
  }
})

const payload = computed(() => {
  return props.resourceFromTreatmentSelect
})

const item = computed(() => {
  return props.resourceFromTreatmentSelect.data ? props.resourceFromTreatmentSelect.data[0] : []
})

const openPrint = () => {
  let printContent = document.querySelector('#treatmentSelectPrintCard' + props.id).innerHTML
  let mywindow = window.open("", "PRINT", "height=1000,width=1200");
  mywindow.document.write("<html><head><title>" + document.title + "</title>");
  mywindow.document.write("</head><body >");
  mywindow.document.write(
    `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">`
  );

  mywindow.document.write(printContent);
  mywindow.document.write("</body></html>");

  mywindow.document.close(); // necessary for IE >= 10
  mywindow.focus(); // necessary for IE >= 10*/

  mywindow.print();
}

onMounted(() => {
  contact.value = appStore.getContact()
  console.log(contact)
  console.log(props)
})
</script>

<style lang="scss" scoped></style>