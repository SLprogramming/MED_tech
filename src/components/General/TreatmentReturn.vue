<template>
	<div
		class="modal fade"
		id="treatmentReturn"
		tabindex="-1"
		aria-labelledby="treatmentReturnLabel"
		aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body">
					<div class="card p-3">
						<h3 class="mb-4">Sale Return</h3>
						<form ref="treatmentReturnForm" @submit.prevent>
							<div class="row">
								<div class="col-12">
									<div class="mb-3">
										<label for="treatmentPackage" class="form-label"
											>Treatment Package</label
										>
										<input
											v-model="data.treatmentPackage"
											id="treatmentPackage"
											type="text"
											class="form-control"
											disabled />
									</div>
									<div class="mb-3">
										<label for="treatmentVoucher" class="form-label"
											>Treatment Voucher</label
										>
										<input
											v-model="data.treatmentVoucher"
											id="treatmentVoucher"
											type="text"
											class="form-control"
											disabled />
									</div>
									<div class="mb-3">
										<label for="totalCost" class="form-label">Total Cost</label>
										<input
											v-model="data.totalCost"
											id="totalCost"
											type="text"
											class="form-control"
											disabled />
									</div>
									<div class="mb-3">
										<label for="leftoverAmount" class="form-label"
											>Leftover Amount</label
										>
										<input
											v-model="data.leftOverAmount"
											id="leftoverAmount"
											type="text"
											class="form-control"
											disabled />
									</div>
									<template v-if="data.cashBack > 0">
										<div class="mb-3">
											<label class="form-label">Payment Return Type</label>
											<div class="mb-3">
												<select
													class="form-select"
													v-model="returnPaymentType"
													aria-label="Default select example">
													<option value="Cash">Cash</option>
													<option value="Bank">Bank</option>
												</select>
											</div>
										</div>
										<div v-if="returnPaymentType === 'Bank'" class="mb-3">
											<label for="returnBankAccount" class="form-label"
												>Return Bank Accounts</label
											>
											<select
												id="returnBankAccount"
												class="form-select"
												v-model="selectedReturnBankAccount"
												aria-label="Default select example"
												placeholder="select Account">
												<option
													v-for="(acc, index) in bankAccounts"
													:value="acc">
													{{ acc.name }}
												</option>
											</select>
										</div>
										<div v-if="returnPaymentType === 'Cash'" class="mb-3">
											<label for="returnCashAccount" class="form-label"
												>Return Cash Accounts</label
											>
											<select
												id="returnCashAccount"
												class="form-select"
												v-model="selectedReturnCashAccount"
												aria-label="Default select example"
												placeholder="select Account">
												<option
													v-for="(acc, index) in cashAccounts"
													:value="acc">
													{{ acc.name }}
												</option>
											</select>
										</div>
									</template>
									<div class="mb-3">
										<label for="" class="form-label">Return Type</label>
										<div class="d-flex gap-3 border rounded p-3">
											<div class="form-check">
												<input
													@change="calculateCashBack"
													class="form-check-input"
													v-model="data.returnType"
													value="Cash Refund"
													type="radio"
													id="cashRefund" />
												<label class="form-check-label" for="cashRefund">
													Cash Refund
												</label>
											</div>
											<div class="form-check">
												<input
													@change="calculateCashBack"
													class="form-check-input"
													v-model="data.returnType"
													value="Treatment"
													type="radio"
													id="returnTreatment" />
												<label class="form-check-label" for="returnTreatment">
													Treatment
												</label>
											</div>
										</div>
									</div>
									<template v-if="data.returnType === 'Treatment'">
										<div class="mb-3">
											<label for="" class="form-label">Purchase Type</label>
											<div class="border rounded p-3">
												<div class="d-flex gap-3">
													<div class="form-check">
														<input
															@change="resetBodyPart"
															class="form-check-input"
															v-model="data.purchaseType"
															value="surgery"
															type="radio"
															id="surgeryTreatmentReturn" />
														<label
															class="form-check-label"
															for="surgeryTreatmentReturn">
															Surgery
														</label>
													</div>
													<div class="form-check">
														<input
															@change="resetBodyPart"
															class="form-check-input"
															v-model="data.purchaseType"
															value="aesthetic"
															type="radio"
															id="AestheticTreatmentReturn" />
														<label
															class="form-check-label"
															for="AestheticTreatmentReturn">
															Aesthetic
														</label>
													</div>
												</div>
											</div>
										</div>
										<div class="mb-3" v-if="data.purchaseType === 'surgery'">
											<label for="depositTreatmentReturn" class="form-label"
												>Deposit</label
											>
											<input
												v-model="data.deposit"
												id="depositTreatmentReturn"
												type="number"
												class="form-control" />
										</div>
										<div class="mb-3">
											<label for="name" class="form-label">Body Part</label>
											<VueMultiselect
												:model-value="selectedBodyPart"
												@update:model-value="updateSelectedBodyPart"
												:options="filteredBodyParts"
												:searchable="true"
												:close-on-select="false"
												:allow-empty="false"
												:option-height="31"
												label="name"
												track-by="_id" />
										</div>
										<div class="mb-3" v-if="selectMonitor.bodyParts">
											<label class="form-label">Treatment</label>
											<VueMultiselect
												:model-value="selectedTreatmentList"
												@update:model-value="updateSelectedTreatmentList"
												:options="newTreatmentLists"
												:searchable="true"
												:close-on-select="false"
												:allow-empty="false"
												:option-height="31"
												:custom-label="customLabel"
												track-by="_id"
												placeholder="Type to search">
											</VueMultiselect>
										</div>
										<div class="mb-3" v-if="selectMonitor.treatment">
											<label class="form-label">Treatment Unit</label>
											<div v-if="fetchingTreatment" class="d-flex">
												<Spinner />
											</div>
											<VueMultiselect
												v-show="!fetchingTreatment"
												:model-value="selectedTreatment"
												:custom-label="treatmentSelectLabel"
												@update:model-value="updateSelectedTreatment"
												:options="newTreatments"
												:searchable="true"
												:close-on-select="false"
												:allow-empty="false"
												:option-height="31"
												label="name"
												track-by="_id" />
										</div>
										<div class="mb-3">
											<label for="sellingPrice" class="form-label"
												>Treatment Times</label
											>
											<input
												v-model="data.treatmentTimes"
												id="sellingPrice"
												type="text"
												class="form-control"
												disabled />
										</div>
										<div class="mb-3" v-if="data.treatmentTimes > 1">
											<label for="inBetweenDuration" class="form-label"
												>In Between Duration</label
											>
											<select
												v-model="data.inBetweenDuration"
												class="form-select"
												aria-label="Select Duration">
												<option selected>Select Duration</option>
												<option value="7">7</option>
												<option value="14">14</option>
												<option value="30">30</option>
											</select>
										</div>
										<div class="mb-3">
											<label
												@change="calculateNewLeftOverAmount"
												for="sellingPrice"
												class="form-label"
												>Selling Price</label
											>
											<input
												v-model="data.sellingPrice"
												id="sellingPrice"
												type="text"
												class="form-control"
												disabled />
										</div>
										<div class="mb-3">
											<label for="differenceAmount" class="form-label"
												>Difference Amount</label
											>
											<input
												v-model="data.differenceAmount"
												id="differenceAmount"
												type="text"
												class="form-control"
												disabled />
										</div>
										<label class="form-label">Payment Method</label>
										<div class="mb-3 border rounded p-3">
											<div class="d-flex gap-3">
												<!-- <div class="form-check">
                          <input class="form-check-input" v-model="paymentMethod" value="credit" type="radio" id="credit"
                            checked />
                          <label class="form-check-label" for="credit">
                            Partial
                          </label>
                        </div> -->
												<div class="form-check">
													<input
														class="form-check-input"
														v-model="paymentMethod"
														value="advance"
														type="radio"
														id="advance" />
													<label class="form-check-label" for="advance">
														Paid
													</label>
												</div>
												<!-- <div class="form-check">
                        <input class="form-check-input" v-model="paymentMethod" value="FOC" type="radio" id="foc" />
                        <label class="form-check-label" for="foc"> FOC </label>
                      </div> -->
											</div>
										</div>
										<template
											v-if="
												paymentMethod === 'advance' &&
												Number(data.differenceAmount) < 0
											">
											<div class="mb-3">
												<label class="form-label">Payment Type</label>
												<div class="mb-3">
													<select
														@change="updatePaidAmount"
														class="form-select"
														v-model="paymentType"
														aria-label="Default select example">
														<option value="Cash">Cash</option>
														<option value="Bank">Bank</option>
													</select>
												</div>
											</div>
											<div v-if="paymentType === 'Bank'" class="mb-3">
												<label for="bankAccount" class="form-label"
													>Bank Accounts</label
												>
												<select
													id="bankAccount"
													class="form-select"
													v-model="selectedBankAccount"
													aria-label="Default select example"
													placeholder="select Account">
													<option
														v-for="(acc, index) in bankAccounts"
														:value="acc">
														{{ acc.name }}
													</option>
												</select>
											</div>
											<div v-if="paymentType === 'Bank'" class="mb-3">
												<label for="bankAccountType" class="form-label"
													>Bank Payment Type</label
												>
												<select
													id="bankAccountType"
													class="form-select"
													v-model="selectedBankAccountType"
													aria-label="Default select example"
													placeholder="select Account">
													<option
														v-for="(acc, index) in bankAccountTypes"
														:value="acc">
														{{ acc.name }}
													</option>
												</select>
											</div>
											<div v-if="paymentType === 'Cash'" class="mb-3">
												<label for="cashAccount" class="form-label"
													>Cash Accounts</label
												>
												<select
													id="cashAccount"
													class="form-select"
													v-model="selectedCashAccount"
													aria-label="Default select example"
													placeholder="select Account">
													<option
														v-for="(acc, index) in cashAccounts"
														:value="acc">
														{{ acc.name }}
													</option>
												</select>
											</div>
										</template>
										<template v-if="data.paidAmount != 0">
											<label class="form-label">Discount Type</label>
											<div class="mb-3 border rounded p-3">
												<div class="d-flex gap-3">
													<div class="form-check">
														<input
															@change="onDiscountTypeUpdate"
															class="form-check-input"
															v-model="data.discountType"
															value="amount"
															type="radio"
															id="treatmentDiscountAmountType" />
														<label
															class="form-check-label"
															for="treatmentDiscountAmountType">
															Amount
														</label>
													</div>
													<div class="form-check">
														<input
															@change="onDiscountTypeUpdate"
															class="form-check-input"
															v-model="data.discountType"
															value="percent"
															type="radio"
															id="treatmentDiscountPercentType" />
														<label
															class="form-check-label"
															for="treatmentDiscountPercentType">
															Percent
														</label>
													</div>
												</div>
											</div>
											<div class="mb-3">
												<label class="form-label">Discount Value</label>
												<input
													@keyup="onDiscountTypeUpdate"
													type="text"
													class="form-control"
													v-model="data.discount" />
											</div>
										</template>
										<template v-if="paymentMethod !== 'FOC'">
											<div class="mb-3">
												<label for="paidAmount" class="form-label"
													>Paid Amount</label
												>
												<input
													@change="calculateNewLeftOverAmount"
													@keyup="calculateNewLeftOverAmount"
													v-model="data.paidAmount"
													id="paidAmount"
													type="text"
													class="form-control"
													:disabled="paymentMethod === 'credit'" />
											</div>
											<div class="mb-3">
												<label for="newLeftOverAmount" class="form-label"
													>New Left Over Amount</label
												>
												<input
													v-model="data.newLeftOverAmount"
													id="newLeftOverAmount"
													type="text"
													class="form-control"
													disabled />
											</div>
										</template>
										<div class="mb-3">
											<label class="form-label">Doctors</label>
											<div class="mb-3">
												<VueMultiselect
													:model-value="selectedDoctor"
													@update:model-value="updateSelectedDoctor"
													:options="doctors"
													:searchable="true"
													:close-on-select="true"
													:allow-empty="false"
													:option-height="31"
													label="name"
													track-by="_id" />
											</div>
										</div>
									</template>

									<div class="mb-3">
										<label for="cashBack" class="form-label">Cash Back</label>
										<input
											v-model="data.cashBack"
											id="cashBack"
											type="number"
											class="form-control"
											disabled />
									</div>

									<template v-if="data.returnType === 'Treatment'">
										<div class="mb-3">
											<label for="paymentImage" class="form-label"
												>Payment Image</label
											>
											<input
												type="file"
												class="form-control"
												name="payment"
												id="paymentImage" />
										</div>
									</template>

									<div class="mb-3">
										<label for="remark" class="form-label">Remark</label>
										<input
											type="text"
											v-model="data.remark"
											class="form-control"
											id="remark" />
									</div>

									<div
										class="mb-3"
										v-if="
											(paymentMethod === 'advance' ||
												paymentMethod === 'FOC' ||
												paymentMethod === 'patientAdvance') &&
											returnPaymentType === 'Treatment'
										">
										<div class="form-check">
											<input
												class="form-check-input"
												type="checkbox"
												v-model="data.sendEmail"
												id="sendEmail" />
											<label class="form-check-label" for="sendEmail">
												Send Email
											</label>
										</div>
									</div>

									<div class="mb-3 d-flex justify-content-between">
										<button
											ref="closeTreatmentReturnBtn"
											data-bs-dismiss="modal"
											type="button"
											class="btn btn-danger me-3">
											Cancel
										</button>
										<button
											:disabled="selecting"
											@click="submit"
											type="button"
											class="btn btn-primary">
											Select
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- <PrintModal /> -->
	<div
		ref="castVoucherDisplayreturn"
		class="card p-3 border-0 rounded shadow-sm d-none">
		<!-- html2canvas is not working without actual content(CastSaleVoucherModal) -->
		<CastSaleVoucherModal
			id="return"
			:paymentMethod="voucherPaymentMethod"
			:treatmentData="treatmentData"
			:customer="patient"
			:treatments="selectedItems"
			:previousPrice="previousPrice"
			:saleReturnFlag="saleReturnFlag"
			:cashBack="data.cashBack"
			:invoiceId="voucherId" />
	</div>
