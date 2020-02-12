import moment from 'moment'
import uuid from 'uuid'
import { 
	convertDatumsToBlocks,
	convertDatumsToInstances,
} from './Timeline'
import Datum from '../DatumClass'

it('converts start/stop datums into element heights', () => {
	let datums, blocks
	function test() {
		expect(convertDatumsToBlocks(datums)).toEqual(blocks)
	}

	datums = [
		new Datum(1, moment(Date.now()).valueOf(), [
			{ name: 'start', value: 'a' }
		]),
		new Datum(2, moment(Date.now()).add(1, 'minute').valueOf(), [
			{ name: 'stop', value: 'a' }
		]),
	]	
	blocks = [
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
		0,
		60,
		120,
		240,
		300,
	]
	test()
})