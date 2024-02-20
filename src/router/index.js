import { createRouter, createWebHistory } from "vue-router"
import { useAppStore } from "./../stores/app"
import Dashboard from "../views/Dashboard.vue"

import Category from "@/views/Category/Category.vue"
import Brand from "@/views/Brand/Brand.vue"
import SubCategory from "@/views/Subcategory/SubCategory.vue"
import MedicineList from "@/views/MedicineList/MedicineList.vue"
import ProcedureMedicine from "@/views/ProcedureMedicine/ProcedureMedicine.vue"
import ProcedureAccessory from "@/views/ProcedureAccessory/ProcedureAccessory.vue"

import ProcedureHistoryCreate from "@/views/ProcedureHistory/ProcedureHistoryCreate.vue"

import Login from "@/views/auth/Login.vue"
import AuthLayout from "@/views/Layout/AuthLayout.vue"
import AppLayout from "@/views/Layout/AppLayout.vue"
import MedicineSale from "@/views/Sale/MedicineSale.vue"
import RepayList from "@/views/Sale/RepayList.vue"
import TreatmentSale from "@/views/Sale/TreatmentSale.vue"
import AppointmentCreate from "@/views/Appointment/AppointmentCreate.vue"
import AppointmentDetail from "@/views/Appointment/AppointmentDetail.vue"
import AppointmentEdit from "@/views/Appointment/AppointmentEdit.vue"
import AppointmentList from "@/views/Appointment/AppointmentList.vue"
import ServiceList from "@/views/Appointment/ServiceList.vue"
import TreatmentSelectionPayment from "@/views/Payment/TreatmentSelectionPayment.vue"
import MedicineHistoryCreate from "@/views/MedicineHistory/MedicineHistoryCreate.vue"
import StockCountAndPrice from "@/views/Admin/StockCountAndPrice.vue"
import TopTenList from "@/views/Admin/TopTenList.vue"

import RelatedMedicineItems from "@/views/MedicineList/RelatedMedicineItems.vue"
import RelatedProcedureItems from "@/views/ProcedureMedicine/RelatedProcedureItems.vue"
import RelatedAccessoryItems from "@/views/ProcedureAccessory/RelatedAccessoryItems.vue"
import RelatedTreatment from "../views/TreatmentList/RelatedTreatment.vue"

import PatientList from "@/views/Patient/PatientList.vue"
import PatientDetail from "@/views/Patient/PatientDetail.vue"
import PatientRegister from "@/views/Patient/PatientRegister.vue"
import PatientEdit from "@/views/Patient/PatientEdit.vue"
import PatientCredit from "@/views/Patient/Credit.vue"
import RepayAndCreditList from "@/views/Patient/RepayAndCreditList.vue"

import TreatmentList from "@/views/TreatmentList/TreatmentList.vue"
import Treatment from "@/views/Treatment/Treatment.vue"

import MedicineSaleList from "../views/Sale/MedicineSaleList.vue"
import StockRequest from "../views/Admin/StockRequest.vue"
import StockRequestList from "../views/Admin/StockRequestList.vue"
import StockRequestDetail from "../views/Admin/StockRequestDetail.vue"

import VoucherDetail from "@/views/Sale/VoucherDetail.vue"
import TreatmentVouchersList from "../views/Sale/VouchersList.vue"
import Report from "../views/Account/Report.vue"
import IncomeTotal from "../views/Account/IncomeTotal.vue"
import IncomeList from "../views/Income/IncomeList.vue"
import IncomeEdit from "../views/Income/IncomeEdit.vue"

import DoctorPanel from "../views/Doctor/DoctorPanel.vue"

import ExpenseList from "../views/Expense/ExpenseList.vue"
import ExpenseEdit from "../views/Expense/ExpenseEdit.vue"

