import uuid from 'uuid/v4'

export default [
	{
		id: uuid(),
		time: Date.now(),
		tags: [
			{ name: 'caffeine (mg)', value: '100' },
			{ name: 'coffee'},
			{ name: '$', value: '-3.50' }
		]
	},
	{
		id: uuid(),
		time: Date.now() + 1,
		tags: [
			{ name: 'habit', value: 'no snooze' },
			{ name: 'done', value: '✓'},
		]
	},
	{
		id: uuid(),
		time: Date.now() + 2,
		tags: [
			{ name: '$', value: '-23.57' },
			{ name: 'gas' },
			{ name: 'mpg', value: '29' }
		]
	}
]