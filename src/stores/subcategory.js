import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useSubcategoryStore = defineStore("subcategory", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchSubCategories() {
			return getAxiosClient()
				.get("sub-categories")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
