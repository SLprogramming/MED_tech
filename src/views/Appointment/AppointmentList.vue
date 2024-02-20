<template>
	<template v-if="isLoading">
		<Loading />
	</template>
	<template v-else>
		<div>
			<div class="card p-3">
				<Heading :payload="{ title: 'Booking List' }" />
				<div class="d-flex gap-3 filter-bar p-3 border rounded mb-3">
					<div class="d-flex align-items-center gap-3">
						<label for="startDate" class="form-label text-nowrap mb-0"
							>From Date</label
						>
						<input
							v-model="filter.start"
							type="date"
							class="form-control"
							id="startDate" />
					</div>
					<div class="d-flex align-items-center gap-3">
						<label for="toDate" class="form-label text-nowrap mb-0"
							>To Date</label
						>
						<input
							v-model="filter.end"
							type="date"
							class="form-control"
							id="toDate" />
					</div>
					<button class="btn btn-primary" @click="searchAppointmentsByDate">
						Search
					</button>
					<button class="btn btn-primary" @click="reloadData">Reload</button>
					<div>
						<ThrottleSearch @search="searchAppointments" placeholder="Phone" />
					</div>
				</div>
				<div class="d-flex gap-3 justify-content-center mb-3">
					<button
						class="btn"
						@click="filter.purchaseType = 'Surgery'"
						:class="{ 'btn-primary': filter.purchaseType === 'Surgery' }">
						Surgery
					</button>
					<button
						class="btn"
						@click="filter.purchaseType = 'Clinic'"
						:class="{ 'btn-primary': filter.purchaseType === 'Clinic' }">
						Aesthetic
					</button>
				</div>
				<div class="table-responsive" v-if="filter.purchaseType === 'Surgery'">
					<table class="table table-borderless table-striped table-hover mb-0">
						<thead>
							<tr>
								<th class="text-nowrap" scope="col">#</th>
								<th class="text-nowrap" scope="col">Date</th>
								<th class="text-nowrap" scope="col">Time</th>
								<th class="text-nowrap" scope="col">Patient Name</th>
								<th class="text-nowrap" scope="col">Phone</th>
								<th class="text-nowrap" scope="col">Doctor Name</th>
								<th class="text-nowrap" scope="col">Description</th>
								<th class="text-nowrap" scope="col">Status</th>
								<th class="text-nowrap" scope="col">Purchase Type</th>
								<th class="text-nowrap" scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							<tr
								@click="goToDetail(appointment.relatedPatient._id)"
								v-for="(appointment, index) in surgeryAppointments">
								<td class="text-nowrap">{{ index + 1 }}</td>
								<td class="text-nowrap">
									{{
										appointment.originalDate
											? cusFormatDate(appointment.originalDate)
											: "Not set"
									}}
								</td>
								<td class="text-nowrap">
									{{
										appointment.originalDate
											? cusFormatTime(appointment.originalDate)
											: "Not set"
									}}
								</td>
								<td class="text-nowrap">
									{{ appointment.relatedPatient?.name }}
								</td>
								<td class="text-nowrap">{{ appointment.phone }}</td>
								<td class="text-nowrap">
									{{ appointment.relatedDoctor?.name }}
								</td>
								<td style="width: 400px">
									{{ appointment.description }}
								</td>
								<td class="text-nowrap">
									<span
										v-if="!appointment.status"
										class="badge rounded-pill bg-warning px-3 small"
										>Ongoing</span
									>
									<span v-else class="badge rounded-pill bg-info px-3 small"
										>Finished</span
									>
								</td>
								<td>
									{{ appointment.purchaseType }}
								</td>
								<td>
									<div class="d-flex mt-2 align-items-center gap-3">
										<!-- <router-link :to="{
                      name: 'appointment.detail',
                      params: { id: appointment._id },
                    }" custom v-slot="{ navigate }">
                      <button class="btn btn-primary" @click.stop="navigate" @keypress.enter="navigate" role="link">
                        Detial
                      </button>
                    </router-link> -->
										<router-link
											:to="{
												name: 'appointment.edit',
												params: { id: appointment._id },
											}"
											custom
											v-slot="{ navigate }">
											<button
												class="btn btn-warning"
												@click.stop="navigate"
												@keypress.enter="navigate"
												role="link">
												<i class="bi bi-pencil-square"></i>
											</button>
										</router-link>
										<button
											class="btn btn-danger"
											@click.stop="deleteAppointment(appointment._id)">
											<i class="bi bi-trash"></i>
										</button>
									</div>
								</td>
							</tr>
							<tr v-if="surgeryAppointments && surgeryAppointments.length <= 0">
								<td colspan="10" class="text-center">No record exist!</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div class="table-responsive" v-if="filter.purchaseType === 'Clinic'">
					<table class="table table-borderless table-striped table-hover mb-0">
						<thead>
							<tr>
								<th class="text-nowrap" scope="col">#</th>
								<th class="text-nowrap" scope="col">Date</th>
								<th class="text-nowrap" scope="col">Time</th>
								<th class="text-nowrap" scope="col">Patient Name</th>
								<th class="text-nowrap" scope="col">Phone</th>
								<th class="text-nowrap" scope="col">Doctor Name</th>
								<th class="text-nowrap" scope="col">Description</th>
								<th class="text-nowrap" scope="col">Status</th>
								<th class="text-nowrap" scope="col">Purchase Type</th>
								<th class="text-nowrap" scope="col">Action</th>
							</tr>
						</thead>
						<tbody>
							<tr
								@click="goToDetail(appointment.relatedPatient._id)"
								v-for="(appointment, index) in aestheticAppointments">
								<td class="text-nowrap">{{ index + 1 }}</td>
								<td class="text-nowrap">
									{{
										appointment.originalDate
											? cusFormatDate(appointment.originalDate)
											: "Not set"
									}}
								</td>
								<td class="text-nowrap">
									{{
										appointment.originalDate
											? cusFormatTime(appointment.originalDate)
											: "Not set"
									}}
								</td>
								<td class="text-nowrap">
									{{ appointment.relatedPatient?.name }}
								</td>
								<td class="text-nowrap">{{ appointment.phone }}</td>
								<td class="text-nowrap">
									{{ appointment.relatedDoctor?.name }}
								</td>
								<td style="width: 400px">
									{{ appointment.description }}
								</td>
								<td class="text-nowrap">
									<span
										v-if="!appointment.status"
										class="badge rounded-pill bg-warning px-3 small"
										>Ongoing</span
									>
									<span v-else class="badge rounded-pill bg-info px-3 small"
										>Finished</span
									>
								</td>
								<td>Aesthetic</td>
								<td>
									<div class="d-flex mt-2 align-items-center gap-3">
										<!-- <router-link :to="{
                      name: 'appointment.detail',
                      params: { id: appointment._id },
                    }" custom v-slot="{ navigate }">
                      <button class="btn btn-primary" @click.stop="navigate" @keypress.enter="navigate" role="link">
                        Detial
                      </button>
                    </router-link> -->
										<router-link
											:to="{
												name: 'appointment.edit',
												params: { id: appointment._id },
											}"
											custom
											v-slot="{ navigate }">
											<button
												class="btn btn-warning"
												@click.stop="navigate"
												@keypress.enter="navigate"
												role="link">
												<i class="bi bi-pencil-square"></i>
											</button>
										</router-link>
										<button
											class="btn btn-danger"
											@click.stop="deleteAppointment(appointment._id)">
											<i class="bi bi-trash"></i>
										</button>
									</div>
								</td>
							</tr>
							<tr
								v-if="
									aestheticAppointments && aestheticAppointments.length <= 0
								">
								<td colspan="10" class="text-center">No record exist!</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</template>
