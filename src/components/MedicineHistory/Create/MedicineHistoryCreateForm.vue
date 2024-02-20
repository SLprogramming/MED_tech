<template>
	<form ref="historyForm" @submit.prevent="">
		<div class="row">
			<div class="col-6">
				<div class="mb-3">
					<label class="form-label">Skin Care & Cosmetic</label>
					<div class="d-flex gap-3">
						<VueMultiselect
							:model-value="selectedCosmetic"
							@update:model-value="updateSelectedCosmetic"
							:options="cosmetics"
							:searchable="true"
							:close-on-select="false"
							:allow-empty="false"
							:option-height="31"
							label="item"
							placeholder="Select Items"
							track-by="item" />
						<button
							@click="addSelectedCosmetics"
							type="button"
							class="btn btn-primary">
							<i class="bi bi-plus-lg"></i>
						</button>
					</div>
				</div>
				<div class="row" v-if="selectedCosmetics.length > 0">
					<h5 class="mb-3">Selected Cosmetics</h5>
					<div class="col-12">
						<div
							class="row mb-3"
							v-for="(cosmetic, index) in selectedCosmetics">
							<div class="col">
								<input
									type="text"
									class="form-control"
									:value="cosmetic.item"
									disabled />
							</div>
							<div class="col">
								<input
									type="text"
									class="form-control"
									v-model="cosmetic.remark" />
							</div>
							<div class="col">
								<button
									type="button"
									@click="removeSelectedCosmetics(index)"
									class="btn btn-danger">
									<i class="bi bi-dash"></i>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="drug" class="form-label">Drug</label>
				<input
					v-model="history.drug"
					type="text"
					class="form-control"
					id="drug" />
			</div>
			<div class="col">
				<label for="medical" class="form-label">Medical History</label>
				<input
					v-model="history.medical"
					type="text"
					class="form-control"
					id="medical" />
			</div>
		</div>
		<div class="row mb-3">
			<div class="col">
				<label for="allergy" class="form-label">Allergy history</label>
				<input
					v-model="history.allergy"
					type="text"
					class="form-control"
					id="allergy" />
			</div>
			<div class="col">
				<label for="treatment" class="form-label">Treatment History</label>
				<input
					v-model="history.treatment"
					type="text"
					class="form-control"
					id="treatment" />
			</div>
		</div>
		<div class="row mb-3">
			<div class="col-6">
				<label for="lmp" class="form-label">LMP</label>
				<input
					v-model="history.lmp"
					type="date"
					class="form-control"
					id="lmp" />
			</div>
			<div class="col-6">
				<label for="desiredTreatment" class="form-label"
					>Desired Treatment</label
				>
				<input
					v-model="history.desiredTreatment"
					type="text"
					class="form-control"
					id="desiredTreatment" />
			</div>
		</div>
		<div class="row mb-3">
			<div class="col-6">
				<label for="note" class="form-label">Notes</label>
				<textarea
					rows="3"
					id="note"
					v-model="history.note"
					class="form-control"></textarea>
			</div>
			<div class="col-6">
				<label for="complaint" class="form-label">Complaint</label>
				<textarea
					rows="3"
					v-model="history.complaint"
					class="form-control"></textarea>
			</div>
		</div>
		<div class="row">
			<div class="col-6">
				<template v-if="existedConsent">
					<h4 class="mb-4">Image</h4>
					<div class="mb-3">
						<div class="w-100 p-3 border h-100">
							<img
								:src="getImage(existedConsent)"
								style="height: 400px"
								class="patient-img bg-white w-100"
								alt="" />
						</div>
					</div>
				</template>
				<label for="consent" class="form-label">Consent File</label>
				<input type="file" id="consent" name="consent" class="form-control" />
			</div>
		</div>
		<div class="text-end">
			<!-- <button
				v-if="isUpdate"
				type="button"
				@click="updateMedicineHistory"
				class="btn btn-success">
				Update
			</button> -->
			<!-- <button
				v-if="!isUpdate"
				type="button"
				@click="createMedicineHistory"
				class="btn btn-primary">
				Submit
			</button> -->
			<SubmitButton v-if="isUpdate" class="btn btn-success" @click="updateMedicineHistory" name="Update" :loading="submitting" />
			<SubmitButton v-if="!isUpdate" class="btn btn-primary" @click="createMedicineHistory" name="Create" :loading="submitting" />
		</div>
	</form>
</template>

