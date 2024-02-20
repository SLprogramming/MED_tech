<template>
	<template v-if="isLoading">
		<div>
			<Loading />
		</div>
	</template>
	<template v-else>
		<div class="row">
			<div class="col-12">
				<Heading
					:payload="{ title: 'Patient Detail' }"
					style="font-size: 30px"
					class="mb-4" />
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<div class="card p-3 shadow-sm">
					<PatientDetail :id="props.id" :prevData="patient" />
					<template v-if="appStore.user.data.user.role !== 'doctor'">
						<div class="d-flex gap-3 mt-3">
							<router-link
								:to="{
									name: 'medicine-history.create',
									query: { patientId: patient._id },
								}"
								custom
								v-slot="{ navigate }">
								<button
									class="btn btn-primary"
									@click="navigate"
									@keypress.enter="navigate"
									role="link">
									Add Medicine History
								</button>
							</router-link>
							<button
								class="btn btn-primary"
								data-bs-toggle="modal"
								data-bs-target="#patientAdvancePaidModal">
								Advance
							</button>
							<button class="btn btn-primary" @click="goToDebtList()">
								Debt List
							</button>
						</div>
						<hr class="my-3" />
						<div class="d-flex gap-3 mb-3 justify-content-end">
							<div>
								<select
									class="form-select"
									@change="onFilterStatusChange"
									v-model="currentSelectionPaymentMethod.type"
									aria-label="Default select example">
									<option selected disabled>Select Status</option>
									<option value="All">All</option>
									<option value="Cash Down">Paid</option>
									<option value="Credit">Partial</option>
								</select>
							</div>
							<button
								class="btn btn-primary"
								data-bs-toggle="modal"
								data-bs-target="#packageSaleModal">
								Package Sale
							</button>
							<button
								class="btn btn-primary"
								data-bs-toggle="modal"
								data-bs-target="#treatmentSelectModal">
								Treatment Sale
							</button>
						</div>
						<div class="d-flex gap-3 justify-content-center">
							<button
								class="btn"
								:class="{ 'btn-primary': currentSelection === 'package' }"
								@click="currentSelection = 'package'">
								Package
							</button>
							<button
								class="btn"
								:class="{ 'btn-primary': currentSelection === 'treatment' }"
								@click="currentSelection = 'treatment'">
								Treatment
							</button>
						</div>
						<!-- <button class="btn btn-primary"
            @click="openTreatmentSelectPrintModal(treatmentResWithPaidAndDiscount, 'normal')">
            testopen
          </button> -->
						<!-- <button class="btn btn-primary" @click="openPackageSaleVoucherModal(testObj, 'normal')">Package Voucher</button> -->
						<!-- <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#packageSaleVoucherModal">
            Launch demo modal
          </button> -->
						<!-- <button type="button" class="btn btn-primary" @click="openPackageSaleVoucherModal">
            Launch demo modal
          </button> -->
						<template v-if="currentSelection === 'package'">
							<PackageSelections
								:selections="filteredPackageSelections"
								@openAppointmentGenereateModal="openAppointmentGenereateModal"
								@updateRelatedAppointment="updatePackageRelatedAppointments" />
						</template>
						<template v-if="currentSelection === 'treatment'">
							<TreatmentSelections
								@updateSelectedSelection="updateSelectedSelection"
								@openAppointmentGenereateModal="openAppointmentGenereateModal"
								@updateRelatedAppointment="updateRelatedAppointment"
								@updateTreatmentDone="updateTreatmentDone"
								:patientId="patient._id"
								:selections="filteredSelections" />
						</template>
					</template>
				</div>
			</div>
			<SaleVoucherModal
				:paymentMethod="voucherPaymentMethod"
				:treatmentData="treatmentData"
				:customer="selectedCustomer"
				:treatments="selectedItems"
				:invoiceId="voucherId"
				:saleReturnFlag="saleReturnFlag"
				:previousPrice="previousPrice"
				:cashBack="cashBack" />
			<TreatmentSelect
				:doctors="doctors"
				@prepareVoucher="prepareVoucherData"
				@openTreatmentSelectModal="openTreatmentSelectModal"
				@updateTreatmentSelections="updateTreatmentSelections"
				:treatmentLists="treatmentLists"
				:treatments="treatments"
				:cashAccounts="cashAccounts"
				:bankAccounts="bankAccounts"
				:patient="patient"
				:discounts="discounts"
				:advanceRecords="advanceRecords"
				@openTreatmentSelectPrintModal="openTreatmentSelectPrintModal" />
			<PackageSaleModal
				:discounts="discounts"
				:patient="patient"
				:packages="packages"
				:cashAccounts="cashAccounts"
				:bankAccounts="bankAccounts"
				@openPackageSaleVoucherModal="openPackageSaleVoucherModal"
				@updatePackageSelection="updatePackageSelectionList" />
			<TreatmentReturn
				@replaceTreatmentSelections="replaceTreatmentSelections"
				@updateTreatmentSelections="updateTreatmentSelections"
				@openTreatmentSelectModal="openTreatmentSelectPrintModal"
				:selection="selectedSelection"
				:treatmentLists="treatmentLists"
				:treatments="treatments"
				:cashAccounts="cashAccounts"
				:bankAccounts="bankAccounts"
				:patient="patient"
				:doctors="doctors" />
			<!-- <PrintModal :resourceFromTreatmentSelect="treatmentSelectResource" :type="printModalType" /> -->
			<!-- <PackageSaleVoucherModal :resourceFromPackageSelect="packageSelectResource" :type="packageSalePrintModalType" /> -->
			<PackageSaleVoucherModal
				:invoiceId="packageVoucherData.invoiceId"
				:packages="packageVoucherData.packages"
				:packageData="packageVoucherData.packageData"
				:paymentMethod="packageVoucherData.paymentMethod"
				:customer="patient" />
			<PatientAdvancePaidModal
				:cashAccounts="cashAccounts"
				:bankAccounts="bankAccounts"
				@update-advance-records="updateAdvanceRecords" />
			<AppointmentGenerateModal
				@updatePackageSelection="updatePackageTreatmentAppoinetment"
				@updateTreatmentSelection="updateTreatmentSelectionAppointment"
				:selectedPackageTreatmentSelection="selectedPackageTreatmentSelection"
				:selectedTreatment="selectedTreatmentSelection"
				:treatmentSelectionId="selectedTreatmentSelectionId"
				:packageSelectionId="selectedPackageSelectionId"
				:doctors="doctors"
				:patient="patient" />
		</div>
	</template>
