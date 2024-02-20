<template>
  <template v-if="isLoading">
    <div>
      <Loading />
    </div>
  </template>
  <template v-else>
    <Heading :payload="{ title: 'Appointment Create' }" />

    <div class="row">
      <div class="col-3">
        <div class="card border-0 shadow-sm p-3 rounded">
          <form ref="appointment">
            <div class="mb-3">
              <label for="patientStatus" class="form-label">Patient Status</label>
              <select class="form-select" v-model="patientInfo.patientStatus" aria-label="Select Patient Status">
                <option disabled>Select Patient Status</option>
                <option value="new">New</option>
                <option value="old">Old</option>
              </select>
            </div>
            <div v-if="patientInfo.patientStatus === 'old'" class="mb-3">
              <label class="form-label">Select Patient</label>
              <VueMultiselect :model-value="selectedPatient" @update:model-value="updateSelectedPatient"
                :options="patients" :searchable="true" :close-on-select="true" :allow-empty="false" :option-height="31"
                label="name" placeholder="Select Items" track-by="_id" />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input v-model="patientInfo.name" type="text" class="form-control" id="name"
                :disabled="patientInfo.patientStatus === 'old'" />
            </div>
            <div class="mb-3">
              <label for="phone" class="form-label">Phone</label>
              <input v-model="patientInfo.phone" type="text" class="form-control" id="phone"
                :disabled="patientInfo.patientStatus === 'old'" />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input v-model="patientInfo.email" type="email" class="form-control" id="email"
                :disabled="patientInfo.patientStatus === 'old'" />
            </div>
            <div class="mb-3">
              <label for="" class="form-label">Purchase Type</label>
              <div class="border rounded p-3">
                <div class="d-flex gap-3">
                  <div class="form-check">
                    <input class="form-check-input" v-model="purchaseType" value="surgery"
                      type="radio" id="surgery" checked />
                    <label class="form-check-label" for="surgery">
                      Surgery
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" v-model="purchaseType" value="aesthetic"
                      type="radio" id="Aesthetic" />
                    <label class="form-check-label" for="Aesthetic">
                      Aesthetic
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Select Doctor</label>
              <VueMultiselect :model-value="selectedDoctor" @update:model-value="updateSelectedDoctor" :options="doctors"
                :searchable="true" :close-on-select="true" :allow-empty="false" :option-height="31" label="name"
                placeholder="Select Items" track-by="_id" />
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea id="description" v-model="description" rows="2" class="form-control"></textarea>
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Date</label>
              <input v-model="date" type="date" class="form-control" id="description" />
            </div>
            <div class="mb-3">
              <label class="form-label">Time</label>
              <input v-model="time" type="time" class="form-control" name="time" />
            </div>
            <div class="mb-3">
              <button type="button" :disabled="submitting" @click="saveAppointment" class="btn btn-primary w-100">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="col-9">
        <div class="card border-0 shadow-sm p-3 rounded">
          <FullCalendar :options="calendarOptions">
            <template v-slot:eventContent="arg">
              <div class="event">
                <b>{{ arg.event.title }}</b>
                <br />
                <i class="bi bi-clock"></i> : {{ arg.event.extendedProps.time }}
                <br />
                <b>{{ arg.event.extendedProps.phone }}</b>
              </div>
            </template>
          </FullCalendar>
        </div>
      </div>
    </div>
  </template>
</template>

