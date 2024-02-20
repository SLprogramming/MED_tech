<template>
	<template v-if="isLoading">
		<Loading />
	</template>
	<template v-else>
		<div class="card p-3">
			<h3 class="mb-4">Appointment Edit</h3>
			<div class="row">
				<div class="col-4">
					<div class="mb-3">
						<label for="name" class="form-label">Patient</label>
						<VueMultiselect
							:model-value="selectedPatient"
							@update:model-value="updateSelectedPatient"
							:options="patients"
							:searchable="true"
							:close-on-select="false"
							:allow-empty="false"
							:option-height="31"
							label="name"
							placeholder="Select patient"
							track-by="_id" />
					</div>
					<div class="mb-3">
						<select
							name=""
							class="form-select"
							v-model="selectDoctor"
							@change="resetSelectedDoctorOrTherapist"
							id="">
							<option value="doctor">Doctor</option>
							<option value="Therapist">Therapist</option>
						</select>
					</div>
					<div class="mb-3" v-if="selectDoctor == 'doctor'">
						<label class="form-label">Select Doctor</label>
						<VueMultiselect
							:model-value="selectedDoctor"
							@update:model-value="updateSelectedDoctor"
							:options="doctors"
							:searchable="true"
							:close-on-select="false"
							:allow-empty="false"
							:option-height="31"
							label="name"
							placeholder="Select doctors"
							track-by="_id" />
					</div>

					<div class="mb-3" v-if="selectDoctor == 'Therapist'">
						<label class="form-label">Select Therapists</label>
						<VueMultiselect
							:model-value="selectedTherapist"
							@update:model-value="updateSelectedTherapist"
							:options="therapists"
							:searchable="true"
							:close-on-select="false"
							:allow-empty="false"
							:option-height="31"
							label="name"
							placeholder="Select Therapist"
							track-by="_id" />
					</div>
					<div class="mb-3" v-if="selectDoctor == 'Therapist'">
						<label class="form-label">Comission Amount</label>
						<input
							type="number"
							class="form-control"
							v-model="therapistComissionAmount" />
					</div>
					<div class="mb-3">
						<label for="phone" class="form-label">Phone</label>
						<input
							v-model="data.phone"
							id="phone"
							type="text"
							class="form-control"
							placeholder="Phone" />
					</div>
					<div class="mb-3">
						<label for="date" class="form-label">Date</label>
						<input
							v-model="data.date"
							id="date"
							type="date"
							class="form-control"
							placeholder="Date" />
					</div>
					<div class="mb-3">
						<label for="time" class="form-label">Time</label>
						<input
							v-model="data.time"
							id="time"
							type="time"
							class="form-control"
							placeholder="time" />
					</div>
					<div class="mb-3">
						<label for="description" class="form-label">Description</label>
						<textarea
							v-model="data.description"
							class="form-control"
							id="description"
							rows="3"></textarea>
					</div>
					<div class="mb-3 d-flex justify-content-between">
						<!-- <router-link
							:to="{ name: 'appointment.list' }"
							custom
							v-slot="{ navigate }">
							<button
								class="btn btn-danger"
								@click="navigate"
								@keypress.enter="navigate"
								role="link">
								Back
							</button>
						</router-link> -->
						<button class="btn btn-danger" @click="this.$router.back()">
							Back
						</button>
						<!-- <button
							@click="updateAppointment"
							type="button"
							class="btn btn-primary">
							Update
						</button> -->
						<SubmitButton
							@click="updateAppointment"
							class="me-0"
							name="Update"
							:loading="submitting" />
					</div>
				</div>
			</div>
		</div>
	</template>
</template>

