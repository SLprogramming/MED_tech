import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useExpenseStore = defineStore("expense", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchExpenses() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("expenses", {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		createExpense(payload) {
			const appStore = useAppStore()
			// payload.append("relatedBranch", appStore.user.data.user.branch)
			payload.relatedBranch = appStore.user.data.user.branch
			return getAxiosClient()
				.post("expense", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		deleteExpense(payload) {
			return getAxiosClient()
				.delete("expense/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchExpensesByDate(date) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("expenses/get-date", {
					params: {
						relatedBranch: appStore.user.data.user.branch,
						date: date,
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		expenseFilter(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("expenses/filter", {
					params: {
						relatedBranch: appStore.user.data.user.branch,
						start: payload.start,
						end: payload.end,
						createdBy: payload.createdBy,
					},
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
