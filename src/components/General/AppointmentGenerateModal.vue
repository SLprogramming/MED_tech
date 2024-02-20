<template>
	<div
		class="modal fade"
		id="appointmentGenerateModal"
		tabindex="-1"
		aria-labelledby="appointmentGenerateModalLabel"
		aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="appointmentGenerateModalLabel">
						Appointment Genereate
					</h1>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<!-- {{ selectedPackageTreatmentSelection }}
           -->
					<div class="mb-3">
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
					<div class="mb-3">
						<label for="appointmentGenTreatmentTimes" class="form-label"
							>Treatment times</label
						>
						<input
							type="number"
							class="form-control"
							v-model="payload.treatmentTimes"
							id="appointmentGenTreatmentTimes" />
					</div>
					<div class="mb-3">
						<label for="appointmentGenOriginalDate" class="form-label"
							>Original Date</label
						>
						<input
							type="date"
							class="form-control"
							v-model="payload.originalDate"
							id="appointmentGenOriginalDate" />
					</div>
					<div class="mb-3" v-if="payload.treatmentTimes > 1">
						<label for="inBetweenDuration" class="form-label"
							>In Between Duration</label
						>
						<select
							v-model="payload.inBetweenDuration"
							class="form-select"
							aria-label="Select Duration">
							<option selected disabled>Select Duration</option>
							<option value="7">7</option>
							<option value="14">14</option>
							<option value="30">30</option>
						</select>
					</div>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						data-bs-dismiss="modal">
						Close
					</button>
					<button type="button" class="btn btn-primary" @click="submit">
						Genereate
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import VueMultiselect from "vue-multiselect"
import { usePackageSelectionStore } from "../../stores/packageSelection"
import { useAppStore } from "../../stores/app"
import { dateForParams } from "../../helpers/index"
export default {
	setup() {
		const packageSelectionStore = usePackageSelectionStore()
		const appStore = useAppStore()

		return {
			packageSelectionStore,
			appStore,
		}
	},
	components: {
		VueMultiselect,
	},
	data() {
		return {
			payload: {
				packageSelectionId: null,
				treatmentSelectionId: null,
				treatmentTimes: 0,
				inBetweenDuration: 7,
				originalDate: "",
			},
			selectedDoctor: {},
		}
	},
	props: {
		packageSelectionId: {
			default: null,
		},
		treatmentSelectionId: {
			default: null,
		},
		selectedPackageTreatmentSelection: {
			default: {},
		},
		selectedTreatment: {
			default: {},
		},
		patient: {
			required: true,
		},
		doctors: {
			required: true,
		},
	},
	watch: {
		selectedPackageTreatmentSelection(newValue, oldValue) {
			console.log(newValue)
			if (newValue) {
				this.setData(this.selectedPackageTreatmentSelection)
			}
		},
		selectedTreatment(newValue, oldValue) {
			console.log(newValue)
			if (newValue) {
				this.setData(this.selectedTreatment)
			}
		},
	},
	methods: {
		updateSelectedDoctor(e) {
			this.selectedDoctor = { ...e }
		},
		prepareForm() {
			let formdata = {
				totalAmount: this.selectedTreatment.sellingPrice,
				relatedPatient: this.patient._id,
				phone: this.patient.phone,
				relatedDoctor: this.selectedDoctor._id,
				originalDate: dateForParams(this.payload.originalDate),
				treatmentTimes: this.payload.treatmentTimes,
				inBetweenDuration: this.payload.inBetweenDuration,

				// relatedTreatment: this.selectedPackageTreatmentSelection._id
			}

			if (this.packageSelectionId) {
				formdata.relatedPackageSelection = this.packageSelectionId // if package selection
				formdata.relatedTreatment = this.selectedPackageTreatmentSelection._id
			} else if (this.treatmentSelectionId) {
				formdata.relatedTreatmentSelection = this.treatmentSelectionId // if treatment selection
				formdata.relatedTreatment = this.selectedTreatment._id
			}
			return formdata
		},
		async submit() {
			const formdata = this.prepareForm()
			console.log(formdata)
			try {
				let res = await this.packageSelectionStore.appointmentGenereate(
					formdata
				)
				console.log(res)
				this.appStore.showSuccess()
				if (this.packageSelectionId) {
					this.$emit(
						"updatePackageSelection",
						res,
						formdata.relatedTreatment,
						formdata.relatedPackageSelection
					)
				} else {
					this.$emit(
						"updateTreatmentSelection",
						res,
						formdata.relatedTreatment,
						formdata.relatedTreatmentSelection
					)
				}
			} catch (error) {
				this.appStore.showError()
				console.log(error)
			}
		},
		setData(payload) {
			if (this.packageSelectionId) {
				this.payload.treatmentTimes = payload.treatmentTimes
			} else {
				this.payload.treatmentTimes = payload.treatmentTimes
			}
		},
	},
}
</script>

<style lang="scss" scoped></style>
