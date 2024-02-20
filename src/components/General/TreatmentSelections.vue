<template>
	<div class="table-responsive">
		<h4 class="mb-3">Treatment Selections</h4>
		<table class="table">
			<thead>
				<tr>
					<th scope="col" class="text-nowrap">#</th>
					<th scope="col" class="text-nowrap">Voucher Code</th>
					<th scope="col" class="text-nowrap">Treatment</th>
					<th scope="col" class="text-nowrap">Payment Method</th>
					<th scope="col" class="text-nowrap">Status</th>
					<th scope="col" class="text-nowrap">Times</th>
					<th scope="col" class="text-nowrap">Total Amount</th>
					<th scope="col" class="text-nowrap">Left-Over Amount</th>
					<th scope="col" class="text-nowrap">PerAppointment Price</th>
					<th scope="col" class="text-nowrap">Actual Revenue</th>
					<th scope="col" class="text-nowrap">Defer Revenue</th>

					<th scope="col" class="text-nowrap">Action</th>
				</tr>
			</thead>
			<tbody>
				<template v-for="(selection, index) in selections">
					<!-- <template v-if="selection.multiTreatment.length > 0">
            <template v-for="(each) in selection.multiTreatment">
              <tr style="border-color: transparent">
                <td>{{ index + 1 }}</td>
                <td>{{ each.item_id.name }}</td>
                <td v-if="selection.paymentMethod !== 'FOC'">
                  <span class="badge rounded-pill" :class="{
                    'bg-success': selection.paymentMethod === 'Cash Down',
                    'bg-warning': selection.paymentMethod === 'Credit',
                    'bg-info': selection.paymentMethod === 'Advance'
                  }">
                    <template v-if="selection.paymentMethod === 'Cash Down'">
                      Paid
                    </template>
                    <template v-if="selection.paymentMethod === 'Credit'">
                      Partial
                    </template>
                    <template v-if="selection.paymentMethod === 'Advance'">
                      Patient Advance
                    </template>
                  </span>
                  <span v-if="selection.saleReturnFlag" class="badge rounded-pill bg-primary ms-1">Return</span>
                </td>
                <td v-else>
                  <span class="badge" style="background: rgb(2, 2, 128)">{{
                    selection.paymentMethod
                }}</span>
                </td>
                <td>{{ selection?.selectionStatus }}</td>
                <td>{{ each.item_id.treatmentTimes }}</td>
                <td>{{ each.item_id.sellingPrice }}</td>
                <td>{{ selection?.leftOverAmount }}</td>
                <td class="d-flex">
                  <router-link v-if="!selection.saleReturnFlag" :to="{
                    name: 'payment.treatment-selection-payment',
                    params: { patientId: patientId },
                    query: { treatmentSelectionId: selection._id },
                  }" custom v-slot="{ navigate }">
                    <button class="btn btn-primary" @click="navigate" @keypress.enter="navigate" role="link">
                      Payment
                    </button>
                  </router-link>
                  <button v-if="!selection.saleReturnFlag" type="button" @click="selectTreatmentSelection(index)"
                    class="btn btn-success ms-3" data-bs-toggle="modal" data-bs-target="#treatmentReturn">
                    Return
                  </button>
                </td>
              </tr>
            </template>
          </template> -->
					<tr
						:class="{
							'rowborder-bottom': selection?.relatedAppointments?.length == 0,
							'border-transparent': selection?.relatedAppointments?.length != 0,
						}">
						<td>{{ index + 1 }}</td>
						<td>{{ selection?.VoucherCode || "-" }}</td>
						<td>{{ selection?.relatedTreatment?.name }}</td>
						<td v-if="selection.paymentMethod !== 'FOC'">
							<span
								class="badge rounded-pill"
								:class="{
									'bg-success': selection.paymentMethod === 'Cash Down',
									'bg-warning': selection.paymentMethod === 'Credit',
									'bg-info': selection.paymentMethod === 'Advance',
								}">
								<template v-if="selection.paymentMethod === 'Cash Down'">
									Paid
								</template>
								<template v-if="selection.paymentMethod === 'Credit'">
									Partial
								</template>
								<template v-if="selection.paymentMethod === 'Advance'">
									Patient Advance
								</template>
							</span>
							<span
								v-if="selection.saleReturnFlag"
								class="badge rounded-pill bg-primary ms-1"
								>Return</span
							>
						</td>
						<td v-else>
							<span class="badge" style="background: rgb(2, 2, 128)">{{
								selection.paymentMethod
							}}</span>
						</td>
						<td>{{ selection?.selectionStatus }}</td>
						<td>
							{{
								selection?.treatmentTimes ??
								selection?.relatedTreatment?.treatmentTimes
							}}
						</td>
						<td>{{ selection?.totalAmount }}</td>
						<td>{{ selection?.leftOverAmount ?? 0 }}</td>
						<td>{{ selection?.perAppointmentPrice ?? 0 }}</td>
						<td>{{ selection?.actualRevenue ?? 0 }}</td>
						<td>{{ selection?.deferRevenue ?? 0 }}</td>
						<td class="d-flex">
							<template
								v-if="
									!selection.relatedAppointments ||
									selection.relatedAppointments?.length <= 0
								">
								<button
									class="btn btn-primary me-3"
									@click="
										genereateAppointments(
											selection.relatedTreatment,
											selection._id
										)
									">
									Generate Appointments
								</button>
							</template>
							<router-link
								v-if="!selection.saleReturnFlag"
								:to="{
									name: 'payment.treatment-selection-payment',
									params: { patientId: patientId },
									query: { treatmentSelectionId: selection._id },
								}"
								custom
								v-slot="{ navigate }">
								<button
									class="btn btn-primary"
									@click="navigate"
									@keypress.enter="navigate"
									role="link">
									Payment
								</button>
							</router-link>
							<!-- <button v-if="isAppointmentExist(selection)" type="button" @click="selectTreatmentSelection(index)" class="btn btn-success ms-3" data-bs-toggle="modal" data-bs-target="#treatmentReturn">
                Return
              </button> -->
							<button
								v-if="
									!selection.saleReturnFlag && selection.tsType !== 'TSMulti'
								"
								type="button"
								@click="selectTreatmentSelection(index)"
								class="btn btn-success ms-3"
								data-bs-toggle="modal"
								data-bs-target="#treatmentReturn">
								Return
							</button>
							<button
								v-if="!selection.saleReturnFlag"
								type="button"
								:disabled="selection.isDone"
								@click="selectionDone(selection)"
								class="btn btn-success ms-3">
								Done
							</button>
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
															<th scope="col" class="text-nowrap">Phone</th>
															<th scope="col" class="text-nowrap">Date</th>
															<th scope="col">Doctor Name</th>
															<th scope="col">Therapist Name</th>
															<th scope="col" class="text-nowrap">Status</th>
															<th scope="col">Action</th>
														</tr>
													</thead>
													<tbody>
														<template
															v-for="(
																relatedAppointment, index
															) in selection?.relatedAppointments">
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
																		relatedAppointment?.relatedDoctor?.name ??
																		"N/A"
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
																			'bg-success': relatedAppointment?.status,
																			'bg-warning': !relatedAppointment?.status,
																		}">
																		{{
																			relatedAppointment?.status
																				? "Finished"
																				: "Ongoing"
																		}}
																	</div>
																</td>
																<td>
																	<router-link
																		:to="{
																			name: 'procedure-history.create',
																			query: {
																				treatmentSelectionId: selection._id,
																				appointmentId: relatedAppointment._id,
																				patientId:
																					relatedAppointment.relatedPatient,
																			},
																		}"
																		custom
																		v-slot="{ navigate }">
																		<button
																			class="btn btn-primary"
																			@click="navigate"
																			@keypress.enter="navigate"
																			role="link">
																			<i class="bi bi-plus-lg"></i> Procedure
																			History
																		</button>
																	</router-link>
																	<template v-if="!relatedAppointment.status">
																		<router-link
																			v-if="!relatedAppointment.isCommissioned"
																			:to="{
																				name: 'appointment.edit',
																				params: { id: relatedAppointment._id },
																				query: {
																					totalAmount: selection.totalAmount,
																					treatmentTimes:
																						selection.treatmentTimes ??
																						selection?.relatedTreatment
																							?.treatmentTimes,
																					treatmentSelectionId: selection._id,
																				},
																			}"
																			class="btn btn-warning ms-3">
																			Comission
																		</router-link>
																		<router-link
																			:to="{
																				name: 'appointment.edit',
																				params: { id: relatedAppointment._id },
																			}"
																			class="btn btn-warning ms-3">
																			Edit
																		</router-link>
																		<button
																			@click="
																				finishAppointment(
																					relatedAppointment._id,
																					selection._id,
																					relatedAppointment.relatedPatient
																				)
																			"
																			class="ms-3 btn btn-primary">
																			Finish
																		</button>
																	</template>
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
							<!-- <div class="my-3">
                <router-link
                  :to="{ name: 'sale.medicine', query: { patientId: patientId } }"
                  custom
                  v-slot="{ navigate }"
                >
                  <button
                    class="btn btn-outline-primary"
                    @click="navigate"
                    @keypress.enter="navigate"
                    role="link"
                  >
                    Medicine Sale
                  </button>
                </router-link>
              </div> -->
						</td>
					</tr>
				</template>
				<tr v-if="selections && selections.length <= 0">
					<td colspan="11" class="text-center">No selection exist!</td>
				</tr>
			</tbody>
		</table>
	</div>

	<!-- <TreatmentReturn :selection="selectedSelection" /> -->
