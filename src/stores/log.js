import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useLogStore = defineStore("log", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		addUsage(payload) {
			const appStore = useAppStore()
			// if (payload instanceof FormData) {
			// 	payload.append("relatedBranch", appStore.user.data.user.branch)
			// } else {
			// 	payload.relatedBranch = appStore.user.data.user.branch
			// }
			return getAxiosClient()
				.post("logs/usage", payload)
				.then(res => {
					return res.data
				})
				.catch(error => console.log(error))
		},
		getUsages(payload) {
			return getAxiosClient()
				.get("logs/usage/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => console.log(error))
		},
		getRelatedBranchStock(payload) {
			const appStore = useAppStore()
			if (payload instanceof FormData) {
				payload.append("relatedBranch", appStore.user.data.user.branch)
			} else {
				payload.relatedBranch = appStore.user.data.user.branch
      }
      console.log(payload)
			return getAxiosClient()
				.post("logs/usages/stock", payload)
				.then(res => res.data)
				.catch(error => console.log(error))
		},
	},
})
