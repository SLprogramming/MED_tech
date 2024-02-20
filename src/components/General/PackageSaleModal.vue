<template>
	<div
		class="modal fade"
		id="packageSaleModal"
		tabindex="-1"
		aria-labelledby="packageSaleModalLabel"
		aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="packageSaleModalLabel">
						Package Sale Modal
					</h1>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<form ref="packageSelectForm">
						<div class="mb-3">
							<label for="name" class="form-label">Package</label>
							<VueMultiselect
								:model-value="selectedPackage"
								@update:model-value="updateSelectedPackage"
								:options="packages"
								:searchable="true"
								:close-on-select="false"
								:allow-empty="false"
								:option-height="31"
								label="name"
								track-by="_id" />
						</div>
						<div class="mb-3">
							<label for="packageSellingPrice" class="form-label"
								>Selling Price</label
							>
							<input
								@keyup="onDiscountTypeUpdate"
								v-model="data.sellingPrice"
								id="packageSellingPrice"
								type="text"
								class="form-control" />
						</div>
						<label class="form-label">Payment Method</label>
						<div class="mb-3 border rounded p-3">
							<div class="d-flex gap-3">
								<div class="form-check">
									<input
										class="form-check-input"
										v-model="paymentMethod"
										value="FOC"
										type="radio"
										id="packageCredit" />
									<label class="form-check-label" for="packageCredit">
										FOC
									</label>
								</div>
								<div class="form-check">
									<input
										class="form-check-input"
										v-model="paymentMethod"
										value="Paid"
										type="radio"
										id="packageAdvance" />
									<label class="form-check-label" for="packageAdvance">
										Paid
									</label>
								</div>
								<!-- <div class="form-check">
                  <input class="form-check-input" v-model="paymentMethod" value="patientAdvance" type="radio"
                    id="packagePatientAdvance" />
                  <label class="form-check-label" for="packagePatientAdvance"> Advance </label>
                </div> -->
							</div>
						</div>
						<label for="" class="form-label">Date</label>
						<input
							type="date"
							name=""
							class="form-control mb-3"
							v-model="date"
							id="" />

						<!-- <div v-if="paymentMethod === 'patientAdvance'">
              <label class="form-label">Advance Record</label>
              <div class="mb-3">
                <VueMultiselect :model-value="selectedAdvanceRecord" @update:model-value="updateSelectedAdvanceRecord"
                  :options="advanceRecords" :searchable="true" :custom-label="customAdvanceRecordLabel"
                  :close-on-select="true" :allow-empty="false" :option-height="31" label="name" track-by="_id" />
              </div>
            </div> -->

						<template
							v-if="
								paymentMethod === 'Paid' || paymentMethod === 'patientAdvance'
							">
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
									<label class="fw-bold fs-5 d-inline" for="full">Full</label>
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
									<option v-for="(acc, index) in bankAccounts" :value="acc">
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
									<option v-for="(acc, index) in bankAccountTypes" :value="acc">
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
									<option v-for="(acc, index) in cashAccounts" :value="acc">
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
										<option v-for="(acc, index) in bankAccounts" :value="acc">
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
										<option v-for="(acc, index) in cashAccounts" :value="acc">
											{{ acc.name }}
										</option>
									</select>
								</div>
							</template>
						</template>

						<template v-if="paymentMethod == 'Paid'">
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
									<div class="form-check">
										<input
											@change="onDiscountTypeUpdate"
											class="form-check-input"
											v-model="data.discountType"
											value="foc"
											type="radio"
											id="treatmentDiscountFocType" />
										<label
											class="form-check-label"
											for="treatmentDiscountFocType">
											Foc
										</label>
									</div>
								</div>
							</div>
							<!-- <div class="mb-3" v-if="data.discountType === 'amount'">
                <label for="name" class="form-label">Amount Discount</label>
                <VueMultiselect :model-value="selectedAmountDiscount" @update:model-value="updateSelectedAmountDiscount"
                  :options="discountTypes.amountDiscounts" :searchable="true" :close-on-select="true" :allow-empty="false"
                  :option-height="31" label="name" track-by="_id" />
              </div>
              <div class="mb-3" v-if="data.discountType === 'percent'">
                <label for="name" class="form-label">Percent Discount</label>
                <VueMultiselect :model-value="selectedPercentDiscount" @update:model-value="updateSelectedPercentDiscount"
                  :options="discountTypes.percentDiscounts" :searchable="true" :close-on-select="true"
                  :allow-empty="false" :option-height="31" label="name" track-by="_id" />
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
						</template>

						<!-- <template v-if="paymentMethod === 'advance'">
              <div v-if="patient.relatedMember" class="form-check mb-3">
                <input @change="onDiscountCheck" class="form-check-input" type="checkbox" v-model="data.discountCheck"
                  id="packageSaleDiscountCheck">
                <label class="form-check-label" for="packageSaleDiscountCheck">
                  Discount Check
                </label>
              </div>
            </template> -->

						<!-- <template v-if="data.discountCheck">
              <div class="mb-3">
                <label for="packageSaleDiscount" class="form-label">Discount</label>
                <input v-model="data.discount" id="packageSaleDiscount" type="number" class="form-control" disabled />
              </div>
              <div class="mb-3">
                <label for="packageSaleSubTotal" class="form-label">Sub Total</label>
                <input v-model="data.subTotal" id="packageSaleSubTotal" type="number" class="form-control" disabled />
              </div>
            </template> -->

						<template v-if="paymentMethod === 'Paid'">
							<div class="mb-3">
								<label for="paidAmount" class="form-label">Paid Amount</label>
								<input
									@change="calculateLeftOverAmount"
									@keyup="calculateLeftOverAmount"
									v-model="data.paidAmount"
									id="paidAmount"
									type="text"
									class="form-control"
									:disabled="paymentMethod === 'FOC'" />
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
						<template v-if="paymentMethod === 'Paid'">
							<div class="mb-3">
								<label for="paymentImagePackage" class="form-label"
									>Payment Image</label
								>
								<input
									type="file"
									class="form-control"
									name="payment"
									id="paymentImagePackage" />
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

						<template v-if="paymentMethod === 'Paid'">
							<label class="form-label">Print Modal Type</label>
							<div class="mb-3 border rounded p-3">
								<div class="d-flex gap-3">
									<div class="form-check">
										<input
											class="form-check-input"
											v-model="data.printType"
											value="normal"
											type="radio"
											id="packageSaleNormalPrintType"
											checked />
										<label
											class="form-check-label"
											for="packageSaleNormalPrintType">
											Normal
										</label>
									</div>
									<div class="form-check">
										<input
											class="form-check-input"
											v-model="data.printType"
											value="slip"
											type="radio"
											id="packageSaleSlipPrintType" />
										<label
											class="form-check-label"
											for="packageSaleSlipPrintType">
											Slip
										</label>
									</div>
								</div>
							</div>

							<div
								class="mb-3"
								v-if="
									paymentMethod === 'Paid' ||
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
						</template>
					</form>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						id="packageSaleCancelButton"
						class="btn btn-secondary"
						data-bs-dismiss="modal">
						Close
					</button>
					<!-- <button type="button" :disabled="submitting" @click="submit" class="btn btn-primary">Done</button> -->
					<LoadingButton name="Done" @click="submit" :loading="submitting" />
				</div>
			</div>
		</div>
	</div>
	<div
		ref="castVoucherDisplay"
		class="card p-3 border-0 rounded shadow-sm d-none">
		<!-- html2canvas is not working without actual content(CastSaleVoucherModal) -->
		<CastPackageSaleVoucherModal
			:invoiceId="packageVoucherData.invoiceId"
			:packages="packageVoucherData.packages"
			:packageData="packageVoucherData.packageData"
			:paymentMethod="packageVoucherData.paymentMethod"
			:customer="patient" />
	</div>
