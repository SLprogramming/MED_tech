<template>
	<div
		class="vh-100 text-black"
		style="overflow-y: auto; position: fixed; transition: all 0.5s"
		:class="{ 'nav-on': appStore.sidebar, 'nav-off': !appStore.sidebar }">
		<h3 class="text-center my-3">Dr Rejuve</h3>
		<template
			v-if="
				appStore.user.data.user.role == 'master' ||
				appStore.user.data.user.role == 'Sales'
			">
			<ul class="list-unstyled text-black p-1">
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#home-collapse"
						aria-expanded="true">
						Master Data
					</button>
					<div class="collapse show" id="home-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<!-- <li>
				  <NavLink :payload="{ url: 'master.category', name: 'Category' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.sub-category',
					name: 'Sub Category',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{ url: 'master.brand', name: 'Brand' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.medicine-list',
					name: 'Medicine List',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-medicine',
					name: 'Procedure Medicine',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-accessory',
					name: 'Procedure Accessory',
				  }" />
				</li> -->
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment-list',
										name: 'Treatment List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment',
										name: 'Treatment',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#sale-collapse"
						aria-expanded="true">
						Sale
					</button>
					<div class="collapse show" id="sale-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{ url: 'sale.medicine', name: 'Medicine Sale' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'sale.treatment',
										name: 'Treatment Sale',
									}" />
							</li>
							<!-- <li>
				  <NavLink :payload="{ url: 'sale.medicine-list', name: 'Medicine Sale List' }" />
				</li> -->
							<li>
								<NavLink
									:payload="{
										url: 'sale.vouchers-list',
										name: 'Voucher List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'sale.repay-credit-list',
										name: 'Balance List',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#appointment-collapse"
						aria-expanded="true">
						Booking
					</button>
					<div class="collapse show" id="appointment-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{ url: 'appointment.create', name: 'Create' }" />
							</li>
							<li>
								<NavLink :payload="{ url: 'appointment.list', name: 'List' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'appointment.service-list',
										name: 'Service List',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#stockCountAndPrice"
						aria-expanded="true">
						Admin
					</button>
					<div class="collapse show" id="stockCountAndPrice">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{
										url: 'admin.stock-count-and-price',
										name: 'Stock Count And Price',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'admin.top-ten-list',
										name: 'Top 10 List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'doctor-panel',
										name: 'Doctor Panel',
									}" />
							</li>
							<!-- <li>
				  <NavLink :payload="{
					url: 'stock-request.create',
					name: 'Stock Request',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'stock-request',
					name: 'Stock Request List',
				  }" />
				</li> -->
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#patient-collapse"
						aria-expanded="true">
						Patient
					</button>
					<div class="collapse show" id="patient-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink :payload="{ url: 'patient', name: 'Patient List' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'patient.register',
										name: 'Patient Register',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#account-collapse"
						aria-expanded="true">
						Account
					</button>
					<div class="collapse show" id="account-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<a
									class="btn text-start text-white p-2"
									@click="openOpeningDialog"
									>Opening</a
								>
							</li>
							<li>
								<NavLink
									:payload="{ url: 'account.report', name: 'Closing' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'account.income-total',
										name: 'Income Total',
									}" />
							</li>
							<li>
								<NavLink :payload="{ url: 'account.income', name: 'Income' }" />
							</li>
							<li>
								<NavLink
									:payload="{ url: 'account.expense', name: 'Expense' }" />
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</template>
		<template v-else-if="appStore.user.data.user.role == 'supervisor'">
			<ul class="list-unstyled p-1">
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#home-collapse"
						aria-expanded="true">
						Master Data
					</button>
					<div class="collapse show" id="home-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<!-- <li>
				  <NavLink :payload="{ url: 'master.category', name: 'Category' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.sub-category',
					name: 'Sub Category',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{ url: 'master.brand', name: 'Brand' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.medicine-list',
					name: 'Medicine List',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-medicine',
					name: 'Procedure Medicine',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-accessory',
					name: 'Procedure Accessory',
				  }" />
				</li> -->
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment-list',
										name: 'Treatment List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment',
										name: 'Treatment',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#sale-collapse"
						aria-expanded="true">
						Sale
					</button>
					<div class="collapse show" id="sale-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{ url: 'sale.medicine', name: 'Medicine Sale' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'sale.treatment',
										name: 'Treatment Sale',
									}" />
							</li>
							<!-- <li>
				  <NavLink :payload="{ url: 'sale.medicine-list', name: 'Medicine Sale List' }" />
				</li> -->
							<li>
								<NavLink
									:payload="{
										url: 'sale.vouchers-list',
										name: 'Voucher List',
									}" />
							</li>
							<!-- <li>
								<NavLink
									:payload="{
										url: 'sale.repay-credit-list',
										name: 'Balance List',
									}" />
							</li> -->
						</ul>
					</div>
				</li>
			</ul>
		</template>
		<template v-else-if="appStore.user.data.user.role == 'saleOnly'">
			<ul class="list-unstyled p-1">
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#home-collapse"
						aria-expanded="true">
						Master Data
					</button>
					<div class="collapse show" id="home-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<!-- <li>
				  <NavLink :payload="{ url: 'master.category', name: 'Category' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.sub-category',
					name: 'Sub Category',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{ url: 'master.brand', name: 'Brand' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.medicine-list',
					name: 'Medicine List',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-medicine',
					name: 'Procedure Medicine',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-accessory',
					name: 'Procedure Accessory',
				  }" />
				</li> -->
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment-list',
										name: 'Treatment List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment',
										name: 'Treatment',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#sale-collapse"
						aria-expanded="true">
						Sale
					</button>
					<div class="collapse show" id="sale-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{ url: 'sale.medicine', name: 'Medicine Sale' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'sale.treatment',
										name: 'Treatment Sale',
									}" />
							</li>
							<!-- <li>
				  <NavLink :payload="{ url: 'sale.medicine-list', name: 'Medicine Sale List' }" />
				</li> -->
							<li>
								<NavLink
									:payload="{
										url: 'sale.vouchers-list',
										name: 'Voucher List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'sale.repay-credit-list',
										name: 'Balance List',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#appointment-collapse"
						aria-expanded="true">
						Booking
					</button>
					<div class="collapse show" id="appointment-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{ url: 'appointment.create', name: 'Create' }" />
							</li>
							<li>
								<NavLink :payload="{ url: 'appointment.list', name: 'List' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'appointment.service-list',
										name: 'Service List',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#stockCountAndPrice"
						aria-expanded="true">
						Admin
					</button>
					<div class="collapse show" id="stockCountAndPrice">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{
										url: 'admin.stock-count-and-price',
										name: 'Stock Count And Price',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'admin.top-ten-list',
										name: 'Top 10 List',
									}" />
							</li>

							<!-- <li>
				  <NavLink :payload="{
					url: 'stock-request.create',
					name: 'Stock Request',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'stock-request',
					name: 'Stock Request List',
				  }" />
				</li> -->
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#patient-collapse"
						aria-expanded="true">
						Patient
					</button>
					<div class="collapse show" id="patient-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink :payload="{ url: 'patient', name: 'Patient List' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'patient.register',
										name: 'Patient Register',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#account-collapse"
						aria-expanded="true">
						Account
					</button>
					<div class="collapse show" id="account-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{
										url: 'account.income-total',
										name: 'Income Total',
									}" />
							</li>
							<li>
								<NavLink :payload="{ url: 'account.income', name: 'Income' }" />
							</li>
							<li>
								<NavLink
									:payload="{ url: 'account.expense', name: 'Expense' }" />
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</template>
		<template v-else-if="appStore.user.data.user.role == 'cashier'">
			<ul class="list-unstyled p-1">
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#home-collapse"
						aria-expanded="true">
						Master Data
					</button>
					<div class="collapse show" id="home-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<!-- <li>
				  <NavLink :payload="{ url: 'master.category', name: 'Category' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.sub-category',
					name: 'Sub Category',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{ url: 'master.brand', name: 'Brand' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.medicine-list',
					name: 'Medicine List',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-medicine',
					name: 'Procedure Medicine',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-accessory',
					name: 'Procedure Accessory',
				  }" />
				</li> -->
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment-list',
										name: 'Treatment List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment',
										name: 'Treatment',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#sale-collapse"
						aria-expanded="true">
						Sale
					</button>
					<div class="collapse show" id="sale-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{ url: 'sale.medicine', name: 'Medicine Sale' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'sale.treatment',
										name: 'Treatment Sale',
									}" />
							</li>
							<!-- <li>
				  <NavLink :payload="{ url: 'sale.medicine-list', name: 'Medicine Sale List' }" />
				</li> -->
							<li>
								<NavLink
									:payload="{
										url: 'sale.vouchers-list',
										name: 'Voucher List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'sale.repay-credit-list',
										name: 'Balance List',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#appointment-collapse"
						aria-expanded="true">
						Booking
					</button>
					<div class="collapse show" id="appointment-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{ url: 'appointment.create', name: 'Create' }" />
							</li>
							<li>
								<NavLink :payload="{ url: 'appointment.list', name: 'List' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'appointment.service-list',
										name: 'Service List',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#stockCountAndPrice"
						aria-expanded="true">
						Admin
					</button>
					<div class="collapse show" id="stockCountAndPrice">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{
										url: 'admin.stock-count-and-price',
										name: 'Stock Count And Price',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'admin.top-ten-list',
										name: 'Top 10 List',
									}" />
							</li>

							<!-- <li>
				  <NavLink :payload="{
					url: 'stock-request.create',
					name: 'Stock Request',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'stock-request',
					name: 'Stock Request List',
				  }" />
				</li> -->
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#patient-collapse"
						aria-expanded="true">
						Patient
					</button>
					<div class="collapse show" id="patient-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink :payload="{ url: 'patient', name: 'Patient List' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'patient.register',
										name: 'Patient Register',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#account-collapse"
						aria-expanded="true">
						Account
					</button>
					<div class="collapse show" id="account-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<a
									class="btn text-start text-white p-2"
									@click="openOpeningDialog"
									>Opening</a
								>
							</li>
							<li>
								<NavLink
									:payload="{ url: 'account.report', name: 'Closing' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'account.income-total',
										name: 'Income Total',
									}" />
							</li>
							<li>
								<NavLink :payload="{ url: 'account.income', name: 'Income' }" />
							</li>
							<li>
								<NavLink
									:payload="{ url: 'account.expense', name: 'Expense' }" />
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</template>
		<template v-else-if="appStore.user.data.user.role == 'MD'">
			<ul class="list-unstyled p-1">
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#home-collapse"
						aria-expanded="true">
						Master Data
					</button>
					<div class="collapse show" id="home-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<!-- <li>
				  <NavLink :payload="{ url: 'master.category', name: 'Category' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.sub-category',
					name: 'Sub Category',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{ url: 'master.brand', name: 'Brand' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.medicine-list',
					name: 'Medicine List',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-medicine',
					name: 'Procedure Medicine',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-accessory',
					name: 'Procedure Accessory',
				  }" />
				</li> -->
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment-list',
										name: 'Treatment List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment',
										name: 'Treatment',
									}" />
							</li>
						</ul>
					</div>
				</li>

				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#appointment-collapse"
						aria-expanded="true">
						Booking
					</button>
					<div class="collapse show" id="appointment-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{ url: 'appointment.create', name: 'Create' }" />
							</li>
							<li>
								<NavLink :payload="{ url: 'appointment.list', name: 'List' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'appointment.service-list',
										name: 'Service List',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#stockCountAndPrice"
						aria-expanded="true">
						Admin
					</button>
					<div class="collapse show" id="stockCountAndPrice">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{
										url: 'admin.stock-count-and-price',
										name: 'Stock Count And Price',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'admin.top-ten-list',
										name: 'Top 10 List',
									}" />
							</li>
							<!-- <li>
								<NavLink
									:payload="{
										url: 'doctor-panel',
										name: 'Doctor Panel',
									}" />
							</li> -->
							<!-- <li>
				  <NavLink :payload="{
					url: 'stock-request.create',
					name: 'Stock Request',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'stock-request',
					name: 'Stock Request List',
				  }" />
				</li> -->
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#patient-collapse"
						aria-expanded="true">
						Patient
					</button>
					<div class="collapse show" id="patient-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink :payload="{ url: 'patient', name: 'Patient List' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'patient.register',
										name: 'Patient Register',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#account-collapse"
						aria-expanded="true">
						Account
					</button>
					<div class="collapse show" id="account-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<a
									class="btn text-start text-white p-2"
									@click="openOpeningDialog"
									>Opening</a
								>
							</li>
							<li>
								<NavLink
									:payload="{ url: 'account.report', name: 'Closing' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'account.income-total',
										name: 'Income Total',
									}" />
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</template>
		<template v-else-if="appStore.user.data.user.role == 'doctor'">
			<ul class="list-unstyled p-1">
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#home-collapse"
						aria-expanded="true">
						Master Data
					</button>
					<div class="collapse show" id="home-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<!-- <li>
				  <NavLink :payload="{ url: 'master.category', name: 'Category' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.sub-category',
					name: 'Sub Category',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{ url: 'master.brand', name: 'Brand' }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.medicine-list',
					name: 'Medicine List',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-medicine',
					name: 'Procedure Medicine',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'master.procedure-accessory',
					name: 'Procedure Accessory',
				  }" />
				</li> -->
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment-list',
										name: 'Treatment List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'master.treatment',
										name: 'Treatment',
									}" />
							</li>
						</ul>
					</div>
				</li>

				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#appointment-collapse"
						aria-expanded="true">
						Booking
					</button>
					<div class="collapse show" id="appointment-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{ url: 'appointment.create', name: 'Create' }" />
							</li>
							<li>
								<NavLink :payload="{ url: 'appointment.list', name: 'List' }" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'appointment.service-list',
										name: 'Service List',
									}" />
							</li>
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#stockCountAndPrice"
						aria-expanded="true">
						Admin
					</button>
					<div class="collapse show" id="stockCountAndPrice">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink
									:payload="{
										url: 'admin.top-ten-list',
										name: 'Top 10 List',
									}" />
							</li>
							<li>
								<NavLink
									:payload="{
										url: 'doctor-panel',
										name: 'Doctor Panel',
									}" />
							</li>
							<!-- <li>
				  <NavLink :payload="{
					url: 'stock-request.create',
					name: 'Stock Request',
				  }" />
				</li>
				<li>
				  <NavLink :payload="{
					url: 'stock-request',
					name: 'Stock Request List',
				  }" />
				</li> -->
						</ul>
					</div>
				</li>
				<li class="mb-1 pb-1">
					<button
						class="btn btn-toggle d-inline-flex align-items-center rounded border-0 collapsed"
						data-bs-toggle="collapse"
						data-bs-target="#patient-collapse"
						aria-expanded="true">
						Patient
					</button>
					<div class="collapse show" id="patient-collapse">
						<ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
							<li>
								<NavLink :payload="{ url: 'patient', name: 'Patient List' }" />
							</li>
						</ul>
					</div>
				</li>
			</ul>
		</template>
	</div>
