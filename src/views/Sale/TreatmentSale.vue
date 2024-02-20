<template>
	<template v-if="isLoading">
		<div>
			<Loading />
		</div>
	</template>
	<template v-else>
		<div class="row">
			<div class="col-12 my-3">
				<h5 class="">Treatment Sale</h5>
			</div>
		</div>

		<div class="row">
			<form ref="treatmentSaleForm" @submit.prevent="">
				<div class="row">
					<div class="col-8">
						<div class="card border-0 rounded shadow-sm p-3 mb-3">
							<div>
								<div class="mb-3">
									<label for="" class="form-label">Purchase Type</label>
									<div class="border rounded p-3">
										<div class="d-flex gap-3">
											<div class="form-check">
												<input
													@change="resetBodyPart"
													class="form-check-input"
													v-model="data.purchaseType"
													value="surgery"
													type="radio"
													id="surgery" />
												<label class="form-check-label" for="surgery">
													Surgery
												</label>
											</div>
											<div class="form-check">
												<input
													@change="resetBodyPart"
													class="form-check-input"
													v-model="data.purchaseType"
													value="aesthetic"
													type="radio"
													id="Aesthetic" />
												<label class="form-check-label" for="Aesthetic">
													Aesthetic
												</label>
											</div>
										</div>
									</div>
								</div>
								<div class="mb-3" v-if="data.purchaseType === 'surgery'">
									<label for="deposit" class="form-label">Deposit</label>
									<input
										v-model="data.deposit"
										id="deposit"
										type="text"
										class="form-control" />
								</div>
								<!-- <div class="mb-3">
									<label for="name" class="form-label">Body Part</label>
									<VueMultiselect
										:model-value="selectedBodyPart"
										@update:model-value="updateSelectedBodyPart"
										:options="filteredBodyParts"
										:searchable="true"
										:close-on-select="true"
										:allow-empty="false"
										:option-height="31"
										label="name"
										track-by="_id" />
								</div>
								<div class="mb-3" v-if="selectMonitor.bodyParts">
									<label class="form-label">Treatment</label>
									<VueMultiselect
										:model-value="selectedTreatmentList"
										@update:model-value="updateSelectedTreatmentList"
										:options="newTreatmentLists"
										:searchable="true"
										:close-on-select="true"
										:allow-empty="false"
										:option-height="31"
										:custom-label="customLabel"
										track-by="_id"
										placeholder="Type to search">
									</VueMultiselect>
								</div> -->
								<div class="mb-3">
									<!-- v-if="selectMonitor.treatment" -->
									<label class="form-label">Treatment Unit</label>

									<VueMultiselect
										:model-value="selectedTreatment"
										:custom-label="treatmentSelectLabel"
										@update:model-value="updateSelectedTreatment"
										:options="newTreatments"
										:searchable="true"
										:close-on-select="true"
										:allow-empty="false"
										:option-height="31"
										label="name"
										track-by="_id" />
								</div>
								<button
									@click="updateSelectedTreatments"
									class="btn btn-primary">
									Add <i class="bi bi-plus-lg"></i>
								</button>
							</div>
							<hr class="my-3" />
							<table class="table table-bordered">
								<thead>
									<tr>
										<th scope="col">#</th>
										<th scope="col">Item name</th>
										<th scope="col" style="width: 100px">Qty</th>
										<th scope="col">Price</th>
										<th scope="col">%</th>
										<th scope="col">Total</th>
										<th scope="col">Action</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item, index) in selectedItems">
										<td>{{ index + 1 }}</td>
										<td>{{ item.name }}</td>
										<td>
											<input
												type="number"
												@change="calculateItemTotal(item, index)"
												v-model="item.qty"
												class="form-control p-0 border-0" />
										</td>
										<td>
											<input
												type="number"
												@change="calculateItemTotal(item, index)"
												v-model="item.price"
												class="form-control p-0 border-0" />
										</td>
										<td class="text-nowrap">
											<button
												type="button"
												class="btn btn-sm btn-primary me-3"
												data-bs-toggle="modal"
												:data-bs-target="'#item_discount' + item.item_id">
												<i class="bi bi-tag"></i>
											</button>
											<!-- tags -->
											<span
												v-if="item.discount && item.discountType !== 'foc'"
												class="badge text-bg-secondary"
												>{{ item.discountValue }}
												{{ item.discountType === "percent" ? "%" : "" }}</span
											>
											<span
												v-if="item.discount && item.discountType == 'foc'"
												class="badge text-bg-secondary"
												>foc</span
											>
											<!-- Item Discount Modal -->
											<div
												class="modal fade"
												:id="'item_discount' + item.item_id"
												tabindex="-1"
												aria-labelledby="item_discountLabel"
												aria-hidden="true">
												<div class="modal-dialog">
													<div class="modal-content w-75">
														<div class="modal-header bg-primary">
															<h5 class="modal-title" id="item_discountLabel">
																Item Discount
															</h5>
															<button
																type="button"
																class="btn-close"
																data-bs-dismiss="modal"
																aria-label="Close"></button>
														</div>
														<div class="modal-body">
															<form @submit.prevent="">
																<div class="mb-3">
																	<label class="form-label">Total Price</label>
																	<input
																		type="number"
																		disabled
																		class="form-control"
																		:id="'total' + item.id"
																		:value="item.price * item.qty" />
																</div>
																<div class="mb-3">
																	<div class="form-check form-check-inline">
																		<input
																			@change="
																				calculateItemDiscount(item, index)
																			"
																			v-model="itemDiscountOption"
																			class="form-check-input"
																			type="radio"
																			id="item_amount"
																			value="amount" />
																		<label
																			class="form-check-label"
																			for="item_amount"
																			>Amount</label
																		>
																	</div>
																	<div class="form-check form-check-inline">
																		<input
																			@change="
																				calculateItemDiscount(item, index)
																			"
																			v-model="itemDiscountOption"
																			class="form-check-input"
																			type="radio"
																			id="item_percent"
																			value="percent" />
																		<label
																			class="form-check-label"
																			for="item_percent"
																			>Percent</label
																		>
																	</div>
																	<div class="form-check form-check-inline">
																		<input
																			@change="
																				calculateItemDiscount(item, index)
																			"
																			v-model="itemDiscountOption"
																			class="form-check-input"
																			type="radio"
																			id="item_foc"
																			value="foc" />
																		<label
																			class="form-check-label"
																			for="item_foc"
																			>Foc</label
																		>
																	</div>
																</div>
																<div
																	v-if="itemDiscountOption == 'amount'"
																	class="mb-3">
																	<label class="form-label"
																		>Discount Amount</label
																	>
																	<input
																		@change="calculateItemDiscount(item, index)"
																		:id="'item_dis_amount' + item.id"
																		v-model="itemDiscount.amountValue"
																		type="number"
																		class="form-control" />
																</div>
																<div
																	v-if="itemDiscountOption == 'percent'"
																	class="mb-3">
																	<label class="form-label"
																		>Discount Percent</label
																	>
																	<input
																		@change="calculateItemDiscount(item, index)"
																		:id="'item_dis_percent' + item.id"
																		type="number"
																		v-model="itemDiscount.percentValue"
																		class="form-control" />
																</div>
																<div class="mb-3">
																	<label class="form-label"
																		>Item Net Total</label
																	>
																	<input
																		v-if="itemDiscountOption === 'foc'"
																		:id="'item_total_discount' + item"
																		type="number"
																		:value="0"
																		class="form-control"
																		disabled />
																	<input
																		v-else
																		:id="'item_total_discount' + item"
																		type="number"
																		:value="
																			this.itemDiscount.subTotal
																				? itemDiscount.subTotal
																				: item.subTotal
																		"
																		class="form-control"
																		disabled />
																</div>
																<div class="d-flex justify-content-end gap-3">
																	<button
																		type="button"
																		class="btn btn-sm btn-danger"
																		data-bs-dismiss="modal">
																		Cancel
																	</button>
																	<button
																		@click="confirmItemDiscount(index)"
																		type="button"
																		data-bs-dismiss="modal"
																		class="btn btn-sm btn-primary">
																		Confirm
																	</button>
																</div>
															</form>
														</div>
													</div>
												</div>
											</div>
											<!-- Item Discount Modal End -->
										</td>
										<td>{{ item.subTotal }}</td>
										<td style="width: 50px">
											<button class="btn btn-danger">
												<i
													@click="removeSelectedItems(index)"
													class="bi bi-dash-lg"></i>
											</button>
										</td>
									</tr>
									<tr v-if="selectedItems.length <= 0">
										<td colspan="7" class="text-center fw-bold">
											No items exist!
										</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<td class="text-center" colspan="5">Total Quantity</td>
										<td class="text-center" colspan="2">
											<input
												id="total_qty"
												:value="saleInfo.quantity"
												type="number"
												class="form-control form-control-sm border-0"
												readonly />
										</td>
									</tr>
									<tr>
										<td class="text-center" colspan="5">Total Price</td>
										<td class="text-center" colspan="2">
											<input
												id="total_price"
												:value="saleInfo.total"
												type="number"
												class="form-control form-control-sm border-0"
												readonly />
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
						<div
							ref="castVoucherDisplay"
							class="card p-3 border-0 rounded shadow-sm d-none">
							<!-- html2canvas is not working without actual content(CastSaleVoucherModal) -->
							<CastSaleVoucherModal
								:paymentMethod="voucherPaymentMethod"
								:treatmentData="treatmentData"
								:customer="selectedCustomer"
								:treatments="selectedItems"
								:invoiceId="voucherId" />
						</div>
					</div>
					<div class="col-4">
						<div class="card p-3 shadow-sm border-0">
							<div>
								<h5 class="mb-3">Customer Info</h5>
								<div class="row align-items-center mb-3">
									<div class="col-12">
										<label for="status" class="form-label">Status</label>
										<select
											class="form-select"
											id="status"
											:disabled="this.$route.query.patient"
											v-model="customerStatus"
											aria-label="Default select example">
											<option selected disabled>Select customer status</option>
											<option value="new">New</option>
											<option value="old">Old</option>
										</select>
									</div>
								</div>

								<template v-if="customerStatus === 'new'">
									<form
										@submit.prevent="createCustomer"
										id="customerCreateForm"
										action="">
										<div class="row align-items-center mb-3">
											<div class="col-4">
												<label>Name</label>
											</div>
											<div class="col-8">
												<input
													for="customerCreateForm"
													type="text"
													class="form-control"
													v-model="newCustomer.name" />
											</div>
										</div>
										<div class="row align-items-center mb-3">
											<div class="col-4">
												<label>Phone</label>
											</div>
											<div class="col-8">
												<input
													for="customerCreateForm"
													type="text"
													class="form-control"
													v-model="newCustomer.phone" />
											</div>
										</div>
										<div class="row align-items-center mb-3">
											<div class="col-4">
												<label>Email</label>
											</div>
											<div class="col-8">
												<input
													for="customerCreateForm"
													type="email"
													class="form-control"
													v-model="newCustomer.email" />
											</div>
										</div>
										<div>
											<button
												type="submit"
												:disabled="creatingCustomer"
												class="btn btn-primary">
												<template v-if="creatingCustomer">
													<div class="d-flex align-items-center gap-3">
														<Spinner />
														<span> Create </span>
													</div>
												</template>
												<template v-else> Create </template>
											</button>
										</div>
									</form>
								</template>
								<template v-if="customerStatus === 'old'">
									<div class="row align-items-center mb-3">
										<div class="col-4">
											<label>Customer</label>
										</div>
										<div class="col-8">
											<VueMultiselect
												:model-value="selectedCustomer"
												@update:model-value="updateSelectedCustomer"
												select-label=""
												:options="customers"
												:searchable="true"
												:close-on-select="true"
												:allow-empty="false"
												label="name"
												:disabled="this.$route.query.patient"
												placeholder="Select one"
												track-by="_id" />
										</div>
									</div>
									<div class="row align-items-center mb-3">
										<div class="col-4">
											<label>Name</label>
										</div>
										<div class="col-8">
											<input
												type="text"
												class="form-control"
												:value="selectedCustomer.name"
												disabled />
										</div>
									</div>
									<div class="row align-items-center mb-3">
										<div class="col-4">
											<label>Phone</label>
										</div>
										<div class="col-8">
											<input
												type="text"
												class="form-control"
												:value="selectedCustomer.phone"
												disabled />
										</div>
									</div>
									<div class="row align-items-center mb-3">
										<div class="col-4">
											<label>Email</label>
										</div>
										<div class="col-8">
											<input
												type="email"
												class="form-control"
												:value="selectedCustomer.email"
												disabled />
										</div>
									</div>
								</template>
							</div>
							<hr class="my-3" />
							<div class="d-flex justify-content-center mb-3 gap-5">
								<div class="d-flex align-content-center">
									<input
										type="radio"
										class="form-check-input me-2"
										name="doctorOrTherapist"
										v-model="doctorOrTherapist"
										@change="changeDoctorOrTherapist()"
										value="doctor"
										id="doctor" />
									<label class="fw-bold fs-5 d-inline" for="doctor"
										>Doctor</label
									>
								</div>
								<div class="d-flex align-content-center">
									<input
										type="radio"
										class="form-check-input me-2"
										id="therapist"
										v-model="doctorOrTherapist"
										@change="changeDoctorOrTherapist()"
										value="therapist"
										name="doctorOrTherapist" />
									<label for="therapist" class="fw-bold fs-5 d-inline"
										>Therapist</label
									>
								</div>
							</div>
							<div class="mb-3" v-show="doctorOrTherapist == 'therapist'">
								<label class="form-label">Therapist</label>
								<div class="mb-3">
									<VueMultiselect
										:model-value="selectedTherapist"
										@update:model-value="updateSelectedTherapist"
										:options="therapists"
										:searchable="true"
										:close-on-select="true"
										:allow-empty="false"
										:option-height="31"
										label="name"
										track-by="_id" />
								</div>
							</div>
							<div class="mb-3" v-show="doctorOrTherapist == 'doctor'">
								<label class="form-label">Doctors</label>
								<div class="mb-3">
									<VueMultiselect
										:model-value="selectedDoctor"
										@update:model-value="updateSelectedDoctor"
										:options="doctors"
										:searchable="true"
										:close-on-select="true"
										:allow-empty="false"
										:option-height="31"
										label="name"
										track-by="_id" />
								</div>
							</div>
							<div class="mb-3">
								<label for="paymentImage" class="form-label"
									>Payment Image</label
								>
								<input
									type="file"
									class="form-control"
									name="payment"
									id="paymentImage" />
							</div>
							<div class="mb-3">
								<label for="remark" class="form-label">Remark</label>
								<input
									type="text"
									v-model="remark"
									class="form-control"
									id="remark" />
							</div>
							<div class="mb-3">
								<label for="remark" class="form-label">Date</label>
								<input
									type="date"
									v-model="date"
									class="form-control"
									id="remark" />
							</div>
							<hr class="my-3" />
							<div class="d-flex justify-content-center mb-3 gap-5">
								<div class="d-flex align-content-center">
									<input
										type="radio"
										class="form-check-input me-2"
										name="paymentMethods"
										v-model="paymentStatus"
										@change="changeSecPayAmount()"
										value="full"
										id="full" />
									<label class="fw-bold fs-5 d-inline" for="full">Full</label>
								</div>
								<div class="d-flex align-content-center">
									<input
										type="radio"
										class="form-check-input me-2"
										id="separate"
										v-model="paymentStatus"
										@change="changeSecPayAmount()"
										value="separate"
										name="paymentMethods" />
									<label for="separate" class="fw-bold fs-5 d-inline"
										>Separate</label
									>
								</div>
							</div>
							<div>
								<h5 class="mb-3">Payment Method</h5>
								<div class="mb-3">
									<select
										class="form-select"
										v-model="paymentMethod"
										:disabled="isPaymentMethodSeparate"
										aria-label="Default select example">
										<option value="cash">Cash</option>
										<option value="bank">Bank</option>
									</select>
								</div>
								<div v-if="paymentMethod === 'bank'" class="mb-3">
									<label for="bankAccount" class="form-label"
										>Bank Accounts</label
									>
									<select
										id="bankAccount"
										class="form-select"
										v-model="selectedBankAccount"
										:disabled="isPaymentMethodSeparate"
										aria-label="Default select example"
										placeholder="select Account">
										<option v-for="(acc, index) in bankAccounts" :value="acc">
											{{ acc.subHeader }} ({{ acc.code }})
										</option>
									</select>
								</div>
								<div v-if="paymentMethod === 'bank'" class="mb-3">
									<label for="bankAccountType" class="form-label"
										>Bank Payment Type</label
									>
									<select
										id="bankAccountType"
										class="form-select"
										v-model="selectedBankAccountType"
										:disabled="isPaymentMethodSeparate"
										aria-label="Default select example"
										placeholder="select Account">
										<option
											v-for="(acc, index) in bankAccountTypes"
											:value="acc">
											{{ acc.name }}
										</option>
									</select>
								</div>
								<div v-if="paymentMethod === 'cash'" class="mb-3">
									<label for="cashAccount" class="form-label"
										>Cash Accounts</label
									>
									<select
										id="cashAccount"
										class="form-select"
										v-model="selectedCashAccount"
										:disabled="isPaymentMethodSeparate"
										aria-label="Default select example"
										placeholder="select Account">
										<option v-for="(acc, index) in cashAccounts" :value="acc">
											{{ acc.subHeader }} ({{ acc.code }})
										</option>
									</select>
								</div>
								<template v-if="paymentStatus == 'separate'">
									<h5 class="mb-3">Second Payment Method</h5>
									<div class="mb-3">
										<select
											class="form-select"
											v-model="secPaymentMethod"
											:disabled="isPaymentMethodSeparate"
											aria-label="Default select example">
											<option value="cash">Cash</option>
											<option value="bank">Bank</option>
										</select>
									</div>
									<div v-if="secPaymentMethod === 'bank'" class="mb-3">
										<label for="bankAccount" class="form-label"
											>Bank Accounts</label
										>
										<select
											id="bankAccount"
											class="form-select"
											v-model="secSelectedBankAccount"
											aria-label="Default select example"
											:disabled="isPaymentMethodSeparate"
											placeholder="select Account">
											<option v-for="(acc, index) in bankAccounts" :value="acc">
												{{ acc.subHeader }} ({{ acc.code }})
											</option>
										</select>

										<label for="cashAccount" class="form-label"
											>Bank Payment Type</label
										>
										<select
											id="cashAccount"
											class="form-select"
											v-model="secBankType"
											:disabled="treatmentSelection"
											aria-label="Default select example"
											placeholder="select Account">
											<option
												v-for="(acc, index) in bankAccountTypes"
												:key="index"
												:value="acc.value">
												{{ acc.name }}
											</option>
										</select>
									</div>
									<div v-if="secPaymentMethod === 'cash'" class="mb-3">
										<label for="cashAccount" class="form-label"
											>Cash Accounts</label
										>
										<select
											id="cashAccount"
											class="form-select"
											v-model="secSelectedCashAccount"
											:disabled="isPaymentMethodSeparate"
											aria-label="Default select example"
											placeholder="select Account">
											<option v-for="(acc, index) in cashAccounts" :value="acc">
												{{ acc.subHeader }} ({{ acc.code }})
											</option>
										</select>
									</div>
								</template>
							</div>
							<hr class="my-3" />
							<div>
								<h5 class="mb-3">Balance Total</h5>
								<div class="row align-items-center mb-3">
									<div class="col-4">
										<label>Total Amount</label>
									</div>
									<div class="col-8">
										<input
											type="text"
											class="form-control"
											:value="saleInfo.total"
											disabled />
									</div>
								</div>
								<div class="row align-items-center mb-3">
									<div class="col-4">
										<label>Discount</label>
									</div>
									<!-- <div class="col-8">
                    <input type="text" class="form-control" :value="saleInfo.discountValue" disabled>
                    <button type="button" class="btn btn-sm btn-primary me-3" data-bs-toggle="modal"
                      :data-bs-target="'#totalDiscount'">
                      <i class="fa-solid fa-tag"></i>
                    </button>
                  </div> -->
									<div class="col-8">
										<div class="input-group">
											<input
												type="text"
												class="form-control"
												:value="saleInfo.discountValue"
												disabled />
											<span
												class="input-group-text bg-primary text-white"
												data-bs-toggle="modal"
												:data-bs-target="'#totalDiscountModal'">
												<template v-if="saleInfo.discountType === 'amount'">
													<i class="bi bi-currency-dollar"></i>
												</template>
												<template v-if="saleInfo.discountType === 'percent'">
													<i class="bi bi-percent"></i>
												</template>
												<template v-else>
													<i class="bi bi-tags"></i>
												</template>
											</span>
											<!-- Total discount Modal -->
											<div
												class="modal fade"
												:id="'totalDiscountModal'"
												tabindex="-1"
												aria-hidden="true">
												<div class="modal-dialog">
													<div class="modal-content w-75">
														<div class="modal-header bg-primary">
															<h5 class="modal-title" id="item_discountLabel">
																Balance Total Discount
															</h5>
															<button
																type="button"
																class="btn-close"
																data-bs-dismiss="modal"
																aria-label="Close"></button>
														</div>
														<div class="modal-body">
															<form
																@submit.prevent="confirmBalanceTotalDiscount">
																<div class="mb-3">
																	<label class="form-label">Total Price</label>
																	<input
																		type="number"
																		disabled
																		class="form-control"
																		:value="saleInfo.total" />
																</div>
																<div class="mb-3">
																	<div class="form-check form-check-inline">
																		<input
																			@change="calculateBalanceTotalDiscount"
																			v-model="balanceTotalDiscountOption"
																			class="form-check-input"
																			type="radio"
																			id="item_amount"
																			value="amount"
																			checked />
																		<label
																			class="form-check-label"
																			for="item_amount"
																			>Amount</label
																		>
																	</div>
																	<div class="form-check form-check-inline">
																		<input
																			@change="calculateBalanceTotalDiscount"
																			v-model="balanceTotalDiscountOption"
																			class="form-check-input"
																			type="radio"
																			id="item_percent"
																			value="percent" />
																		<label
																			class="form-check-label"
																			for="item_percent"
																			>Percent</label
																		>
																	</div>
																	<div class="form-check form-check-inline">
																		<input
																			@change="calculateBalanceTotalDiscount"
																			v-model="balanceTotalDiscountOption"
																			class="form-check-input"
																			type="radio"
																			id="item_foc"
																			value="foc" />
																		<label
																			class="form-check-label"
																			for="item_foc"
																			>Foc</label
																		>
																	</div>
																</div>
																<div
																	v-if="balanceTotalDiscountOption == 'amount'"
																	class="mb-3">
																	<label class="form-label"
																		>Discount Amount</label
																	>
																	<input
																		@change="calculateBalanceTotalDiscount"
																		v-model="balanceTotalDiscount.amountValue"
																		type="number"
																		class="form-control" />
																</div>
																<div
																	v-if="balanceTotalDiscountOption == 'percent'"
																	class="mb-3">
																	<label class="form-label"
																		>Discount Percent</label
																	>
																	<input
																		@change="calculateBalanceTotalDiscount"
																		type="number"
																		v-model="balanceTotalDiscount.percentValue"
																		class="form-control" />
																</div>
																<div class="mb-3">
																	<label class="form-label"
																		>Item Net Total</label
																	>
																	<input
																		v-if="balanceTotalDiscountOption === 'foc'"
																		type="number"
																		:value="0"
																		class="form-control"
																		disabled />
																	<input
																		v-else
																		type="number"
																		:value="
																			this.balanceTotalDiscount.subTotal
																				? balanceTotalDiscount.subTotal
																				: this.saleInfo.total
																		"
																		class="form-control"
																		disabled />
																</div>
																<div class="d-flex justify-content-end gap-3">
																	<button
																		type="button"
																		class="btn btn-sm btn-danger"
																		data-bs-dismiss="modal">
																		Cancel
																	</button>
																	<button
																		@click="confirmBalanceTotalDiscount"
																		type="button"
																		data-bs-dismiss="modal"
																		class="btn btn-sm btn-primary">
																		Confirm
																	</button>
																</div>
															</form>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div
									v-if="this.$route.query.refundAmount"
									class="row align-items-center mb-3">
									<div class="col-4">
										<label>Refund Amount</label>
									</div>
									<div class="col-8">
										<input
											type="text"
											class="form-control"
											:value="this.$route.query.refundAmount"
											disabled />
									</div>
								</div>
								<div class="row align-items-center mb-3">
									<div class="col-4">
										<label>Sub Total</label>
									</div>
									<div class="col-8">
										<input
											type="text"
											class="form-control"
											:value="saleInfo.subTotal"
											disabled />
									</div>
								</div>
								<div
									v-if="this.$route.query.refundAmount"
									class="row align-items-center mb-3">
									<div class="col-4">
										<label>Require Amount</label>
									</div>
									<div class="col-8">
										<input
											type="text"
											class="form-control"
											:value="
												saleInfo.subTotal > this.$route.query.refundAmount
													? saleInfo.subTotal - this.$route.query.refundAmount
													: 0
											"
											disabled />
									</div>
								</div>
								<div
									v-if="this.$route.query.refundAmount"
									class="row align-items-center mb-3">
									<div class="col-4">
										<label> Pay amount</label>
									</div>
									<div class="col-8">
										<input
											@change="
												() => {
													saleInfo.payAmount =
														+this.$route.query.refundAmount + +refundPayAmount
													calculateBalanceTotal()
												}
											"
											type="number"
											class="form-control"
											v-model="refundPayAmount" />
									</div>
								</div>
								<div v-else class="row align-items-center mb-3">
									<div class="col-4">
										<label>Pay amount</label>
									</div>
									<div class="col-8">
										<input
											@keyup="calculateBalanceTotal"
											type="number"
											class="form-control"
											v-model="saleInfo.payAmount" />
									</div>
								</div>
								<div
									v-if="paymentStatus == 'separate'"
									class="row align-items-center mb-3">
									<div class="col-4">
										<label>Second Pay amount</label>
									</div>
									<div class="col-8">
										<input
											@change="calculateBalanceTotal"
											type="number"
											class="form-control"
											v-model="saleInfo.secPayAmount" />
									</div>
								</div>
								<div class="row align-items-center mb-3">
									<div class="col-4">
										<label>Balance</label>
									</div>
									<div class="col-8">
										<input
											type="text"
											class="form-control"
											:value="saleInfo.balance"
											disabled />
									</div>
								</div>
								<div class="row align-items-center mb-3">
									<div class="col-4">
										<label>Change</label>
									</div>
									<div class="col-8">
										<input
											type="text"
											class="form-control"
											:value="saleInfo.change"
											disabled />
									</div>
								</div>
							</div>
							<hr class="my-3" />
							<div class="mb-3">
								<div class="form-check">
									<input
										class="form-check-input"
										type="checkbox"
										v-model="data.sendEmail"
										id="sendEmail" />
									<label class="form-check-label" for="sendEmail">
										Send Email
									</label>
								</div>
							</div>
							<div class="d-flex align-items-center">
								<!-- <button @click="voucherType = 'a5'" class="btn me-3" :class="{ 'btn-primary': voucherType == 'a5' }">
                  A5
                </button>
                <button @click="voucherType = 'slip'" class="btn" :class="{ 'btn-primary': voucherType == 'slip' }">
                  Slip
                </button> -->
								<button
									class="ms-auto btn btn-secondary d-none d-sm-none d-md-block d-lg-inline-block"
									type="button"
									@click="showSaleVoucherModal">
									<span><i class="bi bi-eye"></i></span>
								</button>
							</div>
							<hr class="my-3" />
							<!-- <template v-if="!this.$route.query.voucherId"> -->
							<div class="d-flex align-items-center">
								<button
									@click="printVoucher"
									:disabled="storingVoucher"
									class="btn btn-primary me-3">
									<template v-if="storingVoucher">
										<div class="d-flex align-items-center gap-3">
											<Spinner />
											<span> Print </span>
										</div>
									</template>
									<template v-else> Print </template>
								</button>
								<button
									@click="storeVoucher"
									:disabled="storingVoucher"
									class="btn btn-primary">
									<template v-if="storingVoucher">
										<div class="d-flex align-items-center gap-3">
											<Spinner />
											<span> Store </span>
										</div>
									</template>
									<template v-else> Store </template>
								</button>
								<SaleVoucherModal
									:paymentAccData="paymentAccData"
									:paymentMethod="voucherPaymentMethod"
									:treatmentData="treatmentData"
									:customer="selectedCustomer"
									:treatments="selectedItems"
									:invoiceId="voucherId" />
							</div>
							<!-- </template> -->
							<!-- <template v-else>
                <div class="d-flex align-items-center">
                  <button @click="printVoucher" :disabled="storingVoucher" class="btn btn-primary me-3">
                    <template v-if="storingVoucher">
                      <div class="d-flex align-items-center gap-3">
                        <Spinner />
                        <span> Print </span>
                      </div>
                    </template>
                    <template v-else> Print </template>
                  </button>
                  <button @click="storeVoucher" :disabled="storingVoucher" class="btn btn-primary">
                    <template v-if="storingVoucher">
                      <div class="d-flex align-items-center gap-3">
                        <Spinner />
                        <span> Store </span>
                      </div>
                    </template>
                    <template v-else> Store </template>
                  </button>
                  <SaleVoucherModal :paymentMethod="voucherPaymentMethod" :treatmentData="treatmentData"
                    :customer="selectedCustomer" :treatments="selectedItems" :invoiceId="voucherId" />
                </div>
              </template> -->
						</div>
					</div>
				</div>
			</form>
		</div>
	</template>
