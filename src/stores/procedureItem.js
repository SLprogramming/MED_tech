import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useProcedureItemStore = defineStore("procedureItem", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
    fetchProcedureItems() {
      const appStore = useAppStore()
			return getAxiosClient()
				.get("procedure-items", {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		updateProcedureItem(payload) {
			return getAxiosClient()
				.put("procedure-item", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
