import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useAccountBalanceStore = defineStore("accountBalance", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchAccountBalanceByRelatedAccountAndType(payload) {
			return getAxiosClient()
				.get("account-balances/closing", { params: payload })
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchOpeningAccountBalanceWithBackDate(payload) {
			return getAxiosClient()
				.post("account-balances/closing", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchClosingAcountBalance() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("account-balances/closing", {
					params: {
						relatedAccounting: appStore.account._id,
						type: "Closing",
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchOpeningAcountBalance() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("account-balances/closing", {
					params: {
						relatedAccounting: appStore.account._id,
						type: "Opening",
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchDataForReport(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("account-balances/opening-closing", {
					params: {
						relatedAccounting: appStore.account._id,
						type: "Opening",
						exact: payload.date,
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		createAccountBalance(payload) {
			const appStore = useAppStore()
			if (payload instanceof FormData) {
				payload.append("relatedBranch", appStore.user.data.user.branch)
			} else {
				payload.relatedBranch = appStore.user.data.user.branch
			}
			console.log(payload)
			return getAxiosClient()
				.post("account-balance", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		updateAccountBalance(payload) {
			console.log(payload)
			return getAxiosClient()
				.put("account-balance", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
