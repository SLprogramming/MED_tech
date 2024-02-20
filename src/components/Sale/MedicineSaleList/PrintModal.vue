<template>
  <div class="modal fade" :id="'medicineSaleListSlipModal' + props.id" tabindex="-1"
    :aria-labelledby="'medicineSaleListSlipModalLabel' + props.id" aria-hidden="true">
    <div class="modal-dialog" style="max-width: 800px">
      <div class="modal-content" style="width: 800px">
        <div class="modal-body">
          <div :id="'medicineSaleListSlipModalCard' + props.id" class="row justify-content-center">
            <div class="col-md-12">
              <div class="border p-3 mx-auto" style="width: 500px">
                <div class="row">
                  <div class="col-md-12 mb-3">
                    <div style="text-align: center" class="mb-3">
                      <address>
                        <img style="height: 100px;" src="@/assets/img/logo.png" alt="" />
                        <p class="text-black mx-auto text-center fw-bold" style="width: 400px">{{ contact?.address }}</p>
                        <template v-for="phone in contact?.phones">
                          <p class="text-black fw-bold">
                            Phone : {{ phone }}
                          </p>
                        </template>
                      </address>
                    </div>
                    <div>
                      <h6 class="text-black">
                        <span class="fw-bold">Date: </span>
                        {{ payload.createdAt ? cusFormatDate(payload.createdAt) : 'Not Set' }}
                      </h6>
                      <h6 class="text-black">
                        <span class="fw-bold">Voucher Number: </span>
                        {{ payload.voucherCode }}
                      </h6>
                      <h6 class="text-black">
                        <span class="fw-bold">Customer Name: </span>
                        {{ payload?.relatedPatient?.name }}
                      </h6>
                      <h6 class="text-black">
                        <span class="fw-bold">Customer Phone: </span>
                        {{ payload?.relatedPatient?.phone }}
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
                            <th style="width: 80px">Qty</th>
                            <th style="width: 80px">Unit Price</th>
                            <th style="width: 80px">Sub Total</th>
                          </tr>
                        </thead>
                        <tbody class="text-black" id="slip_live">
                          <tr v-for="(item, index) in payload.medicineItems">
                            <td style="width: 50px">{{ index + 1 }}</td>
                            <td>{{ item.item_id?.medicineItemName }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>{{ item.item_id?.sellingPrice }}</td>
                            <td id="subtotal">
                              {{ item.quantity * item.item_id?.sellingPrice }}
                            </td>
                          </tr>
                          <tr v-if="payload.medicineItems?.length <= 0">
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
                              <tr>
                                <td colspan="2"></td>
                                <td class="text-right fw-bold" style="font-size: 15px;width: 120px">Total</td>
                                <td id="total_charges" class="font-weight-bold" style="font-size: 15px">
                                  <span id="slip_total">{{ payload.totalAmount }}</span>
                                </td>
                              </tr>

                              <tr>
                                <td colspan="2"></td>
                                <td class="text-right fw-bold" style="font-size: 15px;width: 120px">Discount</td>
                                <td v-if="payload.discount" id="slip_discount" class="font-weight-bold fw-bold"
                                  style="font-size: 15px">
                                  {{ payload.discount }}
                                </td>
                                <td v-else>0</td>
                              </tr>

                              <tr>
                                <td colspan="2"></td>
                                <td class="text-right fw-bold" style="font-size: 15px;width: 120px;">
                                  Sub Total
                                </td>
                                <td id="slip_net" style="font-size: 15px">
                                  {{ payload.grandTotal }}
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2"></td>
                                <td class="text-right fw-bold" style="font-size: 15px">Balance</td>
                                <td id="slip_net" style="font-size: 15px">
                                  {{ payload.balance ?? 0 }}
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2"></td>
                                <td class="text-right fw-bold" style="font-size: 15px">
                                  Pay Amount
                                </td>
                                <td id="pay" style="font-size: 15px">
                                  {{ payload.payAmount }}
                                </td>
                              </tr>
                              <tr>
                                <td colspan="2"></td>
                                <td class="text-right fw-bold" style="font-size: 15px">Change</td>
                                <td id="changes" class="font-weight-bold" style="font-size: 15px">
                                  {{ payload.change }}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <hr>
                      <h6 class="text-center font-weight-bold text-black">
                        **ကျေးဇူးတင်ပါသည်**
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" @click="print" class="btn btn-primary">Print</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { cusFormatDate, openPrint } from '../../../helpers';
import { onMounted, ref } from 'vue';
import { useAppStore } from '../../../stores/app';

const props = defineProps(['id', 'payload'])
const contact = ref({})
const appStore = useAppStore()
const print = () => {
  openPrint('medicineSaleListSlipModalCard'+props.id)
}

onMounted(() => {
  contact.value = appStore.getContact()
})
</script>

<style lang="scss" scoped></style>