import moment from 'moment'
import { getDate } from './Habits'

it('converts relative dates to absolute', () => {
	let days_ago, from_date, result
	function test() {
		expect(
			getDate(days_ago, from_date)
		).toBe(result)	
	}

	days_ago = 1
	from_date = Date.now()
	result = moment(from_date).subtract(days_ago, 'days').valueOf()
	test()

	days_ago = -1
	test()
})