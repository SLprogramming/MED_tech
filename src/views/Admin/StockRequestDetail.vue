<template>
  <template v-if="loading">
    <Loading />
  </template>
  <template v-else>
    <div class="card p-3">
      <Heading :payload="{ title: 'Stock Request Detail' }" />
      <div class="row mb-3">
        <div class="col-6">
          <label class="form-label">Request Number</label>
          <div class="form-control bg-opacity-25 bg-secondary">
            {{ stockRequest.requestNo }}
          </div>
        </div>
        <div class="col-6">
          <label class="form-label">Requested By</label>
          <div class="form-control bg-opacity-25 bg-secondary">
            {{ stockRequest.requestedBy }}
          </div>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-6">
          <label class="form-label">Request Date</label>
          <div class="form-control bg-opacity-25 bg-secondary">
            {{ cusFormatDate(stockRequest.date) }}
          </div>
        </div>
        <div class="col-6">
          <label class="form-label">Requested Branch</label>
          <div class="form-control bg-opacity-25 bg-secondary">
            {{ stockRequest?.relatedBranch?.name }}
          </div>
        </div>
      </div>
      <div class="row g-3 mb-3">
        <h5>Requested Items</h5>
        <div class="col-6" v-if="stockRequest.medicineLists.length > 0">
          <h6>Medicine Items</h6>
          <div class="row">
            <div class="col-12">
              <div class="row g-3 mb-3" v-for="(item, index) in stockRequest.medicineLists"
                v-if="stockRequest.medicineLists.length > 0">
                <div :class="{ 'col-6': item.flag, 'col-4': !item.flag }">
                  <div class="bg-secondary bg-opacity-25 form-control">
                    {{ item.item_id.medicineItemName }}
                  </div>
                </div>
                <div class="col">
                  <div class="bg-secondary bg-opacity-25 form-control">
                    {{ item.requestedQty }}
                  </div>
                </div>
                <div class="col-4" v-if="!item.flag">
                  <input type="number" class="form-control" v-model="stockRequest.medicineLists[index].recievedItem"
                    placeholder="recievedItem">
                </div>
                <div class="col-2" v-if="!item.flag">
                  <SubmitButton :loading="submitting" name="Recieve" @click="recieveItem(item)"
                    class="btn btn-primary w-100" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6" v-if="stockRequest.procedureMedicine.length > 0">
          <h6>Procedure Items</h6>
          <div class="row">
            <div class="col-12">
              <div class="row g-3 mb-3" v-for="(item, index) in stockRequest.procedureMedicine">
                <div :class="{ 'col-6': item.flag, 'col-4': !item.flag }">
                  <div class="bg-secondary bg-opacity-25 form-control">
                    {{ item.item_id.procedureItemName }}
                  </div>
                </div>
                <div class="col">
                  <div class="bg-secondary bg-opacity-25 form-control">
                    {{ item.requestedQty }}
                  </div>
                </div>
                <div class="col-4" v-if="!item.flag">
                  <input type="number" class="form-control" v-model="stockRequest.procedureMedicine[index].recievedItem"
                    placeholder="recievedItem">
                </div>
                <div class="col-2" v-if="!item.flag">
                  <SubmitButton :loading="submitting" name="Recieve" @click="recieveItem(item)"
                    class="btn btn-primary w-100" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6" v-if="stockRequest.procedureAccessory.length > 0">
          <h6>Accessory Items</h6>
          <div class="row">
            <div class="col-12">
              <div class="row g-3 mb-3" v-for="(item, index) in stockRequest.procedureAccessory">
                <div :class="{ 'col-6': item.flag, 'col-4': !item.flag }">
                  <div class="bg-secondary bg-opacity-25 form-control">
                    {{ item.item_id.accessoryItemName }}
                  </div>
                </div>
                <div class="col">
                  <div class="bg-secondary bg-opacity-25 form-control">
                    {{ item.requestedQty }}
                  </div>
                </div>
                <div class="col-4" v-if="!item.flag">
                  <input type="number" class="form-control" v-model="stockRequest.procedureAccessory[index].recievedItem"
                    placeholder="recievedItem">
                </div>
                <div class="col-2" v-if="!item.flag">
                  <SubmitButton :loading="submitting" name="Recieve" @click="recieveItem(item)"
                    class="btn btn-primary w-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from "vue"
import SubmitButton from "../../components/Common/SubmitButton.vue"
import { cusFormatDate } from "../../helpers"
import Loading from "../../components/Common/Loading.vue"
import { useStockRequestStore } from "../../stores/stockRequest"
import { useAppStore } from "../../stores/app"

const appStore = useAppStore()

const loading = ref(true)
const submitting = ref(false)

const props = defineProps(["id"])

const stockRequest = ref({})
const stockRequestStore = useStockRequestStore()

const prepareRecieveForm = (payload) => {
  console.log(payload)
  let data = {
    recievedQty: payload.recievedItem,
    currentQty: payload.item_id.totalUnit,
    actual: payload.requestedQty,
    fromUnit: Number(payload.item_id.fromUnit),
    toUnit: Number(payload.item_id.toUnit),
    stockRequestID: props.id,
    requestedQty: payload.requestedQty
  }

  if (payload.item_id.hasOwnProperty('medicineItemName')) {
    data.medicineItemID = payload.item_id._id
  } else if (payload.item_id.hasOwnProperty('procedureItemName')) {
    data.procedureItemID = payload.item_id._id
  } else if (payload.item_id.hasOwnProperty('accessoryItemName')) {
    data.accessoryItemID = payload.item_id._id
  }

  return data
}

const validateForm = (data) => {
  let result = true;
  if (Number(data.recievedQty) > Number(data.requestedQty)) {
    appStore.showError({ message: 'The received item should not exceed the requested quantity!' })
    result = false
  }
  return result
}

const recieveItem = async (item) => {
  submitting.value = true
  let data = prepareRecieveForm(item)
  if (validateForm(data)) {
    try {
      let res = await stockRequestStore.recievedStockRequest(data)
      await updateStockRequestDetail()
      console.log(res)
      appStore.showSuccess()
    } catch (error) {
      console.log(error)
      appStore.showError()
    } finally {
      submitting.value = false
    }
  } else {
    submitting.value = false
  }
}

const updateStockRequestDetail = async () => {
  console.log('updating stock request')
  try {
    let res = await stockRequestStore.fetchStockRequest({ id: props.id })
    stockRequest.value = res.data[0]
  } catch (error) {
    throw error
  }
}

onMounted(async () => {
  try {
    await updateStockRequestDetail()
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped></style>
