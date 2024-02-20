<template>
  <template v-if="isLoading">
    <div>Loading ...</div>
  </template>
  <template v-else>
    <div class="row">
      <div class="col-12">
        <Heading :payload="{ title: 'Appointment Detail' }" style="font-size: 30px" class="mb-4" />
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="card p-3 shadow-sm">
          <PatientDetail :id="appointment.relatedPatient._id" :prevData="appointment.relatedPatient" />
          <!-- <div class="row gap-3 mb-3">
            <div class="col">
              <table>
                <tr>
                  <td>Patient Name</td>
                  <td class="px-3">-</td>
                  <td>{{ appointment.relatedPatient.name }}</td>
                </tr>
                <tr>
                  <td>Patient ID</td>
                  <td class="px-3">-</td>
                  <td>{{ appointment.relatedPatient._id }}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td class="px-3">-</td>
                  <td>{{ appointment.status }}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td class="px-3">-</td>
                  <td>{{ appointment.relatedPatient.email }}</td>
                </tr>
                <tr class="">
                  <td colspan="3">
                    <hr>
                  </td>
                </tr>
                <tr>
                  <td>Member status</td>
                  <td class="px-3">-</td>
                  <td>{{ appointment.relatedPatient.patientStatus }}</td>
                </tr>
                <tr>
                  <td>Occupation</td>
                  <td class="px-3">-</td>
                  <td>{{ appointment.relatedPatient.occupation }}</td>
                </tr>
                <tr>
                  <td>Gender</td>
                  <td class="px-3">-</td>
                  <td>{{ appointment.relatedPatient.gender }}</td>
                </tr>
                <tr>
                  <td>DOB</td>
                  <td class="px-3">-</td>
                  <td>{{ appointment.relatedPatient.dateOfBirth }}</td>
                </tr>
              </table>
            </div>
            <div class="col">
              <div class="d-flex justify-content-end">
                <img :src="getImage(appointment.relatedPatient.img)" class="patient-img bg-white" alt="">
              </div>
            </div>
          </div> -->
          <div class="row mt-3">
            <div>
              <router-link :to="{
                name: 'medicine-history.create',
                query: { patientId: appointment.relatedPatient._id },
              }" custom v-slot="{ navigate }">
                <button class="btn btn-primary" @click="navigate" @keypress.enter="navigate" role="link">
                  Add Medicine History
                </button>
              </router-link>
            </div>
          </div>
          <hr class="my-3" />
          <div class="d-flex justify-content-end">
            <!-- <div class="me-3">
              <input class="form-control d-inline-block" v-model="filter.search" @keyup="searchAppointmentsThrottle"
                type="text" placeholder="Search" />
            </div> -->
            <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#treatmentSelectModal">
              Treatment Sale
            </button>
          </div>
          <hr class="my-3" />
          <TreatmentSelections @updateSelectedSelection="updateSelectedSelection" @updateRelatedAppointment="updateRelatedAppointment" :selections="treatmentSelections"
            :patientId="appointment.relatedPatient._id" />
        </div>
      </div>
      <TreatmentSelect :treatments="treatments" :treatmentLists="treatmentLists" :cashAccounts="cashAccounts"
        :appointment="appointment" :bankAccounts="bankAccounts" :patient="appointment.relatedPatient"
        @openTreatmentSelectModal="openTreatmentSelectPrintModal"
        @updateTreatmentSelections="updateTreatmentSelections" />
      <TreatmentReturn @replaceTreatmentSelections="replaceTreatmentSelections" @updateTreatmentSelections="updateTreatmentSelections" :selection="selectedSelection"
        :treatmentLists="treatmentLists" :treatments="treatments" :cashAccounts="cashAccounts"
        :bankAccounts="bankAccounts" :patient="appointment.relatedPatient" />
      <PrintModal id="Appointment" :resourceFromTreatmentSelect="treatmentSelectResource" :type="printModalType" />
    </div>
  </template>
</template>

