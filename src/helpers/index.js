import bootstrapMin from "bootstrap/dist/js/bootstrap.min"
import { DateTime } from "luxon"
import { read, utils, writeFileXLSX } from "xlsx"

const cusFormatDate = function (date) {
	let newDate = date
	let utcDateTime = DateTime.fromISO(newDate, { zone: "utc" })

	let myanmarTimezone = "Asia/Yangon"
	let localDateTimeInMyanmar = utcDateTime.setZone(myanmarTimezone)

	return localDateTimeInMyanmar.toString().split("T")[0]
	// return localDateTimeInMyanmar
}

const exportData = (data, fileName) => {
	const ws = utils.json_to_sheet(data)
	const wb = utils.book_new()

	const columnWidth = { wpx: 150 }

	Object.entries(data[0]).forEach(([key, value], index) => {
		ws["!cols"] = ws["!cols"] || []
		ws["!cols"][index] = columnWidth
	})

	console.log(Object.keys(data[0]).length)

	ws["!cols"][Object.keys(data[0]).length] = columnWidth

	utils.book_append_sheet(wb, ws, "Data")
	writeFileXLSX(wb, fileName)
}

const cusFormatTime = function (date) {
	let newDate = date
	// return newDate.split("T")[1].split(".")[0]
	let utcDateTime = DateTime.fromISO(newDate, { zone: "utc" })

	let myanmarTimezone = "Asia/Yangon"
	let localDateTimeInMyanmar = utcDateTime.setZone(myanmarTimezone)

	return localDateTimeInMyanmar.toString().split("T")[1].split(".")[0]
}

const cusFormatTimeAsDateTime = function (date) {
	let newDate = date
	// console.log(new Date(newDate).getMinutes())
	let minute =
		new Date(newDate).getMinutes().toString().length <= 1
			? `0${new Date(newDate).getMinutes()}`
			: new Date(newDate).getMinutes()
	return new Date(newDate).getHours() + ":" + minute
}

// const getImage = function (img, folder) {
// 	return "http://localhost:9000/static/cherry-k/" + img?.imgUrl
// }

const openPrint = function (id, styles = null) {
	let printContent = document.querySelector(`#${id}`).innerHTML
	let mywindow = window.open("", "PRINT", "height=1000,width=1200")
	mywindow.document.write("<html><head><title>" + document.title + "</title>")
	mywindow.document.write(`<style>${styles}</style>`)
	mywindow.document.write("</head><body >")
	mywindow.document.write(
		`<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">`
	)

	mywindow.document.write(printContent)
	mywindow.document.write(`<script>
            // Automatically trigger the print dialog
            window.onload = function () {
              window.print();
              window.onafterprint = function () {
                window.close();
              };
            };
          </script>`)
	mywindow.document.write("</body></html>")

	mywindow.document.close() // necessary for IE >= 10
	mywindow.focus() // necessary for IE >= 10*/

	mywindow.print()
}

const openDialog = function (id) {
	let modal = new bootstrapMin.Modal(document.querySelector(`#${id}`))
	modal.show()
}

const getImage = function (img) {
	const modifiedUrl = import.meta.env.VITE_BASE_URL.replace("/api/", "/")
	return `${modifiedUrl}static/cherry-k/` + img?.imgUrl
}

// just for visual date
const getToday = function () {
	let date = new Date()

	return `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`
}

// just for visual date
const formatDate = function (data) {
	let date = new Date(data)

	return `${date.getDate()} - ${date.getMonth() + 1} - ${date.getFullYear()}`
}

const dateForParams = date => {
	let newDate = new Date()
	if (date) {
		newDate = new Date(date)
	}

	// let month =
	// 	(new Date(date).getMonth() + 1).toString().length <= 1
	// 		? `0${new Date(date).getMonth() + 1}`
	// 		: new Date(date).getMonth() + 1

	// return `${date.getFullYear()}-${month}-${date.getDate()}`
	// return date.toUTCString()
	return newDate.toISOString()
}

const getTimestamp = function (date) {
	if (date) {
		return new Date(date).getTime()
	} else {
		return new Date().getTime()
	}
}

const requiredString = function (value) {
	if (value && value.trim().length > 0) {
		return true
	}
	return false
}

const showConfirmWithInput = async () => {
	return await Swal.fire({
		title: "Enter your code:",
		input: "text",
		inputAttributes: {
			autocapitalize: "off",
		},
		showCancelButton: true,
		confirmButtonText: "Submit",
		showLoaderOnConfirm: true,
		preConfirm: name => {
			// You can perform validation or any processing on the input here.
			// For example, you can check if the name is not empty.
			if (!name) {
				Swal.showValidationMessage("Please enter your code.")
			}
			return name
		},
		allowOutsideClick: () => !Swal.isLoading(),
	}).then(result => {
		// if (result.isConfirmed) {
		//   // User clicked "Submit"
		//   let name = result.value;
		//   // Do something with the name, e.g., display it in an alert
		//   Swal.fire(`Hello, ${name}!`);
		// }
		return result
	})
}

const formatNumber = number => {
	return number.toLocaleString("en-US")
}

export {
	requiredString,
	cusFormatDate,
	cusFormatTime,
	getToday,
	getTimestamp,
	getImage,
	formatDate,
	openPrint,
	cusFormatTimeAsDateTime,
	openDialog,
	dateForParams,
	exportData,
	showConfirmWithInput,
	formatNumber,
}
