import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import { useAppStore } from "./app"

export const useAppointmentStore = defineStore("appointment", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchAppointments() {
			const appStore = useAppStore()
			return getAxiosClient()
				.get(`appointments`, {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchServiceList() {
			return getAxiosClient()
				.get(`market-place/booking/services`)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		createAppointment(payload) {
			const appStore = useAppStore()
			payload.relatedBranch = appStore.user.data.user.branch
			return getAxiosClient()
				.post("appointment", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchAppointment(payload) {
			return getAxiosClient()
				.get("appointment/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		deleteAppointment(payload) {
			return getAxiosClient()
				.delete("appointment/" + payload.id)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		updateAppointment(payload) {
			return getAxiosClient()
				.put("appointment", payload)
				.then(res => {
					return res.data
				})
				.catch(err => {
					console.log(err)
				})
		},
		searchAppointment(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.post(
					"appointment-search?relatedBranch=" + appStore.user.data.user.branch,
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
		filterAppointment(payload) {
			const appStore = useAppStore()
			return getAxiosClient()
				.get(
					"appointments-filter?relatedBranch=" + appStore.user.data.user.branch,
					payload
				)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchRelatedTreatmentSelections(payload) {
			return getAxiosClient()
				.post("treatment-selections/filter", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
