<template>
	<div
		class="d-flex align-items-center justify-content-between rounded shadow-sm bg-white p-2 my-3">
		<div class="d-flex align-items-center gap-3">
			<button @click="goback" class="btn btn-outline-primary">
				<i class="bi bi-chevron-left"></i>
			</button>
			<div class="text-capitalize fw-semibold">Dr Rejuve</div>
		</div>
		<div class="dropdown">
			<button
				class="btn dropdown-toggle"
				type="button"
				data-bs-toggle="dropdown"
				aria-expanded="false">
				<img
					src="@/assets/img/icon-doctor.png"
					class="shadow-sm me-3"
					style="
						width: 30px;
						height: 30px;
						border-radius: 50%;
						object-fit: cover;
					"
					alt="" />
				{{ appStore.getUsername() }}
			</button>
			<ul class="dropdown-menu">
				<li>
					<a class="dropdown-item text-danger" @click="onLogout">Logout</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router"
import { useAppStore } from "../../stores/app"
import { computed } from "vue"
import { openDialog } from "../../helpers"
import { useAccountBalanceStore } from "../../stores/accountBalance"

const appStore = useAppStore()
const accountBalanceStore = useAccountBalanceStore()
const router = useRouter()
const route = useRoute()

const branchNames = {
	SOK: "south okkalapa branch",
	"8MILE": "8 mile branch",
}

const currentBranch = computed(() => {
	return branchNames[appStore.user.data?.user?.branchName ?? "two"]
})

const onLogout = async () => {
	try {
		let res = await accountBalanceStore.fetchClosingAcountBalance()
		console.log(res)
		appStore.openingAmount = 0
		openDialog("closingAccountDialog")
	} catch (err) {
		console.log(err)
		if (err.response.data?.message == "Not Found!") {
			openDialog("closingAccountDialog")
		}
	}
}

const logout = async () => {
	try {
		await appStore.logout()
		appStore.showSuccess()
		router.push({ name: "login" })
	} catch (err) {
		appStore.showError()
		console.log(err)
	}
}

const goback = () => {
	// console.log(router)
	// console.log(route)
	// router.push({name: route.meta.prevRouteName ?? 'home'})
	router.back()
}
</script>

<style lang="scss" scoped></style>
