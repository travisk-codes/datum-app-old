import moment from 'moment'
import uuid from 'uuid'
import { 
	convertDatumsToBlocks,
	convertDatumsToInstances,
	mapTimeToPixel,
	hourMarkPositions,
	dayMarks,
	insertIntervalsBetween,
} from './Timeline'
import Datum from '../DatumClass'

it('converts start/stop datums into element heights', () => {
	let datums, blocks
	function test() {
		expect(convertDatumsToBlocks(datums)).toEqual(blocks)
	}

	datums = [
		new Datum(0, moment(Date.now()).subtract(1, 'minute').valueOf(), [
			{ name: 'bleh' }
		]),
		new Datum(1, moment(Date.now()).valueOf(), [
			{ name: 'start', value: 'a' }
		]),
		new Datum(2, moment(Date.now()).add(1, 'minute').valueOf(), [
			{ name: 'stop', value: 'a' }
		]),
	]	
	blocks = [
		{
			name: '',
			height: NaN,
		},
		{
			name: '',
			height: 1,
		},
		{
			name: 'a',
			height: 1
		}
	]
	test()
})

it('converts non-start/stop datums into instance lines', () => {
	let datums, line_positions
	function test() {
		expect(convertDatumsToInstances(datums)).toEqual(line_positions)
	}

	datums = [
		new Datum(uuid(), moment(Date.now()).valueOf(), [
			{ name: 'caffeine (mg)', value: '100' },
			{ name: 'coffee'},
			{ name: '$', value: '-3.50' }
		]),
		new Datum(uuid(), moment(Date.now()).add(1, 'hours').valueOf(), [
			{ name: 'todo', value: 'dry cleaning'},
			{ name: 'done' },
		]),
		new Datum(uuid(), moment(Date.now()).add(2, 'hours').valueOf(), [
			{ name: 'habit', value: 'no snooze' },
			{ name: 'done' },
		]),
		new Datum(uuid(), moment(Date.now()).add(4, 'hours').valueOf(), [
			{ name: '$', value: '-23.57' },
			{ name: 'gas' },
			{ name: 'mpg', value: '29' }
		]),
		new Datum(uuid(), moment(Date.now()).add(5, 'hours').valueOf(), [
			{ name: 'todo', value: 'pay bills'},
		]),
	]
	line_positions = [
		{
			position: 0,
			label: 'caffeine (mg): 100, coffee, $: -3.50',
		},
		{
			position: 60,
			label: 'todo: dry cleaning, done',
		},
		{
			position: 120,
			label: 'habit: no snooze, done',
		},
		{
			position: 240,
			label: '$: -23.57, gas, mpg: 29',
		},
		{
			position: 300,
			label: 'todo: pay bills',
		}
	]
	test()
})

it('places lines at every hour', () => {
let start_time, end_time, hour_marks
function test() {
	expect(hourMarkPositions(start_time, end_time)).toEqual(hour_marks)
}

start_time = moment('2000-01-01 00:50').valueOf()
end_time = moment('2000-01-01 03:10').valueOf()
hour_marks = [
	10,
	70,
	130,
]
test()

})

it('places lines and dates at every day', () => {
	let start_time, end_time, day_marks
	function test() {
		expect(dayMarks(start_time, end_time)).toEqual(day_marks)
	}

	start_time = moment('2000-01-01 23:50').valueOf()
	end_time = moment('2000-01-04 00:10').valueOf()
	day_marks = [
		{
			position: 10,
			label: '1/2',
		},
		{
			position: 10 + 60 * 24,
			label: '1/3',
		},
		{
			position: 10 + 60 * 24 * 2,
			label: '1/4',
		}
	]
	test()
})

it ('maps a time to a pixel height', () => {
	let some_point_in_time, relative_to_starting_time, pixel_position
	function test() {
		expect(
			mapTimeToPixel(some_point_in_time, relative_to_starting_time
		)).toBe(pixel_position)
	}

	some_point_in_time = moment(Date.now()).valueOf()
	relative_to_starting_time = moment(Date.now())
		.subtract(1, 'hour')
		.valueOf()
	pixel_position = 60
	test()

	some_point_in_time = moment(Date.now()).valueOf()
	relative_to_starting_time = moment(Date.now())
		.subtract(1, 'minute')
		.valueOf()
	pixel_position = 1
	test()
})

it('calculates intervals between datums', () => {
	let datums, datums_with_intervals, start_time, end_time
	function test() {
		expect(insertIntervalsBetween(datums))
			.toEqual(datums_with_intervals)
	}
	
	let now = moment('2000-01-01 00:00')
	function nowPlus(minutes) {
		return now.add(minutes, 'minutes').valueOf()
	}

	datums = [
		{
			id: 0,
			time: moment('2000-01-01 00:00').add(0, 'minute').valueOf(),
			tags: [{name: 'a'}]
		},
		{
			id: 1,
			time: moment('2000-01-01 00:00').add(1, 'minute').valueOf(),
			tags: [{name: 'b'}]
		},
		{
			id: 2,
			time: moment('2000-01-01 00:00').add(2, 'minutes').valueOf(),
			tags: [{name: 'c'}]
		},
	]
	datums_with_intervals = [
		{
			id: 0,
			time: moment('2000-01-01 00:00').add(0, 'minute').valueOf(),
			tags: [{name: 'a'}]
		},
		{
			after: [{name: 'a'}],
			before: [{name: 'b'}],
			duration: 60 * 1000
		},
		{
			id: 1,
			time: moment('2000-01-01 00:00').add(1, 'minute').valueOf(),
			tags: [{name: 'b'}]
		},
		{
			after: [{name: 'b'}],
			before: [{name: 'c'}],
			duration: 60 * 1000,
		},
		{
			id: 2,
			time: moment('2000-01-01 00:00').add(2, 'minute').valueOf(),
			tags: [{name: 'c'}]
		},
	]
	test()
})