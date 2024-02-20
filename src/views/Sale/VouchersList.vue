<template>
	<template v-if="isLoading">
		<Loading />
	</template>
	<template v-else>
		<div>
			<div class="card p-3">
				<Heading :payload="{ title: 'Vouchers List' }" class="mb-3" />
				<div class="mb-3 rounded p-3 border">
					<div class="d-flex mb-3">
						<div class="d-flex align-items-center me-3">
							<label class="form-label me-3 mb-0">Start date</label>
							<input
								v-model="filter.startDate"
								type="date"
								class="form-control"
								style="width: 200px" />
						</div>
						<div class="d-flex align-items-center me-3">
							<label class="form-label me-3 mb-0">End date</label>
							<input
								v-model="filter.endDate"
								type="date"
								class="form-control"
								style="width: 200px" />
						</div>
						<div class="d-flex align-items-center gap-3 me-3">
							<label for="name" class="form-label mb-0 text-nowrap"
								>Voucher Type</label
							>
							<select
								v-model="filter.tsType"
								class="form-select"
								aria-label="Default select example">
								<option value="all">All</option>
								<option value="TS">Single Treatment</option>
								<option value="TSMulti">Multiple Treatment</option>
								<option value="MS">Medicine Sale</option>
								<option value="Combined">Combined</option>
								<option value="PS">Package Sale</option>
							</select>
						</div>
						<div class="d-flex align-items-center gap-3 me-3">
							<label for="name" class="form-label mb-0 text-nowrap"
								>Bank Type</label
							>
							<select
								v-model="filter.bankType"
								class="form-select"
								aria-label="Default select example">
								<option value="POS">POS</option>
								<option value="Normal">Normal</option>
								<option value="Pay">Pay</option>
							</select>
						</div>
					</div>
					<div class="mb-3 d-flex flex-wrap gap-3">
						<div class="d-flex align-items-center gap-3 me-3">
							<label for="name" class="form-label mb-0">Doctor</label>
							<VueMultiselect
								:model-value="filter.relatedDoctor"
								@update:model-value="updateSelectedFilterDoctor"
								:options="doctors"
								:searchable="true"
								:close-on-select="true"
								:allow-empty="false"
								:option-height="31"
								label="name"
								track-by="_id" />
						</div>
						<div class="d-flex align-items-center gap-3 me-3">
							<label for="name" style="width: 150px" class="form-label mb-0"
								>Sale Person</label
							>
							<VueMultiselect
								:model-value="filter.createdBy"
								@update:model-value="updateSelectedFilterUser"
								:options="users"
								:searchable="true"
								:close-on-select="true"
								:allow-empty="false"
								:option-height="31"
								label="givenName"
								track-by="_id" />
						</div>
						<div class="d-flex align-items-center gap-3 me-3">
							<label for="name" class="form-label mb-0">Patient</label>
							<VueMultiselect
								:model-value="filter.relatedPatient"
								@update:model-value="updateSelectedFilterPatient"
								:options="patients"
								:searchable="true"
								:close-on-select="true"
								:allow-empty="false"
								:option-height="31"
								label="name"
								track-by="_id" />
						</div>
						<div class="d-flex align-items-center gap-3 me-3">
							<label for="name" class="form-label mb-0 text-nowrap"
								>Bank Account</label
							>
							<select
								v-model="filter.bankID"
								class="form-select"
								aria-label="Default select example">
								<template v-for="(each, index) in bankAccounts" :key="index">
									<option :value="each._id">{{ each.name }}</option>
								</template>
							</select>
						</div>
						<div class="d-flex align-items-center gap-3 me-3">
							<label for="name" class="form-label mb-0 text-nowrap"
								>Purchase Type</label
							>
							<select
								v-model="filter.purchaseType"
								class="form-select"
								aria-label="purchase type select">
								<option value="Clinic">Aesthetic</option>
								<option value="Surgery">Surgery</option>
							</select>
						</div>
						<div class="d-flex align-items-center gap-3 me-3">
							<label for="name" class="form-label mb-0 text-nowrap"
								>Order By Code
							</label>
							<select
								v-model="orderBy"
								@change="changeOrder()"
								class="form-select"
								aria-label="purchase type select">
								<option value="ascending">Ascending</option>
								<option value="descending">Descending</option>
							</select>
						</div>
						<div class="d-flex align-items-center gap-3 me-3">
							<label for="name" class="form-label mb-0 text-nowrap"
								>Voucher Status
							</label>
							<select
								v-model="voucherStatus"
								@change="changeVoucherStatus()"
								class="form-select"
								aria-label="purchase type select">
								<option value="all">All</option>
								<option value="refund">Refund</option>
								<option value="nonrefund">Non Refund</option>
							</select>
						</div>
					</div>
					<hr />
					<div class="d-flex align-items-center gap-3">
						<input
							type="file"
							ref="excelImportFile"
							class="form-control"
							style="width: 300px"
							placeholder="excel file" />
						<button class="btn btn-primary" @click="excelImport">
							Excel Import
						</button>
					</div>
					<div class="d-flex align-items-center justify-content-end">
						<!-- <label for="exportType" class="form-label me-3">Export Type</label> -->
						<!-- <select
							name=""
							class="form-select me-3"
							style="max-width: 140px"
							v-model="exportType"
							id="exportType">
							<option value="voucher">Voucher</option>
							<option value="item">Item</option>
						</select> -->
						<div class="me-3">
							<input
								type="text"
								name=""
								class="form-control"
								id=""
								v-model="keyWordForVoucherCode"
								@change="search()"
								placeholder="Search By Code( need to hit enter )" />
						</div>

						<button class="btn btn-primary me-3" @click="exportList">
							Export
						</button>
						<button class="btn btn-primary me-3" @click="reload">Reload</button>
						<button
							class="btn btn-primary me-3"
							@click="fetchTreatmentVouchers">
							Filter
						</button>
						<button
							v-if="
								appStore.user.data.user.role == 'master' ||
								appStore.user.data.user.role == 'cashier'
							"
							type="button"
							class="btn btn-primary"
							@click="openRefundModal()"
							data-bs-toggle="modal"
							data-bs-target="#refundModal">
							Refund
						</button>
						<div
							id="refundModal"
							class="modal fade"
							tabindex="-1"
							aria-labelledby="refundmodal"
							aria-hidden="true">
							<div class="modal-dialog">
								<div class="modal-content">
									<div class="modal-header">
										<h5 class="modal-title" id="item_discountLabel">
											Refund Voucher
										</h5>
										<button
											type="button"
											class="btn-close"
											ref="modalCloseBtn"
											data-bs-dismiss="modal"
											aria-label="Close"></button>
									</div>
									<div class="modal-body">
										<div class="row">
											<div class="col">
												<label for="">Voucher Code</label>
												<VueMultiselect
													:model-value="selectedVoucher"
													@update:model-value="updateSelectedVoucher"
													:options="allVoucherListFilter"
													:searchable="true"
													:close-on-select="true"
													:allow-empty="false"
													:option-height="31"
													label="code"
													track-by="_id" />
											</div>
										</div>
										<div
											v-if="selectedVoucher?.appointmentStart"
											class="row my-2">
											<h5 class="col text-center text-warning">
												A Treatment is Already Start
											</h5>
										</div>
										<template
											v-if="
												selectedVoucher?.tsType == 'TSMulti' ||
												selectedVoucher?.tsType == 'TS'
											">
											<div class="table-responsive">
												<table
													class="table mt-2 table-responsive table-borderless table-striped">
													<thead>
														<tr>
															<th>#</th>
															<th style="max-width: 100px">Code</th>
															<th>Total Amount</th>
															<th>Used Amount</th>
															<th>Remain Amount</th>
															<th>Appointments</th>
														</tr>
													</thead>
													<tbody>
														<template
															v-if="
																selectedVoucher.relatedTreatmentSelection
																	.length > 0
															">
															<tr
																v-for="(
																	list, i
																) in selectedVoucher.relatedTreatmentSelection"
																:key="i">
																<td>{{ i + 1 }}</td>
																<td style="max-width: 100px">
																	{{ list.relatedTreatment.treatmentCode }}
																</td>
																<td>
																	{{ list.totalAmount }}
																</td>
																<td>
																	{{ Math.round(list.actualRevenue) }}
																</td>
																<td>
																	{{
																		list.relatedAppointments.length > 0
																			? Math.round(list.deferRevenue)
																			: "-"
																	}}
																</td>
																<td>
																	{{ list.relatedAppointments.length }}
																</td>
															</tr>
														</template>
													</tbody>
												</table>
											</div>
											<div class="d-flex justify-content-center mt-2 gap-5">
												<div>
													<label for="CashBack">Cash Back</label>
													<input
														type="radio"
														name="refundType"
														class="form-check-input ms-2"
														v-model="refundType"
														id="CashBack"
														value="CashBack" />
												</div>
												<div>
													<label for="treatment">Treatment</label>
													<input
														type="radio"
														name="refundType"
														class="form-check-input ms-2"
														v-model="refundType"
														id="treatment"
														value="Treatment" />
												</div>
											</div>
										</template>
										<div class="row mt-2">
											<div class="col">
												<label for="">Date</label>
												<input
													type="date"
													name=""
													id=""
													v-model="refundDate"
													class="form-control" />
											</div>
											<div class="col">
												<label for="">Remark</label>
												<input
													type="text"
													name=""
													v-model="refundRemark"
													class="form-control"
													id="" />
											</div>
										</div>
										<div v-if="refundType == 'CashBack'" class="row mt-2">
											<div class="col">
												<label for="">Refund Account</label>
												<select
													name=""
													class="form-select"
													v-model="refundAccType"
													id="">
													<option value="cash">Cash</option>
													<option value="bank">Bank</option>
												</select>
											</div>
											<div v-if="refundAccType == 'cash'" class="col">
												<label for="">Cash Account</label>
												<select
													name=""
													v-model="selectedCashAccount"
													class="form-select"
													id="">
													<option
														v-for="(acc, i) in cashAccounts"
														:key="i"
														:value="acc._id">
														{{ acc.name }}
													</option>
												</select>
											</div>
											<div v-if="refundAccType == 'bank'" class="col">
												<label for="">Bank Account</label>
												<select
													name=""
													v-model="selectedBankAccount"
													class="form-select"
													id="">
													<option
														v-for="(acc, i) in bankAccounts"
														:key="i"
														:value="acc._id">
														{{ acc.name }}
													</option>
												</select>
											</div>
										</div>
										<div class="row my-2">
											<div class="col">
												<label for="">Refund Amount</label>
												<input
													type="number"
													name=""
													v-model="refundAmount"
													class="form-control"
													id="" />
											</div>
											<div class="col"></div>
										</div>
										<div class="d-flex justify-content-end">
											<button
												v-if="refundType == 'CashBack'"
												class="btn btn-primary"
												@click="refund()">
												Done
											</button>
											<button
												v-else
												class="btn btn-primary"
												@click="goToTreatmentSale()">
												Treatment
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="mb-3 d-flex justify-content-center">
					<button
						class="btn me-3"
						:class="{ 'btn-primary': selectedTab == 'bank' }"
						@click="selectedTab = 'bank'">
						Bank {{ bankTotal ? formatNumber(bankTotal) : 0 }}
					</button>
					<button
						class="btn me-3"
						:class="{ 'btn-primary': selectedTab == 'cash' }"
						@click="selectedTab = 'cash'">
						Cash {{ cashTotal ? formatNumber(cashTotal) : 0 }}
					</button>
					<button
						class="btn"
						:class="{ 'btn-primary': selectedTab == 'all' }"
						@click="selectedTab = 'all'">
						all
					</button>
				</div>
				<div v-if="voucherStatus !== 'refund'">
					<template v-if="selectedTab == 'cash'">
						<div class="table-responsive">
							<table
								ref="vouchersTable"
								class="table table-hover table-striped">
								<thead>
									<tr>
										<th>#</th>
										<th>Date</th>
										<th>Code</th>
										<!-- <th>Sale By</th> -->
										<th>Customer Name</th>
										<th>Customer Phone</th>
										<th>Doctor</th>
										<th>Therapist</th>
										<th>Treatment</th>
										<th>Treatment Amount</th>
										<th>Medicine Amount</th>
										<th>Total Amount</th>
										<th>Paid Amount</th>
										<th>Second Paid Amount</th>
										<th>Balance</th>
										<th>Payment Method</th>
										<th>Payment Type</th>
										<th>Purchase Type</th>
										<!-- <th>Deposit</th> -->
										<!-- <th>Purchase Type</th> -->
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr
										@click="getDetail(item._id)"
										v-for="(item, index) in cashTableList"
										:key="'item' + item._id">
										<td>{{ index + 1 }}</td>
										<td>{{ cusFormatDate(item.createdAt) }}</td>
										<td>
											<span :class="{ 'text-danger': !item.code }">
												{{ item.code ?? "Not Set" }}
											</span>
										</td>
										<!-- <td>
											<span
												:class="{ 'text-danger': !item.createdBy?.givenName }">
												{{ item.createdBy?.givenName ?? "Not Set" }}</span
											>
										</td> -->
										<td>
											<span
												:class="{ 'text-danger': !item.relatedPatient?.name }">
												{{ item.relatedPatient?.name ?? "Not Set" }}
											</span>
										</td>
										<td>
											<span
												:class="{ 'text-danger': !item.relatedPatient?.phone }">
												{{ item.relatedPatient?.phone ?? "Not Set" }}
											</span>
										</td>
										<td>
											<!-- {{ item.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name ?? 'Not Set' }} -->
											<span
												:class="{ 'text-danger': !item.relatedDoctor?.name }">
												{{ item.relatedDoctor?.name ?? "-" }}
											</span>
										</td>
										<td>
											<!-- {{ item.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name ?? 'Not Set' }} -->
											<span
												:class="{
													'text-danger': !item.relatedTherapist?.name,
												}">
												{{ item.relatedTherapist?.name ?? "-" }}
											</span>
										</td>
										<template v-if="item.multiTreatment.length > 0">
											<td style="min-width: 300px; white-space: normal">
												<span
													:class="{
														'text-danger':
															!item.multiTreatment[0]?.item_id.name,
													}"
													>{{
														item.multiTreatment[0]?.item_id.name ?? "Not Set"
													}}</span
												>
											</td>
										</template>
										<template v-else>
											<td style="min-width: 300px; white-space: normal">
												<span
													:class="{
														'text-danger': !item?.relatedTreatment?.name,
													}"
													>{{ item?.relatedTreatment?.name ?? "Not Set" }}</span
												>
											</td>
										</template>

										<template v-if="item.tsType == 'MS'">
											<td>0</td>
											<td>
												{{ formatNumber(item.msGrandTotal) }}
											</td>
											<td>
												{{ formatNumber(item.msGrandTotal) }}
											</td>
											<td>
												{{ formatNumber(item.msPaidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item.msBalance)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'PS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedPackageSelection.totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedPackageSelection.totalAmount
														  )
												}}
											</td>
											<td>0</td>
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedPackageSelection.totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedPackageSelection.totalAmount
														  )
												}}
											</td>
											<td>
												{{
													formatNumber(item.relatedPackageSelection.paidAmount)
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item?.balance || 0)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'TSMulti'">
											<td>
												{{
													formatNumber(item.totalAmount - item.totalDiscount)
												}}
											</td>
											<td>0</td>
											<td>
												{{
													formatNumber(item.totalAmount - item.totalDiscount)
												}}
											</td>
											<td>
												{{
													item.totalPaidAmount
														? formatNumber(item.totalPaidAmount)
														: 0
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item?.balance || 0)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'TS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedTreatmentSelection[0].totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedTreatmentSelection[0].totalAmount
														  )
												}}
											</td>
											<td>0</td>
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedTreatmentSelection[0].totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedTreatmentSelection[0].totalAmount
														  )
												}}
											</td>
											<td>
												{{ formatNumber(item.paidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item.balance || 0)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'Combined'">
											<!-- for combine with multi treatment -->
											<template v-if="item.multiTreatment.length > 0">
												<td>{{ formatNumber(item.totalAmount) }}</td>
												<td>{{ formatNumber(item.msGrandTotal) }}</td>
												<td>
													{{
														formatNumber(
															item.msGrandTotal +
																(item.totalAmount - item.totalDiscount)
														)
													}}
												</td>
												<td>
													{{
														formatNumber(
															item.msPaidAmount + item.totalPaidAmount
														)
													}}
												</td>

												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{
														item.paymentMethod == "Paid"
															? 0
															: formatNumber(item.msBalance + item.balance)
													}}
												</td>
											</template>

											<!-- for combine with single treatment -->
											<template v-else>
												<td>
													{{
														formatNumber(
															item.relatedTreatmentSelection[0].totalAmount
														)
													}}
												</td>
												<td>{{ formatNumber(item.msGrandTotal) }}</td>
												<td>
													{{
														formatNumber(
															item.msGrandTotal +
																item.relatedTreatmentSelection[0].totalAmount
														)
													}}
												</td>
												<td>
													{{
														formatNumber(
															item.msPaidAmount +
																item.relatedTreatmentSelection[0].paidAmount
														)
													}}
												</td>
												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{
														item.paymentMethod == "Paid"
															? 0
															: formatNumber(item.msBalance + item.balance)
													}}
												</td>
											</template>
										</template>

										<td>
											{{ item.paymentMethod }}
										</td>
										<!-- <td v-if="item.paymentMethod === 'FOC'">FOC</td>
                    <td v-if="item.paymentMethod === 'Advanced'">Paid</td>
                    <td v-if="item.paymentMethod === 'by Appointment'">Partial</td>
                    <td v-else>Not Set</td> -->
										<!-- <td v-if="item.relatedCash">Cash</td>
                    <td v-if="!item.relatedCash">{{ item.paymentType ?? 'Not Set' }}</td> -->
										<td>
											<template
												v-if="
													item.paymentMethod === 'Advanced' ||
													item.relatedBank ||
													item.relatedCash
												">
												<template v-if="item.relatedCash"> Cash </template>
												<template v-if="item.relatedBank"> Bank </template>
											</template>
											<template v-else>
												{{ item.paymentType ?? "Not Set" }}
											</template>
										</td>
										<td>
											<template v-if="item.purchaseType === 'Clinic'">
												Aesthetic
											</template>
											<template v-else>
												{{ item.purchaseType ?? "Not Set" }}
											</template>
										</td>

										<!-- <td>{{ item.relatedTreatmentSelection.length > 0 ? item.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name : 'Not Set' }}</td> -->

										<!-- <td>
											<span
												:class="{
													'text-danger': !(item.deposit || item.deposit >= 0),
												}"
												>{{
													item.deposit >= 0 ? item.deposit : "Not Set"
												}}</span
											>
										</td> -->
										<!-- <td>{{ item.relatedTreatmentSelection.purchaseType ?? 'Not Set' }}</td> -->
										<!-- <td v-if="item.tsType === 'MS'">{{ item.msTotalAmount ?? 0 }}</td>
                    <td v-if="item.tsType !== 'MS'">{{ item.totalAmount ?? 0 }}</td> -->
										<!-- 
										<td>
											<template v-if="item.tsType === 'TSMulti'">
												<router-link
													:to="{
														name: 'sale.treatment',
														query: { voucherId: item._id },
													}"
													custom
													v-slot="{ navigate }">
													<button
														class="me-3 btn btn-warning"
														@click.stop="navigate"
														@keypress.enter="navigate"
														role="link">
														<i class="bi bi-pencil-square"></i>
													</button>
												</router-link>
											</template>
											<template v-if="item.tsType === 'MS'">
												<router-link
													:to="{
														name: 'sale.medicine',
														query: { voucherId: item._id },
													}"
													custom
													v-slot="{ navigate }">
													<button
														class="me-3 btn btn-warning"
														@click.stop="navigate"
														@keypress.enter="navigate"
														role="link">
														<i class="bi bi-pencil-square"></i>
													</button>
												</router-link>
											</template>

											<button
												class="me-3 btn btn-warning"
												@click.stop="
													goToPatientDetail(item.relatedPatient._id)
												">
												<i class="bi bi-person-vcard-fill"></i>
											</button>

											<button
												@click.stop="deleteVoucherList(item)"
												class="btn btn-danger"
												:disabled="isDeleting">
												<template v-if="isDeleting"> Deleting... </template>
												<template v-else>
													<i class="bi bi-trash"></i>
												</template>
											</button>
										</td> -->
										<td>
											<div
												class="dropdown"
												@click.stop="
													() => {
														console.log('click')
													}
												">
												<a
													class="btn btn-secondary dropdown-toggle"
													role="button"
													data-bs-toggle="dropdown"
													aria-expanded="false">
													Actions
												</a>

												<ul class="dropdown-menu">
													<!-- <li>
														<button
															@click.stop="deleteVoucherList(item)"
															class="dropdown-item text-danger fw-bold"
															:disabled="isDeleting">
															<i class="bi bi-trash"></i
															><template v-if="isDeleting">
																Deleting...</template
															><template v-else> Delete</template>
														</button>
													</li>
													<li><hr class="dropdown-divider" /></li> -->

													<li>
														<button
															class="dropdown-item text-info fw-bold"
															@click.stop="
																goToPatientDetail(item.relatedPatient._id)
															">
															<i class="bi bi-person-vcard-fill"></i> Patient
															Detail
														</button>
													</li>
													<li><hr class="dropdown-divider" /></li>
													<li>
														<button
															class="dropdown-item text-info fw-bold"
															@click.stop="
																goToDebtList(item.relatedPatient._id)
															">
															<i class="bi bi-credit-card-2-back"></i> Patient
															Debt List
														</button>
													</li>
													<li><hr class="dropdown-divider" /></li>
													<template v-if="item.repay.length > 0">
														<li>
															<button
																class="dropdown-item text-info fw-bold"
																@click.stop="goToRepayList(item.repay)">
																<i class="bi bi-credit-card-2-back"></i> Repay
																List
															</button>
														</li>
														<li><hr class="dropdown-divider" /></li>
													</template>
													<template
														v-if="
															appStore.user.data.user.role == 'supervisor' ||
															appStore.user.data.user.role == 'master'
														">
														<template v-if="item.tsType === 'TSMulti'">
															<li v-if="!item.Refund && item.editPermission">
																<router-link
																	:to="{
																		name: 'sale.treatment',
																		query: { voucherId: item._id },
																	}"
																	custom
																	v-slot="{ navigate }">
																	<button
																		class="dropdown-item text-info fw-bold"
																		@click.stop="navigate"
																		@keypress.enter="navigate"
																		role="link">
																		<i class="bi bi-pencil-square"></i> Edit
																	</button>
																</router-link>
															</li>
														</template>
														<template v-if="item.tsType === 'MS'">
															<li v-if="!item.Refund && item.editPermission">
																<router-link
																	:to="{
																		name: 'sale.medicine',
																		query: { voucherId: item._id },
																	}"
																	custom
																	v-slot="{ navigate }">
																	<button
																		class="dropdown-item text-info fw-bold"
																		@click.stop="navigate"
																		@keypress.enter="navigate"
																		role="link">
																		<i class="bi bi-pencil-square"></i> Edit
																	</button>
																</router-link>
															</li>
														</template>
													</template>
												</ul>
											</div>
										</td>
									</tr>
									<tr
										class="text-center"
										v-if="cashTableList && cashTableList.length <= 0">
										<td colspan="15">No record exist!</td>
									</tr>
								</tbody>
							</table>
						</div>
					</template>
					<template v-if="selectedTab == 'bank'">
						<div class="table-responsive">
							<table
								ref="vouchersTable"
								class="table table-hover table-striped">
								<thead>
									<tr>
										<th>#</th>
										<th>Date</th>
										<th>Code</th>
										<!-- <th>Sale By</th> -->
										<th>Customer Name</th>
										<th>Customer Phone</th>
										<th>Doctor</th>
										<th>Therapist</th>
										<th>Treatment</th>
										<th>Treatment Amount</th>
										<th>Medicine Amount</th>
										<th>Total Amount</th>
										<th>Paid Amount</th>
										<th>Second Paid Amount</th>
										<th>Balance</th>
										<th>Payment Method</th>
										<th>Payment Type</th>
										<th>Bank Type</th>
										<th>Purchase Type</th>
										<!-- <th>Deposit</th> -->
										<!-- <th>Purchase Type</th> -->
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr
										@click="getDetail(item._id)"
										v-for="(item, index) in bankTableList"
										:key="'item' + item._id">
										<td>{{ index + 1 }}</td>
										<td>{{ cusFormatDate(item.createdAt) }}</td>
										<td>
											<span :class="{ 'text-danger': !item.code }">
												{{ item.code ?? "Not Set" }}
											</span>
										</td>
										<!-- <td>
											<span
												:class="{ 'text-danger': !item.createdBy?.givenName }"
												>{{ item.createdBy?.givenName ?? "Not Set" }}</span
											>
										</td> -->
										<td>
											<span
												:class="{ 'text-danger': !item.relatedPatient?.name }"
												>{{ item.relatedPatient?.name ?? "Not Set" }}</span
											>
										</td>
										<td>
											<span
												:class="{ 'text-danger': !item.relatedPatient?.phone }"
												>{{ item.relatedPatient?.phone ?? "Not Set" }}</span
											>
										</td>
										<td>
											<!-- {{ item.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name ?? 'Not Set' }} -->
											<span
												:class="{ 'text-danger': !item.relatedDoctor?.name }"
												>{{ item.relatedDoctor?.name ?? "Not Set" }}</span
											>
										</td>
										<td>
											<!-- {{ item.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name ?? 'Not Set' }} -->
											<span
												:class="{
													'text-danger': !item.relatedTherapist?.name,
												}">
												{{ item.relatedTherapist?.name ?? "-" }}
											</span>
										</td>
										<template v-if="item.multiTreatment.length > 0">
											<td style="min-width: 300px; white-space: normal">
												<span
													:class="{
														'text-danger':
															!item.multiTreatment[0]?.item_id.name,
													}"
													>{{
														item.multiTreatment[0]?.item_id.name ?? "Not Set"
													}}</span
												>
											</td>
										</template>
										<template v-else>
											<td style="min-width: 300px; white-space: normal">
												<span
													:class="{
														'text-danger': !item?.relatedTreatment?.name,
													}"
													>{{ item?.relatedTreatment?.name ?? "Not Set" }}</span
												>
											</td>
										</template>
										<template v-if="item.tsType == 'MS'">
											<td>0</td>
											<td>
												{{ formatNumber(item.msGrandTotal) }}
											</td>
											<td>
												{{ formatNumber(item.msGrandTotal) }}
											</td>
											<td>
												{{ formatNumber(item.msPaidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item.msBalance)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'PS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedPackageSelection.totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedPackageSelection.totalAmount
														  )
												}}
											</td>
											<td>0</td>
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedPackageSelection.totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedPackageSelection.totalAmount
														  )
												}}
											</td>
											<td>
												{{
													formatNumber(item.relatedPackageSelection.paidAmount)
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item?.balance || 0)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'TSMulti'">
											<td>
												{{
													formatNumber(item.totalAmount - item.totalDiscount)
												}}
											</td>
											<td>0</td>
											<td>
												{{
													formatNumber(item.totalAmount - item.totalDiscount)
												}}
											</td>
											<td>
												{{
													item.totalPaidAmount
														? formatNumber(item.totalPaidAmount)
														: 0
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item?.balance || 0)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'TS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedTreatmentSelection[0].totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedTreatmentSelection[0].totalAmount
														  )
												}}
											</td>
											<td>0</td>
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedTreatmentSelection[0].totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedTreatmentSelection[0].totalAmount
														  )
												}}
											</td>
											<td>
												{{ formatNumber(item.paidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item.balance || 0)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'Combined'">
											<!-- for combine with multi treatment -->
											<template v-if="item.multiTreatment.length > 0">
												<td>{{ formatNumber(item.totalAmount) }}</td>
												<td>{{ formatNumber(item.msGrandTotal) }}</td>
												<td>
													{{
														formatNumber(
															item.msGrandTotal +
																(item.totalAmount - item.totalDiscount)
														)
													}}
												</td>
												<td>
													{{
														formatNumber(
															item.msPaidAmount + item.totalPaidAmount
														)
													}}
												</td>

												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{
														item.paymentMethod == "Paid"
															? 0
															: formatNumber(item.msBalance + item.balance)
													}}
												</td>
											</template>

											<!-- for combine with single treatment -->
											<template v-else>
												<td>
													{{
														formatNumber(
															item.relatedTreatmentSelection[0].totalAmount
														)
													}}
												</td>
												<td>{{ formatNumber(item.msGrandTotal) }}</td>
												<td>
													{{
														formatNumber(
															item.msGrandTotal +
																item.relatedTreatmentSelection[0].totalAmount
														)
													}}
												</td>
												<td>
													{{
														formatNumber(
															item.msPaidAmount +
																item.relatedTreatmentSelection[0].paidAmount
														)
													}}
												</td>
												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{
														item.paymentMethod == "Paid"
															? 0
															: formatNumber(item.msBalance + item.balance)
													}}
												</td>
											</template>
										</template>

										<td>
											{{ item.paymentMethod }}
										</td>
										<td>
											<template
												v-if="
													item.paymentMethod === 'Advanced' ||
													item.relatedBank ||
													item.relatedCash
												">
												<template v-if="item.relatedCash"> Cash </template>
												<template v-if="item.relatedBank"> Bank </template>
											</template>
											<template v-else>
												{{ item.paymentType ?? "Not Set" }}
											</template>
										</td>
										<td>{{ item.bankType ?? "Not Set" }}</td>
										<td>
											<template v-if="item.purchaseType === 'Clinic'">
												Aesthetic
											</template>
											<template v-else>
												{{ item.purchaseType ?? "Not Set" }}
											</template>
										</td>
										<!-- <td>
											<span
												:class="{
													'text-danger': !(item.deposit || item.deposit >= 0),
												}"
												>{{
													item.deposit >= 0 ? item.deposit : "Not Set"
												}}</span
											>
										</td> -->
										<!-- <td>{{ item.relatedTreatmentSelection.purchaseType ?? 'Not Set' }}</td> -->
										<!-- <td>
											<template v-if="item.tsType === 'TSMulti'">
												<router-link
													:to="{
														name: 'sale.treatment',
														query: { voucherId: item._id },
													}"
													custom
													v-slot="{ navigate }">
													<button
														class="me-3 btn btn-warning"
														@click.stop="navigate"
														@keypress.enter="navigate"
														role="link">
														<i class="bi bi-pencil-square"></i>
													</button>
												</router-link>
											</template>
											<template v-if="item.tsType === 'MS'">
												<router-link
													:to="{
														name: 'sale.medicine',
														query: { voucherId: item._id },
													}"
													custom
													v-slot="{ navigate }">
													<button
														class="me-3 btn btn-warning"
														@click.stop="navigate"
														@keypress.enter="navigate"
														role="link">
														<i class="bi bi-pencil-square"></i>
													</button>
												</router-link>
											</template>
											<button
												class="me-3 btn btn-warning"
												@click.stop="
													goToPatientDetail(item.relatedPatient._id)
												">
												<i class="bi bi-person-vcard-fill"></i>
											</button>
											<button
												@click.stop="deleteVoucherList(item)"
												class="btn btn-danger"
												:disabled="isDeleting">
												<template v-if="isDeleting"> Deleting... </template>
												<template v-else>
													<i class="bi bi-trash"></i>
												</template>
											</button>
										</td> -->
										<td>
											<div
												class="dropdown"
												@click.stop="
													() => {
														console.log('click')
													}
												">
												<a
													class="btn btn-secondary dropdown-toggle"
													role="button"
													data-bs-toggle="dropdown"
													aria-expanded="false">
													Actions
												</a>

												<ul class="dropdown-menu">
													<!-- <li>
														<button
															@click.stop="deleteVoucherList(item)"
															class="dropdown-item text-danger fw-bold"
															:disabled="isDeleting">
															<i class="bi bi-trash"></i
															><template v-if="isDeleting">
																Deleting... </template
															><template v-else> Delete</template>
														</button>
													</li>
													<li><hr class="dropdown-divider" /></li> -->

													<li>
														<button
															class="dropdown-item text-info fw-bold"
															@click.stop="
																goToPatientDetail(item.relatedPatient._id)
															">
															<i class="bi bi-person-vcard-fill"></i> Patient
															Detail
														</button>
													</li>
													<li><hr class="dropdown-divider" /></li>
													<li>
														<button
															class="dropdown-item text-info fw-bold"
															@click.stop="
																goToDebtList(item.relatedPatient._id)
															">
															<i class="bi bi-credit-card-2-back"></i> Patient
															Debt List
														</button>
													</li>
													<li><hr class="dropdown-divider" /></li>
													<template v-if="item.repay.length > 0">
														<li>
															<button
																class="dropdown-item text-info fw-bold"
																@click.stop="goToRepayList(item.repay)">
																<i class="bi bi-credit-card-2-back"></i> Repay
																List
															</button>
														</li>
														<li><hr class="dropdown-divider" /></li>
													</template>
													<template
														v-if="
															appStore.user.data.user.role == 'supervisor' ||
															appStore.user.data.user.role == 'master'
														">
														<template v-if="item.tsType === 'TSMulti'">
															<li v-if="!item.Refund && item.editPermission">
																<router-link
																	:to="{
																		name: 'sale.treatment',
																		query: { voucherId: item._id },
																	}"
																	custom
																	v-slot="{ navigate }">
																	<button
																		class="dropdown-item text-info fw-bold"
																		@click.stop="navigate"
																		@keypress.enter="navigate"
																		role="link">
																		<i class="bi bi-pencil-square"></i> Edit
																	</button>
																</router-link>
															</li>
														</template>
														<template v-if="item.tsType === 'MS'">
															<li v-if="!item.Refund && item.editPermission">
																<router-link
																	:to="{
																		name: 'sale.medicine',
																		query: { voucherId: item._id },
																	}"
																	custom
																	v-slot="{ navigate }">
																	<button
																		class="dropdown-item text-info fw-bold"
																		@click.stop="navigate"
																		@keypress.enter="navigate"
																		role="link">
																		<i class="bi bi-pencil-square"></i> Edit
																	</button>
																</router-link>
															</li>
														</template>
													</template>
												</ul>
											</div>
										</td>
									</tr>
									<tr
										class="text-center"
										v-if="bankTableList && bankTableList.length <= 0">
										<td colspan="16">No record exist!</td>
									</tr>
								</tbody>
							</table>
						</div>
					</template>
					<template v-if="selectedTab == 'all'">
						<div class="table-responsive">
							<table
								ref="vouchersTable"
								class="table table-hover table-striped">
								<thead>
									<tr>
										<th>#</th>
										<th>Date</th>
										<th>Code</th>
										<!-- <th>Sale By</th> -->
										<th>Customer Name</th>
										<th>Customer Phone</th>
										<th>Doctor</th>
										<th>Therapist</th>
										<th>Treatment</th>
										<th>Treatment Amount</th>
										<th>Medicine Amount</th>
										<th>Total Amount</th>
										<th>Paid Amount</th>
										<th>Second Paid Amount</th>
										<th>Balance</th>
										<th>Payment Method</th>
										<th>Payment Type</th>
										<th>Bank Type</th>
										<th>Purchase Type</th>
										<!-- <th>Deposit</th> -->
										<!-- <th>Purchase Type</th> -->
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr
										@click="getDetail(item._id)"
										v-for="(item, index) in allVoucherList"
										:key="'item' + item._id">
										<td>{{ index + 1 }}</td>
										<td>{{ cusFormatDate(item.createdAt) }}</td>
										<td>
											<span :class="{ 'text-danger': !item.code }">
												{{ item.code ?? "Not Set" }}
											</span>
										</td>
										<!-- <td>
											<span
												:class="{ 'text-danger': !item.createdBy?.givenName }"
												>{{ item.createdBy?.givenName ?? "Not Set" }}</span
											>
										</td> -->
										<td>
											<span
												:class="{ 'text-danger': !item.relatedPatient?.name }"
												>{{ item.relatedPatient?.name ?? "Not Set" }}</span
											>
										</td>
										<td>
											<span
												:class="{ 'text-danger': !item.relatedPatient?.phone }"
												>{{ item.relatedPatient?.phone ?? "Not Set" }}</span
											>
										</td>
										<td>
											<!-- {{ item.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name ?? 'Not Set' }} -->
											<span
												:class="{ 'text-danger': !item.relatedDoctor?.name }"
												>{{ item.relatedDoctor?.name ?? "Not Set" }}</span
											>
										</td>
										<td>
											<!-- {{ item.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name ?? 'Not Set' }} -->
											<span
												:class="{
													'text-danger': !item.relatedTherapist?.name,
												}">
												{{ item.relatedTherapist?.name ?? "-" }}
											</span>
										</td>
										<template v-if="item.multiTreatment.length > 0">
											<td style="min-width: 300px; white-space: normal">
												<span
													:class="{
														'text-danger':
															!item.multiTreatment[0]?.item_id.name,
													}"
													>{{
														item.multiTreatment[0]?.item_id.name ?? "Not Set"
													}}</span
												>
											</td>
										</template>
										<template v-else>
											<td style="min-width: 300px; white-space: normal">
												<span
													:class="{
														'text-danger': !item?.relatedTreatment?.name,
													}"
													>{{ item?.relatedTreatment?.name ?? "Not Set" }}</span
												>
											</td>
										</template>
										<template v-if="item.tsType == 'MS'">
											<td>0</td>
											<td>
												{{ formatNumber(item.msGrandTotal) }}
											</td>
											<td>
												{{ formatNumber(item.msGrandTotal) }}
											</td>
											<td>
												{{ formatNumber(item.msPaidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item.msBalance)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'PS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedPackageSelection.totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedPackageSelection.totalAmount
														  )
												}}
											</td>
											<td>0</td>
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedPackageSelection.totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedPackageSelection.totalAmount
														  )
												}}
											</td>
											<td>
												{{
													formatNumber(item.relatedPackageSelection.paidAmount)
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item?.balance || 0)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'TSMulti'">
											<td>
												{{
													formatNumber(item.totalAmount - item.totalDiscount)
												}}
											</td>
											<td>0</td>
											<td>
												{{
													formatNumber(item.totalAmount - item.totalDiscount)
												}}
											</td>
											<td>
												{{
													item.totalPaidAmount
														? formatNumber(item.totalPaidAmount)
														: 0
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item?.balance || 0)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'TS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedTreatmentSelection[0].totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedTreatmentSelection[0].totalAmount
														  )
												}}
											</td>
											<td>0</td>
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedTreatmentSelection[0].totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedTreatmentSelection[0].totalAmount
														  )
												}}
											</td>
											<td>
												{{ formatNumber(item.paidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{
													item.paymentMethod == "Paid"
														? 0
														: formatNumber(item.balance || 0)
												}}
											</td>
										</template>
										<template v-else-if="item.tsType == 'Combined'">
											<!-- for combine with multi treatment -->
											<template v-if="item.multiTreatment.length > 0">
												<td>{{ formatNumber(item.totalAmount) }}</td>
												<td>{{ formatNumber(item.msGrandTotal) }}</td>
												<td>
													{{
														formatNumber(
															item.msGrandTotal +
																(item.totalAmount - item.totalDiscount)
														)
													}}
												</td>
												<td>
													{{
														formatNumber(
															item.msPaidAmount + item.totalPaidAmount
														)
													}}
												</td>

												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{
														item.paymentMethod == "Paid"
															? 0
															: formatNumber(item.msBalance + item.balance)
													}}
												</td>
											</template>

											<!-- for combine with single treatment -->
											<template v-else>
												<td>
													{{
														formatNumber(
															item.relatedTreatmentSelection[0].totalAmount
														)
													}}
												</td>
												<td>{{ formatNumber(item.msGrandTotal) }}</td>
												<td>
													{{
														formatNumber(
															item.msGrandTotal +
																item.relatedTreatmentSelection[0].totalAmount
														)
													}}
												</td>
												<td>
													{{
														formatNumber(
															item.msPaidAmount +
																item.relatedTreatmentSelection[0].paidAmount
														)
													}}
												</td>
												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{
														item.paymentMethod == "Paid"
															? 0
															: formatNumber(item.msBalance + item.balance)
													}}
												</td>
											</template>
										</template>

										<td>
											{{ item.paymentMethod }}
										</td>
										<td>
											<template
												v-if="
													item.paymentMethod === 'Advanced' ||
													item.relatedBank ||
													item.relatedCash
												">
												<template v-if="item.relatedCash"> Cash </template>
												<template v-if="item.relatedBank"> Bank </template>
											</template>
											<template v-else>
												{{ item.paymentType ?? "Not Set" }}
											</template>
										</td>
										<td>{{ item.bankType ?? "Not Set" }}</td>
										<td>
											<template v-if="item.purchaseType === 'Clinic'">
												Aesthetic
											</template>
											<template v-else>
												{{ item.purchaseType ?? "Not Set" }}
											</template>
										</td>
										<!-- <td>
											<span
												:class="{
													'text-danger': !(item.deposit || item.deposit >= 0),
												}"
												>{{
													item.deposit >= 0 ? item.deposit : "Not Set"
												}}</span
											>
										</td> -->
										<!-- <td>{{ item.relatedTreatmentSelection.purchaseType ?? 'Not Set' }}</td> -->
										<!-- <td>
											<template v-if="item.tsType === 'TSMulti'">
												<router-link
													:to="{
														name: 'sale.treatment',
														query: { voucherId: item._id },
													}"
													custom
													v-slot="{ navigate }">
													<button
														class="me-3 btn btn-warning"
														@click.stop="navigate"
														@keypress.enter="navigate"
														role="link">
														<i class="bi bi-pencil-square"></i>
													</button>
												</router-link>
											</template>
											<template v-if="item.tsType === 'MS'">
												<router-link
													:to="{
														name: 'sale.medicine',
														query: { voucherId: item._id },
													}"
													custom
													v-slot="{ navigate }">
													<button
														class="me-3 btn btn-warning"
														@click.stop="navigate"
														@keypress.enter="navigate"
														role="link">
														<i class="bi bi-pencil-square"></i>
													</button>
												</router-link>
											</template>
											<button
												class="me-3 btn btn-warning"
												@click.stop="
													goToPatientDetail(item.relatedPatient._id)
												">
												<i class="bi bi-person-vcard-fill"></i>
											</button>
											<button
												@click.stop="deleteVoucherList(item)"
												class="btn btn-danger"
												:disabled="isDeleting">
												<template v-if="isDeleting"> Deleting... </template>
												<template v-else>
													<i class="bi bi-trash"></i>
												</template>
											</button>
										</td> -->
										<td>
											<div
												class="dropdown"
												@click.stop="
													() => {
														console.log('click')
													}
												">
												<a
													class="btn btn-secondary dropdown-toggle"
													role="button"
													data-bs-toggle="dropdown"
													aria-expanded="false">
													Actions
												</a>

												<ul class="dropdown-menu">
													<!-- <li>
														<button
															@click.stop="deleteVoucherList(item)"
															class="dropdown-item text-danger fw-bold"
															:disabled="isDeleting">
															<i class="bi bi-trash"></i
															><template v-if="isDeleting">
																Deleting... </template
															><template v-else> Delete</template>
														</button>
													</li>
													<li><hr class="dropdown-divider" /></li> -->

													<li>
														<button
															class="dropdown-item text-info fw-bold"
															@click.stop="
																goToPatientDetail(item.relatedPatient._id)
															">
															<i class="bi bi-person-vcard-fill"></i> Patient
															Detail
														</button>
													</li>
													<li><hr class="dropdown-divider" /></li>
													<li>
														<button
															class="dropdown-item text-info fw-bold"
															@click.stop="
																goToDebtList(item.relatedPatient._id)
															">
															<i class="bi bi-credit-card-2-back"></i> Patient
															Debt List
														</button>
													</li>
													<li><hr class="dropdown-divider" /></li>
													<template v-if="item.repay.length > 0">
														<li>
															<button
																class="dropdown-item text-info fw-bold"
																@click.stop="goToRepayList(item.repay)">
																<i class="bi bi-credit-card-2-back"></i> Repay
																List
															</button>
														</li>
														<li><hr class="dropdown-divider" /></li>
													</template>
													<template
														v-if="
															appStore.user.data.user.role == 'supervisor' ||
															appStore.user.data.user.role == 'master'
														">
														<template v-if="item.tsType === 'TSMulti'">
															<li v-if="!item.Refund && item.editPermission">
																<router-link
																	:to="{
																		name: 'sale.treatment',
																		query: { voucherId: item._id },
																	}"
																	custom
																	v-slot="{ navigate }">
																	<button
																		class="dropdown-item text-info fw-bold"
																		@click.stop="navigate"
																		@keypress.enter="navigate"
																		role="link">
																		<i class="bi bi-pencil-square"></i> Edit
																	</button>
																</router-link>
															</li>
														</template>
														<template v-if="item.tsType === 'MS'">
															<li v-if="!item.Refund && item.editPermission">
																<router-link
																	:to="{
																		name: 'sale.medicine',
																		query: { voucherId: item._id },
																	}"
																	custom
																	v-slot="{ navigate }">
																	<button
																		class="dropdown-item text-info fw-bold"
																		@click.stop="navigate"
																		@keypress.enter="navigate"
																		role="link">
																		<i class="bi bi-pencil-square"></i> Edit
																	</button>
																</router-link>
															</li>
														</template>
													</template>
												</ul>
											</div>
										</td>
									</tr>
									<tr
										class="text-center"
										v-if="allVoucherList && allVoucherList.length <= 0">
										<td colspan="16">No record exist!</td>
									</tr>
								</tbody>
							</table>
						</div>
					</template>
					<div class="row my-3">
						<div class="col-6" v-if="bankNames.length > 0">
							<h4>Bank List</h4>
							<div v-for="(each, index) in bankNames">
								<div class="d-flex gap-3">
									<div class="fw-bold">{{ each.bankname }} :</div>
									<div>{{ each ? formatNumber(each.amount) : 0 }}</div>
								</div>
							</div>
						</div>
						<div class="col-6" v-if="cashNames.length > 0">
							<h4>Cash List</h4>
							<div v-for="(each, index) in cashNames">
								<div class="d-flex gap-3">
									<div class="fw-bold">{{ each.cashname }} :</div>
									<div>{{ each ? formatNumber(each.amount) : 0 }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else>
					<template v-if="selectedTab == 'cash'">
						<div class="table-responsive">
							<table
								ref="vouchersTable"
								class="table table-hover table-striped">
								<thead>
									<tr>
										<th class="text-nowrap">#</th>
										<th>Old-VR Code</th>
										<th>Old-VR Date</th>
										<th>Old-VR Total Amount</th>
										<!-- <th>Old-VR Total Paid Amount</th> -->
										<!-- <th>Old-VR Balance</th> -->
										<th>Refund Type</th>
										<th>Refund Amount</th>
										<th>New-VR Code</th>
										<th>New-VR Date</th>
										<th>New-VR Remark</th>
										<th>New-VR Total Amount</th>
										<th>New-VR Paid Amount</th>
										<th>Different Amount</th>
									</tr>
								</thead>
								<tbody>
									<tr
										@click="getDetail(item._id)"
										v-for="(item, index) in cashTableList"
										:key="'item' + item._id">
										<td>{{ index + 1 }}</td>
										<td>
											<span :class="{ 'text-danger': !item.code }">
												{{ item.code ?? "Not Set" }}
											</span>
										</td>
										<td>{{ cusFormatDate(item.createdAt) }}</td>
										<!-- <td>
											<span
												:class="{ 'text-danger': !item.createdBy?.givenName }">
												{{ item.createdBy?.givenName ?? "Not Set" }}</span
											>
										</td> -->
										<template v-if="item.tsType == 'MS'">
											<td>
												{{ formatNumber(item.msGrandTotal) }}
											</td>
											<!-- <td>
												{{ formatNumber(item.msPaidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item.msBalance) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'PS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedPackageSelection.totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedPackageSelection.totalAmount
														  )
												}}
											</td>
											<!-- <td>
												{{
													formatNumber(item.relatedPackageSelection.paidAmount)
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item?.balance || 0) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'TSMulti'">
											<td>
												{{
													formatNumber(item.totalAmount - item.totalDiscount)
												}}
											</td>
											<!-- <td>
												{{
													item.totalPaidAmount
														? formatNumber(item.totalPaidAmount)
														: 0
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item?.balance || 0) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'TS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedTreatmentSelection[0].totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedTreatmentSelection[0].totalAmount
														  )
												}}
											</td>
											<!-- <td>
												{{ formatNumber(item.paidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item.balance || 0) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'Combined'">
											<!-- for combine with multi treatment -->
											<template v-if="item.multiTreatment.length > 0">
												<td>
													{{
														formatNumber(
															item.msPaidAmount + item.totalPaidAmount
														)
													}}
												</td>
												<!-- <td>
													{{
														formatNumber(
															item.msGrandTotal +
																(item.totalAmount - item.totalDiscount)
														)
													}}
												</td>
												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{ formatNumber(item.msBalance + item.balance) }}
												</td> -->
											</template>

											<!-- for combine with single treatment -->
											<template v-else>
												<td>
													{{
														formatNumber(
															item.msGrandTotal +
																item.relatedTreatmentSelection[0].totalAmount
														)
													}}
												</td>
												<!-- <td>
													{{
														formatNumber(
															item.msPaidAmount +
																item.relatedTreatmentSelection[0].paidAmount
														)
													}}
												</td>
												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{ formatNumber(item.msBalance + item.balance) }}
												</td> -->
											</template>
										</template>
										<td>
											{{
												item.newTreatmentVoucherId ? "Treatment" : "Cash Back"
											}}
										</td>
										<td>
											{{ item.cashBackAmount || item.refundAmount || 0 }}
										</td>
										<td>{{ item?.newTreatmentVoucherId?.code || "-" }}</td>
										<td>{{ item?.newTreatmentVoucherId?.createdAt || "-" }}</td>
										<td>{{ item?.newTreatmentVoucherId?.remark || "-" }}</td>
										<td>
											{{ item?.newTreatmentVoucherId?.totalAmount || "-" }}
										</td>
										<td>
											{{ item?.newTreatmentVoucherId?.totalPaidAmount || "-" }}
										</td>
										<td>
											{{
												item.newTreatmentVoucherId
													? item.newTreatmentVoucherId.totalPaidAmount -
													  item.refundAmount
													: "-"
											}}
										</td>
									</tr>
									<tr
										class="text-center"
										v-if="cashTableList && cashTableList.length <= 0">
										<td colspan="15">No record exist!</td>
									</tr>
								</tbody>
							</table>
						</div>
					</template>
					<template v-if="selectedTab == 'bank'">
						<div class="table-responsive">
							<table
								ref="vouchersTable"
								class="table table-hover table-striped">
								<thead>
									<tr>
										<th class="text-nowrap">#</th>
										<th>Old-VR Code</th>
										<th>Old-VR Date</th>
										<th>Old-VR Total Amount</th>
										<!-- <th>Old-VR Total Paid Amount</th> -->
										<!-- <th>Old-VR Balance</th> -->
										<th>Refund Type</th>
										<th>Refund Amount</th>
										<th>New-VR Code</th>
										<th>New-VR Date</th>
										<th>New-VR Remark</th>
										<th>New-VR Total Amount</th>
										<th>New-VR Paid Amount</th>
										<th>Different Amount</th>
									</tr>
								</thead>
								<tbody>
									<tr
										@click="getDetail(item._id)"
										v-for="(item, index) in bankTableList"
										:key="'item' + item._id">
										<td>{{ index + 1 }}</td>
										<td>
											<span :class="{ 'text-danger': !item.code }">
												{{ item.code ?? "Not Set" }}
											</span>
										</td>
										<td>{{ cusFormatDate(item.createdAt) }}</td>
										<!-- <td>
											<span
												:class="{ 'text-danger': !item.createdBy?.givenName }">
												{{ item.createdBy?.givenName ?? "Not Set" }}</span
											>
										</td> -->
										<template v-if="item.tsType == 'MS'">
											<td>
												{{ formatNumber(item.msGrandTotal) }}
											</td>
											<!-- <td>
												{{ formatNumber(item.msPaidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item.msBalance) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'PS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedPackageSelection.totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedPackageSelection.totalAmount
														  )
												}}
											</td>
											<!-- <td>
												{{
													formatNumber(item.relatedPackageSelection.paidAmount)
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item?.balance || 0) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'TSMulti'">
											<td>
												{{
													formatNumber(item.totalAmount - item.totalDiscount)
												}}
											</td>
											<!-- <td>
												{{
													item.totalPaidAmount
														? formatNumber(item.totalPaidAmount)
														: 0
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item?.balance || 0) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'TS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedTreatmentSelection[0].totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedTreatmentSelection[0].totalAmount
														  )
												}}
											</td>
											<!-- <td>
												{{ formatNumber(item.paidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item.balance || 0) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'Combined'">
											<!-- for combine with multi treatment -->
											<template v-if="item.multiTreatment.length > 0">
												<td>
													{{
														formatNumber(
															item.msPaidAmount + item.totalPaidAmount
														)
													}}
												</td>
												<!-- <td>
													{{
														formatNumber(
															item.msGrandTotal +
																(item.totalAmount - item.totalDiscount)
														)
													}}
												</td>
												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{ formatNumber(item.msBalance + item.balance) }}
												</td> -->
											</template>

											<!-- for combine with single treatment -->
											<template v-else>
												<td>
													{{
														formatNumber(
															item.msGrandTotal +
																item.relatedTreatmentSelection[0].totalAmount
														)
													}}
												</td>
												<!-- <td>
													{{
														formatNumber(
															item.msPaidAmount +
																item.relatedTreatmentSelection[0].paidAmount
														)
													}}
												</td>
												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{ formatNumber(item.msBalance + item.balance) }}
												</td> -->
											</template>
										</template>
										<td>
											{{
												item.newTreatmentVoucherId ? "Treatment" : "Cash Back"
											}}
										</td>
										<td>
											{{ item.cashBackAmount || item.refundAmount || 0 }}
										</td>
										<td>{{ item?.newTreatmentVoucherId?.code || "-" }}</td>
										<td>{{ item?.newTreatmentVoucherId?.createdAt || "-" }}</td>
										<td>{{ item?.newTreatmentVoucherId?.remark || "-" }}</td>
										<td>
											{{ item?.newTreatmentVoucherId?.totalAmount || "-" }}
										</td>
										<td>
											{{ item?.newTreatmentVoucherId?.totalPaidAmount || "-" }}
										</td>
										<td>
											{{
												item.newTreatmentVoucherId
													? item.newTreatmentVoucherId.totalPaidAmount -
													  item.refundAmount
													: "-"
											}}
										</td>
									</tr>
									<tr
										class="text-center"
										v-if="bankTableList && bankTableList.length <= 0">
										<td colspan="16">No record exist!</td>
									</tr>
								</tbody>
							</table>
						</div>
					</template>
					<template v-if="selectedTab == 'all'">
						<div class="table-responsive">
							<table
								ref="vouchersTable"
								class="table table-hover table-striped">
								<thead>
									<tr>
										<th class="text-nowrap">#</th>
										<th>Old-VR Code</th>
										<th>Old-VR Date</th>
										<th>Old-VR Total Amount</th>
										<!-- <th>Old-VR Total Paid Amount</th> -->
										<!-- <th>Old-VR Balance</th> -->
										<th>Refund Type</th>
										<th>Refund Amount</th>
										<th>New-VR Code</th>
										<th>New-VR Date</th>
										<th>New-VR Remark</th>
										<th>New-VR Total Amount</th>
										<th>New-VR Paid Amount</th>
										<th>Different Amount</th>
									</tr>
								</thead>
								<tbody>
									<tr
										@click="getDetail(item._id)"
										v-for="(item, index) in allVoucherList"
										:key="'item' + item._id">
										<td>{{ index + 1 }}</td>
										<td>
											<span :class="{ 'text-danger': !item.code }">
												{{ item.code ?? "Not Set" }}
											</span>
										</td>
										<td>{{ cusFormatDate(item.createdAt) }}</td>
										<!-- <td>
											<span
												:class="{ 'text-danger': !item.createdBy?.givenName }">
												{{ item.createdBy?.givenName ?? "Not Set" }}</span
											>
										</td> -->
										<template v-if="item.tsType == 'MS'">
											<td>
												{{ formatNumber(item.msGrandTotal) }}
											</td>
											<!-- <td>
												{{ formatNumber(item.msPaidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item.msBalance) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'PS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedPackageSelection.totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedPackageSelection.totalAmount
														  )
												}}
											</td>
											<!-- <td>
												{{
													formatNumber(item.relatedPackageSelection.paidAmount)
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item?.balance || 0) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'TSMulti'">
											<td>
												{{
													formatNumber(item.totalAmount - item.totalDiscount)
												}}
											</td>
											<!-- <td>
												{{
													item.totalPaidAmount
														? formatNumber(item.totalPaidAmount)
														: 0
												}}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item?.balance || 0) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'TS'">
											<td>
												{{
													item.discountAmount
														? formatNumber(
																item.relatedTreatmentSelection[0].totalAmount -
																	item.discountAmount
														  )
														: formatNumber(
																item.relatedTreatmentSelection[0].totalAmount
														  )
												}}
											</td>
											<!-- <td>
												{{ formatNumber(item.paidAmount) }}
											</td>
											<td>
												{{ formatNumber(item?.secondAmount || 0) }}
											</td>
											<td>
												{{ formatNumber(item.balance || 0) }}
											</td> -->
										</template>
										<template v-else-if="item.tsType == 'Combined'">
											<!-- for combine with multi treatment -->
											<template v-if="item.multiTreatment.length > 0">
												<td>
													{{
														formatNumber(
															item.msPaidAmount + item.totalPaidAmount
														)
													}}
												</td>
												<!-- <td>
													{{
														formatNumber(
															item.msGrandTotal +
																(item.totalAmount - item.totalDiscount)
														)
													}}
												</td>
												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{ formatNumber(item.msBalance + item.balance) }}
												</td> -->
											</template>

											<!-- for combine with single treatment -->
											<template v-else>
												<td>
													{{
														formatNumber(
															item.msGrandTotal +
																item.relatedTreatmentSelection[0].totalAmount
														)
													}}
												</td>
												<!-- <td>
													{{
														formatNumber(
															item.msPaidAmount +
																item.relatedTreatmentSelection[0].paidAmount
														)
													}}
												</td>
												<td>{{ formatNumber(item?.secondAmount || 0) }}</td>
												<td>
													{{ formatNumber(item.msBalance + item.balance) }}
												</td> -->
											</template>
										</template>
										<td>
											{{
												item.newTreatmentVoucherId ? "Treatment" : "Cash Back"
											}}
										</td>
										<td>
											{{ item.cashBackAmount || item.refundAmount || 0 }}
										</td>
										<td>{{ item?.newTreatmentVoucherId?.code || "-" }}</td>
										<td>{{ item?.newTreatmentVoucherId?.createdAt || "-" }}</td>
										<td>{{ item?.newTreatmentVoucherId?.remark || "-" }}</td>
										<td>
											{{ item?.newTreatmentVoucherId?.totalAmount || "-" }}
										</td>
										<td>
											{{ item?.newTreatmentVoucherId?.totalPaidAmount || "-" }}
										</td>
										<td>
											{{
												item.newTreatmentVoucherId
													? item.newTreatmentVoucherId.totalPaidAmount -
													  item.refundAmount
													: "-"
											}}
										</td>
									</tr>
									<tr
										class="text-center"
										v-if="allVoucherList && allVoucherList.length <= 0">
										<td colspan="16">No record exist!</td>
									</tr>
								</tbody>
							</table>
						</div>
					</template>
					<div class="row my-3">
						<div class="col-6" v-if="bankNames.length > 0">
							<h4>Bank List</h4>
							<div v-for="(each, index) in bankNames">
								<div class="d-flex gap-3">
									<div class="fw-bold">{{ each.bankname }} :</div>
									<div>{{ each ? formatNumber(each.amount) : 0 }}</div>
								</div>
							</div>
						</div>
						<div class="col-6" v-if="cashNames.length > 0">
							<h4>Cash List</h4>
							<div v-for="(each, index) in cashNames">
								<div class="d-flex gap-3">
									<div class="fw-bold">{{ each.cashname }} :</div>
									<div>{{ each ? formatNumber(each.amount) : 0 }}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</template>
