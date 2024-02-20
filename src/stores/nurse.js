import { defineStore } from "pinia"
import { getAxiosClient } from "../data/axios"
import { useAppStore } from "./app"

export const useNurseStore = defineStore("nurse", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
    fetchNurses() {
      const appStore = useAppStore()
			return getAxiosClient()
				.get(`nurses`, { params: { relatedBranch: appStore.user.data.user.branch } })
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
