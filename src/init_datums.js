import uuid from 'uuid/v4'
import moment from 'moment'
import Datum from './DatumClass'

export default [
	new Datum(uuid(), moment(Date.now()).subtract(20, 'hours').valueOf(), [
		{ name: 'caffeine (mg)', value: '100' },
		{ name: 'coffee'},
		{ name: '$', value: '-3.50' }
	]),
	new Datum(uuid(), moment(Date.now()).subtract(4, 'hours').valueOf(), [
		{ name: 'todo', value: 'dry cleaning'},
		{ name: 'done' },
	]),
	new Datum(uuid(), moment(Date.now()).subtract(9, 'hours').valueOf(), [
		{ name: 'habit', value: 'no snooze' },
		{ name: 'done' },
	]),
	new Datum(uuid(), moment(Date.now()).subtract(4.5, 'hours').valueOf(), [
		{ name: '$', value: '-23.57' },
		{ name: 'gas' },
		{ name: 'mpg', value: '29' }
	]),
	new Datum(uuid(), moment(Date.now()).subtract(19, 'hours').valueOf(), [
		{ name: 'todo', value: 'pay bills'},
	]),
	new Datum(uuid(), moment(Date.now()).subtract(9, 'hours').valueOf(), [
		{ name: 'daily', value: 'make bed'}
	]),
	new Datum(
		uuid(),
		moment(Date.now()).subtract(2, 'hours').valueOf(),
		[{ name: 'start', value: 'nap' }],
	),
	new Datum(
		uuid(),
		moment(Date.now()).subtract(1, 'hours').valueOf(),
		[{ name: 'stop', value: 'nap' }]
	),
	new Datum(
		uuid(),
		moment(Date.now()).subtract(20, 'hours').valueOf(),
		[{ name: 'habit', value: 'make bed' }],
	),
	new Datum(uuid(), moment(Date.now()).subtract(9 + 24, 'hours').valueOf(), [
		{ name: 'daily', value: 'make bed'}
	]),
	new Datum(uuid(), moment(Date.now()).subtract(15, 'hours').valueOf(), [
		{ name: 'start', value: 'meditate' },
		{ name: 'daily', value: 'meditate' }
	]),
	new Datum(uuid(), moment(Date.now()).subtract(14.5, 'hours').valueOf(), [
		{ name: 'stop', value: 'meditate'}
	]),

]