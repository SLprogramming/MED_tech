<template>
  <template v-if="isLoading">
    <div>Loading ....</div>
  </template>
  <template v-else>
    <div>
      <div class="row" v-if="currentAppointment.usageStatus === 'Pending'">
        <div class="col-12">
          <template v-if="payloadItems.procedureMedicines?.length > 0">
            <h5 class="fw-bold">Procedure Medicine</h5>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Total Qty</th>
                  <th scope="col">Perusage Qty</th>
                  <th scope="col">Actual Unit</th>
                  <th scope="col">Remark</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in resource?.procedureMedicine">
                  <td>{{ item.item_id?.procedureItemName }}</td>
                  <td>{{ item.item_id.totalUnit }}</td>
                  <td>{{ item.perUsageQTY }}</td>
                  <td class="min-width: 200px">
                    <input type="number" v-model="payloadItems.procedureMedicines[index].actual" class="form-control"
                      placeholder="Actual qty" />
                  </td>
                  <td class="min-width: 200px">
                    <input type="text" v-model="payloadItems.procedureMedicines[index].remark" class="form-control"
                      placeholder="remark" />
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template v-if="payloadItems.procedureAccessories?.length > 0">
            <h5 class="fw-bold">Procedure Accessory</h5>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Total Qty</th>
                  <th scope="col">Perusage Qty</th>
                  <th scope="col">Actual Unit</th>
                  <th scope="col">Remark</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in resource?.procedureAccessory">
                  <td>{{ item.item_id?.accessoryItemName }}</td>
                  <td>{{ item.item_id.totalUnit }}</td>
                  <td>{{ item.perUsageQTY }}</td>
                  <td class="min-width: 200px">
                    <input type="number" v-model="payloadItems.procedureAccessories[index].actual" class="form-control"
                      placeholder="Actual qty" />
                  </td>
                  <td class="min-width: 200px">
                    <input type="text" v-model="payloadItems.procedureAccessories[index].remark" class="form-control"
                      placeholder="remark" />
                  </td>
                </tr>
              </tbody>
            </table>
          </template>

          <template v-if="payloadItems.machines?.length > 0">
            <h5 class="fw-bold">Machine</h5>
            <table class="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Total Qty</th>
                  <th scope="col">Perusage Qty</th>
                  <th scope="col">Actual Unit</th>
                  <th scope="col">Remark</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in resource?.machine">
                  <td>{{ item.item_id?.name }}</td>
                  <td>{{ item.item_id.totalUnit }}</td>
                  <td>{{ item.perUsageQTY }}</td>
                  <td class="min-width: 200px">
                    <input type="number" v-model="payloadItems.machines[index].actual" class="form-control"
                      placeholder="Actual qty" />
                  </td>
                  <td class="min-width: 200px">
                    <input type="text" v-model="payloadItems.procedureAccessories[index].remark" class="form-control"
                      placeholder="remark" />
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
          <div class="row">
            <div class="text-end">
              <!-- <button @click="submit" class="btn btn-primary">Submit</button> -->
              <SubmitButton @click="submit" name="Submit" :loading="submitting" />
            </div>
          </div>
        </div>
      </div>

      <div class="row" v-if="currentAppointment.usageStatus !== 'Pending'">
        <template v-if="currentAppointment.usageStatus !== 'Finished'">
          <div class="col-12">
            <h3>Unfinished Items</h3>
            <template v-if="unFinishedPayloadItems.procedureMedicines?.length > 0">
              <h5 class="fw-bold">Procedure Medicine</h5>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Total Qty</th>
                    <th scope="col">Perusage Qty</th>
                    <th scope="col">Actual Unit</th>
                    <th scope="col">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in unFinishedItems.procedureMedicines">
                    <td>{{ item.item_id?.procedureItemName }}</td>
                    <td>{{ item.item_id.totalUnit }}</td>
                    <td>{{ item.perUsageQTY }}</td>
                    <td class="min-width: 200px">
                      <input type="number" v-model="unFinishedPayloadItems.procedureMedicines[index].actual"
                        class="form-control" placeholder="Actual qty" />
                    </td>
                    <td class="min-width: 200px">
                      <input type="text" v-model="unFinishedPayloadItems.procedureMedicines[index].remark"
                        class="form-control" placeholder="remark" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>

            <template v-if="unFinishedPayloadItems.procedureAccessories?.length > 0">
              <h5 class="fw-bold">Procedure Accessory</h5>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Total Qty</th>
                    <th scope="col">Perusage Qty</th>
                    <th scope="col">Actual Unit</th>
                    <th scope="col">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in unFinishedItems.procedureAccessories">
                    <td>{{ item.item_id?.accessoryItemName }}</td>
                    <td>{{ item.item_id.totalUnit }}</td>
                    <td>{{ item.perUsageQTY }}</td>
                    <td class="min-width: 200px">
                      <input type="number" v-model="unFinishedPayloadItems.procedureAccessories[index].actual
                        " class="form-control" placeholder="Actual qty" />
                    </td>
                    <td class="min-width: 200px">
                      <input type="text" v-model="unFinishedPayloadItems.procedureAccessories[index].remark
                        " class="form-control" placeholder="remark" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>

            <template v-if="unFinishedPayloadItems.machines?.length > 0">
              <h5 class="fw-bold">Machine</h5>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Total Qty</th>
                    <th scope="col">Perusage Qty</th>
                    <th scope="col">Actual Unit</th>
                    <th scope="col">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in unFinishedItems.machines">
                    <td>{{ item.item_id?.name }}</td>
                    <td>{{ item.item_id.totalUnit }}</td>
                    <td>{{ item.perUsageQTY }}</td>
                    <td class="min-width: 200px">
                      <input type="number" v-model="unFinishedPayloadItems.machines[index].actual" class="form-control"
                        placeholder="Actual qty" />
                    </td>
                    <td class="min-width: 200px">
                      <input type="text" v-model="unFinishedPayloadItems.procedureAccessories[index].remark
                        " class="form-control" placeholder="remark" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
            <div class="row">
              <div class="text-end">
                <!-- <button @click="submit" class="btn btn-primary">Submit</button> -->
                <SubmitButton @click="submit" name="Submit" :loading="submitting" />
              </div>
            </div>
          </div>
        </template>
        <template v-if="finishedItemsExist">
          <div class="col-12">
            <h3>Finished Items</h3>
            <template v-if="finishedItems.procedureMedicines?.length > 0">
              <h5 class="fw-bold">Procedure Medicine</h5>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Total Qty</th>
                    <th scope="col">Perusage Qty</th>
                    <th scope="col">Actual Unit</th>
                    <th scope="col">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in finishedItems.procedureMedicines">
                    <td>
                      {{ item.item_id?.procedureItemName }}
                    </td>
                    <td>{{ item.item_id.totalUnit }}</td>
                    <td>{{ item.perUsageQTY }}</td>
                    <td class="min-width: 200px">
                      <input type="number" v-model="finishedPayloadItems.procedureMedicines[index].actual" disabled
                        class="form-control" placeholder="Actual qty" />
                    </td>
                    <td class="min-width: 200px">
                      <input type="text" v-model="finishedPayloadItems.procedureMedicines[index].remark" disabled
                        class="form-control" placeholder="remark" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
            <template v-if="finishedItems.procedureAccessories?.length > 0">
              <h5 class="fw-bold">Procedure Accessory</h5>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Total Qty</th>
                    <th scope="col">Perusage Qty</th>
                    <th scope="col">Actual Unit</th>
                    <th scope="col">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in finishedItems.procedureAccessories">
                    <td>{{ item.item_id?.accessoryItemName }}</td>
                    <td>{{ item.item_id.totalUnit }}</td>
                    <td>{{ item.perUsageQTY }}</td>
                    <td class="min-width: 200px">
                      <input type="number" v-model="finishedPayloadItems.procedureAccessories[index].actual" disabled
                        class="form-control" placeholder="Actual qty" />
                    </td>
                    <td class="min-width: 200px">
                      <input type="text" v-model="finishedPayloadItems.procedureAccessories[index].remark" disabled
                        class="form-control" placeholder="remark" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>

            <template v-if="finishedItems.machines?.length > 0">
              <h5 class="fw-bold">Machine</h5>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Total Qty</th>
                    <th scope="col">Perusage Qty</th>
                    <th scope="col">Actual Unit</th>
                    <th scope="col">Remark</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in finishedItems.machines?.length > 0">
                    <td>{{ item.item_id?.name }}</td>
                    <td>{{ item.item_id.totalUnit }}</td>
                    <td>{{ item.perUsageQTY }}</td>
                    <td class="min-width: 200px">
                      <input type="number" v-model="finishedPayloadItems.machines[index].actual" class="form-control"
                        placeholder="Actual qty" />
                    </td>
                    <td class="min-width: 200px">
                      <input type="text" v-model="finishedPayloadItems.procedureAccessories[index].remark"
                        class="form-control" placeholder="remark" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
            <div class="row">
              <div class="text-end">
                <!-- <button @click="submit" class="btn btn-primary">Submit</button> -->
                <!-- <SubmitButton @click="submit" name="Submit" :loading="submitting" /> -->
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import router from "../../router";
import { useTreatmentSelectionStore } from "../../stores/treatmentSelection";
import { useLogStore } from "../../stores/log";
import { useAppStore } from "../../stores/app";
import SubmitButton from "../Common/SubmitButton.vue";
import { useTreatmentStore } from "../../stores/treatment";
import { useAppointmentStore } from "../../stores/appointment";

