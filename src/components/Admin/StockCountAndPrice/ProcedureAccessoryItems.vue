<template>
  <template v-if="isLoading">
    <div>
      <Loading />
    </div>
  </template>
  <template v-else>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h5>Procedure Items (Accessory Items)</h5>
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
                <tr v-for="(procedure, index) in accessoryItems">
                  <td class="text-nowrap">{{ index + 1 }}</td>
                  <td class="text-start text-nowrap">{{ procedure.code }}</td>
                  <td class="text-start text-nowrap">
                    {{ procedure.accessoryItemName }}
                  </td>
                  <td class="text-nowrap" style="width: 150px">
                    <input type="number" v-if="procedure.currentQuantity <= procedure.reOrderQuantity"
                      :id="'accessory_current_qty' + procedure._id" class="form-control is-invalid form-control-sm"
                      @change="calculateTotalUnit(procedure._id, index)" :value="procedure.currentQuantity" disabled />
                    <input type="number" v-else :id="'accessory_current_qty' + procedure._id"
                      class="form-control form-control-sm" @change="calculateTotalUnit(procedure._id, index)"
                      :value="procedure.currentQuantity" disabled />
                  </td>

                  <!-- <td class="text-nowrap" style="width: 100px">
                    <input type="number" :id="'accessory_from_unit' + procedure._id" class="form-control form-control-sm"
                      @change="calculateTotalUnit(procedure._id, index)" :value="procedure.fromUnit" disabled />
                  </td>
                  <td class="text-nowrap" style="width: 100px">
                    <input type="number" :id="'accessory_to_unit' + procedure._id" class="form-control form-control-sm"
                      @change="calculateTotalUnit(procedure._id, index)" :value="procedure.toUnit" disabled />
                  </td> -->
                  <td class="text-nowrap" style="width: 150px">
                    <input type="number" :id="'accessory_total_unit' + procedure._id" class="form-control form-control-sm"
                      :value="procedure.totalUnit" disabled />
                  </td>
                  <td style="width: 150px">{{ procedure.relatedAccessoryItems?.unit ?? 'Not Set' }}</td>
                  <td style="width: 150px">
                    <input type="number" :id="'accessory_selling_price' + procedure._id"
                      class="form-control form-control-sm"
                      :value="procedure.sellingPrice" disabled />
                  </td>
                  <!-- <td class="text-nowrap" style="width: 150px">
                    <input type="number" :id="'accessory_purchase_price' + procedure._id"
                      class="form-control form-control-sm"
                      @change="changeAccessoryPurchasePrice(procedure._id, index)" :value="procedure.purchasePrice" disabled />
                  </td> -->
                  <!-- <td class="text-nowrap">
                    <router-link v-if="procedure.name"
                      :to="{ name: 'procedure-accessory.related-accessory-items', params: { id: procedure.name?._id } }"
                      class="btn btn-primary">
                      Detail
                    </router-link>
                  </td> -->
                </tr>
                <tr v-if="accessoryItems.length <= 0">
                  <td colspan="7" class="text-center">No record Exist!</td>
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
import { useAccessoryItemStore } from "../../../stores/accessoryItem"
import Loading from "../../Common/Loading.vue"
import { useStockStore } from "../../../stores/stock"
import { getAxiosClient } from "../../../data/axios";
import { useAppStore } from "../../../stores/app";

const accessoryItems = ref([])
const isLoading = ref(true)

const accessoryItemStore = useAccessoryItemStore()
const stockStore = useStockStore()
const appStore = useAppStore()

const excelExport = () => {
  const data = accessoryItems.value.map(each => {
    let item =
    {
      "Code": each.code,
      "Accessory Item Name": each.accessoryItemName,
      "Qty": each.currentQty,
      // "From Unit": each.fromUnit,
      // "To Unit": each.toUnit,
      "Total Unit": each.totalUnit,
      // "Selling Price": each.relatedAccessoryItems.sellingPrice,
      "Unit": each.relatedAccessoryItems?.unit ?? 'Not Set',
      "Actual Stock": '',
      "Different": ''
    }
    return item
  })

  exportData(data, "AccessoryItems.xlsx")
}

const calculateTotalUnit = (id, index) => {
  let currentQuantity = document.querySelector(
    "#accessory_current_qty" + id
  ).value
  let toUnit = document.querySelector("#accessory_to_unit" + id).value
  let fromUnit = document.querySelector("#accessory_from_unit" + id).value
  let totalUnit = ((currentQuantity * toUnit) / fromUnit).toFixed(2)
  let data = {
    id,
    currentQuantity,
    toUnit,
    fromUnit,
    totalUnit,
  }

  updateAccessoryItem(data, index)
}

const changeAccessorySellingPrice = (id, index) => {
  let sellingPrice = document.querySelector(
    "#accessory_selling_price" + id
  ).value
  let data = {
    id,
    sellingPrice,
  }

  updateAccessoryItem(data, index)
}

const changeAccessoryPurchasePrice = (id, index) => {
  let purchasePrice = document.querySelector(
    "#accessory_purchase_price" + id
  ).value
  let data = {
    id,
    purchasePrice,
  }

  updateAccessoryItem(data, index)
}

const updateAccessoryItem = async (data, index) => {
  try {
    let res = await accessoryItemStore.updateAccessoryItem(data)

    accessoryItems.value[index] = res.data
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  try {
    // let itemRes = await getAxiosClient().get('stocks', {
    //   params: { relatedBranch: appStore.user.data.user.branch },
    // })
    // let newAccessoryItems = []
    // itemRes.data.data.map(each => {
    //   if (each.relatedAccessoryItems) {
    //     newAccessoryItems.push(each)
    //   }
    // })
    // accessoryItems.value = [...newAccessoryItems]

    let res = await accessoryItemStore.fetchAccessoryItems()
    accessoryItems.value = res.list
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
