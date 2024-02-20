<template>
	<template v-if="isloading">
		<loading />
	</template>
	<template v-else>
		<!-- copied design -->
		<div class="card p-3 mx-auto" style="max-width: 800px">
			<div id="packageSaleVoucherPrintCard">
				<div class="d-flex justify-content-between">
					<img style="height: 100px" src="@/assets/img/logo.png" alt="" />
					<div class="d-flex flex-column">
						<span class="fw-bold">Invoice</span>
						<span>{{ voucherData.voucherCode }}</span>
					</div>
				</div>
				<div class="row mb-3">
					<div class="col-8">
						<h5 class="fw-bold">Invoice From</h5>
						<address>
							<p class="text-black fw-bold" style="width: 400px">
								{{ voucherData.address }}
							</p>

							<p
								class="text-black"
								v-for="(phone, i) in voucherData.phone"
								:key="i">
								<span class="fw-bold">Phone No :</span> {{ phone }}
							</p>
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
								<template v-else> {{}} </template>
							</span>
						</div>
					</div>
				</div>
				<div class="row justify-content-between mb-3">
					<div class="col-8">
						<h5 class="text-capitalize fw-bold">invoice to</h5>
						<h6 class="text-capitalize">
							<span class="fw-bold">Customer Name:</span>
							<span>{{ voucherData.customerName }}</span>
						</h6>
						<h6 class="text-capitalize">
							<span class="fw-bold">Customer Phone:</span>
							<span>{{ voucherData.customerPhone }}</span>
						</h6>
					</div>
					<div class="col-4">
						<div class="d-flex flex-column text-capitalize">
							<span class="fw-bold">date</span> <span>{{ getToday() }}</span>
						</div>
					</div>
				</div>

				<!-- medicine items -->
				<div class="mb-5" v-if="tsType == 'MS' || tsType == 'Combined'">
					<h4 class="fw-bold">Medicine Items</h4>
					<div class="table-responsive mb-3">
						<table class="table table-striped">
							<thead class="text-white" style="background: #a57c00">
								<tr>
									<th>No</th>
									<th style="width: 250px">Name</th>
									<th>Qty</th>
									<th>Unit Price</th>
									<th>Discount</th>
									<th>Sub Total</th>
								</tr>
							</thead>
							<tbody>
								<template v-if="medicineItems.length > 0">
									<tr v-for="(item, i) in medicineItems" :key="i">
										<td>{{ i + 1 }}</td>
										<td style="width: 250px">
											{{ item.item_id.medicineItemName }}
										</td>
										<td style="width: 60px">{{ item.qty }}</td>

										<td style="width: 150px">{{ item.price }}</td>
										<td style="width: 150px">{{ item.discountAmount || 0 }}</td>
										<td v-if="item.discountAmount" style="width: 150px">
											{{ item.price - item.discountAmount }}
										</td>
										<td v-else style="width: 150px">{{ item.price }}</td>
									</tr>
								</template>
								<tr v-else>
									<td colspan="6">no item exist</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="row justify-content-end">
						<div class="col-6 balance-container">
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Total Qty</span>
								<span>{{ medicineItemTotalQty }} </span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Total</span>
								<span>{{ voucherDetail.msTotalAmount }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Discount</span>
								<span>{{ voucherDetail.msTotalDiscountAmount }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">SubTotal</span>
								<span>{{ voucherDetail.msGrandTotal }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">{{
									voucherDetail?.relatedCash?.name ||
									voucherDetail?.relatedBank?.subHeader
								}}</span>
								<span>{{ voucherDetail.msPaidAmount }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">{{
									voucherDetail?.secondAccount?.subHeader ||
									"Second Paid Amount"
								}}</span>
								<span>{{ voucherDetail.secondAmount || 0 }}</span>
							</div>
						</div>
					</div>
				</div>
				<!-- medicine items -->

				<!-- package item -->
				<div v-if="tsType == 'PS'">
					<h4 class="fw-bold">Package Items</h4>
					<div class="table-responsive mb-3">
						<table class="table table-striped">
							<thead class="text-white" style="background: #a57c00">
								<tr>
									<th>No</th>
									<th style="width: 250px">Name</th>
									<th>Qty</th>
									<th>Unit Price</th>
									<th>Discount</th>
									<th>Sub Total</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{{ 1 }}</td>
									<td style="max-width: 400px">
										{{ voucherDetail.relatedPackage.name }}
									</td>
									<td>{{ 1 }}</td>
									<td>
										{{ voucherDetail.relatedPackageSelection.totalAmount }}
									</td>
									<td>{{ voucherDetail.discountAmount || 0 }}</td>
									<template v-if="voucherDetail.discountAmount">
										<td>
											{{
												voucherDetail.relatedPackageSelection.totalAmount -
												voucherDetail.discountAmount
											}}
										</td>
									</template>
									<td v-else>
										{{ voucherDetail.relatedPackageSelection.totalAmount }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="row justify-content-end">
						<div class="col-6 balance-container">
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Total Qty</span>
								<span>{{ 1 }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Total</span>
								<template v-if="voucherDetail.discountAmount">
									<span>
										{{
											voucherDetail.relatedPackageSelection.totalAmount -
											voucherDetail.discountAmount
										}}
									</span>
								</template>
								<span v-else>
									{{ voucherDetail.relatedPackageSelection.totalAmount }}
								</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">{{
									voucherDetail?.relatedCash?.name ||
									voucherDetail?.relatedBank?.subHeader
								}}</span>
								<span>{{
									voucherDetail.relatedPackageSelection.paidAmount
								}}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">{{
									voucherDetail?.secondAccount?.subHeader ||
									"Second Paid Amount"
								}}</span>
								<span>{{ voucherDetail.secondAmount }}</span>
							</div>
						</div>
					</div>
				</div>
				<!-- package item -->

				<!-- single treatment -->
				<div v-if="tsType == 'TS'">
					<h4 class="fw-bold">Treatment Items</h4>
					<div class="table-responsive mb-3">
						<table class="table table-striped">
							<thead class="text-white" style="background: #a57c00">
								<tr>
									<th>No</th>
									<th style="width: 250px">Name</th>
									<th>Qty</th>
									<th>Unit Price</th>
									<th>Discount</th>
									<th>Sub Total</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td style="width: 300px; text-wrap: wrap">
										{{ voucherDetail.relatedTreatment.name }}
									</td>
									<td style="width: 60px">
										{{ voucherDetail.relatedTreatment.treatmentTimes }}
									</td>

									<td style="width: 150px">
										{{ voucherDetail.relatedTreatment.sellingPrice }}
									</td>
									<td style="width: 150px">
										{{ voucherDetail.discountAmount || 0 }}
									</td>
									<template v-if="voucherDetail.discountAmount"
										><td style="width: 150px">
											{{
												voucherDetail.relatedTreatment.sellingPrice -
												voucherDetail.discountAmount
											}}
										</td>
									</template>
									<td v-else>
										{{ voucherDetail.relatedTreatment.sellingPrice }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="row justify-content-end">
						<div class="col-6 balance-container">
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Total Qty</span>
								<span>1</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Total</span>
								<span>{{ voucherDetail.relatedTreatment.sellingPrice }}</span>
							</div>
							<div class="d-flex px-2 py-3" v-if="props.saleReturnFlag">
								<span class="balance-label">Prev Price</span>
								<span>{{}}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Discount</span>
								<span>{{ voucherDetail.discountAmount || 0 }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">SubTotal</span>
								<template v-if="voucherDetail.discountAmount"
									><span style="width: 150px">
										{{
											voucherDetail.relatedTreatment.sellingPrice -
											voucherDetail.discountAmount
										}}
									</span>
								</template>
								<span v-else>
									{{ voucherDetail.relatedTreatment.sellingPrice }}
								</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">{{
									voucherDetail?.relatedCash?.name ||
									voucherDetail?.relatedBank?.subHeader
								}}</span>
								<span>{{ voucherDetail.paidAmount }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">{{
									voucherDetail?.secondAccount?.subHeader ||
									"Second Paid Amount"
								}}</span>

								<span>{{ voucherDetail.secondAmount }}</span>
							</div>
						</div>
					</div>
				</div>
				<!-- single treatment -->

				<!-- treatment Items -->
				<div v-if="tsType == 'Combined' || tsType == 'TSMulti'">
					<h4 class="fw-bold">Treatment Items</h4>
					<div class="table-responsive mb-3">
						<table class="table table-striped">
							<thead class="text-white" style="background: #a57c00">
								<tr>
									<th>No</th>
									<th style="width: 250px">Name</th>
									<th>Qty</th>
									<th>Unit Price</th>
									<th>Discount</th>
									<th>Sub Total</th>
								</tr>
							</thead>
							<tbody v-if="voucherDetail.multiTreatment.length > 0">
								<template v-if="treatmentItems.length > 0">
									<tr v-for="(treatment, i) in treatmentItems" :key="i">
										<td>{{ i + 1 }}</td>
										<td style="width: 300px; text-wrap: wrap">
											{{ treatment.item_id.name }}
										</td>
										<td style="width: 60px">{{ treatment.qty || 1 }}</td>

										<td style="width: 150px">{{ treatment.price }}</td>
										<td style="width: 150px">
											{{ treatment.discountAmount || 0 }}
										</td>
										<template v-if="treatment.discountAmount"
											><td style="width: 150px">
												{{ treatment.price - treatment.discountAmount }}
											</td>
										</template>
										<td v-else>{{ treatment.price }}</td>
									</tr>
								</template>
								<tr v-else>
									<td colspan="6">no item exist</td>
								</tr>
							</tbody>
							<tbody v-else>
								<tr>
									<td>{{ 1 }}</td>
									<td style="width: 300px; text-wrap: wrap">
										{{ voucherDetail.relatedTreatment.name }}
									</td>
									<td style="width: 60px">{{ 1 }}</td>

									<td style="width: 150px">
										{{ voucherDetail.relatedTreatmentSelection[0].totalAmount }}
									</td>
									<td style="width: 150px">{{ 0 }}</td>
									<td style="width: 150px">
										{{ voucherDetail.relatedTreatmentSelection[0].totalAmount }}
									</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div
						class="row justify-content-end"
						v-if="voucherDetail.multiTreatment.length > 0">
						<div class="col-6 balance-container">
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Total Qty</span>
								<span>{{ 1 }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Total</span>
								<span>{{ voucherDetail.totalAmount }}</span>
							</div>
							<div class="d-flex px-2 py-3" v-if="props.saleReturnFlag">
								<span class="balance-label">Prev Price</span>
								<span>{{}}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Discount</span>
								<span>{{ voucherDetail.totalDiscount }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">SubTotal</span>
								<template v-if="voucherDetail.totalDiscount">
									<span>{{
										voucherDetail.totalAmount - voucherDetail.totalDiscount
									}}</span>
								</template>
								<span v-else>{{ voucherDetail.totalAmount }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">{{
									voucherDetail?.relatedCash?.name ||
									voucherDetail?.relatedBank?.subHeader
								}}</span>
								<span>{{ voucherDetail.totalPaidAmount }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">{{
									voucherDetail?.secondAccount?.subHeader ||
									"Second Paid Amount"
								}}</span>
								<span>{{ voucherDetail.secondAmount }}</span>
							</div>
						</div>
					</div>
					<div class="row justify-content-end" v-else>
						<div class="col-6 balance-container">
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Total Qty</span>
								<span>{{
									voucherDetail.relatedTreatmentSelection[0].treatmentTimes
								}}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Total</span>
								<span>{{
									voucherDetail.relatedTreatmentSelection[0].totalAmount
								}}</span>
							</div>
							<div class="d-flex px-2 py-3" v-if="props.saleReturnFlag">
								<span class="balance-label">Prev Price</span>
								<span>{{}}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">Discount</span>
								<span>{{ voucherDetail.discountAmount }}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">SubTotal</span>
								<template v-if="voucherDetail.discountAmount">
									<span>{{
										voucherDetail.relatedTreatmentSelection[0].totalAmount -
										voucherDetail.discountAmount
									}}</span>
								</template>
								<span v-else>{{
									voucherDetail.relatedTreatmentSelection[0].totalAmount
								}}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">{{
									voucherDetail?.relatedCash?.name ||
									voucherDetail?.relatedBank?.subHeader
								}}</span>
								<span>{{
									voucherDetail.relatedTreatmentSelection[0].paidAmount
								}}</span>
							</div>
							<div class="d-flex px-2 py-3">
								<span class="balance-label">{{
									voucherDetail?.secondAccount?.subHeader ||
									"Second Paid Amount"
								}}</span>
								<span>{{
									voucherDetail.relatedTreatmentSelection[0]?.secondAmount || 0
								}}</span>
							</div>
						</div>
					</div>
				</div>
				<!-- treatment Items -->

				<hr />
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
						<h5 class="fw-bold">Term & conditions</h5>
						<div class="d-flex flex-column">
							<span> - Non refund </span>
							<span> - </span>
							<span> - </span>
							<span> - </span>
							<span> - </span>
							<span> - </span>
						</div>
					</div>
					<div class="col-6 align-self-end text-center">
						<div class="sign mb-3"></div>
						<span class="text-capitalize">Authorzied Signature</span>
					</div>
				</div>
				<div>
					<h5 class="fw-bold text-capitalize">
						thank you for bussiness & please visit again
					</h5>
				</div>
			</div>
		</div>
		<!-- copied design -->
		<div class="row my-3">
			<div class="col"></div>
			<div class="col d-flex justify-content-center">
				<button class="btn btn-primary" @click="printVoucher()">print</button>
			</div>
			<div class="col"></div>
		</div>

		<SaleVoucherModal
			:paymentMethod="voucherPaymentMethod"
			:invoiceId="voucherId"
			:paymentAccData="paymentAccData"
			:customer="selectedCustomer"
			:treatments="selectedTreatmentSelections"
			:medicineItems="selectedMedicines"
			:medicineData="medicineData"
			:treatmentData="treatmentData" />
	</template>
