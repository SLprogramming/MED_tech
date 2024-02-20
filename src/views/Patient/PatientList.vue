<template>
	<template v-if="isLoading">
		<Loading />
	</template>
	<template v-else>
		<div>
			<div class="card p-3">
				<div class="d-flex align-items-center justify-content-between mb-3">
					<Heading class="mb-0" :payload="{ title: 'Patient List' }" />
					<router-link
						:to="{ name: 'patient.register' }"
						custom
						v-slot="{ navigate }">
						<button
							class="btn btn-primary"
							@click="navigate"
							@keypress.enter="navigate"
							role="link">
							Add Patient
						</button>
					</router-link>
				</div>
				<div class="d-flex gap-3 filter-bar border p-3 mb-3 rounded flex-wrap">
					<div class="d-flex align-items-center me-3">
						<label class="form-label me-3 mb-0">Start date</label>
						<input
							v-model="filter.startDate"
							type="date"
							class="form-control"
							style="width: 200px" />
					</div>
					<div class="d-flex align-items-center me-3">
						<label class="form-label me-3 mb-0">End date</label>
						<input
							v-model="filter.endDate"
							type="date"
							class="form-control"
							style="width: 200px" />
					</div>
					<button class="btn btn-primary me-3" @click="getPatients">
						Filter
					</button>
					<div>
						<ThrottleSearch
							style="min-width: 200px"
							@search="searchPatients"
							placeholder="Phone or Id or Name" />
					</div>
					<button class="btn btn-primary" @click="reloadData">Reload</button>
					<button class="btn btn-primary" @click="exportList">Export</button>
					<div class="form-check">
						<input
							@change="filterPatient"
							class="form-check-input"
							type="checkbox"
							v-model="filter.topTenCheck"
							id="topTenCheck" />
						<label class="form-check-label" for="topTenCheck"> Top Ten </label>
					</div>
					<!-- <div style="min-width: 300px">
            <select @change="filterByMemberType" class="form-select" v-model="filter.memberStatus" aria-label="Member Status">
              <option value="all">Member Status</option>
              <option value="VIP">VIP</option>
              <option value="2">Two</option>
              <option value="3">Three</option>
            </select>
          </div> -->
					<div class="d-flex align-items-center gap-3">
						<input
							type="file"
							ref="excelImportFile"
							class="form-control"
							style="width: 300px"
							placeholder="excel file" />
						<button class="btn btn-primary" @click="excelImport">
							Excel Import
						</button>
					</div>
					<!-- <div class="d-flex justify-content-between align-items-center">
            <label class="form-label me-3 mb-0">Page</label>
            <input type="number" class="form-control" placeholder="page" v-model="filter.skip" style="width: 100px">
          </div> -->
					<div class="d-flex justify-content-between align-items-center">
						<label class="form-label me-3 mb-0">Per Page</label>
						<input
							type="number"
							class="form-control"
							placeholder="per page"
							v-model="filter.limit"
							style="width: 150px" />
					</div>
					<div class="d-flex justify-content-between align-items-center">
						<button class="btn btn-primary" @click="filterPatientByPage">
							Filter By Page
						</button>
					</div>
				</div>
				<div class="table-responsive mb-3" style="max-height: 700px">
					<table class="table table-hover table-borderless table-striped">
						<thead>
							<tr>
								<th class="text-nowrap" scope="col">#</th>
								<th class="text-nowrap" scope="col" style="min-width: 150px">
									Id
								</th>
								<th class="text-nowrap" scope="col">Patient Name</th>
								<th class="text-nowrap" scope="col">Age</th>
								<th class="text-nowrap" scope="col">Marital Status</th>
								<th class="text-nowrap" scope="col">Phone</th>
								<!-- <th class="text-nowrap" scope="col">Date of Birth</th> -->
								<th class="text-nowrap" scope="col">Gender</th>
								<th class="text-nowrap" scope="col">Address(Township)</th>
								<th class="text-nowrap" scope="col">Treatment Package Qty</th>
								<th class="text-nowrap" scope="col">Total Amount</th>
								<th class="text-nowrap" scope="col">Total Paid Amount</th>
								<th class="text-nowrap" scope="col">Total Balance</th>
								<th class="text-nowrap" scope="col">Total Appointments</th>
								<th class="text-nowrap" scope="col">Finished Appointments</th>
								<th class="text-nowrap" scope="col">Unfinished Appointments</th>
								<th class="text-nowrap" scope="col">Total Treatment</th>
								<th class="text-nowrap" scope="col">Finished Treatment</th>
								<th class="text-nowrap" scope="col">Unfinished Treatment</th>
								<th class="text-nowrap" scope="col">Created At</th>
								<th
									v-if="appStore.user.data.user.role !== 'doctor'"
									class="text-nowrap"
									scope="col"
									style="min-width: 150px">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								@click="goToDetail(patient._id)"
								class=""
								v-for="(patient, index) in filteredPatientList">
								<td>
									{{ filter.skip * filter.limit + (index + 1) - filter.limit }}
								</td>
								<td>{{ patient.patientID }}</td>
								<td>{{ patient.name }}</td>
								<td>{{ patient.age }}</td>
								<td>{{ patient.maritalStatus ?? "Not Set" }}</td>
								<td>{{ patient.phone }}</td>
								<!-- <td v-if="patient.dateOfBirth">
                  {{ cusFormatDate(patient.dateOfBirth) }}
                </td> -->
								<!-- <td v-if="!patient.dateOfBirth">No date set</td> -->
								<td>{{ patient.gender || "not set" }}</td>
								<td>{{ patient.address || "not set" }}</td>
								<td>
									{{
										patient.treatmentPackageQty
											? patient.treatmentPackageQty
											: 0
									}}
								</td>
								<td>
									{{
										formatNumber(patient.totalAmount ? patient.totalAmount : 0)
									}}
								</td>
								<td>
									{{ formatNumber(patient.totalAmount - patient.debtBalance) }}
								</td>
								<td>
									{{
										formatNumber(patient.debtBalance ? patient.debtBalance : 0)
									}}
								</td>
								<td>
									{{
										patient.totalAppointments ? patient.totalAppointments : 0
									}}
								</td>
								<td>
									{{
										patient.finishedAppointments
											? patient.finishedAppointments
											: 0
									}}
								</td>
								<td>
									{{
										patient.unfinishedAppointments
											? patient.unfinishedAppointments
											: 0
									}}
								</td>
								<td>
									{{ patient.totalTS ? patient.totalTS : 0 }}
								</td>
								<td>
									{{ patient.finishedTS ? patient.finishedTS : 0 }}
								</td>
								<td>
									{{ patient.unfinishedTS ? patient.unfinishedTS : 0 }}
								</td>
								<td>{{ cusFormatDate(patient.createdAt) }}</td>
								<td v-if="appStore.user.data.user.role !== 'doctor'">
									<router-link
										:to="{ name: 'patient.edit', params: { id: patient._id } }"
										custom
										v-slot="{ navigate }">
										<button
											class="me-3 btn btn-warning"
											@click.stop="navigate"
											@keypress.enter="navigate"
											role="link">
											<i class="bi bi-pencil-square"></i>
										</button>
									</router-link>
									<router-link
										:to="{
											name: 'patient.credit',
											params: { id: patient._id },
										}"
										custom
										v-slot="{ navigate }">
										<button
											class="me-3 btn btn-warning"
											@click.stop="navigate"
											@keypress.enter="navigate"
											role="link">
											<i class="bi bi-credit-card"></i>
										</button>
									</router-link>
									<button
										@click.stop="deletePatient(patient._id)"
										class="btn btn-danger">
										<i class="bi bi-trash"></i>
									</button>
								</td>
							</tr>
							<tr v-if="filteredPatientList && filteredPatientList.length <= 0">
								<td colspan="15" class="text-center">No record exist!</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="d-flex justify-content-end">
					<div style="max-width: 500px; overflow: auto">
						<nav aria-label="Page navigation example">
							<ul class="pagination">
								<li class="page-item">
									<span
										class="page-link"
										:class="{ 'disabled bg-gray': !filter.previousPage }"
										@click="onPaginate(filter.skip - 1)"
										>Previous</span
									>
								</li>
								<li
									v-for="page in filter.pageArray"
									class="page-item"
									:class="{ active: page === filter.skip }">
									<span class="page-link" @click="onPaginate(page)">{{
										page
									}}</span>
								</li>
								<li class="page-item">
									<span
										class="page-link"
										:class="{ 'disabled bg-gray': !filter.nextPage }"
										@click="onPaginate(filter.skip + 1)"
										>Next</span
									>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		</div>
	</template>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { exportData } from "../../helpers/index"
