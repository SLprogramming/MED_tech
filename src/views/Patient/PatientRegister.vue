<template>
	<template v-if="isLoading">
		<Loading />
	</template>
	<template v-if="!isLoading">
		<div class="card p-3">
			<Heading class="mb-5" :payload="{ title: 'Patient Register' }" />

			<div class="row justify-content-center">
				<div class="col-8">
					<form @submit.prevent="register" ref="registerForm">
						<div class="row">
							<div class="col-6">
								<div class="mb-3">
									<label for="name" class="form-label">
										<div
											class="d-flex align-items-center justify-content-between">
											<span class="me-1">Name</span>
											<i class="bi bi-asterisk"></i>
										</div>
									</label>
									<input
										v-model="data.name"
										name="name"
										id="name"
										type="text"
										class="form-control"
										placeholder="Name"
										required />
								</div>
							</div>
							<div class="col-6">
								<div class="mb-3">
									<label for="age" class="form-label">
										<div
											class="d-flex align-items-center justify-content-between">
											<span class="me-1">Age</span>
											<i class="bi bi-asterisk"></i>
										</div>
									</label>
									<input
										v-model="data.age"
										name="age"
										id="age"
										type="text"
										class="form-control"
										placeholder="Age"
										required />
								</div>
							</div>
						</div>

						<div class="row">
							<div class="col-6">
								<div class="mb-3">
									<label class="form-label">
										<div
											class="d-flex align-items-center justify-content-between">
											<span class="me-1">Gender</span>
											<i class="bi bi-asterisk"></i>
										</div>
									</label>
									<div class="mb-3 border rounded p-3">
										<div class="d-flex gap-3">
											<div class="form-check">
												<input
													class="form-check-input"
													v-model="data.gender"
													value="Male"
													type="radio"
													name="gender"
													id="male"
													checked
													required />
												<label class="form-check-label" for="male">
													Male
												</label>
											</div>
											<div class="form-check">
												<input
													class="form-check-input"
													v-model="data.gender"
													value="Female"
													type="radio"
													name="gender"
													id="female"
													required />
												<label class="form-check-label" for="female">
													Female
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="col-6">
								<div class="mb-3">
									<label for="phone" class="form-label">
										<div
											class="d-flex align-items-center justify-content-between">
											<span class="me-1">Phone</span>
											<i class="bi bi-asterisk"></i>
										</div>
									</label>
									<input
										v-model="data.phone"
										id="phone"
										name="phone"
										type="text"
										class="form-control"
										placeholder="Phone"
										required />
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-6">
								<div class="mb-3">
									<label for="email" class="form-label">Email</label>
									<input
										v-model="data.email"
										id="email"
										name="email"
										type="email"
										class="form-control"
										placeholder="Email" />
								</div>
							</div>

							<div class="col-6">
								<div class="mb-3">
									<label for="address" class="form-label">
										<div
											class="d-flex align-items-center justify-content-between">
											<span class="me-1">Address (Township)</span>
											<i class="bi bi-asterisk"></i>
										</div>
									</label>
									<VueMultiselect
										:model-value="selectedTownship"
										@update:model-value="updateSelectedTownship"
										select-label=""
										:options="townships"
										:searchable="true"
										:close-on-select="true"
										:allow-empty="false"
										label="name"
										placeholder="Select one"
										track-by="name" />
								</div>
							</div>
						</div>

						<!-- <div class="row">
            <div class="mb-3">
              <label for="occupation" class="form-label">Occupation</label>
              <input
                v-model="data.occupation"
                id="occupation"
                name="occupation"
                type="text"
                class="form-control"
                placeholder="occupation"
                required
              />
            </div>
          </div> -->
						<div class="row mb-3">
							<div class="col-6">
								<label for="totalTreat" class="form-label"
									>Total Treatment</label
								>
								<input
									type="number"
									name="totalTS"
									v-model="totalTreatment"
									class="form-control"
									id="totalTreat" />
								<label for="UnfinishTreat" class="form-label mt-2"
									>Unfinish Treatment</label
								>
								<input
									type="number"
									name="unfinishedTS"
									v-model="unfinishTreatment"
									class="form-control"
									id="UnfinishTreat" />
								<label for="finishTreat" class="form-label mt-2"
									>Finish Treatment</label
								>
								<input
									type="number"
									name="finishedTS"
									v-model="finishTreatment"
									class="form-control"
									id="finishTreat" />
							</div>
							<div class="col-6">
								<label for="totalApp" class="form-label"
									>Total Appointments</label
								>
								<input
									type="number"
									name="totalAppointments"
									v-model="totalAppointment"
									class="form-control"
									id="totalApp" />
								<label for="UnfinishApp" class="form-label mt-2"
									>Unfinish Appointments</label
								>
								<input
									type="number"
									name="unfinishedAppointments"
									v-model="unfinishAppointment"
									class="form-control"
									id="UnfinishApp" />
								<label for="finishApp" class="form-label mt-2"
									>Finish Appointments</label
								>
								<input
									type="number"
									name="finishedAppointments"
									v-model="finishAppointment"
									class="form-control"
									id="finishApp" />
							</div>
						</div>
						<div class="row mb-3">
							<div class="col-6">
								<label for="img" class="form-label">Patient Image</label>
								<input type="file" class="form-control" name="img" id="img" />
							</div>
							<div class="col-6">
								<div class="mb-3">
									<label for="address" class="form-label">
										<div
											class="d-flex align-items-center justify-content-between">
											<span class="me-1">Debt</span>
										</div>
									</label>
									<input
										type="number"
										name="debtBalance"
										placeholder="0"
										class="form-control"
										v-model="data.debtBalance"
										id="" />
								</div>
							</div>
						</div>

						<div class="row mb-3">
							<div class="col-6">
								<label for="member" class="form-label">Member</label>
								<select
									v-model="selectedMember"
									class="form-select"
									aria-label="Default select example">
									<option disabled>Selecte Member</option>
									<option :value="each" v-for="each in members">
										{{ each.name }}
									</option>
								</select>
							</div>
						</div>

						<div class="row mb-3">
							<div class="col-6">
								<label for="member" class="form-label">Marital Status</label>
								<!-- <select v-model="selectedMarital" class="form-select" aria-label="Default select example">
                    <option disabled>Selecte Marital</option>
                    <option :value="each" v-for="each in marital">{{ each.name }}</option>
                  </select> -->
								<div class="form-check">
									<input
										class="form-check-input"
										v-model="selectedMarital"
										type="radio"
										:value="marital[0]"
										name="flexRadioDefault"
										id="singleMarital" />
									<label class="form-check-label" for="singleMarital">
										Single
									</label>
								</div>
								<div class="form-check">
									<input
										class="form-check-input"
										type="radio"
										v-model="selectedMarital"
										:value="marital[1]"
										name="flexRadioDefault"
										id="marriedMarital" />
									<label class="form-check-label" for="marriedMarital">
										Married
									</label>
								</div>
								<div class="form-check">
									<input
										class="form-check-input"
										type="radio"
										v-model="selectedMarital"
										:value="marital[2]"
										name="flexRadioDefault"
										id="naMarital" />
									<label class="form-check-label" for="naMarital"> N/A </label>
								</div>
							</div>
						</div>

						<div class="text-end">
							<SubmitButton name="Register" :loading="submitting" />
						</div>
					</form>
				</div>
			</div>
		</div>
	</template>