<script>
import { useMedicineHistoryStore } from "@/stores/medicineHistory.js"
import { useAppStore } from "@/stores/app"
import VueMultiselect from "vue-multiselect"
import { cusFormatDate, getImage } from "../../../helpers"
import SubmitButton from "../../Common/SubmitButton.vue"
export default {
	setup() {
		const medicineHistoryStore = useMedicineHistoryStore()
		const appStore = useAppStore()
		return {
			appStore,
			medicineHistoryStore,
		}
	},
	props: ["payload"],
	components: {
    VueMultiselect,
    SubmitButton
},
	data() {
		return {
      isUpdate: false,
      submitting: false,
			history: {
				complaint: "",
				consent: null,
				allergy: "",
				drug: "",
				medical: "",
				treatment: "",
				desiredTreatment: "",
				note: "",
			},
			existedConsent: null,
			cosmetics: [
				{
					item: "Facial Cleanser",
					remark: "",
				},
				{
					item: "Toner",
					remark: "",
				},
				{
					item: "Sunscreen",
					remark: "",
				},
				{
					item: "Others",
					remark: "",
				},
				{
					item: "Scrub",
					remark: "",
				},
				{
					item: "Mask",
					remark: "",
				},
				{
					item: "Foundation",
					remark: "",
				},
				{
					item: "MUR",
					remark: "",
				},
			],
			selectedCosmetic: {},
			selectedCosmetics: [],
		}
	},
	methods: {
		getImage,
		updateSelectedCosmetic(e) {
			this.selectedCosmetic = { ...e }
		},
		addSelectedCosmetics() {
			let alreadyExist = this.selectedCosmetics.findIndex(
				cosmetic => cosmetic.item === this.selectedCosmetic.item
			)

			if (
				alreadyExist === -1 &&
				Object.keys(this.selectedCosmetic).length > 0
			) {
				this.selectedCosmetics.push(this.selectedCosmetic)
			}
		},
		removeSelectedCosmetics(index) {
			this.selectedCosmetics = this.selectedCosmetics.filter(
				(cosmetic, itemIndex) => itemIndex !== index
			)
		},
		prepareForm() {
			const consent = document.querySelector("#consent").files[0]
			// let data = {
			  // skinCareAndCosmetic: this.selectedCosmetics,
			  // drugHistory: this.history.drug,
			  // medicalHistory: this.history.medical,
			  // allergyHistory: this.history.allergy,
			  // treatmentHistory: this.history.treatment,
			  // complaint: this.history.complaint,
			  // relatedPatient: this.$route.query.patientId,
			  // consent: consent
			// };

			const form = new FormData()
			if (this.selectedCosmetics.length > 0)
				form.append(
					"skinCareAndCosmetic",
					JSON.stringify(this.selectedCosmetics)
				)
			if (this.history.drug && this.history.drug.trim().length > 0)
				form.append("drugHistory", this.history.drug)
			if (this.history.medical && this.history.medical.trim().length > 0)
				form.append("medicalHistory", this.history.medical)
			if (this.history.allergy && this.history.allergy.trim().length > 0)
				form.append("allergyHistory", this.history.allergy)
			if (this.history.treatment && this.history.treatment.trim().length > 0)
				form.append("treatmentHistory", this.history.treatment)
			if (this.history.complaint && this.history.complaint.trim().length > 0)
				form.append("complaint", this.history.complaint)
			form.append("relatedPatient", this.$route.query.patientId)
			if (consent) {
				form.append("consent", consent)
			}
			if (this.history.lmp) form.append("lmp", this.history.lmp)
			if (
				this.history.desiredTreatment &&
				this.history.desiredTreatment.trim().length > 0
			)
				form.append("desiredTreatment", this.history.desiredTreatment)
			if (this.history.note && this.history.note.trim().length > 0)
				form.append("note", this.history.note)

        console.log(form.get('relatedPatient'))
			return form
		},
		resetForm() {
			this.history = {}
			this.selectedCosmetic = {}
			this.selectedCosmetics = []
		},
		async createMedicineHistory() {
      let data = this.prepareForm()
      this.submitting = true
			// for (const pair of data.entries()) {
			//   console.log(`${pair[0]}, ${pair[1]}`);
			// }
			// return console.log(data)
			try {
				let res = await this.medicineHistoryStore.createMedicineHistory(data)
				this.appStore.showSuccess()
				console.log(res)
				this.setData(res.data)
				this.$emit("updateMedicinePayload", res.data)
				this.isUpdate = true
			} catch (error) {
				console.log(error)
				this.appStore.showError()
      } finally {
        this.submitting = false
      }
		},
		async updateMedicineHistory() {
      this.submitting = true
			let data = this.prepareForm()
			// data.id = this.payload[0]._id;
      data.append("id", this.payload[0]._id)


			for (const pair of data.entries()) {
				console.log(`${pair[0]}, ${pair[1]}`)
			}
			// return console.log(data)
			try {
				let res = await this.medicineHistoryStore.updateMedicineHistory(data)
				console.log(res)
				this.appStore.showSuccess()
				this.setData(res.data)
				this.$emit("updateMedicinePayload", res.data)
			} catch (error) {
				console.log(error)
				this.appStore.showError()
      } finally {
        this.submitting = false
      }
		},
		setData(payload) {
			this.selectedCosmetics = payload.skinCareAndCosmetic ?? []
			this.history.drug = payload.drugHistory
			this.history.medical = payload.medicalHistory
			this.history.allergy = payload.allergyHistory
			this.history.treatment = payload.treatmentHistory
			this.history.complaint = payload.complaint
			this.history.desiredTreatment = payload.desiredTreatment
			if (payload.lmp) this.history.lmp = cusFormatDate(payload.lmp)
			this.history.note = payload.note
			this.existedConsent = payload.consent
		},
	},

	mounted() {
		if (this.payload.length > 0) {
			this.isUpdate = true
			this.setData(this.payload[0])
		}
	},
}
</script>

<style lang="scss" scoped></style>
