import { defineStore } from "pinia"
import { getAxiosClient } from "../data/axios"
import { useAppStore } from "./app"

export const useAdvanceRecordStore = defineStore("advanceRecord", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchAdvanceRecords() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get(`advance-records`, {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		createAdvanceRecord(payload) {
			const appStore = useAppStore()
			// payload.append("relatedBranch", appStore.user.data.user.branch)
			if (payload instanceof FormData) {
				payload.append("relatedBranch", appStore.user.data.user.branch)
			} else {
				payload.relatedBranch = appStore.user.data.user.branch
			}
			return getAxiosClient()
				.post("advance-record", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