</template>

<script setup>
// import PrintModal from "../../components/General/PrintModal.vue";
import { ref, onMounted } from "vue"
import { usePatientStore } from "@/stores/patient"
import { cusFormatDate, getImage } from "@/helpers/index"
import PatientDetail from "@/components/General/PatientDetail.vue"
import TreatmentSelections from "../../components/General/TreatmentSelections.vue"
import TreatmentSelect from "@/components/General/TreatmentSelect.vue"
import { useAccountingListStore } from "../../stores/accountingList"
import { useTreatmentUnitStore } from "../../stores/treatmentUnit"
import { useTreatmentStore } from "../../stores/treatment"
import { usePackageStore } from "../../stores/package"
import { useTreatmentListStore } from "../../stores/treatmentList"
import Spinner from "../../components/Common/Spinner.vue"
import bootstrapMin from "bootstrap/dist/js/bootstrap.min"
import TreatmentReturn from "../../components/General/TreatmentReturn.vue"
import { useAppStore } from "../../stores/app"
import { useDiscountStore } from "../../stores/discount"
import PatientAdvancePaidModal from "../../components/General/PatientAdvancePaidModal.vue"
import { useAdvanceRecordStore } from "../../stores/advanceRecord"
import { openDialog } from "../../helpers"
import PackageSaleModal from "../../components/General/PackageSaleModal.vue"
import PackageSaleVoucherModal from "../../components/General/PackageSaleVoucherModal.vue"
import { usePackageSelectionStore } from "../../stores/packageSelection"
import PackageSelections from "../../components/General/PackageSelections.vue"
import AppointmentGenerateModal from "../../components/General/AppointmentGenerateModal.vue"
import { useDoctorStore } from "../../stores/doctor"
import {
	treatmentResWithPaid,
	treatmentResWithPaidAndDiscount,
} from "../../mock/treatment"
import SaleVoucherModal from "@/components/General/SaleVoucherModal.vue"
// import CastSaleVoucherModal from "../../components/General/CastSaleVoucherModal.vue"
import { packageSelectRes } from "../../mock/package"
import { useRouter } from "vue-router"
const props = defineProps(["id"])
const appStore = useAppStore()
const router = useRouter()
const discountStore = useDiscountStore()
const accountingListStore = useAccountingListStore()
const patientStore = usePatientStore()
const treatmentUnitStore = useTreatmentUnitStore()
const treatmentStore = useTreatmentStore()
const treatmentListStore = useTreatmentListStore()
const advanceRecordStore = useAdvanceRecordStore()
const packageStore = usePackageStore()
const packageSelectionStore = usePackageSelectionStore()
const doctorStore = useDoctorStore()

