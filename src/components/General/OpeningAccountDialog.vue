<template>
	<div
		class="modal fade"
		id="openingAccountDialog"
		tabindex="-1"
		aria-labelledby="openingAccountDialogLabel"
		aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1
						class="modal-title fs-5 text-capitalize"
						id="openingAccountDialogLabel">
						Opening Account dialog
					</h1>
					<p class="mb-0 px-2">({{ formatDate(payload.date) }})</p>

					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<template v-if="loading">
						<Loading />
					</template>
					<template v-if="!loading">
						<form @submit.prevent>
							<div class="mb-3">
								<label for="openingAccountDate" class="form-label"
									>Opening Date</label
								>
								<input
									type="date"
									class="form-control"
									v-model="payload.date"
									@change="fetchBalanceWithBackDate()"
									id="openingAccountDate" />
							</div>
							<!-- <div class="mb-3">
								<label for="openingAccountAmount" class="form-label"
									>Opening Status</label
								>
								<select
									name=""
									v-model="balanceStatus"
									class="form-control"
									@change="fetchBalanceWithBackDate()"
									id="">
									<option value="Opening">Opening</option>
									<option value="Closing">Closing</option>
								</select>
							</div> -->
							<div class="mb-3">
								<label for="openingAccountAmount" class="form-label"
									>Opening Amount</label
								>
								<input
									type="number"
									class="form-control"
									v-model="payload.amount"
									id="openingAccountAmount" />
							</div>
							<div class="mb-3">
								<label for="openingAccountRemark" class="form-label"
									>Remark</label
								>
								<input
									type="text"
									class="form-control"
									v-model="payload.remark"
									id="openingAccountRemark" />
							</div>
						</form>
					</template>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						ref="closeModalBtn"
						class="btn btn-secondary"
						@click="resetData()"
						data-bs-dismiss="modal">
						Close
					</button>
					<!-- <button type="button" class="btn btn-primary" @click="submit">Save changes</button> -->
					<SubmitButton name="Save" @click="submit" :loading="submitting" />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue"
import { useAccountBalanceStore } from "../../stores/accountBalance"
import { useAppStore } from "../../stores/app"
import Loading from "../Common/Loading.vue"
import {
	dateForParams,
	formatDate,
	getTimestamp,
	requiredString,
} from "../../helpers"
import SubmitButton from "../Common/SubmitButton.vue"
const relatedAccounting = ref("")
const accountBalanceStore = useAccountBalanceStore()
const appStore = useAppStore()
const closeModalBtn = ref(null)
const loading = ref(false)
const update = ref(false)
const balanceStatus = ref("Opening")
const payload = ref({
	amount: 0,
	remark: "",
	date: "",
})
const submitting = ref(false)
const resetData = () => {
	payload.value.amount = 0
	payload.value.remark = ""
}
const fetchData = async () => {
	loading.value = true
	console.log(appStore.account)
	try {
		let res = await accountBalanceStore.fetchClosingAcountBalance()
		console.log(res.data)
		if (res.data.length > 0) {
			update.value = true
			console.log(res)
			relatedAccounting.value = res.data[0]._id
		} else {
			update.value = false
		}

		appStore.openingAmount = res.data[0].amount
		payload.value.amount = res.data[0].amount
	} catch (err) {
		console.log(err)
	} finally {
		loading.value = false
	}
}

watch(
	() => appStore.fetchAccountData,
	async (newAmt, oldAmt) => {
		// payload.value.amount = appStore.openingAmount
		if (appStore.fetchAccountData) {
			await fetchData()
			appStore.fetchAccountData = false
		}
	},
	{ immediate: true }
)

const submit = async () => {
	let formData = prepareForm()
	console.log(formData)
	// return
	submitting.value = true
	try {
		if (update.value) {
			let res = await accountBalanceStore.updateAccountBalance(formData)
			console.log(res)
		} else {
			let res = await accountBalanceStore.createAccountBalance(formData)
			console.log(res)
		}

		appStore.showSuccess()
		closeModalBtn.value.click()
	} catch (err) {
		appStore.showError()
		console.log(err)
	} finally {
		submitting.value = false
		resetData()
	}
}
// { type, acc, exact }
const fetchBalanceWithBackDate = async () => {
	let data = {
		type: balanceStatus.value,
		acc: appStore.account._id,

		exact: dateForParams(payload.value.date),
	}
	console.log(data)
	let res = await accountBalanceStore.fetchOpeningAccountBalanceWithBackDate(
		data
	)
	if (res.data.length > 0) {
		update.value = true
		console.log(res)

		relatedAccounting.value = res.data[0]._id
	} else {
		update.value = false
		console.log("new")
	}

	console.log(res.data)
	appStore.openingAmount = res?.data[0]?.amount || 0
	payload.value.amount = res?.data[0]?.amount || 0
}
const prepareForm = () => {
	let data = {
		relatedAccounting: appStore.account._id,
		type: "Opening",
		amount: payload.value.amount,
		date: dateForParams(payload.value.date),
	}
	if (update.value) {
		data.id = relatedAccounting.value
	}

	if (requiredString(payload.value.remark)) data.remark = payload.value.remark

	return data
}

onMounted(async () => {
	payload.value.date = new Date()
	console.log(appStore.account._id)
	if (appStore.user) {
		await fetchBalanceWithBackDate()
	}
})
</script>

<style lang="scss" scoped></style>
