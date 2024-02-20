import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const useUserStore = defineStore("user", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchUsers() {
			return getAxiosClient()
				.get("users")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
