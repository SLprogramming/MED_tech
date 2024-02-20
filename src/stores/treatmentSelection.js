import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useTreatmentSelectionStore = defineStore("treatmentSelection", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchTreatmentSelections() {
			return getAxiosClient()
				.get("treatment-selections")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchTreatmentSelection(payload) {
			return getAxiosClient()
				.get("treatment-selection/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		addTreatmentSelection(payload) {
			// const appStore = useAppStore()
			// if (payload instanceof FormData) {
			// 	payload.append("relatedBranch", appStore.user.data.user.branch)
			// } else {
			// 	payload.relatedBranch = appStore.user.data.user.branch
			// }
			return getAxiosClient()
				.post("treatment-selection", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		addMultiTreatmentSelection(payload) {
			// const appStore = useAppStore()
			// if (payload instanceof FormData) {
			// 	payload.append("relatedBranch", appStore.user.data.user.branch)
			// } else {
			// 	payload.relatedBranch = appStore.user.data.user.branch
			// }
			return getAxiosClient()
				.post("treatment-selections/multi", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchCode() {
			return getAxiosClient()
				.get("treatment-selections/code")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchRelatedProcedureHistory(payload) {
			return getAxiosClient()
				.get("procedure-histories/filter", {
					params: {
						relatedTreatmentSelection: payload.relatedTreatmentSelection,
						relatedAppointment: payload.relatedAppointment,
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchTopTenList(payload) {
			return getAxiosClient()
				.get("treatment-selections/top-ten", { params: { ...payload } })
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
		fetchRelatedRepayments(payload) {
			return getAxiosClient()
				.get("repay-record/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		repayment(payload) {
			const appStore = useAppStore()
			// payload.relatedBranch = appStore.user.data.user.branch
			if (payload instanceof FormData) {
				payload.append("relatedBranch", appStore.user.data.user.branch)
			} else {
				payload.relatedBranch = appStore.user.data.user.branch
			}
			return getAxiosClient()
				.put("treatment-selections/payment", payload)
				.then(res => res.data)
				.catch(error => {
					throw error
				})
		},
		treatmentSelectionDone(payload) {
			return getAxiosClient()
				.post("treatment-selections/update-status", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		sendEmail(payload) {
			return getAxiosClient()
				.post("treatment-selections/email", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