</template>

<script>
import { cusFormatDate } from "@/helpers/index"
import { useAppointmentStore } from "../../stores/appointment"
import TreatmentReturn from "./TreatmentReturn.vue"
import { useTreatmentSelectionStore } from "../../stores/treatmentSelection"
import { useAppStore } from "../../stores/app"
export default {
	setup() {
		const appointmentStore = useAppointmentStore()
		const appStore = useAppStore()
		const treatmentSelectionStore = useTreatmentSelectionStore()
		return {
			appointmentStore,
			treatmentSelectionStore,
			appStore,
		}
	},
	data() {
		return {
			selectedSelection: {},
		}
	},
	props: ["selections", "patientId"],
	methods: {
		cusFormatDate,
		genereateAppointments(treatment, treatmentSelectionId) {
			this.$emit(
				"openAppointmentGenereateModal",
				treatment,
				treatmentSelectionId,
				"treatment"
			)
		},
		async selectionDone(data) {
			try {
				let payload = {
					relatedPatient: data.relatedPatient,
					relatedTreatmentSelection: data._id,
				}
				let res = await this.treatmentSelectionStore.treatmentSelectionDone(
					payload
				)
				console.log(res)
				console.log(payload)
				this.$emit("updateTreatmentDone", data._id)
				this.appStore.showSuccess()
			} catch (error) {
				console.log(error)
				this.appStore.showError()
			} finally {
			}
		},
		changeSelectionStatus() {
			this.selections.map(e => {
				if (e.isDone) {
					e.selectionStatus = "Done"
				} else {
					let filterArr = e.relatedAppointments.filter(i => {
						return !i.status
					})
					if (filterArr.length > 0) {
						e.selectionStatus = "Ongoing"
					} else {
						e.selectionStatus = "Done"
					}
				}
			})
		},
		isAppointmentExist(selection) {
			let returnValue = false
			selection.relatedAppointments.map(each => {
				console.log(each)
				if (!each.status) returnValue = true
			})
			return returnValue
		},
		async finishAppointment(appointmentId, treatmentSelectId, patientId) {
			let updateAppointmentRes = await this.appointmentStore.updateAppointment({
				id: appointmentId,
				treatmentSelectId,
				status: true,
				relatedPatient: patientId,
			})
			console.log(updateAppointmentRes)
			this.$emit(
				"updateRelatedAppointment",
				updateAppointmentRes.data,
				treatmentSelectId
			)
			this.changeSelectionStatus()
		},
		selectTreatmentSelection(selectionIndex) {
			this.$emit("updateSelectedSelection", selectionIndex)
		},
	},
	components: { TreatmentReturn },
	// mounted: function () {
	// 	console.log("hello", this)
	// },
	mounted() {
		console.log("hello", this.selections)
		this.changeSelectionStatus()
	},
}
</script>

<style lang="scss" scoped>
.rowborder-bottom {
	border-bottom: 1px solid #dee2e6;
}

.border-transparent {
	border-color: transparent;
}
</style>
