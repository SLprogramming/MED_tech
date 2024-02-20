import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const usePackageSelectionStore = defineStore("packageSelection", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchPackageSelections() {
			return getAxiosClient()
				.get("package-selections")
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchPackageSelection(payload) {
			return getAxiosClient()
				.get("package-selection/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		appointmentGenereate(payload) {
			// const appStore = useAppStore()
			// if (payload instanceof FormData) {
			// 	payload.append("relatedBranch", appStore.user.data.user.branch)
			// } else {
			// 	payload.relatedBranch = appStore.user.data.user.branch
			// }
			return getAxiosClient()
				.post("package-selections/generate", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		addPackageSelection(payload) {
			// const appStore = useAppStore()
			// if (payload instanceof FormData) {
			// 	payload.append("relatedBranch", appStore.user.data.user.branch)
			// } else {
			// 	payload.relatedBranch = appStore.user.data.user.branch
			// }
			return getAxiosClient()
				.post("package-selection", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		getAppointments(payload) {
			return getAxiosClient()
				.get("package-selections/appointment", {
					params: {
						relatedPackageSelection: payload.relatedPackageSelectionId,
            relatedTreatment: payload.relatedTreatmentId,
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
