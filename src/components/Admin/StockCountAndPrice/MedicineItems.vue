<template>
  <template v-if="isLoading">
    <div>Loading...</div>
  </template>
  <template v-else>
    <div>
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center">
            <h5>Medicine Items</h5>
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
                <tr v-for="(item, index) in items">
                  <td>{{ index + 1 }}</td>
                  <td class="">{{ item.code }}</td>
                  <td class="">{{ item.medicineItemName }}</td>
                  <td style="width: 150px">
                    <input type="number" v-if="item.currentQuantity <= item.reOrderQuantity"
                      :id="'medicine_current_qty' + item._id" class="form-control is-invalid form-control-sm"
                      @change="calculateTotalUnit(item._id, index)" :value="item.currentQuantity" disabled />
                    <input type="number" v-else :id="'medicine_current_qty' + item._id"
                      class="form-control form-control-sm" @change="calculateTotalUnit(item._id, index)"
                      :value="item.currentQuantity" disabled />
                  </td>

                  <!-- <td style="width: 100px">
                    <input type="number" :id="'medicine_from_unit' + item._id" class="form-control form-control-sm"
                      @change="calculateTotalUnit(item._id, index)" :value="item.fromUnit" disabled />
                  </td>
                  <td style="width: 100px">
                    <input type="number" :id="'medicine_to_unit' + item._id" class="form-control form-control-sm"
                      @change="calculateTotalUnit(item._id, index)" :value="item.toUnit" disabled />
                  </td> -->
                  <td style="width: 150px">
                    <input type="number" :id="'medicine_total_unit' + item._id" class="form-control form-control-sm"
                      :value="item.totalUnit" disabled />
                  </td>
                  <td class="">{{ item.relatedMedicineItems?.unit ?? 'Not Set' }}</td>
                  <td style="width: 150px">
                    <input type="number" :id="'medicine_selling_price' + item._id" class="form-control form-control-sm"
                      :value="item.sellingPrice" disabled />
                  </td>
                  <!-- <td style="width: 150px">
                    <input type="number" :id="'medicine_purchase_price' + item._id"
                      class="form-control form-control-sm" @change="changeMedicinePurchasePrice(item._id, index)"
                      :value="item.purchasePrice" disabled />
                  </td> -->
                  <!-- <td class="text-center">
                    <router-link v-if="item.name"
                      :to="{ name: 'medicine-list.related-medicine-items', params: { id: item.name?._id } }"
                      class="btn btn-primary">
                      Detail
                    </router-link>
                  </td> -->
                </tr>
                <tr v-if="items.length <= 0">
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
import { useMedicineItemStore } from "../../../stores/medicineItems"
import { useStockStore } from "../../../stores/stock";
import { getAxiosClient } from "../../../data/axios";
import { useAppStore } from "../../../stores/app";

const items = ref([])
const isLoading = ref(true)

const medicineItemStore = useMedicineItemStore()
const appStore = useAppStore()
const stockStore = useStockStore()

const excelExport = () => {
  const data = items.value.map(each => {
    let item =
    {
      "Code": each.code,
      "Medicine Item Name": each.medicineItemName,
      "Qty": each.currentQty,
      // "From Unit": each.fromUnit,
      // "To Unit": each.toUnit,
      "Total Unit": each.totalUnit,
      // "Selling Price": each.relatedMedicineItems.sellingPrice,
      "Unit": each.relatedMedicineItems?.unit ?? 'Not Set',
      "Actual Stock": '',
      "Different": ''
    }
    return item
  })

  exportData(data, "MedicineItems.xlsx")
}

const calculateTotalUnit = (id, index) => {
  let currentQuantity = document.querySelector(
    "#medicine_current_qty" + id
  ).value
  let toUnit = document.querySelector("#medicine_to_unit" + id).value
  let fromUnit = document.querySelector("#medicine_from_unit" + id).value
  let totalUnit = ((currentQuantity * toUnit) / fromUnit).toFixed(2)
  let data = {
    id,
    currentQuantity,
    toUnit,
    fromUnit,
    totalUnit,
  }

  updateMedicineItem(data, index)
}

const changeMedicineSellingPrice = (id, index) => {
  let sellingPrice = document.querySelector(
    "#medicine_selling_price" + id
  ).value
  let data = {
    id,
    sellingPrice,
  }

  updateMedicineItem(data, index)
}

const changeMedicinePurchasePrice = (id, index) => {
  let purchasePrice = document.querySelector(
    "#medicine_purchase_price" + id
  ).value
  let data = {
    id,
    purchasePrice,
  }

  updateMedicineItem(data, index)
}

const updateMedicineItem = async (data, index) => {
  try {
    let res = await medicineItemStore.updateMedicineItem(data)

    items.value[index] = res.data
  } catch (err) {
    console.log(err)
  }
}

onMounted(async () => {
  try {
    // let itemRes = await getAxiosClient().get('stocks', {
    //   params: { relatedBranch: appStore.user.data.user.branch },
    // })
    // let medicineItems = []
    // itemRes.data.data.map(each => {
    //   if (each.relatedMedicineItems) {
    //     medicineItems.push(each)
    //   }
    // })
    // items.value = medicineItems

    let itemsRes = await medicineItemStore.fetchMedicineItems()
    console.log(itemsRes)
    items.value = itemsRes.list;
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
