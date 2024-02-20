import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useBrandStore = defineStore("brand", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchBrands() {
			return getAxiosClient()
				.get("brands")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