</template>

<script setup>
import { openDialog } from "../../helpers"
import NavLink from "./NavLink.vue"
import { useAppStore } from "../../stores/app"

const appStore = useAppStore()

const openOpeningDialog = async () => {
	openDialog("openingAccountDialog")
	appStore.fetchAccountData = true
}
</script>

<style lang="scss" scoped>
.btn-toggle {
	color: rgb(0, 0, 0) !important;
	font-weight: 600;
	background-color: transparent;
	width: 100%;
	position: relative;
	margin-bottom: 5px;
}

.btn-toggle:hover,
.btn-toggle:focus {
	color: white;
	background-color: rgba(255, 255, 255, 0.5);
}

.btn-toggle::before {
	width: 1.25em;
	line-height: 0;
	margin-right: 5px;
	right: 0;
	position: absolute;
	content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
	transition: transform 0.35s ease;
	transform-origin: 0.5em 50%;
}

.btn-toggle[aria-expanded="true"] {
	color: white;
}

.btn-toggle[aria-expanded="true"]::before {
	transform: rotate(90deg);
}

.btn-toggle-nav a {
	padding: 0.1875rem 0.5rem;
	margin-bottom: 0.25rem;
	margin-top: 0.125rem;
	margin-left: 0.75rem;
	border: 1px solid #7e5f01 !important;
	box-shadow: 0 0 1rem rgba(0, 0, 0, 0.15) !important;
	font-size: 14px;
	color: black !important;
}

.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
	background-color: rgba(255, 255, 255, 0.5);
}

li a {
	width: calc(100% - 0.75rem);
}

.nav-on {
	width: 220px;
	opacity: 100;
}

.nav-off {
	width: 220px;
	opacity: 0;
}
</style>
