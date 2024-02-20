import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useStockRequestStore = defineStore("stockRequest", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchStockRequests() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("stock-requests", {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => res.data)
				.catch(err => {
					throw err
				})
		},
		fetchStockRequest(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("stock-request/" + payload.id, {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => res.data)
				.catch(err => {
					throw err
				})
		},
		fetchCode() {
			return getAxiosClient()
				.get("stock-requests/code")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		sendStockRequet(payload) {
			const appStore = useAppStore()
			payload.relatedBranch = appStore.user.data.user.branch
			return getAxiosClient()
				.post("stock-request", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		recievedStockRequest(payload) {
			const appStore = useAppStore()
			payload.relatedBranch = appStore.user.data.user.branch
			return getAxiosClient()
				.put("stocks/recieved", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
