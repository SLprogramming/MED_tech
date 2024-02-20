import { defineStore } from "pinia"
import { getAxiosClient } from "../data/axios"
import { useAppStore } from "./app"

export const useMemberStore = defineStore("member", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchMembers() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get(`members`, {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
