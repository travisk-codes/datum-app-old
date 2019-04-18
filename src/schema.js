export const datum_schema = {
	title: 'Datum structure schema',
	description: 'The fundamental unit of data',
	version: 0,
	type: 'object',
	properties: {
		id: {
			type: 'string',
			primary: true,
		},
		time: {
			type: 'integer',
			index: true,
		},
		tags: {
			type: 'array',
			items: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
					},
					value: {
						type: 'string',
					},
				},
				required: ['name']
			},
			minItems: 1,
			uniqueItems: true,
		}
	},
	required: ['id', 'time', 'tags']
}