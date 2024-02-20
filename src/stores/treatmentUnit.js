import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useTreatmentUnitStore = defineStore("treatmentUnit", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchTreatmentUnits() {
			return getAxiosClient()
				.get("treatment-units")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
