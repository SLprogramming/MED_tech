import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const usePackageStore = defineStore("package", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		fetchPackages() {
			return getAxiosClient()
				.get("packages")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchPackage(payload) {
			return getAxiosClient()
				.get("package/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchRelatedPackageVouchers(payload) {
			return getAxiosClient()
				.post("package-vouchers/filter", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
