<template>
	<template v-if="isLoading">
		<div>Loading ...</div>
	</template>
	<template v-else>
		<div>
			<form
				ref="recordForm"
				@submit.prevent="createRecord"
				enctype="multipart/form-data">
				<div class="row mb-3">
					<div class="col-6">
						<label for="diagnosis" class="form-label">Diagnosis</label>
						<input type="text" class="form-control" v-model="data.diagnosis" />
					</div>
					<div class="col-6">
						<label for="complaint" class="form-label">Complaint</label>
						<input type="text" class="form-control" v-model="data.complaint" />
					</div>
				</div>

				<div class="row mb-3">
					<div class="col-6">
						<label for="remark" class="form-label">Remark</label>
						<input
							type="text"
							id="remark"
							class="form-control"
							v-model="data.remark" />
					</div>
					<div class="col-6">
						<label for="improvement" class="form-label">Improvement</label>
						<input
							type="text"
							id="improvement"
							class="form-control"
							v-model="data.improvement" />
					</div>
				</div>

				<div class="row mb-3">
					<div class="col">
						<label class="form-label fw-bold">Before</label>
						<input
							type="file"
							ref="beforeImage"
							class="form-control"
							multiple />
					</div>
					<div class="col">
						<label class="form-label fw-bold">After</label>
						<input type="file" ref="afterImage" class="form-control" multiple />
					</div>
				</div>

				<template v-if="alreadyExist">
					<div class="row mb-3">
						<template
							v-if="existedData.before && existedData.before.length > 0">
							<div class="col-6">
								<label for="" class="form-label mb-3">Before Image</label>
								<template v-for="imageSrc in existedData.before">
									<img
										:src="getImage(imageSrc)"
										class="patient-img bg-white border p-3 w-100"
										alt="" />
								</template>
							</div>
						</template>
						<template v-if="existedData.after && existedData.after.length > 0">
							<div class="col-6">
								<label for="" class="form-label mb-3">After Image</label>
								<template v-for="imageSrc in existedData.after">
									<img
										:src="getImage(imageSrc)"
										class="patient-img bg-white border p-3 w-100"
										alt="" />
								</template>
							</div>
						</template>
					</div>
				</template>

				<div class="row mb-3">
					<div class="col-6">
						<label for="" class="form-label mb-3">Medicine Item Type</label>
						<select
							@change="filterMedicineItems"
							class="form-select mb-3"
							v-model="medicineItemsType"
							aria-label="Select Medicine Items"
							style="width: 300px">
							<option value="All">All</option>
							<option value="Oral">Oral</option>
							<option value="Topical">Topical</option>
							<option value="Cosmetic">Cosmetic</option>
							<option value="Consignment">Consignment</option>
						</select>
					</div>
				</div>

				<div class="row mb-3">
					<div class="col-6">
						<label for="diagnosis" class="form-label">Medicine Items</label>
						<div class="d-flex gap-3">
							<VueMultiselect
								:model-value="selectedMedicineItem"
								@update:model-value="updateSelectedMedicineItem"
								:options="filteredMedicineItems"
								:searchable="true"
								:close-on-select="false"
								:allow-empty="false"
								:option-height="31"
								label="medicineItemName"
								placeholder="Select Items"
								track-by="_id" />
							<button
								@click="addSelectedMedicineItems"
								type="button"
								class="btn btn-primary">
								<i class="bi bi-plus-lg"></i>
							</button>
						</div>
					</div>
				</div>

				<div v-if="selectedMedicineItems?.length > 0" class="row mb-3">
					<div class="col-12">
						<h5 class="fw-bold">Selected Medicine Items</h5>
						<div class="table-responsive">
							<table class="table table-bordered">
								<thead>
									<tr>
										<th scope="col">#</th>
										<th scope="col">Name</th>
										<th scope="col">Qty/Dose</th>
										<th scope="col">Dose/Day</th>
										<th scope="col">Duration</th>
										<th scope="col">Total Qty</th>
										<th scope="col">SIG</th>
										<th scope="col">Sub SIG</th>
										<th scope="col">Remark</th>
										<th scope="col">Action</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item, index) in selectedMedicineItems">
										<th scope="row">{{ index + 1 }}</th>
										<td class="text-nowrap">
											{{ item.item_id.medicineItemName ?? item.name }}
										</td>
										<td>
											<input
												@change="calculateTotal(index)"
												type="number"
												class="form-control text-uppercase"
												v-model="item.qty"
												placeholder="Qty per dose" />
										</td>
										<td>
											<input
												@change="calculateTotal(index)"
												type="number"
												class="form-control text-uppercase"
												v-model="item.dose"
												placeholder="Dose Per Day" />
										</td>
										<td>
											<input
												type="number"
												@change="calculateTotal(index)"
												class="form-control text-uppercase"
												v-model="item.duration"
												placeholder="Duaration" />
										</td>
										<td>
											<input
												type="number"
												disabled
												class="form-control text-uppercase"
												v-model="item.totalQTY"
												placeholder="Total" />
										</td>
										<td id="sigs">
											<select
												class="form-select"
												v-model="item.SIG"
												aria-label="Default select example">
												<option selected disabled>Select SIG</option>
												<option value="one">One</option>
												<option value="two">Two</option>
												<option value="three">Three</option>
											</select>
											<!-- <input
                      type="text"
                      class="form-control text-uppercase"
                      v-model="item.SIG"
                      placeholder="sig"
                    /> -->
										</td>
										<td id="sigs">
											<select
												class="form-select"
												v-model="item.subSIG"
												aria-label="Default select example">
												<option selected disabled>Select Sub SIG</option>
												<option value="one">One</option>
												<option value="two">Two</option>
												<option value="three">Three</option>
											</select>
											<!-- <input
                      type="text"
                      class="form-control text-uppercase"
                      v-model="item.subSIG"
                      placeholder="sig"
                    /> -->
										</td>
										<td id="remark">
											<input
												type="text"
												class="form-control"
												v-model="item.remark"
												placeholder="remark" />
										</td>
										<td style="width: 50px">
											<button type="button" class="btn btn-danger">
												<i
													@click="removeSelectedMedicineItems(index)"
													class="bi bi-dash-lg"></i>
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<template v-if="alreadyExist">
					<button
						v-if="isMedicineItemsExist"
						type="button"
						@click="goToMedicineSale"
						class="btn btn-primary">
						Medicine Sale
					</button>
				</template>

				<div class="text-end">
					<template v-if="alreadyExist">
						<SubmitButton
							@click="updateRecord"
							name="Update"
							type="submit"
							:loading="submitting" />
					</template>
					<template v-else>
						<SubmitButton
							@click="createRecord"
							name="Submit"
							type="submit"
							:loading="submitting" />
					</template>
				</div>
			</form>
		</div>
	</template>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"