const route = useRoute();
const appStore = useAppStore();
const submitting = ref(false);
const treatmentSelectionStore = useTreatmentSelectionStore();
const treatmentStore = useTreatmentStore();
const appointmentStore = useAppointmentStore()
const treatmentSelection = ref({
});
const resource = ref({});
const logStore = useLogStore();
const currentTreatment = ref({});
const relatedBranchStock = ref({
  procedureItems: [],
  medicineItems: [],
  accessoryItems: [],
  machine: [],
});
const payloadItems = ref({});
const unFinishedItems = ref({
  procedureMedicines: [],
  procedureAccessories: [],
  machines: [],
});
const finishedItems = ref({
  procedureMedicines: [],
  procedureAccessories: [],
  machines: [],
});
const unFinishedPayloadItems = ref({
  procedureMedicines: [],
  procedureAccessories: [],
  machines: [],
});
const finishedPayloadItems = ref({
  procedureMedicines: [],
  procedureAccessories: [],
  machines: [],
});

const unFinishedItemsExist = computed(() => {
  let exist = false;
  for (const property in unFinishedItems.value) {
    console.log(property)
    if (unFinishedItems.value[property].length > 0) exist = true;
  }
  return exist;
});

const finishedItemsExist = computed(() => {
  let exist = false;
  for (const property in finishedItems.value) {
    if (finishedItems.value[property].length > 0) exist = true;
  }
  return exist;
});