const selectedSelection = ref({})
const isLoading = ref(true)
const patient = ref({})
const bankAccounts = ref([])
const cashAccounts = ref([])
const advanceRecords = ref([])
const treatmentUnits = ref([])
const treatments = ref([])
const packages = ref([])
const treatmentLists = ref([])
const originalPatient = ref({})
const treatmentSelectResource = ref({})
const packageSelectResource = ref({})
const printModalType = ref("normal")
const packageSalePrintModalType = ref("normal")
const discounts = ref([])
const currentSelection = ref("treatment")
const currentSelectionPaymentMethod = ref({
	type: "All",
})
const filteredSelections = ref([])
const filteredPackageSelections = ref([])
const selectedPackageTreatmentSelection = ref({})
const selectedPackageSelectionId = ref("")
const selectedTreatmentSelection = ref({})
const selectedTreatmentSelectionId = ref("")
const packageSelections = ref([])
const doctors = ref([])

// voucher modal data
const selectedItems = ref([])
const treatmentData = ref({})
const voucherId = ref("")
const voucherPaymentMethod = ref("")
const saleReturnFlag = ref(false)
const previousPrice = ref(0)
const cashBack = ref(undefined)
const packageVoucherData = ref({
	invoiceId: "",
	packages: [],
	packageData: {},
	paymentMethod: "",
})
// end voucher modal data

const updateTreatmentSelections = treatmentSelection => {
	patient.value.relatedTreatmentSelection.push(treatmentSelection)

	filterSelection()
}

const updateSelectedSelection = selectionIndex => {
	selectedSelection.value =
		patient.value.relatedTreatmentSelection[selectionIndex]
}
const goToDebtList = () => {
	router.push({ name: "patient.credit", params: { id: props.id } })
	// console.log()
}
const updateTreatmentDone = treatmentSelectId => {
	console.log("done", treatmentSelectId)
	patient.value.relatedTreatmentSelection.map((each, treatmentIndex) => {
		if (each._id == treatmentSelectId) {
			each.isDone = true
		}
	})
}
const showSaleVoucherModal = (
	treatmentRes,
	saleReturnFlag = false,
	previousPrice = 0,
	cashBack = undefined,
	paidAmountOverwrite = undefined
) => {
	prepareVoucherData(
		treatmentRes,
		saleReturnFlag,
		previousPrice,
		cashBack,
		paidAmountOverwrite
	)
	openDialog("saleVoucherModal")
}

const filterSelection = () => {
	if (currentSelectionPaymentMethod.value.type === "All") {
		console.log("here")
		filteredSelections.value = patient.value.relatedTreatmentSelection
		return
	}
	filteredSelections.value = patient.value.relatedTreatmentSelection.filter(
		each => each.paymentMethod === currentSelectionPaymentMethod.value.type
	)
}

const filterPackageSelction = () => {
	// filteredPackageSelections.value = patient.value.relatedPackageSelection;
	// console.log(filteredPackageSelections.value)

	if (currentSelectionPaymentMethod.value.type === "All") {
		filteredPackageSelections.value = patient.value.relatedPackageSelection
		return
	}
	filteredPackageSelections.value =
		patient.value.relatedPackageSelection.filter(
			each => each.paymentMethod === currentSelectionPaymentMethod.value.type
		)
}

const replaceTreatmentSelections = data => {
	patient.value.relatedTreatmentSelection.map((each, index) => {
		if (each._id === data._id)
			patient.value.relatedTreatmentSelection[index] = data
	})

	filterSelection()
}

const updatePackageRelatedAppointments = (
	data,
	packageSelectionIndex,
	treatmentIndex,
	appointmentIndex
) => {
	patient.value.relatedPackageSelection[
		packageSelectionIndex
	].relatedPackage.relatedTreatments[treatmentIndex].relatedAppointments[
		appointmentIndex
	]["status"] = true
}

const updateRelatedAppointment = (data, treatmentSelectionId) => {
	patient.value.relatedTreatmentSelection.map((each, treatmentIndex) => {
		console.log(each)
		console.log(treatmentIndex)
		if (each._id === treatmentSelectionId) {
			each.relatedAppointments.map((each, appointmentIndex) => {
				if (each._id === data._id) {
					patient.value.relatedTreatmentSelection[treatmentIndex][
						"relatedAppointments"
					][appointmentIndex]["status"] = true
				}
			})
		}
	})

	filterSelection()
}

