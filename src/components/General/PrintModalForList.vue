<template>
	<div
		class="modal fade"
		id="printModalForList"
		tabindex="-1"
		aria-labelledby="exampleModalLabel"
		aria-hidden="true">
		<div class="modal-dialog" style="max-width: 1300px">
			<div class="modal-content" style="width: 1300px">
				<div class="modal-header">
					<h1 class="modal-title fs-5">Voucher</h1>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"></button>
				</div>
				<div :id="'repayListPrintCard'" class="modal-body">
					<div class="col-md-12">
						<h3>Repay List</h3>
						<table class="table table-bordered table-striped">
							<thead>
								<tr>
									<th>#</th>
									<th>Date</th>
									<th>Patient Name</th>
									<th>Voucher No</th>
									<th>Repay Amount</th>
									<th>Bank Account</th>
									<th>Cash Account</th>
									<th>Remark</th>
								</tr>
							</thead>
							<tbody>
								<template v-if="props.list.length > 0">
									<tr v-for="(list, i) in props.list" :key="i">
										<td>{{ i + 1 }}</td>
										<td>{{ cusFormatDate(list.date) }}</td>
										<td>{{ list.relatedPatient.name }}</td>
										<td>{{ list.relatedTreatmentVoucher.code }}</td>
										<td>{{ list.balance }}</td>
										<td>{{ list?.relatedBank?.subHeader || "-" }}</td>
										<td>{{ list?.relatedCash?.subHeader || "-" }}</td>
										<td>{{ list.remark || "-" }}</td>
									</tr>
								</template>
								<tr v-else>
									<td>No List Exist!</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-secondary"
						data-bs-dismiss="modal">
						Close
					</button>
					<button type="button" class="btn btn-primary" @click="openPrint">
						Print
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { cusFormatDate, getToday } from "../../helpers"
import { useAppStore } from "../../stores/app"

const contact = ref({})

const appStore = useAppStore()

const props = defineProps({
	resourceFromTreatmentSelect: {
		default: {},
	},
	type: {
		default: "normal",
	},
	id: {
		default: "",
	},
	list: {
		default: [],
	},
})

const openPrint = () => {
	let printContent = document.querySelector(
		"#repayListPrintCard" + props.id
	).innerHTML
	let mywindow = window.open("", "PRINT", "height=1000,width=1200")
	mywindow.document.write("<html><head><title>" + document.title + "</title>")
	mywindow.document.write("</head><body >")
	mywindow.document.write(
		`<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">`
	)

	mywindow.document.write(printContent)
	mywindow.document.write("</body></html>")

	mywindow.document.close() // necessary for IE >= 10
	mywindow.focus() // necessary for IE >= 10*/

	mywindow.print()
}

onMounted(() => {
	console.log(props.list)
})
</script>

<style lang="scss" scoped></style>
