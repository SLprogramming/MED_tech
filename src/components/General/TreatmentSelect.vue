<template>
	<div
		class="modal fade"
		id="treatmentSelectModal"
		tabindex="-1"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-body">
					<div class="card p-3">
						<h3 class="mb-4">Treatment Sale</h3>
						<form ref="treatmentSelectForm" @submit.prevent>
							<div class="row">
								<div class="col-12">
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
														id="surgery"
														checked />
													<label class="form-check-label" for="surgery">
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
														id="Aesthetic" />
													<label class="form-check-label" for="Aesthetic">
														Aesthetic
													</label>
												</div>
											</div>
										</div>
									</div>
									<div class="mb-3" v-if="data.purchaseType === 'surgery'">
										<label for="deposit" class="form-label">Deposit</label>
										<input
											v-model="data.deposit"
											id="deposit"
											type="text"
											class="form-control" />
									</div>
									<!-- <div class="mb-3">
										<label for="name" class="form-label">Body Part</label>
										<VueMultiselect
											:model-value="selectedBodyPart"
											@update:model-value="updateSelectedBodyPart"
											:options="filteredBodyParts"
											:searchable="true"
											:close-on-select="true"
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
											:close-on-select="true"
											:allow-empty="false"
											:option-height="31"
											:custom-label="customLabel"
											track-by="_id"
											placeholder="Type to search">
										</VueMultiselect>
									</div> -->
									<div class="mb-3">
										<label class="form-label">Treatment Unit</label>

										<VueMultiselect
											:model-value="selectedTreatment"
											:custom-label="treatmentSelectLabel"
											@update:model-value="updateSelectedTreatment"
											:options="newTreatments"
											:searchable="true"
											:close-on-select="true"
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
									<!-- <div class="mb-3">
									<label for="inBetweenDuration" class="form-label"
										>In Between Duration</label
									>
									<input
										v-model="data.inBetweenDuration"
										id="inBetweenDuration"
										type="text"
										class="form-control" />
								</div> -->
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
										<label for="sellingPrice" class="form-label"
											>Selling Price</label
										>
										<input
											@keyup="onDiscountTypeUpdate"
											v-model="data.sellingPrice"
											id="sellingPrice"
											type="text"
											class="form-control" />
									</div>
									<label for="" class="form-label">Date</label>
									<input
										type="date"
										name=""
										class="form-control mb-3"
										v-model="date"
										id="" />
									<label class="form-label">Payment Method</label>
									<div class="mb-3 border rounded p-3">
										<div class="d-flex gap-3">
											<!-- <div class="form-check">
												<input
													class="form-check-input"
													v-model="paymentMethod"
													value="credit"
													type="radio"
													id="credit"
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
											<div class="form-check">
												<input
													class="form-check-input"
													v-model="paymentMethod"
													value="FOC"
													type="radio"
													id="foc" />
												<label class="form-check-label" for="foc"> FOC </label>
											</div>
											<!-- <div class="form-check">
												<input
													class="form-check-input"
													v-model="paymentMethod"
													value="patientAdvance"
													type="radio"
													id="patientAdvance" />
												<label class="form-check-label" for="patientAdvance">
													Advance
												</label>
											</div> -->
										</div>
									</div>
									<div v-if="paymentMethod === 'patientAdvance'">
										<label class="form-label">Advance Record</label>
										<div class="mb-3">
											<VueMultiselect
												:model-value="selectedAdvanceRecord"
												@update:model-value="updateSelectedAdvanceRecord"
												:options="advanceRecords"
												:searchable="true"
												:custom-label="customAdvanceRecordLabel"
												:close-on-select="true"
												:allow-empty="false"
												:option-height="31"
												label="name"
												track-by="_id" />
										</div>
									</div>

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

									<div class="mb-3" v-if="paymentMethod === 'patientAdvance'">
										<label for="differenceAmount" class="form-label"
											>Difference Amount</label
										>
										<input
											type="number"
											@change="calculateDifferenceAmount"
											v-model="data.differenceAmount"
											class="form-control"
											id="differenceAmount"
											disabled />
									</div>

									<div
										v-if="
											paymentMethod === 'advance' ||
											paymentMethod === 'patientAdvance'
										"
										class="mb-3">
										<div class="d-flex justify-content-center mb-3 gap-5">
											<div class="d-flex align-content-center">
												<input
													type="radio"
													@change="changeSecPayAmount()"
													class="form-check-input me-2"
													name="paymentMethods"
													v-model="paymentStatus"
													value="full"
													id="full" />
												<label class="fw-bold fs-5 d-inline" for="full"
													>Full</label
												>
											</div>
											<div class="d-flex align-content-center">
												<input
													type="radio"
													@change="changeSecPayAmount()"
													class="form-check-input me-2"
													id="separate"
													v-model="paymentStatus"
													value="separate"
													name="paymentMethods" />
												<label for="separate" class="fw-bold fs-5 d-inline"
													>Separate</label
												>
											</div>
										</div>
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
									<template
										v-if="
											paymentMethod === 'advance' ||
											paymentMethod === 'patientAdvance'
										">
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
										<template v-if="paymentStatus == 'separate'">
											<h5 class="mb-3">Second Payment Method</h5>
											<div class="mb-3">
												<select
													class="form-select"
													v-model="secPaymentMethod"
													aria-label="Default select example">
													<option value="Cash">Cash</option>
													<option value="Bank">Bank</option>
												</select>
											</div>
											<div v-if="secPaymentMethod === 'Bank'" class="mb-3">
												<label for="bankAccount" class="form-label"
													>Bank Accounts</label
												>
												<select
													id="bankAccount"
													class="form-select"
													v-model="secSelectedBankAccount"
													aria-label="Default select example"
													placeholder="select Account">
													<option
														v-for="(acc, index) in bankAccounts"
														:value="acc">
														{{ acc.name }}
													</option>
												</select>

												<label for="cashAccount" class="form-label"
													>Bank Payment Type</label
												>
												<select
													id="cashAccount"
													class="form-select"
													v-model="secBankType"
													aria-label="Default select example"
													placeholder="select Account">
													<option
														v-for="(acc, index) in bankAccountTypes"
														:key="index"
														:value="acc">
														{{ acc.name }}
													</option>
												</select>
											</div>
											<div v-if="secPaymentMethod === 'Cash'" class="mb-3">
												<label for="cashAccount" class="form-label"
													>Cash Accounts</label
												>
												<select
													id="cashAccount"
													class="form-select"
													v-model="secSelectedCashAccount"
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
									</template>
									<template v-if="paymentMethod !== 'FOC'">
										<template v-if="paymentMethod == 'advance'">
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
													<!-- <div class="form-check">
                            <input @change="onDiscountTypeUpdate" class="form-check-input" v-model="data.discountType"
                              value="foc" type="radio" id="treatmentDiscountFocType" />
                            <label class="form-check-label" for="treatmentDiscountFocType">
                              Foc
                            </label>
                          </div> -->
												</div>
											</div>
											<!-- <div class="mb-3" v-if="data.discountType === 'amount'">
                        <label for="name" class="form-label">Amount Discount</label>
                        <VueMultiselect :model-value="selectedAmountDiscount"
                          @update:model-value="updateSelectedAmountDiscount" :options="discountTypes.amountDiscounts"
                          :searchable="true" :close-on-select="true" :allow-empty="false" :option-height="31" label="name"
                          track-by="_id" />
                      </div>
                      <div class="mb-3" v-if="data.discountType === 'percent'">
                        <label for="name" class="form-label">Percent Discount</label>
                        <VueMultiselect :model-value="selectedPercentDiscount"
                          @update:model-value="updateSelectedPercentDiscount" :options="discountTypes.percentDiscounts"
                          :searchable="true" :close-on-select="true" :allow-empty="false" :option-height="31" label="name"
                          track-by="_id" />
                      </div>
                      <div class="mb-3" v-if="data.discountType === 'foc'">
                        <label for="name" class="form-label">Foc Discount</label>
                        <VueMultiselect :model-value="selectedFocDiscount" @update:model-value="updateSelectedFocDiscount"
                          :options="discountTypes.focItemsDiscounts" :searchable="true" :close-on-select="true"
                          :allow-empty="false" :option-height="31" label="name" track-by="_id" />
                      </div> -->

											<div class="mb-3">
												<label class="form-label">Discount Value</label>
												<input
													@keyup="onDiscountTypeUpdate"
													type="text"
													class="form-control"
													v-model="data.discount" />
											</div>

											<!-- <div v-if="patient.relatedMember" class="form-check mb-3">
                        <input @change="calculateDiscount" class="form-check-input" type="checkbox"
                          v-model="data.discountCheck" id="discountCheckForTreatmentSelect">
                        <label class="form-check-label" for="discountCheckForTreatmentSelect">
                          Discount Check
                        </label>
                      </div> -->

											<!-- <template v-if="data.discountCheck">
                        <div class="mb-3">
                          <label for="treatmentSelectDiscount" class="form-label">Discount</label>
                          <input v-model="data.discount" id="treatmentSelectDiscount" type="number" class="form-control"
                            disabled />
                        </div>
                        <div class="mb-3">
                          <label for="treatmentSelectSubTotal" class="form-label">Sub Total</label>
                          <input v-model="data.subTotal" id="treatmentSelectSubTotal" type="number" class="form-control"
                            disabled />
                        </div>
                      </template> -->
										</template>

										<div class="mb-3">
											<label for="paidAmount" class="form-label"
												>Paid Amount</label
											>
											<input
												@change="calculateLeftOverAmount"
												@keyup="calculateLeftOverAmount"
												v-model="data.paidAmount"
												id="paidAmount"
												type="text"
												class="form-control"
												:disabled="paymentMethod === 'credit'" />
										</div>
										<div v-if="paymentStatus == 'separate'" class="mb-3">
											<label for="paidAmount" class="form-label"
												>Second Paid Amount</label
											>
											<input
												@change="calculateLeftOverAmount"
												@keyup="calculateLeftOverAmount"
												v-model="data.secPaidAmount"
												id="paidAmount"
												type="text"
												class="form-control"
												:disabled="paymentMethod === 'FOC'" />
										</div>
										<div class="mb-3">
											<label for="leftOverAmount" class="form-label"
												>Left Over Amount</label
											>
											<input
												v-model="data.leftOverAmount"
												id="leftOverAmount"
												type="number"
												class="form-control"
												disabled />
										</div>
									</template>

									<template v-if="paymentMethod === 'patientAdvance'">
										<label for="cashBack" class="form-label">Cash Back</label>
										<input
											type="number"
											v-model="data.cashBack"
											class="form-control"
											id="cashBack"
											disabled />
									</template>

									<div class="mb-3" v-if="paymentMethod !== 'credit'">
										<label for="paymentImage" class="form-label"
											>Payment Image</label
										>
										<input
											type="file"
											class="form-control"
											name="payment"
											id="paymentImage" />
									</div>

									<div class="mb-3">
										<label for="remark" class="form-label">Remark</label>
										<input
											type="text"
											v-model="data.remark"
											class="form-control"
											id="remark" />
									</div>

									<label class="form-label">Print Modal Type</label>
									<div class="mb-3 border rounded p-3">
										<div class="d-flex gap-3">
											<div class="form-check">
												<input
													class="form-check-input"
													v-model="data.printType"
													value="normal"
													type="radio"
													id="normalPrintType"
													checked />
												<label class="form-check-label" for="normalPrintType">
													Normal
												</label>
											</div>
											<div class="form-check">
												<input
													class="form-check-input"
													v-model="data.printType"
													value="slip"
													type="radio"
													id="slipPrintType" />
												<label class="form-check-label" for="slipPrintType">
													Slip
												</label>
											</div>
										</div>
									</div>

									<div
										class="mb-3"
										v-if="
											paymentMethod === 'advance' ||
											paymentMethod === 'FOC' ||
											paymentMethod === 'patientAdvance'
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
											id="closebutton"
											data-bs-dismiss="modal"
											type="button"
											class="btn btn-danger me-3">
											Cancel
										</button>
										<!-- <button :disabled="selecting" @click="storeTreatmentSelection" type="button" class="btn btn-primary">
                      Done
                    </button> -->
										<LoadingButton
											name="Done"
											@click="storeTreatmentSelection"
											:loading="selecting" />
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div
		ref="castVoucherDisplay"
		id="castVoucherDisplay"
		class="card p-3 border-0 rounded shadow-sm d-none">
		<!-- html2canvas is not working without actual content(CastSaleVoucherModal) -->
		<CastSaleVoucherModal
			:paymentMethod="voucherPaymentMethod"
			:treatmentData="treatmentData"
			:customer="patient"
			:treatments="selectedItems"
			:invoiceId="voucherId" />
	</div>
