import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useMedicineItemStore = defineStore("medicineItem", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
    fetchMedicineItems() {
      const appStore = useAppStore()
			return getAxiosClient()
				.get("medicine-items", {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		updateMedicineItem(payload) {
			return getAxiosClient()
				.put("medicine-item", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