import Test from "../views/test.vue"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "AppLayout",
			component: AppLayout,
			meta: {
				requiresAuth: true,
			},
			children: [
				{
					path: "",
					name: "home",
					component: Dashboard,
				},
				{
					path: "/master",
					name: "master",
					children: [
						// {
						// 	path: "category",
						// 	name: "master.category",
						// 	component: Category,
						// },
						// {
						// 	path: "sub-category",
						// 	name: "master.sub-category",
						// 	component: SubCategory,
						// },
						// {
						// 	path: "brand",
						// 	name: "master.brand",
						// 	component: Brand,
						// },
						// {
						// 	path: "medicine-list",
						// 	name: "master.medicine-list",
						// 	component: MedicineList,
						// },
						// {
						// 	path: "procedure-medicine",
						// 	name: "master.procedure-medicine",
						// 	component: ProcedureMedicine,
						// },
						// {
						// 	path: "procedure-accessory",
						// 	name: "master.procedure-accessory",
						// 	component: ProcedureAccessory,
						// },
						{
							path: "treatment-list",
							name: "master.treatment-list",
							component: TreatmentList,
						},
						{
							path: "treatment",
							name: "master.treatment",
							component: Treatment,
						},
					],
				},
				{
					path: "sale",
					children: [
						{
							path: "medicine",
							name: "sale.medicine",
							component: MedicineSale,
						},
						{
							path: "treatment",
							name: "sale.treatment",
							component: TreatmentSale,
						},
						{
							path: "medicine-sale-list",
							name: "sale.medicine-list",
							component: MedicineSaleList,
						},
						{
							path: "vouchers-list",
							name: "sale.vouchers-list",
							component: TreatmentVouchersList,
						},
						{
							path: "repay-list",
							name: "sale.repay-list",
							component: RepayList,
						},
						{
							path: "repay-credit-list",
							name: "sale.repay-credit-list",
							component: RepayAndCreditList,
						},
						{
							path: "voucher-detail/:id",
							name: "sale.voucher-detail",
							props: true,
							component: VoucherDetail,
						},
					],
				},
				{
					path: "/doctor-panel",
					name: "doctor-panel",
					component: DoctorPanel,
				},
				{
					path: "medicine-history",
					children: [
						{
							path: "create",
							name: "medicine-history.create",
							component: MedicineHistoryCreate,
						},
					],
				},
				{
					path: "medicine-list",
					name: "medicine-list",
					children: [
						{
							path: ":id",
							name: "medicine-list.detail",
							props: true,
							children: [
								{
									path: "related-medicine-items",
									props: true,
									name: "medicine-list.related-medicine-items",
									component: RelatedMedicineItems,
								},
							],
						},
					],
				},
				{
					path: "procedure-medicine",
					name: "procedure-medicine",
					children: [
						{
							path: ":id",
							name: "procedure-medicine.detail",
							props: true,
							children: [
								{
									path: "related-procedure-items",
									props: true,
									name: "procedure-medicine.related-procedure-items",
									component: RelatedProcedureItems,
								},
							],
						},
					],
				},
				{
					path: "treatment-list",
					name: "treatment-list",
					children: [
						{
							path: ":id",
							name: "treatment-list.detail",
							props: true,
							children: [
								{
									path: "related-treatments",
									props: true,
									name: "treatment-list.related-treatments",
									component: RelatedTreatment,
								},
							],
						},
					],
				},
				{
					path: "procedure-history",
					children: [
						{
							path: "create",
							name: "procedure-history.create",
							component: ProcedureHistoryCreate,
						},
					],
				},
				{
					path: "procedure-accessory",
					name: "procedure-accessory",
					children: [
						{
							path: ":id",
							name: "procedure-accessory.detail",
							props: true,
							children: [
								{
									path: "related-accessory-items",
									props: true,
									name: "procedure-accessory.related-accessory-items",
									component: RelatedAccessoryItems,
								},
							],
						},
					],
				},
				{
					path: "appointment",
					children: [
						{
							path: "create",
							name: "appointment.create",
							component: AppointmentCreate,
						},
						{
							path: ":id",
							props: true,
							name: "appointment.detail",
							component: AppointmentDetail,
						},
						{
							path: "edit/:id",
							props: true,
							name: "appointment.edit",
							component: AppointmentEdit,
						},
						{
							path: "",
							name: "appointment.list",
							component: AppointmentList,
						},
						{
							path: "service-list",
							name: "appointment.service-list",
							component: ServiceList,
						},
					],
				},
				{
					path: "treatment-selection-payment/:patientId",
					name: "payment.treatment-selection-payment",
					props: true,
					component: TreatmentSelectionPayment,
				},
				{
					path: "admin",
					name: "admin",
					children: [
						{
							path: "stock-count-and-price",
							name: "admin.stock-count-and-price",
							component: StockCountAndPrice,
						},
						{
							path: "top-ten-list",
							name: "admin.top-ten-list",
							component: TopTenList,
						},
						// {
						// 	path: "stock-request",
						// 	name: "admin.stock-request",
						// 	component: StockRequest,
						// },
						// {
						// 	path: "stock-request-list",
						// 	name: "admin.stock-request-list",
						// 	component: StockRequestList,
						// },
						{
							path: "stock-request",
							children: [
								{
									path: "",
									name: "stock-request",
									component: StockRequestList,
								},
								{
									path: "create",
									name: "stock-request.create",
									component: StockRequest,
								},
								{
									path: ":id",
									name: "stock-request.detail",
									props: true,
									component: StockRequestDetail,
								},
							],
						},
					],
				},
				{
					path: "account",
					children: [
						{
							path: "report",
							name: "account.report",
							component: Report,
						},
						{
							path: "income-total",
							name: "account.income-total",
							component: IncomeTotal,
						},
						{
							path: "income",
							children: [
								{
									path: "",
									name: "account.income",
									component: IncomeList,
								},
								{
									path: "edit/:id",
									props: true,
									name: "account.income.edit",
									component: IncomeEdit,
								},
							],
						},
						{
							path: "expense",
							children: [
								{
									path: "",
									name: "account.expense",
									component: ExpenseList,
								},
								{
									path: "edit/:id",
									props: true,
									name: "account.expense.edit",
									component: ExpenseEdit,
								},
							],
						},
					],
				},
				{
					path: "patient",
					children: [
						{
							path: "",
							name: "patient",
							component: PatientList,
						},
						{
							path: "register",
							name: "patient.register",
							component: PatientRegister,
						},
						{
							path: "edit/:id",
							props: true,
							name: "patient.edit",
							component: PatientEdit,
						},
						{
							path: "credit/:id",
							props: true,
							name: "patient.credit",
							component: PatientCredit,
						},
						{
							path: ":id",
							name: "patient.detail",
							props: true,
							component: PatientDetail,
						},
					],
				},
			],
		},
		{
			path: "/test",
			name: "test",
			component: Test,
		},
		{
			path: "/auth",
			name: "Auth",
			component: AuthLayout,
			meta: {
				requiresGuest: true,
			},
			children: [
				{
					path: "login",
					name: "login",
					component: Login,
				},
			],
		},
		{
			path: "/about",
			name: "about",
			// route level code-splitting
			// this generates a separate chunk (About.[hash].js) for this route
			// which is lazy-loaded when the route is visited.
			// component: () => import('../views/AboutView.vue')
		},
		{
			path: "/test",
			name: "test",
			component: () => import("../components/General/SaleVoucherModal.vue"),
		},
	],
	linkActiveClass: "active",
	linkExactActiveClass: "exact-active",
})

router.beforeEach((to, from, next) => {
	// if (to.name !== from.name) {
	//   to.meta.prevRouteName = from.name
	// } else {
	//   to.meta.prevRouteName = from.meta.prevRouteName
	// }
	const appStore = useAppStore()
	if (to.meta.requiresAuth && !appStore.user.token) {
		next({ name: "login" })
	} else if (to.meta.requiresGuest && appStore.user.token) {
		next({ name: "home" })
	} else {
		next()
	}
})

export default router