</template>

<script setup>
import { onMounted } from "vue"
import {
	cusFormatDate,
	dateForParams,
	exportData,
	formatNumber,
	getTimestamp,
} from "../../helpers/index"
import Spinner from "@/components/Common/Spinner.vue"
import { useTreatmentVoucherStore } from "../../stores/treatmentVoucher"
import { ref } from "vue"
import { useDoctorStore } from "../../stores/doctor"
import { useUserStore } from "../../stores/user"
import VueMultiselect from "vue-multiselect"
import { usePatientStore } from "../../stores/patient"
import { useAccountingListStore } from "../../stores/accountingList"
import { useAppStore } from "../../stores/app"
import { useRefundStore } from "../../stores/refund"
import { useRouter } from "vue-router"

const keyWordForVoucherCode = ref("")
const allVoucherList = ref([])
const refundStore = useRefundStore()
const allVoucherListFilter = ref([])
const router = useRouter()
const isLoading = ref(true)
const isDeleting = ref(false)
const treatmentVoucherStore = useTreatmentVoucherStore()
const treatmentVouchers = ref([])
const doctorStore = useDoctorStore()
const userStore = useUserStore()
const patientStore = usePatientStore()
const appStore = useAppStore()
const accountingListStore = useAccountingListStore()
const doctors = ref([])
const users = ref([])
const patients = ref([])
const bankAccounts = ref()
const voucherStatus = ref("all")
const dateNow = ref(0)
const selectedBankAccount = ref({})
const selectedCashAccount = ref({})
const selectedVoucher = ref({})
const selectedTab = ref("bank")
const bankTableList = ref([])
const cashTableList = ref([])
const primaryBankTableList = ref([])
const primaryCashTableList = ref([])
const cashAccounts = ref([])
const bankNames = ref({})
const cashNames = ref({})
const bankTotal = ref(0)
const cashTotal = ref(0)
const refundRemark = ref("")
const refundDate = ref("")
const refundAccType = ref("cash")
const refundAmount = ref(0)
const refundType = ref("CashBack")
const exportType = ref("voucher")
const excelImportFile = ref(null)
const modalCloseBtn = ref(null)
const orderBy = ref("descending")
const filter = ref({
	tsType: null,
	startDate: null,
	endDate: null,
	relatedDoctor: null,
	relatedPatient: null,
	createdBy: null,
	bankType: null, // 'Normal', 'POS', 'Pay'
	bankID: null,
	purchaseType: null,
})
const goToRepayList = list => {
	treatmentVoucherStore.repayList = list
	router.push({ name: "sale.repay-list" })
}
const getDetail = id => {
	router.push({ name: "sale.voucher-detail", params: { id: id } })
}
const goToPatientDetail = id => {
	router.push({ name: "patient.detail", params: { id } })
}
const goToDebtList = id => {
	router.push({ name: "patient.credit", params: { id } })
}
const search = () => {
	if (selectedTab.value == "bank") {
		let arr = [...primaryBankTableList.value]
		if (keyWordForVoucherCode.value == "") {
			bankTableList.value = primaryBankTableList.value
			return
		}
		bankTableList.value = arr.filter(e => {
			return e.code
				.toLowerCase()
				.includes(keyWordForVoucherCode.value.toLocaleLowerCase())
		})
	} else if (selectedTab.value == "cash") {
		let arr = [...primaryCashTableList.value]
		if (keyWordForVoucherCode.value == "") {
			cashTableList.value = primaryCashTableList.value
			return
		}
		cashTableList.value = arr.filter(e => {
			return e.code
				.toLowerCase()
				.includes(keyWordForVoucherCode.value.toLocaleLowerCase())
		})
	} else {
		let arr = [...primaryCashTableList.value, ...primaryBankTableList.value]
		if (keyWordForVoucherCode.value == "") {
			allVoucherList.value = [
				...primaryCashTableList.value,
				...primaryBankTableList.value,
			]
			return
		}
		allVoucherList.value = arr.filter(e => {
			return e.code
				.toLowerCase()
				.includes(keyWordForVoucherCode.value.toLocaleLowerCase())
		})
	}
}
const prepareFormForRefund = () => {
	let data = {}

	if (selectedVoucher.value) {
		data.code = selectedVoucher.value.code
		data.refundVoucherId = selectedVoucher.value._id
		data.cashBackAmount = refundAmount.value
	} else {
		return console.log("voucher is required")
	}
	data.date = dateForParams(refundDate.value)
	if (refundRemark.value) {
		data.remark = refundRemark.value
	}
	if (refundAccType.value == "bank" && selectedBankAccount.value) {
		data.refundAccount = selectedBankAccount.value
		console.log(selectedBankAccount.value)
	} else if (refundAccType.value == "cash" && selectedCashAccount.value) {
		data.refundAccount = selectedCashAccount.value
		console.log(selectedCashAccount.value)
	}
	data.type = refundType.value
	let selections = []
	selectedVoucher.value.relatedTreatmentSelection.map(e => {
		selections.push({ id: e._id })
	})
	console.log(selectedVoucher.value)
	let relatedMedicineItems = []
	if (selectedVoucher.value.tsType == "MS") {
		selectedVoucher.value.medicineItems.map(e => {
			relatedMedicineItems.push({
				item_id: e.item_id._id,
				qty: e.qty,
			})
		})
		data.relatedMedicineItems = relatedMedicineItems
	}

	data.selections = selections

	return data
}
const changeVoucherStatus = () => {
	console.log("change voucher status")
	if (voucherStatus.value == "refund") {
		bankTableList.value = primaryBankTableList.value.filter(e => e.Refund)
		cashTableList.value = primaryCashTableList.value.filter(e => e.Refund)
		allVoucherList.value = [...bankTableList.value, ...cashTableList.value]
	} else if (voucherStatus.value == "nonrefund") {
		bankTableList.value = primaryBankTableList.value.filter(e => !e.Refund)
		cashTableList.value = primaryCashTableList.value.filter(e => !e.Refund)
		allVoucherList.value = [...bankTableList.value, ...cashTableList.value]
	} else if (voucherStatus.value == "all") {
		bankTableList.value = primaryBankTableList.value
		cashTableList.value = primaryCashTableList.value
		allVoucherList.value = [...bankTableList.value, ...cashTableList.value]
	}
	console.log(cashTableList.value)
}
const refund = async () => {
	let payload = prepareFormForRefund()
	console.log(payload)
	console.log(JSON.stringify(payload))
	try {
		let res = await refundStore.voucherRefund(payload)
		console.log(res)
		modalCloseBtn.value.click()
		appStore.showSuccess()
	} catch (error) {
		console.log(error)
	} finally {
	}
}
const updateSelectedVoucher = e => {
	selectedVoucher.value = e

	console.log(selectedVoucher.value)
	if (
		selectedVoucher.value.tsType == "TSMulti" ||
		selectedVoucher.value.tsType == "TS"
	) {
		let filteredArr = selectedVoucher.value.relatedTreatmentSelection.filter(
			e => {
				if (e.actualRevenue > 0) {
					return true
				}
			}
		)
		console.log(filteredArr.length)
		if (filteredArr.length > 0) {
			selectedVoucher.value.appointmentStart = true
		} else {
			selectedVoucher.value.appointmentStart = false
		}
	}
	if (
		selectedVoucher.value.tsType == "TSMulti" ||
		selectedVoucher.value.tsType == "Combined"
	) {
		refundAmount.value =
			selectedVoucher.value.totalPaidAmount + selectedVoucher.value.secondAmount
	} else if (selectedVoucher.value.tsType == "MS") {
		refundAmount.value =
			selectedVoucher.value.msPaidAmount + selectedVoucher.value.secondAmount
		refundType.value = "CashBack"
	} else if (selectedVoucher.value.tsType == "PS") {
		refundAmount.value =
			selectedVoucher.value.psPaidAmount + selectedVoucher.value.secondAmount
		refundType.value = "CashBack"
	} else if (selectedVoucher.value.tsType == "TS") {
		refundAmount.value =
			selectedVoucher.value.paidAmount + selectedVoucher.value.secondAmount
		refundType.value = "CashBack"
	}
	openRefundModal()
}
const changeOrder = () => {
	if (orderBy.value == "ascending") {
		ascendingFilter()
	} else {
		descendingFilter()
	}
}
const exportList = () => {
	let src = []
	// if (selectedTab.value == 'bank') src = [...bankTableList.value]
	// if (selectedTab.value == 'cash') src = [...cashTableList.value]
	if (bankTableList.value.length > 0 || cashTableList.value.length > 0) {
		src = [
			{ type: "banklist" },
			...bankTableList.value,
			{ type: "cashlist" },
			...cashTableList.value,
		]
		console.log(src)
		const data = []
		// if (exportType.value == "voucher") {
		src.map((each, index) => {
			let item = {}
			let paymentMethod = "Not Set"
			if (each.paymentMethod === "FOC") {
				paymentMethod = "FOC"
			} else if (
				each.paymentMethod === "Advanced" ||
				each.relatedBank ||
				each.relatedCash
			) {
				paymentMethod = "Paid"
			} else if (each.paymentMethod === "by Appointment") {
				paymentMethod = "Partial"
			}

			let paymentType
			if (each.relatedBank) {
				paymentType = "Bank"
			} else if (each.relatedCash) {
				paymentType = "Cash"
			} else {
				paymentType = "Not Set"
			}

			let purchaseType
			if (each.purchaseType === "Clinic") {
				purchaseType = "Aesthetic"
			} else {
				purchaseType = each.purchaseType ?? "Not Set"
			}

			let amount
			let totalAmount
			let totalDiscount = 0
			if (each.tsType === "MS") {
				amount = each.msPaidAmount
				totalDiscount = each.totalDiscount || 0
				totalAmount = each.msTotalAmount
			} else if (each.tsType === "TS") {
				amount = each.paidAmount
				totalDiscount = each.discountAmount || 0
				totalAmount = each.relatedTreatment.sellingPrice
			} else if (each.tsType === "TSMulti") {
				amount = each.totalPaidAmount
				totalAmount = each.totalAmount
				totalDiscount = each.totalDiscount || 0
			} else if (each.tsType === "Combined") {
				amount = each.msPaidAmount
				totalDiscount = each.totalDiscount || 0
				totalAmount =
					(each.totalAmount || each.relatedTreatment.sellingPrice) +
					each.msTotalAmount
			} else if (each.tsType === "PS") {
				amount = each.amount
				totalDiscount = each.discountAmount || 0
				totalAmount = each.relatedPackage.totalPrice
			}

			if (each.type === "banklist" && bankTableList.value.length > 0) {
				item = {
					Type: "Bank List",
				}
			} else if (each.type === "cashlist" && cashTableList.value.length > 0) {
				item = {
					Type: "Cash List",
				}
			} else if (each.type !== "banklist" && each.type !== "cashlist") {
				item = {
					Date: each.createdAt ? cusFormatDate(each.createdAt) : "Not Set",
					"Vr No": each.code,
					"Dr Name": each.relatedDoctor?.name ?? "Not Set",
					"Customer Name": each.relatedPatient?.name,
					MedicineName: "",
					TreatmentName: "",
					PackageName: "",
					Quantity: 0,
					"Item Amount": 0,
					"Item Discount": 0,
					"Voucher Discount": totalDiscount,
					"Total Amount": totalAmount,
					"Paid Amount": amount,
					"Balance Amount": totalAmount > amount ? totalAmount - amount : 0,
					MedicineItems: [],
					TreatmentsItems: [],
					Package: [],
					"Purchase Type": purchaseType,
					"Payment Type": paymentType,
					"Bank Type": each.bankType ?? "Not Set",
					"Payment Method": paymentMethod,
					"Sale By": each.createdBy?.givenName,
					"Customer Phone": each.relatedPatient?.phone,
					// "Doctor":  each.relatedTreatmentSelection[0]?.relatedAppointments.length > 0 ? each.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name : 'Not Set',
					Deposit:
						each.relatedTreatmentSelection.deposit >= 0
							? each.relatedTreatmentSelection.deposit
							: "Not Set",
					// "Purchase Type": each.relatedTreatmentSelection.purchaseType
				}
				let treatments = []
				if (each.multiTreatment.length > 0) {
					each.multiTreatment.map(e => {
						let obj = {}
						if (treatments.length == 0) {
							obj.name = e.item_id.name
							obj.qty = e.qty
							obj.price = e.price || 0
							obj._id = e.item_id._id
							obj.discount = e.discountAmount || 0
							treatments.push(obj)
						} else {
							let filterArr = treatments.filter(j => {
								return j._id == e.item_id._id
							})
							if (filterArr.length == 0) {
								obj.name = e.item_id.name
								obj.qty = e.qty
								obj.price = e.price || 0
								obj._id = e.item_id._id
								obj.discount = e.discountAmount || 0
								treatments.push(obj)
							} else {
								filterArr[0].qty += 1
								filterArr[0].price += e.price
							}
						}
					})
				}
				let packages = []
				if (each?.relatedPackage?.name) {
					packages.push({
						name: each.relatedPackage.name,
						qty: 1,
						price: each.relatedPackage.totalPrice,
						_id: each.relatedPackage._id,
						discount: 0,
					})
				}

				if (each?.tsType == "TS" && each?.relatedTreatment?.name) {
					treatments.push({
						name: each.relatedTreatment.name,
						qty: 1,
						price: each.sellingPrice,
						_id: each.relatedTreatment._id,
						discount: 0,
					})
				}
				let medicines = []
				// each.medicineItems.map(e => {
				// let obj = {}

				// medicines.push(e.item_id.medicineItemName + ` - (${e.qty})`)
				each.medicineItems.map(e => {
					let obj = {}

					obj.name = e.item_id.medicineItemName
					obj.qty = e.qty
					obj.price = e.price || 0
					obj._id = e._id
					obj.discount = e.discountAmount || 0
					medicines.push(obj)
				})
				// })
				// let arr = ["one", "one", "two", "two", "three"]

				// console.log(resultArray)
				if (packages.length > 0) {
					item.Package = packages
				}
				if (medicines.length > 0) {
					item.MedicineItems = medicines
				}

				if (treatments.length > 0) {
					item.TreatmentsItems = treatments
				}
			} else {
				return
			}

			data.push(item)
		})
		console.log(data)
		let dataForExport = []
		data.map(item => {
			// if ("Type" in item) {
			// 	dataForExport.push(item)
			// } else {
			if (item?.MedicineItems?.length > 0) {
				let modalObj = { ...item }
				delete modalObj.MedicineItems
				delete modalObj.TreatmentsItems
				delete modalObj.Package

				item.MedicineItems.map((e, i) => {
					let copyObj = { ...modalObj }
					copyObj.MedicineName = e.name
					copyObj.Quantity = e.qty
					copyObj["Item Discount"] = e.discount
					copyObj["Item Amount"] = e.price
					if (i > 0) {
						delete copyObj["Paid Amount"]
						delete copyObj["Total Amount"]

						delete copyObj["Balance Amount"]
					}
					dataForExport.push(copyObj)
				})
			}
			if (item?.TreatmentsItems?.length > 0) {
				let modalObj = { ...item }
				delete modalObj.MedicineItems
				delete modalObj.TreatmentsItems
				delete modalObj.Package

				item.TreatmentsItems.map((e, i) => {
					let copyObj = { ...modalObj }
					copyObj.TreatmentName = e.name
					copyObj.Quantity = e.qty
					copyObj["Item Discount"] = e?.discount || 0
					copyObj["Item Amount"] = e.price
					if (i > 0) {
						delete copyObj["Paid Amount"]
						delete copyObj["Total Amount"]
						delete copyObj["Balance Amount"]
					}
					dataForExport.push(copyObj)
				})
			}
			if (item?.Package?.length > 0) {
				let modalObj = { ...item }
				delete modalObj.MedicineItems
				delete modalObj.TreatmentsItems
				delete modalObj.Package

				item.Package.map((e, i) => {
					let copyObj = { ...modalObj }
					copyObj.PackageName = e.name
					copyObj.Quantity = e.qty
					copyObj["Item Discount"] = e?.discount || 0
					copyObj["Item Amount"] = e.price
					if (i > 0) {
						delete copyObj["Paid Amount"]
						delete copyObj["Total Amount"]
						delete copyObj["Balance Amount"]
					}
					dataForExport.push(copyObj)
				})
			}
			// }
		})
		console.log(dataForExport)
		// return
		exportData(dataForExport, "TreatmentVoucherList.xlsx")
		//exportData(data, "TreatmentVoucherList.xlsx")

		// } else if (exportType.value == "item") {
		// 	src.map((each, index) => {
		// 		if (each.type === "banklist" && bankTableList.value.length > 0) {
		// 			item = {
		// 				Type: "Bank List",
		// 			}
		// 		} else if (each.type === "cashlist" && cashTableList.value.length > 0) {
		// 			item = {
		// 				Type: "Cash List",
		// 			}
		// 		} else if (each.type !== "banklist" && each.type !== "cashlist") {
		// 			item = {
		// 				Date: each.createdAt ? cusFormatDate(each.createdAt) : "Not Set",
		// 				Code: each.code,

		// 				"Customer Name": each.relatedPatient?.name,
		// 				// "Doctor":  each.relatedTreatmentSelection[0]?.relatedAppointments.length > 0 ? each.relatedTreatmentSelection[0].relatedAppointments[0]?.relatedDoctor?.name : 'Not Set',
		// 				// Doctor: each.relatedDoctor?.name ?? "Not Set",
		// 				// "Purchase Type": each.relatedTreatmentSelection.purchaseType
		// 				MedicineItems: "",
		// 				TreatmentsItems: "",
		// 				Amount: "",
		// 			}
		// 			let treatments = []
		// 			each.multiTreatment.map(e => {
		// 				treatments.push(e.item_id.name)
		// 			})
		// 			let medicines = []
		// 			each.medicineItems.map(e => {
		// 				medicines.push(e.item_id.medicineItemName)
		// 			})
		// 			let arr = ["one", "one", "two", "two", "three"]

		// 			// Create an object to store the count of each element
		// 			let countMapForTreatment = {}
		// 			let countMapForMedicine = {}

		// 			// Count the occurrences of each element in the array
		// 			treatments.forEach(element => {
		// 				countMapForTreatment[element] =
		// 					(countMapForTreatment[element] || 0) + 1
		// 			})
		// 			medicines.forEach(element => {
		// 				countMapForMedicine[element] =
		// 					(countMapForMedicine[element] || 0) + 1
		// 			})
		// 			// Create a new array based on the countMap
		// 			let treatmentText = Object.keys(countMapForTreatment).map(
		// 				key => `${key}-${countMapForTreatment[key]}`
		// 			)
		// 			let medicineText = Object.keys(countMapForMedicine).map(
		// 				key =>
		// 					`${key}- (${countMapForMedicine[key]}) time${
		// 						countMapForMedicine[key] > 1 ? "s" : ""
		// 					}`
		// 			)

		// 			// console.log(resultArray)
		// 			if (medicines.length > 0) {
		// 				item.MedicineItems = medicineText.join(" , ")
		// 			}
		// 			if (treatments.length > 0) {
		// 				item.TreatmentsItems = treatmentText.join(" , ")
		// 			}
		// 			item.Amount = amount
		// 		} else {
		// 			return
		// 		}

		// 		data.push(item)
		// 	})
		// 	console.log(data)

		// 	exportData(data, "ItemList.xlsx")
		// }
	}
}
const openRefundModal = () => {
	let useTotal = 0

	if (selectedVoucher.value.tsType == "TSMulti") {
		// relatedTreatmentSelection
		if (selectedVoucher.value.relatedTreatmentSelection.length > 0) {
			selectedVoucher.value.relatedTreatmentSelection.map(e => {
				useTotal += e.actualRevenue || 0
				console.log(e.actualRevenue)
			})
		}
	}
	console.log(refundAmount.value, useTotal)
	refundAmount.value = refundAmount.value - Math.round(useTotal) || 0
}
const reload = async () => {
	filter.value = {
		tsType: null,
		startDate: null,
		endDate: null,
		relatedDoctor: null,
		relatedPatient: null,
		createdBy: null,
		bankType: null, // 'Normal', 'POS', 'Pay'
		bankID: null,
		purchaseType: null, // 'Clinic', 'Surgery'x
	}

	await fetchTreatmentVouchers()
}

