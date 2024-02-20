import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useBranchStore = defineStore("branch", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchBranches() {
			return getAxiosClient()
				.get("branches")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
