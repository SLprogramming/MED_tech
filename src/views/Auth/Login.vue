<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-8 col-md-9">
				<div class="d-flex justify-content-center align-items-center">
					<img
						src="@/assets/img/doctors.svg"
						style="width: 700px; margin-top: 100px"
						alt="" />
				</div>
			</div>
			<div class="col-4 col-md-3">
				<div class="bg-white shadow-sm vh-100">
					<div class="d-flex vh-100 flex-column justify-content-center">
						<!-- <img src="" alt=""> -->
						<img src="@/assets/img/logo.png" alt="" />
						<div class="px-3 text-center">
							<p>
								Blk A, No. 001, Corner of Hantharwadi Road and Hnin Si Street,
								Yuzana Highway Complex,, Yangon, Myanmar, 11041
							</p>
							<p>Phone : 09 968 119 995</p>
						</div>
						<div class="mx-auto">
							<div class="my-3">
								<div class="mb-3">
									<div class="input-group flex-nowrap">
										<span class="input-group-text">
											<i class="bi bi-envelope"></i>
										</span>
										<input
											v-model="user.email"
											type="email"
											required
											placeholder="Enter Email"
											class="form-control border-0"
											name="email" />
									</div>
								</div>
								<div class="mb-3">
									<div class="input-group flex-nowrap">
										<span class="input-group-text">
											<i class="bi bi-key"></i>
										</span>
										<input
											@keyup.enter="login"
											v-model="user.password"
											required
											placeholder="Enter Password"
											type="password"
											class="form-control border-0"
											name="password" />
									</div>
								</div>
								<div class="mb-3">
									<!-- <button @click="login" class="btn btn-primary w-100">Login</button> -->
									<SubmitButton
										@click="login"
										name="Login"
										class="w-100"
										:loading="submitting" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import SubmitButton from "../../components/Common/SubmitButton.vue"
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useAppStore } from "../../stores/app"
import { openDialog } from "../../helpers"

const user = ref({
	email: "",
	password: "",
})

const appStore = useAppStore()
const router = useRouter()
const submitting = ref(false)

const login = async () => {
	submitting.value = true
	try {
		let res = await appStore.login({
			email: user.value.email,
			password: user.value.password,
		})
		appStore.setUserData(res)
		appStore.setUserToken(res.token)
		appStore.fetchAccountData = true
		router.push({ name: "master.treatment-list" })
		appStore.showSuccess()
		if (
			appStore.user.data.user.role == "master" ||
			appStore.user.data.user.role == "supervisor" ||
			appStore.user.data.user.role == "cashier"
		) {
			openDialog("openingAccountDialog")
		}
	} catch (err) {
		console.log(err)
		appStore.showError()
	} finally {
		submitting.value = false
	}
}
</script>

<style scoped>
i {
	color: #9fa3a8;
}

.input-group {
	border: 1px solid #d1d5db;
	padding: 3px 5px;
	border-radius: 7px;
}

.input-group-text {
	background: transparent;
	border: none;
}
</style>
