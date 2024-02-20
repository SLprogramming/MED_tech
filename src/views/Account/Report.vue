<template>
	<div>
		<div class="card p-3">
			<div class="row justify-content-center">
				<div class="col-8">
					<form action="">
						<div id="reportClosingAccountPrint" style="padding: 10px">
							<div class="text-center mb-3">
								<h3>
									Account Report for {{ appStore.user.data.user.branchName }}
								</h3>
								<p class="date" style="font-size: 18px; font-weight: bold">
									( {{ formatDate(payload.date) }} )
								</p>
							</div>
							<div class="d-flex align-items-center mb-3">
								<label style="width: 200px" for="date" class="form-label"
									>Opening Date</label
								>
								<input
									v-model="payload.date"
									type="date"
									@change="getReportData()"
									class="form-control"
									id="date" />
							</div>
							<div class="d-flex align-items-center mb-3">
								<label style="width: 200px" for="openingCash" class="form-label"
									>Opening Cash</label
								>
								<input
									v-model="payload.openingCash"
									type="hidden"
									class="form-control"
									id="openingCash"
									disabled />
								<div class="form-control" style="background: #e9ecef">
									{{ payload.openingCash }}
								</div>
							</div>
							<div class="d-flex align-items-center mb-3">
								<label
									style="width: 200px"
									for="medicineSalePrice"
									class="form-label"
									>Medicine Sale</label
								>
								<input
									@change="calculateTotal"
									v-model="payload.medicineSaleTotal"
									type="hidden"
									class="form-control"
									id="medicineSalePrice"
									disabled />
								<div class="form-control" style="background: #e9ecef">
									{{ payload.medicineSaleTotal }}
								</div>
							</div>
							<div class="d-flex align-items-center mb-3">
								<label
									style="width: 200px"
									for="treatmentSaleTotal"
									class="form-label"
									>Treatment Sale</label
								>
								<input
									@change="calculateTotal"
									v-model="payload.treatmentSaleTotal"
									type="hidden"
									class="form-control"
									id="treatmentSaleTotal"
									disabled />
								<div class="form-control" style="background: #e9ecef">
									{{ payload.treatmentSaleTotal }}
								</div>
							</div>
							<div class="d-flex align-items-center mb-3">
								<label style="width: 200px" for="otherIncome" class="form-label"
									>Other Income</label
								>
								<input
									@change="calculateTotal"
									v-model="payload.otherIncome"
									type="hidden"
									class="form-control"
									id="otherIncome"
									disabled />
								<div class="form-control" style="background: #e9ecef">
									{{ payload.otherIncome }}
								</div>
							</div>
							<div class="d-flex align-items-center mb-3">
								<label style="width: 200px" for="total" class="form-label"
									>Total</label
								>
								<input
									v-model="payload.total"
									type="hidden"
									class="form-control"
									id="total"
									disabled />
								<div class="form-control" style="background: #e9ecef">
									{{ payload.total }}
								</div>
							</div>
							<div class="d-flex align-items-center mb-3">
								<label
									style="width: 200px"
									for="otherExpense"
									class="form-label"
									>Other Expense</label
								>
								<input
									v-model="payload.otherExpense"
									type="hidden"
									class="form-control"
									id="otherExpense"
									disabled />
								<div class="form-control" style="background: #e9ecef">
									{{ payload.otherExpense }}
								</div>
							</div>
							<div class="d-flex align-items-center mb-3">
								<label style="width: 200px" for="closingCash" class="form-label"
									>Closing Cash</label
								>
								<input
									v-model="payload.closingCash"
									type="hidden"
									class="form-control"
									id="closingCash"
									disabled />
								<div class="form-control" style="background: #e9ecef">
									{{ payload.closingCash }}
								</div>
							</div>

							<div
								ref="signBox"
								class="d-flex d-none justify-content-between"
								style="margin-top: 20px; margin-bottom: 10px">
								<div>
									<label style="font-size: 20px; margin-bottom: 6px" for=""
										>Checked By</label
									>
									<div
										style="
											width: 200px;
											height: 50px;
											border-bottom: 1px solid black;
										"></div>
								</div>
								<div>
									<label style="font-size: 20px; margin-bottom: 6px" for=""
										>Approved By</label
									>
									<div
										style="
											width: 200px;
											height: 50px;
											border-bottom: 1px solid black;
										"></div>
								</div>
							</div>
						</div>

						<div class="d-flex gap-3 justify-content-center">
							<SubmitButton
								type="button"
								@click="submit"
								class="btn btn-primary"
								:loading="submitting"
								name="Save">
							</SubmitButton>
							<button type="button" class="btn btn-success" @click="print">
								Print
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import SubmitButton from "../../components/Common/SubmitButton.vue"
import {
	formatDate,
	openPrint,
	requiredString,
	dateForParams,
} from "../../helpers"
import { useAccountBalanceStore } from "../../stores/accountBalance"
import { useAppStore } from "../../stores/app"
import { onMounted, ref } from "vue"

