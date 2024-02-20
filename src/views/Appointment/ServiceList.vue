<template>
	<div class="card">
		<div class="card-body">
			<h3>Service List</h3>

			<table class="table table-responsive table-borderless table-striped">
				<thead>
					<tr>
						<th>#</th>
						<th>Patient</th>
						<th>Doctor</th>
						<th>Date</th>
						<th>Time</th>
						<th>Treatment Code</th>
						<th>Treatment Name</th>
					</tr>
				</thead>
				<tbody>
					<template v-if="serviceList.length > 0">
						<tr v-for="(item, i) in serviceList" :key="i">
							<td>{{ i + 1 }}</td>
							<td>{{ item.name }}</td>
							<td>{{ item.serviceProvider.name }}</td>
							<td>{{ cusFormatDate(item.date) }}</td>
							<td>{{ item.time }}</td>
							<td>{{ item.service?.treatmentCode || "not set" }}</td>
							<td>{{ item.service?.treatmentName?.name || "not set" }}</td>
						</tr>
					</template>
					<tr v-else>
						<td class="text-center">No List Exist!</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { cusFormatDate } from "../../helpers/index.js"
import { useAppointmentStore } from "../../stores/appointment.js"

const appointmentStore = useAppointmentStore()

const serviceList = ref([])
onMounted(async () => {
	try {
		let res = await appointmentStore.fetchServiceList()
		console.log(res)
		serviceList.value = res.data
	} catch (err) {
		console.error(err)
	} finally {
	}
})
</script>