</template>

<script>
import VueMultiselect from "vue-multiselect"
import { useRouter } from "vue-router"
import { cusFormatDate, openDialog } from "../../helpers"
import PrintModal from "@/components/Sale/MedicineSale/PrintModal.vue"
import html2canvas from "html2canvas"
import { useAppStore } from "../../stores/app"
import { useRefundStore } from "../../stores/refund"
import { usePatientStore } from "../../stores/patient"
import { useMedicineItemStore } from "../../stores/medicineItems"
import { useAccountingListStore } from "../../stores/accountingList"
import { useMedicineSaleStore } from "../../stores/medicineSale"
import { useIncomeStore } from "../../stores/income"
import Spinner from "../../components/Common/Spinner.vue"
import { useStockStore } from "../../stores/stock"
import { useDoctorStore } from "../../stores/doctor"
import { dateForParams } from "../../helpers"
import { useTreatmentListStore } from "../../stores/treatmentList"
import { useTreatmentSelectionStore } from "../../stores/treatmentSelection"
import SaleVoucherModal from "../../components/General/SaleVoucherModal.vue"
import CastSaleVoucherModal from "../../components/General/CastSaleVoucherModal.vue"
import { responseAfterMultiTreatmentSale } from "../../mock/treatmentSale/treatment"
import itemDiscountHandler from "../../composables/itemDiscountHandler"
import balanceTotalDiscountHandler from "../../composables/balanceTotalDiscountHandler"
import { useTreatmentVoucherStore } from "../../stores/treatmentVoucher"
import { useTreatmentUnitStore } from "../../stores/treatmentUnit"
import { useTherapistStore } from "../../stores/therapist"

