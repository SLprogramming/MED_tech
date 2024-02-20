import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useTreatmentListStore = defineStore("treatmentList", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchTreatmentLists() {
			return getAxiosClient()
				.get("treatment-lists")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchRelatedTreatments(payload) {
			return getAxiosClient()
				.get("treatments/list/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchTreatmentUnits() {
			return getAxiosClient()
				.get("treatments")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
