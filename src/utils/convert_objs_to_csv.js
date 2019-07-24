export default function convert_objs_to_csv(arr_of_objs) {
	let csv_string = ''
	let headers = []

	arr_of_objs.forEach(obj => {
		for (const [key, _] of Object.entries(obj)) {
			if (!headers.includes(key)) headers.push(key)
		}
	})

	headers.sort()
	csv_string += headers.toString() + '\n'

	arr_of_objs.forEach(obj => {
		const datum_tags = Object.keys(obj)
		headers.forEach(tag_name => {
			if (datum_tags.includes(tag_name)) csv_string += obj[tag_name]
			csv_string += ','
		})
		csv_string = csv_string.slice(0, -1) + '\n' // pop last comma
	})

	return csv_string
}