</template>

<script setup>
import VueMultiselect from "vue-multiselect"
import { onMounted, ref } from "vue"
import { usePatientStore } from "../../stores/patient"
import { useAppStore } from "../../stores/app"
import { useMemberStore } from "../../stores/member"
import SubmitButton from "../../components/Common/SubmitButton.vue"
import { townships } from "../../constants/township"
import { useRouter } from "vue-router"
import Loading from "../../components/Common/Loading.vue"

const selectedTownship = ref(null)

const updateSelectedTownship = e => {
	selectedTownship.value = { ...e }
}

const patientStore = usePatientStore()
const appStore = useAppStore()
const memberStore = useMemberStore()
const totalTreatment = ref(0)
const unfinishTreatment = ref(0)
const finishTreatment = ref(0)
const totalAppointment = ref(0)
const unfinishAppointment = ref(0)
const finishAppointment = ref(0)
const data = ref({
	debtBalance: 0,
})
const registerForm = ref(null)
const submitting = ref(false)
const isLoading = ref(true)
const router = useRouter()
const selectedMember = ref(null)
const selectedMarital = ref(null)
const marital = [
	{
		name: "Single",
		value: "Single",
	},
	{
		name: "Married",
		value: "Married",
	},
	{
		name: "N/A",
		value: "N/A",
	},
]
const members = ref([])

const prepareForm = () => {
	let formData = new FormData(registerForm.value)
	formData.delete("address")
	formData.append("address", selectedTownship.value.value)
	if (selectedMember.value)
		formData.append("relatedMember", selectedMember.value._id)
	if (selectedMarital.value)
		formData.append("maritalStatus", selectedMarital.value.value)
	return formData
}

const register = async () => {
	if (!selectedTownship.value) {
		return appStore.showError({
			message: "Please fill all the necessary field",
		})
	}

	let data = prepareForm()

	// for (const pair of data.entries()) {
	//   console.log(`${pair[0]}, ${pair[1]}`);
	// }
	// return
	submitting.value = true
	try {
		let res = await patientStore.createPatient(data)
		appStore.showSuccess()
		console.log(res)
		router.push({ name: "patient" })
	} catch (error) {
		appStore.showError()
		console.log(error)
	} finally {
		submitting.value = false
	}
}

onMounted(async () => {
	try {
		const memberRes = await memberStore.fetchMembers()
		console.log(memberRes)
		members.value = memberRes.list
	} catch (err) {
		console.log(err)
	} finally {
		isLoading.value = false
	}
})
</script>

<style lang="scss" scoped>
i::before {
	font-size: 10px;
	color: rgb(161, 7, 7);
}
</style>