import VueMultiselect from "vue-multiselect"
import { useRoute } from "vue-router"
import { useAppStore } from "../../stores/app"
import { useMedicineItemStore } from "../../stores/medicineItems"
import { useProcedureHistoryStore } from "../../stores/procedureHistory"
import { useTreatmentSelectionStore } from "../../stores/treatmentSelection"
import SubmitButton from "../../components/Common/SubmitButton.vue"
import { getImage } from "../../helpers"
import { useStockStore } from "../../stores/stock"
import router from "../../router"

const medicineItemStore = useMedicineItemStore()
const procedureHistoryStore = useProcedureHistoryStore()
const treatmentSelectionStore = useTreatmentSelectionStore()
const appStore = useAppStore()
const stockStore = useStockStore()
const route = useRoute()

const isLoading = ref(true)
const alreadyExist = ref(false)
const existedData = ref({})

const submitting = ref(false)

const recordForm = ref(null)

const medicineItems = ref([])
const filteredMedicineItems = ref([])
const medicineItemsType = ref("All")
const selectedMedicineItem = ref({})
const selectedMedicineItems = ref([])
const beforeImage = ref()
const afterImage = ref()

const data = ref({
	diagnosis: "",
	complaint: "",
	remark: "",
	improvement: "",
})

const isMedicineItemsExist = computed(() => {
	if (!existedData.value.medicineItems) return false
	if (existedData.value.medicineItems.length > 0) {
		return true
	} else {
		return false
	}
})

const updateSelectedMedicineItem = e => {
	console.log(e)

	selectedMedicineItem.value = { ...e }
}

const setData = payload => {
	console.log(payload)
	data.value.diagnosis = payload.diagnosis
	data.value.remark = payload.remark
	data.value.complaint = payload.complaint
	data.value.improvement = payload.improvement

	selectedMedicineItems.value = payload.medicineItems.map(each => {
		let obj = {
			item_id: each.item_id._id,
			name: each.item_id?.medicineItemName,
			duration: each.duration,
			dose: each.dose,
			qty: each.qty,
			totalQTY: each.totalQTY,
			SIG: each.SIG,
			subSIG: each.subSIG,
			remark: each.remark,
		}

		return obj
	})

	// selectedMedicineItems.value = payload.medicineItems
}

const filterMedicineItems = () => {
	filteredMedicineItems.value = medicineItems.value.filter(each => {
		if (medicineItemsType.value === "All") return true
		if (each.itemType === medicineItemsType.value) return true
	})
}

const addSelectedMedicineItems = e => {
	let alreadyExist = selectedMedicineItems.value.findIndex(
		item => item.item_id === selectedMedicineItem.value._id
	)

	console.log(alreadyExist)

	if (
		alreadyExist === -1 &&
		Object.keys(selectedMedicineItem.value).length > 0
	) {
		// selectedMedicineItems.value.push(selectedMedicineItem.value);
		let obj = {
			item_id: selectedMedicineItem.value._id,
			name: selectedMedicineItem.value.medicineItemName,
			duration: 0,
			dose: 0,
			qty: 0,
			totalQTY: 0,
			SIG: "",
			subSIG: "",
			remark: "",
		}

		selectedMedicineItems.value.push(obj)
	}
}

