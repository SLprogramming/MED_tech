<script setup>
import { RouterView } from "vue-router"
import OpeningAccountDialog from "./components/General/OpeningAccountDialog.vue"
import ClosingAccountDialog from "./components/General/ClosingAccountDialog.vue"
import { onMounted } from "vue"
import { useAppStore } from "./stores/app"
</script>

<template>
	<RouterView />
	<OpeningAccountDialog />
	<ClosingAccountDialog />
</template>

<style>
@media print {
	.card {
		padding: 0;
		border: 0;
		background-color: transparent;
	}
}
</style>