export default {
	setup() {
		const router = useRouter()
		const appStore = useAppStore()
		const incomeStore = useIncomeStore()
		const patientStore = usePatientStore()
		const doctorStore = useDoctorStore()
		const medicineItemStore = useMedicineItemStore()
		const treatmentUnitStore = useTreatmentUnitStore()
		const accountingListStore = useAccountingListStore()
		const medicineSaleStore = useMedicineSaleStore()
		const treatmentListStore = useTreatmentListStore()
		const treatmentSelectionStore = useTreatmentSelectionStore()
		const stockStore = useStockStore()
		const refundStore = useRefundStore()
		const therapistStore = useTherapistStore()
		const treatmentVoucherStore = useTreatmentVoucherStore()
		const {
			itemDiscount,
			itemDiscountOption,
			calculateItemDiscount,
			resetItemDiscountData,
		} = itemDiscountHandler
		const {
			calculateBalanceTotal,
			calculateBalanceTotalDiscount,
			confirmBalanceTotalDiscount,
			saleInfo,
			balanceTotalDiscount,
			balanceTotalDiscountOption,
			resetBalanceTotalData,
		} = balanceTotalDiscountHandler
		return {
			therapistStore,
			router,
			appStore,
			incomeStore,
			refundStore,
			treatmentVoucherStore,
			patientStore,
			medicineItemStore,
			accountingListStore,
			medicineSaleStore,
			stockStore,
			treatmentListStore,
			treatmentSelectionStore,
			itemDiscount,
			itemDiscountOption,
			resetItemDiscountData,
			calculateItemDiscount,
			calculateBalanceTotal,
			calculateBalanceTotalDiscount,
			confirmBalanceTotalDiscount,
			saleInfo,
			balanceTotalDiscount,
			balanceTotalDiscountOption,
			treatmentUnitStore,
			resetBalanceTotalData,
			doctorStore,
		}
	},
	components: {
		VueMultiselect,
		PrintModal,
		Spinner,
		SaleVoucherModal,
		CastSaleVoucherModal,
	},
	data() {
		return {
			selectedTherapist: {},
			selectMonitor: {
				bodyParts: "",
				treatment: "",
				treatmentUnit: "",
			},
			bodyParts: [
				{
					_id: 0,
					name: "Face",
					name: "Treatment",
				},
				{
					_id: 1,
					name: "Body",
					name: "Injection",
				},
				{
					_id: 2,
					name: "Hair,Combine Tre & Facial",
				},
				// {
				//   _id: 3,
				//   name: "Combination Package",
				// },
				{
					_id: 4,
					name: "Surgery Price List",
				},
			],
			data: {
				purchaseType: "surgery",
				deposit: 0,
				sendEmail: false,
				imageFile: null,
			},
			doctorOrTherapist: "doctor",
			customTreatmentList: [],
			treatmentLists: [],
			newTreatmentLists: [],
			selectedTreatmentList: {},
			selectedTreatment: {},
			selectedTreatments: [],
			fetchingTreatment: false,
			refundPayAmount: 0,
			selectedBankAccountType: {
				name: "Normal",
				value: "Normal",
			},
			bankAccountTypes: [
				{
					name: "Pos",
					value: "POS",
				},
				{
					name: "Normal",
					value: "Normal",
				},
				{
					name: "Pay",
					value: "Pay",
				},
			],
			newTreatments: [],
			//
			customerStatus: "new",
			newCustomer: {
				name: "",
				phone: "",
				email: "",
			},
			therapists: [],
			isLoading: true,
			barcodeOn: false,
			items: [],
			selectedItem: {},
			selectedItems: [],
			isPaymentMethodSeparate: false,
			customers: [],
			doctors: [],
			selectedCustomer: {},
			selectedDoctor: null,
			voucherData: {},
			remark: "",
			bankAccounts: [],
			selectedBankAccount: {},
			cashAccounts: [],
			selectedCashAccount: {},
			paymentMethod: "cash",
			voucherType: "a5",
			storingVoucher: false,
			creatingCustomer: false,
			previousVoucherData: {},
			// related to voucher
			date: "",
			voucherId: "",
			treatmentData: {},
			medicineData: {},
			voucherPaymentMethod: "",
			paymentAccData: { first: "" },
			// end related to voucher

			// for separate payment methods
			paymentStatus: "full",
			secPayAmount: 0,
			secSelectedBankAccount: {},
			secSelectedCashAccount: {},
			secBankType: "Normal",
			secPaymentMethod: "cash",
		}
	},
	computed: {
		filteredBodyParts() {
			if (this.data.purchaseType === "surgery") {
				return this.bodyParts.filter(each => each.name === "Surgery Price List")
			} else if (this.data.purchaseType === "aesthetic") {
				return this.bodyParts.filter(each => each.name !== "Surgery Price List")
			}
			return []
		},
	},
	methods: {
		openDialog,
		closeDialog() {
			let button = document.querySelector("#closeSaleVoucherModal")
			button.click()
		},
		changeSecPayAmount() {
			this.saleInfo.secPayAmount = 0
			this.saleInfo.payAmount = 0
			this.calculateBalanceTotal()
		},
		showSaleVoucherModal() {
			this.prepareVoucherData()
			openDialog("saleVoucherModal")
		},
		// label
		customLabel({ name, code }) {
			if (!name && !code) return "Select Treatment"
			return `${name} – ${code}`
		},
		treatmentSelectLabel({ name, treatmentCode }) {
			if (!name && !treatmentCode) return "Select Treatment Unit"

			return `${name || "not set"} – ${treatmentCode}`
		},
		changeDoctorOrTherapist() {
			console.log(this.doctorOrTherapist)
		},
		// end label
		// updater
		updateSelectedBodyPart(e) {
			this.selectedBodyPart = { ...e }
			this.updateSelectMonitor({ type: "bodyParts", value: e.name })
		},
		updateSelectedDoctor(e) {
			this.selectedDoctor = { ...e }
		},
		updateSelectedTreatment(e) {
			this.selectedTreatment = { ...e }
		},
		updateSelectedTherapist(e) {
			this.selectedTherapist = { ...e }
		},

		updateSelectedTreatments() {
			let alreadyExistIndex = this.selectedItems.findIndex(
				item => item.item_id == this.selectedTreatment._id
			)

			if (Object.keys(this.selectedTreatment).length === 0) return
			// let item = {
			// 	item_id: this.selectedTreatment._id,
			// 	name: this.selectedTreatment.name,
			// 	qty: 1,
			// 	price: this.selectedTreatment.sellingPrice,
			// 	subTotal: this.selectedTreatment.sellingPrice,
			// 	discount: 0,
			// }

			// this.customTreatmentList.push(item)
			if (alreadyExistIndex === -1) {
				let item = {
					item_id: this.selectedTreatment._id,
					name: this.selectedTreatment.name,
					qty: 1,
					price: this.selectedTreatment.sellingPrice,
					subTotal: this.selectedTreatment.sellingPrice,
					discount: 0,
					discountValue: 0,
				}

				this.selectedItems.push(item)
			} else {
				this.selectedItems[alreadyExistIndex].qty++
				this.calculateItemTotal(
					this.selectedItems[alreadyExistIndex],
					alreadyExistIndex
				)
			}
			this.calculateTotalQuantity()
			this.calculateTotalPrice()
		},
		async updateSelectMonitor(payload) {
			if (payload.type === "bodyParts") {
				this.selectMonitor.bodyParts = payload.value

				this.newTreatmentLists = []
				this.selectMonitor.treatment = ""
				this.selectMonitor.treatmentUnit = ""
				this.selectedTreatmentList = {}
				this.selectedTreatment = {}

				this.treatmentLists.map(item => {
					if (item.bodyParts == payload.value) {
						this.newTreatmentLists.push(item)
					}
				})
			}

			if (payload.type === "treatment") {
				this.selectMonitor.treatment = payload.type
				this.fetchingTreatment = true
				try {
					let res = await this.treatmentListStore.fetchRelatedTreatments({
						id: payload.value,
					})
					this.newTreatments = res.data
				} catch (error) {
					console.log(error)
					this.newTreatments = []
				} finally {
					this.fetchingTreatment = false
				}
				this.selectedTreatment = {}
			}
		},
		updateSelectedTreatmentList(e) {
			this.selectedTreatmentList = { ...e }
			this.updateSelectMonitor({ type: "treatment", value: e._id })
		},
		updateSelectedCustomer(e) {
			this.selectedCustomer = { ...e }
		},
		// end updater
		// treatment
		// calculater
		calculateTotalPrice() {
			this.saleInfo.total = this.selectedItems.reduce(
				(sum, item) => sum + item.subTotal,
				0
			)
			this.calculateBalanceTotal()
		},
		calculateTotalQuantity() {
			this.saleInfo.quantity = this.selectedItems.reduce(
				(sum, item) => sum + item.qty,
				0
			)
		},
		calculateItemTotal(item, index) {
			let type = item.discountType
			let originalItem = this.selectedItems[index]
			let total = item.price * item.qty
			if (type == "amount") {
				originalItem.subTotal = total - item.discountValue
			} else if (type == "percent") {
				originalItem.subTotal = Math.round(
					total - total / (item.discountValue * 100)
				)
			} else if (type == "foc") {
				originalItem.subTotal = 0
			} else {
				originalItem.subTotal = item.price * item.qty
			}

			this.calculateTotalPrice()
			this.calculateTotalQuantity()
		},
		// end calculater
		// prepare
		prepareTreatmentVoucherForm() {
			let formData = this.prepareFormData()
			formData.append(
				"relatedTreatmentSelection",
				JSON.stringify(
					this.previousVoucherData.relatedTreatmentSelection.map(
						each => each._id
					)
				).toString()
			)
			formData.append("id", this.$route.query.voucherId)
			return formData
		},
		prepareEmailForm() {
			let formData = {
				recipent: this.selectedCustomer.email,
				voucherType: "Treatment Sale",
				voucherNo: this.voucherId,
				voucherDate: dateForParams(),
			}

			console.log(formData)

			let newFormData = new FormData()

			for (let key in formData) {
				if (formData.hasOwnProperty(key)) {
					newFormData.append(key, formData[key])
				}
			}
			if (this.data.imageFile) newFormData.append("file", this.data.imageFile)
			return newFormData
		},
		prepareVoucherData(data) {
			this.treatmentData = {
				paidAmount: this.saleInfo.payAmount,
				totalAmount: this.saleInfo.total,
				secondAmount: this.saleInfo.secPayAmount,
				discount: this.saleInfo.discountValue,
				deposit:
					this.data.purchaseType === "surgery" ? this.data.deposit : undefined,
			}
			this.voucherPaymentMethod = this.paymentMethod
			this.voucherId = data ? data.treatmentVoucherResult[0].code : "N/A"
			if (this.paymentMethod == "cash") {
				this.paymentAccData.first = `${this.selectedCashAccount.subHeader}`
			} else {
				this.paymentAccData.first = `${this.selectedBankAccount.subHeader}`
			}
			if (this.paymentStatus == "separate") {
				if (this.secPaymentMethod == "cash") {
					this.paymentAccData.second = `${this.secSelectedCashAccount.subHeader}`
				} else {
					this.paymentAccData.second = `${this.secSelectedBankAccount.subHeader}`
				}
			}
			console.log(this.paymentAccData)
		},
		prepareFormData() {
			let arr = [...this.selectedItems]
			function duplicateItems(array) {
				let result = []
				array.forEach(item => {
					for (let i = 0; i < item.qty; i++) {
						let obj = {
							item_id: item.item_id,
							qty: 1,
							price: item.price,
							discountValue: 0,
						}
						if (i == 0) {
							obj.discountValue = item.discountValue
						}
						result.push(obj)
					}
				})
				return result
			}

			// Duplicate items in the array
			arr = duplicateItems(arr)

			console.log(this.selectedItems, arr)
			let selectedItems = arr.map(item => {
				console.log(item)
				return {
					item_id: item.item_id,
					qty: 1,
					price: item.price,
					discountAmount: item.discountValue,
				}
			})

			let purchaseType = false
			if (this.data.purchaseType === "surgery") purchaseType = "Surgery"
			if (this.data.purchaseType === "aesthetic") purchaseType = "Clinic"

			let formData = {
				createdAt: dateForParams(this.date),
				relatedPatient: this.selectedCustomer._id,
				tsType: "TSMulti", // "TSM, TSMulti"
				totalAmount: this.saleInfo.total,
				// relatedDoctor: this.selectedDoctor
				// 	? this.selectedDoctor._id
				// 	: this.appStore.defaultDoctor._id,
				paymentMethod: "Cash Down",
				purchaseType: purchaseType,
				totalPaidAmount: this.saleInfo.payAmount,
				totalDiscount: this.saleInfo.total - this.saleInfo.subTotal,
				paymentType: this.paymentMethod === "bank" ? "Bank" : "Cash",
				VoucherCode: this.voucherData.code,
				// relatedDiscount: "id",
				// relatedDoctor: "id",
				// multiTreatment: [
				//   {
				//     item_id: "id",
				//     discountAmount: "Number",
				//     price: "Number",
				//     qty: "Number",
				//   },
				// ],
			}
			if (this.doctorOrTherapist == "doctor") {
				formData.relatedDoctor = this.selectedDoctor
					? this.selectedDoctor._id
					: this.appStore.defaultDoctor._id
			} else {
				formData.relatedTherapist = this.selectedTherapist._id
			}
			if (
				this.saleInfo.subTotal >
				this.saleInfo.payAmount + this.saleInfo.secPayAmount
			) {
				formData.balance =
					this.saleInfo.subTotal -
					(this.saleInfo.payAmount + this.saleInfo.secPayAmount)
			} else {
				formData.balance = 0
			}
			if (this.$route.query.refundAmount) {
				formData.refundAmount = this.$route.query.refundAmount
				formData.refundVoucherId = this.$route.query.refundVoucherId
				formData.date = dateForParams(this.date)
				formData.newTreatmentVoucherCode = this.voucherData.code
				formData.treatmentReturn = true
			} else {
				formData.treatmentReturn = false
			}

			if (this.data.purchaseType === "surgery")
				formData.deposit = this.data.deposit
			if (formData.balance > 0) {
				formData.paymentMethod = "Partial"
			} else {
				formData.paymentMethod = "Paid"
			}
			if (this.remark) formData.remark = this.remark
			if (this.paymentMethod === "bank")
				formData.bankType = this.selectedBankAccountType.value

			if (this.paymentMethod == "bank") {
				formData.relatedBank = this.selectedBankAccount._id
			} else {
				formData.relatedCash = this.selectedCashAccount._id
			}
			if (this.paymentStatus == "separate") {
				formData.secondAmount = this.saleInfo.secPayAmount
				formData.isDouble = true
				if (this.secPaymentMethod == "cash") {
					formData.secondAccount = this.secSelectedCashAccount._id
				} else {
					formData.secondAccount = this.secSelectedBankAccount._id
				}
			} else {
				formData.secondAmount = 0
				formData.isDouble = false
			}

			console.log(formData)

			let newFormData = new FormData(this.$refs.treatmentSaleForm)

			for (let key in formData) {
				if (formData.hasOwnProperty(key)) {
					newFormData.append(key, formData[key])
				}
			}

			newFormData.append("multiTreatment", JSON.stringify(selectedItems))
			return newFormData
		},
		// end prepare
		// request
		async generateImage() {
			this.$refs.castVoucherDisplay.classList.remove("d-none")
			const content = await document.querySelector("#castSaleVoucherCard")
			const canvas = await html2canvas(content, {
				width: content.scrollWidth + 20,
				height: content.scrollHeight + 20,
			})
			this.$refs.castVoucherDisplay.classList.add("d-none")
			const imageData = canvas.toDataURL("image/png")
			this.data.imageFile = imageData
		},
		async storeVoucher() {
			let formData = this.prepareFormData()
			for (const pair of formData.entries()) {
				if (pair[0] == "multiTreatment") {
					console.log(`${pair[0]}, ${pair[1]}`)
				}
			}
			// return
			this.storingVoucher = true
			try {
				let res = {}
				if (this.$route.query.voucherId) {
					let newFormData = this.prepareTreatmentVoucherForm()
					res = await this.treatmentVoucherStore.updateTreatmentVoucher(
						newFormData
					)
					res = {
						treatmentVoucherResult: [res.data],
					}
				} else {
					let newFormData = this.prepareFormData()
					res = await this.treatmentSelectionStore.addMultiTreatmentSelection(
						newFormData
					)
					this.createIncome()
				}
				console.log(res)
				if (res) {
					this.prepareVoucherData(res)
					if (this.data.sendEmail) {
						await this.sendEmail()
					}
				}
				if (this.$route.query.refundVoucherId) {
					let data = {
						refundVoucherId: this.$route.query.refundVoucherId,
						newTreatmentVoucherId: res.treatmentVoucherResult[0]._id,
					}
					let refundRes = await this.refundStore.voucherRefund(data)
					console.log(refundRes)
				}
				this.appStore.showSuccess()
				this.$router.push({ name: "sale.vouchers-list" })
			} catch (err) {
				this.appStore.showError()
				console.log(err)
			} finally {
				this.storingVoucher = false
			}
		},
		async createIncome() {
			let startDate
			if (this.date) {
				startDate = new Date(this.date)
			} else {
				startDate = new Date()
			}
			startDate.setHours(0, 0, 0, 0)
			let day = 59 * 60 * 24 * 1000
			let endDate = new Date(startDate.getTime() + day)
			console.log(startDate, endDate)
			let incomeRes = await this.incomeStore.createIncome({
				startDate,
				endDate,
			})
			console.log(incomeRes)
		},
		async printVoucher() {
			let res = {}
			// return console.log(newFormData)
			this.storingVoucher = true
			try {
				if (this.$route.query.voucherId) {
					let newFormData = this.prepareTreatmentVoucherForm()
					res = await this.treatmentVoucherStore.updateTreatmentVoucher(
						newFormData
					)
					res = {
						treatmentVoucherResult: [res.data],
					}
				} else {
					let newFormData = this.prepareFormData()
					res = await this.treatmentSelectionStore.addMultiTreatmentSelection(
						newFormData
					)
					this.createIncome()
				}
				this.appStore.showSuccess()
				console.log(res)
				if (res) {
					this.prepareVoucherData(res)
					if (this.data.sendEmail) {
						await this.sendEmail()
						this.appStore.showSuccess()
					}
					this.openDialog("saleVoucherModal")
					this.$router.push({ name: "sale.vouchers-list" })
				}
			} catch (err) {
				this.appStore.showError()
				console.log(err)
			} finally {
				this.storingVoucher = false
			}
		},
		async sendEmail() {
			await this.generateImage()
			let payload = this.prepareEmailForm()
			try {
				let res = await this.treatmentSelectionStore.sendEmail(payload)
				console.log("sending email")
				console.log(res)
			} catch (error) {
				console.log(error)
				throw error
			}
		},
		async getTreatmentLists() {
			try {
				let res = await this.treatmentListStore.fetchTreatmentLists()
				this.treatmentLists = res.list
				console.log(res)
			} catch (error) {
				console.log(error)
				throw error
			}
		},
		// yes customer and patient are the same (need to be consistent)
		async createCustomer() {
			this.creatingCustomer = true
			if (!(this.newCustomer.name && this.newCustomer.name.length > 0)) {
				return this.appStore.showError({ message: "Customer name is required" })
			}

			if (!(this.newCustomer.phone && this.newCustomer.phone.length > 0)) {
				return this.appStore.showError({
					message: "Customer phone is required",
				})
			}

			if (!(this.newCustomer.email && this.newCustomer.email.length > 0)) {
				return this.appStore.showError({
					message: "Customer email is required",
				})
			}

			// let formData = new FormData(document.querySelector("#customerCreateForm"))
			let formData = new FormData()
			formData.append("name", this.newCustomer.name)
			formData.append("phone", this.newCustomer.phone)
			formData.append("email", this.newCustomer.email)

			try {
				let res = await this.patientStore.createPatient(formData)
				this.appStore.showSuccess()
				this.customers.push(res.data)
				this.selectedCustomer = res.data
				this.customerStatus = "old"
			} catch (error) {
				this.appStore.showError()
				console.log(error)
			} finally {
				this.creatingCustomer = false
			}
		},
		// end request
		// others
		reload() {
			window.location.reload()
		},
		toggleMedicineInputType() {
			this.barcodeOn = !this.barcodeOn
		},
		removeSelectedItems(index) {
			this.selectedItems = this.selectedItems.filter(
				(item, itemIndex) => itemIndex !== index
			)
			this.calculateTotalPrice()
			this.calculateTotalQuantity()
		},
		confirmItemDiscount(index) {
			this.selectedItems[index].discount = true
			this.selectedItems[index].discountType = this.itemDiscount.type

			if (this.itemDiscount.type === "amount") {
				this.selectedItems[index].discountValue = this.itemDiscount.amountValue
			} else if (this.itemDiscount.type === "percent") {
				this.selectedItems[index].discountValue = this.itemDiscount.percentValue
			} else {
				this.selectedItems[index].discountValue = 0
			}

			this.selectedItems[index].subTotal = this.itemDiscount.subTotal
			this.selectedItems[index].discountValue =
				this.selectedItems[index].price * this.selectedItems[index].qty -
				this.selectedItems[index].subTotal

			console.log(this.selectedItems[index].discount)

			this.itemDiscount.type = "amount"
			this.itemDiscount.amountValue = 0
			this.itemDiscount.percentValue = 0
			this.itemDiscount.subTotal = 0
			this.itemDiscountOption = "amount"
			// this.customTreatmentList[index].discountValue =
			// 	this.selectedItems[index].discountValue
			this.calculateTotalPrice()
		},
		fillMedicineItems(payload) {
			payload.map(each => {
				let item = {
					item_id: each._id,
					name: each.medicineItemName,
					qty: each.totalQTY,
					price: each.sellingPrice,
					subTotal: each.sellingPrice * each.totalQTY,
					discount: false,
					stock: each.totalUnit,
				}

				this.selectedItems.push(item)
			})

			this.calculateTotalPrice()
			this.calculateTotalQuantity()
		},
		fillTreatmentItems(payload) {
			payload.map(each => {
				// let item = {
				// 	item_id: each.item_id._id,
				// 	name: each.item_id.name,
				// 	qty: each.qty,
				// 	price: each.price,
				// 	subTotal: each.price * each.qty - (each.discountAmount ?? 0),
				// 	discount: each.discountAmount ?? 0,
				// 	discountValue: each.discountAmount ?? 0,
				// }
				// this.customTreatmentList.push(item)
				let alreadyExistIndex = this.selectedItems.findIndex(
					item => item.item_id == each.item_id._id
				)

				// if (Object.keys(this.selectedTreatment).length === 0) return
				// let item = {
				// 	item_id: each.item_id._id,
				// 	name: each.item_id.name,
				// 	qty: each.qty,
				// 	price: each.price,
				// 	subTotal: each.price * each.qty - (each.discountAmount ?? 0),
				// 	discount: each.discountAmount ?? 0,
				// 	discountValue: each.discountAmount ?? 0,
				// }

				// this.customTreatmentList.push(item)
				if (alreadyExistIndex === -1) {
					let item = {
						item_id: each.item_id._id,
						name: each.item_id.name,
						qty: each.qty,
						price: each.price,
						subTotal: each.price * each.qty - (each.discountAmount ?? 0),
						discount: each.discountAmount ?? 0,
						discountValue: each.discountAmount ?? 0,
					}

					this.selectedItems.push(item)
				} else {
					this.selectedItems[alreadyExistIndex].qty++
					this.calculateItemTotal(
						this.selectedItems[alreadyExistIndex],
						alreadyExistIndex
					)
				}
				// this.selectedItems.push(item)
			})

			console.log(payload)
			this.calculateTotalPrice()
			this.calculateTotalQuantity()
		},
		fillPreviousVoucherData() {
			if (this.previousVoucherData.purchaseType === "Clinic") {
				this.data.purchaseType = "aesthetic"
			} else {
				this.data.purchaseType = "surgery"
			}

			this.remark = this.previousVoucherData.remark
			this.data.deposit = this.previousVoucherData.deposit
			this.fillTreatmentItems(this.previousVoucherData.multiTreatment)
			this.customerStatus = "old"
			this.selectedCustomer = this.previousVoucherData.relatedPatient
			if (this.previousVoucherData.relatedCash) {
				this.paymentMethod = "cash"
				this.selectedCashAccount = this.cashAccounts.filter(
					each => each._id === this.previousVoucherData.relatedCash._id
				)[0]
			}
			if (this.previousVoucherData.relatedBank) {
				this.paymentMethod = "bank"
				this.selectedBankAccountType = this.bankAccountTypes.filter(
					each => each.value === this.previousVoucherData.bankType
				)[0]
				this.selectedBankAccount = this.bankAccounts.filter(
					each => each._id === this.previousVoucherData.relatedBank._id
				)[0]
			}
			this.paymentStatus = this.previousVoucherData.isDouble
				? "separate"
				: "full"
			if (this.previousVoucherData.isDouble) {
				if (
					this.previousVoucherData.secondAccount.relatedHeader.name ==
					"Cash in Hand"
				) {
					this.secPaymentMethod = "cash"
				} else {
					this.secPaymentMethod = "bank"
				}
				if (this.secPaymentMethod == "cash") {
					this.secSelectedCashAccount = this.previousVoucherData.secondAccount
				} else {
					this.secSelectedBankAccount = this.previousVoucherData.secondAccount
				}
			}

			this.selectedDoctor = this.previousVoucherData.relatedDoctor
			this.balanceTotalDiscount.amountValue =
				this.previousVoucherData.totalDiscount
			this.balanceTotalDiscountOption = "amount"
			this.saleInfo.payAmount = this.previousVoucherData.totalPaidAmount
			this.saleInfo.secPayAmount = this.previousVoucherData.secondAmount
			this.confirmBalanceTotalDiscount()
			this.calculateBalanceTotalDiscount()
			this.calculateBalanceTotal()
		},
		// end others
	},
	async mounted() {
		try {
			let therapistRes = await this.therapistStore.fetchTherapists()
			console.log(therapistRes.data)
			this.therapists = [...therapistRes.data]
			this.selectedTherapist = this.therapists[0]
			let itemsRes = await this.medicineItemStore.fetchMedicineItems()
			this.items = itemsRes.list
			console.log("here")
			let treatmentRes = await this.treatmentListStore.fetchTreatmentUnits()
			console.log(treatmentRes.list)
			this.newTreatments = treatmentRes.list
			const customersRes = await this.patientStore.fetchPatients()
			this.customers = customersRes.list

			let voucherData =
				await this.medicineSaleStore.fetchVoucherCodeForTreatment()
			this.voucherData = voucherData.data

			let res = await this.accountingListStore.fetchAccountingLists()

			await this.getTreatmentLists()

			this.data.purchaseType = "surgery"

			let doctorRes = await this.doctorStore.fetchDoctors()
			this.doctors = doctorRes.data
			this.selectedDoctor = this.doctors[0]
			this.bankAccounts = res.list.filter(el => {
				if (el.relatedType && el.relatedType.name === "Assets") {
					if (el.relatedHeader && el.relatedHeader.name === "Cash at Bank") {
						return el
					}
				}
				//let checker = false
				//this.appStore.accountingList.bank.map(bankSet => {
				//	if (bankSet.code === el.code && bankSet.name === el.subHeader) {
				//		checker = true
				//	}
				//})

				//return checker
			})

			this.cashAccounts = res.list.filter(el => {
				if (el._id === this.appStore.account._id) return el
			})

			this.selectedBankAccount = this.bankAccounts[0]
			this.selectedCashAccount = this.cashAccounts[0]
			this.secSelectedBankAccount = this.bankAccounts[0]
			this.secSelectedCashAccount = this.cashAccounts[0]

			if (this.$route.query.patientId) {
				this.customerStatus = "old"
				this.selectedCustomer = this.customers.filter(
					customer => customer._id === this.$route.query.patientId
				)[0]
			}

			if (this.$route.query.appointmentId) {
				let storedItems = JSON.parse(sessionStorage.getItem("saleItems"))[
					`${this.$route.query.appointmentId}`
				]
				this.fillMedicineItems(storedItems)
			}

			// this.prepareVoucherData(responseAfterMultiTreatmentSale)
			this.resetItemDiscountData()
			this.resetBalanceTotalData()

			// check if voucher id is in the query, and if there is, that will be editing voucher
			if (this.$route.query.voucherId) {
				let voucherRes = await this.treatmentVoucherStore.fetchTreatmentVoucher(
					{ id: this.$route.query.voucherId }
				)
				console.log("voucher data", voucherRes)
				this.previousVoucherData = voucherRes.data[0]
				this.fillPreviousVoucherData()
			}
			this.changeSecPayAmount()
			if (this.$route.query.patient) {
				this.customerStatus = "old"
				let patientId = this.$route.query.patient

				this.selectedCustomer = this.customers.filter(e => {
					return e._id == patientId
				})[0]
			}
			if (this.$route.query.refundAmount) {
				this.saleInfo.payAmount = this.$route.query.refundAmount
				this.saleInfo.refundAmount = this.$route.query.refundAmount
			}
			// const testingRes = await this.treatmentUnitStore.fetchTreatmentUnits()
			// console.log(testingRes)
			// console.log(this.previousVoucherData.isDouble)
			if (this.previousVoucherData.isDouble) {
				this.isPaymentMethodSeparate = true
			} else {
				this.isPaymentMethodSeparate = false
			}
		} catch (err) {
			console.log(err)
		} finally {
			this.isLoading = false
		}
	},
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style lang="scss" scoped></style>