const currentAppointment = ref(null);

const isLoading = ref(true);

const prepareForm = () => {
  let data = [];
  if (currentAppointment.value.usageStatus === "Pending") {
    data = {
      // usageStatus: "New",
      // usageStatus: "Finishied",
      relatedTreatmentSelection: route.query.treatmentSelectionId,
      relatedAppointment: route.query.appointmentId,
      procedureMedicine: payloadItems.value.procedureMedicines,
      procedureAccessory: payloadItems.value.procedureAccessories,
      machine: payloadItems.value.machines,
    };
  } else {
    data = {
      // usageStatus: "New",
      // usageStatus: "Finishied",
      relatedTreatmentSelection: route.query.treatmentSelectionId,
      relatedAppointment: route.query.appointmentId,
      procedureMedicine: unFinishedPayloadItems.value.procedureMedicines,
      procedureAccessory: unFinishedPayloadItems.value.procedureAccessories,
      machine: unFinishedPayloadItems.value.machines,
    };
  }

  return data;
};

const appointmentFinish = async () => {
  try {
    let updateAppointmentRes = await appointmentStore.updateAppointment({
      id: currentAppointment.value._id,
      status: true,
      relatedPatient: currentAppointment.value.relatedPatient
    });

    console.log(updateAppointmentRes)
  } catch (error) {
    console.log(error)
    throw error
  }
}

const submit = async () => {
  submitting.value = true;
  let data = prepareForm();
  // console.log(data)
  // return
  // return console.log(JSON.stringify(data))
  try {
    let res = await logStore.addUsage(data);
    console.log(res);
    appStore.showSuccess();
    await fetchUsages();
    if (!unFinishedItemsExist.value && finishedItemsExist.value) {
      console.log('finishing appointment')
      await appointmentFinish()
    }
  } catch (error) {
    appStore.showError();
    console.log(error);
  } finally {
    submitting.value = false;
  }
};

const updateUsageStatus = async (usageStatus) => {
  try {
    console.log(currentAppointment)
    let updateAppointmentRes = await appointmentStore.updateAppointment({
      id: currentAppointment._id,
      usageStatus: usageStatus,
      relatedPatient: currentAppointment.relatedPatient
    });

    console.log(updateAppointmentRes)
  } catch (error) {
    console.log(error)
    throw error
  }
}

