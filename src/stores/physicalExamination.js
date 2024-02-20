import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"

export const usePhysicalExaminationStore = defineStore("physicalExamination", {
	state: () => ({
		// sidebar: true,
	}),
	actions: {
		createPhysicalExamination(payload) {
			return getAxiosClient()
				.post("physical-examination", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		updatePhysicalExamination(payload) {
			return getAxiosClient()
				.put("physical-examination", payload)
				.then(res => {
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
	},
})