const appStore = useAppStore()
const accountBalanceStore = useAccountBalanceStore()
const payload = ref({
	date: "",
	medicineSaleTotal: 0,
	treatmentSaleTotal: 0,
	otherIncome: 0,
	total: 0,
	closingCash: 0,
	otherExpense: 0,
	openingCash: 0,
})

const signBox = ref(null)

const loading = ref(true)
const submitting = ref(false)

// const prepareForm = () => {
// 	let data = {
// 		relatedAccounting: "646747f259a9bc811d98072d",
// 		type: "Closing",
// 		amount: payload.value.closingCash,
// 		date: dateForParams(payload.value.date),
// 	}

// 	if (requiredString(payload.value.remark)) data.remark = payload.value.remark

// 	return data
// }
const prepareForm = () => {
	let date = new Date(payload.value.date)
	let day = 60 * 60 * 24 * 1000
	let newDate = new Date(date.getTime() + day).toISOString()
	console.log(newDate)
	let data = {
		relatedAccounting: appStore.account._id,
		type: "Opening",
		amount: payload.value.closingCash,
		date: newDate,
	}

	if (requiredString(payload.value.remark)) data.remark = payload.value.remark

	return data
}
const prepareFormClose = () => {
	let date = new Date(payload.value.date)

	let newDate = new Date(date.getTime()).toISOString()
	console.log(newDate)
	let data = {
		relatedAccounting: appStore.account._id,
		type: "Closing",
		amount: payload.value.closingCash,
		date: newDate,
	}

	if (requiredString(payload.value.remark)) data.remark = payload.value.remark

	return data
}
const submit = async () => {
	let formData = prepareForm()
	let formClose = prepareFormClose()
	console.log(formData)
	console.log(JSON.stringify(formData))
	submitting.value = true
	try {
		let res = await accountBalanceStore.createAccountBalance(formData)
		let closeRes = await accountBalanceStore.createAccountBalance(formClose)
		console.log(res, closeRes)
		appStore.showSuccess()
	} catch (err) {
		console.log(err)
		appStore.showError()
	} finally {
		submitting.value = false
	}
}

const calculateTotal = () => {
	payload.value.total =
		payload.value.openingCash +
		payload.value.medicineSaleTotal +
		payload.value.treatmentSaleTotal +
		payload.value.otherIncome
	calculateClosingCash()
}

const calculateClosingCash = () => {
	payload.value.closingCash = payload.value.total - payload.value.otherExpense
}

const print = () => {
	signBox.value.classList.toggle("d-none")
	openPrint("reportClosingAccountPrint")
	signBox.value.classList.toggle("d-none")
}

const getReportData = async () => {
	try {
		let res = await accountBalanceStore.fetchDataForReport({
			date: dateForParams(payload.value.date),
		})
		payload.value.openingCash = res.openingTotal
		payload.value.medicineSaleTotal = res.medicineTotal
		payload.value.treatmentSaleTotal = res.TVTotal
		payload.value.otherIncome = res.incomeTotal || 0
		payload.value.total = res.total || 0
		payload.value.otherExpense = res.expenseTotal
		payload.value.closingCash = res.closingCsh || 0

		console.log(res)
	} catch (error) {
		console.log(error)
		throw error
	}
}

onMounted(async () => {
	payload.value.date = new Date()
	try {
		await getReportData()
		// calculateTotal()
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
})
</script>

<style lang="scss" scoped></style>
