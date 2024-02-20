import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useAccountingListStore = defineStore("accountingList", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchAccountingLists() {
			return getAxiosClient()
				.get("accounting-lists")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
