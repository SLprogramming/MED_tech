import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useAccessoryItemStore = defineStore("accessoryItem", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
    fetchAccessoryItems() {
      const appStore = useAppStore()
			return getAxiosClient()
				.get("accessory-items", {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		updateAccessoryItem(payload) {
			return getAxiosClient()
				.put("accessory-item", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
