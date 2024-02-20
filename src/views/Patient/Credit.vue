<template>
	<div class="card p-3">
		<div class="mb-3 d-flex justify-content-center">
			<button
				class="btn me-3"
				:class="{ 'btn-primary': selectedTab == 'outstanding' }"
				@click="selectedTab = 'outstanding'">
				Outstanding
			</button>
			<button
				class="btn"
				:class="{ 'btn-primary': selectedTab == 'paid' }"
				@click="selectedTab = 'paid'">
				Paid
			</button>
		</div>
		<template v-if="isLoading">
			<loading />
		</template>
		<template v-else>
			<template v-if="selectedTab == 'outstanding'">
				<div class="table-responsive">
					<table class="table table-hover table-striped">
						<thead>
							<tr>
								<th>#</th>
								<th>Voucher code</th>
								<th>Date</th>
								<th>Patient ID</th>
								<th>Patient Name</th>
								<th>Total Amount</th>
								<th>Balance</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(list, i) in partialList" :key="i">
								<td>{{ i + 1 }}</td>
								<td>{{ list?.relatedTreatmentVoucher?.code || "not set" }}</td>
								<td>
									{{
										cusFormatDate(list?.relatedTreatmentVoucher?.createdAt) ||
										"not set"
									}}
								</td>
								<td>{{ list?.relatedPatient?.patientID || "not set" }}</td>
								<td>{{ list?.relatedPatient?.name || "not set" }}</td>
								<td>
									{{
										// item.amount
										// 	? item.amount
										// 	: item.msGrandTotal
										// 	? item.msGrandTotal
										// 	: item.totalAmount - item.totalDiscount
										list?.relatedTreatmentVoucher?.msTotalAmount ||
										list?.relatedTreatmentVoucher?.psGrandTotal ||
										list?.relatedTreatmentVoucher?.totalAmount ||
										list?.relatedTreatmentVoucher?.amount
									}}
								</td>
								<td>{{ list.balance }}</td>
								<!-- @click="
											debtRepay(list._id, list.relatedTreatmentVoucher._id)
										" -->
								<td>
									<button
										type="button"
										class="btn btn-primary"
										data-bs-toggle="modal"
										@click="openModal(list)"
										:data-bs-target="'#transfer_modal' + list._id">
										Repay
									</button>
									<!-- transfer Modal -->

									<div
										class="modal fade"
										:id="'transfer_modal' + list._id"
										tabindex="-1"
										aria-labelledby="transfer_modallabel"
										aria-hidden="true">
										<div class="modal-dialog" style="max-width: 900px">
											<div class="modal-content" style="width: 900px">
												<div class="modal-header">
													<h1 class="modal-title fs-5" id="transfer_modallabel">
														REPAY
													</h1>
													<button
														type="button"
														class="btn-close"
														data-bs-dismiss="modal"
														aria-label="Close"></button>
												</div>
												<div class="modal-body p-5">
													<div class="row my-3">
														<div class="col">
															<label for="patientid">Patient ID</label>
															<input
																type="text"
																name=""
																class="form-control"
																disabled
																:value="list.relatedPatient.patientID"
																id="patientid" />
														</div>
														<div class="col">
															<label for="patientName">Patient Name</label>
															<input
																type="text"
																name=""
																class="form-control"
																disabled
																:value="list.relatedPatient.name"
																id="patientName" />
														</div>
													</div>
													<div class="row my-3">
														<div class="col">
															<label for="voucherCode">Voucher Code</label>

															<input
																v-if="list?.relatedTreatmentVoucher?.code"
																type="text"
																name=""
																class="form-control"
																disabled
																:value="list.relatedTreatmentVoucher.code"
																id="voucherCode" />
															<input
																type="text"
																v-else
																value="no voucher code"
																class="form-control"
																disabled />
														</div>
														<div class="col">
															<label for="balance">Balance</label>
															<input
																type="number"
																name=""
																class="form-control"
																v-model="repayAmount"
																id="balance" />
														</div>
													</div>
													<div class="row my-3">
														<div class="col">
															<label for="date">Date</label>
															<input
																type="date"
																v-model="date"
																name=""
																class="form-control"
																id="date" />
														</div>
														<div class="col">
															<label for="remark">Remark</label>
															<input
																v-model="remark"
																type="text"
																name=""
																class="form-control"
																id="remark" />
														</div>
													</div>
													<div class="row my-3">
														<div class="col">
															<label for="type">Payment Type</label>
															<select
																name=""
																class="form-select"
																v-model="accType"
																id="type">
																<option value="bank">Bank</option>
																<option value="cash">Cash</option>
															</select>
														</div>
														<div class="col" v-if="accType == 'bank'">
															<label for="bank">Bank Accounts</label>
															<select
																name=""
																class="form-select"
																v-model="selectedBankAccount"
																id="bank">
																<template v-if="bankAccounts.length > 0">
																	<option
																		v-for="(acc, i) in bankAccounts"
																		:key="i"
																		:value="acc">
																		{{ acc.name }}
																	</option>
																</template>
															</select>
														</div>
														<div class="col" v-if="accType == 'cash'">
															<label for="cash">Cash Accounts</label>
															<select
																name=""
																class="form-select"
																v-model="selectedCashAccount"
																id="cash">
																<template v-if="cashAccounts.length > 0">
																	<option
																		v-for="(acc, i) in cashAccounts"
																		:key="i"
																		:value="acc">
																		{{ acc.name }}
																	</option>
																</template>
															</select>
														</div>
													</div>
												</div>

												<div class="modal-footer">
													<button
														type="button"
														id="close_modal"
														class="btn btn-secondary"
														data-bs-dismiss="modal">
														Close
													</button>
													<button
														type="button"
														@click="debtRepay(list)"
														data-bs-dismiss="modal"
														class="btn btn-primary">
														Done
													</button>
												</div>
											</div>
										</div>
									</div>

									<!-- transfer Modal -->
								</td>
							</tr>
							<tr v-if="partialList.length == 0">
								<td colspan="8" class="text-center">No List Exist</td>
							</tr>
						</tbody>
					</table>
				</div>
			</template>
			<template v-if="selectedTab == 'paid'">
				<div class="table-responsive">
					<table class="table table-hover table-striped">
						<thead>
							<tr>
								<th>#</th>
								<th>Voucher code</th>
								<th>Date</th>
								<th>Patient ID</th>
								<th>Patient Name</th>
								<th>Total Amount</th>
								<th>Balance</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(list, i) in paidList" :key="i">
								<td>{{ i + 1 }}</td>
								<td>{{ list?.relatedTreatmentVoucher?.code || "not set" }}</td>
								<td>
									{{
										cusFormatDate(list?.relatedTreatmentVoucher?.createdAt) ||
										"not set"
									}}
								</td>
								<td>{{ list?.relatedPatient?.patientID || "not set" }}</td>
								<td>{{ list?.relatedPatient?.name || "not set" }}</td>
								<td>
									{{
										// item.amount
										// 	? item.amount
										// 	: item.msGrandTotal
										// 	? item.msGrandTotal
										// 	: item.totalAmount - item.totalDiscount
										list.relatedTreatmentVoucher.msTotalAmount ||
										list.relatedTreatmentVoucher.psGrandTotal ||
										list.relatedTreatmentVoucher.totalAmount ||
										list.relatedTreatmentVoucher.amount
									}}
								</td>
								<td>{{ list.balance }}</td>
								<td>
									<button
										class="btn btn-sm btn-danger"
										@click="
											debtDelete(list._id, list.relatedTreatmentVoucher._id)
										">
										delete
									</button>
								</td>
							</tr>
							<tr v-if="paidList.length == 0">
								<td colspan="8" class="text-center">No List Exist</td>
							</tr>
						</tbody>
					</table>
				</div>
			</template>
		</template>
	</div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import { usePatientStore } from "@/stores/patient"
