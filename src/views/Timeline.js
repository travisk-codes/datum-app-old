import React, { useEffect } from 'react';
import moment from 'moment'
import { makeStyles } from '@material-ui/core/styles';
//import Table from '@material-ui/core/Table';
//import TableBody from '@material-ui/core/TableBody';
//import TableCell from '@material-ui/core/TableCell';
//import TableContainer from '@material-ui/core/TableContainer';
//import TableHead from '@material-ui/core/TableHead';
//import TableRow from '@material-ui/core/TableRow';
//import Paper from '@material-ui/core/Paper';
//import Checkbox from '@material-ui/core/Checkbox'
import TextField from '@material-ui/core/TextField'

import MenuIcon from '@material-ui/icons/AmpStoriesRounded'
//import LinkIcon from '@material-ui/icons/LinkRounded'
//import GradeIcon from '@material-ui/icons/GradeRounded'
import Fab from '@material-ui/core/Fab'
//import Datum from '../DatumClass'
//import moment from 'moment'
//import uuid from 'uuid';

const useStyles = makeStyles({
	container: {
		position: 'fixed',
		top: 60,
		left: 0,
		right: 0,
		bottom: 60,
		overflowY: 'auto',
		overflowX: 'hidden',
	},
	innerContainer: {
		paddingTop: 20,
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
	},
	timelineBlock: {
		position: 'relative',
		display: 'flex',
		width: '50%',
		backgroundColor: 'salmon',
		color: 'white',
		borderRadius: '.33em',
		paddingLeft: '0.25em',
	},
	timelineInstant: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		position: 'absolute',
		width: '100%',
		borderBottom: '1px dashed grey',
	},
	instanceLabel: {
		backgroundColor: '#fafafa',
		paddingLeft: '0.33em',
		paddingRight: '0.33em',
		borderBottom: '1px solid #fafafa',
		marginBottom: '-1px',
		lineHeight: '7px',
	},
	hourMark: {
		display: 'flex',
		position: 'absolute',
		width: '100%',
		borderBottom: '1px dotted lightgrey',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		color: 'lightgrey',
		paddingLeft: '.33em',
	},
	dayMark: {
		display: 'flex',
		position: 'absolute',
		width: '100%',
		borderBottom: '1px solid lightgrey',
		justifyContent: 'flex-start',
		alignItems: 'flex-end',
		color: 'grey',
		paddingLeft: '.33em',
	},
	todoBar: {
		display: 'inline-flex',
		position: 'fixed',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch',
		left: 0,
		right: 0,
		bottom: 0,
		height: 56,
		boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.2)',
		paddingLeft: 6,
		paddingRight: 56,
		backgroundColor: 'whitesmoke'
	},
	todoTextField: {
		display: 'flex',
		alignItems: 'stretch',
	},
	fab: {
		position: 'fixed',
		right: 8,
		bottom: 8,
	},
})

export function msToMin(interval) {
	return Math.round(interval / 1000 / 60)
}

export function convertDatumsToBlocks(datums, time_of_first_datum) {
	let heights = []
	let lastTime = time_of_first_datum
	let name = ''
	if (datums === undefined) return heights
	datums.forEach(datum => {
		if (datum.hasTag('stop')) {
			name = datum.getValue('stop')
		} else {
			name = ''
		}
		if (lastTime === 0) {
			lastTime = datum.time
		} else {
			const height = Math.round( // dealing with ms
				(datum.time - lastTime) / 1000 / 60
			)
			heights.push({height, name})
			lastTime = datum.time
		}
	})
	return heights
}

export function convertDatumsToInstances(datums) {
	if (datums.length <= 1) return [0]
	// filter out start/stop datums
	datums = datums.filter(d => !d.hasTag('start') || !d.hasTag('stop'))
	// save the datetime of first datum
	const time_of_first_datum = datums[0].time
	// add to array difference between datum and first dt
	let instance_heights = [{position: 0, label: datums[0].stringifyTags()}]
	datums.shift()
	datums.forEach(datum => {
		if (datum.hasTag('start') || datum.hasTag('stop')) return
		const difference = Math.round((datum.time - time_of_first_datum) / 1000 / 60)
		instance_heights.push({
			position: difference,
			label: datum.stringifyTags(),
			time: moment(datum.time).format('HH:mm')
		})
	})
	return instance_heights
}

export function mapTimeToPixel(time, relative_start_time) {
	let time_difference = time - relative_start_time
	let pixel_position = Math.round(time_difference / 1000 / 60)
	return pixel_position
}

