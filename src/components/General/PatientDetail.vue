<template>
	<template v-if="isLoading">
		<div>Loading ...</div>
	</template>
	<template v-else>
		<div class="overflow-auto">
			<div class="row mb-3">
				<div class="col-3">
					<h4 class="mb-4">Image</h4>
					<div class="mb-3">
						<div
							class="w-100 p-3 border h-100 d-flex justify-content-center align-items-center"
							style="min-height: 300px">
							<img
								v-if="patient.img"
								:src="getImage(patient.img)"
								class="patient-img bg-white w-100"
								alt="" />
							<i v-else class="bi bi-image"></i>
						</div>
					</div>
					<input
						name="img"
						form="patientForm"
						v-if="isEditing"
						type="file"
						class="form-control" />
				</div>
				<div class="col-9">
					<div class="d-flex align-items-center justify-content-between mb-4">
						<Heading :payload="{ title: 'Patient Detail' }" />
						<!-- <div class="d-inline-block">
              <button @click="isEditing = !isEditing" class="btn btn-warning">
                <i class="bi bi-pencil-square"></i>
              </button>
            </div> -->
					</div>
					<form
						id="patientForm"
						ref="patientForm"
						@submit.prevent="updatePatient">
						<input type="hidden" name="id" :value="patient._id" />
						<div class="row mb-3">
							<div class="col-6">
								<div
									class="d-flex align-items-center mb-3 w-100 patient-detail">
									<span class="me-3 label">Patient Name</span>
									<input
										type="text"
										name="name"
										class="form-control value"
										v-model="patient.name"
										:disabled="!isEditing" />
								</div>
								<div class="d-flex align-items-center mb-3 patient-detail">
									<span class="me-3 label">Patient ID</span>
									<input
										type="text"
										name="id"
										class="form-control value"
										v-model="patient.patientID"
										disabled />
								</div>
								<div class="d-flex align-items-center mb-3 patient-detail">
									<span class="me-3 label">Email</span>
									<input
										type="text"
										name="email"
										class="form-control value"
										v-model="patient.email"
										:disabled="!isEditing" />
								</div>
								<div class="d-flex align-items-center mb-3 patient-detail">
									<span class="me-3 label">Phone</span>
									<input
										type="text"
										name="phone"
										class="form-control value"
										v-model="patient.phone"
										:disabled="!isEditing" />
								</div>
								<div class="d-flex align-items-center mb-3 patient-detail">
									<span class="me-3 label">Address</span>
									<input
										type="text"
										name="address"
										class="form-control value"
										v-model="patient.address"
										:disabled="!isEditing" />
								</div>
							</div>
							<div class="col-6">
								<div class="d-flex align-items-center mb-3 patient-detail">
									<span class="me-3 label">Patient Status</span>
									<input
										type="text"
										name="patientStatus"
										class="form-control value"
										v-model="patient.patientStatus"
										:disabled="!isEditing" />
								</div>
								<div
									v-if="!isEditing"
									class="d-flex align-items-center mb-3 patient-detail">
									<span class="me-3 label">Gender</span>
									<input
										type="text"
										name="gender"
										class="form-control value"
										v-model="patient.gender"
										disabled />
								</div>
								<div
									v-if="isEditing"
									class="d-flex align-items-center patient-detail">
									<span class="label me-3">Gender</span>
									<div class="mb-3 border rounded p-3">
										<div class="d-flex gap-3">
											<div class="form-check">
												<input
													class="form-check-input"
													v-model="patient.gender"
													value="Male"
													type="radio"
													name="gender"
													id="male"
													checked />
												<label class="form-check-label" for="male">
													Male
												</label>
											</div>
											<div class="form-check">
												<input
													class="form-check-input"
													v-model="patient.gender"
													value="Female"
													type="radio"
													name="gender"
													id="female" />
												<label class="form-check-label" for="female">
													Female
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<!-- <div v-if="isEditing" class="d-flex justify-content-end">
              <button class="btn btn-success">Update</button>
            </div> -->
						<div v-if="isEditing" class="d-flex justify-content-end">
							<SubmitButton name="Update" :loading="submitting" />
						</div>
					</form>
				</div>
			</div>
		</div>
	</template>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { usePatientStore } from "@/stores/patient"
import { cusFormatDate, getImage } from "@/helpers/index"
import { useAppStore } from "../../stores/app"
import SubmitButton from "../Common/SubmitButton.vue"
import Heading from "../Common/Heading.vue"

const props = defineProps(["id", "prevData"])

const patientStore = usePatientStore()
const isLoading = ref(true)
const patient = ref([])
const originalPatient = ref({})
const patientForm = ref(null)
const isEditing = ref(false)
const submitting = ref(false)
const appStore = useAppStore()

const prepareForm = () => {
	let formData = new FormData(patientForm.value)
	return formData
}

const resetForm = () => {
	patient.value = { ...originalPatient.value }
}

const updatePatient = async () => {
	let data = prepareForm()
	submitting.value = true
	try {
		let res = await patientStore.updatePatient(data)
		res.data.dateOfBirth = res.data.dateOfBirth
			? cusFormatDate(res.data.dateOfBirth)
			: null
		originalPatient.value = { ...res.data }
		patient.value = { ...res.data }
		appStore.showSuccess()
	} catch (error) {
		console.log(error)
		resetForm()
		appStore.showErorr()
	} finally {
		submitting.value = false
	}
}

onMounted(async () => {
	if (props.prevData) {
		console.log(props.prevData)
		props.prevData.dateOfBirth = props.prevData.dateOfBirth
			? cusFormatDate(props.prevData.dateOfBirth)
			: null
		originalPatient.value = { ...props.prevData }
		patient.value = { ...props.prevData }
		isLoading.value = false
	} else {
		try {
			let res = await patientStore.fetchPatient({ id: props.id })
			res.data.dateOfBirth = cusFormatDate(res.data.dateOfBirth)
			originalPatient.value = { ...res.data }
			patient.value = { ...res.data }
		} catch (err) {
			console.log(err)
		} finally {
			isLoading.value = false
		}
	}
})
</script>

<style lang="scss" scoped>
.bi-image::before {
  font-size: 50px;
}

td {
	padding-bottom: 10px;
}

.patient-detail {
	.label {
		width: 100px;
		flex-shrink: 0;
	}

	.value {
		width: 250px;
	}
}
</style>