</template>
<script setup>
import { ref, onMounted, computed } from "vue"
import { cusFormatDate, formatDate, openDialog } from "../../helpers"
import { useTreatmentVoucherStore } from "../../stores/treatmentVoucher"
import { useAppStore } from "../../stores/app"
// import SaleVoucherModal from "../../components/General/SaleVoucherModal"
import SaleVoucherModal from "../../components/General/SaleVoucherModal.vue"
import { useBranchStore } from "../../stores/branch"
import { getToday } from "@/helpers"
const tsType = ref("")
const isLoading = ref(false)
const branchStore = useBranchStore()
const appStore = useAppStore()
const props = defineProps(["id"])
const treatmentVoucherStore = useTreatmentVoucherStore()
const medicineItems = ref([])
const treatmentItems = ref([])
const packages = ref()
const printData = ref({})
const treatmentChange = ref()
const treatmentBalance = ref()
const voucherPaymentMethod = ref("")
const paymentAccData = ref({})
const treatmentData = ref({})
const selectedCustomer = ref({})
const selectedTreatmentSelections = ref([])
const selectedMedicines = ref([])
const medicineData = ref({})
const voucherId = ref("")
const voucherData = ref({
	date: "",
	address: "",
	phone: [],
	customerName: "",
	customerPhone: "",
	voucherCode: "",
	saleBy: "",
})
const voucherDetail = ref()
const medicineItemTotalQty = computed(() => {
	return medicineItems.value.reduce(
		(accumulator, currentValue) => accumulator + currentValue.qty,
		0
	)
})
const prepareFormData = () => {}
const printVoucher = () => {
	// for paymentAccData
	if (voucherDetail.value.relatedCash) {
		paymentAccData.value.first = voucherDetail.value.relatedCash.subHeader
	} else {
		paymentAccData.value.first = voucherDetail.value.relatedBank.subHeader
	}
	if (voucherDetail.value?.secondAccount) {
		paymentAccData.value.second = voucherDetail.value.secondAccount.subHeader
	}

	// for payment methods
	voucherPaymentMethod.value = voucherDetail.value.paymentMethod

	if (voucherDetail.value.tsType == "TSMulti") {
		//for treatmentData
		treatmentData.value = {
			paidAmount: voucherDetail.value.totalPaidAmount,
			secondAmount: voucherDetail.value.secondAmount,
			totalAmount: voucherDetail.value.totalAmount,
			discount: voucherDetail.value.totalDiscount,
		}

		//for selectedTreatmentSelections
		// selectedTreatmentSelections.value = voucherDetail.value.multiTreatment
		selectedTreatmentSelections.value = []
		let arr = [...voucherDetail.value.multiTreatment]

		// Create an object to store the merged result
		let result = {}

		// Iterate through the array and merge objects with the same id
		arr.forEach(item => {
			if (!result[item.item_id._id]) {
				// If id doesn't exist in the result object, add it
				result[item.item_id._id] = { ...item }
			} else {
				// If id already exists, update the qty
				result[item.item_id._id].qty += item.qty
				result[item.item_id._id].discountAmount += item.discountAmount
			}
		})

		// Convert the result object back to an array
		arr = Object.values(result)

		console.log(arr)
		arr.map(e => {
			e.name = e.item_id.name
			e.discountValue = e.discountAmount
			selectedTreatmentSelections.value.push(e)
		})
	}

	//for medicineData

	if (
		voucherDetail.value.tsType == "MS" ||
		voucherDetail.value.tsType == "Combined"
	) {
		medicineData.value.paidAmount = voucherDetail.value.msPaidAmount
		medicineData.value.secondAmount = voucherDetail.value.secondAmount
		medicineData.value.totalAmount = voucherDetail.value.msTotalAmount
		medicineData.value.discount = voucherDetail.value.msTotalDiscountAmount
	}
	//for selectedCustomer

	selectedCustomer.value = voucherDetail.value.relatedPatient

	//for selectedMedicines
	selectedMedicines.value = []

	if (voucherDetail.value.medicineItems.length > 0) {
		voucherDetail.value.medicineItems.map(e => {
			e.name = e.item_id.medicineItemName
			e.discountValue = e.discountAmount
			e.subTotal = e.qty * e.price - e.discountAmount
			selectedMedicines.value.push(e)
		})
	}

	//for voucher code
	voucherId.value = voucherDetail.value.code

	openDialog("saleVoucherModal")
}
onMounted(async () => {
	try {
		// isLoading.value = true

		let res = await treatmentVoucherStore.fetchTreatmentVoucher({
			id: props.id,
		})
		console.log(res.data[0])

		// voucherData only
		voucherData.value.date = formatDate(res.data[0].createdAt)
		voucherData.value.voucherCode = res.data[0].code
		voucherData.value.saleBy = res.data[0].createdBy.givenName
		voucherData.value.customerName =
			res.data[0]?.relatedPatient?.name || "not set"
		voucherData.value.customerPhone =
			res.data[0]?.relatedPatient?.phone || "not set"

		voucherDetail.value = res.data[0]
		console.log(voucherDetail.value.tsType)
		tsType.value = voucherDetail.value.tsType
		for (const key in appStore.contacts) {
			if (appStore.contacts.hasOwnProperty(key)) {
				if (appStore.contacts[key].id == res.data[0].relatedBranch) {
					voucherData.value.address = appStore.contacts[key].address
					voucherData.value.phone = appStore.contacts[key].phones
				}
			}
		}
		// voucherData only

		// medicine Items
		medicineItems.value = res.data[0].medicineItems
		console.log("medicine items", medicineItems.value)
		// medicine Items

		// treatment sale
		if (
			voucherDetail.value.tsType == "TSMulti" ||
			voucherDetail.value.tsType == "Combined" ||
			voucherDetail.value.tsType == "TS"
		) {
			if (
				voucherDetail.value.totalAmount > voucherDetail.value.totalPaidAmount
			) {
				if (voucherDetail.value.totalDiscount) {
					treatmentBalance.value =
						voucherDetail.value.totalAmount -
						(voucherDetail.value.totalPaidAmount +
							voucherDetail.value.totalDiscount)
				} else {
					treatmentBalance.value =
						voucherDetail.value.totalAmount -
						voucherDetail.value.totalPaidAmount
				}
			} else {
				treatmentBalance.value = 0
			}

			if (
				voucherDetail.value.totalAmount < voucherDetail.value.totalPaidAmount
			) {
				treatmentChange.value =
					voucherDetail.value.totalPaidAmount - voucherDetail.value.totalAmount
			} else {
				treatmentChange.value = 0
			}
		}
		let arr = []

		res.data[0].multiTreatment.map(e => {
			if (!e.discountAmount) {
				e.discountAmount = 0
			}
			arr.push(e)
		})
		console.log(arr)
		// Create an object to store consolidated quantities for each unique item
		let consolidatedArr = {}

		// Iterate through the array and consolidate quantities for each item
		arr.forEach(item => {
			const _id = item.item_id._id

			if (consolidatedArr[_id]) {
				consolidatedArr[_id].qty += item.qty
				consolidatedArr[_id].price += item.price
			} else {
				consolidatedArr[_id] = {
					qty: item.qty,
					price: item.price,
					item_id: item.item_id,
					_id: item.item_id._id,
					discountAmount: item.discountAmount,
				}
			}
		})

		// Convert the object values back to an array
		let resultArr = Object.values(consolidatedArr)

		console.log(resultArr)
		treatmentItems.value = resultArr
		// treatment sale
	} catch (error) {
		console.log(error)
	} finally {
		// isLoading.value = false
	}
})
</script>

<style lang="scss" scoped>
.balance-container div:nth-child(even) {
	background-color: rgba(251, 185, 196, 0.779);
}
.balance-label {
	font-weight: bold;
	min-width: 200px;
}

tr th,
tr td {
	white-space: nowrap;
}
</style>
