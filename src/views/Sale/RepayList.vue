<template>
	<div class="card">
		<div class="card-body">
			<table class="table table-hover table-striped table-borderless">
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
					<template v-if="repayList.length > 0">
						<tr v-for="(list, i) in repayList" :key="i">
							<td>{{ i + 1 }}</td>
							<td>{{ cusFormatDate(list.repayId.date) }}</td>
							<td>
								{{
									list.repayId.relatedTreatmentVoucher?.relatedPatient?.name ??
									"not set"
								}}
							</td>
							<td>
								{{ list.repayId.relatedTreatmentVoucher?.code || "not set" }}
							</td>
							<td>{{ list.repayId.balance }}</td>
							<td>{{ list.repayId?.relatedBank?.name || "-" }}</td>
							<td>{{ list.repayId?.relatedCash?.name || "-" }}</td>
							<td>{{ list.repayId?.remark || "Not Set" }}</td>
						</tr>
					</template>
					<tr v-else>
						<td>No Repay List</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>
<script setup>
import { onMounted, ref } from "vue"
import { cusFormatDate } from "../../helpers"
import { useAppStore } from "../../stores/app"
import { useTreatmentVoucherStore } from "../../stores/treatmentVoucher"

const repayList = ref([])
const voucherStore = useTreatmentVoucherStore()
const appStore = useAppStore()

onMounted(async () => {
	console.log(voucherStore.repayList)
	repayList.value = voucherStore.repayList
})
</script>
