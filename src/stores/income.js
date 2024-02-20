import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useIncomeStore = defineStore("income", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchIncomes() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("incomes", {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		createIncome(payload) {
			const appStore = useAppStore()
			// payload.append("relatedBranch", appStore.user.data.user.branch)
			// payload.relatedBranch = appStore.user.data.user.branch
			return getAxiosClient()
				.post("income", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		deleteIncome(payload) {
			return getAxiosClient()
				.delete("income/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchIncomesByDate(date) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("incomes/get-date", {
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
		incomeFilter(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("incomes/filter", {
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

		incomeTotal() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("incomes/total-income", {
					params: {
						relatedBranch: appStore.user.data.user.branch,
						exactDate: new Date().toISOString(),
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},

		dailyIncomePerMonth(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("sales-to-today", {
					params: {
						dates: payload.date,
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		monthlyIncome(payload) {
			return getAxiosClient()
				.get("incomes", { params: { ...payload } })
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
