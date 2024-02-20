import { defineStore } from "pinia"
import { getAxiosClient } from "../data/axios"
import { useAppStore } from "./app"

export const useDoctorStore = defineStore("doctor", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchDoctors() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get(`doctors`, {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		verifyDoctor(payload) {
			//name,code
			// const appStore = useAppStore()
			return getAxiosClient()
				.post(`login/doctor/verfiy`, payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
