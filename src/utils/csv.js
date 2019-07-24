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
	
}

/*
(proposal)
a datum has visible and hidden tags
a user can see and change visible tags
*/