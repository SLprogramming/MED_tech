<template>
  <div id="castPackageSaleVoucherCard" style="width: 766px" class="p-3">
    <div class="d-flex justify-content-between">
      <img style="height: 100px;" src="@/assets/img/logo.png" alt="" />
      <div class="d-flex flex-column">
        <span class="fw-bold">Invoice</span>
        <span>{{ props.invoiceId }}</span>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-8">
        <h5 class="fw-bold">Invoice From</h5>
        <address>
          <p class="text-black fw-bold" style="width: 400px">{{ contact?.address }}
          </p>
          <template v-for="phone in contact?.phones">
            <p class="text-black">
              <span class="fw-bold">Phone No :</span> {{ phone }}
            </p>
          </template>
        </address>
      </div>
      <div class="col-4">
        <div class="d-flex flex-column">
          <span class="fw-bold">Payment Method</span>
          <span>
            <template v-if="props.paymentMethod === 'Cash Down'">
              Paid
            </template>
            <template v-else-if="props.paymentMethod === 'cash'">
              Cash
            </template>
            <template v-else-if="props.paymentMethod === 'bank'">
              Bank
            </template>
            <template v-else>
              {{ props.paymentMethod }}
            </template>
          </span>
        </div>
      </div>
    </div>
    <div class="row justify-content-between mb-3">
      <div class="col-8">
        <h5 class="text-capitalize fw-bold">invoice to</h5>
        <h6 class="text-capitalize"><span class="fw-bold">Customer Name:</span> <span>{{ customer.name }}</span>
        </h6>
        <h6 class="text-capitalize"><span class="fw-bold">Customer Phone:</span> <span>{{ customer.phone
        }}</span>
        </h6>
      </div>
      <div class="col-4">
        <div class="d-flex flex-column text-capitalize"><span class="fw-bold">date</span> <span>{{ getToday()
        }}</span>
        </div>
      </div>
    </div>
    <div>
      <h4 class="fw-bold">Package Items</h4>
      <div class="table-responsive mb-3">
        <table class="table table-striped">
          <thead class="text-white" style="background: #a57c00">
            <tr>
              <th>No</th>
              <th style="width: 250px;">Name</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Discount</th>
              <th>Sub Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(each, index) in packages">
              <td>{{ index + 1 }}</td>
              <td style="max-width: 400px;">{{ each.name }}</td>
              <td>{{ each.qty }}</td>
              <td>{{ each.price }}</td>
              <td>{{ each.discountValue ?? 0 }}</td>
              <td>{{ each.subTotal }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="row justify-content-end">
        <div class="col-6 balance-container">
          <div class="d-flex px-2 py-3">
            <span class="balance-label">Total Qty</span>
            <span>{{ packageTotalQty }}</span>
          </div>
          <div class="d-flex px-2 py-3">
            <span class="balance-label">Total</span>
            <span>{{ packageTotalPrice }}</span>
          </div>
          <div class="d-flex px-2 py-3">
            <span class="balance-label">Paid Amount</span>
            <span>{{ packagePaidAmount }}</span>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <!-- <div class="row justify-content-end mb-5">
                <div class="col-6 balance-container">
                  <div class="d-flex px-2 py-3">
                    <span class="balance-label">SubTotal</span>
                    <span>{{ totalSubTotal }}</span>
                  </div>
                  <div class="d-flex px-2 py-3">
                    <span class="balance-label">Paid Amount</span>
                    <span>{{ totalPaidAmount }}</span>
                  </div>
                  <div class="d-flex px-2 py-3" v-if="cashBack">
                    <span class="balance-label">Cash Back</span>
                    <span>{{ cashBack }}</span>
                  </div>
                </div>
              </div> -->
    <div class="row mb-5">
      <div class="col-6">
        <h5 class="fw-bold">
          Term & conditions
        </h5>
        <div class="d-flex flex-column">
          <span>
            - Non refund
          </span>
          <span>
            -
          </span>
          <span>
            -
          </span>
          <span>
            -
          </span>
          <span>
            -
          </span>
          <span>
            -
          </span>
        </div>
      </div>
      <div class="col-6 align-self-end text-center">
        <div class="sign mb-3"></div>
        <span class="text-capitalize">Authorzied Signature</span>
      </div>
    </div>
    <div>
      <h5 class="fw-bold text-capitalize">thank you for bussiness & please visit again</h5>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAppStore } from '../../stores/app';
import { cusFormatDate, getToday, openPrint } from '../../helpers';
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps({
  invoiceId: {
    type: String,
    requried: true,
    default: 'testid'
  },
  paymentMethod: {
    type: String,
    requried: true,
    default: "Cash"
  },
  customer: {
    type: Object,
    requried: true,
    default() {
      return {
        name: 'mya mya',
        phone: '09887366554'
      }
    }
  },
  packages: {
    type: Array,
    requried: false,
    default: [
      {
        name: 'package one',
        price: 1000,
        qty: 1,
        discountValue: 500,
        subTotal: 1000
      },
      {
        name: 'package two',
        price: 1000,
        qty: 2,
        discountValue: 500,
        subTotal: 1000
      }
    ]
    // default: []
  },
  packageData: {
    type: Object,
    requried: true,
    default: {
      paidAmount: 1000,
      totalAmount: 2000,
    }
  },
})
const appStore = useAppStore()
const contact = ref({})

const packageTotalPrice = computed(() => {
  return props.packageData.totalAmount
})

const packageTotalQty = computed(() => {
  return props.packages.reduce((accumulator, currentValue) => accumulator + currentValue.qty,
    0)
})

const packagePaidAmount = computed(() => {
  // return treatmentSubTotal.value == 0 ? 0 : props.treatmentData.paidAmount
  return props.packageData.paidAmount
})

onMounted(() => {
  contact.value = appStore.getContact()
  console.log(contact)
  console.log(props)
})
</script>

<style lang="scss" scoped>
table tr td:not(:first-child) {
  min-width: 80px;
}

.balance-label {
  font-weight: bold;
  min-width: 200px;
}

.balance-container div:nth-child(even) {
  background-color: rgba(251, 185, 196, 0.779);
}

.sign {
  border-bottom: 1px solid black;
}
</style>