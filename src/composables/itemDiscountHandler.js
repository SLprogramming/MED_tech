import { ref } from "vue"

const itemDiscount = ref({
	type: "amount",
	amountValue: 0,
	percentValue: 0,
	subTotal: 0,
})

const itemDiscountOption = ref("amount")

function calculateItemDiscount(item, index) {
	let type = itemDiscountOption.value
	itemDiscount.value.type = type
	if (type === "amount") {
		itemDiscount.value.subTotal =
			item.price * item.qty - itemDiscount.value.amountValue
	}
	if (type === "percent") {
		let total = item.price * item.qty
		itemDiscount.value.subTotal = Math.round(
			total - total * (itemDiscount.value.percentValue / 100)
		)
	}
	if (type === "foc") {
		itemDiscount.value.subTotal = 0
	}
}

const resetItemDiscountData = () => {
	itemDiscount.value = {
		type: "amount",
		amountValue: 0,
		percentValue: 0,
		subTotal: 0,
	}

	itemDiscountOption.value = "amount"
}

export default {
	itemDiscount,
	itemDiscountOption,
	calculateItemDiscount,
	resetItemDiscountData,
}
