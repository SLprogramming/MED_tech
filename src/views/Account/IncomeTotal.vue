<template>
	<template v-if="loading">
		<Loading />
	</template>
	<template v-if="!loading">
		<div>
			<div class="card p-3">
				<h3>Monthly</h3>
				<ul class="list-group list-group-flush">
					<template v-if="monthlyList.length > 0">
						<li
							v-for="(item, i) in monthlyList"
							:key="i"
							class="list-group-item">
							{{ item.name }} ( {{ item.amount }} MMK )
						</li>
					</template>
				</ul>
			</div>
			<div class="card p-3 mt-3">
				<div class="row justify-content-start">
					<div class="row">
						<h3>Daily</h3>
						<div class="col-4 gap-2 d-flex">
							<div>
								<label for="">Start Date</label>
								<input
									type="date"
									class="form-control"
									v-model="startDateForDaily" />
							</div>
							<div>
								<label for="">End Date</label>
								<input
									type="date"
									class="form-control"
									v-model="endDateForDaily" />
							</div>
						</div>
						<div class="col">
							<button @click="getTotalIncome" class="btn btn-primary">
								filter
							</button>
							<button @click="clearFilter" class="btn btn-primary ms-3">
								clear
							</button>
						</div>
					</div>
					<template v-if="incomeList.length > 0">
						<div v-for="(list, i) in incomeList" :key="i" class="col-4 mt-4">
							<div class="card">
								<div
									id="reportClosingAccountPrint"
									class="card-body"
									style="padding: 10px">
									<div class="text-center mb-3">
										<h3>Daily income</h3>
										<p class="date" style="font-size: 18px; font-weight: bold">
											(
											{{
												list.date
													? formatDate(list.date)
													: formatDate(list.createdAt)
											}}
											)
										</p>
									</div>
									<div class="d-flex align-items-center mb-3">
										<label
											style="width: 200px"
											for="bankTotal"
											class="form-label"
											>Bank Total</label
										>
										<!-- <input
											@change="calculateTotal"
											v-model="payload.bankTotal"
											type="hidden"
											class="form-control"
											id="bankTotal"
											disabled /> -->
										<div class="form-control" style="background: #e9ecef">
											{{ list.bankTotal }}
										</div>
									</div>
									<div class="d-flex align-items-center mb-3">
										<label
											style="width: 200px"
											for="cashTotal"
											class="form-label"
											>Cash Total</label
										>
										<!-- <input
											@change="calculateTotal"
											v-model="payload.cashTotal"
											type="hidden"
											class="form-control"
											id="cashTotal"
											disabled /> -->
										<div class="form-control" style="background: #e9ecef">
											{{ list.cashTotal }}
										</div>
									</div>
									<div class="d-flex align-items-center mb-3">
										<label style="width: 200px" for="total" class="form-label"
											>Total</label
										>
										<!-- <input
											v-model="payload.total"
											type="hidden"
											class="form-control"
											id="total"
											disabled /> -->
										<div class="form-control" style="background: #e9ecef">
											{{ list.bankTotal + list.cashTotal }}
										</div>
									</div>

									<div class="row my-5">
										<div
											class="col-6 d-flex flex-column align-items-center"
											v-if="list?.bankNames.length > 0">
											<div>
												<h4 class="fw-bold">Bank List</h4>
												<div
													v-for="(each, index) in list.bankNames"
													:key="index"
													class="d-flex gap-3">
													<div class="fw-bold">{{ each.bankname }} :</div>
													<div>{{ each.amount }}</div>
												</div>
											</div>
										</div>
										<div
											class="col-6 d-flex flex-column align-items-center"
											v-if="list?.cashNames.length > 0">
											<div>
												<h4 class="fw-bold">Cash List</h4>
												<div
													v-for="(each, index) in list.cashNames"
													:key="index"
													class="d-flex gap-3">
													<div class="fw-bold">{{ each.cashname }} :</div>
													<div>{{ each.amount }}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</template>
					<template v-else>
						<p class="text-center fs-3 my-3">no daily income</p></template
					>
					<!-- within ({{ intervalDay }}) day{{
								intervalDay > 1 ? "s" : ""
							}} -->
				</div>
			</div>
		</div>
	</template>
</template>