import { usePatientStore } from "../../stores/patient.js"
import { cusFormatDate, formatNumber } from "@/helpers/index.js"
import Loading from "../../components/Common/Loading.vue"
import { useAppStore } from "../../stores/app"
import ThrottleSearch from "../../components/Common/ThrottleSearch.vue"
import { useRouter } from "vue-router"

const patients = ref([])
const filteredPatientList = ref([])
const isLoading = ref(true)
const patientStore = usePatientStore()
const appStore = useAppStore()
const router = useRouter()
const filter = ref({
	startDate: null,
	endDate: null,
	topTenCheck: false,
	skip: 1,
	limit: 10,
	pageArray: [],
	previousPage: 0,
	nextPage: 2,
})
const excelImportFile = ref(null)

const exportList = () => {
	const data = filteredPatientList.value.map((each, index) => {
		let item = {
			Id: each.patientID,
			"Patient Name": each.name,
			Age: each.age,
			Phone: each.phone,
			Gender: each.gender,
			"Marital Status": each.maritalStatus ?? "Not Set",
			Address: each.address,
			"Treatment Package Qty": each.treatmentPackageQty ?? 0,
			"Total Amount": each.totalAmount ?? 0,
			"Total Appointments": each.totalAppointments ?? 0,
			"Finished Appointments": each.finishedAppointments ?? 0,
			"Unfinished Appointments": each.unfinishedAppointments ?? 0,
			"Created At": cusFormatDate(each.createdAt),
		}
		return item
	})

	exportData(data, "PatientsList.xlsx")
}