</template>

<script>
import VueMultiselect from "vue-multiselect"
import { useAppStore } from "../../stores/app"
import { usePackageSelectionStore } from "../../stores/packageSelection"
import { useTreatmentSelectionStore } from "../../stores/treatmentSelection"
import {
	cusFormatDate,
	dateForParams,
	openDialog,
	showConfirmWithInput,
} from "../../helpers"
import LoadingButton from "../Common/LoadingButton.vue"
import CastPackageSaleVoucherModal from "./CastPackageSaleVoucherModal.vue"
import html2canvas from "html2canvas"

export default {
	setup() {
		const treatmentSelectionStore = useTreatmentSelectionStore()
		const packageSelectionStore = usePackageSelectionStore()
		const appStore = useAppStore()
		return {
			appStore,
			packageSelectionStore,
			treatmentSelectionStore,
		}
	},
	props: [
		"cashAccounts",
		"bankAccounts",
		"packages",
		"patient",
		"advanceRecords",
		"discounts",
	],
	components: {
		VueMultiselect,
		LoadingButton,
		CastPackageSaleVoucherModal,
	},
	data() {
		return {
			data: {
				sellingPrice: 0,
				remark: "",
				leftOverAmount: 0,
				discountCheck: false,
				discount: 0,
				subTotal: 0,
				discountType: "",
				discountValue: 0,
				discount: 0,
				subTotal: 0,
				differenceAmount: 0,
				cashBack: 0,
				sendEmail: false,
				imageFile: null,
				secPaidAmount: 0,
				paidAmount: 0,
			},
			submitting: false,
			selectedPackage: {},
			paymentMethod: "FOC",
			paymentType: "Bank",
			watchPayment: false,
			selectedBankAccountType: {
				name: "Normal",
				value: "Normal",
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
			selectedAmountDiscount: {},
			selectedPercentDiscount: {},
			selectedFocDiscount: {},
			discountTypes: {
				amountDiscounts: [],
				percentDiscounts: [],
				focItemsDiscounts: [],
			},
			// voucher
			voucherId: null,
			packageVoucherData: {
				invoiceId: "",
				packages: [],
				packageData: {},
				paymentMethod: "",
			},
			date: "",
			// end voucher
		}
	},
	watch: {
		paymentMethod(newType, oldType) {
			this.calculatePaidAmount()
			this.calculateLeftOverAmount()
		},
	},
	methods: {
		changeSecPayAmount() {
			this.data.secPaidAmount = 0
			this.data.paidAmount = 0
			this.calculateLeftOverAmount()
		},
		preparePackageVoucherData(data) {
			// packageVoucherData.invoiceId = data.data[0].paymentMethod
			this.packageVoucherData.invoiceId = data.treatmentVoucherResult[0].code
			this.packageVoucherData.paymentMethod = data.data[0].paymentMethod
			let newObj = {
				name: data.data[0].relatedPackage.name,
				price: data.data[0].totalAmount,
				qty: 1,
				discountValue: data.treatmentVoucherResult[0].discountAmount ?? 0,
			}
			newObj.subTotal = +newObj.price - +newObj.discountValue
			this.packageVoucherData.packages = [newObj]
			this.packageVoucherData.packageData = {
				totalAmount: newObj.subTotal,
				paidAmount: data.data[0].paidAmount,
			}
		},
		async genereateImage() {
			// let castContent = document.querySelector('#castVoucherDisplay')
			this.$refs.castVoucherDisplay.classList.remove("d-none")
			const content = await document.querySelector(
				"#castPackageSaleVoucherCard"
			)
			// console.log(content)
			const canvas = await html2canvas(content, {
				width: content.scrollWidth + 20,
				height: content.scrollHeight + 20,
			})
			this.$refs.castVoucherDisplay.classList.add("d-none")
			const imageData = canvas.toDataURL("image/png")
			// console.log(imageData)
			this.data.imageFile = imageData
		},
		onDiscountTypeUpdate() {
			this.calculateDiscount()
			this.calculatePaidAmount()
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
		onDiscountCheck() {
			if (this.data.discountCheck) {
				this.checkCodeAndArrageModal("discountCheck")
			}
		},
		checkCodeAndArrageModal(type, oldType = "Paid") {
			this.closeModal()
			showConfirmWithInput().then(res => {
				console.log(res)
				if (res.isConfirmed) {
					if (res.value !== "admin") {
						if (type === "paymentMethod") {
							this.watchPayment = false
							this.paymentMethod = oldType
						}

						if (type === "discountCheck") {
							this.data.discountCheck = false
						}
					}

					if (type === "discountCheck") {
						this.calculateDiscount()
					}

					openDialog("packageSaleModal")
				} else {
					if (type === "paymentMethod") {
						this.watchPayment = false
						this.paymentMethod = oldType
					}

					if (type === "discountCheck") this.data.discountCheck = false
					openDialog("packageSaleModal")
				}
			})
		},
		// update
		updateSelectedPackage(e) {
			console.log(e)
			this.selectedPackage = { ...e }

			this.calculateSellingPrice()
			this.calculateDiscount()
			this.calculatePaidAmount()
			this.calculateLeftOverAmount()
		},
		// end update
		// calculate
		calculateDiscount() {
			if (this.data.discountType === "amount") {
				this.data.discountValue = Number(this.data.discount)
				this.data.subTotal =
					Number(this.data.sellingPrice) - Number(this.data.discount)
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
		},
		calculateSellingPrice() {
			if (Object.keys(this.selectedPackage).length > 0) {
				console.log(this.selectedPackage)
				this.data.sellingPrice = this.selectedPackage.totalPrice
			}
		},
		calculatePaidAmount() {
			if (this.paymentMethod === "patientAdvance") {
				if (Number(this.data.differenceAmount) <= 0) {
					this.data.paidAmount = 0
					this.data.leftOverAmount = 0
					this.data.secPaidAmount = 0
				} else {
					this.data.paidAmount = this.data.differenceAmount
					this.data.secPaidAmount =
						+this.data.differenceAmount - +this.data.paidAmount
				}
			} else if (this.paymentMethod === "Paid") {
				if (Number(this.data.discount) > 0) {
					this.data.paidAmount = this.data.subTotal
					this.data.secPaidAmount = +this.data.subTotal - +this.data.paidAmount
				} else {
					this.data.paidAmount = this.data.sellingPrice
					this.data.secPaidAmount =
						+this.data.sellingPrice - +this.data.paidAmount
				}
			} else if (this.paymentMethod === "FOC") {
				this.data.paidAmount = 0
				this.data.secPaidAmount = 0
			}
		},
		calculateLeftOverAmount() {
			if (
				this.data.discountType &&
				this.data.discount &&
				this.paymentMethod === "Paid"
			) {
				console.log("here")
				this.data.leftOverAmount =
					Number(this.data.subTotal) -
					(Number(this.data.paidAmount) + Number(this.data.secPaidAmount))
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
			} else if (this.paymentMethod === "Paid") {
				this.data.leftOverAmount =
					+this.data.sellingPrice -
					(+this.data.paidAmount + +this.data.secPaidAmount)
			}
		},
		// end calculate
		prepareForm() {
			let paymentMethod = false
			if (this.paymentMethod === "FOC") {
				paymentMethod = "FOC"
			} else if (this.paymentMethod === "Paid") {
				if (this.data.leftOverAmount > 0) {
					paymentMethod = "Partial"
				} else {
					paymentMethod = "Paid"
				}
			} else if (this.paymentMethod === "patientAdvance") {
				paymentMethod = "Advance"
			}

			let data = {
				relatedPatient: this.patient._id,
				relatedPackage: this.selectedPackage._id,
				paymentMethod: paymentMethod,
				createdAt: dateForParams(this.date),
				paidAmount: +this.data.paidAmount ?? 0,
				totalAmount: this.data.sellingPrice,
				tsType: "PS",
				selectionStatus: "Ongoing", // ['Ongoing', 'Done']
				balance: this.data.leftOverAmount,
				relatedTreatment: JSON.stringify(
					this.selectedPackage.relatedTreatments.map(each => each._id)
				),
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
			// if (cusObj.appointmentId) data.appointment = cusObj.appointmentId
			if (this.data.remark) data.remark = this.data.remark
			if (this.data.purchaseType) data.purchaseType = this.data.purchaseType

			if (this.paymentMethod === "Paid" && this.paymentType === "Cash") {
				data.relatedCash = this.selectedCashAccount._id
			} else if (this.paymentMethod === "Paid" && this.paymentType === "Bank") {
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

			// add related discount
			// if (this.data.discountType) {
			//   if (this.data.discountType === 'amount') data.relatedDiscount = this.selectedAmountDiscount._id
			//   if (this.data.discountType === 'percent') data.relatedDiscount = this.selectedPercentDiscount._id
			//   if (this.data.discountType === 'foc') data.relatedDiscount = this.selectedFocDiscount._id
			// }

			console.log(this.data.discountType)
			console.log(this.data.discountValue)
			if (
				this.data.discountType &&
				this.paymentMethod === "Paid" &&
				this.data.discount
			) {
				if (this.data.discountType === "amount") {
					data.discountType = "Amount"
				}
				if (this.data.discountType === "percent") {
					data.discountType = "Percent"
				}
				data.discountAmount = this.data.discountValue
			}

			// if (this.data.discountCheck) {
			//   data.relatedDiscount = this.patient.relatedMember.relatedDiscount[0]._id
			// }

			console.log(data)
			var formData = new FormData(this.$refs.packageSelectForm)

			for (var key in data) {
				if (data.hasOwnProperty(key)) {
					formData.append(key, data[key])
				}
			}
			console.log(formData.get("payment"))

			return formData
		},
		closeModal() {
			const cancelButton = document.querySelector("#packageSaleCancelButton")
			cancelButton.click()
		},
		async sendEmail() {
			let payload = this.prepareEmailForm()
			try {
				let res = await this.treatmentSelectionStore.sendEmail(payload)
				console.log("sending email")
				console.log(res)
			} catch (error) {
				console.log(error)
				throw error
			}
		},
		prepareEmailForm() {
			let formData = {
				recipent: this.patient.email,
				voucherType: "Package Sale",
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
		async submit() {
			let formData = this.prepareForm()
			// return
			this.submitting = true
			try {
				let res = await this.packageSelectionStore.addPackageSelection(formData)
				console.log(res)
				this.$emit("updatePackageSelection", res.data[0])
				if (this.paymentMethod == "Paid") {
					if (this.data.sendEmail) {
						this.preparePackageVoucherData(res)
						this.voucherId = res.treatmentVoucherResult[0].code
						await this.genereateImage()
						await this.sendEmail()
						// this.appStore.showSuccess('Send Email Successfully')
					}
					this.$emit("openPackageSaleVoucherModal", res, this.data.printType)
				}
				this.appStore.showSuccess()
				this.closeModal()
			} catch (err) {
				console.log(err)
				this.appStore.showError()
				this.closeModal()
			} finally {
				this.submitting = false
			}
		},
	},
	mounted() {
		this.selectedCashAccount = this.cashAccounts[0]
		this.selectedBankAccount = this.bankAccounts[0]
		this.secSelectedCashAccount = this.cashAccounts[0]
		this.secSelectedBankAccount = this.bankAccounts[0]

		this.discounts.map(each => {
			if (each.type === "Amount") this.discountTypes.amountDiscounts.push(each)
			if (each.type === "Percentage")
				this.discountTypes.percentDiscounts.push(each)
			if (each.type === "FOCItem")
				this.discountTypes.focItemsDiscounts.push(each)
		})

		this.genereateImage()
	},
}
</script>

<style lang="scss" scoped></style>