import { cusFormatDate, dateForParams } from "../../helpers"
import { useAppStore } from "../../stores/app"

import { useAccountingListStore } from "../../stores/accountingList"
const props = defineProps(["id"])
const selectedTab = ref("outstanding")
const partialList = ref([])
const paidList = ref([])

const patientStore = usePatientStore()
const isLoading = ref(false)
const date = ref()
const remark = ref("")
const appStore = useAppStore()
const accountingListStore = useAccountingListStore()
const accType = ref("bank")
const selectedBankAccount = ref({})
const selectedCashAccount = ref({})
const repayAmount = ref(0)
const cashAccounts = ref([])
const bankAccounts = ref([])
const openModal = list => {
	repayAmount.value = list.balance
}
const debtRepay = async list => {
	let formData = {
		id: list._id,
		remark: remark.value,
		relatedPatient: list.relatedPatient._id,
		relatedTreatmentVoucher: list.relatedTreatmentVoucher._id,
		paidAmount: repayAmount.value,
		relatedBranch: list.relatedTreatmentVoucher.relatedBranch,
		date: dateForParams(date.value),
		remark: remark.value,
		// isPaid: true,
		tsType: list.relatedTreatmentVoucher.tsType,
	}
	// if (list.relatedTreatmentVoucher.relatedCash) {
	// 	formData.relatedCash = list.relatedTreatmentVoucher.relatedCash
	// } else {
	// 	formData.relatedBank = list.relatedTreatmentVoucher.relatedBank
	// }

	if (accType.value == "bank") {
		formData.relatedBank = selectedBankAccount.value._id
	} else {
		formData.relatedCash = selectedCashAccount.value._id
	}
	if (repayAmount.value > list.balance) {
		return appStore.showError({
			message: "The repayment amount is greater than the balance.!",
		})
	}
	try {
		let res = await patientStore.debtRepay(formData)
		console.log("hello", res)
		getAndFillDebtList()
		console.log(dateForParams(date.value), remark.value)
	} catch (error) {
		console.log(error)
	} finally {
		appStore.showSuccess()
	}
}
const debtDelete = async (id, _id) => {
	let res = await patientStore.debtRepay({
		id,
		isDeleted: true,
		relatedTreatmentVoucher: _id,
	})
	appStore.showSuccess()
	console.log("hello", res)
	getAndFillDebtList()
}
const getAndFillDebtList = async () => {
	paidList.value = []
	partialList.value = []
	try {
		isLoading.value = true
		let res = await patientStore.fetchDebt()
		res.data.map(e => {
			if (e.isPaid) {
				paidList.value.push(e)
			} else {
				partialList.value.push(e)
			}
		})
		console.log(res.data)
		console.log("paid List", paidList.value)
		console.log("partial List", partialList.value)
	} catch (error) {
		console.log(error)
	} finally {
		isLoading.value = false
	}
}
const getAccountingList = async () => {
	let res = await accountingListStore.fetchAccountingLists()
	console.log(res)
	bankAccounts.value = res.list.filter(el => {
		let checker = false
		appStore.accountingList.bank.map(bankSet => {
			if (bankSet.code === el.code && bankSet.name === el.subHeader) {
				checker = true
			}
		})

		return checker
	})
	cashAccounts.value = res.list.filter(el => {
		if (el._id === appStore.account._id) return el
	})
	selectedBankAccount.value = bankAccounts.value[0]
	selectedCashAccount.value = cashAccounts.value[0]
}
onMounted(async () => {
	console.log("credit asd", props.id)
	try {
		getAccountingList()
		getAndFillDebtList()
	} catch (err) {
		console.error(err)
	}
})
</script>