<script>
import SubmitButton from "../../components/Common/SubmitButton.vue"
import { useAppointmentStore } from "@/stores/appointment.js"
import { useAppStore } from "../../stores/app.js"
import VueMultiselect from "vue-multiselect"
import { cusFormatDate, cusFormatTime, dateForParams } from "../../helpers"
import { useDoctorStore } from "../../stores/doctor"
import { usePatientStore } from "../../stores/patient"
import { useTherapistStore } from "../../stores/therapist"
import { useNurseStore } from "../../stores/nurse"
import { useComissionStore } from "../../stores/comisson"
export default {
	setup() {
		const appointmentStore = useAppointmentStore()
		const patientStore = usePatientStore()
		const appStore = useAppStore()
		const doctorStore = useDoctorStore()
		const therapistStore = useTherapistStore()
		const nurseStore = useNurseStore()
		const comissionStore = useComissionStore()

		return {
			appointmentStore,
			appStore,
			doctorStore,
			patientStore,
			therapistStore,
			nurseStore,
			comissionStore,
		}
	},
	props: ["id"],
	data() {
		return {
			therapistComissionAmount: 0,
			isLoading: true,
			submitting: false,
			appointment: {},
			doctors: [],
			selectDoctor: "doctor",
			selectedDoctor: {},
			patients: [],
			therapists: [],
			nurses: [],
			selectedPatient: {},
			selectedTherapist: {},
			selectedNurse: {},
			data: {},
		}
	},
	components: {
		VueMultiselect,
		SubmitButton,
	},
	methods: {
		updateSelectedDoctor(e) {
			this.selectedDoctor = { ...e }
		},
		updateSelectedPatient(e) {
			this.selectedPatient = { ...e }
		},
		updateSelectedTherapist(e) {
			this.selectedTherapist = { ...e }
		},
		updateSelectedNurse(e) {
			this.selectedNurse = { ...e }
		},
		resetSelectedDoctorOrTherapist() {
			this.selectedDoctor = {}
			this.selectedTherapist = {}
		},
		setData() {
			this.data.name = this.appointment.relatedPatient.name
			this.selectedDoctor = this.appointment.relatedDoctor
			this.selectedPatient = this.appointment.relatedPatient
			// if (this.appointment.relatedNurse) {
			// 	this.selectedNurse = this.appointment.relatedNurse
			// }
			if (this.appointment.relatedTherapist) {
				this.selectedTherapist = this.appointment.relatedTherapist
				this.selectDoctor = "Therapist"
			}
			this.data.phone = this.appointment.phone
			this.data.date = cusFormatDate(this.appointment.originalDate)
			this.data.time = cusFormatTime(this.appointment.originalDate)
			this.data.description = this.appointment.description
		},
		prepareCommisionForm() {
			// let role = ['master','supervisor','saleOnly','cashier','MD','doctor']
			let data = {
				totalAmount: +this.$route.query.totalAmount,
				treatmentTimes: +this.$route.query.treatmentTimes,
				appointmentID: this.id,
				doctorID: this.selectedDoctor._id,
				treatmentSelectId: this.$route.query.treatmentSelectionId,
			}
			// if (this.selectedNurse._id) {
			// 	data.nurseID = this.selectedNurse._id
			// }
			if (this.selectedTherapist._id) {
				data.therapistID = this.selectedTherapist._id
				data.therapistComissionAmount = this.therapistComissionAmount
			}
			return data
		},
		prepareForm() {
			let formJson = {
				// isDeleted: false,
				// relatedTreatmentSelection: this.appointment.relatedTreatmentSelection.map(
				//   (each) => each._id
				// ),

				id: this.id,
				relatedPatient: this.selectedPatient._id,
				relatedDoctor: this.selectedDoctor._id,
				originalDate: dateForParams(this.data.date + "T" + this.data.time),
				phone: this.data.phone,
				treatmentSelectId: this.$route.query.treatmentSelectionId,
				description: this.data.description,
				date: this.data.date,
				time: this.data.time,
			}

			// if (Object.keys(this.selectedNurse).length > 0)
			// 	formJson.relatedNurse = this.selectedNurse._id
			if (Object.keys(this.selectedTherapist).length > 0)
				formJson.relatedTherapist = this.selectedTherapist._id

			return formJson
		},
		validateForm(payload) {
			if (!this.data.date) {
				this.appStore.showError({ message: "Appointment Date is required" })
				return false
			}
			console.log(this.data.time)
			if (!this.data.time) {
				this.appStore.showError({ message: "Appointment time is required" })
				return false
			}
			return true
		},
		async updateAppointment() {
			this.submitting = true
			if (!this.validateForm()) {
				this.submitting = false
				return
			}
			let formJson = this.prepareForm()
			let commisionForm = this.prepareCommisionForm()
			// console.log(JSON.stringify(formJson))
			console.log(formJson)
			try {
				let res = await this.appointmentStore.updateAppointment(formJson)
				if (res) {
					if (
						this.$route.query.treatmentTimes &&
						this.$route.query.totalAmount
					) {
						console.log(commisionForm)

						let comissionRes = await this.comissionStore.calculateComission(
							commisionForm
						)

						console.log(comissionRes)
					}

					console.log(res)
					this.appStore.showSuccess()
					this.appointment = res.data
					this.setData()
				}
			} catch (err) {
				console.log(err)
				if (err?.response?.data?.message) {
					this.appStore.showError({ message: err.response.data.message })
				} else {
					this.appStore.showError()
				}
			} finally {
				this.submitting = false
			}
		},
	},
	async mounted() {
		console.log(this.$route.query)

		try {
			let appointmentRes = await this.appointmentStore.fetchAppointment({
				id: this.id,
			})
			this.appointment = appointmentRes.data[0]

			let doctorRes = await this.doctorStore.fetchDoctors()
			this.doctors = doctorRes.data

			let therapistsRes = await this.therapistStore.fetchTherapists()
			this.therapists = therapistsRes.data

			let nurseRes = await this.therapistStore.fetchNurses()
			console.log(nurseRes.list)
			this.nurses = nurseRes.list
			// let nurseRes = await this.nurseStore.fetchNurses()
			// this.nurses = nurseRes.data

			let patientsRes = await this.patientStore.fetchPatients()
			this.patients = patientsRes.list
			// conosle.log(this.selectedNurse)

			this.setData()
		} catch (error) {
			console.log(error)
		} finally {
			this.isLoading = false
		}
	},
}
</script>

<style lang="scss" scoped></style>
