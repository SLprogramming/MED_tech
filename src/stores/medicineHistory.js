import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useMedicineHistoryStore = defineStore("medicineHistory", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		createMedicineHistory(payload) {
			return getAxiosClient()
				.post("history", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		updateMedicineHistory(payload) {
			return getAxiosClient()
				.put("history", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