<script setup>
import { formatDate, openPrint, dateForParams } from "../../helpers"
import { onMounted, ref } from "vue"
import { useIncomeStore } from "../../stores/income"
import { useTreatmentVoucherStore } from "../../stores/treatmentVoucher"
import { start } from "@popperjs/core"
const selectedMonth = ref(new Date())
const incomeStore = useIncomeStore()
const payload = ref({
	date: "",
	bankTotal: 0,
	cashTotal: 0,
	total: 0,
})
const monthlyLoading = ref(false)
const incomeList = ref([])
const cashTotal = ref(0)
const bankTotal = ref(0)
const bankNames = ref([])
const cashNames = ref([])
const loading = ref(true)
const intervalDay = ref(0)
const startDateForDaily = ref()
const endDateForDaily = ref()
const monthlyList = ref([])
const Months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
]
const calculateTotal = () => {
	payload.value.total =
		Number(payload.value.bankTotal) + Number(payload.value.cashTotal)
}
const clearFilter = () => {
	startDateForDaily.value = ""
	endDateForDaily.value = ""
}
const print = () => {
	// signBox.value.classList.toggle('d-none')
	openPrint("reportClosingAccountPrint")
	// signBox.value.classList.toggle('d-none')
}
const getMonthlyIncome = async () => {
	try {
		monthlyLoading.value = true
		let payload = {}
		// console.log(
		// 	dateForParams(
		// 		new Date(selectedMonth.value).setMonth(
		// 			new Date(selectedMonth.value).getMonth() - 1
		// 		)
		// 	)
		// )
		for (let i = 0; i < 3; i++) {
			payload.date = dateForParams(
				new Date(selectedMonth.value).setMonth(
					new Date(selectedMonth.value).getMonth() - i
				)
			)
			let month = new Date(
				new Date(selectedMonth.value).setMonth(
					new Date(selectedMonth.value).getMonth() - i
				)
			).getMonth()

			let monthlyRes = await incomeStore.dailyIncomePerMonth(payload)
			console.log(monthlyRes.data[0], month)
			let object = monthlyRes.data[0]
			let obj = { name: "", amount: 0 }
			if (object) {
				for (const property in object) {
					obj.name = Months[month]
					obj.amount += object[property]
				}
			} else {
				obj.name = Months[month]
				obj.amount = 0
			}
			monthlyList.value.push(obj)
		}
		console.log(monthlyList.value)
	} catch (err) {
		console.error(err)
	} finally {
		monthlyLoading.value = false
	}
}
const getTotalIncome = async () => {
	try {
		let payload = {}

		// payload.month = "Nov"
		// payload.income = true
		if (startDateForDaily.value && endDateForDaily.value) {
			payload.startDate = dateForParams(startDateForDaily.value)
			payload.endDate = dateForParams(endDateForDaily.value)
		} else {
			let startDate = new Date()

			// Add a day
			startDate.setDate(startDate.getDate() - 3)
			console.log(startDate)
			payload.startDate = dateForParams(startDate)
			payload.endDate = dateForParams(new Date())
		}
		console.log(
			Math.round(
				(new Date(payload.endDate).getTime() -
					new Date(payload.startDate).getTime()) /
					86400000
			)
		)
		intervalDay.value = Math.round(
			(new Date(payload.endDate).getTime() -
				new Date(payload.startDate).getTime()) /
				86400000
		)
		let res = await incomeStore.monthlyIncome(payload)

		console.log(res)
		incomeList.value = res.list
		// let months = ["Jan","Feb","March","April","May","June","July","Aug","Sept","Oct","Nov","Dec"];
		incomeList.value.map(e => {
			let cashTotal = e.cashAmount || 0
			let bankTotal = 0
			if (e.firstBank?.length > 0) {
				e.firstBank.map(i => {
					bankTotal += i.amount
				})
			}
			if (e.secondBank?.length > 0) {
				e.secondBank.map(i => {
					bankTotal += i.amount
				})
			}
			if (e.secondCash?.length > 0) {
				e.secondCash.map(i => {
					cashTotal += i.amount
				})
			}
			e.bankTotal = bankTotal
			e.cashTotal = cashTotal
			e.bankNames = []
			let bankMergedArray = [
				...(e.firstBank || []),
				...(e.secondBank || []),
			].reduce((result, current) => {
				let existingItem = result.find(
					item => item.bankname === current.bankname
				)

				if (existingItem) {
					existingItem.amount += current.amount
				} else {
					result.push({ bankname: current.bankname, amount: current.amount })
				}

				return result
			}, [])
			e.bankNames = [...bankMergedArray]
			e.cashNames = [{ cashname: e.cashName, amount: e.cashTotal }]
		})
		console.log(incomeList.value)

		// let res1 = await incomeStore.incomeTotal()
		// console.log(res1)
		//   payload.value.bankTotal = res1.data.BankTotal
		//   payload.value.cashTotal = res1.data.CashTotal
		//   bankNames.value = res1.data.BankNames
		//   cashNames.value = res1.data.CashNames
	} catch (err) {
		console.log(err)
		throw err
	}
}

onMounted(async () => {
	payload.value.date = new Date()
	try {
		await getTotalIncome()
		calculateTotal()
		getMonthlyIncome()
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
})
</script>

<style lang="scss" scoped>
.list-group-item:nth-child(even) {
	background-color: rgba(145, 145, 145, 0.196);
}
</style>
