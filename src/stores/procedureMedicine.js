import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useProcedureMedicineStore = defineStore("procedureMedicine", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchProcedureMedicines() {
			return getAxiosClient()
				.get("procedure-medicines")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchRelatedProcedureItems(payload) {
			return getAxiosClient()
				.get("procedure-items/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