</template>

<script setup>
import { ref, onMounted } from "vue"
import _ from "lodash"
import { useAppointmentStore } from "../../stores/appointment.js"
import { cusFormatDate, cusFormatTime, dateForParams } from "@/helpers/index.js"
import Loading from "../../components/Common/Loading.vue"
import { useAppStore } from "../../stores/app"
import ThrottleSearch from "../../components/Common/ThrottleSearch.vue"
import { getAxiosClient } from "../../data/axios"
import { useRouter } from "vue-router"

const appointments = ref([])
const surgeryAppointments = ref([])
const aestheticAppointments = ref([])
const isLoading = ref(true)
const appointmentStore = useAppointmentStore()
const appStore = useAppStore()
const router = useRouter()
const filter = ref({
	start: "",
	end: "",
	purchaseType: "Surgery",
})

const reloadData = async () => {
	;(filter.value.start = ""), (filter.value.end = "")
	let res = await getAppointments()
	if (res) {
		separateAppointments()
	}
}

const goToDetail = patientId => {
	router.push({ name: "patient.detail", params: { id: patientId } })
}

const searchAppointmentsByDate = async () => {
	if (filter.value.start && filter.value.end) {
		try {
			let params = {
				start: dateForParams(filter.value.start),
				end: dateForParams(filter.value.end),
			}
			let res = await appointmentStore.filterAppointment({ params })
			console.log(res)
			appointments.value = res.data
			separateAppointments()
		} catch (err) {
			console.log(err)
			if (err.response?.data?.message === "No Record Found!") {
				appointments.value = []
			}
		}
	} else {
		try {
			await getAppointments()
		} catch (err) {
			console.log(err)
		}
	}
}

const searchAppointments = async searchTerm => {
	if (searchTerm.length > 0) {
		try {
			let res = await appointmentStore.searchAppointment({ search: searchTerm })
			appointments.value = res.data
			console.log(res.data)
			separateAppointments()
		} catch (err) {
			console.log(err)
			if (err.response?.data?.message === "No Record Found!") {
				appointments.value = []
			}
		}
	} else {
		getAppointments()
	}
}

const deleteAppointment = async id => {
	let res = confirm(`Want to delete appointment?`)
	if (res) {
		try {
			let res = await appointmentStore.deleteAppointment({ id })
			console.log(res)
			appStore.showSuccess()
			let bres = await appointmentStore.fetchAppointments()
			appointments.value = bres.list
		} catch (error) {
			console.log(error)
		}
	}
}

// const filterAppointments = () => {
//   filteredAppointments.value = appointments.value.filter(each => {
//     if (filter.value.purchaseType === 'All') {
//       return true
//     } else if (each.purchaseType === filter.value.purchaseType) {
//       return true
//     } else {
//       return false
//     }
//   })
// }

const separateAppointments = () => {
	appointments.value.map(each => {
		if (each.purchaseType === "Surgery") surgeryAppointments.value.push(each)
		if (each.purchaseType === "Clinic") aestheticAppointments.value.push(each)
	})
}

const getAppointments = async () => {
	try {
		let res = await appointmentStore.fetchAppointments()
		appointments.value = res.list
		// categories.value =
	} catch (error) {
		console.log(error)
	}
}

onMounted(async () => {
	try {
		await getAppointments()
		separateAppointments()
	} catch (error) {
		console.log(error)
	} finally {
		isLoading.value = false
	}
})
</script>

<style lang="scss" scoped>
tbody {
	tr:hover {
		cursor: pointer;
	}
}

.filter-bar {
	overflow-x: auto;
}
</style>