const fetchStockForRelatedBranch = async (payload) => {
  try {
    let res = await logStore.getRelatedBranchStock(payload);
    relatedBranchStock.value = res;
    console.log("resusage", res);
  } catch (error) {
    console.log(error);
  }
};

const fillPayloadForStockFetch = (src) => {
  let newObj = {
    procedureItems: [],
    medicineItems: [],
    accessoryItems: [],
    machines: [],
  };
  console.log(src);
  let newSrc = src

  src.procedureAccessory.map((each) => newObj.accessoryItems.push(each.item_id._id));
  src.procedureMedicine.map((each) => newObj.procedureItems.push(each.item_id._id));
  // src.procedureMedicine.map(each => newObj.medicineItems.push(each.item_id._id))
  src.machine.map((each) => newObj.machines.push(each.item_id._id));

  return newObj;
};

const fetchCurrentAppointment = async () => {
  try {
    let res = await appointmentStore.fetchAppointment({ id: route.query.appointmentId })
    console.log(res)
    currentAppointment.value = res.data[0]
  } catch (error) {
    console.log(error)
    throw error
  }
}

const fetchUsages = async () => {
  try {
    if (route.query.type === "package") {
      let res = await treatmentStore.fetchTreatment({
        id: route.query.treatmentId,
      });
      console.log(res);
      resource.value = res.data[0];
      currentTreatment.value = res.data[0];
      console.log(appStore);
      // currentAppointment.value = appStore.getCurrentAppointment();
      await fetchCurrentAppointment()
    } else {
      let res = await treatmentSelectionStore.fetchTreatmentSelection({
        id: route.query.treatmentSelectionId,
      });
      console.log(res);
      resource.value = res.data[0].relatedTreatment;
      currentTreatment.value = resource.value;
      currentAppointment.value = res.data[0].relatedAppointments.filter(
        (each) => each._id === route.query.appointmentId
      )[0];
    }

    let procedureAccessories = [];
    let procedureMedicines = [];
    let machines = [];

    let newObj = fillPayloadForStockFetch(resource.value);
    console.log(newObj);

    await fetchStockForRelatedBranch(newObj);

    if (currentAppointment.value.usageStatus === "Pending") {
      if (currentTreatment.value.procedureAccessory?.length > 0) {
        // change totalunit with related branch stock total unit
        // let pRes = currentTreatment.value.procedureAccessory.map((item) => {
        //   relatedBranchStock.value.accessoryItems.map((each) => {
        //     if (each.relatedAccessoryItems._id === item.item_id._id) {
        //       item.item_id.totalUnit = each.totalUnit;
        //     }
        //   });
        //   return item;
        // });

        // currentTreatment.value.procedureAccessory = pRes;
        // treatmentSelection.value.relatedTreatment.procedureAccessory = pRes;
        // end change totalunit with related branch stock total unit

        procedureAccessories = currentTreatment.value?.procedureAccessory.map((item) => {
          let newItem = {
            item_id: item.item_id._id,
            stock: item?.item_id.totalUnit,
            actual: item.perUsageQTY,
            quantity: item.quantity,
            perUsageQTY: item.perUsageQTY,
          };
          return newItem;
        });
      }

      if (currentTreatment.value.procedureMedicine?.length > 0) {
        // change totalunit with related branch stock total unit
        // let pMRes = currentTreatment.value.procedureMedicine.map((item) => {
        //   relatedBranchStock.value.procedureItems.map((each) => {
        //     if (each.relatedProcedureItems._id === item.item_id._id) {
        //       item.item_id.totalUnit = each.totalUnit;
        //     }
        //   });
        //   return item;
        // });

        // currentTreatment.value.procedureMedicine = pMRes;
        // treatmentSelection.value.relatedTreatment.procedureMedicine = pMRes;
        // end change totalunit with related branch stock total unit

        procedureMedicines = currentTreatment.value?.procedureMedicine.map((item) => {
          let newItem = {
            item_id: item.item_id._id,
            stock: item?.item_id.totalUnit,
            actual: item.perUsageQTY,
            quantity: item.quantity,
            perUsageQTY: item.perUsageQTY,
          };
          return newItem;
        });
      }

      if (currentTreatment.value.machine?.length > 0) {
        // change totalunit with related branch stock total unit
        // let mRes = currentTreatment.value.machine.map((item) => {
        //   relatedBranchStock.value.machine.map((each) => {
        //     if (each.relatedMachine._id === item.item_id._id) {
        //       item.item_id.totalUnit = each.totalUnit;
        //     }
        //   });
        //   return item;
        // });

        // currentTreatment.value.machine = mRes;
        // treatmentSelection.value.relatedTreatment.machine = mRes;
        // end change totalunit with related branch stock total unit

        machines = currentTreatment.value?.machine.map((item) => {
          let newItem = {
            item_id: item.item_id._id,
            stock: item?.item_id.totalUnit,
            actual: item.perUsageQTY,
            quantity: item.quantity,
            perUsageQTY: item.perUsageQTY,
          };

          return newItem;
        });
      }

      payloadItems.value.procedureAccessories = [...procedureAccessories];
      payloadItems.value.procedureMedicines = [...procedureMedicines];
      payloadItems.value.machines = [...machines];
    }

    if (
      currentAppointment.value.usageStatus === "In Progress" ||
      currentAppointment.value.usageStatus === "Finished"
    ) {
      let resdata = await logStore.getUsages({
        id: currentAppointment.value.relatedUsage,
      });
      console.log(resdata);

      // unfinished

      currentAppointment.value.usageStatus = resdata.data[0].usageStatus;

      if (resdata.data[0].accessoryItemsError?.length > 0) {
        // change totalunit with related branch stock total unit
        // let pRes = resdata.data[0].accessoryItemsError.map((item) => {
        //   relatedBranchStock.value.accessoryItems.map((each) => {
        //     if (each.relatedAccessoryItems._id === item.item_id._id) {
        //       item.item_id.totalUnit = each.totalUnit;
        //     }
        //   });
        //   return item;
        // });

        // resdata.data[0].accessoryItemsError = pRes;
        // end change totalunit with related branch stock total unit

        unFinishedItems.value.procedureAccessories = resdata.data[0].accessoryItemsError;
      } else {
        unFinishedItems.value.procedureAccessories = [];
      }
      if (resdata.data[0].procedureItemsError?.length > 0) {
        // change totalunit with related branch stock total unit
        // let pMRes = resdata.data[0].procedureItemsError.map((item) => {
        //   relatedBranchStock.value.procedureItems.map((each) => {
        //     if (each.relatedProcedureItems._id === item.item_id._id) {
        //       item.item_id.totalUnit = each.totalUnit;
        //     }
        //   });
        //   return item;
        // });

        // resdata.data[0].procedureItemsError = pMRes;
        // end change totalunit with related branch stock total unit

        unFinishedItems.value.procedureMedicines = resdata.data[0].procedureItemsError;
      } else {
        unFinishedItems.value.procedureMedicines = [];
      }

      if (resdata.data[0].machineError?.length > 0) {
        // change totalunit with related branch stock total unit
        // let mRes = resdata.data[0].machineError.map((item) => {
        //   relatedBranchStock.value.machine.map((each) => {
        //     if (each.relatedMachine._id === item.item_id._id) {
        //       item.item_id.totalUnit = each.totalUnit;
        //     }
        //   });
        //   return item;
        // });

        // resdata.data[0].machineError = mRes;
        // end change totalunit with related branch stock total unit

        unFinishedItems.value.machines = resdata.data[0].machineError;
      } else {
        unFinishedItems.value.machines = [];
      }

      if (resdata.data[0].accessoryItemsError?.length > 0) {
        unFinishedPayloadItems.value.procedureAccessories = resdata.data[0].accessoryItemsError.map(
          (item) => {
            let newItem = {
              item_id: item.item_id._id,
              stock: item.item_id.totalUnit,
              actual: item.actual,
              quantity: item.quantity,
              perUsageQTY: item.perUsageQTY,
              remark: item.remark,
            };

            return newItem;
          }
        );
      } else {
        unFinishedPayloadItems.value.procedureAccessories = [];
      }

      if (resdata.data[0].procedureItemsError?.length > 0) {
        unFinishedPayloadItems.value.procedureMedicines = resdata.data[0].procedureItemsError?.map(
          (item) => {
            let newItem = {
              item_id: item.item_id._id,
              stock: item.item_id.totalUnit,
              actual: item.actual,
              quantity: item.quantity,
              perUsageQTY: item.perUsageQTY,
              remark: item.remark,
            };

            return newItem;
          }
        );
      } else {
        unFinishedPayloadItems.value.procedureMedicines = [];
      }

      if (resdata.data[0].machineError?.length > 0) {
        unFinishedPayloadItems.value.machines = resdata.data[0].machineError?.map(
          (item) => {
            let newItem = {
              item_id: item.item_id._id,
              stock: item?.item_id.totalUnit,
              actual: item.actual,
              quantity: item.quantity,
              perUsageQTY: item.perUsageQTY,
              remark: item.remark,
            };

            relatedBranchStock.value.machine.map((each) => {
              if (each.relatedMachine._id === item._id) newItem.stock = each.totalUnit;
            });

            return newItem;
          }
        );
      } else {
        unFinishedPayloadItems.value.machines = [];
      }

      //finished

      if (resdata.data[0].procedureAccessory?.length > 0) {
        console.log(resdata);
        // change totalunit with related branch stock total unit
        // let pRes = resdata.data[0].procedureAccessory.map((item) => {
        //   relatedBranchStock.value.accessoryItems.map((each) => {
        //     if (each.relatedAccessoryItems._id === item.item_id._id) {
        //       item.item_id.totalUnit = each.totalUnit;
        //     }
        //   });
        //   return item;
        // });

        // resdata.data[0].procedureAccessory = pRes;
        // end change totalunit with related branch stock total unit
        finishedItems.value.procedureAccessories = resdata.data[0].procedureAccessory;
      }

      if (resdata.data[0].procedureMedicine?.length > 0) {
        // change totalunit with related branch stock total unit
        // let pMRes = resdata.data[0].procedureMedicine.map((item) => {
        //   relatedBranchStock.value.procedureItems.map((each) => {
        //     if (each.relatedProcedureItems._id === item.item_id._id) {
        //       item.item_id.totalUnit = each.totalUnit;
        //     }
        //   });
        //   return item;
        // });

        // resdata.data[0].procedureMedicine = pMRes;
        // end change totalunit with related branch stock total unit

        finishedItems.value.procedureMedicines = resdata.data[0].procedureMedicine;
      }

      if (resdata.data[0].machine?.length > 0) {
        // change totalunit with related branch stock total unit
        // let mRes = resdata.data[0].machine.map((item) => {
        //   relatedBranchStock.value.machine.map((each) => {
        //     if (each.relatedMachine._id === item.item_id._id) {
        //       item.item_id.totalUnit = each.totalUnit;
        //     }
        //   });
        //   return item;
        // });

        // currentTreatment.value.machine = mRes;
        // treatmentSelection.value.relatedTreatment.machine = mRes;
        // end change totalunit with related branch stock total unit

        finishedItems.value.machines = resdata.data[0].machine;
      }

      if (resdata.data[0].procedureMedicine?.length > 0) {
        finishedPayloadItems.value.procedureMedicines = resdata.data[0].procedureMedicine.map(
          (item) => {
            let newItem = {
              item_id: item.item_id._id,
              stock: item.item_id.totalUnit,
              actual: item.actual,
              quantity: item.quantity,
              perUsageQTY: item.perUsageQTY,
              remark: item.remark,
            };
            return newItem;
          }
        );
      }

      if (resdata.data[0].procedureAccessory?.length > 0) {
        finishedPayloadItems.value.procedureAccessories = resdata.data[0].procedureAccessory?.map(
          (item) => {
            let newItem = {
              item_id: item.item_id._id,
              stock: item.item_id.totalUnit,
              actual: item.actual,
              quantity: item.quantity,
              perUsageQTY: item.perUsageQTY,
              remark: item.remark,
            };
            return newItem;
          }
        );
      }

      if (resdata.data[0].machine?.length > 0) {
        finishedPayloadItems.value.machines = resdata.data[0].machine?.map((item) => {
          let newItem = {
            item_id: item.item_id._id,
            stock: item?.item_id.totalUnit,
            actual: item.actual,
            quantity: item.quantity,
            perUsageQTY: item.perUsageQTY,
            remark: item.remark,
          };
          return newItem;
        });
      }
    }
  } catch (error) {
    throw error;
  }
};

onMounted(async () => {
  try {
    await fetchUsages();
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
th {
  white-space: nowrap;
}

td {
  width: 200px;
}
</style>

// {
//     "relatedPatient": "64be4218eb9f72a5da50e68d",
//     "tsType": "TSMulti",
//     "totalAmount": 152500,
//     "paymentMethod": "Cash Down",
//     "paidAmount": 102500,
//     "tvDiscount": 50000,
//     "paymentType": "Cash",
//     "relatedCash": "64805c607d7e4357442aa174",
//     "multiTreatment": "[{"item_id":"64803e757d7e4357442a9920","quantity":1,"price":62500,"discount":10000},{"item_id":"648046eb7d7e4357442a9bc3","quantity":1,"price":150000,"discount":50000}]"
// }