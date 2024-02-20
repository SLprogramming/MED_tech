<template>
	<template v-if="loading">
		<Loading />
	</template>
	<template v-else>
		<div>
			<Heading :payload="{ title: 'Stock Request' }" />
		</div>

		<div class="card p-3">
			<form @submit.prevent="submit">
				<div class="row">
					<div class="col-6">
						<Input
							type="date"
							v-model="data.requestDate"
							label="Request Date" />
					</div>
					<div class="col-6">
						<Input v-model="data.branch" disabled label="Branch Name" />
					</div>
				</div>
				<div class="row">
					<div class="col-6">
						<Input v-model="data.requestNo" disabled label="Request Number" />
					</div>
					<div class="col-6">
						<Input v-model="data.requestBy" disabled label="Requeted By" />
					</div>
				</div>

				<div class="row">
					<div class="col-6">
						<div class="mb-3">
							<label class="form-label">Medicine Items</label>
							<div class="d-flex gap-3">
								<VueMultiselect
									:model-value="selectedMedicineItem"
									@update:model-value="updateSelectedMedicineItem"
									:options="medicineItems"
									:searchable="true"
									:close-on-select="true"
									:allow-empty="false"
									:option-height="31"
									label="medicineItemName"
									placeholder="Select Items"
									track-by="medicineItemName" />
								<button
									@click="addSelectedMedicineItems"
									type="button"
									class="btn btn-primary">
									<i class="bi bi-plus-lg"></i>
								</button>
							</div>
						</div>
						<div class="row" v-if="selectedMedicineItems.length > 0">
							<h5 class="mb-3">Selected Medicine Items</h5>
							<div class="col-12">
								<div
									class="row mb-3"
									v-for="(item, index) in selectedMedicineItems">
									<div class="col">
										<input
											type="text"
											class="form-control"
											:value="item.medicineItemName"
											disabled />
									</div>
									<div class="col">
										<input
											type="number"
											class="form-control"
											v-model="item.cusRequestQty" />
									</div>
									<div class="col">
										<button
											type="button"
											@click="removeSelectedMedicineItems(index)"
											class="btn btn-danger">
											<i class="bi bi-dash"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-6">
						<div class="mb-3">
							<label class="form-label">Procedure Items</label>
							<div class="d-flex gap-3">
								<VueMultiselect
									:model-value="selectedProcedureItem"
									@update:model-value="updateSelectedProcedureItem"
									:options="procedureItems"
									:searchable="true"
									:close-on-select="true"
									:allow-empty="false"
									:option-height="31"
									label="procedureItemName"
									placeholder="Select Items"
									track-by="procedureItemName" />
								<button
									@click="addSelectedProcedureItems"
									type="button"
									class="btn btn-primary">
									<i class="bi bi-plus-lg"></i>
								</button>
							</div>
						</div>
						<div class="row" v-if="selectedProcedureItems.length > 0">
							<h5 class="mb-3">Selected Procedure Items</h5>
							<div class="col-12">
								<div
									class="row mb-3"
									v-for="(item, index) in selectedProcedureItems">
									<div class="col">
										<input
											type="text"
											class="form-control"
											:value="item.procedureItemName"
											disabled />
									</div>
									<div class="col">
										<input
											type="number"
											class="form-control"
											v-model="item.cusRequestQty" />
									</div>
									<div class="col">
										<button
											type="button"
											@click="removeSelectedProcedureItems(index)"
											class="btn btn-danger">
											<i class="bi bi-dash"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col-6">
						<div class="mb-3">
							<label class="form-label">Accessory Items</label>
							<div class="d-flex gap-3">
								<VueMultiselect
									:model-value="selectedAccessoryItem"
									@update:model-value="updateSelectedAccessoryItem"
									:options="accessoryItems"
									:searchable="true"
									:close-on-select="true"
									:allow-empty="false"
									:option-height="31"
									label="accessoryItemName"
									placeholder="Select Items"
									track-by="accessoryItemName" />
								<button
									@click="addSelectedAccessoryItems"
									type="button"
									class="btn btn-primary">
									<i class="bi bi-plus-lg"></i>
								</button>
							</div>
						</div>
						<div class="row" v-if="selectedAccessoryItems.length > 0">
							<h5 class="mb-3">Selected Accessory Items</h5>
							<div class="col-12">
								<div
									class="row mb-3"
									v-for="(item, index) in selectedAccessoryItems">
									<div class="col">
										<input
											type="text"
											class="form-control"
											:value="item.accessoryItemName"
											disabled />
									</div>
									<div class="col">
										<input
											type="number"
											class="form-control"
											v-model="item.cusRequestQty" />
									</div>
									<div class="col">
										<button
											type="button"
											@click="removeSelectedAccessoryItems(index)"
											class="btn btn-danger">
											<i class="bi bi-dash"></i>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="d-flex justify-content-end">
					<SubmitButton name="Request" :loading="submitting" />
				</div>
			</form>
		</div>
	</template>
</template>

<script setup>
import { ref, onMounted } from "vue"
import VueMultiselect from "vue-multiselect"
import Loading from "../../components/Common/Loading.vue"
import SubmitButton from "../../components/Common/SubmitButton.vue"
import Input from "../../components/Common/form/Input.vue"
import { useMedicineItemStore } from "../../stores/medicineItems"
import { useProcedureItemStore } from "../../stores/procedureItem"
import { useAccessoryItemStore } from "../../stores/accessoryItem"
import { useStockRequestStore } from "../../stores/stockRequest"
import { dateForParams } from "../../helpers"
import { useAppStore } from "../../stores/app"
import { useStockStore } from "../../stores/stock"

const data = ref({
	branch: "",
})