const removeSelectedMedicineItems = index => {
	selectedMedicineItems.value = selectedMedicineItems.value.filter(
		(item, itemIndex) => itemIndex !== index
	)
}

const prepareForm = () => {
	let payload = {
		relatedPatient: route.query.patientId,
		relatedAppointment: route.query.appointmentId,
		relatedTreatmentSelection: route.query.treatmentSelectionId,
	}
	if (data.value.diagnosis && data.value.diagnosis.trim().length > 0)
		payload.diagnosis = data.value.diagnosis
	if (data.value.complaint && data.value.complaint.trim().length > 0)
		payload.complaint = data.value.complaint
	if (data.value.remark && data.value.remark.trim().length > 0)
		payload.remark = data.value.remark
	if (data.value.improvement && data.value.improvement.trim().length > 0)
		payload.improvement = data.value.improvement

	console.log(payload)

	let formData = new FormData(recordForm.value)

	for (var key in payload) {
		if (payload.hasOwnProperty(key)) {
			formData.append(key, payload[key])
		}
	}

	if (selectedMedicineItems.value.length > 0) {
		console.log(selectedMedicineItems.value)
		selectedMedicineItems.value.map((item, index) => {
			Object.entries(item).forEach(([key, value]) => {
				formData.append(`medicineItems[${index}][${key}]`, value)
			})
		})
	}

	// formData.append('phistory', beforeImage.value.files[0])
	// formData.append('phistory', afterImage.value.files[0])

	if (beforeImage.value.files.length > 0) {
		for (const value of beforeImage.value.files) {
			formData.append("before", value)
		}
	}

	if (afterImage.value.files.length > 0) {
		for (const value of afterImage.value.files) {
			formData.append("after", value)
		}
	}
	console.log(existedData.value)
	if (existedData.value && Object.keys(existedData.value).length > 0) {
		console.log(existedData.value)
		formData.append("_id", existedData.value._id)
	}

	return formData
}

const calculateTotal = index => {
	let item = selectedMedicineItems.value[index]
	let totalQTY = Number(item.qty) * Number(item.dose) * Number(item.duration)
	selectedMedicineItems.value[index].totalQTY = totalQTY
}

const createRecord = async () => {
	let data = prepareForm()

	// return
	submitting.value = true
	try {
		let res = await procedureHistoryStore.addProcedureHistory(data)
		console.log(res)
		appStore.showSuccess()
		await checkAlreadyExist()
	} catch (error) {
		console.log(error)
		appStore.showError()
	} finally {
		submitting.value = false
	}
}

const updateRecord = async () => {
	let data = prepareForm()

	// return
	submitting.value = true
	try {
		let res = await procedureHistoryStore.updateProcedureHistory(data)
		console.log(res)
		appStore.showSuccess()
		await checkAlreadyExist()
	} catch (error) {
		console.log(error)
		appStore.showError()
	} finally {
		submitting.value = false
	}
}

const goToMedicineSale = () => {
	// const storedItems = originalSelectedMedicineItems.value.map((each, index) => {
	// 	each.totalQTY = selectedMedicineItems.value[index].totalQTY
	// 	return each
	// })
	// let saleItems = {}
	// saleItems[`${route.query.appointmentId}`] = storedItems
	// sessionStorage.setItem(`saleItems`, JSON.stringify(saleItems))
	const storedItems = existedData.value.medicineItems.map((each, index) => {
		let newItem = {
			...each.item_id,
			totalQTY: each.totalQTY,
		}
		return newItem
	})
	const saleItems = {}
	saleItems[`${route.query.appointmentId}`] = storedItems
	sessionStorage.setItem(`saleItems`, JSON.stringify(saleItems))
	router.push({
		name: "sale.medicine",
		query: {
			appointmentId: route.query.appointmentId,
			patientId: existedData.value.relatedAppointment.relatedPatient,
			treatmentSelectionId: route.query.treatmentSelectionId,
		},
	})
}

const checkAlreadyExist = async () => {
	try {
		const alreadyExistRes =
			await treatmentSelectionStore.fetchRelatedProcedureHistory({
				relatedTreatmentSelection: route.query.treatmentSelectionId,
				relatedAppointment: route.query.appointmentId,
			})
		console.log(alreadyExistRes)
		if (alreadyExistRes.data.length > 0) {
			alreadyExist.value = true
			existedData.value = alreadyExistRes.data[alreadyExistRes.data.length - 1]
			setData(existedData.value)
		}
	} catch (error) {
		console.log(error)
		throw error
	}
}

onMounted(async () => {
	try {
		const res = await medicineItemStore.fetchMedicineItems()
		medicineItems.value = res.list
		filterMedicineItems()

		// const res = await stockStore.fetchMedicineItems()
		// medicineItems.value = res

		await checkAlreadyExist()
	} catch (error) {
		console.log(error)
	} finally {
		isLoading.value = false
	}
})
</script>

<style lang="scss" scoped>
th {
	white-space: nowrap;
}

td {
	min-width: 100px;
}

td#sigs,
td#remark {
	min-width: 300px;
}

.patient-img {
	width: auto;
	height: 400px;
}
</style>
