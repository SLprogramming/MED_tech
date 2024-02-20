<template>
  <template v-if="isLoading">
    <div>Loading...</div>
  </template>
  <template v-else>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h5>Procedure Items</h5>
            <div class="mb-3">
              <button class="btn btn-primary" @click="excelExport">Export</button>
            </div>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Qty</th>
                  <!-- <th>From Unit</th> -->
                  <!-- <th>To Unit</th> -->
                  <th>Total Unit</th>
                  <th>Unit</th>
                  <th>Selling Price ( MMK )</th>
                  <!-- <th>Purchase Price ( MMK )</th> -->
                </tr>
              </thead>
              <tbody>
                <tr v-for="(procedure, index) in procedureItems">
                  <td>{{ index + 1 }}</td>
                  <td>{{ procedure.code }}</td>
                  <td>{{ procedure.procedureItemName }}</td>
                  <td style="width: 150px">
                    <input type="number" v-if="procedure.currentQuantity <= procedure.reOrderQuantity"
                      :id="'procedure_current_qty' + procedure._id" class="form-control is-invalid form-control-sm"
                      @change="calculateTotalUnit(procedure._id, index)" :value="procedure.currentQuantity" disabled />
                    <input type="number" v-else :id="'procedure_current_qty' + procedure._id"
                      class="form-control form-control-sm" @change="calculateTotalUnit(procedure._id, index)"
                      :value="procedure.currentQuantity" disabled />
                  </td>
                  <!-- <td>
                    <input type="number" :id="'procedure_from_unit' + procedure._id" class="form-control form-control-sm"
                      @change="calculateTotalUnit(procedure._id, index)" :value="procedure.fromUnit" disabled />
                  </td>
                  <td>
                    <input type="number" :id="'procedure_to_unit' + procedure._id" class="form-control form-control-sm"
                      @change="calculateTotalUnit(procedure._id, index)" :value="procedure.toUnit" disabled />
                  </td> -->
                  <td style="width: 150px">
                    <input type="number" :id="'procedure_total_unit' + procedure._id" class="form-control form-control-sm"
                      :value="procedure.totalUnit" disabled />
                  </td>
                  <td style="width: 150px">{{ procedure.relatedProcedureItems?.unit ?? 'Not Set' }}</td>
                  <td style="width: 150px">
                    <input type="number" :id="'procedure_selling_price' + procedure._id"
                      class="form-control form-control-sm"
                        :value="procedure.sellingPrice" disabled />
                  </td>
                  <!-- <td>
                    <input type="number" :id="'procedure_purchase_price' + procedure._id"
                      class="form-control form-control-sm"
                      @change="changeProcedurePurchasePrice(procedure._id, index)" :value="procedure.purchasePrice" disabled />
                  </td> -->
                  <!-- <td>
                    <router-link v-if="procedure.name"
                        :to="{ name: 'procedure-medicine.related-procedure-items', params: { id: procedure.name?._id } }"
                        class="btn btn-primary">
                        Detail
                      </router-link>
                  </td> -->
                </tr>
                <tr v-if="procedureItems.length <= 0">
                  <td colspan="6" class="text-center">No record Exist!</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { exportData } from "../../../helpers/index"
import { useProcedureItemStore } from "../../../stores/procedureItem"
import { useStockStore } from "../../../stores/stock"
import { getAxiosClient } from "../../../data/axios";
import { useAppStore } from "../../../stores/app";

const procedureItems = ref([])
const isLoading = ref(true)

const procedureItemStore = useProcedureItemStore()
const stockStore = useStockStore()
const appStore = useAppStore()

const excelExport = () => {
  const data = procedureItems.value.map(each => {
    let item =
    {
      "Code": each.code,
      "Procedure Item Name": each.procedureItemName,
      "Qty": each.currentQty,
      // "From Unit": each.fromUnit,
      // "To Unit": each.toUnit,
      "Total Unit": each.totalUnit,
      // "Selling Price": each.relatedProcedureItems.sellingPrice,
      "Unit": each.relatedProcedureItems?.unit ?? 'Not Set',
      "Actual Stock": '',
      "Different": ''
    }
    return item
  })

  exportData(data, "ProcedureItems.xlsx")
}

const calculateTotalUnit = (id, index) => {
  let currentQuantity = document.querySelector(
    "#procedure_current_qty" + id
  ).value
  let toUnit = document.querySelector("#procedure_to_unit" + id).value
  let fromUnit = document.querySelector("#procedure_from_unit" + id).value
  let totalUnit = ((currentQuantity * toUnit) / fromUnit).toFixed(2)
  let data = {
    id,
    currentQuantity,
    toUnit,
    fromUnit,
    totalUnit,
  }

  updateProcedureItem(data, index)
}

const changeProcedureSellingPrice = (id, index) => {
  let sellingPrice = document.querySelector(
    "#procedure_selling_price" + id
  ).value
  let data = {
    id,
    sellingPrice,
  }

  updateProcedureItem(data, index)
}

const changeProcedurePurchasePrice = (id, index) => {
  let purchasePrice = document.querySelector(
    "#procedure_purchase_price" + id
  ).value
  let data = {
    id,
    purchasePrice,
  }

  updateProcedureItem(data, index)
}

const updateProcedureItem = async (data, index) => {
  try {
    let res = await procedureItemStore.updateProcedureItem(data)

    procedureItems.value[index] = res.data
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  try {
    // let itemRes = await getAxiosClient().get('stocks', {
    //   params: { relatedBranch: appStore.user.data.user.branch },
    // })
    // let newProcedureItems = []
    // itemRes.data.data.map(each => {
    //   if (each.relatedProcedureItems) {
    //     newProcedureItems.push(each)
    //   }
    // })
    // procedureItems.value = [...newProcedureItems]

    let res = await procedureItemStore.fetchProcedureItems()
    procedureItems.value = res.list
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
th {
  white-space: nowrap;
}
</style>
