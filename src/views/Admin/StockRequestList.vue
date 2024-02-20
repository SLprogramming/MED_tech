<template>
  <template v-if="isLoading">
    <Loading />
  </template>
  <template v-else>
    <div class="card p-3">
      <Heading :payload="{ title: 'Stock Request List' }" />
      <table class="table table-borderless table-hover table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Request NO</th>
            <th>Request By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr @click="goToDetail(item._id)" v-for="(item, index) in stockRequests">
            <td>{{ index + 1 }}</td>
            <td>{{ item.requestNo }}</td>
            <td>{{ item.requestedBy }}</td>
            <td>{{ cusFormatDate(item.date) }}</td>
          </tr>
          <tr v-if="stockRequests.length <= 0">
            <td colspan="4" class="text-center">
              No record exist!
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router";
import { cusFormatDate } from "../../helpers";
import { useStockRequestStore } from "../../stores/stockRequest"

const isLoading = ref(true)

const stockRequests = ref([])
const stockRequestStore = useStockRequestStore()
const router = useRouter()

const goToDetail = (id) => {
  router.push({ name: 'stock-request.detail', params: { id } })
}

onMounted(async () => {
  try {
    let res = await stockRequestStore.fetchStockRequests()
    console.log(res)
    stockRequests.value = res.list
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
tr:hover {
  cursor: pointer;
}
</style>