const openTreatmentSelectModal = () => {
	openDialog("treatmentSelectModal")
}

const prepareVoucherData = (
	data,
	saleReturn = false,
	previousPricePara = 0,
	cashBackPara = undefined,
	paidAmountOverwrite = undefined
) => {
	console.log(data)
	selectedItems.value = []
	let newObj = {
		name: data.data[0].relatedTreatment.name,
		price: data.data[0].relatedTreatment.sellingPrice,
		qty: 1,
		discountValue: data.treatmentVoucherResult[0].discountAmount ?? 0,
	}
	newObj.subTotal = +newObj.price - +newObj.discountValue
	selectedItems.value.push(newObj)
	treatmentData.value = {
		paidAmount: data.data[0].paidAmount,
		secondAmount: data.treatmentVoucherResult[0].secondAmount,
		totalAmount: newObj.subTotal,
		discount: 0,
	}
	voucherPaymentMethod.value = data.data[0].paymentMethod
	voucherId.value = data ? data.treatmentVoucherResult[0].code : "N/A"

	if (saleReturn) {
		saleReturnFlag.value = saleReturn
		previousPrice.value = previousPricePara
		cashBack.value = cashBackPara
		if (paidAmountOverwrite !== undefined)
			treatmentData.value.paidAmount = paidAmountOverwrite
	}
}

const openTreatmentSelectPrintModal = (
	payload,
	saleReturnFlag = false,
	previousPrice = 0,
	cashBack = undefined,
	paidAmountOverwrite = undefined
) => {
	showSaleVoucherModal(
		payload,
		saleReturnFlag,
		previousPrice,
		cashBack,
		paidAmountOverwrite
	)
}

const openPackageSaleVoucherModal = (payload = packageSelectRes) => {
	console.log(payload)
	// let modal = new bootstrapMin.Modal(document.querySelector("#packageSaleVoucherModal"));
	// packageSalePrintModalType.value = type;
	// packageSelectResource.value = payload;
	// modal.show();
	preparePackageVoucherData(payload)
	openDialog("packageSaleVoucherModal")
}

const preparePackageVoucherData = data => {
	// packageVoucherData.invoiceId = data.data[0].paymentMethod
	console.log(data)
	packageVoucherData.value.invoiceId = data.treatmentVoucherResult[0].code
	packageVoucherData.value.paymentMethod = data.data[0].paymentMethod
	let newObj = {
		name: data.data[0].relatedPackage.name,
		price: data.data[0].totalAmount,
		qty: 1,
		discountValue: data.treatmentVoucherResult[0].discountAmount ?? 0,
	}
	newObj.subTotal = +newObj.price - +newObj.discountValue
	packageVoucherData.value.packages = [newObj]
	packageVoucherData.value.packageData = {
		totalAmount: newObj.subTotal,
		paidAmount: data.data[0].paidAmount,
	}
}

const updateAdvanceRecords = async () => {
	try {
		let res = await advanceRecordStore.fetchAdvanceRecords()
		advanceRecords.value = res.list
	} catch (err) {
		throw err
	}
}

const updatePackageSelectionList = async packageSelection => {
	patient.value.relatedPackageSelection.push(packageSelection)
}

const generateTreatmentAppointments = async () => {
	try {
		// let res = await
		// console.log(patient.value.relatedPackageSelection)
		if (patient.value.relatedPackageSelection?.length > 0) {
			patient.value.relatedPackageSelection.map(
				async (packageSelection, packageSelectionIndex) => {
					if (packageSelection.relatedPackage.relatedTreatments.length > 0) {
						await packageSelection.relatedPackage.relatedTreatments.map(
							async (each, treatmentIndex) => {
								let res = await packageSelectionStore.getAppointments({
									relatedPackageSelectionId: packageSelection._id,
									relatedTreatmentId: each._id,
								})
								console.log(res)
								if (res.data.length > 0) {
									patient.value.relatedPackageSelection[
										packageSelectionIndex
									].relatedPackage.relatedTreatments[
										treatmentIndex
									].relatedAppointments = res.data
								}
							}
						)
					}
				}
			)
		}
	} catch (err) {
		console.log(err)
		throw err
	}
}

