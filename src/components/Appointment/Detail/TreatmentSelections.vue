<template>
  <div class="table-responsive">
    <h4>Treatment Selections</h4>
    <table class="table">
      <thead>
        <tr>
          <th scope="col" class="text-nowrap">#</th>
          <th scope="col" class="text-nowrap">Treatment Unit Code</th>
          <th scope="col" class="text-nowrap">Status</th>
          <!-- <th scope="col">Doctor Name</th> -->
          <th scope="col" class="text-nowrap">Times</th>
          <th scope="col" class="text-nowrap">Total Amount</th>
          <th scope="col" class="text-nowrap">Left-Over Amount</th>
          <th scope="col" class="text-nowrap">Action</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(selection, index) in relatedTreatmentSelection">
          <tr>
            <td>{{ index + 1 }}</td>
            <td>{{ selection?._id }}</td>
            <td>{{ selection?.selectionStatus }}</td>
            <td>{{ selection?.treatmentTimes }}</td>
            <td>{{ selection?.totalAmount }}</td>
            <td>{{ selection?.leftOverAmount }}</td>
            <td>
              <router-link
                :to="{ name: 'payment.treatment-selection-payment', params: { patientId: appointment.relatedPatient._id } }"
                custom v-slot="{ navigate }">
                <button class="btn btn-primary" @click="navigate" @keypress.enter="navigate" role="link">Payment</button>
              </router-link>
            </td>
          </tr>
          <tr>
            <td colspan="7">
              <div class="table-responsive">
                <h5>Related Appointments</h5>
                <table class="table mb-0" style="background-color: rgb(202, 202, 219);">
                  <thead>
                    <tr>
                      <th scope="col" class="text-nowrap">#</th>
                      <th scope="col" class="text-nowrap">Phone</th>
                      <th scope="col" class="text-nowrap">Date</th>
                      <th scope="col">Doctor Name</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(relatedAppointment, index) in selection?.relatedAppointments">
                      <tr>
                        <td>{{ index + 1 }}</td>
                        <td class="text-nowrap">{{ relatedAppointment.phone }}</td>
                        <td class="text-nowrap">{{ cusFormatDate(relatedAppointment.originalDate) }}</td>
                        <td>{{ relatedAppointment?.relatedDoctor?.name }}</td>
                        <td>
                          <button class="btn btn-primary">Add Procedure</button>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
              <!-- <div class="my-3">
                <router-link :to="{ name: 'sale.medicine', query: { patientId: appointment.relatedPatient._id } }" custom
                  v-slot="{ navigate }">
                  <button class="btn btn-outline-primary" @click="navigate" @keypress.enter="navigate"
                    role="link">Medicine Sale</button>
                </router-link>
              </div> -->
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import { cusFormatDate } from "@/helpers/index"
export default {
  props: ['selection'],
  methods: {
    cusFormatDate,
  }
}
</script>

<style lang="scss" scoped></style>