<script>
import _ from "lodash"
import { getImage, dateForParams } from "@/helpers/index"
import TreatmentSelections from "@/components/General/TreatmentSelections.vue"
import TreatmentSelect from "@/components/General/TreatmentSelect.vue"
import PatientDetail from "../../components/General/PatientDetail.vue"
import bootstrapMin from "bootstrap/dist/js/bootstrap.min"
import PrintModal from "../../components/General/PrintModal.vue"
import { useAppointmentStore } from "../../stores/appointment.js"
import { useTreatmentListStore } from "../../stores/treatmentList"
import { useTreatmentStore } from "../../stores/treatment"
import { useAccountingListStore } from "../../stores/accountingList"
import TreatmentReturn from "../../components/General/TreatmentReturn.vue"
import { useAppStore } from "../../stores/app"
export default {
  setup() {
    const appointmentStore = useAppointmentStore()
    const appStore = useAppStore()
    const treatmentListStore = useTreatmentListStore()
    const treatmentStore = useTreatmentStore()
    const accountingListStore = useAccountingListStore()
    return {
      appointmentStore,
      appStore,
      treatmentListStore,
      treatmentStore,
      accountingListStore
    }
  },
  components: {
    TreatmentSelections,
    TreatmentSelect,
    PatientDetail,
    PrintModal,
    TreatmentReturn
},
  props: ["id"],
  data() {
    return {
      isLoading: true,
      isCreate: false,
      appointment: {},
      filter: {
        search: "",
      },
      selectedSelection: {},
      bankAccounts: [],
      cashAccounts: [],
      treatments: [],
      treatmentLists: [],
      treatmentSelections: [],
      treatmentSelectResource: {},
      printModalType: 'normal'
    }
  },
  methods: {
    dateForParams,
    getImage,

    updateTreatmentSelections(treatmentSelection) {
      this.treatmentSelections.push(treatmentSelection)
    },

    updateSelectedSelection(selectionIndex) {
      this.selectedSelection = this.treatmentSelections[selectionIndex];
    },

    replaceTreatmentSelections(data) {
      this.treatmentSelections.map((each, index) => {
        if (each._id === data._id) this.treatmentSelections[index] = data
      })
    },


    updateRelatedAppointment(data, treatmentSelectionId) {
      this.treatmentSelections.map((each, treatmentIndex) => {
        if (each._id === treatmentSelectionId) {
          each.relatedAppointments.map((each, appointmentIndex) => {
            if (each._id === data._id) {
              this.treatmentSelections[treatmentIndex]["relatedAppointments"][appointmentIndex]['status'] = true
            }
          })
        }
      })
    },

    openTreatmentSelectPrintModal(payload, type) {
      let modal = new bootstrapMin.Modal(
        document.querySelector("#treatmentSelectPrintModalAppointment")
      )
      this.printModalType = type
      this.treatmentSelectResource = payload
      modal.show()
    },
  },
  async mounted() {
    try {
      let resAppointment = await this.appointmentStore.fetchAppointment({ id: this.id })
      this.appointment = resAppointment.data[0]

      let resTreatmentSelections =
        await this.appointmentStore.fetchRelatedTreatmentSelections({
          relatedAppointments: this.id,
        })
      this.treatmentSelections = resTreatmentSelections.data

      let resTreatmentLists = await this.treatmentListStore.fetchTreatmentLists()
      this.treatmentLists = resTreatmentLists.list

      let resTreatments = await this.treatmentStore.fetchTreatments()
      this.treatments = resTreatments.list

      let res = await this.accountingListStore.fetchAccountingLists()

      this.bankAccounts = res.list.filter(el => {
        if (el.relatedType && el.relatedType.name === "Assets") {
          if (el.relatedHeader && el.relatedHeader.name === "Cash at Bank") {
            return el
          }
        }
      })

      this.cashAccounts = res.list.filter(el => {
        // if (el.relatedType && el.relatedType.name === "Assets") {
        //   if (el.relatedHeader && el.relatedHeader.name === "Cash In Hand") {
        //     return el
        //   }
        // }
        if (el._id === this.appStore.account._id) return el
      })
    } catch (err) {
      console.log(err)
    } finally {
      this.isLoading = false
    }
  },
}
</script>

<style lang="scss" scoped>
td {
  white-space: nowrap !important;
  text-transform: capitalize;
  font-size: 16px;
}

.patient-img {
  height: 200px;
  width: 150px;
}
</style>
