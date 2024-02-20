import { defineStore } from "pinia"
import { getAxiosClient } from "../data/axios"
import { useAppStore } from "./app"

export const useTherapistStore = defineStore("therapist", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchTherapists() {
			return getAxiosClient()
				.get(`therapists`)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		fetchNurses() {
			return getAxiosClient()
				.get(`nurses`)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
