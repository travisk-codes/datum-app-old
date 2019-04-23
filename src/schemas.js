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
				required: ['name'],
			},
			minItems: 1,
			uniqueItems: true,
		},
	},
	required: ['id', 'time', 'tags'],
}

export const tag_schema = {
	title: 'tag metadata schema',
	description:
		'holds tag-specific data not contained in datums e.g. color',
	version: 0,
	type: 'object',
	properties: {
		name: {
			type: 'string',
			primary: true,
		},
		id: {
			type: 'string',
			index: true,
		},
		color: {
			type: 'string',
		},
		instance_times: {
			type: 'array',
			uniqueItems: false, // a:1 b:1 b:2 <- same times
			items: {
				type: 'integer',
				final: true,
			},
		},
		instance_peers: {
			type: 'array',
			uniqueItems: false,
			items: {
				type: 'array',
				uniqueItems: false,
				items: {
					type: 'object',
					final: false,
					properties: {
						name: {
							type: 'string',
						},
						value: {
							type: 'string',
						}
					},
				},
			},
		},
		instance_values: {
			type: 'array',
			uniqueItems: false,
			items: {
				type: 'string',
				final: false,
			},
		},
	},
	required: [
		'id',
		'color',
		'instance_times',
		'instance_peers',
		'instance_values',
	],
}