</template>

<script>
import VueMultiselect from "vue-multiselect"
import { useAppStore } from "../../stores/app"
import { useTreatmentListStore } from "../../stores/treatmentList"
import { useTreatmentSelectionStore } from "../../stores/treatmentSelection"
import Spinner from "../Common/Spinner.vue"
import { cusFormatDate, dateForParams } from "../../helpers"
import { useTreatmentVoucherStore } from "../../stores/treatmentVoucher"
import { useSaleReturnStore } from "../../stores/saleReturn"
import html2canvas from "html2canvas"
import CastSaleVoucherModal from "../General/CastSaleVoucherModal.vue"
export default {
	setup() {
		const treatmentSelectionStore = useTreatmentSelectionStore()
		const treatmentVoucherStore = useTreatmentVoucherStore()
		const treatmentListStore = useTreatmentListStore()
		const saleReturnStore = useSaleReturnStore()
		const appStore = useAppStore()
		return {
			treatmentSelectionStore,
			treatmentVoucherStore,
			treatmentListStore,
			appStore,
			saleReturnStore,
		}
	},
	props: [
		"selection",
		"appointment",
		"cashAccounts",
		"bankAccounts",
		"treatmentLists",
		"treatments",
		"patient",
		"doctors",
	],
	components: {
		VueMultiselect,
		Spinner,
		CastSaleVoucherModal,
	},
	data() {
		return {
			selectMonitor: {
				bodyParts: "",
				treatment: "",
				treatmentUnit: "",
			},
			isLoading: true,
			treatmentModal: null,
			fetchingTreatment: false,
			selectedDoctor: null,
			data: {
				treatmentPackage: "",
				treatmentTimes: 0,
				sellingPrice: 0,
				paidAmount: 0,
				inBetweenDuration: 7,
				leftOverAmount: 0,
				newLeftOverAmount: 0,
				differenceAmount: 0,
				deposit: 0,
				cashBack: 0,
				purchaseType: "surgery",
				remark: "",
				returnType: "Cash Refund",
				sendEmail: false,
				imageFile: null,
			},
			bodyParts: [
				{
					_id: 0,
					name: "Treatment",
				},
				{
					_id: 1,
					name: "Injection",
				},
				{
					_id: 2,
					name: "Hair,Combine Tre & Facial",
				},
				// {
				//   _id: 3,
				//   name: "Combination Package",
				// },
				{
					_id: 4,
					name: "Surgery Price List",
				},
			],
			paymentMethod: "advance",
			selectedBodyPart: {},
			newTreatments: [],
			newTreatmentLists: [],
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
			createdTreatmentSelection: {},
			selectedTreatmentList: {},
			selectedTreatment: {},
			selectedBankAccount: {},
			selectedReturnBankAccount: {},
			selectedCashAccount: {},
			selectedReturnCashAccount: {},
			selectedBankAccountType: {},
			returnPaymentType: "Cash",
			paymentType: "Cash",
			selecting: false,
			// voucher modal data
			selectedItems: [],
			treatmentData: {},
			voucherId: "",
			voucherPaymentMethod: "",
			castVoucherDisplay: null,
			saleReturnFlag: false,
			previousPrice: 0,
			// end voucher modal data
		}
	},
	computed: {
		filteredBodyParts() {
			if (this.data.purchaseType === "surgery") {
				return this.bodyParts.filter(each => each.name === "Surgery Price List")
			} else if (this.data.purchaseType === "aesthetic") {
				return this.bodyParts.filter(each => each.name !== "Surgery Price List")
			}
			return []
		},
	},
	watch: {
		selection(newValue, oldValue) {
			this.resetData()
			this.setData()
			this.getTreatmentSelectionVoucher()
			console.log(this.data.cashBack)
		},
		selectedTreatment(newTreatment, oldTreatment) {
			this.data.sellingPrice = newTreatment.sellingPrice
			this.data.treatmentTimes = newTreatment.treatmentTimes

			if (this.paymentMethod === "advance") {
				this.calculateDifferenceAmount()
				this.calculatePaidAmount()
				this.calculateCashBack()
				this.calculateNewLeftOverAmount()
			}
		},
	},
	methods: {
		dateForParams,
		onDiscountTypeUpdate() {
			this.calculateDiscount()
			this.calculatePaidAmount()
		},
		// update
		updateSelectedTreatmentList(e) {
			this.selectedTreatmentList = { ...e }
			this.updateSelectMonitor({ type: "treatment", value: e._id })
		},

		async updateSelectMonitor(payload) {
			if (payload.type === "bodyParts") {
				this.selectMonitor.bodyParts = payload.value

				this.newTreatmentLists = []
				this.selectMonitor.treatment = ""
				this.selectMonitor.treatmentUnit = ""
				this.selectedTreatmentList = {}
				this.selectedTreatment = {}

				this.treatmentLists.map(item => {
					if (item.bodyParts == payload.value) {
						console.log(item)
						this.newTreatmentLists.push(item)
					}
				})
			}

			if (payload.type === "treatment") {
				this.selectMonitor.treatment = payload.type
				this.fetchingTreatment = true
				try {
					let res = await this.treatmentListStore.fetchRelatedTreatments({
						id: payload.value,
					})
					this.newTreatments = res.data
				} catch (error) {
					console.log(error)
					this.newTreatments = []
				} finally {
					this.fetchingTreatment = false
				}
				this.selectedTreatment = {}
			}
		},
		updateSelectedBodyPart(e) {
			this.selectedBodyPart = { ...e }
			console.log(e.name)
			this.updateSelectMonitor({ type: "bodyParts", value: e.name })
		},
		updateSelectedDoctor(e) {
			this.selectedDoctor = { ...e }
		},
		updateSelectedTreatment(e) {
			this.selectedTreatment = { ...e }
			this.calculateDifferenceAmount()
			this.calculateCashBack()
		},
		// update end
		// label
		customLabel({ name, code }) {
			if (!name && !code) return "Select Treatment"
			return `${name} – ${code}`
		},
		customUniLabel({ name, code }) {
			if (!name && !code) return "Select Treatment"
			return `${name} – ${code}`
		},
		treatmentSelectLabel({ name, treatmentCode }) {
			if (!name && !treatmentCode) return "Select Treatment Unit"
			return `${name} – ${treatmentCode}`
		},
		// label end
		// calculate
		calculateDifferenceAmount() {
			if (this.selection.paymentMethod === "Cash Down") {
				this.data.differenceAmount =
					Number(this.data.totalCost) - Number(this.data.sellingPrice)
			} else if (this.selection.paymentMethod === "Credit") {
				let cashBack =
					Number(this.selection.totalAmount) -
					Number(this.selection.leftOverAmount)
				this.data.differenceAmount =
					Number(cashBack) - Number(this.data.sellingPrice)
			}
		},
		calculateNewLeftOverAmount() {
			if (Number(this.data.differenceAmount) >= 0) {
				this.data.newLeftOverAmount = 0
			} else {
				this.data.newLeftOverAmount = Math.abs(
					Number(this.data.differenceAmount) + Number(this.data.paidAmount)
				)
			}
		},
		calculateCashBack() {
			if (this.data.returnType === "Cash Refund") {
				if (this.selection.paymentMethod === "Cash Down") {
					this.data.cashBack = this.data.totalCost
				} else if (this.selection.paymentMethod === "Credit") {
					this.data.cashBack =
						this.selection.totalAmount - this.selection.leftOverAmount
				}
			} else if (this.data.returnType === "Treatment") {
				// if (this.selection.paymentMethod === 'Cash Down') {
				//   this.data.cashBack = (this.data.totalCost - this.data.sellingPrice) > 0 ? (this.data.totalCost - this.data.sellingPrice) : 0
				// } else if (this.selection.paymentMethod === 'Credit') {
				//   this.data.cashBack = this.selection. - this.selection.leftOverAmount
				// }
				if (this.data.differenceAmount > 0) {
					this.data.cashBack = this.data.differenceAmount
				} else {
					this.data.cashBack = 0
				}
			}
		},
		calculateDiscount() {
			this.data.differenceAmount
			if (this.data.differenceAmount < 0) {
				if (this.data.discountType === "amount") {
					this.data.discountValue = Number(this.data.discount)
					this.data.subTotal =
						Math.abs(this.data.differenceAmount) - Number(this.data.discount)
					console.log("sub total", this.data.subTotal)
				} else if (this.data.discountType === "percent") {
					this.data.discountValue =
						Math.abs(this.data.differenceAmount) *
						(Number(this.data.discount) / 100)
					this.data.subTotal = Math.round(
						Math.abs(this.data.differenceAmount) -
							Math.abs(this.data.differenceAmount) *
								(Number(this.data.discount) / 100)
					)
				} else {
					this.data.discount = 0
					this.data.subTotal = Math.abs(this.data.differenceAmount)
				}
			}
			// if (this.data.discountCheck) {
			//   let discount = this.patient.relatedMember?.relatedDiscount.filter(each => each.type === 'Percentage')
			//   this.data.discount = discount[0].value
			//   this.data.subTotal = Math.round(Number(this.data.sellingPrice) - (Number(this.data.sellingPrice) * (Number(this.data.discount) / 100)))
			//   this.calculatePaidAmount()
			// }
		},
		calculatePaidAmount() {
			if (this.data.returnType === "Treatment") {
				if (Number(this.data.differenceAmount) >= 0) {
					this.data.paidAmount = 0
				} else {
					// this.data.paidAmount = Math.abs(Number(this.data.differenceAmount))
					if (Number(this.data.discount) > 0) {
						this.data.paidAmount = this.data.subTotal
					} else {
						this.data.paidAmount = Math.abs(Number(this.data.differenceAmount))
					}
				}
			} else if (this.data.returnType === "Cash Refund") {
				this.data.paidAmount = 0
				this.data.cashBack = this.data.totalCost
			}
		},
		// calculate end
		// prepare
		prepareFormForTreatmentSelect() {
			let paymentMethod = false
			paymentMethod = "Cash Down"

			let cusObj = {}

			cusObj.date = new Date().toISOString()
			cusObj.appointmentId = null
			cusObj.phone = this.patient.phone

			let purchaseType = "Clinic"
			if (this.data.purchaseType === "surgery") purchaseType = "Surgery"
			if (this.data.purchaseType === "aesthetic") purchaseType = "Clinic"

			let data = {
				relatedPatient: this.patient._id,
				originalDate: cusObj.date,
				phone: cusObj.phone,
				// relatedDoctor: this.selectedTreatment.relatedDoctor?._id,
				relatedDoctor: this.selectedDoctor
					? this.selectedDoctor._id
					: this.appStore.defaultDoctor._id,
				// relatedDoctor: this.appStore.defaultDoctor._id,
				relatedTreatment: this.selectedTreatment._id,
				relatedTreatmentList: this.selectedTreatmentList._id,
				paymentMethod: paymentMethod,
				// paidAmount: this.data.paidAmount,
				totalAmount: this.data.sellingPrice,
				leftOverAmount: this.data.newLeftOverAmount,
				selectionStatus: "Ongoing", // ['Ongoing', 'Done']
				treatmentTimes: this.data.treatmentTimes,
				bodyParts: this.selectedBodyPart.name, //['Face', 'Body', 'Body Injection'],
				inBetweenDuration: this.data.inBetweenDuration
					? Number(this.data.inBetweenDuration)
					: 0,
			}

			if (this.data.purchaseType === "surgery")
				data.deposit = this.data.deposit ?? 0

			if (cusObj.appointmentId) data.appointment = cusObj.appointmentId
			if (this.data.remark) data.remark = this.data.remark
			if (this.data.purchaseType) data.purchaseType = purchaseType

			console.log("paymentMethod,", this.paymentMethod)
			if (
				this.paymentMethod === "advance" &&
				this.paymentType === "Cash" &&
				Number(this.data.differenceAmount) < 0
			) {
				data.relatedCash = this.selectedCashAccount._id
			} else if (
				this.paymentMethod === "advance" &&
				this.paymentType === "Bank" &&
				Number(this.data.differenceAmount) < 0
			) {
				data.relatedBank = this.selectedBankAccount._id
				data.bankType = this.selectedBankAccountType.value
			}

			if (this.paymentMethod === "FOC") {
				data.paidAmount = 0
				data.totalAmount = 0
			}

			if (
				this.data.discountType &&
				this.paymentMethod === "advance" &&
				this.data.discountValue
			) {
				if (this.data.discountType === "amount") {
					data.discountType = 0 // 'Amount'
				}
				if (this.data.discountType === "percent") {
					data.discountType = 1 // 'Percent'
				}
				// if (this.data.discountType === 'foc') data.relatedDiscount = this.selectedFocDiscount._id
				data.discountAmount = this.data.discountValue
			}

			if (this.data.returnType === "Treatment") {
				if (this.data.discountValue > 0) {
					data.paidAmount = this.data.paidAmount
				} else {
					data.paidAmount = this.data.sellingPrice
				}
			}

			console.log("treatment select data", data)

			var formData = new FormData(this.$refs.treatmentReturnForm)

			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					formData.append(key, data[key])
				}
			}

			return formData
		},
		prepareFormForSaleReturn() {
			let data = {
				relatedPatient: this.patient._id,
				relatedTreatmentSelection: this.selection._id,
				relatedTreatmentVoucher: this.voucherData._id,
				// relatedAppointment: "645b4c9bae182d05d06a60c4",
				leftoverAmount: this.data.leftOverAmount,
				totalAmount: this.data.totalCost,
				purchaseType: this.data.purchaseType ?? "Clinic",
				// cashBack: this.data.cashBack > 0 ? this.data.cashBack : this.data.leftOverAmount,
				// returnType: "SubTreatment", //enum: ['Full Cash', 'SubTreatment']
			}

			if (this.data.returnType === "Treatment") {
				if (this.data.cashBack > 0) {
					if (this.returnPaymentType === "Cash") {
						data.relatedCash = this.selectedReturnCashAccount._id
					} else if (this.returnPaymentType === "Bank") {
						data.relatedBank = this.selectedReturnBankAccount._id
					}
				}
				data.cashBack = this.data.cashBack
				data.paidAmount = this.data.paidAmount
				data.deferAmount = this.data.differenceAmount
				data.returnType = "SubTreatment"
				data.relatedSubTreatment = this.createdTreatmentSelection._id //TreatmentSelections ID
			} else if (this.data.returnType === "Cash Refund") {
				if (this.returnPaymentType === "Cash") {
					data.relatedCash = this.selectedReturnCashAccount._id
				} else if (this.returnPaymentType === "Bank") {
					data.relatedBank = this.selectedReturnBankAccount._id
				}
				data.cashBack = this.data.cashBack
				data.returnType = "Full Cash"
			}

			if (this.data.remark) data.remark = this.data.remark

			return data
		},
		prepareEmailForm() {
			let formData = {
				recipent: this.patient.email,
				voucherType: "Treatment Sale",
				voucherNo: this.voucherId,
				voucherDate: cusFormatDate(dateForParams()),
			}

			let newFormData = new FormData()

			for (let key in formData) {
				if (formData.hasOwnProperty(key)) {
					newFormData.append(key, formData[key])
				}
			}
			console.log(this.data.imageFile)
			if (this.data.imageFile) newFormData.append("file", this.data.imageFile)
			return newFormData
		},
		prepareVoucherData(data) {
			console.log(data)
			this.selectedItems = []
			let newObj = {
				name: data.data[0].relatedTreatment.name,
				price: data.data[0].relatedTreatment.sellingPrice,
				qty: 1,
				discountValue: data.treatmentVoucherResult[0].discountAmount ?? 0,
			}
			newObj.subTotal = +newObj.price - +newObj.discountValue
			this.selectedItems.push(newObj)
			this.treatmentData = {
				paidAmount: data.data[0].paidAmount,
				totalAmount: newObj.subTotal,
				discount: 0,
				deposit:
					this.data.purchaseType === "surgery" ? this.data.deposit : undefined,
			}
			this.voucherPaymentMethod = data.data[0].paymentMethod
			this.voucherId = data ? data.treatmentVoucherResult[0].code : "N/A"
			console.log(this.data.returnType)
			if (this.data.returnType === "Treatment") {
				;(this.saleReturnFlag = true),
					(this.previousPrice = this.data.totalCost)
				this.cashBack = this.data.cashBack ?? undefined
				this.treatmentData.paidAmount = this.data.paidAmount
			}
		},
		// prepare end
		// submit
		async genereateImage() {
			// let castContent = document.querySelector('#castVoucherDisplay')
			this.$refs.castVoucherDisplayreturn.classList.remove("d-none")
			const content = await document.querySelector("#castSaleVoucherCardreturn")
			const canvas = await html2canvas(content, {
				width: content.scrollWidth + 20,
				height: content.scrollHeight + 20,
			})
			// this.$refs.castVoucherDisplayreturn.classList.add('d-none')
			const imageData = canvas.toDataURL("image/png")
			console.log(imageData)
			this.data.imageFile = imageData
		},
		async selectTreatment() {
			let data = this.prepareFormForTreatmentSelect()
			console.log(data)
			return
			try {
				let res = await this.treatmentSelectionStore.addTreatmentSelection(data)
				console.log(this.paymentMethod)
				this.prepareVoucherData(res)
				if (this.paymentMethod === "advance") {
					if (this.data.sendEmail) {
						await this.genereateImage()
						await this.sendEmail()
					}
					this.$emit(
						"openTreatmentSelectModal",
						res,
						this.saleReturnFlag,
						this.previousPrice,
						this.data.cashBack,
						this.data.paidAmount
					)
				}
				this.$emit("updateTreatmentSelections", res.data[0])
				this.createdTreatmentSelection = res.data[0]
				console.log(res)

				// reset data
				this.saleReturnFlag = false
				this.previousPrice = null
				this.data.cashBack = 0
				this.data.paidAmount = 0
			} catch (err) {
				this.appStore.showError()
				console.log(err)
				throw err
			}
		},
		async submit() {
			this.prepareFormForTreatmentSelect()
			// return
			this.selecting = true

			try {
				// console.log(saleReturnFormData)
				if (this.data.returnType === "Treatment") {
					await this.selectTreatment()
				}

				let saleReturnFormData = this.prepareFormForSaleReturn()
				console.log(saleReturnFormData)
				//  return
				let res = await this.saleReturnStore.createSaleReturn(
					saleReturnFormData
				)
				console.log(res)

				if (this.data.returnType !== "Treatment") {
					this.$emit("replaceTreatmentSelections", res.selecUpdate)
				}
				this.appStore.showSuccess()
				// console.log(res)
				if (res) {
					this.closeModal()
				}
				// if (this.paymentMethod === "advance" || this.paymentMethod === "FOC") {
				//   this.$emit("openTreatmentSelectModal", res)
				// }
			} catch (err) {
				this.appStore.showError()
				console.log(err)
			} finally {
				this.selecting = false
			}
		},
		async sendEmail() {
			let payload = this.prepareEmailForm()
			console.log(payload)
			try {
				console.log("sending email")
				let res = await this.treatmentSelectionStore.sendEmail(payload)
				console.log(res)
			} catch (error) {
				console.log(error)
				throw error
			}
		},
		// submit end
		closeModal() {
			// const cancelButton = document.querySelector("#closebutton")
			this.$refs.closeTreatmentReturnBtn.click()
		},

		async getTreatmentSelectionVoucher() {
			try {
				let res =
					await this.treatmentVoucherStore.fetchTreatmentVoucherByTreatmentSelectionId(
						{ id: this.selection._id }
					)
				console.log(res)
				this.voucherData = res.data[0]
				this.data.treatmentVoucher = res.data[0]?.code
			} catch (error) {
				console.log(error)
			}
		},

		resetData() {
			this.selectMonitor = {
				bodyParts: "",
				treatment: "",
				treatmentUnit: "",
			}
			this.data = {
				treatmentPackage: "",
				treatmentTimes: 0,
				sellingPrice: 0,
				paidAmount: 0,
				inBetweenDuration: 7,
				leftOverAmount: 0,
				newLeftOverAmount: 0,
				differenceAmount: 0,
				purchaseType: "Clinic",
				remark: "",
				returnType: "Cash Refund",
				deposit: 0,
			}
			this.paymentMethod = "advance"
			this.selectedBodyPart = {}
			this.newTreatments = []
			this.newTreatmentLists = []
			this.bankAccountTypes = [
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
			]
			this.selectedTreatmentList = {}
			this.selectedTreatment = {}
			this.selectedBankAccount = {}
			this.selectedCashAccount = {}
			this.selectedBankAccountType = {}
			this.paymentType = "Cash"
			;(this.returnPaymentType = "Cash"), (this.selecting = false)

			this.selectedCashAccount = this.cashAccounts[0]
			this.selectedBankAccount = this.bankAccounts[0]
			this.selectedReturnCashAccount = this.cashAccounts[0]
			this.selectedReturnBankAccount = this.bankAccounts[0]
		},

		setData() {
			if (this.selection.paymentMethod === "Paid") {
				this.data.treatmentPackage = this.selection.relatedTreatment?.name
				this.data.totalCost = this.selection.totalAmount
				this.data.cashBack = this.data.totalCost
				this.data.leftOverAmount = this.selection.totalAmount
			} else if (this.selection.paymentMethod === "Partial") {
				this.data.treatmentPackage = this.selection.relatedTreatment?.name
				this.data.totalCost = this.selection.totalAmount
				this.data.cashBack =
					this.selection.totalAmount - this.selection.leftOverAmount
				this.data.leftOverAmount = this.selection.leftOverAmount
			}
		},

		async mounted() {
			this.selectedCashAccount = this.cashAccounts[0]
			this.selectedBankAccount = this.bankAccounts[0]
			this.selectedReturnCashAccount = this.cashAccounts[0]
			this.selectedReturnBankAccount = this.bankAccounts[0]
		},
	},
}
</script>

<style lang="scss" scoped></style>
