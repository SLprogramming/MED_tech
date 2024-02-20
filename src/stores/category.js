import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useCategoryStore = defineStore("category", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchCategories() {
			return getAxiosClient()
				.get("categories")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
