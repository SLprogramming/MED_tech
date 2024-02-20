import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useSaleReturnStore = defineStore("saleReturn", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		createSaleReturn(payload) {
			return getAxiosClient()
				.post("sale-return", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
