<template>
	<div class="d-flex px-3">
		<div>
			<label for="fromDate" class="form-label">From Date</label>
			<input
				type="date"
				name=""
				v-model="start"
				class="form-control"
				id="fromDate" />
		</div>
		<div class="ms-3">
			<label for="toDate" class="form-label">To Date</label>
			<input
				type="date"
				name=""
				v-model="end"
				class="form-control"
				id="toDate" />
		</div>
		<div class="ms-3">
			<label for="type" class="form-label">Voucher Type</label>
			<select
				name=""
				id="type"
				v-model="tsType"
				@change="checkTsType()"
				class="form-select">
				<option value="all">All</option>
				<option value="TS">Single Treatment</option>
				<option value="TSMulti">Multi Treatment</option>
			</select>
		</div>
		<div v-if="tsType !== 'all'" class="ms-3">
			<label for="type" class="form-label">List</label>
			<select
				name=""
				id="type"
				v-model="option"
				class="form-select"
				@change="orderList()">
				<option value="all">All</option>
				<option value="top">Top 10 List</option>
				<option value="bottom">Bottom 10 List</option>
			</select>
		</div>
	</div>
	<div class="d-flex px-3 justify-content-end mb-2">
		<div class="ms-3 pt-4">
			<button class="btn btn-primary" @click="filterList()">Filter</button>
		</div>
		<div class="ms-3 pt-4">
			<button class="btn btn-primary" @click="exportList()">Export</button>
		</div>
	</div>
	<div class="card p-3">
		<table class="table table-borderless table-hover table-striped">
			<thead>
				<tr>
					<th>No.</th>
					<th>Treatment</th>
					<th>Treatment Unit</th>
					<th>Qty</th>
				</tr>
			</thead>
			<tbody>
				<tr v-if="isLoading">
					<td colspan="6">
						<loading></loading>
					</td>
				</tr>
				<template v-else>
					<template v-if="list.length > 0">
						<tr v-for="(item, i) in list" :key="i">
							<td>{{ i + 1 }}</td>
							<td>{{ item.treatment }}</td>
							<td>{{ item.treatmentUnit }}</td>
							<td>{{ item.qty || 1 }}</td>
						</tr>
					</template>
					<tr v-else>
						No Item Exist
					</tr>
				</template>
			</tbody>
		</table>
	</div>
</template>
<script setup>
import { useTreatmentSelectionStore } from "@/stores/treatmentSelection.js"
import { onMounted, ref } from "vue"
import { dateForParams, exportData } from "../../helpers"
const treatmentSelectionStore = useTreatmentSelectionStore()
const isLoading = ref(false)
const list = ref([])

const start = ref()
const end = ref()
const option = ref("all")
const tsType = ref("TS")
const orderList = async () => {
	await filterList()
	if (option.value == "all") {
		return
	} else if (option.value == "bottom") {
		let arr = list.value.reverse().splice(0, 10)
		list.value = arr
		console.log(arr)
	} else if (option.value == "top") {
		let arr = list.value.splice(0, 10)
		list.value = arr
		console.log(list.value)
	}
}
const prepareFilterForm = () => {
	let data = {}
	if (start.value && end.value) {
		data.start = dateForParams(start.value)
		data.end = dateForParams(end.value)
	}
	if (tsType.value) {
		data.tsType = tsType.value
	}
	return data
}
const prepareExportForm = () => {
	let data = []
	list.value.map(e => {
		let obj = {
			Treatment: e.treatment || "-",
			"Treatment unit": e.treatmentUnit,
			Quantity: e.qty,
		}
		data.push(obj)
	})
	return data
}
const exportList = () => {
	let data = prepareExportForm()
	console.log(data)
	exportData(data, "itemList.xlsx")
}
const filterForAllTsType = async () => {
	try {
		isLoading.value = true
		tsType.value = "TS"
		let data1 = prepareFilterForm()
		let res1 = await treatmentSelectionStore.fetchTopTenList(data1)
		tsType.value = "TSMulti"
		let data2 = prepareFilterForm()
		let res2 = await treatmentSelectionStore.fetchTopTenList(data2)
		list.value = [...res1.data, ...res2.data]
		console.log("list", list.value)
	} catch (error) {
		console.log(error)
	} finally {
		isLoading.value = false

		tsType.value = "all"
	}
}
const checkTsType = () => {
	if (tsType.value == "all") {
		option.value = "all"
	}
}
const filterList = async () => {
	let data = prepareFilterForm()
	console.log(data)
	if (tsType.value == "all") {
		filterForAllTsType()
	} else {
		try {
			isLoading.value = true
			let res = await treatmentSelectionStore.fetchTopTenList(data)
			console.log("list", res.data)
			list.value = res.data
		} catch (error) {
			console.log(error)
		} finally {
			isLoading.value = false
		}
	}
}
onMounted(async () => {
	await filterList()
})
</script>
