import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useProcedureAccessoryStore = defineStore("procedureAccessory", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchProcedureAccessories() {
			return getAxiosClient()
				.get("procedure-accessories")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchRelatedAccessoryItems(payload) {
			return getAxiosClient()
				.get("accessory-items/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
