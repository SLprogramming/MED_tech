import { defineStore } from "pinia"
import { getAxiosClient } from "@/data/axios"
import Swal from "sweetalert2"

export const useAppStore = defineStore("app", {
	state: () => ({
		user: {
			data: sessionStorage.getItem("DATA")
				? JSON.parse(sessionStorage.getItem("DATA"))
				: null,
			token: sessionStorage.getItem("TOKEN") ?? null,
		},
		fetchAccountData: false,
		openingAmount: 0,
		closingAmount: 0,
		currentAppointment: {},
		accountingList: {
			//commit
			bank: [
				{
					code: "12049",
					name: "AYA Special",
				},
				{
					code: "12048",
					name: "AYA Saving",
				},
				{
					code: "12047",
					name: "KBZ Call",
				},
				{
					code: "12046",
					name: "KBZ Special ",
				},
				{
					code: "12045",
					name: "KBZ Current",
				},
				{
					code: "12044",
					name: "KBZ Pay",
				},
				{
					code: "12043",
					name: "CB Saving",
				},
				{
					code: "12042",
					name: "UAB Saving",
				},
				{
					code: "12041",
					name: "UAB Special",
				},
				{
					code: "12040",
					name: "UAB Pay",
				},
			],
		},
		account: {
			_id: "65bc6444c29c96a32e1965e3",
		},
		defaultDoctor: {
			_id: "640800536989d73f78070adc",
		},
		sidebar: true,
		contacts: {
			one: {
				address: `အမှတ် - ၁၀၉ ၊ ငွေကြာရံ (၇) လမ်းနှင့် ဝေဇယန္တာလမ်းထောင့်၊ (၃)
					ရပ်ကွက်၊ တောင်ဥက္ကလာပမြို့နယ်၊ ရန်ကုန်မြို့။ (Waizayandar AYA
					Bank အနီး)`,
				phones: ["09 78440 7840"],
			},
		},
		contact: null,
	}),
	actions: {
		toggleSidebar() {
			this.sidebar = !this.sidebar
		},
		login(payload) {
			return getAxiosClient()
				.post("auth/login", payload)
				.then(res => {
					console.log(res.data)
					return res.data
				})
				.catch(error => {
					throw error
				})
		},
		logout() {
			return getAxiosClient()
				.get("auth/logout")
				.then(res => {
					this.user.token = null
					this.user.data = null
					sessionStorage.clear()
					return res.data
				})
				.catch(error => {
					throw error
				})
				.finally(() => {
					this.logoutAfterClosingAccount = false
				})
		},
		getUsername() {
			return this.user.data.user?.name
		},
		getUserRole() {
			return this.user.data.user?.role
		},
		setUserToken(token) {
			this.user.token = token
			sessionStorage.setItem("TOKEN", token)
		},
		setUserData(data) {
			this.user.data = data
			sessionStorage.setItem("DATA", JSON.stringify(data))
		},
		showSuccess() {
			Swal.fire({
				toast: true,
				position: "top-end",
				icon: "success",
				timerProgressBar: true,
				showConfirmButton: false,
				timer: 3000,
				title: "Success",
			})
		},
		showError(payload) {
			let message = "Please Try Again!"
			if (payload) {
				message = payload.message
			}
			Swal.fire(message, "", "error")
		},
		getContact() {
			let branch = "one"
			// branch = branch === '8MILE' ? 'EightMile' : branch
			return this.contacts[branch]
		},
	},
})