</template>

<script>
import { dateForParams, cusFormatDate } from "../../helpers"
import VueMultiselect from "vue-multiselect"
import html2canvas from "html2canvas"
import { useAppStore } from "../../stores/app"
import { useTreatmentListStore } from "../../stores/treatmentList"
import { useMedicineSaleStore } from "../../stores/medicineSale"
import { useTreatmentSelectionStore } from "../../stores/treatmentSelection"
import { useAdvanceRecordStore } from "../../stores/advanceRecord"
import Spinner from "../Common/Spinner.vue"
import LoadingButton from "../Common/LoadingButton.vue"
import { treatmentResWithPaidAndDiscount } from "../../mock/treatment"
import CastSaleVoucherModal from "@/components/General/CastSaleVoucherModal.vue"
export default {
	setup() {
		const treatmentSelectionStore = useTreatmentSelectionStore()
		const treatmentListStore = useTreatmentListStore()
		const advanceRecordStore = useAdvanceRecordStore()
		const medicineSaleStore = useMedicineSaleStore()
		const appStore = useAppStore()
		return {
			treatmentSelectionStore,
			advanceRecordStore,
			treatmentListStore,
			appStore,
			medicineSaleStore,
		}
	},
	props: [
		"appointment",
		"cashAccounts",
		"bankAccounts",
		"treatmentLists",
		"treatments",
		"patient",
		"discounts",
		"advanceRecords",
		"doctors",
	],
	components: {
		VueMultiselect,
		Spinner,
		LoadingButton,
		CastSaleVoucherModal,
	},
	data() {
		return {
			selectMonitor: {
				bodyParts: "",
				treatment: "",
				treatmentUnit: "",
			},
			date: "",
			isLoading: true,
			treatmentModal: null,
			fetchingTreatment: false,
			data: {
				treatmentTimes: 0,
				sellingPrice: 0,
				secPaidAmount: 0,
				paidAmount: 0,
				inBetweenDuration: 7,
				leftOverAmount: 0,
				remark: "",
				printType: "normal",
				discountType: "",
				discount: 0,
				discountValue: 0,
				subTotal: 0,
				differenceAmount: 0,
				cashBack: 0,
				discountCheck: false,
				purchaseType: "surgery",
				deposit: 0,
				sendEmail: false,
				imageFile: null,
			},
			bodyParts: [
				{
					_id: 0,
					name: "Face",
					name: "Treatment",
				},
				{
					_id: 1,
					name: "Body",
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
			voucherData: {},
			selectedDoctor: null,
			selectedTreatmentList: {},
			selectedTreatment: {},
			selectedBankAccount: {},
			selectedCashAccount: {},
			selectedBankAccountType: {},
			selectedAdvanceRecord: {},
			paymentType: "Cash",
			selecting: false,
			selectedAmountDiscount: {},
			selectedPercentDiscount: {},
			selectedFocDiscount: {},
			discountTypes: {
				amountDiscounts: [],
				percentDiscounts: [],
				focItemsDiscounts: [],
			},
			// voucher modal data
			selectedItems: [],
			treatmentData: {},
			voucherId: "",
			voucherPaymentMethod: "",
			castVoucherDisplay: null,
			// end voucher modal data
			paymentStatus: "full",
			secPaymentMethod: "Cash",
			secBankType: {
				name: "Normal",
				value: "Normal",
			},
			selectedCashAccount: {},
			selectedBankAccount: {},
			secSelectedCashAccount: {},
			secSelectedBankAccount: {},
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
		paymentMethod(newType, oldType) {
			if (newType === "credit") {
				this.data.paidAmount = 0
				this.data.secPaidAmount = 0
				this.data.leftOverAmount = this.selectedTreatment?.sellingPrice //sellingPrice
			} else if (newType === "advance") {
				this.data.paidAmount = this.selectedTreatment?.sellingPrice
				this.data.secPaidAmount = 0
				this.data.leftOverAmount =
					this.selectedTreatment?.sellingPrice -
					(+this.data.paidAmount + +this.data.secPaidAmount)
			}
			this.calculatePaidAmount()
			this.calculateLeftOverAmount()
		},
		selectedTreatment(newTreatment, oldTreatment) {
			this.data.sellingPrice = newTreatment.sellingPrice
			this.data.treatmentTimes = newTreatment.treatmentTimes
			if (this.paymentMethod === "credit") {
				this.data.paidAmount = 0
				this.data.secPaidAmount = 0
				this.data.leftOverAmount = this.selectedTreatment?.sellingPrice
			} else if (this.paymentMethod === "advance") {
				this.data.paidAmount = newTreatment.sellingPrice
				this.data.secPaidAmount = 0
				this.data.leftOverAmount =
					this.selectedTreatment?.sellingPrice -
					(+this.data.paidAmount + +this.data.secPaidAmount)
				this.calculateDiscount()
				this.calculatePaidAmount()
			} else if (this.paymentMethod === "patientAdvance") {
				this.data.differenceAmount = 0
				this.selectedAdvanceRecord = {}
			} else {
				this.data.paidAmount = 0
				this.data.secPaidAmount = 0
				this.data.leftOverAmount = 0
			}
		},
	},
	methods: {
		dateForParams,
		changeSecPayAmount() {
			this.data.secPaidAmount = 0
			this.data.paidAmount = 0
			this.calculateLeftOverAmount()
		},
		async genereateImage() {
			// let castContent = document.querySelector('#castVoucherDisplay')
			this.$refs.castVoucherDisplay.classList.remove("d-none")
			const content = await document.querySelector("#castSaleVoucherCard")
			const canvas = await html2canvas(content, {
				width: content.scrollWidth + 20,
				height: content.scrollHeight + 20,
			})
			this.$refs.castVoucherDisplay.classList.add("d-none")
			const imageData = canvas.toDataURL("image/png")
			console.log(imageData)
			this.data.imageFile = imageData
		},
		async prepareVoucherData(data = treatmentResWithPaidAndDiscount) {
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
				secondAmount: data.treatmentVoucherResult[0].secondAmount,
				discount: 0,
				deposit:
					this.data.purchaseType === "surgery" ? this.data.deposit : undefined,
			}
			this.voucherPaymentMethod = data.data[0].paymentMethod
			this.voucherId = data ? data.treatmentVoucherResult[0].code : "N/A"
		},
		updateSelectedAmountDiscount(e) {
			this.selectedAmountDiscount = { ...e }
			this.data.discount = e.value
			this.calculateDiscount()
			this.calculatePaidAmount()
		},
		updateSelectedPercentDiscount(e) {
			this.selectedPercentDiscount = { ...e }
			this.data.discount = e.value
			this.calculateDiscount()
			this.calculatePaidAmount()
		},
		updateSelectedFocDiscount(e) {
			this.selectedFocDiscount = { ...e }
			// this.data.discount = e.value
			this.calculateDiscount()
			this.calculatePaidAmount()
		},
		updateSelectedAdvanceRecord(e) {
			this.selectedAdvanceRecord = { ...e }
			this.calculateDifferenceAmount()
			this.calculatePaidAmount()
			this.calculateLeftOverAmount()
			this.calculateCashBack()
		},
		updateSelectedBodyPart(e) {
			this.selectedBodyPart = { ...e }
			console.log(e.name)
			this.updateSelectMonitor({ type: "bodyParts", value: e.name })
		},
		updateSelectedTreatment(e) {
			this.selectedTreatment = { ...e }
		},
		updateSelectedDoctor(e) {
			this.selectedDoctor = { ...e }
		},
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
					c
				} catch (error) {
					console.log(error)
					this.newTreatments = []
				} finally {
					this.fetchingTreatment = false
				}
				this.selectedTreatment = {}
			}
		},
		// labels
		customAdvanceRecordLabel({ amount, relatedPatient, remark }) {
			let patient = relatedPatient?.name ?? ""
			if (!amount) return "Select Advance Record"
			return `${patient} - ${amount} - ${remark}`
		},
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
		// labels end
		// calc
		calculatePaidAmount() {
			if (this.paymentMethod === "patientAdvance") {
				if (Number(this.data.differenceAmount) <= 0) {
					this.data.paidAmount = 0
					this.data.secPaidAmount = 0
					this.data.leftOverAmount = 0
				} else {
					this.data.paidAmount = this.data.differenceAmount
					this.data.secPaidAmount = 0
				}
			} else if (this.paymentMethod === "advance") {
				if (Number(this.data.discount) > 0) {
					this.data.paidAmount = this.data.subTotal
					this.data.secPaidAmount = 0
				} else {
					this.data.paidAmount = this.data.sellingPrice
					this.data.secPaidAmount = 0
				}
			} else if (this.paymentMethod === "credit") {
				this.data.paidAmount = 0
				this.data.secPaidAmount = 0
			} else if (this.paymentMethod === "FOC") {
				this.data.paidAmount = 0
				this.data.secPaidAmount = 0
			}
		},
		calculateLeftOverAmount() {
			if (
				this.data.discountType &&
				this.data.discount &&
				this.paymentMethod === "advance"
			) {
				console.log("here")
				this.data.leftOverAmount =
					Number(this.data.subTotal) -
					(Number(this.data.paidAmount) + +this.data.secPaidAmount)
			} else if (
				this.paymentMethod === "patientAdvance" &&
				this.data.differenceAmount > 0
			) {
				this.data.leftOverAmount =
					Number(this.data.differenceAmount) -
					(Number(this.data.paidAmount) + +this.data.secPaidAmount)
			} else if (this.paymentMethod !== "patientAdvance") {
				this.data.leftOverAmount =
					Number(this.data.sellingPrice) -
					(Number(this.data.paidAmount) + +this.data.secPaidAmount)
			}
		},
		calculateDiscount() {
			if (this.data.discountType === "amount") {
				// this.data.discount = this.selectedAmountDiscount.value
				this.data.discountValue = Number(this.data.discount)
				this.data.subTotal =
					Number(this.data.sellingPrice) - Number(this.data.discount)
				console.log("sub total", this.data.subTotal)
			} else if (this.data.discountType === "percent") {
				// this.data.discount = this.selectedPercentDiscount.value
				this.data.discountValue =
					Number(this.data.sellingPrice) * (Number(this.data.discount) / 100)
				this.data.subTotal = Math.round(
					Number(this.data.sellingPrice) -
						Number(this.data.sellingPrice) * (Number(this.data.discount) / 100)
				)
			} else if (this.data.discountType === "foc") {
				// this.data.discount = this.selectedFocDiscount.value
				this.data.subTotal =
					Number(this.data.sellingPrice) - Number(this.data.discount)
			} else {
				this.data.discount = 0
				this.data.subTotal = this.data.sellingPrice
			}
			// if (this.data.discountCheck) {
			//   let discount = this.patient.relatedMember?.relatedDiscount.filter(each => each.type === 'Percentage')
			//   this.data.discount = discount[0].value
			//   this.data.subTotal = Math.round(Number(this.data.sellingPrice) - (Number(this.data.sellingPrice) * (Number(this.data.discount) / 100)))
			//   this.calculatePaidAmount()
			// }
			console.log(this.data.subTotal)
		},
		calculateDifferenceAmount() {
			this.data.differenceAmount =
				Number(this.data.sellingPrice) -
				Number(this.selectedAdvanceRecord.amount)
		},
		calculateCashBack() {
			if (this.paymentMethod === "patientAdvance") {
				if (this.data.differenceAmount >= 0) {
					this.data.cashBack = 0
				} else if (this.data.differenceAmount < 0) {
					this.data.cashBack = Math.abs(this.data.differenceAmount)
				}
			}
		},
		//end calc
		onDiscountTypeUpdate() {
			this.calculateDiscount()
			this.calculatePaidAmount()
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
		prepareForm() {
			let paymentMethod = false
			if (this.paymentMethod === "credit") {
				paymentMethod = "Credit"
			} else if (this.paymentMethod === "advance") {
				if (this.data.leftOverAmount > 0) {
					paymentMethod = "Partial"
				} else {
					paymentMethod = "Paid"
				}
			} else if (this.paymentMethod === "FOC") {
				paymentMethod = "FOC"
			}

			let purchaseType = false
			if (this.data.purchaseType === "surgery") purchaseType = "Surgery"
			if (this.data.purchaseType === "aesthetic") purchaseType = "Clinic"

			let cusObj = {}
			console.log(this.appointment)
			if (this.appointment) {
				cusObj.date = this.appointment.originalDate
				cusObj.appointmentId = this.appointment._id
				cusObj.phone = this.appointment.phone
			} else {
				cusObj.date = dateForParams()
				cusObj.appointmentId = null
				cusObj.phone = this.patient.phone
			}

			let data = {
				relatedPatient: this.patient._id,
				originalDate: cusObj.date,
				phone: cusObj.phone,
				VoucherCode: this.voucherData.code,
				relatedDoctor: this.selectedDoctor
					? this.selectedDoctor._id
					: this.appStore.defaultDoctor._id,
				relatedTreatment: this.selectedTreatment._id,
				// relatedTreatmentList: this.selectedTreatmentList._id,
				paymentMethod: paymentMethod,
				paidAmount: +this.data.paidAmount,
				totalAmount: +this.data.sellingPrice,
				createdAt: dateForParams(this.date),
				selectionStatus: "Ongoing", // ['Ongoing', 'Done']
				treatmentTimes: this.data.treatmentTimes,
				purchaseType: purchaseType,
				// bodyParts: this.selectedBodyPart.name, //['Face', 'Body', 'Body Injection'],
				inBetweenDuration: this.data.inBetweenDuration
					? Number(this.data.inBetweenDuration)
					: 0,
				balance: +this.data.leftOverAmount,
				tsType: "TS",
			}
			if (this.paymentStatus == "separate") {
				data.isDouble = true
				data.secondAmount = +this.data.secPaidAmount
				if (this.secPaymentMethod == "Cash") {
					data.secondAccount = this.secSelectedCashAccount._id
				} else {
					data.secondAccount = this.secSelectedBankAccount._id
				}
			} else {
				data.isDouble = false
				data.secondAmount = 0
			}
			if (this.data.purchaseType === "surgery") data.deposit = this.data.deposit

			if (cusObj.appointmentId) data.appointment = cusObj.appointmentId
			if (this.data.remark) data.remark = this.data.remark

			if (this.paymentMethod === "advance" && this.paymentType === "Cash") {
				data.relatedCash = this.selectedCashAccount._id
			} else if (
				this.paymentMethod === "advance" &&
				this.paymentType === "Bank"
			) {
				data.relatedBank = this.selectedBankAccount._id
				data.bankType = this.selectedBankAccountType.value
			}

			if (this.paymentMethod === "FOC") {
				data.paidAmount = 0
				data.totalAmount = 0
				data.leftOverAmount = 0
			}

			if (this.paymentMethod === "patientAdvance") {
				data.deferAmount = this.data.differenceAmount
				data.cashBack = this.data.cashBack
				if (Object.keys(this.selectedAdvanceRecord).length !== 0) {
					// data.cashBack =
					data.advanceFlag = true
					data.advanceID = this.selectedAdvanceRecord._id
				}
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

			console.log(data)
			var formData = new FormData(this.$refs.treatmentSelectForm)

			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					formData.append(key, data[key])
				}
			}

			return formData
		},
		closeModal() {
			const cancelButton = document.querySelector("#closebutton")
			cancelButton.click()
		},
		async storeTreatmentSelection() {
			let data = this.prepareForm()
			console.log(data)
			// return
			this.selecting = true

			// for (const pair of data.entries()) {
			//   console.log(`${pair[0]}, ${pair[1]}`);
			// }
			// this.selecting = false
			// return

			try {
				let res = await this.treatmentSelectionStore.addTreatmentSelection(data)
				this.$emit("updateTreatmentSelections", res.data[0])
				console.log(res)
				if (
					this.paymentMethod === "advance" ||
					this.paymentMethod === "FOC" ||
					this.paymentMethod === "patientAdvance"
				) {
					// this.$emit("prepareVoucher", res)
					this.prepareVoucherData(res)
					if (this.data.sendEmail) {
						await this.genereateImage()
						// this.voucherId = res.treatmentVoucherResult[0].code
						await this.sendEmail()
						// this.appStore.showSuccess('Send Email Successfully')
					}
					this.$emit("openTreatmentSelectPrintModal", res, this.data.printType)
				}
				this.appStore.showSuccess()
				if (res) {
					this.closeModal()
				}
			} catch (err) {
				this.appStore.showError()
				console.log(err)
			} finally {
				this.selecting = false
			}
		},
	},

	async mounted() {
		try {
			this.selectedCashAccount = this.cashAccounts[0]
			this.selectedBankAccount = this.bankAccounts[0]
			this.secSelectedCashAccount = this.cashAccounts[0]
			this.secSelectedBankAccount = this.bankAccounts[0]
			this.discounts.map(each => {
				if (each.type === "Amount")
					this.discountTypes.amountDiscounts.push(each)
				if (each.type === "Percentage")
					this.discountTypes.percentDiscounts.push(each)
				if (each.type === "FOCItem")
					this.discountTypes.focItemsDiscounts.push(each)
			})
			let voucherData =
				await this.medicineSaleStore.fetchVoucherCodeForTreatment()
			let res = await this.treatmentListStore.fetchTreatmentUnits()
			console.log(voucherData)
			this.voucherData = voucherData.data
			console.log(res)
			this.newTreatments = res.list
		} catch (error) {
			console.log(error)
		} finally {
		}

		// await this.updateAdvanceRecords()
	},
}
</script>

<style lang="scss" scoped></style>