const updateSelectedFilterDoctor = e => {
	filter.value.relatedDoctor = { ...e }
}

const updateSelectedFilterUser = e => {
	filter.value.createdBy = { ...e }
}
const ascendingFilter = () => {
	bankTableList.value.sort(function (a, b) {
		return a.seq - b.seq
	})
	cashTableList.value.sort(function (a, b) {
		return a.seq - b.seq
	})
	allVoucherList.value.sort(function (a, b) {
		return a.seq - b.seq
	})
}
const goToTreatmentSale = () => {
	let selections = []
	selectedVoucher.value.relatedTreatmentSelection.map(e => {
		selections.push({ id: e._id })
	})
	modalCloseBtn.value.click()
	router.push({
		name: "sale.treatment",
		query: {
			patient: selectedVoucher.value.relatedPatient._id,
			refundAmount: refundAmount.value,
			refundVoucherId: selectedVoucher.value._id,
			selections: JSON.stringify(selections),
		},
	})
}
const descendingFilter = () => {
	bankTableList.value.sort(function (a, b) {
		return b.seq - a.seq
	})
	cashTableList.value.sort(function (a, b) {
		return b.seq - a.seq
	})
	allVoucherList.value.sort(function (a, b) {
		return b.seq - a.seq
	})
}
const updateSelectedFilterPatient = e => {
	filter.value.relatedPatient = { ...e }
}

