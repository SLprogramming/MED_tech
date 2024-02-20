import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useMasterDataStore = defineStore("masterData", {
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
