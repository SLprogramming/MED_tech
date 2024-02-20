<template>
	<div
		class="modal fade"
		id="saleVoucherModal"
		tabindex="-1"
		aria-labelledby="saleVoucherModalLabel"
		aria-hidden="true">
		<div class="modal-dialog" style="max-width: 800px">
			<div class="modal-content" style="width: 800px">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="saleVoucherModalLabel">
						Voucher Modal
					</h1>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="card p-3 mx-auto" style="max-width: 800px">
						<div id="saleVoucherPrintCard">
							<div class="d-flex justify-content-between">
								<img style="height: 100px" src="@/assets/img/logo.png" alt="" />
								<div class="d-flex flex-column">
									<span class="fw-bold">Invoice</span>
									<span>{{ props.invoiceId }}</span>
								</div>
							</div>
							<div class="row mb-3">
								<div class="col-8">
									<h5 class="fw-bold">Invoice From</h5>
									<address>
										<p class="text-black fw-bold" style="width: 400px">
											{{ contact?.address }}
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
									<h6 class="text-capitalize">
										<span class="fw-bold">Customer Name:</span>
										<span>{{ customer.name }}</span>
									</h6>
									<h6 class="text-capitalize">
										<span class="fw-bold">Customer Phone:</span>
										<span>{{ customer.phone }}</span>
									</h6>
								</div>
								<div class="col-4">
									<div class="d-flex flex-column text-capitalize">
										<span class="fw-bold">date</span>
										<span>{{ getToday() }}</span>
									</div>
								</div>
							</div>
							<div v-if="appointment">
								<h6 class="text-capitalize">
									<span class="fw-bold">Appointment</span>
									<span>{{
										appointment
											? cusFormatDate(appointment.originalDate)
											: "Not Set"
									}}</span>
								</h6>
							</div>
							<div v-if="isTreatmentExist">
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
											<tr v-for="(treatment, index) in treatments">
												<td>{{ index + 1 }}</td>
												<td style="max-width: 400px">{{ treatment.name }}</td>
												<td>{{ treatment.qty }}</td>
												<td>{{ formatNumber(treatment.price || 0) }}</td>
												<td>
													{{ formatNumber(treatment.discountValue || 0) }}
												</td>
												<td>{{ formatNumber(treatment.subTotal || 0) }}</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div class="row justify-content-end">
									<div class="col-6 balance-container">
										<div class="d-flex px-2 py-3">
											<span class="balance-label">Total Qty</span>
											<span>{{ treatmentTotalQty }}</span>
										</div>
										<div class="d-flex px-2 py-3">
											<span class="balance-label">Total</span>
											<span>{{ formatNumber(treatmentTotalPrice || 0) }}</span>
										</div>
										<div class="d-flex px-2 py-3" v-if="props.saleReturnFlag">
											<span class="balance-label">Prev Price</span>
											<span>{{ formatNumber(previousPrice || 0) }}</span>
										</div>
										<div class="d-flex px-2 py-3">
											<span class="balance-label">Discount</span>
											<span>{{ formatNumber(treatmentSubDiscount || 0) }}</span>
										</div>
										<div class="d-flex px-2 py-3">
											<span class="balance-label">SubTotal</span>
											<span>{{ formatNumber(treatmentSubTotal || 0) }}</span>
										</div>
										<div class="d-flex px-2 py-3">
											<span class="balance-label">{{
												paymentAccData.first
											}}</span>
											<span>{{ formatNumber(treatmentPaidAmount || 0) }}</span>
										</div>
										<div class="d-flex px-2 py-3">
											<span class="balance-label">
												{{
													paymentAccData.second || "Second Paid Amount"
												}}</span
											>
											<span>{{
												formatNumber(props.treatmentData.secondAmount || 0)
											}}</span>
										</div>
									</div>
								</div>
							</div>
							<div class="mb-5" v-if="isMedicineExist">
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
											<tr v-for="(medicineItem, index) in medicineItems">
												<td>{{ index + 1 }}</td>
												<td>{{ medicineItem.name }}</td>
												<td>{{ medicineItem.qty }}</td>
												<td>{{ formatNumber(medicineItem.price || 0) }}</td>
												<td>
													{{
														medicineItem.discountValue
															? formatNumber(medicineItem.discountValue || 0)
															: 0
													}}
												</td>
												<td>{{ formatNumber(medicineItem.subTotal || 0) }}</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div class="row justify-content-end">
									<div class="col-6 balance-container">
										<div class="d-flex px-2 py-3">
											<span class="balance-label">Total Qty</span>
											<span>{{ formatNumber(medicineItemTotalQty || 0) }}</span>
										</div>
										<div class="d-flex px-2 py-3">
											<span class="balance-label">Total</span>
											<span>{{
												formatNumber(medicineItemTotalPrice || 0)
											}}</span>
										</div>
										<div class="d-flex px-2 py-3">
											<span class="balance-label">Discount</span>
											<span>{{
												formatNumber(medicineItemSubDiscount || 0)
											}}</span>
										</div>
										<div class="d-flex px-2 py-3">
											<span class="balance-label">SubTotal</span>
											<span>{{
												formatNumber(medicineItemsSubTotal || 0)
											}}</span>
										</div>
										<div class="d-flex px-2 py-3">
											<span class="balance-label">{{
												paymentAccData.first
											}}</span>
											<span>{{
												formatNumber(props.medicineData.paidAmount || 0)
											}}</span>
										</div>
										<div class="d-flex px-2 py-3">
											<span class="balance-label">{{
												paymentAccData.second || "Second Paid Amount"
											}}</span>
											<span>{{
												formatNumber(props.medicineData.secondAmount || 0)
											}}</span>
										</div>
									</div>
								</div>
							</div>
							<hr />
							<div class="row justify-content-end mb-5">
								<div class="col-6 balance-container">
									<div class="d-flex px-2 py-3">
										<span class="balance-label">SubTotal</span>
										<span>{{ formatNumber(totalSubTotal || 0) }}</span>
									</div>
									<div class="d-flex px-2 py-3">
										<span class="balance-label">Total Paid Amount</span>
										<span>{{ formatNumber(totalPaidAmount || 0) }}</span>
									</div>
									<div class="d-flex px-2 py-3" v-if="cashBack">
										<span class="balance-label">Cash Back</span>
										<span>{{ formatNumber(cashBack || 0) }}</span>
									</div>
								</div>
							</div>
							<div
								class="row"
								v-if="treatmentData.deposit || treatmentData.deposit === 0">
								<div class="d-flex px-2 py-3">
									<span class="me-3 fw-bold">Deposit</span>
									<span>{{ treatmentData.deposit }}</span>
								</div>
								<!-- <div class="col">
                  {{ treatmentData.deposit }}
                </div> -->
							</div>
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
				</div>
				<div class="modal-footer">
					<button
						type="button"
						id="closeSaleVoucherModal"
						class="btn btn-secondary"
						data-bs-dismiss="modal">
						Close
					</button>
					<button type="button" @click="openPrintModal" class="btn btn-primary">
						Print
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useAppStore } from "../../stores/app"
import { cusFormatDate, getToday, openPrint, formatNumber } from "../../helpers"
import { useRouter } from "vue-router"

