import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useProcedureHistoryStore = defineStore("procedureHistory", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		addProcedureHistory(payload) {
			return getAxiosClient()
				.post("procedure-history", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		updateProcedureHistory(payload) {
			return getAxiosClient()
				.put("procedure-history", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
