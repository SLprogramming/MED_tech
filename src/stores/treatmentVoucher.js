import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useTreatmentVoucherStore = defineStore("treatmentVoucher", {
	state: () => ({
		// sidebar: true,
		repayList: ["repay", "repay1"],
	}),
	actions: {
		fetchTreatmentVouchers(payload) {
			const appStore = useAppStore()
			// let params = {}

			// if (payload) {
			// 	params.tsType = payload.tsType
			// }

			return getAxiosClient()
				.get("treatment-vouchers/filter", {
					params: {
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
		fetchTreatmentVoucher(payload) {
			const appStore = useAppStore()

			return getAxiosClient()
				.get("treatment-voucher/" + payload.id, {
					params: {
						relatedBranch: appStore.user.data.user.branch,
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		updateTreatmentVoucher(payload) {
			return getAxiosClient()
				.put("treatment-voucher", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		importVoucherExcel(payload) {
			return getAxiosClient()
				.post(`treatment-vouchers/excel`, payload)
				.then(res => res.data)
				.catch(err => {
					throw err
				})
		},
		updateMedicineVoucher(payload) {
			return getAxiosClient()
				.put("treatment-vouchers/ms", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		deleteMedicineVoucher(payload) {
			return getAxiosClient()
				.delete("treatment-vouchers/ms/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchTreatmentVoucherByTreatmentSelectionId(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get(`treatment-vouchers/treatment-selection/${payload.id}`, {
					params: {
						relatedBranch: appStore.user.data.user.branch,
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchTreatmentVouchersByDate(date) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("treatment-vouchers/get-date", {
					params: {
						relatedBranch: appStore.user.data.user.branch,
						exact: date,
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		treatmentVoucherFilter(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("treatment-vouchers/TV-Filter", {
					params: {
						// relatedBranch: appStore.user.data.user.branch,
						// start: payload.start,
						// end: payload.end,
						// relatedDoctor: payload.relatedDoctor,
						// createdBy: payload.createdBy,
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
		deleteTreatmentVoucher(payload) {
			return getAxiosClient()
				.delete("treatment-voucher/" + payload.id, {
					params: {
						relatedTreatmentSelection: payload.relatedTreatmentSelection,
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
