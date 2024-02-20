import { defineStore } from "pinia"
import { getAxiosClient } from "../data/axios"
import { useAppStore } from "./app"

export const usePatientStore = defineStore("patient", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchPatients(payload) {
			// const appStore = useAppStore()
			return getAxiosClient()
				.get(`patients`, {
					params: {
						// relatedBranch: appStore.user.data.user.branch,
						...payload,
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},

		repayFilterForBankCashList(payload) {
			// /api/repaies
			return getAxiosClient()
				.get("/repay/filter", { params: { ...payload } })
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		repayFilter(payload) {
			// /api/repaies
			return getAxiosClient()
				.get("/repaies", { params: { ...payload } })
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchAllDebt(payload) {
			// const appStore = useAppStore()
			return getAxiosClient()
				.get("debts", { params: { ...payload } })
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchDebt(payload) {
			return getAxiosClient()
				.get("debt/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		debtRepay(payload) {
			return getAxiosClient()
				.put("debt", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchPatient(payload) {
			return getAxiosClient()
				.get("patient/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		createPatient(payload) {
			// const appStore = useAppStore()
			// payload.append("relatedBranch", appStore.user.data.user.branch)
			return getAxiosClient()
				.post("patient", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		importPatientExcel(payload) {
			return getAxiosClient()
				.post(`patients/excel`, payload)
				.then(res => res.data)
				.catch(err => {
					throw err
				})
		},
		fetchMedicineHistoryAndPhysicalExamination(payload) {
			return getAxiosClient()
				.get("patients/history-and-patient/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		updatePatient(payload, id) {
			return getAxiosClient()
				.put("patient", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		deletePatient(payload) {
			return getAxiosClient()
				.delete("patient/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchRelatedTreatmentVouchers(payload) {
			return getAxiosClient()
				.post("treatment-vouchers/filter", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchRelatedTreatmentSelections(payload) {
			return getAxiosClient()
				.post("treatment-selections/filter", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		patientFilter(payload) {
			return getAxiosClient()
				.get("patients-filter", {
					params: {
						...payload,
					},
				})
				.then(res => res.data)
				.catch(error => {
					throw error
				})
		},
		searchPatient(payload) {
			return getAxiosClient()
				.post("patients-search", payload)
				.then(res => res.data)
				.catch(error => {
					throw error
				})
		},
	},
})
