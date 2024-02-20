import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useMedicineListStore = defineStore("medicineList", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchMedicineLists() {
			return getAxiosClient()
				.get("medicine-lists")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchRelatedMedicineItems(payload) {
			return getAxiosClient()
				.get("medicine-items/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
