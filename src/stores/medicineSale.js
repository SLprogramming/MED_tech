import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useMedicineSaleStore = defineStore("medicineSale", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchMedicineSales() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("medicine-sales", {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		createMedicineSale(payload) {
			const appStore = useAppStore()
			// payload.append("relatedBranch", appStore.user.data.user.branch)
			payload.relatedBranch = appStore.user.data.user.branch
			return getAxiosClient()
				.post("medicine-sale", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		createMedicineSaleSingle(payload) {
			payload.tsType = "MS"
			console.log(payload)
			return getAxiosClient()
				.post("treatment-vouchers/ms/single", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		createMedicineSaleCombine(payload) {
			payload.tsType = "Combined"
			console.log(payload)
			return getAxiosClient()
				.put("treatment-vouchers/ms/combine", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		searchMedicineSale(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.post(
					"medicine-sales/search?relatedBranch=" +
						appStore.user.data.user.branch,
					{
						search: payload.search,
					}
				)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		// fitlerMedicineSale(payload) {
		//   const appStore = useAppStore()
		// 	return getAxiosClient()
		// 		.get(
		// 			"medicine-sales/filter?relatedBranch=" + appStore.user.data.user.branch,
		// 			payload
		// 		)
		// 		.then(res => {
		// 			return res.data
		// 		})
		// 		.catch(error => {
		// 			throw error
		// 		})
		// },
		fetchVoucherCode() {
			return (
				getAxiosClient()
					// .get("medicine-sales/code")
					.get("treatment-vouchers/code/ms")
					.then(res => {
						return res.data
					})
					.catch(error => {
						throw error
					})
			)
		},
		fetchVoucherCodeForTreatment() {
			return (
				getAxiosClient()
					// .get("medicine-sales/code")
					.get("treatment-vouchers/code")
					.then(res => {
						return res.data
					})
					.catch(error => {
						throw error
					})
			)
		},
		fetchMedicineSaleByDate(date) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("medicine-sales/get-date", {
					params: {
						relatedBranch: appStore.user.data.user.branch,
						exact: date,
					},
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		medicineSaleFilter(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get("treatment-vouchers/TV-Filter", {
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
