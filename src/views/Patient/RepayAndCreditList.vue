<template>
	<div class="card p-3">
		<div class="mb-3 d-flex justify-content-center">
			<button
				class="btn me-3"
				:class="{ 'btn-primary': selectedTab == 'outstanding' }"
				@click="
					() => {
						selectedTab = 'outstanding'
						clearFilter()
					}
				">
				Outstanding
			</button>
			<button
				class="btn me-3"
				:class="{ 'btn-primary': selectedTab == 'paid' }"
				@click="
					() => {
						selectedTab = 'paid'
						clearFilter()
					}
				">
				Paid
			</button>
			<button
				class="btn"
				:class="{ 'btn-primary': selectedTab == 'repay' }"
				@click="
					() => {
						selectedTab = 'repay'
						clearFilter()
					}
				">
				Repay
			</button>
		</div>
		<div class="card-body my-2 py-3">
			<div class="row">
				<div class="col d-flex">
					<div class="me-2">
						<button class="btn btn-primary" @click="repayFilter()">
							filter
						</button>
					</div>
					<div class="me-2">
						<button class="btn btn-primary" @click="clearFilter()">
							clear
						</button>
					</div>
					<div class="me-2">
						<button class="btn btn-primary" @click="exportFunction()">
							export
						</button>
					</div>
				</div>
				<div class="col d-flex justify-content-end">
					<div class="mx-2">
						<label for="" class="form-label">Start Date</label>
						<input
							type="date"
							name=""
							v-model="repayFilterData.startDate"
							class="form-control"
							id="" />
					</div>
					<div class="mx-2">
						<label for="" class="form-label">End Date</label>
						<input
							type="date"
							name=""
							v-model="repayFilterData.endDate"
							class="form-control"
							id="" />
					</div>
					<div class="mx-2">
						<label for="" class="form-label">Patient Name</label>
						<VueMultiselect
							style="width: 200px"
							:model-value="selectedPatient"
							@update:model-value="updateSelectedPatient"
							:options="allPatients"
							:searchable="true"
							:close-on-select="true"
							:allow-empty="false"
							:option-height="31"
							label="name"
							placeholder="Select Patient"
							track-by="_id" />
					</div>
					<div class="mx-2">
						<label for="" class="form-label">Voucher No</label>
						<VueMultiselect
							style="width: 200px"
							:model-value="selectedVoucher"
							@update:model-value="updateSelectedVoucher"
							:options="allVouchers"
							:searchable="true"
							:close-on-select="true"
							:allow-empty="false"
							:option-height="31"
							label="code"
							placeholder="Select Voucher No"
							track-by="_id" />
					</div>
					<!-- <div class="mx-2">
						<label for="" class="form-label">Bank Name</label>
						<select name="" id="" class="form-control">
							<option value="">a</option>
						</select>
					</div>
					<div class="mx-2">
						<label for="" class="form-label">Cash Name</label>
						<select name="" id="" class="form-control">
							<option value="">a</option>
						</select>
					</div> -->
				</div>
			</div>
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
																:value="list?.relatedPatient?.patientID"
																id="patientid" />
														</div>
														<div class="col">
															<label for="patientName">Patient Name</label>
															<input
																type="text"
																name=""
																class="form-control"
																disabled
																:value="list?.relatedPatient?.name"
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
										list.relatedTreatmentVoucher?.msTotalAmount ||
										list.relatedTreatmentVoucher?.psGrandTotal ||
										list.relatedTreatmentVoucher?.totalAmount ||
										list.relatedTreatmentVoucher?.amount ||
										0
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
			<template v-if="selectedTab == 'repay'">
				<table class="table table-hover table-striped table-borderless">
					<thead>
						<tr>
							<th style="min-width: 60px">#</th>
							<th style="min-width: 100px">Date</th>
							<th>Patient Name</th>
							<th>Voucher No</th>
							<th>Repay Amount</th>
							<th>Bank Account</th>
							<th>Cash Account</th>
							<th>Remark</th>
						</tr>
					</thead>
					<tbody>
						<template v-if="repayList.length > 0">
							<tr v-for="(list, i) in repayList" :key="i">
								<td>{{ i + 1 }}</td>
								<td>{{ cusFormatDate(list.date) }}</td>
								<td>
									{{
										list.relatedTreatmentVoucher?.relatedPatient?.name ??
										"not set"
									}}
								</td>
								<td>
									{{ list?.relatedTreatmentVoucher?.code || "not set" }}
								</td>
								<td>{{ list?.balance }}</td>
								<td>{{ list?.relatedBank?.name || "-" }}</td>
								<td>{{ list?.relatedCash?.name || "-" }}</td>
								<td>{{ list?.remark || "-" }}</td>
							</tr>
						</template>
						<tr v-else>
							<td colspan="8" class="text-center">No Repay List</td>
						</tr>
					</tbody>
				</table>
				<div class="row">
					<div class="col">
						<div v-if="repayTotalData?.bank">
							<h2>Bank List</h2>
							<ul style="list-style: none">
								<li
									v-for="(key, value) in repayTotalData.bank[0]"
									:key="value"
									class="fs-3">
									{{ value }} : {{ key }}
								</li>
							</ul>
						</div>
					</div>
					<div class="col">
						<div v-if="repayTotalData?.cash">
							<h2>Cash List</h2>
							<ul style="list-style: none">
								<li class="fs-3">
									{{ repayTotalData.cashName }}: {{ repayTotalData.cash }}
								</li>
							</ul>
						</div>
					</div>
				</div>
			</template>
		</template>
	</div>
