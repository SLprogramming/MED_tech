import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useCurrencyStore = defineStore("currency", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchCurrencies() {
			return getAxiosClient()
				.get("currencies")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