const router = useRouter()
const customTreatments = ref([])
const props = defineProps({
	paymentAccData: {
		type: Object,
		requried: true,
	},
	invoiceId: {
		type: String,
		requried: true,
		default: "testid",
	},
	saleReturnFlag: {
		default: false,
	},
	previousPrice: {
		default: 0,
	},
	paymentMethod: {
		type: String,
		requried: true,
		default: "Cash",
	},
	customer: {
		type: Object,
		requried: true,
		default() {
			return {
				name: "mya mya",
				phone: "09887366554",
			}
		},
	},
	medicineItems: {
		type: Array,
		requried: true,
		// default: [
		//   {
		//     name: "item one",
		//     qty: 1,
		//     price: 100,
		//     subTotal: 100,
		//   },
		//   {
		//     name: "item one",
		//     qty: 1,
		//     price: 100,
		//     subTotal: 100,
		//   }
		// ]
		default: [],
	},
	treatments: {
		type: Array,
		requried: false,
		// default: [
		//   {
		//     name: 'treatment one',
		//     price: 1000,
		//     qty: 1,
		//     subTotal: 1000
		//   },
		//   {
		//     name: 'treatment two',
		//     price: 1000,
		//     qty: 1,
		//     subTotal: 1000
		//   }
		// ]
		default: [],
	},
	treatmentData: {
		type: Object,
		requried: true,
		default: {
			paidAmount: 0,
			totalAmount: 0,
			discount: 0,
			deposit: 0,
			secondAmount: 0,
		},
	},
	medicineData: {
		type: Object,
		requried: true,
		default: {
			secondAmount: 0,
			paidAmount: 0,
			totalAmount: 0,
			discount: 0,
		},
	},
	treatmentSelectionId: {
		default: null,
	},
	appointment: {
		default: null,
	},
	cashBack: {
		default: null,
	},
	// treatmentPaidAmount: {
	//   type: String,
	//   default: 0
	// },
	// medicinePaidAmount: {
	//   type: String,
	//   default: 0
	// }
})
const appStore = useAppStore()
const contact = ref({})