</template>
<script setup>
import { ref, onMounted } from "vue"
import { usePatientStore } from "@/stores/patient"
import { cusFormatDate, dateForParams, exportData } from "../../helpers"
import { useAppStore } from "../../stores/app"
import VueMultiselect from "vue-multiselect"
import { useAccountingListStore } from "../../stores/accountingList"
import { useTreatmentVoucherStore } from "../../stores/treatmentVoucher"
const props = defineProps(["id"])
const selectedTab = ref("outstanding")

const partialList = ref([])
const paidList = ref([])
const repayList = ref([])
const patientStore = usePatientStore()
const isLoading = ref(false)
const date = ref()
const remark = ref("")
const appStore = useAppStore()
const treatmentVoucherStore = useTreatmentVoucherStore()
const accountingListStore = useAccountingListStore()
const accType = ref("bank")
const selectedBankAccount = ref({})
const selectedCashAccount = ref({})
const repayAmount = ref(0)
const cashAccounts = ref([])
const bankAccounts = ref([])
const allPatients = ref([])
const selectedPatient = ref({})
const allVouchers = ref([])
const selectedVoucher = ref({})
const repayTotalData = ref({})
const updateSelectedVoucher = e => {
	selectedVoucher.value = { ...e }
}
const repayFilterData = ref({
	startDate: "",
	endDate: "",
})
const openModal = list => {
	repayAmount.value = list.balance
}
const updateSelectedPatient = e => {
	selectedPatient.value = { ...e }
}
const exportFunction = () => {
	let paidArr = []
	let outstandingArr = []
	let repayArr = []

	if (partialList.value.length > 0) {
		partialList.value.map(e => {
			let obj = {
				Date: "",
				"VR-No": "",
				PatientName: "",
				TotalAmount: 0,
				TotalRepayAmount: 0,
				Balance: 0,
				Remark: "-",
			}
			obj.Date = cusFormatDate(e.createdAt)
			obj["VR-No"] = e.relatedTreatmentVoucher?.code ?? "not set"
			obj.PatientName = e.relatedPatient?.name || "-"
			obj.TotalAmount =
				e.relatedTreatmentVoucher?.msTotalAmount ||
				e.relatedTreatmentVoucher?.psGrandTotal ||
				e.relatedTreatmentVoucher?.totalAmount ||
				e.relatedTreatmentVoucher?.amount ||
				"-"
			e.repay.map(j => {
				obj.TotalRepayAmount += j.repayId.balance
			})
			obj.Balance = e.balance
			outstandingArr.push(obj)
		})
	}

	if (paidList.value.length > 0) {
		paidList.value.map(e => {
			let obj = {
				Date: "",
				"VR-No": "",
				PatientName: "",
				TotalAmount: 0,
				TotalRepayAmount: 0,
				Balance: 0,
				Remark: "-",
			}
			obj.Date = cusFormatDate(e.createdAt)
			obj["VR-No"] = e.relatedTreatmentVoucher?.code ?? "not set"
			obj.PatientName = e.relatedPatient.name
			obj.TotalAmount =
				e.relatedTreatmentVoucher?.msTotalAmount ||
				e.relatedTreatmentVoucher?.psGrandTotal ||
				e.relatedTreatmentVoucher?.totalAmount ||
				e.relatedTreatmentVoucher?.amount
			e.repay.map(j => {
				obj.TotalRepayAmount += j.repayId.balance
			})
			// obj.Balance = obj.TotalAmount - obj.TotalRepayAmount
			paidArr.push(obj)
		})
	}

	if (repayList.value.length > 0) {
		repayList.value.map(e => {
			let obj = {
				Date: "",
				RepayAmount: 0,
				"VR-No": "",
				PatientName: "",
				PaymentType: "",
				BankName: "",
				CashName: "",
				Remark: "",
			}
			obj.Date = cusFormatDate(e.date)
			obj.RepayAmount = e.balance
			obj["VR-No"] = e.relatedTreatmentVoucher.code ?? "not set"
			obj.PatientName = e.relatedPatient.name ?? "not set"
			if (e.relatedBank) {
				obj.PaymentType = "Bank"
				obj.CashName = "-"
				obj.BankName = e.relatedBank.name
			}
			if (e.relatedCash) {
				obj.PaymentType = "Cash"
				obj.CashName = e.relatedCash.name
				obj.BankName = "-"
			}
			obj.Remark = e.remark || "-"
			repayArr.push(obj)
		})
	}

	exportData(paidArr, "Paid.xlsx")
	exportData(repayArr, "Repay.xlsx")
	exportData(outstandingArr, "Outstanding.xlsx")
}
const repayFilter = () => {
	let obj = {}
	if (
		repayFilterData.value.startDate !== "" &&
		repayFilterData.value.endDate !== ""
	) {
		obj.fromDate = dateForParams(repayFilterData.value.startDate)
		obj.toDate = dateForParams(repayFilterData.value.endDate)
	}
	if (repayFilterData.value.relatedPatient) {
		obj.relatedPatient = repayFilterData.value.relatedPatient
	}
	if (repayFilterData.value.relatedTreatmentVoucher) {
		obj.relatedTreatmentVoucher = repayFilterData.value.relatedTreatmentVoucher
	}
	if (selectedPatient.value._id) {
		obj.relatedPatient = selectedPatient.value._id
	}
	if (selectedVoucher.value._id) {
		obj.relatedTreatmentVoucher = selectedVoucher.value._id
	}
	fetchRepay(obj)
	getAndFillDebtList(obj)
}
const clearFilter = () => {
	selectedPatient.value = {}
	selectedVoucher.value = {}
	repayFilterData.value.startDate = ""
	repayFilterData.value.endDate = ""
	repayFilter()
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

const fetchRepay = async filterData => {
	// repayFilter
	let payload = {}
	if (filterData) {
		payload = filterData
	}
	try {
		let res = await patientStore.repayFilter(payload)
		let balanceRes = await patientStore.repayFilterForBankCashList(payload)
		console.log(res)
		console.log(balanceRes)
		repayTotalData.value = balanceRes.data
		repayList.value = res.list.reverse()
	} catch (err) {
		console.error(err)
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
const getAndFillDebtList = async payload => {
	paidList.value = []
	partialList.value = []
	try {
		isLoading.value = true
		let res = await patientStore.fetchAllDebt(payload)
		console.log(res)
		res.data.map(e => {
			if (e.isPaid) {
				paidList.value.push(e)
			} else {
				partialList.value.push(e)
			}
		})
		paidList.value = paidList.value.reverse()
		partialList.value = partialList.value.reverse()
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
const getVouchers = async () => {
	try {
		let voucherRes = await treatmentVoucherStore.treatmentVoucherFilter()
		console.log(voucherRes)
		allVouchers.value = [
			...voucherRes.data.BankList,
			...voucherRes.data.CashList,
		]
	} catch (err) {
		console.error(err)
	}
}
const getPatients = async () => {
	try {
		let patientRes = await patientStore.fetchPatients()
		console.log(patientRes.list)
		allPatients.value = patientRes.list
	} catch (err) {
		console.error(err)
	}
}
onMounted(async () => {
	console.log("credit asd", props.id)
	try {
		getAccountingList()
		getAndFillDebtList()
		getVouchers()
		getPatients()
		fetchRepay()
	} catch (err) {
		console.error(err)
	}
})
</script>
