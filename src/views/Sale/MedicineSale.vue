<template>
	<template v-if="isLoading">
		<div>
			<Loading />
		</div>
	</template>
	<template v-else>
		<div class="row d-print-none">
			<div class="col-12 my-3">
				<h5 class="">Medicine Sale</h5>
			</div>
		</div>
		<div class="row d-print-none">
			<form @submit.prevent="">
				<div class="row">
					<div class="col-8">
						<div class="card border-0 rounded shadow-sm p-3">
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
							<div class="d-flex align-items-center gap-3">
								<button class="btn btn-primary" @click="reload">
									<i class="bi bi-arrow-counterclockwise"></i>
								</button>
								<input
									v-show="barcodeOn"
									name="medicineCode"
									type="text"
									class="form-control form-control-sm"
									style="width: 250px; height: 40px"
									placeholder="Barcode" />
								<div v-show="!barcodeOn">
									<div style="width: 250px">
										<VueMultiselect
											:model-value="selectedItem"
											@update:model-value="updateSelectedItem"
											:options="filteredItems"
											:searchable="true"
											:close-on-select="true"
											:allow-empty="false"
											:option-height="31"
											label="medicineItemName"
											placeholder="Select Items"
											track-by="_id" />
									</div>
								</div>
								<button @click="updateSelectedItems" class="btn btn-primary">
									Add <i class="bi bi-plus-lg"></i>
								</button>
								<button
									@click="toggleMedicineInputType"
									class="btn btn-primary">
									<i class="bi bi-upc"></i>
								</button>
							</div>
							<hr class="my-3" />
							<template v-if="treatmentSelection">
								<h3>Selected treatment</h3>
								<div class="table-responsive">
									<table class="table table-bordered">
										<thead>
											<tr>
												<th scope="col">Treatment name</th>
												<th scope="col">Price</th>
												<th scope="col">Discount</th>
												<th scope="col">Paid Amount</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>{{ treatmentSelection.relatedTreatment?.name }}</td>
												<td>
													{{
														treatmentSelection.relatedTreatment?.sellingPrice
													}}
												</td>
												<td>{{ treatmentSelection.discount ?? 0 }}</td>
												<td>
													{{
														treatmentSelection.relatedTreatment?.sellingPrice -
														(treatmentSelection.discount ?? 0)
													}}
												</td>
											</tr>
										</tbody>
										<tfoot>
											<tr>
												<td class="text-center" colspan="2">Total Price</td>
												<td class="text-center" colspan="2">
													<input
														name="total_price"
														id="total_price"
														:value="
															treatmentSelection.relatedTreatment
																?.sellingPrice -
															(treatmentSelection.discount ?? 0)
														"
														type="number"
														class="form-control form-control-sm border-0"
														readonly />
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
							</template>
							<h3>Selected Medicine Items</h3>
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
											</span>
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
												name="total_qty"
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
												name="total_price"
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
											v-model="customerStatus"
											:disabled="treatmentSelection"
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
													name="name"
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
													name="phone"
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
													name="email"
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
												:disabled="treatmentSelection"
												:options="customers"
												:searchable="true"
												:close-on-select="true"
												:allow-empty="false"
												label="name"
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
							<div>
								<template v-if="!treatmentSelection">
									<h5 class="mb-3">Date</h5>
									<div class="mb-3">
										<input
											type="date"
											name=""
											class="form-control"
											v-model="date"
											id="" />
									</div>
								</template>
								<div
									v-if="!treatmentSelection"
									class="d-flex justify-content-center mb-3 gap-5">
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
										:disabled="isPaymentMethodSeparate"
										v-model="selectedBankAccountType"
										aria-label="Default select example"
										placeholder="select Account">
										<option
											v-for="(acc, index) in bankAccountTypes"
											:value="acc.value"
											:key="index">
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
											:disabled="isPaymentMethodSeparate"
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
								<div class="row align-items-center mb-3">
									<div class="col-4">
										<label>Pay amount</label>
									</div>
									<div class="col-8">
										<input
											@change="calculateBalanceTotal"
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
							<div class="d-flex align-items-center">
								<!-- <button @click="voucherType = 'a5'" class="btn me-3" :class="{ 'btn-primary': voucherType == 'a5' }">
                  A5
                </button>
                <button @click="voucherType = 'slip'" class="btn" :class="{ 'btn-primary': voucherType == 'slip' }">
                  Slip
                </button> -->
								<!-- <button class="ms-auto btn btn-secondary d-none d-sm-none d-md-block d-lg-inline-block" type="button"
                  data-bs-toggle="modal" data-bs-target="#printModal">
                  <span><i class="bi bi-eye"></i></span>
                </button> -->
								<button
									class="ms-auto btn btn-secondary d-none d-sm-none d-md-block d-lg-inline-block"
									type="button"
									@click="showSaleVoucherModal">
									<span><i class="bi bi-eye"></i></span>
								</button>
								<PrintModal
									:items="selectedItems"
									:selectedCustomer="selectedCustomer"
									:saleInfo="saleInfo"
									:voucherType="voucherType"
									:voucherData="voucherData"
									:treatmentSelection="treatmentSelection" />
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
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>

		<SaleVoucherModal
			:paymentMethod="voucherPaymentMethod"
			:treatmentData="treatmentData"
			:customer="selectedCustomer"
			:treatments="selectedTreatmentSelections"
			:medicineItems="selectedItems"
			:paymentAccData="paymentAccData"
			:medicineData="medicineData"
			:invoiceId="voucherId" />
		<div
			ref="castVoucherDisplay"
			class="card p-3 border-0 rounded shadow-sm d-none">
			<!-- html2canvas is not working without actual content(CastSaleVoucherModal) -->
			<CastSaleVoucherModal
				:paymentMethod="voucherPaymentMethod"
				:treatmentData="treatmentData"
				:customer="selectedCustomer"
				:treatments="selectedTreatmentSelections"
				:medicineItems="selectedItems"
				:medicineData="medicineData"
				:invoiceId="voucherId" />
		</div>
	</template>