export function hourMarkPositions(start_time, end_time) {
	let hour_mark_positions = []
	let total_pixel_count = mapTimeToPixel(end_time, start_time)
	let minute_of_start_time = moment(start_time).minute()
	let hour_of_start_time = moment(start_time).hour()
	let first_hour_starting_position = 60 - minute_of_start_time
	for (let i = first_hour_starting_position; i < total_pixel_count; i += 60) {
		hour_of_start_time += 1
		let hour_of_day = hour_of_start_time % 24
		if (hour_of_day < 10) hour_of_day = '0' + hour_of_day
		hour_mark_positions.push({
			position: i,
			label: hour_of_day
		})
	}

	return hour_mark_positions
}

export function insertIntervalsBetween(datums) {
	let previous_datum = datums.shift()
	let datums_and_intervals = [ previous_datum ]
	datums.forEach((d, i) => {
		if (i + 1 === datums.length) return
		datums_and_intervals.push({
			after: previous_datum.tags,
			before: d.tags,
			duration: d.time - previous_datum.time
		})
		datums_and_intervals.push(d)
		previous_datum = d
	})
	return datums_and_intervals
}

function monthAndDayOf(unix_time) {
	let month = moment(unix_time).month() + 1
	let date = moment(unix_time).date()
	return month + '/' + date
}

/**
 * Given an interval of time, returns the position of day
 * marks and a label with that day's date
 * @param {number} start_time unix time in ms
 * @param {number} end_time unix time in ms
 * @return {object[]} label-position pairs
 */
export function dayMarks(start_time, end_time) {
	let day_positions_and_labels = []
	let minutes_until_next_day = msToMin(
		moment(start_time).endOf('day') - moment(start_time)
	)
	for (let i = minutes_until_next_day; i < msToMin(end_time - start_time); i += 60 * 24) {
		day_positions_and_labels.push({
			position: i,
			label: monthAndDayOf(start_time + i * 60 * 1000)
		})
	}
	
	
	// keep adding days until end_time is exceeded
	return day_positions_and_labels
}

// https://stackoverflow.com/a/16348977
function stringToColor(str) {
	let hash = 0
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash)
	}
	let color = '#'
	for (let i = 0; i < 3; i++) {
		let value = (hash >> (i * 8)) & 0xFF
		color += ('00' + value.toString(16)).substr(-2)
	}
	return color
}

export default function Timeline(props) {
	const classes = useStyles()
	const endRef = React.useRef(null)

	function scrollToEnd() {
		endRef.current.scrollIntoView()
	}

	useEffect(scrollToEnd)

	const app_btn = (
		<div className={classes.todoBar}>
			<form onSubmit={e => console.log('ayy')}>
				<TextField 
					className={classes.todoTextField} 
					onChange={e => console.log(e.target.value)}
					value={'Test'}
					label='Habit' 
					placeholder='New Habit' 
					variant='outlined' 
					size='small' 
					color='secondary'
				/>
			</form>
			<Fab
				onClick={props.onButtonLongPress}
				onContextMenu={props.onButtonLongPress} // capture long press & right click
				onDoubleClick={props.onButtonLongPress}
				className={classes.fab}
				color='primary'
				size='small'
			>
				<MenuIcon />
			</Fab>
		</div>
	)

	const time_of_first_datum = props.datums[0] ? props.datums[0].time : 0
	const last_datum = props.datums[props.datums.length - 1] || 0
  return (
		<div className={classes.container}>
			<div className={classes.innerContainer}>
				{hourMarkPositions(time_of_first_datum, last_datum.time).map(tick => (
					<div className={classes.hourMark}
						key={tick.position}
						style={{height: tick.position}}
					>{tick.label}</div>			
				))}
				{dayMarks(time_of_first_datum, last_datum.time).map(tick => (
					<div className={classes.dayMark}
						key={tick.position}
						style={{height: tick.position}}
					><span style={{backgroundColor: '#fafafa'}}>{tick.label}</span></div>
				))}
				{convertDatumsToInstances(props.datums).map((instance, i) => (
					<div className={classes.timelineInstant}
						key={i}
						style={{height: instance.position}}>
						<span className={classes.instanceLabel}>{instance.time}</span>
						<span className={classes.instanceLabel}>{instance.label}</span>
					</div>
				))}
				{convertDatumsToBlocks(props.items, time_of_first_datum).map(({name, height}, i) => (
					<div className={classes.timelineBlock} 
						key={i}
						style={{height, backgroundColor: name === '' ? 'rgba(0,0,0,0)' : stringToColor(name)}}>
							{name}
						</div>
				))}
			<div ref={endRef} />
			</div>
			{app_btn}
		</div>
  );
}
