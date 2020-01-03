import uuid from 'uuid/v4'
import Datum from '../DatumClass'

export function datums_to_csv(datums) {
	let csv_string = ''
	let csv_headers = new Set()

	datums.forEach(datum => {
		datum.tags.forEach(tag => {
			if (!csv_headers.has(tag.name)) csv_headers.add(tag.name.trim())
		})
	})

<<<<<<< HEAD
	csv_headers = [...csv_headers] // convert set to array
=======
	csv_headers = [...csv_headers] // converts set to array
>>>>>>> 1bbe016... fixes inexplicable csv export bug by using set instead of array
	csv_headers.sort()
	csv_headers.unshift('_id', '_time')
	csv_string += csv_headers.toString() + '\n'

	datums.forEach(datum => {
		csv_string += datum.id + ',' + datum.time + ',' // _id and _time columns
		let tag_obj = {}
		datum.tags.forEach(tag => {
			tag_obj[tag.name] = tag.value || true
		})
		csv_headers.forEach((header, i) => {
			if (i > 1) { // skip first two headers
				if (tag_obj[header]) csv_string += tag_obj[header]
				csv_string += ','
			}
		})
		csv_string = csv_string.slice(0, -1) + '\n' // pop last comma
	})

	return csv_string
}

export function csv_to_datums(csv_string) {
	let datums = []
	csv_string = csv_string.replace(/%0A/g, '\n')
	const rows = csv_string.split('\n') // filereader encoding or something
	rows.pop() // last row empty
	const tag_names = rows[0].split(',')
	for (let i = 1; i < rows.length; i++) { // skip headers
		const row = rows[i].split(',')
		let datum = new Datum(
			row[0] || uuid(),
			Date.parse(row[1]) || Date.now(),
			[],
		)

		for (let j = 2; j < row.length; j++) { // skip id & time
			// newline at end of row has length 1, catch with charcode
			if (row[j].length && row[j].charCodeAt(0) !== 13) datum.tags.push({
				name: tag_names[j],
				value: row[j] === 'true' ? '' : row[j]
			})
		}
		datums.push(datum)
	}
	return datums
}

/*
(proposal)
a datum has visible and hidden tags
a user can see and change visible tags
*/