const fetchTreatmentVouchers = async () => {
	let payload = {}

	if (filter.value.tsType && filter.value.tsType !== "all")
		payload.tsType = filter.value.tsType
	if (filter.value.startDate)
		payload.startDate = dateForParams(filter.value.startDate)
	if (filter.value.endDate)
		payload.endDate = dateForParams(filter.value.endDate)
	if (filter.value.createdBy) payload.createdBy = filter.value.createdBy._id
	if (filter.value.bankType) payload.bankType = filter.value.bankType
	if (filter.value.relatedDoctor)
		payload.relatedDoctor = filter.value.relatedDoctor._id
	if (filter.value.relatedPatient)
		payload.relatedPatient = filter.value.relatedPatient._id
	if (filter.value.bankID) payload.bankID = filter.value.bankID
	if (filter.value.purchaseType)
		payload.purchaseType = filter.value.purchaseType
	console.log(payload.startDate)
	try {
		let res = await treatmentVoucherStore.treatmentVoucherFilter(payload)
		console.log("voucher data", res)
		// treatmentVouchers.value = res.data
		bankTableList.value = res.data.BankList.reverse() ?? []
		cashTableList.value = res.data.CashList.reverse() ?? []
		primaryBankTableList.value = [...bankTableList.value]
		primaryCashTableList.value = [...cashTableList.value]

		allVoucherList.value = [...bankTableList.value, ...cashTableList.value]
		allVoucherListFilter.value = allVoucherList.value.filter(
			e => e.tsType !== "PS" && !e.Refund
		)
		console.log(allVoucherList.value, allVoucherListFilter.value)

		console.log(
			cashTableList.value.filter(e => {
				if (e.tsType == "TS" && !e.relatedTreatmentSelection[0]) {
					return true
				}
			})
		)

		console.log(bankTableList.value)
		cashTotal.value = res.data.CashTotal ?? 0
		bankTotal.value = res.data.BankTotal ?? 0
		let firstCashes = res.data.firstCashNames ?? []
		let firstBanks = res.data.firstBankNames ?? []
		let secondCashes = res.data.secondCashNames ?? []
		let secondBanks = res.data.secondBankNames ?? []
		let cashMergedArray = [...firstCashes, ...secondCashes].reduce(
			(result, current) => {
				let existingItem = result.find(
					item => item.bankname === current.bankname
				)

				if (existingItem) {
					existingItem.amount += current.amount
				} else {
					result.push({ bankname: current.bankname, amount: current.amount })
				}

				return result
			},
			[]
		)
		let bankMergedArray = [...firstBanks, ...secondBanks].reduce(
			(result, current) => {
				let existingItem = result.find(
					item => item.bankname === current.bankname
				)

				if (existingItem) {
					existingItem.amount += current.amount
				} else {
					result.push({ bankname: current.bankname, amount: current.amount })
				}

				return result
			},
			[]
		)
		bankNames.value = bankMergedArray
		cashNames.value = cashMergedArray
		editPermission()
	} catch (error) {
		console.log(error)
		throw error
	}
}