const loading = ref(true)
const submitting = ref(false)

const medicineItemStore = useMedicineItemStore()
const procedureItemStore = useProcedureItemStore()
const accessoryItemStore = useAccessoryItemStore()
const appStore = useAppStore()
const stockStore = useStockStore()

const stockRequestStore = useStockRequestStore()

const codeData = ref({})

// medicine items multiselect

const medicineItems = ref([])
const selectedMedicineItem = ref({})
const selectedMedicineItems = ref([])

const updateSelectedMedicineItem = e => {
	selectedMedicineItem.value = { ...e }
}

const addSelectedMedicineItems = () => {
	let alreadyExist = selectedMedicineItems.value.findIndex(
		each => each._id === selectedMedicineItem.value._id
	)

	if (
		alreadyExist === -1 &&
		Object.keys(selectedMedicineItem.value).length > 0
	) {
		selectedMedicineItems.value.push(selectedMedicineItem.value)
	}
}

const removeSelectedMedicineItems = index => {
	selectedMedicineItems.value = selectedMedicineItems.value.filter(
		(item, itemIndex) => itemIndex !== index
	)
}

// end medicine item multiselect

// procedure items multiselect

const procedureItems = ref([])
const selectedProcedureItem = ref({})
const selectedProcedureItems = ref([])

const updateSelectedProcedureItem = e => {
	selectedProcedureItem.value = { ...e }
}

const addSelectedProcedureItems = () => {
	let alreadyExist = selectedProcedureItems.value.findIndex(
		each => each._id === selectedProcedureItem.value._id
	)

	if (
		alreadyExist === -1 &&
		Object.keys(selectedProcedureItem.value).length > 0
	) {
		selectedProcedureItems.value.push(selectedProcedureItem.value)
	}
}

const removeSelectedProcedureItems = index => {
	selectedProcedureItems.value = selectedProcedureItems.value.filter(
		(item, itemIndex) => itemIndex !== index
	)
}

// end procedure item multiselect

// accessory items multiselect

const accessoryItems = ref([
	{
		item: "one",
		remark: "",
	},
	{
		item: "two",
		remark: "",
	},
])
const selectedAccessoryItem = ref({})
const selectedAccessoryItems = ref([])

const updateSelectedAccessoryItem = e => {
	selectedAccessoryItem.value = { ...e }
}

const addSelectedAccessoryItems = () => {
	let alreadyExist = selectedAccessoryItems.value.findIndex(
		each => each._id === selectedAccessoryItem.value._id
	)

	if (
		alreadyExist === -1 &&
		Object.keys(selectedAccessoryItem.value).length > 0
	) {
		selectedAccessoryItems.value.push(selectedAccessoryItem.value)
	}
}

const removeSelectedAccessoryItems = index => {
	selectedAccessoryItems.value = selectedAccessoryItems.value.filter(
		(item, itemIndex) => itemIndex !== index
	)
}

// end accesory item multiselect

const prepareForm = () => {
	let procedureMedicine = selectedProcedureItems.value.map(each => {
		return {
      item_id: each._id,
      purchasePrice: each.purchasePrice,
			stockQty: each.currentQuantity,
			requestedQty: each.cusRequestQty,
		}
	})

	let medicineLists = selectedMedicineItems.value.map(each => {
		return {
      item_id: each._id,
      purchasePrice: each.purchasePrice,
			stockQty: each.currentQuantity,
			requestedQty: each.cusRequestQty,
		}
	})

	let procedureAccessory = selectedAccessoryItems.value.map(each => {
		return {
      item_id: each._id,
      purchasePrice: each.purchasePrice,
			stockQty: each.currentQuantity,
			requestedQty: each.cusRequestQty,
		}
	})

	let form = {
		procedureMedicine,
		medicineLists,
		procedureAccessory,
		relatedBranch: appStore.user.data.user.branch,
		date: data.value.requestDate
			? dateForParams(data.value.requestDate)
			: new Date().getTime(),
		requestNo: codeData.value.patientID,
		requestedBy: appStore.user.data.user.name,
		seq: codeData.value.seq,
	}

	return form
}

const updateCode = async () => {
	try {
		let codeRes = await stockRequestStore.fetchCode()
    codeData.value = codeRes.data
    console.log(codeRes)
	} catch (error) {
    console.log(error)
    throw error
	}
}

const submit = async () => {
	submitting.value = true
  let form = prepareForm()
	try {
		let res = await stockRequestStore.sendStockRequet(form)
		console.log(res)
    appStore.showSuccess()
    await updateCode()
		data.value.requestNo = codeData.value.patientID
	} catch (error) {
		console.log(error)
		appStore.showError()
	} finally {
		submitting.value = false
	}
}

onMounted(async () => {
	try {
		await updateCode()

		// let medicineItemsRes = await medicineItemStore.fetchMedicineItems()
		// medicineItems.value = medicineItemsRes.list

    medicineItems.value = await stockStore.fetchMedicineItems()

		// let procedureItemsRes = await procedureItemStore.fetchProcedureItems()
		// procedureItems.value = procedureItemsRes.list
    procedureItems.value = await stockStore.fetchProcedureItems()

		// let accessoryItemsRes = await accessoryItemStore.fetchAccessoryItems()
		// accessoryItems.value = accessoryItemsRes.list
    accessoryItems.value = await stockStore.fetchAccessoryItems()

		data.value.requestNo = codeData.value.patientID
		data.value.requestBy = appStore.user.data.user.name
		data.value.branch = appStore.user.data.user.branchName
	} catch (error) {
		console.log(error)
	} finally {
		loading.value = false
	}
})
</script>

<style lang="scss" scoped></style>
