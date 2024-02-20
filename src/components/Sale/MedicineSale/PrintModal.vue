<template>
	<div
		class="modal fade"
		id="printModal"
		tabindex="-1"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true">
		<div class="modal-dialog" style="max-width: 800px">
			<div class="modal-content" style="width: 800px">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="exampleModalLabel">Voucher</h1>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div v-if="voucherType === 'slip'" id="navpills-1">
						<div id="SaleSlipPrintModal" class="row justify-content-center">
							<div class="col-md-12 printableArea">
								<div class="mx-auto" style="width: 500px">
									<div class="row border">
										<div class="col-md-12 mb-3">
											<div style="text-align: center" class="mb-3">
												<address>
													<img
														style="height: 100px"
														src="@/assets/img/logo.png"
														alt="" />
													<p
														class="text-black mx-auto text-center fw-bold"
														style="width: 400px">
														{{ contact.address }}
													</p>
													<template v-for="phone in contact.phones">
														<p class="text-black fw-bold">
															Phone No : {{ phone }}
														</p>
													</template>
												</address>
											</div>
											<div class="pull-right text-left">
												<h6 class="text-black">
													<span class="fw-bold">Date: </span>
													<i class="fa fa-calendar"></i> {{ getToday() }}
												</h6>
												<h6 class="text-black">
													<span class="fw-bold">Voucher Number: </span>
													<span class="vou_code">
														{{ voucherData.voucherCode }}</span
													>
												</h6>
												<h6 class="text-black">
													<span class="fw-bold">Customer Name: </span>
													<span class="vou_code">
														{{ selectedCustomer.name }}</span
													>
												</h6>
												<h6 class="text-black">
													<span class="fw-bold">Customer Phone: </span>
													<span class="vou_code">
														{{ selectedCustomer.phone }}</span
													>
												</h6>
											</div>
										</div>

										<div class="col-md-12">
											<div class="text-black">
												<table class="table table-bordered">
													<thead>
														<tr class="text-black">
															<th style="width: 50px">No</th>
															<th style="width: 150px">Name</th>
															<th style="width: 80px">Qty</th>
															<th style="width: 90px">Unit Price</th>
															<th style="width: 80px">Sub Total</th>
														</tr>
													</thead>
													<tbody class="text-black" id="slip_live">
														<tr v-for="(item, index) in items">
															<td style="width: 50px">{{ index + 1 }}</td>
															<td>{{ item.name }}</td>
															<td>{{ item.qty }}</td>
															<td>{{ item.price }}</td>
															<td id="subtotal">
																{{ item.subTotal }}
															</td>
														</tr>
														<tr v-if="items?.length <= 0">
															<td colspan="5" class="text-center fw-bold">
																No item exist!
															</td>
														</tr>
													</tbody>
												</table>
												<div class="row justify-content-end">
													<div class="col-8">
														<table class="table table-borderless">
															<tbody>
																<tr>
																	<td colspan="2"></td>
																	<td
																		class="text-right fw-bold"
																		style="font-size: 15px">
																		Total
																	</td>
																	<td
																		id="total_charges"
																		class="font-weight-bold"
																		style="font-size: 15px">
																		<span id="slip_total">{{
																			saleInfo.total
																		}}</span>
																	</td>
																</tr>

																<tr>
																	<td colspan="2"></td>
																	<td
																		class="text-right fw-bold"
																		style="font-size: 15px">
																		Discount
																	</td>
																	<td
																		v-if="!saleInfo.discount"
																		id="slip_discount"
																		class="font-weight-bold"
																		style="font-size: 15px">
																		No discount
																	</td>
																	<td
																		v-if="
																			saleInfo.discount &&
																			saleInfo.discountType !== 'foc'
																		"
																		id="slip_discount"
																		class="font-weight-bold fw-bold"
																		style="font-size: 15px">
																		{{ saleInfo.discountValue }}
																		{{
																			saleInfo.discountType === "amount"
																				? ""
																				: "%"
																		}}
																	</td>
																	<td
																		v-if="
																			saleInfo.discount &&
																			saleInfo.discountType === 'foc'
																		"
																		id="slip_discount"
																		style="font-size: 15px">
																		Foc
																	</td>
																</tr>

																<tr>
																	<td colspan="2"></td>
																	<td
																		class="text-right fw-bold"
																		style="font-size: 15px">
																		Sub Total
																	</td>
																	<td id="slip_net" style="font-size: 15px">
																		{{ saleInfo.subTotal }}
																	</td>
																</tr>
																<tr>
																	<td colspan="2"></td>
																	<td
																		class="text-right fw-bold"
																		style="font-size: 15px">
																		Pay Amount
																	</td>
																	<td id="pay" style="font-size: 15px">
																		{{ saleInfo.payAmount }}
																	</td>
																</tr>
																<tr>
																	<td colspan="2"></td>
																	<td
																		class="text-right fw-bold"
																		style="font-size: 15px">
																		Balance
																	</td>
																	<td id="slip_net" style="font-size: 15px">
																		{{ saleInfo.balance ?? 0 }}
																	</td>
																</tr>
																<tr>
																	<td colspan="2"></td>
																	<td
																		class="text-right fw-bold"
																		style="font-size: 15px">
																		Change
																	</td>
																	<td
																		id="changes"
																		class="font-weight-bold"
																		style="font-size: 15px">
																		{{ saleInfo.change }}
																	</td>
																</tr>
															</tbody>
														</table>
													</div>
												</div>
												<hr />
												<h6 class="text-center font-weight-bold text-black">
													**ကျေးဇူးတင်ပါသည်**
												</h6>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div id="navpills-2" v-if="voucherType === 'a5'">
						<div id="SaleA5PrintModal" class="row justify-content-center">
							<div class="col-md-12">
								<div class="p-3 border printableArea">
									<div style="display: flex; justify-content: space-around">
										<div class="row">
											<div class="col-md-12 text-center">
												<div style="text-align: center">
													<address>
														<img
															style="height: 100px"
															src="@/assets/img/logo.png"
															alt="" />
														<p
															class="text-black mx-auto text-center fw-bold"
															style="width: 400px">
															{{ contact.address }}
														</p>
														<template v-for="phone in contact.phones">
															<p class="text-black fw-bold">
																Phone No : {{ phone }}
															</p>
														</template>
													</address>
												</div>
											</div>
										</div>
									</div>
									<div
										class="d-flex justify-content-between align-items-end mb-3">
										<div class="">
											<h3 class="mt-2" style="font-size: 15px">
												<span class="vou_code"></span>
											</h3>

											<h3 class="mt-2" style="font-size: 15px">
												<span class="fw-bold">Date:</span> {{ getToday() }}
											</h3>
											<h3 class="mt-2" style="font-size: 15px">
												<span class="fw-bold">Cashier:</span>
												{{ this.appStore.user.data.user.name }}
											</h3>
										</div>
										<div class="">
											<h3 class="mt-2" style="font-size: 15px">
												<span class="fw-bold">Customer Name: </span>
												<span id="cus_name"> {{ selectedCustomer.name }}</span>
											</h3>
											<h3 class="mt-2" style="font-size: 15px">
												<span class="fw-bold">Customer Phone: </span>
												<span id="cus_phone">
													{{ selectedCustomer.phone }}</span
												>
											</h3>
										</div>
									</div>

									<div class="row mb-3" v-if="treatmentSelection">
										<div class="col-md-12">
											<h5>Treatment</h5>
											<table
												class="table table-bordered mb-0"
												style="width: 100%">
												<thead class="text-center">
													<tr>
														<th
															style="
																font-size: 15px;
																font-weight: normal;
																height: 15px;
															"
															class="text-center">
															Item
														</th>
														<th
															style="
																font-size: 15px;
																font-weight: normal;
																height: 15px;
															"
															class="text-center">
															Qty
														</th>
														<th
															style="
																font-size: 15px;
																font-weight: normal;
																height: 15px;
															"
															class="text-center">
															Unit Price
														</th>
														<th
															style="
																font-size: 15px;
																font-weight: normal;
																height: 15px;
															"
															class="text-center">
															Sub Total
														</th>
													</tr>
												</thead>
												<tbody class="text-center" id="a5_body">
													<tr v-for="(item, index) in items">
														<td>{{ item.name }}</td>
														<td>{{ item.qty }}</td>
														<td>{{ item.price }}</td>
														<td>{{ item.subTotal }}</td>
													</tr>
													<tr v-if="items?.length <= 0">
														<td colspan="4" class="text-center fw-bold">
															No item exist!
														</td>
													</tr>
												</tbody>
												<tfoot class="text-black">
													<tr>
														<td colspan="2"></td>
														<td colspan="2" class="fw-bold">Final</td>
													</tr>
													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Total
														</td>
														<td
															id="total_charges"
															class="font-weight-bold"
															style="font-size: 15px">
															<span id="slip_total">{{ saleInfo.total }}</span>
														</td>
													</tr>

													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Discount
														</td>
														<td
															v-if="!saleInfo.discount"
															id="slip_discount"
															class="font-weight-bold"
															style="font-size: 15px">
															No discount
														</td>
														<td
															v-if="
																saleInfo.discount &&
																saleInfo.discountType !== 'foc'
															"
															id="slip_discount"
															class="font-weight-bold"
															style="font-size: 15px">
															{{ saleInfo.discountValue }}
															{{
																saleInfo.discountType === "amount" ? "" : "%"
															}}
														</td>
														<td
															v-if="
																saleInfo.discount &&
																saleInfo.discountType === 'foc'
															"
															id="slip_discount"
															class="font-weight-bold"
															style="font-size: 15px">
															Foc
														</td>
													</tr>

													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Sub Total
														</td>
														<td
															id="slip_net"
															class="font-weight-bold"
															style="font-size: 15px">
															{{ saleInfo.subTotal }}
														</td>
													</tr>

													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Pay Amount
														</td>
														<td
															id="pay"
															class="font-weight-bold"
															style="font-size: 15px">
															{{ saleInfo.payAmount }}
														</td>
													</tr>

													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Balance
														</td>
														<td
															id="slip_net"
															class="font-weight-bold"
															style="font-size: 15px">
															{{ saleInfo.balance }}
														</td>
													</tr>
													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Change
														</td>
														<td
															id="changes"
															class="font-weight-bold"
															style="font-size: 15px">
															{{ saleInfo.change }}
														</td>
													</tr>
												</tfoot>
											</table>
										</div>
									</div>

									<div class="row">
										<div class="col-md-12">
											<h5>Medicine Items</h5>
											<table
												class="table table-bordered mb-0"
												style="width: 100%">
												<thead class="text-center">
													<tr>
														<th
															style="
																font-size: 15px;
																font-weight: normal;
																height: 15px;
															"
															class="text-center">
															Item
														</th>
														<th
															style="
																font-size: 15px;
																font-weight: normal;
																height: 15px;
															"
															class="text-center">
															Qty
														</th>
														<th
															style="
																font-size: 15px;
																font-weight: normal;
																height: 15px;
															"
															class="text-center">
															Unit Price
														</th>
														<th
															style="
																font-size: 15px;
																font-weight: normal;
																height: 15px;
															"
															class="text-center">
															Sub Total
														</th>
													</tr>
												</thead>
												<tbody class="text-center" id="a5_body">
													<tr v-for="(item, index) in items">
														<td>{{ item.name }}</td>
														<td>{{ item.qty }}</td>
														<td>{{ item.price }}</td>
														<td>{{ item.subTotal }}</td>
													</tr>
													<tr v-if="items?.length <= 0">
														<td colspan="4" class="text-center fw-bold">
															No item exist!
														</td>
													</tr>
												</tbody>
												<tfoot class="text-black">
													<tr>
														<td colspan="2"></td>
														<td colspan="2" class="fw-bold">Final</td>
													</tr>
													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Total
														</td>
														<td
															id="total_charges"
															class="font-weight-bold"
															style="font-size: 15px">
															<span id="slip_total">{{ saleInfo.total }}</span>
														</td>
													</tr>

													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Discount
														</td>
														<td
															v-if="!saleInfo.discount"
															id="slip_discount"
															class="font-weight-bold"
															style="font-size: 15px">
															No discount
														</td>
														<td
															v-if="
																saleInfo.discount &&
																saleInfo.discountType !== 'foc'
															"
															id="slip_discount"
															class="font-weight-bold"
															style="font-size: 15px">
															{{ saleInfo.discountValue }}
															{{
																saleInfo.discountType === "amount" ? "" : "%"
															}}
														</td>
														<td
															v-if="
																saleInfo.discount &&
																saleInfo.discountType === 'foc'
															"
															id="slip_discount"
															class="font-weight-bold"
															style="font-size: 15px">
															Foc
														</td>
													</tr>

													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Sub Total
														</td>
														<td
															id="slip_net"
															class="font-weight-bold"
															style="font-size: 15px">
															{{ saleInfo.subTotal }}
														</td>
													</tr>

													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Pay Amount
														</td>
														<td
															id="pay"
															class="font-weight-bold"
															style="font-size: 15px">
															{{ saleInfo.payAmount }}
														</td>
													</tr>

													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Balance
														</td>
														<td
															id="slip_net"
															class="font-weight-bold"
															style="font-size: 15px">
															{{ saleInfo.balance }}
														</td>
													</tr>
													<tr>
														<td colspan="2"></td>
														<td class="text-right" style="font-size: 15px">
															Change
														</td>
														<td
															id="changes"
															class="font-weight-bold"
															style="font-size: 15px">
															{{ saleInfo.change }}
														</td>
													</tr>
												</tfoot>
											</table>
										</div>
									</div>

									<div class="row justify-content-end mt-3">
										<div class="col-6">
											<div>
												<span style="font-weight: bold">Grand Total: </span>
												<span></span>
											</div>
											<div>
												<span style="font-weight: bold">Paid Amount: </span>
												<span></span>
											</div>
											<div>
												<span style="font-weight: bold">Balance: </span>
												<span></span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { getToday } from "@/helpers/index.js"
import { useAppStore } from "../../../stores/app"
export default {
	setup() {
		const appStore = useAppStore()
		return { appStore }
	},
	data() {
		return {
			contact: {},
		}
	},
	props: [
		"items",
		"selectedCustomer",
		"saleInfo",
		"voucherType",
		"voucherData",
		"treatmentSelection",
	],
	methods: {
		getToday,
	},
	mounted() {
		this.contact = this.appStore.getContact()
	},
}
</script>

<style lang="scss" scoped></style>