const fetchPatients = async () => {
	try {
		let res = await patientStore.fetchPatients()
		console.log(res)
		patients.value = res.list
	} catch (error) {
		console.log(error)
		throw error
	}
}

const fetchDoctors = async () => {
	try {
		let res = await doctorStore.fetchDoctors()
		console.log(res)
		doctors.value = res.data
	} catch (error) {
		throw error
	}
}

const fetchUsers = async () => {
	try {
		let res = await userStore.fetchUsers()
		users.value = res.list
		console.log(res)
	} catch (err) {
		console.log(err)
		throw err
	}
}

const deleteVoucherList = async item => {
	// console.log('deleting voucher', item)
	isDeleting.value = true
	try {
		if (item.tsType === "MS" || !item.tsType) {
			let payload = {
				id: item._id,
			}
			let res = await treatmentVoucherStore.deleteMedicineVoucher(payload)
			console.log(res)
		} else if (
			item.tsType === "TSMulti" ||
			item.tsType === "TS" ||
			item.tsType === "PS" ||
			item.tsType === "Combined"
		) {
			let payload = {
				id: item._id,
				relatedTreatmentSelection: JSON.stringify(
					item.relatedTreatmentSelection.map(each => each._id)
				),
			}
			let res = await treatmentVoucherStore.deleteTreatmentVoucher(payload)
			console.log(res)
		} else if (item.tsType === "Combined") {
			appStore.showError({
				message: "Deleting combined voucher is currently not available",
			})
		}
		await fetchTreatmentVouchers()
	} catch (err) {
		console.log(err)
	} finally {
		isDeleting.value = false
	}
}