const searchPatients = async searchTerm => {
	if (searchTerm.length > 0) {
		try {
			let res = await patientStore.searchPatient({ search: searchTerm })
			filteredPatientList.value = res.data
		} catch (err) {
			console.log(err)
			if (err.response?.data?.message === "No Record Found!") {
				filteredPatientList.value = []
			}
		}
	} else {
		searchTerm = ""
		reloadData()
	}
}

const reloadData = async () => {
	filter.value = {
		startDate: null,
		endDate: null,
		topTenCheck: false,
		skip: 1,
		limit: 1,
	}

	await getPatients()
}

const goToDetail = id => {
	router.push({ name: "patient.detail", params: { id: id } })
}

const deletePatient = async id => {
	let res = confirm("Want to delete patient ?")
	if (res) {
		try {
			let res = await patientStore.deletePatient({ id })
			let bres = await patientStore.fetchPatients()
			patients.value = bres.list
			filteredPatientList.value = bres.list
			appStore.showSuccess()
		} catch (error) {
			appStore.showError()
			console.log(error)
		}
	}
}

const getPatients = async () => {
	let payload = {}

	if (filter.value.startDate) payload.startDate = filter.value.startDate
	if (filter.value.endDate) payload.endDate = filter.value.endDate

	try {
		let res = await patientStore.patientFilter(payload)
		patients.value = res.data
		filteredPatientList.value = res.data
	} catch (error) {
		console.log(error)
	}
}

const excelImport = async () => {
	isLoading.value = true
	try {
		// let payload = {
		//   excel: excelImportFile.value
		// }
		let payload = new FormData()
		payload.append("excel", excelImportFile.value.files[0])
		const res = await patientStore.importPatientExcel(payload)
		await getPatients()
	} catch (err) {
		console.log(err)
	} finally {
		isLoading.value = false
	}
}
// const filterByMemberType = () => {
//   let newPatientList = patients.value
//   if (filter.value.memberStatus !== 'all') {
//     newPatientList = patients.value.filter(each => {
//       if (each.relatedMember) {
//         return true
//       } else {
//         return false
//       }
//     })
//   }

//   filteredPatientList.value = newPatientList
// }

const filterPatient = () => {
	if (filter.value.topTenCheck) {
		let sortedCustomer = patients.value.sort(
			(a, b) => b.totalAmount - a.totalAmount
		)
		filteredPatientList.value = sortedCustomer.slice(0, 10)
	} else {
		filteredPatientList.value = patients.value
	}
}

const onPaginate = skip => {
	filter.value.skip = skip
	filterPatientByPage()
}

const filterPatientByPage = async () => {
	try {
		let filterPayload = {
			skip: filter.value.skip - 1,
			limit: filter.value.limit,
		}
		let customers = await patientStore.fetchPatients(filterPayload)
		console.log(customers)
		if (filter.value.skip > customers._metadata.page_count) {
			filter.value.skip = 1
			return filterPatientByPage()
		}

		filteredPatientList.value = customers.list
		filter.value.pageArray = createNumberArray(customers._metadata.page_count)

		if (filter.value.skip < customers._metadata.page_count) {
			filter.value.nextPage = true
		} else {
			filter.value.nextPage = false
		}

		if (filter.value.skip > 1) {
			filter.value.previousPage = true
		} else {
			filter.value.previousPage = false
		}
		console.log(filter.value)
	} catch (err) {
		console.log(err)
	}
}

const createNumberArray = number => {
	const result = []
	for (let i = 1; i <= number; i++) {
		result.push(i)
	}
	return result
}

onMounted(async () => {
	try {
		const res = await patientStore.fetchPatients()
		patients.value = res.list
		await filterPatientByPage()
	} catch (error) {
		console.log(error)
	} finally {
		isLoading.value = false
	}
})
</script>

<style lang="scss" scoped>
th:not(:first-child) {
	min-width: 150px;
}

table th {
	position: -webkit-sticky; // this is for all Safari (Desktop & iOS), not for Chrome
	position: sticky;
	top: 0;
	padding: 20px 20px 20px 10px;
	z-index: 1; // any positive value, layer order is global
}

thead tr {
	background: rgb(196, 193, 193);
}

tbody {
	tr:hover {
		cursor: pointer;
	}
}

.page-link {
	&:hover {
		cursor: pointer;
	}
}

.filter-bar {
	overflow-x: auto;
}

th {
	background: rgb(223, 219, 219);
}
</style>