</template>

<script>
import VueMultiselect from "vue-multiselect"
import { useRouter } from "vue-router"
import PrintModal from "@/components/Sale/MedicineSale/PrintModal.vue"
import { useAppStore } from "../../stores/app"
import { usePatientStore } from "../../stores/patient"
import { useMedicineItemStore } from "../../stores/medicineItems"
import { useAccountingListStore } from "../../stores/accountingList"
import { useMedicineSaleStore } from "../../stores/medicineSale"
import { useIncomeStore } from "../../stores/income"
import Spinner from "../../components/Common/Spinner.vue"
import html2canvas from "html2canvas"
import { useStockStore } from "../../stores/stock"
import { dateForParams, openDialog } from "../../helpers"
import { useTreatmentSelectionStore } from "../../stores/treatmentSelection"
import itemDiscountHandler from "../../composables/itemDiscountHandler"
import balanceTotalDiscountHandler from "../../composables/balanceTotalDiscountHandler"
import SaleVoucherModal from "../../components/General/SaleVoucherModal.vue"
import CastSaleVoucherModal from "../../components/General/CastSaleVoucherModal.vue"
import { useTreatmentVoucherStore } from "../../stores/treatmentVoucher"

export default {
	setup() {
		const router = useRouter()
		const appStore = useAppStore()
		const patientStore = usePatientStore()
		const medicineItemStore = useMedicineItemStore()
		const accountingListStore = useAccountingListStore()
		const medicineSaleStore = useMedicineSaleStore()
		const treatmentVoucherStore = useTreatmentVoucherStore()
		const incomeStore = useIncomeStore()
		const treatmentSelectionStore = useTreatmentSelectionStore()
		const stockStore = useStockStore()
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
			router,
			incomeStore,
			appStore,
			patientStore,
			medicineItemStore,
			accountingListStore,
			medicineSaleStore,
			treatmentSelectionStore,
			treatmentVoucherStore,
			stockStore,
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
			resetBalanceTotalData,
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
			customerStatus: "new",
			newCustomer: {
				name: "",
				phone: "",
			},
			treatmentSelection: null,
			isLoading: true,
			barcodeOn: false,
			items: [],
			medicineItemsType: "All",
			filteredItems: [],
			selectedItem: {},
			selectedItems: [],
			customers: [],
			isPaymentMethodSeparate: false,
			data: {
				sendEmail: false,
				imageFile: null,
			},
			selectedCustomer: {},
			voucherData: {},
			bankAccounts: [],
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
			paymentStatus: "full",
			secPayAmount: 0,
			secSelectedBankAccount: {},
			secSelectedCashAccount: {},
			secBankType: "Normal",
			secPaymentMethod: "cash",
			selectedBankAccountType: "Normal",
			selectedBankAccount: {},
			cashAccounts: [],
			selectedCashAccount: {},
			paymentMethod: "cash",
			paymentAccData: {},
			voucherType: "a5",
			storingVoucher: false,
			creatingCustomer: false,
			// treatmentSelection: {},
			selectedTreatmentSelections: [],
			previousVoucherData: {},
			// related to voucher
			voucherId: "",
			treatmentData: {},
			medicineData: {},
			date: "",
			voucherPaymentMethod: "",
			treatmentSelectionVoucher: null,
			// end related to voucher
		}
	},
	computed: {
		isMedicineVoucherUpdate() {
			return this.$route.query.voucherId
		},
	},
	methods: {
		filterMedicineItems() {
			this.filteredItems = this.items.filter(each => {
				if (this.medicineItemsType === "All") return true
				if (each.itemType === this.medicineItemsType) return true
			})
		},
		changeSecPayAmount() {
			this.saleInfo.secPayAmount = 0
			this.saleInfo.payAmount = 0
			this.calculateBalanceTotal()
		},
		// yes customer and patient are the same (need to be consistent)
		async createCustomer() {
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

			this.creatingCustomer = true

			let formData = new FormData(document.querySelector("#customerCreateForm"))

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
		showSaleVoucherModal() {
			this.prepareVoucherData()
			openDialog("saleVoucherModal")
		},
		reload() {
			this.$router.push({ name: "sale.medicine", query: {} })
			setTimeout(() => {
				window.location.reload()
			}, 100)
			// this.resetData()
		},
		prepareEmailForm() {
			let formData = {
				recipent: this.selectedCustomer.email,
				voucherType: "Medicine Sale",
				voucherNo: this.voucherId,
				voucherDate: dateForParams(this.date),
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
			let newFormData = this.prepareFormData()
			// return
			this.storingVoucher = true
			try {
				let res = null
				if (this.$route.query.treatmentSelectionId) {
					res = await this.medicineSaleStore.createMedicineSaleCombine(
						newFormData
					)
					this.createIncome()
				} else if (this.isMedicineVoucherUpdate) {
					res = await this.treatmentVoucherStore.updateMedicineVoucher(
						newFormData
					)
				} else {
					res = await this.medicineSaleStore.createMedicineSaleSingle(
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
					this.appStore.showSuccess()
					openDialog("saleVoucherModal")
					// check if voucher id is in the query, and if there is, that will be editing voucher
					if (this.isMedicineVoucherUpdate) {
						await this.fetchPreviousVoucherDataAndFill()
					}
					this.$router.push({ name: "sale.vouchers-list" })
					// this.treatmentSelection = null
					// this.selectedTreatmentSelections = null
					// this.selectedItems = []prepa
					// this.resetItemDiscountData()
					// this.resetBalanceTotalData()
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
		async storeVoucher() {
			let newFormData = this.prepareFormData()
			console.log(newFormData)
			console.log(JSON.stringify(newFormData))
			// return
			this.storingVoucher = true
			try {
				let res = null
				if (this.$route.query.treatmentSelectionId) {
					res = await this.medicineSaleStore.createMedicineSaleCombine(
						newFormData
					)
					this.createIncome()
				} else if (this.isMedicineVoucherUpdate) {
					res = await this.treatmentVoucherStore.updateMedicineVoucher(
						newFormData
					)
				} else {
					res = await this.medicineSaleStore.createMedicineSaleSingle(
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
					this.appStore.showSuccess()
					// check if voucher id is in the query, and if there is, that will be editing voucher
					if (this.isMedicineVoucherUpdate) {
						await this.fetchPreviousVoucherDataAndFill()
					}
					// this.reload()
					this.router.push({ name: "sale.vouchers-list" })
				}
			} catch (err) {
				this.appStore.showError()
				console.log(err)
			} finally {
				this.storingVoucher = false
			}
		},
		async generateImage() {
			this.$refs.castVoucherDisplay.classList.remove("d-none")
			const content = await document.querySelector("#castSaleVoucherCard")
			const canvas = await html2canvas(content, {
				width: content.scrollWidth + 20,
				height: content.scrollHeight + 20,
			})
			this.$refs.castVoucherDisplay.classList.add("d-none")
			const imageData = canvas.toDataURL("image/png")
			console.log(imageData)
			this.data.imageFile = imageData
		},
		prepareFormData() {
			let selectedItems = this.selectedItems.map(item => {
				return {
					item_id: item.item_id,
					qty: item.qty,
					stock: item.stock,
					price: item.price,
					discountAmount: item.discountValue,
				}
			})

			console.log(selectedItems)

			let newFormData = {
				relatedPatient: this.selectedCustomer._id,
				msTotalAmount: this.saleInfo.total,
				msTotalDiscountAmount: this.saleInfo.total - this.saleInfo.subTotal,
				msPaidAmount: this.saleInfo.payAmount,
				secondAmount: this.saleInfo.secPayAmount,
				msChange: this.saleInfo.change,
				msGrandTotal: this.saleInfo.subTotal,
				medicineItems: selectedItems,
				createdAt: dateForParams(this.date),
			}

			console.log("date", this.date == "")
			if (this.date == "") {
				newFormData.createdAt = dateForParams(this.date)
			}
			if (this.$route.query.treatmentSelectionId) {
				newFormData.id = this.treatmentSelectionVoucher._id
			} else {
				newFormData.code = this.voucherData.code
				newFormData.seq = this.voucherData.seq
			}
			if (
				this.saleInfo.subTotal >
				this.saleInfo.payAmount + this.saleInfo.secPayAmount
			) {
				newFormData.msBalance =
					this.saleInfo.subTotal -
					(this.saleInfo.payAmount + this.saleInfo.secPayAmount)
			} else {
				newFormData.msBalance = 0
			}
			if (this.paymentStatus == "separate") {
				newFormData.isDouble = true
				if (this.secPaymentMethod == "cash") {
					newFormData.secondAccount = this.secSelectedCashAccount._id
				} else {
					newFormData.secondAccount = this.secSelectedBankAccount._id
				}
			} else {
				newFormData.isDouble = false
			}
			if (newFormData.msBalance > 0) {
				newFormData.paymentMethod = "Partial"
			} else {
				newFormData.paymentMethod = "Paid"
			}
			if (this.paymentMethod == "bank") {
				newFormData.relatedBank = this.selectedBankAccount._id
			} else {
				newFormData.relatedCash = this.selectedCashAccount._id
			}

			if (this.paymentMethod === "bank")
				newFormData.bankType = this.selectedBankAccountType

			if (this.isMedicineVoucherUpdate) {
				let addItems = []
				let removeItems = []
				let previousItemsIdArray = this.previousVoucherData.medicineItems.map(
					each => each.item_id._id
				)
				let selectedItemsIdArray = this.selectedItems.map(each => each.item_id)

				this.previousVoucherData.medicineItems.map(prevSelectedItem => {
					console.log(
						selectedItemsIdArray.includes(prevSelectedItem.item_id._id)
					)
					if (selectedItemsIdArray.includes(prevSelectedItem.item_id._id)) {
						this.selectedItems.map(selectedItem => {
							let res = selectedItem.qty - prevSelectedItem.qty
							// if selected items is already in the previous items, so it't the old item
							if (prevSelectedItem.item_id._id === selectedItem.item_id) {
								// if new item qty is greater than perv item qty
								if (res > 0) {
									let obj = {
										item_id: selectedItem.item_id,
										qty: res,
									}
									addItems.push(obj)
								} else if (res < 0) {
									// if new item qty is less than prev item qty
									let obj = {
										item_id: selectedItem.item_id,
										qty: Math.abs(res),
									}
									removeItems.push(obj)
								}
							}
						})
					} else {
						// if one of the prev item is removed
						removeItems.push({
							item_id: prevSelectedItem.item_id._id,
							qty: prevSelectedItem.qty,
						})
					}
				})

				//  if new items is added
				this.selectedItems.map(selectedItem => {
					if (!previousItemsIdArray.includes(selectedItem.item_id)) {
						addItems.push({
							item_id: selectedItem.item_id,
							qty: selectedItem.qty,
						})
					}
				})

				if (addItems.length > 0) newFormData.addItems = addItems
				if (removeItems.length > 0) newFormData.removeItems = removeItems
				newFormData.id = this.previousVoucherData._id
				newFormData.createdBy = this.previousVoucherData.createdBy._id // created by is sale person(login person)

				delete newFormData.code
				delete newFormData.seq
			}

			console.log(newFormData)

			return newFormData
		},
		prepareVoucherData(data) {
			console.log(data)
			this.medicineData = {
				paidAmount: this.saleInfo.payAmount,
				totalAmount: this.saleInfo.total,
				discount: this.saleInfo.discountValue,
				secondAmount: this.saleInfo.secPayAmount,
			}

			if (this.$route.query.treatmentSelectionId) {
				this.treatmentData = {
					paidAmount:
						this.treatmentSelection.totalAmount -
						(this.treatmentSelection.discount ?? 0),
					totalAmount:
						this.treatmentSelection.totalAmount -
						(this.treatmentSelection.discount ?? 0),
					discount: 0,
				}
			}

			this.voucherPaymentMethod = this.paymentMethod
			if (this.$route.query.treatmentSelectionId) {
				this.voucherId = this.treatmentSelectionVoucher.code
			} else {
				this.voucherId = data ? data.data.code : "N/A"
			}
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
		},
		toggleMedicineInputType() {
			this.barcodeOn = !this.barcodeOn
		},
		updateSelectedItem(e) {
			this.selectedItem = { ...e }
		},
		updateSelectedItems() {
			let alreadyExistIndex = this.selectedItems.findIndex(
				item => item.item_id == this.selectedItem._id
			)

			if (Object.keys(this.selectedItem).length === 0) return

			if (alreadyExistIndex === -1) {
				let item = {
					item_id: this.selectedItem._id,
					name: this.selectedItem.medicineItemName,
					qty: 1,
					price: this.selectedItem.sellingPrice,
					subTotal: this.selectedItem.sellingPrice,
					discount: 0,
					stock: this.selectedItem.totalUnit,
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
		updateSelectedCustomer(e) {
			this.selectedCustomer = { ...e }
		},
		removeSelectedItems(index) {
			this.selectedItems = this.selectedItems.filter(
				(item, itemIndex) => itemIndex !== index
			)
			this.calculateTotalPrice()
			this.calculateTotalQuantity()
		},
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
			console.log(item)
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
					discountValue: 0,
					stock: each.totalUnit,
				}

				this.selectedItems.push(item)
			})

			this.calculateTotalPrice()
			this.calculateTotalQuantity()
		},
		resetData() {
			this.customerStatus = "new"
			this.newCustomer = {
				name: "",
				phone: "",
			}
			this.barcodeOn = false
			this.items = []
			this.selectedItem = {}
			this.selectedItems = []
			this.customers = []
			this.selectedCustomer = {}
			this.voucherData = {}
			this.bankAccounts = []
			this.selectedBankAccount = {}
			this.cashAccounts = []
			this.selectedCashAccount = {}
			this.paymentMethod = "cash"
			this.voucherType = "a5"
			this.storingVoucher = false
			this.creatingCustomer = false

			this.saleInfo = {
				total: 0,
				change: 0,
				discount: false,
				discountType: "",
				discountValue: 0,
				balance: 0,
				subTotal: 0,
				quantity: 0,
				payAmount: 0,
			}

			this.balanceTotalDiscount = {
				type: "amount",
				amountValue: 0,
				percentValue: 0,
				subTotal: 0,
			}

			this.voucherId = ""
			this.treatmentData = {}
			this.medicineData = {}
			this.voucherPaymentMethod = ""
			this.treatmentSelectionVoucher = null
		},
		async getTreatmentSelectionAndFill() {
			try {
				let res = await this.treatmentSelectionStore.fetchTreatmentSelection({
					id: this.$route.query.treatmentSelectionId,
				})
				console.log(res)
				this.treatmentSelection = res.data[0]
				this.selectedTreatmentSelections = [
					{
						name: this.treatmentSelection.relatedTreatment.name,
						qty: 1,
						price: this.treatmentSelection.relatedTreatment.sellingPrice,
						discountValue: this.treatmentSelection.discount,
						subTotal:
							this.treatmentSelection.relatedTreatment.sellingPrice -
							(this.treatmentSelection.discount ?? 0),
					},
				]
			} catch (error) {
				console.log(error)
				throw error
			}
		},
		async getTreatmentVoucherAndFill() {
			try {
				let res =
					await this.treatmentSelectionStore.fetchRelatedTreatmentVouchers({
						relatedTreatmentSelection: this.treatmentSelection._id,
					})
				console.log("treatment voucher data", res)
				this.treatmentSelectionVoucher = res.data[0]
				if (res.data[0].relatedBank) {
					this.paymentMethod = "bank"
					this.selectedBankAccount = this.bankAccounts.filter(e => {
						return e._id == res.data[0].relatedBank._id
					})[0]

					this.selectedBankAccountType = res.data[0].bankType
					console.log(this.selectedBankAccount)
				} else {
					this.paymentMethod = "bank"
					this.selectedCashAccount = res.data[0].relatedCash
				}
			} catch (err) {
				console.log(err)
				throw err
			}
		},
		fillPreviousItems(payload) {
			this.selectedItems = payload.map(each => {
				let obj = {
					item_id: each.item_id._id,
					name: each.item_id.medicineItemName,
					qty: each.qty,
					price: each.item_id.sellingPrice,
					subTotal: each.price * each.qty - (each.discountAmount ?? 0),
					discount: false,
					// discountType: "amount",
					// discountValue: each.discountAmount,
					stock: each.item_id.totalUnit,
				}
				if (each.discountAmount) {
					obj.discount = true
					obj.discountType = "amount"
					obj.discountValue = each.discountAmount
				}
				return obj
			})
		},
		fillPreviousVoucherData() {
			this.fillPreviousItems(this.previousVoucherData.medicineItems)

			//fill customer
			this.customerStatus = "old"
			this.selectedCustomer = this.previousVoucherData.relatedPatient

			// fill accounting list
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
			this.saleInfo.total = this.previousVoucherData.msTotalAmount
			this.balanceTotalDiscount.amountValue =
				this.previousVoucherData.msTotalDiscountAmount
			this.balanceTotalDiscountOption = "amount"
			this.saleInfo.payAmount = this.previousVoucherData.msPaidAmount
			this.saleInfo.secPayAmount = this.previousVoucherData.secondAmount
			this.confirmBalanceTotalDiscount()
			this.calculateBalanceTotalDiscount()
			this.calculateBalanceTotal()
		},
		async fetchPreviousVoucherDataAndFill() {
			try {
				let voucherRes = await this.treatmentVoucherStore.fetchTreatmentVoucher(
					{ id: this.$route.query.voucherId }
				)
				console.log("voucher data", voucherRes)
				this.previousVoucherData = voucherRes.data[0]
				this.fillPreviousVoucherData()
			} catch (err) {
				throw err
			}
		},
	},
	async mounted() {
		this.resetItemDiscountData()
		this.resetBalanceTotalData()
		this.changeSecPayAmount()
		try {
			let itemsRes = await this.medicineItemStore.fetchMedicineItems()
			console.log(itemsRes)
			this.items = itemsRes.list

			const customersRes = await this.patientStore.fetchPatients()
			this.customers = customersRes.list

			let voucherData = await this.medicineSaleStore.fetchVoucherCode()
			this.voucherData = voucherData.data

			console.log(voucherData.data)
			let res = await this.accountingListStore.fetchAccountingLists()
			console.log(res)
			this.bankAccounts = res.list.filter(el => {
				// let checker = false
				// this.appStore.accountingList.bank.map(bankSet => {
				// 	if (bankSet.code === el.code && bankSet.name === el.subHeader) {
				// 		checker = true
				// 	}
				// })

				// return checker
				if (el.relatedType && el.relatedType.name === "Assets") {
					if (el.relatedHeader && el.relatedHeader.name === "Cash at Bank") {
						return el
					}
				}
			})
			console.log(this.bankAccounts)

			this.cashAccounts = res.list.filter(el => {
				if (el._id === this.appStore.account._id) return el
			})
			console.log(this.cashAccounts)

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
				console.log(storedItems)
				this.fillMedicineItems(storedItems)
			}

			if (this.$route.query.treatmentSelectionId) {
				await this.getTreatmentSelectionAndFill()
				await this.getTreatmentVoucherAndFill()
			} else {
				this.treatmentSelection = null
				this.treatmentSelectionVoucher = null
			}

			// check if voucher id is in the query, and if there is, that will be editing voucher
			if (this.isMedicineVoucherUpdate) {
				await this.fetchPreviousVoucherDataAndFill()
			}

			this.filterMedicineItems()
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