const excelImport = async () => {
	isLoading.value = true
	try {
		let payload = new FormData()
		payload.append("excel", excelImportFile.value.files[0])
		const res = await treatmentVoucherStore.importVoucherExcel(payload)
		console.log(res)
		await fetchTreatmentVouchers()
	} catch (err) {
		console.log(err)
	} finally {
		isLoading.value = false
	}
}

const fetchBankAccounts = async () => {
	try {
		let res = await accountingListStore.fetchAccountingLists()
		bankAccounts.value = res.list.filter(el => {
			let checker = false
			appStore.accountingList.bank.map(bankSet => {
				if (bankSet.code === el.code && bankSet.name === el.subHeader) {
					checker = true
				}
			})

			return checker
		})
	} catch (err) {
		console.log(err)
		throw err
	}
}
// let res = await this.accountingListStore.fetchAccountingLists()

// this.bankAccounts = res.list.filter(el => {
//   let checker = false
//   this.appStore.accountingList.bank.map(bankSet => {
//     if (bankSet.code === el.code && bankSet.name === el.subHeader) {
//       checker = true
//     }
//   })

//   return checker
// })
const resetDateNow = () => {
	dateNow.value = Date.now() + 60 * 60 * 24 * 1000
}
const editPermission = () => {
	console.log(Date.now())
	console.log(Date.now() + 60 * 60 * 24 * 1000)

	if (cashTableList.value.length > 0) {
		cashTableList.value.map(e => {
			if (appStore.user.data.user.email == "maykyimyinttheinpos@gmail.com") {
				e.editPermission = true
			} else {
				if (getTimestamp(e.permissionDate) > dateNow.value) {
					e.editPermission = true
				} else {
					e.editPermission = false
				}
			}
		})
	}
	if (bankTableList.value.length > 0) {
		bankTableList.value.map(e => {
			if (appStore.user.data.user.email == "maykyimyinttheinpos@gmail.com") {
				e.editPermission = true
			} else {
				if (getTimestamp(e.permissionDate) > dateNow.value) {
					e.editPermission = true
				} else {
					e.editPermission = false
				}
			}
		})
	}
	if (allVoucherList.value.length > 0) {
		allVoucherList.value.map(e => {
			if (appStore.user.data.user.email == "maykyimyinttheinpos@gmail.com") {
				e.editPermission = true
			} else {
				if (getTimestamp(e.permissionDate) > dateNow.value) {
					e.editPermission = true
				} else {
					e.editPermission = false
				}
			}
		})
	}
}
onMounted(async () => {
	isLoading.value = true
	dateNow.value = Date.now() + 60 * 60 * 24 * 1000
	try {
		let res = await accountingListStore.fetchAccountingLists()
		cashAccounts.value = res.list.filter(el => {
			if (el._id === appStore.account._id) return el
		})
		await fetchBankAccounts()
		await fetchTreatmentVouchers()
		descendingFilter()
		await fetchDoctors()
		await fetchUsers()
		await fetchPatients()
		console.log(allVoucherList.value.filter(e => e.Refund))
	} catch (error) {
		console.log(error)
	} finally {
		isLoading.value = false
	}
})
</script>

<style lang="scss" scoped>
tr th,
tr td {
	white-space: nowrap;
}
</style>
