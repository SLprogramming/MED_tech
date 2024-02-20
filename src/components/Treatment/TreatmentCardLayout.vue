<template>
	<div class="row g-5">
		<div class="col-6" v-for="treatment in treatments">
			<div class="card rounded shadow-sm border-0 h-100">
				<div class="card-body">
					<div class="d-flex mb-2 justify-content-between align-items-center">
						<h5 class="card-title mb-2">
							{{ treatment.name }}
							- {{ treatment.treatmentCode }}({{ treatment.treatmentTimes }})
						</h5>
					</div>
					<h6 class="card-title fw-bold mb-3" v-if="treatment.relatedDoctor">
						Doctor - {{ treatment.relatedDoctor?.name }}
					</h6>
					<h6 class="card-title fw-bold mb-3" v-if="treatment.relatedTherapist">
						Thraphist - {{ treatment.relatedTherapist?.name }}
					</h6>
					<div class="accordion mb-4 border" id="accordionExample">
						<div
							class="accordion-item border-0"
							v-if="
								treatment.procedureMedicine &&
								treatment.procedureMedicine.length > 0
							">
							<h2 class="accordion-header" id="headingOne">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									:data-bs-target="'#procedureMedicine' + treatment._id"
									aria-expanded="false"
									:aria-controls="'procedureMedicine' + treatment._id">
									Procedure Medicine Detail
								</button>
							</h2>
							<div
								:id="'procedureMedicine' + treatment._id"
								class="accordion-collapse collapse"
								aria-labelledby="headingOne"
								data-bs-parent="#accordionExample">
								<div class="accordion-body">
									<table class="table table-borderless">
										<tbody>
											<tr v-for="medicines in treatment.procedureMedicine">
												<td>{{ medicines.item_id?.procedureItemName }}</td>
												<td>{{ medicines.perUsageQTY }} (Qty)</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div
							class="accordion-item border-0"
							v-if="
								treatment.medicineLists && treatment.medicineLists.length > 0
							">
							<h2 class="accordion-header" id="headingTwo">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									:data-bs-target="'#medicine' + treatment._id"
									aria-expanded="false"
									:aria-controls="'medicine' + treatment._id">
									Medicine Detail
								</button>
							</h2>
							<div
								:id="'medicine' + treatment._id"
								class="accordion-collapse collapse"
								aria-labelledby="headingTwo"
								data-bs-parent="#accordionExample">
								<div class="accordion-body">
									<table class="table table-borderless">
										<tbody>
											<tr v-for="medicines in treatment.medicineLists">
												<td>{{ medicines.item_id?.medicineItemName }}</td>
												<td>{{ medicines.perUsageQTY }} (Qty)</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div
							class="accordion-item border-0"
							v-if="
								treatment.procedureAccessory &&
								treatment.procedureAccessory.length > 0
							">
							<h2 class="accordion-header" id="headingProcedureAccessory">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									:data-bs-target="'#procedureAccessory' + treatment._id"
									aria-expanded="false"
									:aria-controls="'procedureAccessory' + treatment._id">
									Procedure Accessory Detail
								</button>
							</h2>
							<div
								:id="'procedureAccessory' + treatment._id"
								class="accordion-collapse collapse"
								aria-labelledby="headingProcedureAccessory"
								data-bs-parent="#accordionExample">
								<div class="accordion-body">
									<table class="table table-borderless">
										<tbody>
											<tr v-for="medicines in treatment.procedureAccessory">
												<td>{{ medicines.item_id?.accessoryItemName }}</td>
												<td>{{ medicines.perUsageQTY }} (Qty)</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
						<div
							class="accordion-item border-0"
							v-if="treatment.machine && treatment.machine.length > 0">
							<h2 class="accordion-header" id="headingMachine">
								<button
									class="accordion-button collapsed"
									type="button"
									data-bs-toggle="collapse"
									:data-bs-target="'#machine' + treatment._id"
									aria-expanded="false"
									:aria-controls="'machine' + treatment._id">
									Machine Item Detail
								</button>
							</h2>
							<div
								:id="'machine' + treatment._id"
								class="accordion-collapse collapse"
								aria-labelledby="headingMachine"
								data-bs-parent="#accordionExample">
								<div class="accordion-body">
									<table class="table table-borderless">
										<tbody>
											<tr v-for="machines in treatment.machine">
												<td>{{ machines.item_id?.name }}</td>
												<td>{{ machines.perUsageQTY }} (Qty)</td>
												<td>unit ?</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<h6 class="card-subtitle mb-2 fw-bold">
						Price - {{ treatment.sellingPrice }}MMK( {{ treatment.discount }}% )
					</h6>
					<p class="card-text">{{ treatment.description }}</p>
					<!-- <div class="form-check form-switch">
              <input
                class="form-check-input"
                :checked="treatment.status"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label class="form-check-label" for="flexSwitchCheckDefault">{{
                treatment.status ? "Available" : "Non Available"
              }}</label>
            </div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted } from "vue"

const props = defineProps(["treatments"])

onMounted(() => {
	console.log(props.treatments)
})
</script>

<style lang="scss" scoped></style>
