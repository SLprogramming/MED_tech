import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useTreatmentStore = defineStore("treatment", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchTreatments() {
			return getAxiosClient()
				.get("treatments")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchTreatment(payload) {
			return getAxiosClient()
				.get("treatment/" + payload.id)
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
	},
})
