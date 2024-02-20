<template>
	<div class="row">
		<div class="col-4">
			<div class="card">
				<div class="card-body">
					<div class="mb-2">
						<label for="user_name"> Name</label>
						<select
							name=""
							id="user_name"
							v-model="personStatus"
							class="form-select">
							<option value="doctor">Doctor</option>
							<option value="therapist">Therapist</option>
						</select>
					</div>
					<div class="mb-2" v-if="personStatus == 'doctor'">
						<label for="user_name"> Name</label>
						<select
							name=""
							id="user_name"
							v-model="doctorName"
							class="form-select">
							<template v-if="allDoctor.length > 0">
								<option
									v-for="(doctor, i) in allDoctor"
									:key="i"
									:value="doctor.name">
									{{ doctor.name }}
								</option>
							</template>
						</select>
					</div>
					<div class="mb-2" v-if="personStatus == 'therapist'">
						<label for="user_name"> Name</label>
						<select
							name=""
							id="user_name"
							v-model="therapistName"
							class="form-select">
							<template v-if="allTherapist.length > 0">
								<option
									v-for="(therapist, i) in allTherapist"
									:key="i"
									:value="therapist.name">
									{{ therapist.name }}
								</option>
							</template>
						</select>
					</div>
					<div>
						<label for="password-">Password</label>
						<input
							:type="passwordType"
							name=""
							v-model="userCode"
							id="password-"
							:disabled="isLogin"
							class="form-control mt-1" />
					</div>
					<div class="mt-2">
						<input
							type="checkbox"
							name=""
							@change="togglePasswordShowOrHide()"
							v-model="showPassword"
							class="form-check-input"
							id="check_box" />
						<label for="check_box" class="ms-2 user-select-none"
							>Show Password</label
						>
					</div>
					<div class="mt-2">
						<button class="btn btn-primary" @click="getRequiredData()">
							send
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="col-8">
			<div class="card">
				<div class="card-body">
					<div class="row">
						<table class="table table-borderless table-striped">
							<thead>
								<tr>
									<th>#</th>
									<th>Total</th>
									<th>Unfinish</th>
									<th>Finish</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>Voucher</td>
									<td>{{ voucherData.total }}</td>
									<td>{{ voucherData.unfinish }}</td>
									<td>{{ voucherData.finish }}</td>
								</tr>
								<tr>
									<td>Treatment</td>
									<td>{{ treatmentData.total }}</td>
									<td>{{ treatmentData.unfinish }}</td>
									<td>{{ treatmentData.finish }}</td>
								</tr>
								<tr>
									<td>Appointment</td>
									<td>{{ appointmentData.total }}</td>
									<td>{{ appointmentData.unfinish }}</td>
									<td>{{ appointmentData.finish }}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-2">
		<div class="col">
			<div class="card">
				<div class="card-body">
					<div class="row">
						<div class="col-4">
							<button class="btn btn-primary me-2" @click="clear()">
								Clear
							</button>
							<button class="btn btn-primary me-2" @click="apiFilter()">
								Filter
							</button>
							<button class="btn btn-primary me-2" @click="excelExport()">
								Export
							</button>
						</div>
						<div class="col-8 d-flex justify-content-end">
							<div class="mx-2">
								<label for="">Start Date</label>
								<input
									type="date"
									name=""
									v-model="filterData.startDate"
									class="form-control d-inline"
									id="" />
							</div>
							<div class="mx-2">
								<label for="">End Date</label>
								<input
									type="date"
									name=""
									v-model="filterData.endDate"
									class="form-control d-inline"
									id="" />
							</div>
							<div class="mx-2">
								<label for="" class="form-label">Selection Status</label>
								<select
									name=""
									class="form-select d-inline"
									@change="filterSelection()"
									v-model="filterData.treatmentStatus"
									id="">
									<option value="all">All</option>
									<option value="finish">Finish</option>
									<option value="unfinish">UnFinish</option>
								</select>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="row mt-2">
		<div class="col">
			<div class="card">
				<div class="card-body">
					<table class="table">
						<thead>
							<tr>
								<th scope="col" class="text-nowrap">#</th>
								<th scope="col" class="text-nowrap">Voucher Code</th>
								<th scope="col" class="text-nowrap">Treatment</th>

								<th scope="col" class="text-nowrap">Status</th>
								<th scope="col" class="text-nowrap">Times</th>
							</tr>
						</thead>
						<tbody v-if="isLoading">
							<td colspan="11" class="text-center">
								<Loading></Loading>
							</td>
						</tbody>
						<tbody v-else>
							<template
								v-for="(selection, index) in selectionsToShow"
								:key="index">
								<tr
									:class="{
										'rowborder-bottom':
											selection?.relatedAppointments?.length == 0,
										'border-transparent':
											selection?.relatedAppointments?.length != 0,
									}">
									<td>
										{{ index + 1 }}
									</td>
									<td>{{ selection?.voucherCode || "-" }}</td>
									<td>{{ selection?.relatedTreatment?.name }}</td>

									<td>{{ selection?.selectionStatus }}</td>
									<td>
										{{
											selection?.relatedAppointments.length ||
											selection?.relatedTreatment?.treatmentTimes
										}}
									</td>
								</tr>
								<tr v-if="selection?.relatedAppointments?.length > 0">
									<td colspan="11" style="padding-left: 0; padding-right: 0">
										<div class="table-responsive mb-2">
											<div class="accordion" id="accordionExample">
												<div class="accordion-item">
													<h2 class="accordion-header">
														<button
															class="accordion-button collapsed"
															type="button"
															data-bs-toggle="collapse"
															:data-bs-target="'#collapse' + index"
															aria-expanded="false"
															aria-controls="collapseOne">
															Relatd Appointments
														</button>
													</h2>
													<div
														:id="'collapse' + index"
														class="accordion-collapse collapse">
														<div class="pt-3">
															<table class="table mb-0">
																<thead>
																	<tr>
																		<th scope="col" class="text-nowrap">#</th>
																		<th scope="col" class="text-nowrap">
																			Phone
																		</th>
																		<th scope="col" class="text-nowrap">
																			Date
																		</th>
																		<th scope="col">Doctor Name</th>
																		<th scope="col">Therapist Name</th>
																		<th scope="col" class="text-nowrap">
																			Status
																		</th>
																	</tr>
																</thead>
																<tbody>
																	<template
																		v-for="(
																			relatedAppointment, index
																		) in selection?.relatedAppointments"
																		:key="index">
																		<tr>
																			<td>{{ index + 1 }}</td>
																			<td class="text-nowrap">
																				{{ relatedAppointment.phone }}
																			</td>
																			<td class="text-nowrap">
																				{{
																					relatedAppointment.originalDate
																						? cusFormatDate(
																								relatedAppointment.originalDate
																						  )
																						: "Not Set"
																				}}
																			</td>
																			<td>
																				{{
																					relatedAppointment?.relatedDoctor
																						?.name ?? "N/A"
																				}}
																			</td>
																			<td>
																				{{
																					relatedAppointment?.relatedTherapist
																						?.name ?? "N/A"
																				}}
																			</td>
																			<td class="text-nowrap">
																				<div
																					class="text-white rounded text-center"
																					:class="{
																						'bg-success':
																							relatedAppointment?.status,
																						'bg-warning':
																							!relatedAppointment?.status,
																					}">
																					{{
																						relatedAppointment?.status
																							? "Finished"
																							: "Ongoing"
																					}}
																				</div>
																			</td>
																		</tr>
																	</template>
																</tbody>
															</table>
														</div>
													</div>
												</div>
											</div>
										</div>
									</td>
								</tr>
							</template>
							<tr v-if="selections && selections.length <= 0">
								<td colspan="11" class="text-center">No selection exist!</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useAppStore } from "../../stores/app"
