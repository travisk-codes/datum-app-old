// thank you Timur! https://stackoverflow.com/a/23352499
export default function timestamp(unix_time) {
	const now = new Date()
	const then = new Date(unix_time)
	const interval_in_seconds = (now.getTime() - then.getTime()) / 1000

	if (interval_in_seconds < 60) {
		return parseInt(interval_in_seconds) + 's'
	}
	if (interval_in_seconds < 3600) {
		return parseInt(interval_in_seconds/60) + 'm'
	}
	if (interval_in_seconds <= 86400) {
		return parseInt(interval_in_seconds/3600) + 'h'
	}
	if (interval_in_seconds > 86400) {
			const day = then.getDate();
			const month = then.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","")
			const year = then.getFullYear() == now.getFullYear() ? "" : " " + then.getFullYear()
			return day + " " + month + year
	}
}