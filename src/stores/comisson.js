import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useComissionStore = defineStore("comission", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		calculateComission(payload) {
			return getAxiosClient()
				.post("comission", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
