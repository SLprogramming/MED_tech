import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useRefundStore = defineStore("refund", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		voucherRefund(payload) {
			// const appStore = useAppStore()
			// payload.relatedBranch = appStore.user.data.user.branch
			return getAxiosClient()
				.post("refund", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
