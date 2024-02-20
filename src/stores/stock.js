import { defineStore } from "pinia"
import { getAxiosClient } from "../data/axios"
import { useAppStore } from "./app"

export const useStockStore = defineStore("stock", {
	state: () => ({
		// user: JSON.parse(sessionStorage.getItem("DATA")),
	}),
	actions: {
		fetchMedicineItems() {
      const appStore = useAppStore()
			return getAxiosClient()
				.get(`stocks`, {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
          let medicineItems = []
					console.log(res)
					res.data.data.map(each => {
            if (each.relatedMedicineItems) {
              each.relatedMedicineItems.totalUnit = each.totalUnit
							medicineItems.push(each.relatedMedicineItems)
						}
					})
					return medicineItems
				})
				.catch(error => {
					throw error
				})
		},
		fetchProcedureItems() {
      const appStore = useAppStore()
			return getAxiosClient()
				.get(`stocks`, {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					let procedureItems = []
					console.log(res)
					res.data.data.map(each => {
            if (each.relatedProcedureItems) {
              each.relatedProcedureItems.totalUnit = each.totalUnit
							procedureItems.push(each.relatedProcedureItems)
						}
					})
					return procedureItems
				})
				.catch(error => {
					throw error
				})
		},
		fetchAccessoryItems() {
      const appStore = useAppStore()
			return getAxiosClient()
				.get(`stocks`, {
					params: { relatedBranch: appStore.user.data.user.branch },
				})
				.then(res => {
					let accessoryItems = []
					console.log(res)
					res.data.data.map(each => {
						if (each.relatedAccessoryItems) {
              each.relatedAccessoryItems.totalUnit = each.totalUnit
							accessoryItems.push(each.relatedAccessoryItems)
						}
					})
					return accessoryItems
				})
				.catch(error => {
					throw error
				})
		},
	},
})
