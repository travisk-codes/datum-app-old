import uuid from 'uuid/v4'
import Datum from './DatumClass'

export default [
	new Datum(uuid(), Date.now(), [
		{ name: 'caffeine (mg)', value: '100' },
		{ name: 'coffee'},
		{ name: '$', value: '-3.50' }
	]),
	new Datum(uuid(), Date.now() + 1, [
		{ name: 'todo', value: 'dry cleaning'},
		{ name: 'done', value: '' },
	]),
	new Datum(uuid(), Date.now() + 2, [
		{ name: 'habit', value: 'no snooze' },
		{ name: 'done' },
	]),
	new Datum(uuid(), Date.now() + 3, [
		{ name: '$', value: '-23.57' },
		{ name: 'gas' },
		{ name: 'mpg', value: '29' }
	]),
	new Datum(uuid(), Date.now() + 4, [
		{ name: 'todo', value: 'pay bills'},
	]),
]