<script>
import "@fullcalendar/core/vdom"
import FullCalendar from "@fullcalendar/vue3"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import bootstrap5Plugin from "@fullcalendar/bootstrap5"
import VueMultiselect from "vue-multiselect"
import router from "@/router"
import { useAppStore } from "../../stores/app"
import { useDoctorStore } from "../../stores/doctor"
import { usePatientStore } from "../../stores/patient"
import { useAppointmentStore } from "../../stores/appointment"
import { dateForParams } from "../../helpers/index"
export default {
  setup() {
    const appStore = useAppStore()
    const doctorStore = useDoctorStore()
    const patientStore = usePatientStore()
    const appointmentStore = useAppointmentStore()
    return {
      appStore,
      doctorStore,
      patientStore,
      appointmentStore,
    }
  },
  components: { FullCalendar, VueMultiselect },
  data() {
    return {
      isLoading: true,
      submitting: false,
      patients: [],
      patientInfo: {
        patientStatus: "new",
        name: "",
        phone: "",
        email: "",
      },
      selectedPatient: {},
      doctors: [],
      selectedDoctor: {},
      description: "",
      date: "",
      time: "",
      purchaseType: 'surgery',
      calendarOptions: {
        headerToolbar: {
          left: "dayGridMonth timeGridDay listDay",
          center: "title",
          right: "prev today next",
        },
        buttonText: {
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
          list: "List",
        },
        eventBorderColor: "rgba(145, 85, 253, 0.16)",
        eventTextColor: "#696cff",
        eventBackgroundColor: "rgba(145, 85, 253, 0.16)",
        eventDisplay: "block",
        nowIndicator: "true",
        dayMaxEventRows: true, // for all non-TimeGrid views
        views: {
          dayGrid: {
            dayMaxEventRows: 3, // adjust to 6 only for timeGridWeek/timeGridDay
          },
        },
        plugins: [
          dayGridPlugin,
          interactionPlugin,
          bootstrap5Plugin,
          timeGridPlugin,
          listPlugin,
        ],
        themeSystem: "bootstrap5",
        initialView: "dayGridMonth",
        height: 570,
        events: [],
        eventClick: function (el) {
          let name = el.event._def.extendedProps.relatedPatient.name
          let status = el.event._def.extendedProps.status
          let id = el.event._def.extendedProps.relatedPatient._id
          let phone = el.event._def.extendedProps.phone
          let appointment_id = el.event._def.extendedProps._id
          // if (status === "Old") {
          router.push({ name: "patient.detail", params: { id: id } })
          // }
          // else {
          //   router.push({
          //     path: "/editPatient",
          //     query: { name, phone, appointment_id },
          //   });
          // }
        },
      },
    }
  },
  methods: {
    updateSelectedPatient(e) {
      this.selectedPatient = { ...e }
      this.patientInfo.name = this.selectedPatient.name
      this.patientInfo.phone = this.selectedPatient.phone
      this.patientInfo.email = this.selectedPatient.email
    },
    updateSelectedDoctor(e) {
      this.selectedDoctor = { ...e }
    },
    resetForm() {
      ; (this.patientInfo = {
        patientStatus: "new",
        name: "",
        phone: "",
        email: "",
      }),
        (this.selectedPatient = {})
      this.selectedDoctor = {}
      this.description = ""
      this.date = ""
      this.time = ""
    },
    prepareForm() {
      let originalDate = dateForParams(this.date + "T" + this.time)
      let purchaseType = 'Surgery'

      if(this.purchaseType === 'aesthetic') purchaseType = 'Clinic'

      let data = {
        originalDate: originalDate,
        date: this.date,
        time: this.time,
        phone: this.patientInfo.phone,
        description: this.description,
        pstatus: this.patientInfo.patientStatus === "new" ? "New" : "Old",
        relatedDoctor: this.selectedDoctor._id,
        purchaseType: purchaseType
      }

      if (this.patientInfo.patientStatus == "old") {
        data.relatedPatient = this.selectedPatient._id
        data.name = this.patientInfo.name
        data.email = this.patientInfo.email
      } else {
        data.name = this.patientInfo.name
        data.email = this.patientInfo.email
      }

      return data
    },
    async showAppointmentlist() {
      try {
        let appointmentsRes = await this.appointmentStore.fetchAppointments()
        this.appointments = appointmentsRes.list
        this.calendarOptions.events = [
          ...this.appointments.map(item => {
            item["title"] = item.relatedPatient?.name
            return item
          }),
        ]
      } catch (err) {
        console.log(err)
      } finally {
        this.isLoading = false
      }
    },
    async saveAppointment() {
      let data = this.prepareForm()
      console.log(data)
      // return
      this.submitting = true
      try {
        let res = await this.appointmentStore.createAppointment(data)
        if (res) {
          await this.showAppointmentlist()
          this.resetForm()
          this.appStore.showSuccess()
          this.$router.push({ name: "appointment.list" })
        }
      } catch (err) {
        this.appStore.showError()
        console.log(err)
      } finally {
        this.submitting = false
      }
    },
  },
  async mounted() {
    try {
      let doctorRes = await this.doctorStore.fetchDoctors()
      this.doctors = doctorRes.data

      await this.showAppointmentlist()

      let patientRes = await this.patientStore.fetchPatients()
      this.patients = patientRes.list
    } catch (err) {
      console.log(err)
    }
  },
}
</script>

<style lang="scss" scoped>
.event:hover {
  cursor: pointer;
}
</style>
