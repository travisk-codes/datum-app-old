import uuid from 'uuid/v4'

export function datums_to_csv(datums) {
	let csv_string = ''
	let csv_headers = []

	datums.forEach(datum => {
		datum.tags.forEach(tag => {
			if (!csv_headers.includes(tag.name)) csv_headers.push(tag.name)
		})
	})

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
		let datum = {
			id: row[0] || uuid(),
			time: row[1] || Date.now(),
			tags: []
		}
		for (let j = 2; j < row.length; j++) { // skip id & time
			if (row[j].length) datum.tags.push({
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