<template>
  <div class="table-responsive">
    <h4 class="mb-3">Package Selections</h4>
    <table class="table">
      <thead>
        <tr>
          <th scope="col" class="text-nowrap">#</th>
          <th scope="col" class="text-nowrap">Package Name</th>
          <th scope="col" class="text-nowrap">Price</th>
          <th scope="col" class="text-nowrap">Leftover Amount</th>
          <th scope="col" class="text-nowrap">PaymentMethod</th>
          <!-- <th scope="col" class="text-nowrap">Action</th> -->
        </tr>
      </thead>
      <tbody>
        <template v-if="selections.length > 0" v-for="(selection, packageSelectionIndex) in selections">
          <tr style="background: powderblue">
            <td>P {{ packageSelectionIndex + 1 }}</td>
            <td>{{ selection.relatedPackage.name }}</td>
            <td>{{ selection.relatedPackage.totalPrice }}</td>
            <td>{{ selection.leftOverAmount }}</td>
            <template v-if="selection.paymentMethod">
              <td v-if="selection.paymentMethod === 'Credit'">Partial</td>
              <td v-if="selection.paymentMethod === 'Cash Down'">Paid</td>
            </template>
            <!-- <td>
              <button class="btn btn-primary">Payment</button>
              <button class="btn btn-success ms-3">Return</button>
            </td> -->
          </tr>
          <tr>
            <td colspan="6" style="padding-left: 0; padding-right: 0">
              <div class="table-responsive mb-2">
                <div class="pt-3 px-3" style="background: aliceblue">
                  <div>
                    <h6 class="fw-bold">Treatments</h6>
                    <table class="table mb-0">
                      <thead>
                        <tr>
                          <th scope="col" class="text-nowrap">#</th>
                          <th scope="col" class="text-nowrap">Name</th>
                          <th scope="col" class="text-nowrap">Times</th>
                          <th scope="col" class="text-nowrap">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <template v-for="(
                               treatment, treatmentIndex
                              ) in selection?.relatedPackage.relatedTreatments">
                          <tr>
                            <td>T {{ treatmentIndex + 1 }}</td>
                            <td>{{ treatment.name }}</td>
                            <td>{{ treatment.treatmentTimes }}</td>
                            <td>
                              <template
                                v-if="!treatment.relatedAppointments || treatment.relatedAppointments?.length <= 0">
                                <button class="btn btn-primary"
                                  @click="genereateAppointments(treatment, selection._id)">Generate Appointments</button>
                              </template>
                              <template v-else>
                                No Action
                              </template>
                            </td>
                          </tr>
                          <tr v-if="treatment.relatedAppointments?.length > 0">
                            <td colspan="8" style="padding-left: 0; padding-right: 0">
                              <div class="table-responsive mb-2">
                                <div class="accordion" id="accordionExample">
                                  <div class="accordion-item">
                                    <h2 class="accordion-header">
                                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        :data-bs-target="'#collapse' + treatment._id + `${selection._id}`" aria-expanded="false"
                                        aria-controls="collapseOne">
                                        Related Appointments
                                      </button>
                                    </h2>
                                    <div :id="'collapse' + treatment._id + `${selection._id}`" class="accordion-collapse collapse">
                                      <div class="pt-3">
                                        <table class="table mb-0">
                                          <thead>
                                            <tr>
                                              <th scope="col" class="text-nowrap">#</th>
                                              <th scope="col" class="text-nowrap">Phone</th>
                                              <th scope="col" class="text-nowrap">Date</th>
                                              <th scope="col">Doctor Name</th>
                                              <th scope="col" class="text-nowrap">Status</th>
                                              <th scope="col">Action</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <template v-for="(
                                relatedAppointment, appointmentIndex
                              ) in treatment.relatedAppointments">
                                              <tr>
                                                <td>{{ appointmentIndex + 1 }}</td>
                                                <td class="text-nowrap">
                                                  {{ relatedAppointment.phone }}
                                                </td>
                                                <td class="text-nowrap">
                                                  {{ relatedAppointment.originalDate ?
                                                    cusFormatDate(relatedAppointment.originalDate) :
                                                    'Not Set' }}
                                                </td>
                                                <td>
                                                  {{ relatedAppointment?.relatedDoctor?.name }}
                                                </td>
                                                <td class="text-nowrap">
                                                  <div class="text-white rounded text-center" :class="{
                                                    'bg-success': relatedAppointment?.status,
                                                    'bg-warning': !relatedAppointment?.status,
                                                  }">
                                                    {{
                                                      relatedAppointment?.status ? "Finished" : "Ongoing"
                                                    }}
                                                  </div>
                                                </td>
                                                <td>
                                                  <!-- <router-link :to="{
                                                      name: 'procedure-history.create',
                                                      query: {
                                                        treatmentSelectionId: selection._id,
                                                        appointmentId: relatedAppointment._id,
                                                        patientId: relatedAppointment.relatedPatient,
                                                      },
                                                    }" custom v-slot="{ navigate }">
                                                    <button class="btn btn-primary" @click="navigate"
                                                      @keypress.enter="navigate" role="link">
                                                      <i class="bi bi-plus-lg"></i> Procedure History
                                                    </button>
                                                  </router-link> -->
                                                  <button class="btn btn-primary" @click="goToProcedureHistoryCreate({
                                                      treatmentSelectionId: selection._id,
                                                      appointmentId: relatedAppointment._id,
                                                      patientId: relatedAppointment.relatedPatient,
                                                      treatmentId: treatment._id,
                                                      type: 'package'
                                                    }, relatedAppointment)">
                                                    Procedure History
                                                  </button>
                                                  <router-link :to="{
                                                    name: 'appointment.edit',
                                                    params: { id: relatedAppointment._id },
                                                    query: {
                                                      totalAmount: selection.totalAmount,
                                                      treatmentTimes: treatment.relatedAppointments.length,
                                                      treatmentSelectionId: selection._id,
                                                    }
                                                  }" class="btn btn-warning ms-3">
                                                    Edit
                                                  </router-link>
                                                  <button v-if="!relatedAppointment.status"
                                                    @click="finishAppointment(
                                                      packageSelectionIndex, treatmentIndex, appointmentIndex, relatedAppointment._id, relatedAppointment.relatedPatient)"
                                                    class="ms-3 btn btn-primary">
                                                    Finish
                                                  </button>
                                                </td>
                                              </tr>
                                            </template>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </template>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>
        <template v-if="selections.length <= 0" style="background: powderblue">
          <tr class="text-center">
            <td colspan="5">No Record Exist!</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import { cusFormatDate } from '../../helpers';
import { useAppStore } from '../../stores/app';
import { useAppointmentStore } from '../../stores/appointment';

export default {
  setup() {
    const appointmentStore = useAppointmentStore()
    const appStore = useAppStore()

    return {
      appointmentStore,
      appStore
    }
  },
  props: [
    'selections'
  ],
  methods: {
    cusFormatDate,
    goToProcedureHistoryCreate(query, appointment) {
      this.appStore.currentAppointment = appointment
      this.$router.push({
        name: 'procedure-history.create',
        query
      })
    },
    genereateAppointments(treatment, packageSelectionId) {
      this.$emit('openAppointmentGenereateModal', treatment, packageSelectionId)
    },
    async finishAppointment(packageSelectionIndex, treatmentIndex, appointmentIndex, appointmentId, patientId) {
      let updateAppointmentRes = await this.appointmentStore.updateAppointment({
        id: appointmentId,
        status: true,
        relatedPatient: patientId
      });
      console.log(updateAppointmentRes);
      this.$emit("updateRelatedAppointment", updateAppointmentRes.data, packageSelectionIndex, treatmentIndex, appointmentIndex);
    },
  }
}
</script>

<style lang="scss" scoped></style>