const medicineItemTotalPrice = computed(() => {
	return props.medicineItems.reduce(
		(accumulator, currentValue) => accumulator + currentValue.subTotal,
		0
	)
})

const isTreatmentExist = computed(() => {
	return props.treatments && props.treatments.length > 0
})

const isMedicineExist = computed(() => {
	return props.medicineItems && props.medicineItems?.length > 0
})

const medicineItemTotalQty = computed(() => {
	return props.medicineItems.reduce(
		(accumulator, currentValue) => accumulator + currentValue.qty,
		0
	)
})

const medicineItemsSubTotal = computed(() => {
	return medicineItemTotalPrice.value - medicineItemSubDiscount.value
})

const medicineItemSubDiscount = computed(() => {
	return props.medicineData.discount
})

const treatmentTotalPrice = computed(() => {
	return props.treatmentData.totalAmount
})

const treatmentTotalQty = computed(() => {
	return props.treatments.reduce(
		(accumulator, currentValue) => accumulator + currentValue.qty,
		0
	)
})

const treatmentSubTotal = computed(() => {
	if (prevTreatmentPrice.value <= treatmentTotalPrice.value) {
		return (
			treatmentTotalPrice.value -
			prevTreatmentPrice.value -
			treatmentSubDiscount.value
		)
	} else {
		return 0
	}
})

const prevTreatmentPrice = computed(() => {
	return props.previousPrice ?? 0
})

const treatmentSubDiscount = computed(() => {
	return props.treatmentData.discount ?? 0
})

const totalSubTotal = computed(() => {
	return medicineItemsSubTotal.value + treatmentSubTotal.value
})

const totalPaidAmount = computed(() => {
	// if (treatmentPaidAmount.value && props.medicineData.paidAmount) {
	//   return treatmentPaidAmount.value + props.medicineData.paidAmount
	// } else if (!treatmentPaidAmount.value && props.medicineData.paidAmount) {
	//   return props.medicineData.paidAmount
	// } else if (treatmentPaidAmount.value && !props.medicineData.paidAmount) {
	//   return treatmentPaidAmount.value
	// } else {
	//   0
	// }
	return (
		(treatmentPaidAmount.value ?? 0) +
		(props.medicineData.paidAmount ?? 0) +
		(props.medicineData.secondAmount ?? 0) +
		(props.treatmentData.secondAmount ?? 0)
	)
})

const treatmentPaidAmount = computed(() => {
	// return treatmentSubTotal.value == 0 ? 0 : props.treatmentData.paidAmount
	return props.treatmentData.paidAmount
})

const openPrintModal = () => {
	openPrint(
		"saleVoucherPrintCard",
		`table tr td:not(:first-child) {
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
}`
	)

	if (props.appointment && props.treatmentSelectionId && props.customer) {
		let button = document.querySelector("#closeSaleVoucherModal")
		button.click()
		router.push({
			name: "procedure-history.create",
			query: {
				currentTab: "usage",
				treatmentSelectionId: props.treatmentSelectionId,
				appointmentId: props.appointment?._id,
				patientId: props.customer._id,
			},
		})
	}
}

onMounted(() => {
	contact.value = appStore.getContact()
	console.log(contact)
	console.log(props.paymentAccData)
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
