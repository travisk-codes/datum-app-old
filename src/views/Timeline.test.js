import moment from 'moment'
import { 
	convertDatumsToHeights,
} from './Timeline'
import Datum from '../DatumClass'

it('converts start/stop datums into element heights', () => {
	let datums, heights
	function test() {
		expect(convertDatumsToHeights(datums)).toEqual(heights)
	}

	datums = [
		{
			time: moment(Date.now()).valueOf(),
			tags: [
				{
					name: 'start',
					value: 'a',
				}
			]
		},
		{
			time: moment(Date.now()).add(1, 'second').valueOf(),
			tags: [
				{
					name: 'stop',
					value: 'a',
				}
			]
		}
	]	
	heights = [
		1
	]
	test()
})
