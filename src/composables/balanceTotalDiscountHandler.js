import { ref } from "vue"

const saleInfo = ref({
	total: 0,
	change: 0,
	discount: false,
	discountType: "",
	discountValue: 0,
	balance: 0,
	subTotal: 0,
	quantity: 0,
	payAmount: 0,
	secPayAmount: 0,
})

const balanceTotalDiscount = ref({
	type: "amount",
	amountValue: 0,
	percentValue: 0,
	subTotal: 0,
})

const balanceTotalDiscountOption = ref("amount")

function calculateBalanceTotal() {
	if (saleInfo.value.discount) {
		if (saleInfo.value.discountType === "amount") {
			saleInfo.value.subTotal =
				saleInfo.value.total - saleInfo.value.discountValue
		} else if (saleInfo.value.discountType === "percent") {
			saleInfo.value.subTotal = Math.round(
				saleInfo.value.total -
					saleInfo.value.total * (saleInfo.value.discountValue / 100)
			)
		} else if (saleInfo.value.discountType === "foc") {
			saleInfo.value.subTotal = 0
		}
	} else {
		saleInfo.value.subTotal = saleInfo.value.total
	}

	if (
		saleInfo.value.payAmount + saleInfo.value.secPayAmount >=
		saleInfo.value.subTotal
	) {
		saleInfo.value.change =
			saleInfo.value.payAmount +
			saleInfo.value.secPayAmount -
			saleInfo.value.subTotal
		saleInfo.value.balance = 0
	} else if (
		+saleInfo.value.subTotal >
		+saleInfo.value.payAmount + saleInfo.value.secPayAmount
	) {
		saleInfo.value.balance =
			saleInfo.value.subTotal -
			(saleInfo.value.payAmount + saleInfo.value.secPayAmount)
		saleInfo.value.change = 0
	}
}

function calculateBalanceTotalDiscount() {
	let type = balanceTotalDiscountOption.value
	balanceTotalDiscount.value.type = type
	if (type === "amount") {
		balanceTotalDiscount.value.subTotal =
			saleInfo.value.total - balanceTotalDiscount.value.amountValue
	}
	if (type === "percent") {
		let total = saleInfo.value.total
		balanceTotalDiscount.value.subTotal = Math.round(
			total - total * (balanceTotalDiscount.value.percentValue / 100)
		)
	}
	if (type === "foc") {
		balanceTotalDiscount.value.subTotal = 0
	}
}

const confirmBalanceTotalDiscount = () => {
	saleInfo.value.discount = true
	saleInfo.value.discountType = balanceTotalDiscountOption.value
	if (saleInfo.value.discountType === "amount") {
		saleInfo.value.discountValue = balanceTotalDiscount.value.amountValue
		saleInfo.value.subTotal = balanceTotalDiscount.value.subTotal
	} else if (saleInfo.value.discountType === "percent") {
		saleInfo.value.discountValue = balanceTotalDiscount.value.percentValue
		saleInfo.value.subTotal = balanceTotalDiscount.value.subTotal
	} else if (saleInfo.value.discountType === "foc") {
		saleInfo.value.discountValue = 0
		saleInfo.value.subTotal = balanceTotalDiscount.value.subTotal
	}

	balanceTotalDiscount.value = {
		type: "amount",
		amountValue: 0,
		percentValue: 0,
		subTotal: 0,
	}

	balanceTotalDiscountOption.value = "amount"

	calculateBalanceTotal()
}

const resetBalanceTotalData = () => {
	saleInfo.value = {
		total: 0,
		change: 0,
		discount: false,
		discountType: "",
		discountValue: 0,
		balance: 0,
		subTotal: 0,
		quantity: 0,
		payAmount: 0,
	}

	balanceTotalDiscount.value = {
		type: "amount",
		amountValue: 0,
		percentValue: 0,
		subTotal: 0,
	}

	balanceTotalDiscountOption.value = "amount"
}

export default {
	calculateBalanceTotal,
	calculateBalanceTotalDiscount,
	confirmBalanceTotalDiscount,
	saleInfo,
	balanceTotalDiscount,
	balanceTotalDiscountOption,
	resetBalanceTotalData,
}