const openAppointmentGenereateModal = (selection, selectionId, type) => {
	if (type == "treatment") {
		selectedPackageSelectionId.value = null
		selectedPackageTreatmentSelection.value = null

		selectedTreatmentSelection.value = selection
		selectedTreatmentSelectionId.value = selectionId
	} else {
		selectedTreatmentSelection.value = null
		selectedTreatmentSelectionId.value = null

		selectedPackageSelectionId.value = selectionId
		selectedPackageTreatmentSelection.value = selection
	}

	openDialog("appointmentGenerateModal")
}

const updatePackageTreatmentAppoinetment = (
	res,
	treatmentId,
	packageSelectionId
) => {
	console.log(res)
	// console.log('treatmentSelection Id', treatmentSelectionId)
	// console.log('packageSelectionId', packageSelectionId)
	patient.value.relatedPackageSelection.map(
		(packageSelection, packageSelectionIndex) => {
			if (packageSelection._id === packageSelectionId) {
				packageSelection.relatedPackage.relatedTreatments.map(
					(treatment, treatmentIndex) => {
						if (treatment._id === treatmentId) {
							patient.value.relatedPackageSelection[
								packageSelectionIndex
							].relatedPackage.relatedTreatments[
								treatmentIndex
							].relatedAppointments = res.data
						}
					}
				)
			}
		}
	)
}

const updateTreatmentSelectionAppointment = (
	res,
	treatmentId,
	treatmentSelectionId
) => {
	console.log(treatmentSelectionId)
	patient.value.relatedTreatmentSelection.map(
		(treatmentSelection, treatmentSelectionIndex) => {
			if (treatmentSelection._id === treatmentSelectionId) {
				patient.value.relatedTreatmentSelection[
					treatmentSelectionIndex
				].relatedAppointments = res.data
			}
		}
	)
}

const onFilterStatusChange = () => {
	filterSelection()
	filterPackageSelction()
}

onMounted(async () => {
	try {
		let res = await patientStore.fetchPatient({ id: props.id })
		console.log(res)
		res.data.dateOfBirth = res.data.dateOfBirth
			? cusFormatDate(res.data.dateOfBirth)
			: null
		originalPatient.value = { ...res.data }
		patient.value = { ...res.data }

		let packageRes = await packageStore.fetchPackages()
		packages.value = packageRes.list

		let accRes = await accountingListStore.fetchAccountingLists()

		accRes.list.filter(el => {
			// if (el.relatedType && el.relatedType.name === "Assets") {
			//   if (el.relatedHeader && el.relatedHeader.name === "Cash at Bank") {
			//     appStore.accountingList.bank.map(bankAccId => {
			//       if (bankAccId === el._id) {
			//         bankAccounts.value.push(el)
			//       }
			//     })
			//   }
			// }

			appStore.accountingList.bank.map(bankSet => {
				if (el.code === bankSet.code && el.subHeader === bankSet.name) {
					bankAccounts.value.push(el)
				}
			})
		})

		cashAccounts.value = accRes.list.filter(el => {
			// if (el.relatedType && el.relatedType.name === "Assets" ) {
			//   if (el.relatedHeader && el.relatedHeader.name === "Cash In Hand") {
			//      return el;
			//   }
			// }
			if (el._id === appStore.account._id) return el
		})
		// let treatmentunitRes = await treatmentUnitStore.fetchTreatmentUnits();
		// treatmentUnits.value = treatmentunitRes.list;

		let treatmentListRes = await treatmentListStore.fetchTreatmentLists()
		treatmentLists.value = treatmentListRes.list

		let treatmentRes = await treatmentStore.fetchTreatments()
		treatments.value = treatmentRes.list

		const discountRes = await discountStore.fetchDiscounts()
		console.log(discountRes)
		discounts.value = discountRes.list

		// const pks = await packageSelectionStore.fetchPackageSelections()
		// console.log(pks)

		// packageSelections.value = pks.list

		const doctorRes = await doctorStore.fetchDoctors()
		console.log(doctorRes)
		doctors.value = doctorRes.data

		await updateAdvanceRecords()
		await generateTreatmentAppointments()

		filterPackageSelction()
		filterSelection()
		console.log(filteredSelections.value)
	} catch (err) {
		console.log(err)
	} finally {
		isLoading.value = false
	}
})
</script>

<style lang="scss" scoped>
td {
	padding-bottom: 10px;
}

.patient-detail {
	.label {
		width: 100px;
		flex-shrink: 0;
	}

	.value {
		width: 250px;
	}
}
</style>