import { useTherapistStore } from "../../stores/therapist"
import Loading from "@/components/Common/Loading.vue"
import { useDoctorStore } from "../../stores/doctor"

import {
	cusFormatDate,
	dateForParams,
	openDialog,
	exportData,
	openPrint,
} from "../../helpers"
import { onMounted, ref } from "vue"
const passwordType = ref("password")
const showPassword = ref(false)
const therapistStore = useTherapistStore()
const personStatus = ref("doctor")
const doctorName = ref("")
const therapistName = ref("")
const userCode = ref("")
const appStore = useAppStore()
const doctorStore = useDoctorStore()
const selections = ref([])
const isLogin = ref(false)
const filterData = ref({
	treatmentStatus: "all",
	startDate: "",
	endDate: "",
})
const selectionsToShow = ref([])
const doctorData = ref({})
const allDoctor = ref([])
const allTherapist = ref([])
const allAppointments = ref([])
const allVouchers = ref([])
const voucherData = ref({
	total: 0,
	unfinish: 0,
	finish: 0,
})
const treatmentData = ref({
	total: 0,
	unfinish: 0,
	finish: 0,
})
const appointmentData = ref({
	total: 0,
	unfinish: 0,
	finish: 0,
})
const isLoading = ref(false)
const excelExport = () => {
	let primaryArr = [...selectionsToShow.value]
	console.log(selectionsToShow.value)
	let exportList = []
	primaryArr.map(e => {
		let obj = {
			Date: "",
			"Customer Name": "",
			"Doctor Name": "",
			"Therapist Name": "",
			"Voucher No": "",
			"Treatment Name": "",
			"Total Appointment": "",
			"Finish Appointment": "",
			"Unfinish Appointment": "",
		}
		obj["Date"] = cusFormatDate(e.createdAt)
		obj["Customer Name"] = e.relatedPatientName
		obj["Doctor Name"] = e.leadDoctor
		obj["Therapist Name"] = e.leadTherapist
		obj["Voucher No"] = e.voucherCode
		obj["Treatment Name"] = e.relatedTreatment?.name || "Not Set"
		obj["Total Appointment"] =
			e.numOf_finishAppointment + e.numOf_unfinishAppointment
		obj["Finish Appointment"] = e.numOf_finishAppointment
		obj["Unfinish Appointment"] = e.numOf_unfinishAppointment

		exportList.push(obj)
	})
	console.log(exportList)
	exportData(exportList, "export.xlsx")
}
const filterSelection = () => {
	console.log(selections.value)
	if (filterData.value.treatmentStatus == "all") {
		selectionsToShow.value = [...selections.value]
	} else if (filterData.value.treatmentStatus == "finish") {
		// selectionsToShow.value = []
		console.log("finish")
		selectionsToShow.value = selections.value.filter(
			e => e.selectionStatus == "Done"
		)
	} else if (filterData.value.treatmentStatus == "unfinish") {
		// selectionsToShow.value = []
		console.log("unfinish")
		selectionsToShow.value = selections.value.filter(
			e => e.selectionStatus == "Ongoing"
		)
	}
	console.log(selectionsToShow.value)
}
const apiFilter = async () => {
	console.log(filterData.value.startDate == "")
	if (filterData.value.startDate !== "" && filterData.value.endDate !== "") {
		console.log(dateForParams(filterData.value.startDate))
		getRequiredData({
			startDate: dateForParams(filterData.value.startDate),
			endDate: dateForParams(filterData.value.endDate),
		})
	}
}
const togglePasswordShowOrHide = () => {
	if (showPassword.value) {
		passwordType.value = "text"
	} else {
		passwordType.value = "password"
	}
}
const clear = () => {
	voucherData.value = { total: 0, unfinish: 0, finish: 0 }
	treatmentData.value = { total: 0, unfinish: 0, finish: 0 }
	appointmentData.value = { total: 0, unfinish: 0, finish: 0 }
	filterData.value.startDate = ""
	filterData.value.endDate = ""
	selections.value = []
	selectionsToShow.value = []
	allAppointments.value = []
	allVouchers.value = []
	doctorData.value = {}
	userCode.value = ""
	isLogin.value = false
}
const getRequiredData = async filter => {
	try {
		isLoading.value = true
		let payload = {
			name: "",
			code: userCode.value,
		}
		if (personStatus.value == "doctor") {
			payload.name = doctorName.value
			payload.isDoctor = true
		} else {
			payload.name = therapistName.value
		}
		console.log(payload)
		if (filter) {
			console.log(filter)
			payload.startDate = filter.startDate
			payload.endDate = filter.endDate
		} else {
			console.log("no filter")
		}
		// return
		let res = await doctorStore.verifyDoctor(payload)
		console.log(res)
		selections.value = []
		allVouchers.value = [...res.TSMulti, ...res.TSCombined, ...res.TSSingle]
		allAppointments.value = []
		doctorData.value = res.doctor[0]
		// selections.value = res.TSMulti[0].relatedTreatmentSelection

		if (allVouchers.value.length > 0) {
			allVouchers.value.map(e => {
				if (e.relatedTreatmentSelection.length > 0) {
					e.relatedTreatmentSelection.map(i => {
						i.voucherCode = e.code
						i.relatedPatientName = e.relatedPatient.name
						allAppointments.value = [
							...allAppointments.value,
							...i.relatedAppointments,
						]
						if (i.relatedAppointments.length > 0) {
							let appointmentFilter = i.relatedAppointments.filter(
								item => !item.status
							)
							if (appointmentFilter.length > 0) {
								i.isDone = false
							} else {
								i.isDone = true
							}
							i.numOf_finishAppointment =
								i.relatedAppointments.length - appointmentFilter.length
							i.numOf_unfinishAppointment = appointmentFilter.length
							i.leadDoctor =
								i.relatedAppointments[0]?.relatedDoctor?.name || "N/A"
							i.leadTherapist =
								i.relatedAppointments[0]?.relatedTherapist?.name || "N/A"
						} else {
							i.isDone = false
							i.leadDoctor = "N/A"
							i.leadTherapist = "N/A"
							i.numOf_finishAppointment = 0
							i.numOf_unfinishAppointment = 0
						}
					})
					selections.value = [
						...selections.value,
						...e.relatedTreatmentSelection,
					]
					let voucherFilter = e.relatedTreatmentSelection.filter(
						selection => !selection.isDone
					)
					console.log(voucherFilter)
					if (voucherFilter.length > 0) {
						e.finish = false
					} else {
						e.finish = true
					}
				}
			})
		}

		changeSelectionStatus()
		console.log("vouchers", allVouchers.value)
		console.log("allTreatmentSelection", selections.value)
		console.log("allAppointment", allAppointments.value)
		voucherData.value.total = allVouchers.value.length
		voucherData.value.finish = allVouchers.value.filter(e => e.finish).length
		voucherData.value.unfinish = allVouchers.value.filter(e => !e.finish).length

		treatmentData.value.total = selections.value.length
		treatmentData.value.finish = selections.value.filter(e => e.isDone).length
		treatmentData.value.unfinish = selections.value.filter(
			e => !e.isDone
		).length

		appointmentData.value.total = allAppointments.value.length
		appointmentData.value.finish = allAppointments.value.filter(
			e => e.status
		).length
		appointmentData.value.unfinish = allAppointments.value.filter(
			e => !e.status
		).length

		filterSelection()
		isLogin.value = true
	} catch (err) {
		console.error(err)
		isLogin.value = false
	} finally {
		isLoading.value = false
	}
}
const getAllDoctors = async () => {
	try {
		let doctorRes = await doctorStore.fetchDoctors()
		console.log(doctorRes)
		allDoctor.value = doctorRes.data
	} catch (err) {
		console.error(err)
	}
}
const changeSelectionStatus = () => {
	selections.value.map(e => {
		if (e.isDone) {
			e.selectionStatus = "Done"
		} else {
			if (e.relatedAppointments.length > 0) {
				let filterArr = e.relatedAppointments.filter(i => {
					return !i.status
				})
				if (filterArr.length > 0) {
					e.selectionStatus = "Ongoing"
				} else {
					e.selectionStatus = "Done"
				}
			} else {
				e.selectionStatus = "Ongoing"
			}
		}
	})
}
const getAllTherapist = async () => {
	try {
		let therapistRes = await therapistStore.fetchTherapists()
		allTherapist.value = therapistRes.data
		console.log(therapistRes.data)
	} catch (err) {
		console.error(err)
	}
}
onMounted(async () => {
	await getAllDoctors()
	await getAllTherapist()
	// await getRequiredData()
})
</script>
