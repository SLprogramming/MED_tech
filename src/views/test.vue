<template>
	<div>
		<vue-good-table :columns="columns" :rows="rows" />
	</div>
</template>

<script>
export default {
	name: "my-component",
	data() {
		return {
			columns: [
				{
					label: "Name",
					field: "name",
				},
				{
					label: "Age",
					field: "age",
					type: "number",
				},
				{
					label: "Created On",
					field: "createdAt",
					type: "date",
					dateInputFormat: "yyyy-MM-dd",
					dateOutputFormat: "MMM do yy",
				},
				{
					label: "Percent",
					field: "score",
					type: "percentage",
				},
			],
			rows: [
				{ id: 1, name: "John", age: 20, createdAt: "", score: 0.03343 },
				{
					id: 2,
					name: "Jane",
					age: 24,
					createdAt: "2011-10-31",
					score: 0.03343,
				},
				{
					id: 3,
					name: "Susan",
					age: 16,
					createdAt: "2011-10-30",
					score: 0.03343,
				},
				{
					id: 4,
					name: "Chris",
					age: 55,
					createdAt: "2011-10-11",
					score: 0.03343,
				},
				{
					id: 5,
					name: "Dan",
					age: 40,
					createdAt: "2011-10-21",
					score: 0.03343,
				},
				{
					id: 6,
					name: "John",
					age: 20,
					createdAt: "2011-10-31",
					score: 0.03343,
				},
			],
		}
	},
	methods: {
		test() {
			const test = {
				_id: "648be9395a401f44ee5426ca",
				relatedBranch: {
					isDeleted: false,
					_id: "6474394fdab649311f9fcc32",
					name: "SOK",
				},
				relatedMedicineItems: {
					_id: "644b5b2a07a02935acf5cc67",
					isDeleted: false,
					code: "HDLB-004",
					name: "64634d6eee363976a3db9ae1",
					medicineItemName: "Cream Arbuatin",
					currentQuantity: 12,
					purchasePrice: 100,
					sellingPrice: 150,
					description: "",
					fromUnit: "1",
					toUnit: "1",
					__v: 0,
					reOrderQuantity: 1,
					totalUnit: 12,
				},
				currentQty: 36,
				fromUnit: 1,
				toUnit: 1,
				totalUnit: 36,
				reOrderQuantity: 1,
				isDeleted: false,
				__v: 0,
			}
		},
	},
}
</script>
